import { getPrisma } from "../db/prisma";
import { RecordRequest, Prisma } from "../generated/prisma/client";
import path from "path";
import fs from "fs/promises";

export type RecordRequestStatus = "moi" | "dang_xu_ly" | "da_xu_ly" | "da_huy";
export type RecordRequestType = "ho-so-y-te" | "phieu-xet-nghiem" | "anh-pha" | "don-thuoc" | "giay-chung-nhan" | "other";
export type DeliveryMethod = "tai-kham" | "nhan-tai-quay" | "chuyen-bo-post";

export interface CreateRecordRequestInput {
  patient_name: string;
  patient_id?: string | null;
  patient_code?: string | null;
  request_type: RecordRequestType;
  date_from: string;
  date_to: string;
  delivery_method: DeliveryMethod;
  reason?: string | null;
  contact_phone?: string | null;
  contact_email?: string | null;
}

export interface UpdateRecordRequestInput {
  status?: RecordRequestStatus;
  admin_notes?: string | null;
  processed_by?: string | null;
}

const PENDING_UPLOADS_DIR = path.join(process.cwd(), "uploads", "pending");
const APPROVED_UPLOADS_DIR = path.join(process.cwd(), "uploads", "approved");

// Chuyển đường dẫn URL (lưu trong DB) về đường dẫn vật lý trên disk.
// file.filePath có dạng "/uploads/pending/<file>" nhưng file thực nằm ở
// <cwd>/uploads/pending/<file> (không có "public"). Dùng helper này để tránh
// inconsistency giữa handleFileUpload và deleteFile/processStatusChange.
export function resolvePhysicalPath(filePath: string): string {
  const normalized = filePath.replace(/^\//, "");
  return path.join(process.cwd(), normalized);
}

// Whitelist các thư mục uploads được phép truy cập (chống path traversal).
const ALLOWED_UPLOAD_DIRS = [PENDING_UPLOADS_DIR, APPROVED_UPLOADS_DIR] as const;

// Đảm bảo đường dẫn vật lý nằm trong 1 trong các thư mục được phép.
// Trả về null nếu path vượt ra ngoài whitelist (path traversal attempt).
export function resolveSafePhysicalPath(filePath: string): string | null {
  const resolved = resolvePhysicalPath(filePath);
  const resolvedAbs = path.resolve(resolved);
  for (const allowed of ALLOWED_UPLOAD_DIRS) {
    if (resolvedAbs.startsWith(path.resolve(allowed) + path.sep)) {
      return resolvedAbs;
    }
  }
  return null;
}

function ensureDir(dir: string): Promise<void> {
  return fs.mkdir(dir, { recursive: true }).then(() => {});
}

async function cleanDirectory(dir: string): Promise<void> {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      await fs.unlink(path.join(dir, file));
    }
  } catch {
  }
}

export const recordRequestService = {
  async getAll(filters?: { status?: RecordRequestStatus; from?: string; to?: string }): Promise<RecordRequest[]> {
    const where: Prisma.RecordRequestWhereInput = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.from || filters?.to) {
      where.createdAt = {
        ...(filters.from && { gte: new Date(filters.from) }),
        ...(filters.to && { lte: new Date(filters.to) }),
      };
    }
    return getPrisma().recordRequest.findMany({
      where,
      include: { files: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string): Promise<RecordRequest | null> {
    return getPrisma().recordRequest.findUnique({
      where: { id },
      include: { files: true },
    });
  },

  async getFileById(fileId: string) {
    return getPrisma().recordRequestFile.findUnique({ where: { id: fileId } });
  },

  async create(input: CreateRecordRequestInput): Promise<RecordRequest> {
    const requestCode = `YC-${Math.floor(100000 + Math.random() * 900000)}`;
    return getPrisma().recordRequest.create({
      data: {
        patientName: input.patient_name || "Khách vãng lai",
        patientId: input.patient_id || null,
        patientCode: input.patient_code || null,
        requestType: input.request_type,
        dateFrom: input.date_from ? new Date(input.date_from) : null,
        dateTo: input.date_to ? new Date(input.date_to) : null,
        deliveryMethod: input.delivery_method,
        reason: input.reason || null,
        contactPhone: input.contact_phone || null,
        contactEmail: input.contact_email || null,
        status: "moi",
        requestCode,
      },
    });
  },

  async update(id: string, input: UpdateRecordRequestInput): Promise<RecordRequest | null> {
    const data: Prisma.RecordRequestUncheckedUpdateInput = {};
    if (input.status) data.status = input.status;
    if (input.admin_notes !== undefined) data.adminNotes = input.admin_notes;
    if (input.processed_by !== undefined) data.processedBy = input.processed_by;
    try {
      return await getPrisma().recordRequest.update({ where: { id }, data });
    } catch (err) {
      console.error("[recordRequestService.update] error:", err);
      return null;
    }
  },

  async handleFileUpload(requestId: string, file: Express.Multer.File): Promise<{ fileId: string; filePath: string }> {
    await ensureDir(PENDING_UPLOADS_DIR);

    const request = await getPrisma().recordRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Yêu cầu không tồn tại");

    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const safeFilename = `${request.requestCode}_${timestamp}${ext}`;
    const filePath = path.join(PENDING_UPLOADS_DIR, safeFilename);

    await fs.copyFile(file.path, filePath);

    const dbFile = await getPrisma().recordRequestFile.create({
      data: {
        recordRequestId: requestId,
        fileName: file.originalname,
        filePath: `/uploads/pending/${safeFilename}`,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

    await fs.unlink(file.path).catch(() => {});

    return { fileId: dbFile.id, filePath: dbFile.filePath };
  },

  async deleteFile(fileId: string): Promise<void> {
    const file = await getPrisma().recordRequestFile.findUnique({ where: { id: fileId } });
    if (!file) return;

    const fullPath = resolvePhysicalPath(file.filePath);
    await fs.unlink(fullPath).catch(() => {});
    await getPrisma().recordRequestFile.delete({ where: { id: fileId } });
  },

  async processStatusChange(id: string, newStatus: RecordRequestStatus): Promise<void> {
    const request = await getPrisma().recordRequest.findUnique({
      where: { id },
      include: { files: true },
    });
    if (!request) return;

    if (newStatus === "da_huy") {
      for (const file of request.files) {
        await recordRequestService.deleteFile(file.id);
      }
    } else if (newStatus === "da_xu_ly") {
      await ensureDir(APPROVED_UPLOADS_DIR);

      for (const file of request.files) {
        const pendingPath = resolvePhysicalPath(file.filePath);
        const ext = path.extname(file.fileName);
        const dateStr = new Date().toISOString().split("T")[0];
        const patientCode = request.patientCode || "UNKNOWN";
        const safeFilename = `${patientCode}_${dateStr}_${Date.now()}${ext}`;
        const approvedPath = path.join(APPROVED_UPLOADS_DIR, safeFilename);

        try {
          await fs.copyFile(pendingPath, approvedPath);
          await fs.unlink(pendingPath).catch(() => {});
        } catch (err) {
          console.error("Error moving file to approved:", err);
        }

        const newFilePath = `/uploads/approved/${safeFilename}`;
        await getPrisma().recordRequestFile.update({
          where: { id: file.id },
          data: { filePath: newFilePath },
        });
      }
    }
  },

  validateInput(input: Partial<CreateRecordRequestInput>): string | null {
    if (!input.patient_name?.trim()) return "Vui lòng nhập họ và tên";
    if (!input.request_type) return "Vui lòng chọn loại hồ sơ cần trích sao";
    if (!input.date_from) return "Vui lòng chọn ngày bắt đầu";
    if (!input.date_to) return "Vui lòng chọn ngày kết thúc";
    if (!input.delivery_method) return "Vui lòng chọn phương thức nhận";
    if (input.date_from && input.date_to && new Date(input.date_from) > new Date(input.date_to)) {
      return "Ngày bắt đầu không được sau ngày kết thúc";
    }
    return null;
  }
};