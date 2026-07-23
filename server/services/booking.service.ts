import { getPrisma } from "../db/prisma";
import { Appointment } from "../generated/prisma/client";

export interface CreateBookingInput {
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms?: string;
}

export const bookingService = {
  async getAll(): Promise<Appointment[]> {
    return getPrisma().appointment.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async search(query: string): Promise<Appointment[]> {
    return getPrisma().appointment.findMany({
      where: {
        OR: [
          { phone: { contains: query, mode: "insensitive" } },
          { bookingCode: { contains: query, mode: "insensitive" } },
          { patientName: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async create(input: CreateBookingInput): Promise<Appointment> {
    const bookingCode = `LH-${Math.floor(100000 + Math.random() * 900000)}`;
    return getPrisma().appointment.create({
      data: {
        patientName: input.patientName,
        phone: input.phone,
        serviceType: "kham-benh",
        specialtyName: input.specialty,
        doctorName: input.doctorName || null,
        appointmentDate: new Date(input.date),
        timeSlot: input.timeSlot,
        symptoms: input.symptoms || "Không có",
        bookingCode,
        status: "cho_xac_nhan",
      },
    });
  },

  async updateStatus(
    id: string,
    status: string,
    extra?: { cancelledAt?: Date; cancelReason?: string; cancelledBy?: string }
  ): Promise<Appointment> {
    return getPrisma().appointment.update({
      where: { id },
      data: {
        status,
        ...(status === "da_xac_nhan" && { confirmedAt: new Date() }),
        ...(status === "da_huy" && {
          cancelledAt: extra?.cancelledAt || new Date(),
          cancelReason: extra?.cancelReason || null,
          cancelledBy: extra?.cancelledBy || null,
        }),
      },
    });
  },

  validateInput(input: Partial<CreateBookingInput>): string | null {
    if (!input.patientName) return "Vui lòng nhập họ và tên người bệnh";
    if (!input.phone) return "Vui lòng nhập số điện thoại";
    if (!input.specialty) return "Vui lòng chọn chuyên khoa";
    if (!input.date) return "Vui lòng chọn ngày khám";
    if (!input.timeSlot) return "Vui lòng chọn khung giờ khám";
    return null;
  }
};