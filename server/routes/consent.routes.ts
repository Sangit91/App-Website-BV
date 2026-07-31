import { Router } from "express";
import { consentService } from "../services/consent.service";
import { requirePatientReadAccess } from "../middleware/patient-access.middleware";

const router = Router();

router.get("/policy/active", async (req, res) => {
  try {
    const policy = await consentService.getActivePolicy();
    if (!policy) {
      return res.status(404).json({ error: "Không có chính sách hiệu lực" });
    }
    res.json({
      version: policy.version,
      title: policy.title,
      contentHtml: policy.contentHtml,
      effectiveDate: policy.effectiveDate,
    });
  } catch (error) {
    console.error("[consent/policy/active] error:", error);
    res.status(500).json({ error: "Lỗi khi lấy chính sách" });
  }
});

router.get("/check/:patientId", requirePatientReadAccess, async (req, res) => {
  try {
    const { patientId } = req.params;
    const hasConsent = await consentService.hasValidConsent(patientId);
    const policy = await consentService.getActivePolicy();

    res.json({
      hasConsent,
      requiresConsent: !hasConsent,
      policyVersion: policy?.version || null,
      policyTitle: policy?.title || null,
    });
  } catch (error) {
    console.error("[consent/check] error:", error);
    res.status(500).json({ error: "Lỗi khi kiểm tra đồng ý" });
  }
});

router.post("/submit", async (req, res) => {
  try {
    const { patient_id, policy_version, is_agreed, agreed_scopes } = req.body;

    const validationError = consentService.validateSubmitInput({
      patient_id,
      policy_version,
      is_agreed,
      agreed_scopes,
    });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const ip_address = req.ip || req.socket.remoteAddress;
    const user_agent = req.headers["user-agent"];

    const result = await consentService.submit({
      patient_id,
      policy_version,
      is_agreed,
      agreed_scopes: agreed_scopes || [],
      ip_address,
      user_agent,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      message: is_agreed ? "Đồng ý chính sách thành công" : "Đã ghi nhận từ chối",
      consent: result.consent,
    });
  } catch (error) {
    console.error("[consent/submit] error:", error);
    res.status(500).json({ error: "Lỗi khi lưu đồng ý" });
  }
});

router.post("/withdraw", async (req, res) => {
  try {
    const { patient_id, policy_version, reason } = req.body;

    if (!patient_id || !policy_version) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const result = await consentService.withdraw({
      patient_id,
      policy_version,
      reason,
    });

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      success: true,
      message: "Đã rút lại sự đồng ý",
    });
  } catch (error) {
    console.error("[consent/withdraw] error:", error);
    res.status(500).json({ error: "Lỗi khi rút lại đồng ý" });
  }
});

export default router;