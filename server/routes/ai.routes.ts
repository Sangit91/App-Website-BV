import { Router } from "express";
import { aiService } from "../services/ai.service";

const router = Router();

// Gemini AI Health Consultant
router.post("/consult", async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Vui lòng nhập nội dung câu hỏi" });
    }

    const result = await aiService.consult(message, history || []);
    res.json(result);
  } catch (error) {
    console.error("AI Consult Error:", error);
    const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi kết nối tới Trí tuệ nhân tạo.";
    res.status(500).json({ error: message });
  }
});

export default router;