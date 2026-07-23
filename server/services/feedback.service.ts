import { feedbackRequests, FeedbackRequest, FeedbackStatus, FeedbackServiceType } from "../db/database";

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
  getAll(filters?: { status?: FeedbackStatus; from?: string; to?: string }): FeedbackRequest[] {
    let results = [...feedbackRequests];

    if (filters?.status) {
      results = results.filter(f => f.status === filters.status);
    }

    if (filters?.from) {
      const fromDate = new Date(filters.from);
      results = results.filter(f => new Date(f.created_at) >= fromDate);
    }

    if (filters?.to) {
      const toDate = new Date(filters.to);
      results = results.filter(f => new Date(f.created_at) <= toDate);
    }

    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getById(id: string): FeedbackRequest | undefined {
    return feedbackRequests.find(f => f.id === id);
  },

  create(input: CreateFeedbackInput): FeedbackRequest {
    const id = `fb-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const newFeedback: FeedbackRequest = {
      id,
      patient_name: input.patient_name || 'Khách vãng lai',
      patient_id: input.patient_id || null,
      service_type: input.service_type,
      rating: input.rating,
      content: input.content,
      status: 'moi',
      admin_response: null,
      responded_by: null,
      contact_phone: input.contact_phone || null,
      contact_email: input.contact_email || null,
      created_at: now,
      updated_at: now
    };

    feedbackRequests.unshift(newFeedback);
    return newFeedback;
  },

  update(id: string, input: UpdateFeedbackInput): FeedbackRequest | null {
    const feedback = feedbackRequests.find(f => f.id === id);
    if (!feedback) return null;

    if (input.status) feedback.status = input.status;
    if (input.admin_response !== undefined) feedback.admin_response = input.admin_response;
    if (input.responded_by !== undefined) feedback.responded_by = input.responded_by;
    feedback.updated_at = new Date().toISOString();

    return feedback;
  },

  validateInput(input: Partial<CreateFeedbackInput>): string | null {
    if (!input.content?.trim()) return 'Vui lòng nhập nội dung góp ý';
    if (!input.rating || input.rating < 1 || input.rating > 5) return 'Vui lòng chọn đánh giá từ 1-5 sao';
    if (!input.service_type) return 'Vui lòng chọn loại dịch vụ';

    const hasContact = input.contact_phone || input.contact_email;
    if (!input.patient_id && !hasContact) {
      return 'Vui lòng cung cấp số điện thoại hoặc email để chúng tôi có thể phản hồi';
    }

    return null;
  }
};