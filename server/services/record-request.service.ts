import { getPrisma } from "../db/prisma";
import { RecordRequest, Prisma } from "../generated/prisma/client";

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
}

export interface UpdateRecordRequestInput {
  status?: RecordRequestStatus;
  admin_notes?: string | null;
  processed_by?: string | null;
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