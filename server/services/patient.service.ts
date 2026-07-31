import { getPrisma } from "../db/prisma";

export function toPublicPatient(patient: Record<string, unknown>) {
  return {
    id: patient.id,
    patientCode: patient.patientCode,
    name: patient.name,
    gender: patient.gender,
    birthDate: patient.birthDate,
    phone: patient.phone,
    visitCount: patient.visitCount,
    registeredDate: patient.registeredDate,
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
          where: { cccd: identifier, isActive: true, deletedAt: null },
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

  async getMedicalRecords(patientId: string, filters: { startDate?: string; endDate?: string; clinicId?: string }) {
    const prisma = getPrisma();
    const where: any = { patientId, isActive: true };

    if (filters.startDate) {
      where.admissionDate = { ...where.admissionDate, gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.admissionDate = { ...where.admissionDate, lte: new Date(filters.endDate) };
    }

    const records = await prisma.medicalRecord.findMany({
      where,
      include: { clinicalTests: true, treatments: true },
      orderBy: { admissionDate: "desc" },
    });

    return records;
  },

  async getClinicalTests(patientId: string, filters: { startDate?: string; endDate?: string; testType?: string; status?: string }) {
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

    return prisma.clinicalTest.findMany({
      where,
      orderBy: { testDate: "desc" },
    });
  },

  async getTreatmentHistories(patientId: string) {
    const prisma = getPrisma();
    return prisma.treatmentHistory.findMany({
      where: { patientId },
      orderBy: { treatmentDate: "desc" },
    });
  },
};
