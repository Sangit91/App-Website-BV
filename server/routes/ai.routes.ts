import { Router } from "express";
import { aiService } from "../services/ai.service";
import { aiLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../validators/middleware";
import { aiConsultSchema } from "../validators/schemas";

const router = Router();

// Gemini AI Health Consultant
router.post("/consult", aiLimiter, validate(aiConsultSchema), async (req, res) => {
  try {
    const { message, history } = req.body;

    const result = await aiService.consult(message, history || []);
    res.json(result);
  } catch (error) {
    console.error("AI Consult Error:", error);
    const message = error instanceof Error ? error.message : "Có lỗi xảy ra khi kết nối tới Trí tuệ nhân tạo.";
    res.status(500).json({ error: message });
  }
});

export default router;