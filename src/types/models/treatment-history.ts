export type TreatmentType = 'noi-tru' | 'ngoai-tru' | 'thu-thuat' | 'phau-thuat' | 'cap-cuu';
export type TreatmentOutcome = 'khoi' | 'do' | 'chuyen-vien' | 'tai-kham';

export interface TreatmentHistory {
  id: string;
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  type: TreatmentType;
  department: string;
  departmentId?: string;
  diagnosis: string;
  diagnosisCodes?: string[];
  treatment: string;
  surgicalProcedure?: string;
  outcome?: TreatmentOutcome;
  summary?: string;
  doctorName: string;
  doctorTitle?: string;
  roomNumber?: string;
  bedNumber?: string;
  notes?: string;
  createdAt: string;
}

export const TREATMENT_TYPE_LABELS: Record<TreatmentType, string> = {
  'noi-tru': 'Nội trú',
  'ngoai-tru': 'Ngoại trú',
  'thu-thuat': 'Thủ thuật',
  'phau-thuat': 'Phẫu thuật',
  'cap-cuu': 'Cấp cứu'
};

export const TREATMENT_OUTCOME_LABELS: Record<TreatmentOutcome, string> = {
  'khoi': 'Khỏi',
  'do': 'Đỡ',
  'chuyen-vien': 'Chuyển viện',
  'tai-kham': 'Tái khám'
};

export interface GetTreatmentHistoryRequest {
  patientId: string;
  startDate?: string;
  endDate?: string;
  type?: TreatmentType;
  departmentId?: string;
}

export interface GetTreatmentHistoryResponse {
  histories: TreatmentHistory[];
  total: number;
  page: number;
  pageSize: number;
}