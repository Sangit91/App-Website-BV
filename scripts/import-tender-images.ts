/**
 * DOWNLOAD TENDER THEME IMAGES — Wikimedia Commons (miễn phí, no API key)
 *
 * 1. Phân nhóm tiêu đề thầu (excel) → chủ đề.
 * 2. Mỗi chủ đề search Wikimedia → thumburl 960px, tải về public/images/tenders/<theme>.jpg
 *    (có delay + retry để tránh Wikimedia rate-limit).
 * 3. UPDATE news.image theo slug theo bảng <theme -> [slugs]> (truy vấn 1 lần).
 *
 * Chạy trong container frontend:
 *   docker exec bvdh-frontend sh -c "cd /app && npm i --no-save xlsx && node scripts/import-tender-images.ts"
 */
import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import https from "node:https";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");
const { Pool } = require("pg");

const ROOT = process.cwd();
const EXCEL_PATH = path.join(ROOT, "Data Migration", "thongtinthau.xlsx");
const OUT_DIR = path.join(ROOT, "public", "images", "tenders");
const DATABASE_URL =
  process.env["DATABASE_URL"] || "postgresql://postgres:devpass@db:5432/bvdh_db?schema=public";

const UA = "BVDK-website/1.0 (dev; localhost)";
const RETRY_DELAY_MS = 4000;
const BETWEEN_THEMES_MS = 3000;

// chủ đề -> thứ tự từ khóa tìm ảnh Wikimedia (thử lần lượt)
const THEMES: Record<string, string[]> = {
  "medicine-vial": ["medicine pills", "pharmacist"],
  "laboratory": ["laboratory test tubes", "chemistry laboratory", "urinalysis laboratory"],
  "medical-equip": ["surgery operating room", "MRI scanner", "hospital equipment"],
  "camera-network": ["surveillance camera", "network server rack"],
  "software-it": ["computer programming code", "laptop office"],
  "computer-office": ["office desk computer", "printer office"],
  "ppe-consumable": ["surgical gloves", "medical syringe"],
  "elevator-facility": ["hospital corridor", "fire extinguisher wall"],
  "cleaning-service": ["building cleaning", "disinfection hospital"],
  "document-legal": ["contract signing", "paperwork document"],
  "transport-vehicle": ["ambulance van", "medical car"],
  "general-tender": ["meeting room conference", "office building"],
};

// Fallback map khi Wikimedia rate-limit — dùng ảnh chuyên đề đã có sẵn trong public/images/tenders/
const FALLBACK: Record<string, string> = {
  "medicine-vial": "/images/tenders/medicine-vial.jpg",
  "ppe-consumable": "/images/tenders/ppe-consumable.jpg",
  "computer-office": "/images/tenders/computer-office.jpg",
  "software-it": "/images/tenders/software-it.jpg",
  "laboratory": "/images/tenders/lab-microscope.jpg",
  "medical-equip": "/images/tenders/medical-equipment.jpg",
  "camera-network": "/images/tenders/network-cables.jpg",
  "elevator-facility": "/images/tenders/hospital-bed.jpg",
  "cleaning-service": "/images/tenders/office-cleaning.jpg",
  "document-legal": "/images/tenders/documents.jpg",
  "transport-vehicle": "/images/tenders/surgery.jpg",
  "general-tender": "/images/tenders/surgery.jpg",
};

// chủ đề -> từ khóa trong tiêu đề bài thầu
const RULES: Record<string, string[]> = {
  "medicine-vial": ["thuốc", "dược", "vắc xin", "vắcxin", "tiêm chủng", "đông dược", "generic"],
  "laboratory":   ["hóa chất", "thuốc thử", "xét nghiệm", "sinh hóa", "hóa sinh", "vi sinh", "huyết học", "đông máu", "reagent", "cận lâm sàng", "pipet", "ống nghiệm"],
  "medical-equip": ["thiết bị y tế", "siêu âm", "x-quang", "cộng hưởng", "nội soi", "phẫu thuật", "máy thở", "bàn mổ", "huyết áp", "máy mổ"],
  "software-it": ["phần mềm", "hrm", "erp", "his", "ris", "pacs", "hệ thống quản lý", "chữ ký số"],
  "camera-network": ["camera", "mạng lan", "wifi", "tường lửa", "bộ lưu điện", "ups", "server"],
  "computer-office": ["máy tính", "máy in", "văn phòng phẩm", "toner", "giấy", "máy fax", "photocopy", "nội thất", "bàn ghế", "máy chiếu"],
  "ppe-consumable": ["găng tay", "khẩu trang", "kim tiêm", "bơm tiêm", "ống tiêm", "băng gạc", "bông y tế", "vật tư tiêu hao", "phim"],
  "elevator-facility": ["thang máy", "pccc", "phòng cháy", "chữa cháy", "bình chữa", "điều hòa", "máy lạnh", "hệ thống điện", "điện tử", "hệ thống khí", "ô xy", "ống dẫn khí"],
  "cleaning-service": ["vệ sinh", "làm sạch", "khử khuẩn", "thu gom rác"],
  "document-legal": ["kiểm toán", "thẩm định", "tư vấn", "báo giá", "đấu thầu", "hồ sơ", "kiểm định", "đăng ký", "in ấn"],
  "transport-vehicle": ["cứu thương", "vận chuyển", "xe chở", "xe cứu thương"],
  "general-tender": [],
};

function classifyTheme(title: string): string {
  const t = String(title || "").toLowerCase();
  for (const [theme, kws] of Object.entries(RULES)) {
    if (kws.some((k) => t.includes(k))) return theme;
  }
  return "general-tender";
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function searchThumb(keyword: string): Promise<string | null> {
  return new Promise((resolve) => {
    const u = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      keyword
    )}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&iiurlwidth=960&format=json`;
    https
      .get(u, { headers: { "User-Agent": UA } }, (r) => {
        let d = "";
        r.on("data", (c) => (d += c));
        r.on("end", () => {
          try {
            const j = JSON.parse(d);
            const p = j.query?.pages || {};
            for (const k in p) {
              const ii = p[k].imageinfo?.[0];
              if (ii?.thumburl) return resolve(ii.thumburl as string);
            }
            resolve(null);
          } catch {
            resolve(null);
          }
        });
      })
      .on("error", () => resolve(null));
  });
}

function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": UA } }, (r) => {
        if (r.statusCode !== 200) {
          r.resume();
          return resolve(false);
        }
        const ws = createWriteStream(dest);
        r.pipe(ws);
        ws.on("finish", () => ws.close(() => resolve(true)));
        ws.on("error", () => resolve(false));
      })
      .on("error", () => resolve(false));
  });
}

async function ensureThemeImage(theme: string): Promise<string | null> {
  const local = `/images/tenders/${theme}.jpg`;
  const dest = path.join(OUT_DIR, `${theme}.jpg`);
  if (existsSync(dest)) return local;
  const kws = THEMES[theme] || ["hospital meeting"];
  for (const kw of kws) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await sleep(RETRY_DELAY_MS);
      const url = await searchThumb(kw);
      if (url) {
        if (await download(url, dest)) {
          console.log(`  [OK] ${theme} <- ${kw}`);
          return local;
        }
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
  // Fallback: dùng ảnh chuyên đề đã có sẵn trong repo (mạng Wikimedia thường rate-limit).
  const fb = FALLBACK[theme];
  if (fb) {
    const fbPath = path.join(OUT_DIR, path.basename(fb));
    if (existsSync(fbPath)) {
      console.log(`  [FALLBACK] ${theme} -> ${fb}`);
      return fb;
    }
  }
  console.log(`  [NO-IMG] ${theme}`);
  return null;
}

async function main() {
  if (!existsSync(EXCEL_PATH)) throw new Error(`Excel not found: ${EXCEL_PATH}`);
  mkdirSync(OUT_DIR, { recursive: true });

  const wb = XLSX.readFile(EXCEL_PATH);
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

  // 1) phân nhóm chủ đề: theme -> [slug,...]
  const themeSlugs = new Map<string, string[]>();
  for (const r of rows) {
    const title = String(r["tieu_de"] || "").trim();
    const slug = `${slugify(title)}-${String(r["id_bai_viet_cu"] || r.STT || "").trim()}`;
    const theme = classifyTheme(title);
    themeSlugs.set(theme, [...(themeSlugs.get(theme) || []), slug]);
  }

  // 2) tải ảnh từng chủ đề (delay giữa các theme để tránh rate-limit)
  const themeImage = new Map<string, string | null>();
  for (const theme of themeSlugs.keys()) {
    const img = await ensureThemeImage(theme);
    themeImage.set(theme, img);
    await sleep(BETWEEN_THEMES_MS);
  }

  // 3) cập nhật DB batch
  const pool = new Pool({ connectionString: DATABASE_URL });
  let updated = 0, skipped = 0;
  for (const [theme, slugs] of themeSlugs.entries()) {
    const img = themeImage.get(theme);
    if (!img) continue;
    for (const slug of slugs) {
      const found = await pool.query("SELECT id, image FROM news WHERE slug=$1", [slug]);
      if (found.rowCount === 0) continue;
      if (found.rows[0].image === img) { skipped++; continue; }
      await pool.query("UPDATE news SET image=$1 WHERE slug=$2", [img, slug]);
      updated++;
    }
  }

  console.log(`\n=== XONG ===`);
  console.log(`Updated: ${updated} | Skipped(same image): ${skipped}`);
  await pool.end();
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "tender"
  );
}

main().catch((e) => { console.error(e); process.exit(1); });