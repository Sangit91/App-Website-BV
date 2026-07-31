import { getPrisma } from "../db/prisma";
import { cccdService } from "./cccd.service";

export function toPublicPatient(patient: Record<string, unknown>) {
  return {
    id: patient.id,
    patientCode: patient.patientCode,
    name: patient.fullName,
    gender: patient.gender,
    birthDate: patient.birthDate,
    phone: patient.phone,
    visitCount: patient.visitCount,
    registeredDate: patient.registeredAt,
  };
}

export const patientService = {  async lookup(identifier: string, identifierType: string) {
    const prisma = getPrisma();
    let patient;

    switch (identifierType) {
      case "patientCode":
        patient = await prisma.patient.findFirst({
          where: { patientCode: identifier, isActive: true, deletedAt: null },
        });
        break;
      case "cccd":
        patient = await prisma.patient.findFirst({
          where: { cccdHash: cccdService.hashCccd(identifier), isActive: true, deletedAt: null },
        });
        break;
      case "phone":
        patient = await prisma.patient.findFirst({
          where: { phone: identifier, isActive: true, deletedAt: null },
        });
        break;
    }

    return patient || null;
  },

  async getMedicalRecords(patientId: string, filters: { startDate?: string; endDate?: string; clinicId?: string }, pageInfo?: { skip: number; take: number }) {
    const prisma = getPrisma();
    const where: any = { patientId, isActive: true };

    if (filters.startDate) {
      where.admissionDate = { ...where.admissionDate, gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.admissionDate = { ...where.admissionDate, lte: new Date(filters.endDate) };
    }

    const [data, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        include: { clinicalTests: true, treatments: true },
        orderBy: { admissionDate: "desc" },
        skip: pageInfo?.skip,
        take: pageInfo?.take,
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    return { data, total };
  },

  async getClinicalTests(patientId: string, filters: { startDate?: string; endDate?: string; testType?: string; status?: string }, pageInfo?: { skip: number; take: number }) {
    const prisma = getPrisma();
    const where: any = { patientId };

    if (filters.startDate) {
      where.testDate = { ...where.testDate, gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.testDate = { ...where.testDate, lte: new Date(filters.endDate) };
    }
    if (filters.testType) {
      where.specimenType = filters.testType;
    }
    if (filters.status) {
      where.resultStatus = filters.status;
    }

    const [data, total] = await Promise.all([
      prisma.clinicalTest.findMany({
        where,
        orderBy: { testDate: "desc" },
        skip: pageInfo?.skip,
        take: pageInfo?.take,
      }),
      prisma.clinicalTest.count({ where }),
    ]);

    return { data, total };
  },

  async getTreatmentHistories(patientId: string, pageInfo?: { skip: number; take: number }) {
    const prisma = getPrisma();
    const where: any = { patientId };
    const [data, total] = await Promise.all([
      prisma.treatmentHistory.findMany({
        where,
        orderBy: { treatmentDate: "desc" },
        skip: pageInfo?.skip,
        take: pageInfo?.take,
      }),
      prisma.treatmentHistory.count({ where }),
    ]);
    return { data, total };
  },
};
