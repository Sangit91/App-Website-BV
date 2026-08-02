/**
 * MIGRATION TOOL — Nhập dữ liệu thầu từ web cũ (Excel + file upload) sang hệ thống BVĐK.
 *
 * Tính năng:
 *  - Đọc `Data Migration/thongtinthau.xlsx` (sheet Sheet1).
 *  - Map phòng ban (ngữ nghĩa web cũ) sang id phòng ban của hệ thống mới.
 *  - Copy file hồ sơ thầu (PDF/doc...) từ `Data Migration/upload/<rel>` vào `public/tenders/<slug>/<filename>`.
 *  - Upsert bảng `news` (idempotent theo slug): tạo mới / bỏ qua nếu đã tồn tại.
 *  - Chạy lại nhiều lần không trùng dữ liệu.
 *
 * Yêu cầu chạy TRONG container có mount full repo + DATABASE_URL trỏ container db (db:5432):
 *   docker exec -it bvdh-frontend sh -c 'cd /app && npm i --no-save xlsx >/dev/null && NODE_ENV=development node scripts/migrate-legacy-tenders.mjs'
 *
 * Kết nối DB qua PostgreSQL (pg) — dùng DATABASE_URL của môi trường; mặc định container db.
 */
import { readFileSync, existsSync, mkdirSync, copyFileSync, statSync } from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const { Pool } = require("pg");

const ROOT = process.cwd(); // /app (container mount full repo)
const DATA_DIR = path.join(ROOT, "Data Migration");
const EXCEL_PATH = path.join(DATA_DIR, "thongtinthau.xlsx");
const UPLOAD_DIR = path.join(DATA_DIR, "upload");
const PUBLIC_TENDERS_DIR = path.join(ROOT, "public", "tenders");

const DATABASE_URL =
  process.env["DATABASE_URL"] ||
  "postgresql://postgres:devpass@db:5432/bvdh_db?schema=public";

// ==== MAP PHÒNG BAN: ngữ nghĩa excel cũ → id phòng ban trong hệ thống mới ====
// (id trùng bộ DEPARTMENTS dùng trên /thong-tin-thau + TenderTab)
const DEPT_ALIASES = {
  "CNTT": "PHÒNG CNTT",
  "PHÒNG CNTT": "PHÒNG CNTT",
  "VTYT": "PHÒNG VTTBYT",
  "TBYT": "PHÒNG VTTBYT",
  "VẬT TƯ THIẾT BỊ Y TẾ": "PHÒNG VTTBYT",
  "PHÒNG VTTBYT": "PHÒNG VTTBYT",
  "Dược": "DƯỢC",
  "DƯỢC": "DƯỢC",
  "Khoa Dược": "DƯỢC",
  "Phòng HCQT": "PHÒNG HCQT",
  "HCQT": "PHÒNG HCQT",
  "PHÒNG HCQT": "PHÒNG HCQT",
};

// Ảnh placeholder theo phòng ban (cùng pattern DEPT_META hiện tại)
const DEPT_IMAGE = {
  "PHÒNG CNTT": "/images/tenders/cntt.jpeg",
  "PHÒNG VTTBYT": "/images/tenders/vttbyt.jpeg",
  "DƯỢC": "/images/tenders/duoc.jpeg",
  "PHÒNG HC"  : "/images/tenders/hcqt.jpeg",
};

const normalizeSlug = (t) =>
  t.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "tender";

const parseExcelDate = (src) => {
  if (!src) return null;
  if (typeof src === "number") return new Date(Math.round((src - 25569) * 86400 * 1000));
  return new Date(src);
};

class Migrator {
  constructor() {
    this.pool = new Pool({ connectionString: DATABASE_URL });
  }

  resolveUploadPath(rel) {
    if (!rel) return null;
    // rel dạng "./upload/2024/05/13/1715563131THÔNG BÁO...pdf"
    const clean = rel.replace(/^\.\//, "").replace(/^\/+/, "");
    return path.join(DATA_DIR, clean);
  }

  copyTenderFile(slug, srcFull) {
    if (!srcFull || !existsSync(srcFull) || !statSync(srcFull).isFile()) return null;
    const dir = path.join(PUBLIC_TENDERS_DIR, slug);
    mkdirSync(dir, { recursive: true });
    const base = path.basename(srcFull);
    const dest = path.join(dir, base);
    copyFileSync(srcFull, dest);
    const sizeKb = Math.round(statSync(dest).size / 1024);
    return {
      name: base,
      size: `${sizeKb} KB`,
      url: `/tenders/${slug}/${base}`,
      fileType: path.extname(base).slice(1).toLowerCase(),
    };
  }

  async upsertNews(row) {
    const title = String(row["tieu_de"] || "").trim();
    if (!title) return { status: "empty-title" };

    const rawDept = String(row["ten_phong_ban"] || "").trim();
    const deptId = DEPT_ALIASES[rawDept] || rawDept; // giữ nguyên nếu không có alias
    const date = parseExcelDate(row["ngay_gio_hien_thi_web"]);

    // slug = chuỗi chuẩn từ timestamp+id_bai_viet (đảm bảo duy nhất, idempotent)
    const idBaiViet = String(row["id_bai_viet_cu"] || row["STT"] || "").trim();
    const slug = `${normalizeSlug(row["tieu_de"])}-${idBaiViet || ""}`;

    // file hồ sơ thầu
    const src = this.resolveUploadPath(row["duong_dan_file_pdf_dinh_kem"]);
    const tenderFile = src ? this.copyTenderFile(slug, src) : null;

    const existing = await this.pool.query(`SELECT id FROM news WHERE slug = $1`, [slug]);
    if (existing.rowCount > 0) return { status: "skip-existing", slug };

    await this.pool.query(
      `INSERT INTO news
        (id, title, slug, summary, category, content, author, image, is_featured, is_tender,
         tender_number, tender_start_date, tender_end_date, tender_method, tender_estimate,
         tender_received_location, tender_dept, tender_file, download_count, is_active, published_at, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,NOW(),NOW())
       ON CONFLICT (slug) DO NOTHING`,
      [
        crypto.randomUUID(),
        title,
        slug,
        row["mo_ta"] ? String(row["mo_ta"]).substring(0, 400) : `Thông báo đấu thầu: ${title}`,
        "Thông báo",
        null,
        "Ban Biên Tập",
        DEPT_IMAGE[deptId] || "/images/pages/chiphi-1.jpeg",
        false,
        true,
        String(row["so_hieu_thau"] || row["id_bai_viet_cu"] || "") || null,
        date || new Date(),
        date || new Date(), // excel không có hạn chót → hạn = ngày đăng
        null,
        null,
        null,
        deptId,
        tenderFile ? JSON.stringify(tenderFile) : null,
        0,
        1,
        date || new Date(),
      ]
    );
    return { status: "insert", slug };
  }

  async run() {
    if (!existsSync(EXCEL_PATH)) throw new Error(`Excel not found: ${EXCEL_PATH}`);
    const wb = XLSX.readFile(EXCEL_PATH);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

    let created = 0, skipped = 0, missingFile = 0, emptyTitle = 0;
    const summary = [];

    for (const row of rows) {
      const r = await this.upsertNews(row);
      if (r.status === "insert") created++;
      else if (r.status === "skip-existing") { skipped++; if (r.slug) summary.push(`skip: ${r.slug}`); }
      else if (r.status === "missing-file") missingFile++;
      else if (r.status === "empty-title") emptyTitle++;
    }

    console.log(`\n=== XONG ===`);
    console.log(`Tổng: ${rows.length} | Tạo mới: ${created} | Bỏ qua (đã có): ${skipped} | Thiếu file: ${missingFile} | Tiêu đề rỗng: ${emptyTitle}`);
  }

  async close() { await this.pool.end(); }
}

new Migrator().run().then(() => {}).catch((e) => console.error(e));