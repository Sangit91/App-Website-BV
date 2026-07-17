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