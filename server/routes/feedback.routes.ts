import { Router } from "express";
import { feedbackService } from "../services/feedback.service";
import { authenticate, requireAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { patient_name, patient_id, service_type, rating, content, contact_phone, contact_email } = req.body;

    const validationError = feedbackService.validateInput({ patient_name, patient_id, service_type, rating, content, contact_phone, contact_email });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newFeedback = await feedbackService.create({ patient_name, patient_id, service_type, rating, content, contact_phone, contact_email });
    res.status(201).json({
      success: true,
      message: "Góp ý đã được ghi nhận",
      data: newFeedback
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const allFeedback = await feedbackService.getAll({
      status: status as any,
      from: from as string,
      to: to as string
    });
    res.json(allFeedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const feedback = await feedbackService.getById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Không tìm thấy góp ý" });
    }
    res.json(feedback);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.patch("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, admin_response, responded_by } = req.body;
    const updated = await feedbackService.update(req.params.id, { status, admin_response, responded_by });

    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy góp ý" });
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

export default router;
