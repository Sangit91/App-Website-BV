import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory appointments database
interface Booking {
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

const bookings: Booking[] = [
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
interface TestResult {
  code: string;
  patientName: string;
  birthYear: string;
  gender: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnose: string;
  indicators: Array<{ name: string; value: string; range: string; status: 'normal' | 'high' | 'low' }>;
  notes: string;
}

const testResults: Record<string, TestResult> = {
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
function getGeminiClient(): GoogleGenAI | null {
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

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Create appointment booking
app.post("/api/booking", (req, res) => {
  try {
    const { patientName, phone, specialty, doctorName, date, timeSlot, symptoms } = req.body;
    
    if (!patientName || !phone || !specialty || !date || !timeSlot) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ các thông tin bắt buộc" });
    }

    const id = `LH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      id,
      patientName,
      phone,
      specialty,
      doctorName,
      date,
      timeSlot,
      symptoms: symptoms || "Không có",
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    res.status(201).json(newBooking);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

// Get bookings list
app.get("/api/booking", (req, res) => {
  res.json(bookings);
});

// Search bookings by phone
app.get("/api/booking/search", (req, res) => {
  const phone = req.query.phone as string;
  if (!phone) {
    return res.status(400).json({ error: "Vui lòng cung cấp số điện thoại tra cứu" });
  }
  const filtered = bookings.filter(b => b.phone.includes(phone) || b.id === phone);
  res.json(filtered);
});

// Get test result by code
app.get("/api/test-results/:code", (req, res) => {
  const code = req.params.code.trim().toUpperCase();
  const result = testResults[code];
  if (!result) {
    return res.status(404).json({ error: "Không tìm thấy kết quả xét nghiệm cho mã này. Thử mã 'KQ-123456' hoặc 'KQ-888888'." });
  }
  res.json(result);
});

// Gemini Health AI Consultant
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung câu hỏi" });
    }

    const client = getGeminiClient();
    if (!client) {
      // Return beautiful mock responses matching hospital guidelines if API key is not set
      const fallbackReplies = [
        "Chào bạn, tôi là Bác sĩ Trợ lý Ảo của BVĐK KV Miền Núi Phía Bắc Quảng Nam. Rất tiếc, hệ thống tư vấn AI hiện đang trong chế độ demo (chưa cấu hình API Key). Tuy nhiên, đối với các triệu chứng sức khỏe, bạn nên đăng ký đặt lịch khám tại chuyên khoa của chúng tôi để bác sĩ chuyên môn trực tiếp thăm khám và tư vấn nhé!",
        "Xin chào, trợ lý ảo khuyên bạn nên uống đủ nước, nghỉ ngơi hợp lý. Để được kê đơn thuốc và xét nghiệm chính xác, xin vui lòng đặt lịch khám chuyên khoa trực tuyến hoặc liên hệ Hotline của chúng tôi.",
        "Cảm ơn câu hỏi của bạn. Bệnh viện miền núi phía Bắc Quảng Nam luôn sẵn sàng đón tiếp bạn tại các phòng khám chuyên khoa từ thứ 2 đến thứ 6 hàng tuần và cấp cứu 24/7."
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ reply: randomReply, isDemo: true });
    }

    // Format chat history for Gemini API
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const h of history) {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      }
    }
    // Append the current message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const systemInstruction = `Bạn là Trợ lý Sức khỏe Trí tuệ Nhân tạo thông thái, vô cùng thân thiện, từ tốn và ấm áp của Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam (địa chỉ: Huyện Đại Lộc, tỉnh Quảng Nam).
Hãy trả lời các câu hỏi y tế của người bệnh bằng tiếng Việt một cách dễ hiểu, ân cần, giúp giảm bớt tâm lý lo lắng cho họ.
Các quy định cốt lõi:
1. Luôn đề xuất người bệnh đặt lịch hẹn khám trực tuyến hoặc đến trực tiếp bệnh viện để bác sĩ chuyên môn chẩn đoán chính xác bằng thiết bị y khoa.
2. Không kê đơn thuốc hoặc chẩn đoán tuyệt đối. Hãy cung cấp kiến thức phòng bệnh hữu ích, chế độ dinh dưỡng lành mạnh, giải thích thuật ngữ y học phổ thông.
3. Nhắc đến địa danh Quảng Nam hoặc bệnh viện để thể hiện sự gắn kết gần gũi thân thương của bệnh viện miền núi.
4. Giữ câu trả lời ngắn gọn, phân tách ý bằng các gạch đầu dòng rõ ràng để dễ đọc.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Xin lỗi, tôi chưa thể trả lời câu hỏi này lúc này. Bạn vui lòng thử lại sau hoặc đặt lịch hẹn khám với bác sĩ chuyên khoa nhé.";
    res.json({ reply: replyText, isDemo: false });
  } catch (error: any) {
    console.error("Gemini Consult Error:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi kết nối tới Trí tuệ nhân tạo. Hãy thử lại hoặc đặt lịch khám trực tiếp." });
  }
});

// Configure Vite or Serve Static Files
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    // Import Vite dynamically
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
