import { GoogleGenAI } from "@google/genai";

export interface Booking {
  id: string;
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  createdAt: string;
}

export interface TestResultIndicator {
  name: string;
  value: string;
  range: string;
  status: 'normal' | 'high' | 'low';
}

export interface TestResult {
  code: string;
  patientName: string;
  birthYear: string;
  gender: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnose: string;
  indicators: TestResultIndicator[];
  notes: string;
}

// In-memory bookings database
export const bookings: Booking[] = [
  {
    id: "LH-987213",
    patientName: "Nguyễn Văn An",
    phone: "0905123456",
    specialty: "Tim mạch",
    doctorName: "BS. CKI. Nguyễn Văn Trung",
    date: "2026-07-20",
    timeSlot: "08:00 - 09:00",
    symptoms: "Hay bị đau tức ngực trái khi gắng sức",
    createdAt: new Date().toISOString()
  }
];

// In-memory test results database
export const testResults: Record<string, TestResult> = {
  "KQ-123456": {
    code: "KQ-123456",
    patientName: "Trần Thị Bình",
    birthYear: "1985",
    gender: "Nữ",
    date: "2026-07-15",
    doctorName: "BS. CKI. Lê Thanh Sơn",
    specialty: "Nội tổng hợp",
    diagnose: "Thiếu máu nhẹ, cholesterol máu tăng nhẹ",
    indicators: [
      { name: "Huyết sắc tố (Hemoglobin)", value: "115 g/L", range: "120 - 150 g/L", status: "low" },
      { name: "Glucose máu (Đường huyết)", value: "5.2 mmol/L", range: "3.9 - 6.4 mmol/L", status: "normal" },
      { name: "Cholesterol toàn phần", value: "5.8 mmol/L", range: "< 5.2 mmol/L", status: "high" },
      { name: "Triglycerides", value: "1.6 mmol/L", range: "< 1.7 mmol/L", status: "normal" }
    ],
    notes: "Cần ăn hạn chế mỡ động vật, đồ chiên rán. Bổ sung thêm rau xanh, uống nhiều nước và tập thể dục đều đặn. Tái khám chuyên khoa Nội tổng hợp sau 1 tháng."
  },
  "KQ-888888": {
    code: "KQ-888888",
    patientName: "Phạm Văn Cường",
    birthYear: "1972",
    gender: "Nam",
    date: "2026-07-16",
    doctorName: "BS. CKII. Võ Văn Tuấn",
    specialty: "Chẩn đoán hình ảnh",
    diagnose: "Siêu âm ổ bụng bình thường, các cơ quan chưa phát hiện bất thường",
    indicators: [
      { name: "Men gan AST (GOT)", value: "24 U/L", range: "< 37 U/L", status: "normal" },
      { name: "Men gan ALT (GPT)", value: "28 U/L", range: "< 41 U/L", status: "normal" },
      { name: "Creatinine huyết thanh", value: "85 umol/L", range: "62 - 115 umol/L", status: "normal" }
    ],
    notes: "Các chỉ số xét nghiệm và kết quả siêu âm trong giới hạn bình thường. Tiếp tục duy trì chế độ sinh hoạt và ăn uống lành mạnh."
  }
};

// Lazy initialization of Gemini API Client
let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ===== In-memory storage for Public Forms (Phase 49) =====
// See spec v2.10 mục 21.2, 21.3

export type FeedbackStatus = 'moi' | 'dang_xu_ly' | 'da_xu_ly';
export type FeedbackServiceType = 'kham-benh' | 'noi-tru' | 'cap-cuu' | 'ban-si' | 'other';

export interface FeedbackRequest {
  id: string;
  patient_name: string;
  patient_id: string | null;
  service_type: FeedbackServiceType;
  rating: number;
  content: string;
  status: FeedbackStatus;
  admin_response: string | null;
  responded_by: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
  updated_at: string;
}

export type RecordRequestStatus = 'moi' | 'dang_xu_ly' | 'da_xu_ly' | 'da_huy';
export type RecordRequestType = 'ho-so-y-te' | 'giay-chung-nhan' | 'ket-qua-kham' | 'don-thuoc';
export type DeliveryMethod = 'tai-kham' | 'nhan-tai-quay' | 'chuyen-bo-post';

export interface RecordRequest {
  id: string;
  patient_name: string;
  patient_id: string | null;
  patient_code: string | null;
  request_type: RecordRequestType;
  date_from: string;
  date_to: string;
  delivery_method: DeliveryMethod;
  reason: string | null;
  status: RecordRequestStatus;
  admin_notes: string | null;
  request_code: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecordRequestFile {
  id: string;
  record_request_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size: number;
  uploaded_by: string | null;
  created_at: string;
}

// In-memory stores
export const feedbackRequests: FeedbackRequest[] = [
  {
    id: 'fb-001',
    patient_name: 'Nguyễn Thị Minh',
    patient_id: null,
    service_type: 'kham-benh',
    rating: 5,
    content: 'Nhân viên tại quầy tiếp đón rất niềm nở, bác sĩ khám kỹ lưỡng. Tôi rất hài lòng với dịch vụ.',
    status: 'da_xu_ly',
    admin_response: 'Cảm ơn bạn đã góp ý. Chúng tôi sẽ tiếp tục duy trì chất lượng phục vụ tốt nhất.',
    responded_by: 'admin-001',
    contact_phone: '0905123456',
    contact_email: null,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: 'fb-002',
    patient_name: 'Trần Văn Hùng',
    patient_id: null,
    service_type: 'noi-tru',
    rating: 3,
    content: 'Khoa Nội sạch sẽ, nhưng thời gian chờ khám hơi lâu. Cần cải thiện quy trình đặt lịch.',
    status: 'dang_xu_ly',
    admin_response: null,
    responded_by: null,
    contact_phone: null,
    contact_email: 'tranvanhung@gmail.com',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'fb-003',
    patient_name: 'Lê Thị Hương',
    patient_id: null,
    service_type: 'cap-cuu',
    rating: 1,
    content: 'Tôi đợi 2 tiếng mới được gặp bác sĩ trong tình trạng đau bụng cấp. Cần cải thiện quy trình cấp cứu.',
    status: 'moi',
    admin_response: null,
    responded_by: null,
    contact_phone: '0932123456',
    contact_email: null,
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 8).toISOString()
  }
];

export const recordRequests: RecordRequest[] = [
  {
    id: 'rr-001',
    patient_name: 'Phạm Thị Lan',
    patient_id: null,
    patient_code: 'BN-123456',
    request_type: 'ket-qua-kham',
    date_from: '2026-06-01',
    date_to: '2026-07-15',
    delivery_method: 'tai-kham',
    reason: 'Làm hồ sơ bảo hiểm',
    status: 'da_xu_ly',
    admin_notes: 'Đã trả kết quả cho bệnh nhân ngày 20/07/2026',
    request_code: 'YC-789012',
    assigned_to: 'admin-001',
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rr-002',
    patient_name: 'Hoàng Văn Đức',
    patient_id: null,
    patient_code: null,
    request_type: 'don-thuoc',
    date_from: '2026-07-01',
    date_to: '2026-07-22',
    delivery_method: 'chuyen-bo-post',
    reason: 'Gửi về tỉnh',
    status: 'dang_xu_ly',
    admin_notes: null,
    request_code: 'YC-345678',
    assigned_to: null,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rr-003',
    patient_name: 'Đặng Thị Mai',
    patient_id: null,
    patient_code: 'BN-987654',
    request_type: 'ho-so-y-te',
    date_from: '2025-01-01',
    date_to: '2026-07-20',
    delivery_method: 'nhan-tai-quay',
    reason: ' Xin việc mới',
    status: 'moi',
    admin_notes: null,
    request_code: 'YC-111222',
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];