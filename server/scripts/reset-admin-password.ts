import "dotenv/config";
import crypto from "crypto";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
}

async function main() {
  // Không hardcode password — dùng ADMIN_DEFAULT_PASSWORD từ env (bắt buộc).
  const password = process.env["ADMIN_DEFAULT_PASSWORD"];
  if (!password) {
    console.error("ADMIN_DEFAULT_PASSWORD env var is required. Đặt biến môi trường trước khi chạy script.");
    process.exit(1);
  }

  const { hash, salt } = hashPassword(password);
  const passwordHash = `${hash}:${salt}`;

  const { rowCount } = await pool.query(
    `UPDATE admin_users
     SET password_hash = $1, updated_at = NOW()
     WHERE username IN ('admin', 'reception', 'bacsi')`,
    [passwordHash]
  );

  console.log(`Đã cập nhật mật khẩu cho ${rowCount} tài khoản admin (mật khẩu lấy từ env, không in ra log).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
