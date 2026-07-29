import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });

async function main() {
  const { rows } = await pool.query(
    `SELECT username, role, LEFT(password_hash, 30) || '...' AS hash_preview, is_active
     FROM admin_users ORDER BY username`
  );
  console.table(rows);
  await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });
