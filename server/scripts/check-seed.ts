import "dotenv/config";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env["DATABASE_URL"] });
const tables = [
  "admin_users","specialties","doctors","doctor_schedules","news",
  "testimonials","organization_units","patients","appointments",
  "feedback_requests","record_requests","contact_messages",
  "activity_logs","service_groups","services","price_list","news_categories"
];
async function main() {
  for (const t of tables) {
    const { rows } = await pool.query("SELECT COUNT(*) as c FROM " + t);
    console.log(t + ": " + rows[0].c);
  }
  await pool.end();
}
main().catch(console.error);