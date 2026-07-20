export type Gender = 'nam' | 'nữ' | 'khác';

export interface Patient {
  id: string;
  patientCode: string;
  name: string;
  cccd: string;
  phone: string;
  birthDate: string;
  gender: Gender;
  address?: string;
  email?: string;
  insuranceCode?: string;
  visitCount: number;
  registeredDate?: string;
}

export interface PatientLookupRequest {
  identifier: string;
  identifierType: 'patientCode' | 'cccd' | 'phone';
}

export interface PatientLookupResponse {
  patient: Patient;
  message?: string;
}