export type ShiftType = 'Ca Sáng' | 'Ca Chiều' | 'Nghỉ';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  monday: ShiftType;
  tuesday: ShiftType;
  wednesday: ShiftType;
  thursday: ShiftType;
  friday: ShiftType;
  saturday: ShiftType;
  sunday: ShiftType;
}