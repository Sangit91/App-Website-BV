import { getGeminiClient } from "../db/database";

interface ChatMessage {
  role: string;
  text: string;
}

const FALLBACK_REPLIES = [
  "Chào bạn, tôi là Bác sĩ Trợ lý Ảo của BVĐK KV Miền Núi Phía Bắc Quảng Nam. Rất tiếc, hệ thống tư vấn AI hiện đang trong chế độ demo (chưa cấu hình API Key). Tuy nhiên, đối với các triệu chứng sức khỏe, bạn nên đăng ký đặt lịch khám tại chuyên khoa của chúng tôi để bác sĩ chuyên môn trực tiếp thăm khám và tư vấn nhé!",
  "Xin chào, trợ lý ảo khuyên bạn nên uống đủ nước, nghỉ ngơi hợp lý. Để được kê đơn thuốc và xét nghiệm chính xác, xin vui lòng đặt lịch khám chuyên khoa hoặc liên hệ Hotline của chúng tôi.",
  "Cảm ơn câu hỏi của bạn. Bệnh viện miền núi phía Bắc Quảng Nam luôn sẵn sàng đón tiếp bạn tại các phòng khám chuyên khoa từ thứ 2 đến thứ 6 hàng tuần và cấp cứu 24/7."
];

const SYSTEM_INSTRUCTION = `Bạn là Trợ lý Sức khỏe Trí tuệ Nhân tạo thông thái, vô cùng thân thiện, từ tốn và ấm áp của Bệnh viện Đa khoa Khu vực Miền núi Phía Bắc Quảng Nam (địa chỉ: 107 Quang Trung, Xã Đại Lộc, TP. Đà Nẵng).
Hãy trả lời các câu hỏi y tế của người bệnh bằng tiếng Việt một cách dễ hiểu, ân cần, giúp giảm bớt tâm lý lo lắng cho họ.
Các quy định cốt lõi:
1. Luôn đề xuất người bệnh đặt lịch hẹn khám trực tuyến hoặc đến trực tiếp bệnh viện để bác sĩ chuyên môn chẩn đoán chính xác bằng thiết bị y khoa.
2. Không kê đơn thuốc hoặc chẩn đoán tuyệt đối. Hãy cung cấp kiến thức phòng bệnh hữu ích, chế độ dinh dưỡng lành mạnh, giải thích thuật ngữ y học phổ thông.
3. Nhắc đến địa danh Quảng Nam hoặc bệnh viện để thể hiện sự gắn kết gần gũi thân thương của bệnh viện miền núi.
4. Giữ câu trả lời ngắn gọn, phân tách ý bằng các gạch đầu dòng rõ ràng để dễ đọc.`;

export const aiService = {
  async consult(message: string, history: ChatMessage[] = []): Promise<{ reply: string; isDemo: boolean }> {
    const client = getGeminiClient();
    
    if (!client) {
      const randomReply = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
      return { reply: randomReply, isDemo: true };
    }

    try {
      const formattedContents = [];
      
      if (history && Array.isArray(history)) {
        for (const h of history) {
          formattedContents.push({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }]
          });
        }
      }
      
      formattedContents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "Xin lỗi, tôi chưa thể trả lời câu hỏi này lúc này. Bạn vui lòng thử lại sau hoặc đặt lịch hẹn khám với bác sĩ chuyên khoa nhé.";
      return { reply: replyText, isDemo: false };
    } catch (error) {
      console.error("Gemini Consult Error:", error);
      throw new Error("Có lỗi xảy ra khi kết nối tới Trí tuệ nhân tạo. Hãy thử lại hoặc đặt lịch khám trực tiếp.");
    }
  }
};