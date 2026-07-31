import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { recordRequestService, resolveSafePhysicalPath } from "../services/record-request.service";
import { authenticate, requireAdmin, authorizeDepartmentAccess } from "../middleware/auth.middleware";
import { activityLogger } from "../middleware/activity-log.middleware";

const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), "uploads", "temp"),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = [
      "image/jpeg", "image/png", "image/gif", "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh, PDF, hoặc Word"));
    }
  },
});

router.post("/", async (req, res) => {
  try {
    const { patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason, contact_phone, contact_email } = req.body;

    const validationError = recordRequestService.validateInput({ patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason, contact_phone, contact_email });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newRequest = await recordRequestService.create({ patient_name, patient_id, patient_code, request_type, date_from, date_to, delivery_method, reason, contact_phone, contact_email });
    res.status(201).json({
      success: true,
      message: "Yêu cầu trích sao đã được tiếp nhận",
      data: {
        id: newRequest.id,
        request_code: (newRequest as any).request_code || (newRequest as any).requestCode,
        status: newRequest.status
      }
    });
  } catch (error) {
    console.error("[record-requests POST] create failed:", error);
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.post("/:id/files", authenticate, requireAdmin, authorizeDepartmentAccess, activityLogger({ action: "RECORD_REQUEST_FILE_UPLOAD" }), upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không có file được tải lên" });
    }
    const result = await recordRequestService.handleFileUpload(req.params.id, req.file);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.delete("/:id/files/:fileId", authenticate, requireAdmin, authorizeDepartmentAccess, activityLogger({ action: "RECORD_REQUEST_FILE_DELETE" }), async (req, res) => {
  try {
    await recordRequestService.deleteFile(req.params.fileId);
    res.json({ success: true, message: "Đã xóa file" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/:id/files/:fileId", authenticate, requireAdmin, async (req, res) => {
  try {
    const file = await recordRequestService.getFileById(req.params.fileId);
    if (!file || file.recordRequestId !== req.params.id) {
      return res.status(404).json({ error: "Không tìm thấy file" });
    }

    const physicalPath = resolveSafePhysicalPath(file.filePath);
    if (!physicalPath) {
      return res.status(403).json({ error: "Đường dẫn file không hợp lệ" });
    }

    if (!fs.existsSync(physicalPath)) {
      return res.status(404).json({ error: "File không tồn tại trên máy chủ" });
    }

    res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
    res.setHeader("Content-Length", String(file.size ?? fs.statSync(physicalPath).size));
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.fileName)}"`);
    res.setHeader("Cache-Control", "private, max-age=300");

    fs.createReadStream(physicalPath).pipe(res);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/", authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const allRequests = await recordRequestService.getAll({
      status: status as any,
      from: from as string,
      to: to as string
    });
    res.json(allRequests);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.get("/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const request = await recordRequestService.getById(req.params.id);
    if (!request) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu" });
    }
    res.json(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lỗi máy chủ";
    res.status(500).json({ error: message });
  }
});

router.patch("/:id", authenticate, requireAdmin, authorizeDepartmentAccess, activityLogger({ action: "RECORD_REQUEST_UPDATE" }), async (req, res) => {
  try {
    const { status, admin_notes, processed_by } = req.body;
    const current = await recordRequestService.getById(req.params.id);
    if (!current) {
      return res.status(404).json({ error: "Không tìm thấy yêu cầu" });
    }

    const updated = await recordRequestService.update(req.params.id, { status, admin_notes, processed_by });

    if (status && status !== current.status) {
      await recordRequestService.processStatusChange(req.params.id, status);
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
