import { Request, Response, NextFunction } from "express";
import { otpService } from "../services/otp.service";
import { verifyAccessToken } from "../services/auth.service";
import { getPrisma } from "../db/prisma";

export async function requirePatientReadAccess(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Không có token xác thực", code: "MISSING_TOKEN" });
    return;
  }

  const token = authHeader.substring(7);
  const patientId = req.params.patientId;

  const session = otpService.verifyReadToken(token);
  if (session) {
    const patient = await getPrisma().patient.findFirst({
      where: { patientCode: session.patientCode, deletedAt: null },
      select: { id: true },
    });

    if (!patient || (patientId && patient.id !== patientId)) {
      res.status(403).json({ error: "Token không có quyền truy cập bệnh nhân này", code: "PATIENT_MISMATCH" });
      return;
    }

    (req as Request & { patientId?: string }).patientId = patient.id;
    next();
    return;
  }

  const payload = verifyAccessToken(token);
  if (payload) {
    (req as Request & { user?: unknown }).user = payload;
    next();
    return;
  }

  res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn", code: "INVALID_TOKEN" });
}
