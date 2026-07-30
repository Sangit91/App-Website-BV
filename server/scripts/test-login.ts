import "dotenv/config";
const { Pool } = require("pg");
const crypto = require("crypto");

function hashPassword(password: string, salt?: string) {
  const generatedSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, "sha512").toString("hex");
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string) {
  const computed = hashPassword(password, salt).hash;
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const result = await pool.query("SELECT username, password_hash, role FROM admin_users WHERE username = $1", ["admin"]);
  if (result.rows.length === 0) {
    console.log("NO_USER");
    return;
  }
  const row = result.rows[0];
  const pwHash = row.password_hash;
  const parts = pwHash.split(":");
  if (parts.length !== 2) {
    console.log("BAD_FORMAT:", pwHash);
    return;
  }
  const valid = verifyPassword("Admin@123", parts[0], parts[1]);
  console.log("Username:", row.username);
  console.log("Role:", row.role);
  console.log("Password valid:", valid);
  await pool.end();
}

main().catch(console.error);
