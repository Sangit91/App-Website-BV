import { getPrisma } from "../db/prisma";

export interface DoctorInput {
  fullName: string;
  title?: string;
  specialtyId?: string;
  phone?: string;
  image?: string;
  experienceYear?: number;
  bio?: string;
  isActive?: boolean;
}

export interface ScheduleInput {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export async function getDoctors() {
  const prisma = getPrisma();
  return prisma.doctor.findMany({
    where: { isActive: true },
    include: { specialty: true },
    orderBy: { createdAt: "asc" },
    take: 200,
  });
}

export async function getDoctorById(id: string) {
  const prisma = getPrisma();
  return prisma.doctor.findUnique({
    where: { id },
    include: { specialty: true },
  });
}

export async function createDoctor(data: DoctorInput) {
  const prisma = getPrisma();
  return prisma.doctor.create({
    data: {
      fullName: data.fullName,
      title: data.title || "",
      specialtyId: data.specialtyId,
      phone: data.phone,
      image: data.image,
      experienceYear: data.experienceYear,
      bio: data.bio,
      isActive: data.isActive ?? true,
    },
  });
}

export async function updateDoctor(id: string, data: Partial<DoctorInput>) {
  const prisma = getPrisma();
  return prisma.doctor.update({ where: { id }, data });
}

export async function deleteDoctor(id: string) {
  const prisma = getPrisma();
  return prisma.doctor.delete({ where: { id } });
}

export async function getDoctorSchedules() {
  const prisma = getPrisma();
  return prisma.doctorSchedule.findMany({
    include: { doctor: { select: { fullName: true } } },
  });
}

export async function updateDoctorSchedule(doctorId: string, data: ScheduleInput) {
  const prisma = getPrisma();
  const schedule = await prisma.doctorSchedule.findFirst({ where: { doctorId } });
  if (!schedule) {
    return prisma.doctorSchedule.create({
      data: {
        doctorId,
        monday: data.monday,
        tuesday: data.tuesday,
        wednesday: data.wednesday,
        thursday: data.thursday,
        friday: data.friday,
        saturday: data.saturday,
        sunday: data.sunday,
      },
    });
  }
  return prisma.doctorSchedule.update({
    where: { id: schedule.id },
    data: {
      monday: data.monday,
      tuesday: data.tuesday,
      wednesday: data.wednesday,
      thursday: data.thursday,
      friday: data.friday,
      saturday: data.saturday,
      sunday: data.sunday,
    },
  });
}