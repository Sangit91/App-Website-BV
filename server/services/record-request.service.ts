import { recordRequests, RecordRequest, RecordRequestStatus, RecordRequestType, DeliveryMethod } from "../db/database";

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
  assigned_to?: string | null;
}

export const recordRequestService = {
  getAll(filters?: { status?: RecordRequestStatus; from?: string; to?: string }): RecordRequest[] {
    let results = [...recordRequests];

    if (filters?.status) {
      results = results.filter(r => r.status === filters.status);
    }

    if (filters?.from) {
      const fromDate = new Date(filters.from);
      results = results.filter(r => new Date(r.created_at) >= fromDate);
    }

    if (filters?.to) {
      const toDate = new Date(filters.to);
      results = results.filter(r => new Date(r.created_at) <= toDate);
    }

    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getById(id: string): RecordRequest | undefined {
    return recordRequests.find(r => r.id === id);
  },

  create(input: CreateRecordRequestInput): RecordRequest {
    const id = `rr-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const requestCode = `YC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRequest: RecordRequest = {
      id,
      patient_name: input.patient_name || 'Khách vãng lai',
      patient_id: input.patient_id || null,
      patient_code: input.patient_code || null,
      request_type: input.request_type,
      date_from: input.date_from,
      date_to: input.date_to,
      delivery_method: input.delivery_method,
      reason: input.reason || null,
      status: 'moi',
      admin_notes: null,
      request_code: requestCode,
      assigned_to: null,
      created_at: now,
      updated_at: now
    };

    recordRequests.unshift(newRequest);
    return newRequest;
  },

  update(id: string, input: UpdateRecordRequestInput): RecordRequest | null {
    const request = recordRequests.find(r => r.id === id);
    if (!request) return null;

    if (input.status) request.status = input.status;
    if (input.admin_notes !== undefined) request.admin_notes = input.admin_notes;
    if (input.assigned_to !== undefined) request.assigned_to = input.assigned_to;
    request.updated_at = new Date().toISOString();

    return request;
  },

  validateInput(input: Partial<CreateRecordRequestInput>): string | null {
    if (!input.patient_name?.trim()) return 'Vui lòng nhập họ và tên';
    if (!input.request_type) return 'Vui lòng chọn loại hồ sơ cần trích sao';
    if (!input.date_from) return 'Vui lòng chọn ngày bắt đầu';
    if (!input.date_to) return 'Vui lòng chọn ngày kết thúc';
    if (!input.delivery_method) return 'Vui lòng chọn phương thức nhận';
    if (input.date_from && input.date_to && new Date(input.date_from) > new Date(input.date_to)) {
      return 'Ngày bắt đầu không được sau ngày kết thúc';
    }
    return null;
  }
};