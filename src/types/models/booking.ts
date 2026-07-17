export type BookingStatus = 'Chờ xác nhận' | 'Đã xác nhận' | 'Đã hủy';

export interface Booking {
  id: string;
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  status?: BookingStatus;
  createdAt: string;
}

export type CreateBookingInput = Omit<Booking, 'id' | 'status' | 'createdAt'>;