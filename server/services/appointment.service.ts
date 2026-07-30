import { getPrisma } from "../db/prisma";

export const appointmentService = {
  async findPatientByIdentityCard(identityCard: string) {
    return getPrisma().patient.findFirst({
      where: { cccd: identityCard, isActive: true, deletedAt: null },
    });
  },

  async getOrCreatePatient(data: {
    cccd: string;
    fullName: string;
    phone: string;
    birthDate: string;
  }) {
    const prisma = getPrisma();
    const existing = await this.findPatientByIdentityCard(data.cccd);
    if (existing) return { patient: existing, isNew: false };

    const year = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
    const patientCode = `BN-${year}-${seq}`;

    const patient = await prisma.patient.create({
      data: {
        patientCode,
        fullName: data.fullName.toUpperCase(),
        cccd: data.cccd,
        phone: data.phone,
        birthDate: new Date(data.birthDate),
        visitCount: 0,
        isActive: true,
      },
    });

    return { patient, isNew: true };
  },

  async createAppointment(data: {
    patientId?: string;
    patientName: string;
    patientCode?: string;
    phone: string;
    specialtyName: string;
    specialtyId?: string;
    doctorName?: string;
    appointmentDate: string;
    appointmentTime: string;
    symptoms?: string;
  }) {
    const bookingCode = `LH-${Math.floor(100000 + Math.random() * 900000)}`;
    return getPrisma().appointment.create({
      data: {
        patientId: data.patientId || null,
        patientName: data.patientName,
        patientCode: data.patientCode || null,
        phone: data.phone,
        serviceType: "kham-benh",
        specialtyName: data.specialtyName,
        specialtyId: data.specialtyId || null,
        doctorName: data.doctorName || null,
        appointmentDate: new Date(data.appointmentDate),
        timeSlot: data.appointmentTime,
        symptoms: data.symptoms || null,
        bookingCode,
        status: "cho_xac_nhan",
      },
    });
  },

  async searchAppointments(query: { patientCode?: string; phone?: string }) {
    const where: any = {};
    if (query.patientCode) where.patientCode = query.patientCode;
    if (query.phone) where.phone = query.phone;

    return getPrisma().appointment.findMany({
      where,
      orderBy: { appointmentDate: "desc" },
    });
  },

  async findByBookingCode(bookingCode: string) {
    return getPrisma().appointment.findFirst({
      where: { bookingCode },
    });
  },

  async cancelAppointment(bookingCode: string) {
    const appointment = await this.findByBookingCode(bookingCode);
    if (!appointment) return null;
    if (appointment.status === "da_kham") {
      throw new Error("Lịch hẹn đã khám không thể hủy");
    }

    return getPrisma().appointment.update({
      where: { id: appointment.id },
      data: {
        status: "da_huy",
        cancelledAt: new Date(),
      },
    });
  },
};
