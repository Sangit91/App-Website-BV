export interface Prescription {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  clinic: string;
  clinicId: string;
  doctorName: string;
  doctorTitle?: string;
  symptoms: string;
  diagnosis: string;
  icd10_code?: string;
  treatment: string;
  prescriptions?: Prescription[];
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export interface GetMedicalRecordsRequest {
  patientId: string;
  readToken: string;
  startDate?: string;
  endDate?: string;
  clinicId?: string;
}

export interface GetMedicalRecordsResponse {
  records: MedicalRecord[];
  total: number;
  page: number;
  pageSize: number;
}