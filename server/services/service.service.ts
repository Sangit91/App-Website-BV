import { getPrisma } from "../db/prisma";

export interface ServiceGroupInput {
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface ServiceInput {
  name: string;
  slug?: string;
  groupId?: string;
  icon?: string;
  description?: string;
  price?: number;
  sortOrder?: number;
  isActive?: boolean;
}

export async function getServiceGroups() {
  const prisma = getPrisma();
  return prisma.serviceGroup.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getServiceGroupById(id: string) {
  const prisma = getPrisma();
  return prisma.serviceGroup.findUnique({
    where: { id },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getServices() {
  const prisma = getPrisma();
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      group: true,
    },
  });
}

export async function getServiceById(id: string) {
  const prisma = getPrisma();
  return prisma.service.findUnique({
    where: { id },
    include: { group: true },
  });
}

export async function getServicesByGroup(groupId: string) {
  const prisma = getPrisma();
  return prisma.service.findMany({
    where: { groupId, isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}

export async function createServiceGroup(data: ServiceGroupInput) {
  const prisma = getPrisma();
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return prisma.serviceGroup.create({
    data: {
      name: data.name,
      slug,
      description: data.description || "",
      icon: data.icon,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function createService(data: ServiceInput) {
  const prisma = getPrisma();
  const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return prisma.service.create({
    data: {
      name: data.name,
      slug,
      groupId: data.groupId,
      icon: data.icon,
      description: data.description || "",
      price: data.price,
      sortOrder: data.sortOrder || 0,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateServiceGroup(id: string, data: Partial<ServiceGroupInput>) {
  const prisma = getPrisma();
  const updateData: Record<string, unknown> = { ...data };
  if (data.name && !data.slug) {
    updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  return prisma.serviceGroup.update({ where: { id }, data: updateData });
}

export async function updateService(id: string, data: Partial<ServiceInput>) {
  const prisma = getPrisma();
  const updateData: Record<string, unknown> = { ...data };
  if (data.name && !data.slug) {
    updateData.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  return prisma.service.update({ where: { id }, data: updateData });
}

export async function deleteServiceGroup(id: string) {
  const prisma = getPrisma();
  return prisma.serviceGroup.delete({ where: { id } });
}

export async function deleteService(id: string) {
  const prisma = getPrisma();
  return prisma.service.delete({ where: { id } });
}