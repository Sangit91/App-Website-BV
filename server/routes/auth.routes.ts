import { Router } from "express";
import { adminLogin, refreshTokens, hashNewPassword } from "../services/auth.service.js";

const router = Router();

interface OTPSession {
  sessionId: string;
  patientCode: string;
  phone: string;
  otpCode: string;
  expiresAt: number;
  verified: boolean;
}

interface RefreshToken {
  token: string;
  expiresAt: number;
}

const otpSessions = new Map<string, OTPSession>();
const refreshTokens = new Map<string, RefreshToken>();

const MOCK_PATIENTS = [
  { patientCode: "BN-2020-00001", phone: "0912345678" },
  { patientCode: "BN-2021-00042", phone: "0987654321" },
  { patientCode: "BN-2022-00156", phone: "0903123456" }
];

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateReadToken(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).substring(2, 21)}`;
}

function generateAccessToken(): string {
  return `at_${Date.now()}_${Math.random().toString(36).substring(2, 21)}`;
}

function generateRefreshToken(): string {
  return `rf_${Date.now()}_${Math.random().toString(36).substring(2, 21)}`;
}

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [key, session] of otpSessions.entries()) {
    if (session.expiresAt < now) {
      otpSessions.delete(key);
    }
  }
}

router.post("/otp/send", (req, res) => {
  const { patientCode, phone } = req.body;

  if (!patientCode || !phone) {
    return res.status(400).json({
      success: false,
      message: "Thiếu mã bệnh nhân hoặc số điện thoại"
    });
  }

  const patient = MOCK_PATIENTS.find(
    p => p.patientCode === patientCode && p.phone === phone
  );

  if (!patient) {
    return res.status(404).json({
      success: false,
      message: "Thông tin không khớp với hồ sơ đăng ký"
    });
  }

  cleanExpiredSessions();

  const sessionId = generateSessionId();
  const otpCode = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpSessions.set(sessionId, {
    sessionId,
    patientCode,
    phone,
    otpCode,
    expiresAt,
    verified: false
  });

  console.log(`[MOCK OTP] Session: ${sessionId} | Code: ${otpCode} | Expires: ${new Date(expiresAt).toISOString()}`);

  res.json({
    success: true,
    sessionId,
    message: "Mã OTP đã được gửi đến số điện thoại đăng ký",
    expiresIn: 300
  });
});

router.post("/otp/verify", (req, res) => {
  const { sessionId, otpCode } = req.body;

  if (!sessionId || !otpCode) {
    return res.status(400).json({
      success: false,
      message: "Thiếu sessionId hoặc mã OTP"
    });
  }

  const session = otpSessions.get(sessionId);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Phiên OTP không tồn tại hoặc đã hết hạn"
    });
  }

  if (session.expiresAt < Date.now()) {
    otpSessions.delete(sessionId);
    return res.status(410).json({
      success: false,
      message: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới"
    });
  }

  if (session.otpCode !== otpCode) {
    return res.status(401).json({
      success: false,
      message: "Mã OTP không chính xác"
    });
  }

  session.verified = true;

  const readToken = generateReadToken();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpSessions.set(`read_${readToken}`, {
    ...session,
    sessionId: `read_${readToken}`,
    expiresAt
  });

  console.log(`[MOCK OTP] Verified session: ${sessionId} | ReadToken: ${readToken}`);

  res.json({
    success: true,
    readToken,
    expiresIn: 300,
    message: "Xác thực thành công"
  });
});

router.post("/token/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Thiếu refresh token" });
  }

  const stored = refreshTokens.get(refreshToken);

  if (!stored || stored.expiresAt < Date.now()) {
    refreshTokens.delete(refreshToken);
    return res.status(401).json({ error: "Refresh token không hợp lệ hoặc đã hết hạn" });
  }

  const accessToken = generateAccessToken();
  const expiresAt = Date.now() + 30 * 60 * 1000;

  refreshTokens.set(refreshToken, { token: refreshToken, expiresAt });

  res.json({
    accessToken,
    expiresIn: 1800
  });
});

router.post("/token/access", (req, res) => {
  const { patientCode } = req.body;

  if (!patientCode) {
    return res.status(400).json({ error: "Thiếu mã bệnh nhân" });
  }

  const patient = MOCK_PATIENTS.find(p => p.patientCode === patientCode);

  if (!patient) {
    return res.status(404).json({ error: "Không tìm thấy bệnh nhân" });
  }

  const accessToken = generateAccessToken();
  const refreshToken = generateRefreshToken();
  const accessExpiresAt = Date.now() + 30 * 60 * 1000;
  const refreshExpiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;

  refreshTokens.set(refreshToken, { token: refreshToken, expiresAt: refreshExpiresAt });

  console.log(`[MOCK AUTH] New access token for ${patientCode}: ${accessToken}`);

  res.json({
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn: 1800
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

  return res.json({
    success: true,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    tokenType: "Bearer",
    expiresIn: result.expiresIn
  });
});

router.post("/admin/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: "Thiếu refresh token",
      code: "MISSING_TOKEN"
    });
  }

  const result = await refreshTokens(refreshToken);

  if ("error" in result) {
    return res.status(401).json({
      success: false,
      error: result.error,
      code: result.code
    });
  }

  return res.json({
    success: true,
    accessToken: result.accessToken,
    expiresIn: result.expiresIn
  });
});

export default router;