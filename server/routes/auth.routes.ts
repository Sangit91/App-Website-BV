import { Router } from "express";
import { adminLogin, refreshTokens, revokeSession } from "../services/auth.service.js";
import { getPrisma } from "../db/prisma.js";
import { otpService } from "../services/otp.service";
import { otpVerifyLimiter } from "../middleware/rate-limit.middleware";
import { validate } from "../validators/middleware";
import { otpSendSchema, otpVerifySchema } from "../validators/schemas";

const router = Router();

const REFRESH_COOKIE_NAME = "bvdh_refresh";
const IS_PROD = process.env.NODE_ENV === "production";

function setRefreshCookie(res: import("express").Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    path: "/api/v1/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

function clearRefreshCookie(res: import("express").Response): void {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/v1/auth" });
}

function getRefreshToken(req: import("express").Request): string | null {
  const fromCookie = (req.cookies as Record<string, string> | undefined)?.[REFRESH_COOKIE_NAME];
  const fromBody = (req.body as Record<string, unknown> | undefined)?.refreshToken;
  return (typeof fromCookie === "string" && fromCookie) || (typeof fromBody === "string" && fromBody) || null;
}

router.post("/otp/send", validate(otpSendSchema), async (req, res) => {
  const { patientCode, phone } = req.body;

  try {
    const patient = await getPrisma().patient.findFirst({
      where: { patientCode, phone, isActive: true, deletedAt: null },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Thông tin không khớp với hồ sơ đăng ký"
      });
    }

    const { sessionId, otpCode, expiresIn } = otpService.createSession(patientCode, phone);

    // TODO(Phase 52 / HIS): gửi OTP qua SMS gateway thật.
    // Dev mode: trả về mã trong response để test (không được làm vậy ở production).
    if (process.env.NODE_ENV !== "production") {
      return res.json({
        success: true,
        sessionId,
        devOtp: otpCode,
        message: "Mã OTP đã được gửi đến số điện thoại đăng ký",
        expiresIn
      });
    }

    res.json({
      success: true,
      sessionId,
      message: "Mã OTP đã được gửi đến số điện thoại đăng ký",
      expiresIn
    });
  } catch (error) {
    console.error("[auth] otp/send error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi máy chủ, vui lòng thử lại sau"
    });
  }
});

router.post("/otp/verify", otpVerifyLimiter, validate(otpVerifySchema), (req, res) => {
  const { sessionId, otpCode } = req.body;

  const result = otpService.verifyOtp(sessionId, otpCode);

  if (!result.ok) {
    return res.status(result.status).json({
      success: false,
      message: result.message
    });
  }

  const { readToken, expiresIn } = otpService.issueReadToken(result.session);

  res.json({
    success: true,
    readToken,
    expiresIn,
    message: "Xác thực thành công"
  });
});

router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Thiếu tên đăng nhập hoặc mật khẩu",
      code: "MISSING_CREDENTIALS"
    });
  }

  const result = await adminLogin(username, password);

  if ("error" in result) {
    return res.status(401).json({
      success: false,
      error: result.error,
      code: result.code,
      remainingAttempts: result.remainingAttempts
    });
  }

  setRefreshCookie(res, result.refreshToken);

  return res.json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    tokenType: "Bearer",
    expiresIn: result.expiresIn
  });
});

router.post("/admin/refresh", async (req, res) => {
  const refreshToken = getRefreshToken(req);

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: "Thiếu refresh token",
      code: "MISSING_TOKEN"
    });
  }

  const result = await refreshTokens(refreshToken);

  if ("error" in result) {
    clearRefreshCookie(res);
    return res.status(401).json({
      success: false,
      error: result.error,
      code: result.code
    });
  }

  setRefreshCookie(res, result.refreshToken);

  return res.json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn
  });
});

router.post("/admin/logout", (req, res) => {
  const refreshToken = getRefreshToken(req);
  if (refreshToken) {
    revokeSession(refreshToken);
  }
  clearRefreshCookie(res);
  res.json({ success: true, message: "Đã đăng xuất" });
});

export default router;
