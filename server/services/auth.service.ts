import crypto from "crypto";
import { getPrisma } from "../db/prisma.js";

const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET is required in production");
}
if (!JWT_REFRESH_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_REFRESH_SECRET is required in production");
}

const ACCESS_TOKEN_EXPIRY = 30 * 60 * 1000; // 30 minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days
const LOGIN_LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_LOGIN_ATTEMPTS = 5;

interface LoginAttempt {
  attempts: number;
  lockedUntil: number;
}

const loginAttempts = new Map<string, LoginAttempt>();

export interface TokenPayload {
  userId: string;
  username: string;
  role: string;
  departmentId?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const { hash: computedHash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computedHash));
}

function generateAccessToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ACCESS_TOKEN_EXPIRY })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

function generateRefreshToken(payload: TokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + REFRESH_TOKEN_EXPIRY })).toString("base64url");
  const signature = crypto.createHmac("sha256", JWT_REFRESH_SECRET).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${signature}`;
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, username: payload.username, role: payload.role, departmentId: payload.departmentId };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const [header, body, signature] = token.split(".");
    const expectedSig = crypto.createHmac("sha256", JWT_REFRESH_SECRET).update(`${header}.${body}`).digest("base64url");
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, username: payload.username, role: payload.role, departmentId: payload.departmentId };
  } catch {
    return null;
  }
}

function clearLoginAttempts(username: string): void {
  loginAttempts.delete(username.toLowerCase());
}

function recordLoginFailure(username: string): { locked: boolean; remainingAttempts: number } {
  const key = username.toLowerCase();
  const now = Date.now();
  let attempt = loginAttempts.get(key);

  if (!attempt || attempt.lockedUntil < now) {
    attempt = { attempts: 0, lockedUntil: 0 };
  }

  attempt.attempts++;
  if (attempt.attempts >= MAX_LOGIN_ATTEMPTS) {
    attempt.lockedUntil = now + LOGIN_LOCKOUT_DURATION;
  }

  loginAttempts.set(key, attempt);

  return {
    locked: attempt.lockedUntil > now,
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - attempt.attempts)
  };
}

export async function adminLogin(username: string, password: string): Promise<AuthTokens | { error: string; code: string; remainingAttempts?: number }> {
  const now = Date.now();
  const key = username.toLowerCase();
  const attempt = loginAttempts.get(key);

  if (attempt && attempt.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attempt.lockedUntil - now) / 1000);
    return {
      error: `Tài khoản bị khóa tạm thời. Vui lòng thử lại sau ${remainingSeconds} giây.`,
      code: "ACCOUNT_LOCKED"
    };
  }

  const prisma = getPrisma();
  const admin = await prisma.adminUser.findUnique({
    where: { username: username.toLowerCase() },
    include: { department: true }
  });

  if (!admin || !admin.isActive) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng", code: "INVALID_CREDENTIALS" };
  }

  if (admin.deletedAt) {
    return { error: "Tài khoản đã bị vô hiệu hóa", code: "ACCOUNT_DISABLED" };
  }

  const passwordHashParts = admin.passwordHash.split(":");
  if (passwordHashParts.length !== 2) {
    return { error: "Lỗi xác thực. Vui lòng liên hệ quản trị viên.", code: "AUTH_ERROR" };
  }

  const [storedHash, storedSalt] = passwordHashParts;
  if (!verifyPassword(password, storedHash, storedSalt)) {
    const result = recordLoginFailure(username);
    if (result.locked) {
      return {
        error: `Đã nhập sai quá nhiều lần. Tài khoản bị khóa tạm thời trong ${LOGIN_LOCKOUT_DURATION / 60000} phút.`,
        code: "ACCOUNT_LOCKED"
      };
    }
    return {
      error: `Tên đăng nhập hoặc mật khẩu không đúng. Còn ${result.remainingAttempts} lần thử.`,
      code: "INVALID_CREDENTIALS",
      remainingAttempts: result.remainingAttempts
    };
  }

  clearLoginAttempts(username);

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLogin: new Date() }
  });

  const payload: TokenPayload = {
    userId: admin.id,
    username: admin.username,
    role: admin.role,
    departmentId: admin.departmentId || undefined
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000
  };
}

export async function refreshTokens(refreshToken: string): Promise<{ accessToken: string; expiresIn: number } | { error: string; code: string }> {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    return { error: "Refresh token không hợp lệ hoặc đã hết hạn", code: "INVALID_REFRESH_TOKEN" };
  }

  const prisma = getPrisma();
  const admin = await prisma.adminUser.findUnique({
    where: { id: payload.userId }
  });

  if (!admin || !admin.isActive || admin.deletedAt) {
    return { error: "Tài khoản không hợp lệ", code: "ACCOUNT_INVALID" };
  }

  return {
    accessToken: generateAccessToken({
      userId: admin.id,
      username: admin.username,
      role: admin.role,
      departmentId: admin.departmentId || undefined
    }),
    expiresIn: ACCESS_TOKEN_EXPIRY / 1000
  };
}

export async function hashNewPassword(password: string): Promise<string> {
  const { hash, salt } = hashPassword(password);
  return `${hash}:${salt}`;
}