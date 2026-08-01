import { getPrisma } from "../db/prisma";
import { Prisma } from "../generated/prisma/client";

export async function getAllContent() {
  const prisma = getPrisma();
  const rows = await prisma.siteContent.findMany();
  const result: Record<string, unknown> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function getContent(key: string) {
  const prisma = getPrisma();
  return prisma.siteContent.findUnique({ where: { key } });
}

export async function upsertContent(key: string, value: unknown) {
  const prisma = getPrisma();
  return prisma.siteContent.upsert({
    where: { key },
    create: { key, value: value as Prisma.InputJsonValue },
    update: { value: value as Prisma.InputJsonValue },
  });
}
