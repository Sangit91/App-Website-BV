import { PrismaClient } from "../server/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TENDER_IMAGES: Record<string, string> = {
  "CNTT-2026-001": "/images/tenders/server-room.jpg",
  "CNTT-2026-002": "/images/tenders/network-cables.jpg",
  "VTTBYT-2026-001": "/images/tenders/surgery.jpg",
  "VTTBYT-2026-002": "/images/tenders/medical-equipment.jpg",
  "XN-2026-001": "/images/tenders/lab-microscope.jpg",
  "XN-2026-002": "/images/tenders/blood-test.jpg",
  "DUOC-2026-001": "/images/tenders/pharmacy.jpg",
  "DUOC-2026-002": "/images/tenders/pharmacy.jpg",
  "HCQT-2026-001": "/images/tenders/documents.jpg",
  "HCQT-2026-002": "/images/tenders/office-cleaning.jpg",
  "KT-2026-001": "/images/tenders/accounting.jpg",
  "KT-2026-002": "/images/tenders/hospital-bed.jpg",
};

async function main() {
  const tenders = await prisma.news.findMany({
    where: { isTender: true, id: { not: { startsWith: "tender-" } } },
    orderBy: { publishedAt: "desc" },
    select: { id: true, tenderNumber: true, title: true },
  });

  console.log(`Found ${tenders.length} seeded tenders`);

  // Deduplicate: keep first (most recent) of each tenderNumber
  const seen = new Set<string>();
  const toDelete: string[] = [];
  const toUpdate: Array<{ id: string; image: string; tenderNumber: string }> = [];

  for (const t of tenders) {
    if (seen.has(t.tenderNumber!)) {
      toDelete.push(t.id);
    } else {
      seen.add(t.tenderNumber!);
      const image = TENDER_IMAGES[t.tenderNumber!];
      if (image) {
        toUpdate.push({ id: t.id, image, tenderNumber: t.tenderNumber! });
      }
    }
  }

  console.log(`Deleting ${toDelete.length} duplicates...`);
  for (const id of toDelete) {
    await prisma.news.delete({ where: { id } });
    console.log(`  Deleted duplicate: ${id}`);
  }

  console.log(`\nUpdating ${toUpdate.length} tenders with images...`);
  for (const t of toUpdate) {
    await prisma.news.update({
      where: { id: t.id },
      data: { image: t.image },
    });
    console.log(`  ${t.tenderNumber} -> ${t.image}`);
  }

  const remaining = await prisma.news.count({ where: { isTender: true } });
  console.log(`\nDone! ${remaining} tenders remaining in DB.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
