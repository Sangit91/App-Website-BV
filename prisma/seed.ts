// Seed entrypoint chuẩn cho `prisma db seed` / `prisma migrate reset`.
// Logic seed giữ tại server/scripts/seed.ts (dùng raw SQL qua pg Pool).
// Chạy: npx prisma db seed
import "../server/scripts/seed";
