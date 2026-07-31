import { Router } from "express";
import { consentService } from "../services/consent.service";
import { requirePatientReadAccess } from "../middleware/patient-access.middleware";
import { consentFormLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../validators/middleware";
import { consentSubmitSchema, consentWithdrawSchema } from "../validators/schemas";

const router = Router();

router.get("/policy/active", async (req, res) => {
  try {
    const policy = await consentService.getActivePolicy();
    if (!policy) {
      return res.status(404).json({ error: "KhÃ´ng cÃ³ chÃ­nh sÃ¡ch hiá»‡u lá»±c" });
    }
    res.json({
      version: policy.version,
      title: policy.title,
      contentHtml: policy.contentHtml,
      effectiveDate: policy.effectiveDate,
    });
  } catch (error) {
    console.error("[consent/policy/active] error:", error);
    res.status(500).json({ error: "Lá»—i khi láº¥y chÃ­nh sÃ¡ch" });
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
    res.status(500).json({ error: "Lá»—i khi kiá»ƒm tra Ä‘á»“ng Ã½" });
  }
});

router.post("/submit", consentFormLimiter, validate(consentSubmitSchema), async (req, res) => {
  try {
    const { patient_id, policy_version, is_agreed, agreed_scopes } = req.body;

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
      message: is_agreed ? "Äá»“ng Ã½ chÃ­nh sÃ¡ch thÃ nh cÃ´ng" : "ÄÃ£ ghi nháº­n tá»« chá»‘i",
      consent: result.consent,
    });
  } catch (error) {
    console.error("[consent/submit] error:", error);
    res.status(500).json({ error: "Lá»—i khi lÆ°u Ä‘á»“ng Ã½" });
  }
});

router.post("/withdraw", consentFormLimiter, validate(consentWithdrawSchema), async (req, res) => {
  try {
    const { patient_id, policy_version, reason } = req.body;

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
      message: "ÄÃ£ rÃºt láº¡i sá»± Ä‘á»“ng Ã½",
    });
  } catch (error) {
    console.error("[consent/withdraw] error:", error);
    res.status(500).json({ error: "Lá»—i khi rÃºt láº¡i Ä‘á»“ng Ã½" });
  }
});

export default router;
