import { getPrisma } from "../db/prisma";

export interface TestimonialInput {
  patientId?: string;
  patientName: string;
  doctorId?: string;
  serviceId?: string;
  content: string;
  rating?: number;
  isApproved?: boolean;
  isActive?: boolean;
}

export async function getTestimonials(includeUnapproved = false) {
  const prisma = getPrisma();
  return prisma.testimonial.findMany({
    where: {
      isActive: true,
      ...(includeUnapproved ? {} : { isApproved: true }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      doctor: {
        select: { fullName: true, title: true },
      },
      service: {
        select: { name: true },
      },
    },
  });
}

export async function getTestimonialById(id: string) {
  const prisma = getPrisma();
  return prisma.testimonial.findUnique({
    where: { id },
    include: {
      doctor: {
        select: { fullName: true, title: true },
      },
      service: {
        select: { name: true },
      },
    },
  });
}

export async function createTestimonial(data: TestimonialInput) {
  const prisma = getPrisma();
  return prisma.testimonial.create({
    data: {
      patientName: data.patientName,
      patientId: data.patientId,
      doctorId: data.doctorId,
      serviceId: data.serviceId,
      content: data.content,
      rating: data.rating || 5,
      isApproved: data.isApproved ?? false,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateTestimonial(id: string, data: Partial<TestimonialInput>) {
  const prisma = getPrisma();
  return prisma.testimonial.update({ where: { id }, data });
}

export async function deleteTestimonial(id: string) {
  const prisma = getPrisma();
  return prisma.testimonial.delete({ where: { id } });
}

export async function approveTestimonial(id: string) {
  const prisma = getPrisma();
  return prisma.testimonial.update({
    where: { id },
    data: { isApproved: true },
  });
}