import { bookings, Booking } from "../db/database";

export interface CreateBookingInput {
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string;
}

export const bookingService = {
  getAll(): Booking[] {
    return bookings;
  },

  search(query: string): Booking[] {
    return bookings.filter(b => 
      b.phone.includes(query) || b.id === query
    );
  },

  create(input: CreateBookingInput): Booking {
    const id = `LH-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking: Booking = {
      ...input,
      id,
      symptoms: input.symptoms || "Không có",
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    return newBooking;
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