import { PrismaClient } from "../server/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TENDER_TIMES: Record<string, { start: string; end: string }> = {
  "CNTT-2026-001": { start: "2026-08-01T08:00:00", end: "2026-09-15T17:00:00" },
  "CNTT-2026-002": { start: "2026-08-15T08:00:00", end: "2026-08-30T17:00:00" },
  "VTTBYT-2026-001": { start: "2026-09-01T08:00:00", end: "2026-09-30T17:00:00" },
  "VTTBYT-2026-002": { start: "2026-08-01T08:00:00", end: "2026-08-20T17:00:00" },
  "XN-2026-001": { start: "2026-09-01T08:00:00", end: "2026-09-20T17:00:00" },
  "XN-2026-002": { start: "2026-08-10T08:00:00", end: "2026-08-25T17:00:00" },
  "DUOC-2026-001": { start: "2026-10-01T08:00:00", end: "2026-10-15T17:00:00" },
  "DUOC-2026-002": { start: "2026-08-20T08:00:00", end: "2026-09-10T17:00:00" },
  "HCQT-2026-001": { start: "2026-08-01T08:00:00", end: "2026-08-15T17:00:00" },
  "HCQT-2026-002": { start: "2026-08-15T08:00:00", end: "2026-09-05T17:00:00" },
  "KT-2026-001": { start: "2026-12-01T08:00:00", end: "2026-12-30T17:00:00" },
  "KT-2026-002": { start: "2026-10-01T08:00:00", end: "2026-10-30T17:00:00" },
};

async function main() {
  const tenders = await prisma.news.findMany({
    where: { isTender: true, id: { not: { startsWith: "tender-" } } },
    select: { id: true, tenderNumber: true },
  });

  for (const t of tenders) {
    const times = TENDER_TIMES[t.tenderNumber!];
    if (!times) continue;
    await prisma.news.update({
      where: { id: t.id },
      data: {
        tenderStartDate: new Date(times.start),
        tenderEndDate: new Date(times.end),
      },
    });
    console.log(`${t.tenderNumber} -> ${times.start} -> ${times.end}`);
  }
  console.log(`\nDone! Updated ${tenders.length} tenders with precise times.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
