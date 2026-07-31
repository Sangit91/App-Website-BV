import { getPrisma } from "../db/prisma";

interface OTPSession {
  sessionId: string;
  patientCode: string;
  phone: string;
  otpCode: string;
  expiresAt: number;
  verified: boolean;
  attempts: number;
}

const otpSessions = new Map<string, OTPSession>();
const OTP_TTL_MS = 5 * 60 * 1000;
const READ_TOKEN_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateReadToken(): string {
  return `rt_${Date.now()}_${Math.random().toString(36).substring(2, 21)}`;
}

function cleanExpiredSessions() {
  const now = Date.now();
  for (const [key, session] of otpSessions.entries()) {
    if (session.expiresAt < now) {
      otpSessions.delete(key);
    }
  }
}

export const otpService = {
  createSession(patientCode: string, phone: string): { sessionId: string; otpCode: string; expiresIn: number } {
    cleanExpiredSessions();
    const sessionId = generateSessionId();
    const otpCode = generateOTP();
    const expiresAt = Date.now() + OTP_TTL_MS;
    otpSessions.set(sessionId, {
      sessionId,
      patientCode,
      phone,
      otpCode,
      expiresAt,
      verified: false,
      attempts: 0,
    });
    return { sessionId, otpCode, expiresIn: OTP_TTL_MS / 1000 };
  },

  verifyOtp(
    sessionId: string,
    otpCode: string
  ): { ok: true; status: number; session: OTPSession } | { ok: false; status: number; message: string } {
    const session = otpSessions.get(sessionId);
    if (!session) {
      return { ok: false, status: 404, message: "Phiên OTP không tồn tại hoặc đã hết hạn" };
    }
    if (session.expiresAt < Date.now()) {
      otpSessions.delete(sessionId);
      return { ok: false, status: 410, message: "Mã OTP đã hết hạn, vui lòng yêu cầu mã mới" };
    }
    if (session.otpCode !== otpCode) {
      session.attempts += 1;
      if (session.attempts >= MAX_OTP_ATTEMPTS) {
        otpSessions.delete(sessionId);
        return { ok: false, status: 429, message: "Quá nhiều lần nhập sai. Vui lòng yêu cầu mã OTP mới" };
      }
      return {
        ok: false,
        status: 401,
        message: `Mã OTP không chính xác. Còn ${MAX_OTP_ATTEMPTS - session.attempts} lần thử`,
      };
    }
    session.verified = true;
    return { ok: true, status: 200, session };
  },

  issueReadToken(session: OTPSession): { readToken: string; expiresIn: number } {
    cleanExpiredSessions();
    const readToken = generateReadToken();
    const expiresAt = Date.now() + READ_TOKEN_TTL_MS;
    otpSessions.set(`read_${readToken}`, {
      ...session,
      sessionId: `read_${readToken}`,
      expiresAt,
    });
    return { readToken, expiresIn: READ_TOKEN_TTL_MS / 1000 };
  },

  verifyReadToken(readToken: string): OTPSession | null {
    const session = otpSessions.get(`read_${readToken}`);
    if (!session || session.expiresAt < Date.now()) {
      otpSessions.delete(`read_${readToken}`);
      return null;
    }
    if (!session.verified) {
      return null;
    }
    return session;
  },
};

export type { OTPSession };

export async function resolvePatientIdByPatientCode(patientCode: string): Promise<string | null> {
  const patient = await getPrisma().patient.findFirst({
    where: { patientCode, deletedAt: null },
    select: { id: true },
  });
  return patient ? patient.id : null;
}
