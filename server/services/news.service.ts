import { getPrisma } from "../db/prisma";

export interface NewsInput {
  title: string;
  slug?: string;
  summary?: string;
  category?: string;
  content?: string;
  image?: string;
  author?: string;
  isFeatured?: boolean;
  isTender?: boolean;
  tenderNumber?: string;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderMethod?: string;
  tenderEstimate?: string;
  tenderReceived?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  downloadCount?: number;
  isActive?: boolean;
  publishedAt?: string;
}

export interface NewsUpdateInput {
  title?: string;
  slug?: string;
  summary?: string;
  category?: string;
  content?: string;
  image?: string;
  author?: string;
  isFeatured?: boolean;
  isTender?: boolean;
  tenderNumber?: string;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderMethod?: string;
  tenderEstimate?: string;
  tenderReceived?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  downloadCount?: number;
  isActive?: boolean;
  publishedAt?: string;
}

export async function getNews() {
  const prisma = getPrisma();
  return prisma.news.findMany({
    where: { isActive: true },
    orderBy: { publishedAt: "desc" },
    take: 200,
  });
}

export async function getNewsById(id: string) {
  const prisma = getPrisma();
  return prisma.news.findUnique({ where: { id } });
}

export async function getTenderNews() {
  const prisma = getPrisma();
  return prisma.news.findMany({
    where: { isTender: true, isActive: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function createNews(data: NewsInput) {
  const prisma = getPrisma();
  const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return prisma.news.create({
    data: {
      title: data.title,
      slug,
      summary: data.summary || "",
      category: data.category || "Tin tức",
      content: data.content,
      image: data.image,
      author: data.author || "Ban Biên Tập",
      isFeatured: data.isFeatured ?? false,
      isTender: data.isTender ?? false,
      tenderNumber: data.tenderNumber,
      tenderMethod: data.tenderMethod,
      tenderEstimate: data.tenderEstimate,
      tenderReceived: data.tenderReceived,
      tenderStartDate: data.tenderStartDate ? new Date(data.tenderStartDate) : null,
      tenderEndDate: data.tenderEndDate ? new Date(data.tenderEndDate) : null,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      downloadCount: data.downloadCount || 0,
      isActive: data.isActive ?? true,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
    },
  });
}

export async function updateNews(id: string, data: NewsUpdateInput) {
  const prisma = getPrisma();
  const updateData: Record<string, unknown> = { ...data };
  if (data.title && !data.slug) {
    updateData.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }
  if (data.tenderStartDate) updateData.tenderStartDate = new Date(data.tenderStartDate);
  if (data.tenderEndDate) updateData.tenderEndDate = new Date(data.tenderEndDate);
  if (data.publishedAt) updateData.publishedAt = new Date(data.publishedAt);
  return prisma.news.update({ where: { id }, data: updateData });
}

export async function deleteNews(id: string) {
  const prisma = getPrisma();
  return prisma.news.delete({ where: { id } });
}