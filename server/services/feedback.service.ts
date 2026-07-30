import { getPrisma } from "../db/prisma";
import { Prisma } from "../generated/prisma/client";

export type FeedbackStatus = "moi" | "dang_xu_ly" | "da_xu_ly";
export type FeedbackServiceType = "kham-benh" | "noi-tru" | "cap-cuu" | "ban-si" | "other";

export interface CreateFeedbackInput {
  patient_name: string;
  patient_id?: string | null;
  service_type: FeedbackServiceType;
  rating: number;
  content: string;
  contact_phone?: string | null;
  contact_email?: string | null;
}

export interface UpdateFeedbackInput {
  status?: FeedbackStatus;
  admin_response?: string | null;
  responded_by?: string | null;
}

export const feedbackService = {
  async getAll(filters?: { status?: FeedbackStatus; from?: string; to?: string }) {
    const where: Prisma.FeedbackRequestWhereInput = {};
    if (filters?.status) where.status = filters.status;
    if (filters?.from || filters?.to) {
      where.createdAt = {
        ...(filters.from && { gte: new Date(filters.from) }),
        ...(filters.to && { lte: new Date(filters.to) }),
      };
    }
    return getPrisma().feedbackRequest.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 });
  },

  async getById(id: string) {
    return getPrisma().feedbackRequest.findUnique({ where: { id } });
  },

  async create(input: CreateFeedbackInput) {
    return getPrisma().feedbackRequest.create({
      data: {
        patientName: input.patient_name || "Khách vãng lai",
        patientId: input.patient_id || null,
        serviceType: input.service_type,
        rating: input.rating,
        content: input.content,
        status: "moi",
        contactPhone: input.contact_phone || null,
        contactEmail: input.contact_email || null,
      },
    });
  },

  async update(id: string, input: UpdateFeedbackInput) {
    const data: Prisma.FeedbackRequestUncheckedUpdateInput = {};
    if (input.status) data.status = input.status;
    if (input.admin_response !== undefined) data.adminResponse = input.admin_response;
    if (input.responded_by !== undefined) data.respondedBy = input.responded_by;
    try {
      return await getPrisma().feedbackRequest.update({ where: { id }, data });
    } catch (err) {
      console.error("[feedbackService.update] error:", err);
      return null;
    }
  },

  validateInput(input: Partial<CreateFeedbackInput>): string | null {
    if (!input.content?.trim()) return "Vui lòng nhập nội dung góp ý";
    if (!input.rating || input.rating < 1 || input.rating > 5) return "Vui lòng chọn đánh giá từ 1-5 sao";
    if (!input.service_type) return "Vui lòng chọn loại dịch vụ";
    const hasContact = input.contact_phone || input.contact_email;
    if (!input.patient_id && !hasContact) {
      return "Vui lòng cung cấp số điện thoại hoặc email để chúng tôi có thể phản hồi";
    }
    return null;
  }
};
