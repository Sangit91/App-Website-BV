import { Request, Response, NextFunction } from "express";
import { consentService } from "../services/consent.service";

export interface ConsentCheckRequest extends Request {
  patientId?: string;
  skipConsentCheck?: boolean;
}

export function createConsentMiddleware(patientIdExtractor: (req: Request) => string | null) {
  return async (req: ConsentCheckRequest, res: Response, next: NextFunction) => {
    if (req.skipConsentCheck) {
      return next();
    }

    const patientId = patientIdExtractor(req);
    if (!patientId) {
      return next();
    }

    try {
      const hasConsent = await consentService.hasValidConsent(patientId);

      if (!hasConsent) {
        const policy = await consentService.getActivePolicy();
        return res.status(403).json({
          error: "CONSENT_REQUIRED",
          message: "Bạn cần đồng ý chính sách bảo mật trước khi xem dữ liệu y tế",
          policyVersion: policy?.version || null,
          policyTitle: policy?.title || null,
        });
      }

      next();
    } catch (error) {
      console.error("[ConsentCheckMiddleware] error:", error);
      res.status(500).json({ error: "Lỗi khi kiểm tra đồng ý" });
    }
  };
}

export async function consentCheckMiddleware(req: ConsentCheckRequest, res: Response, next: NextFunction) {
  if (req.skipConsentCheck) {
    return next();
  }

  const patientId = req.patientId || req.params.patientId || (req.query.patientId as string);
  if (!patientId) {
    return next();
  }

  try {
    const hasConsent = await consentService.hasValidConsent(patientId);
    if (!hasConsent) {
      const policy = await consentService.getActivePolicy();
      return res.status(403).json({
        error: "CONSENT_REQUIRED",
        message: "Bạn cần đồng ý chính sách bảo mật trước khi xem dữ liệu y tế",
        policyVersion: policy?.version || null,
        policyTitle: policy?.title || null,
      });
    }
    next();
  } catch (error) {
    console.error("[ConsentCheckMiddleware] error:", error);
    res.status(500).json({ error: "Lỗi khi kiểm tra đồng ý" });
  }
}