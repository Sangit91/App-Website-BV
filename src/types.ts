export interface Specialty {
  id: string;
  name: string;
  description: string;
  iconType: 'cardiology' | 'obstetrics' | 'pediatrics' | 'emergency' | 'general' | 'diagnostics' | 'ent' | 'odontology';
  detail: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string; // Học hàm học vị e.g. BS. CKI, Thầy thuốc ưu tú
  specialtyId: string;
  specialtyName: string;
  image: string;
  experience: string;
  schedule: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  location: string; // e.g. Đại Lộc, Quảng Nam
  content: string;
  avatarColor: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  tag: 'Tin y học' | 'Thông báo' | 'Sự kiện';
  date: string;
  image: string;
  content?: string;
  isTender?: boolean;
  tenderStartDate?: string;
  tenderEndDate?: string;
  tenderFile?: { name: string; size: string; url?: string; fileType?: string };
  tenderDept?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  colorClass: string;
}

export interface Booking {
  id: string;
  patientName: string;
  phone: string;
  specialty: string;
  doctorName?: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  createdAt: string;
}

export interface TestResultIndicator {
  name: string;
  value: string;
  range: string;
  status: 'normal' | 'high' | 'low';
}

export interface TestResult {
  code: string;
  patientName: string;
  birthYear: string;
  gender: string;
  date: string;
  doctorName: string;
  specialty: string;
  diagnose: string;
  indicators: TestResultIndicator[];
  notes: string;
}
