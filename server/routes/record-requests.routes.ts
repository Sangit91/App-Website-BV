import { Router } from "express";
import { recordRequestService } from "../services/record-request.service";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason } = req.body;

    const validationError = recordRequestService.validateInput({ patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newRequest = await recordRequestService.create({ patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason });
    res.status(201).json({
      success: true,
      message: "Yêu cầu trích sao đã được tiếp nhận",
      data: {
        id: newRequest.id,
        request_code: (newRequest as any).request_code || (newRequest as any).requestCode,
        status: newRequest.status
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const allRequests = await recordRequestService.getAll({
      status: status as any,
      from: from as string,
      to: to as string
    });
    res.json(allRequests);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const request = await recordRequestService.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu" });
    }
    res.json(request);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Lỗi máy chủ" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { status, admin_notes, processed_by } = req.body;
    const updated = await recordRequestService.update(req.params.id, { status, admin_notes, processed_by });

    if (!updated) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu" });
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