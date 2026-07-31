import { Router } from "express";
import { feedbackService } from "../services/feedback.service";
import { authenticate, requireAdmin, authorizeDepartmentAccess } from "../middleware/auth.middleware";
import { activityLogger } from "../middleware/activity-log.middleware";

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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const feedback = await feedbackService.getById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Không tìm thấy góp ý" });
    }
    res.json(feedback);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.patch("/:id", authenticate, requireAdmin, authorizeDepartmentAccess, activityLogger({ action: "FEEDBACK_UPDATE" }), async (req, res) => {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

export default router;
