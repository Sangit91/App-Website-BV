import { PrismaClient } from "../server/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const r = await prisma.news.findFirst({
    where: { isTender: true },
    orderBy: { publishedAt: "desc" },
  });
  console.log("tenderDept:", r?.tenderDept);
  console.log("title:", r?.title?.substring(0, 50));
  const keys = Object.keys(r || {}).filter(k => k.startsWith("tender"));
  console.log("tender keys:", keys);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
