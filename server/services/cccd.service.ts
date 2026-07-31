import crypto from "crypto";

// CCCD phải được mã hóa khi lưu (P12): cccd_encrypted dùng AES-256-GCM,
// cccd_hash dùng HMAC-SHA256 (deterministic) để lookup + unique — không lưu plaintext.
// Key bắt buộc trong production (fail-fast), dev fallback để seed/test.

const CCCD_SECRET = process.env.CCCD_SECRET || "";

if (!CCCD_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("CCCD_SECRET is required in production");
}

const FALLBACK_DEV_SECRET = "dev-cccd-secret-not-for-production";
const ALGORITHM = "aes-256-gcm";
const KEY = crypto.createHash("sha256").update(CCCD_SECRET || FALLBACK_DEV_SECRET).digest();

export function encryptCccd(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}.${tag.toString("base64")}.${encrypted.toString("base64")}`;
}

export function decryptCccd(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("CCCD payload không hợp lệ");
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return decrypted.toString("utf8");
}

export function hashCccd(plain: string): string {
  return crypto.createHash("sha256").update(`${plain}|${CCCD_SECRET || FALLBACK_DEV_SECRET}`).digest("hex");
}

export function maskCccd(plain: string): string {
  if (plain.length <= 4) return "****";
  return `${plain.slice(0, 4)}****${plain.slice(-2)}`;
}

export const cccdService = { encryptCccd, decryptCccd, hashCccd, maskCccd };
