import { getPrisma } from "../db/prisma";

export interface SpecialtyInput {
  name: string;
  slug?: string;
  description: string;
  icon: string;
  detail?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function getSpecialties() {
  const prisma = getPrisma();
  return prisma.specialty.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getSpecialtyById(id: string) {
  const prisma = getPrisma();
  return prisma.specialty.findUnique({ where: { id } });
}

export async function createSpecialty(data: SpecialtyInput) {
  const prisma = getPrisma();
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return prisma.specialty.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      icon: data.icon,
      detail: data.detail || "",
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateSpecialty(id: string, data: Partial<SpecialtyInput>) {
  const prisma = getPrisma();
  const updateData: Record<string, unknown> = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.detail !== undefined) updateData.detail = data.detail;
  if (data.name && !data.slug) {
    updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  return prisma.specialty.update({ where: { id }, data: updateData });
}

export async function deleteSpecialty(id: string) {
  const prisma = getPrisma();
  return prisma.specialty.delete({ where: { id } });
}