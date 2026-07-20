export type ClinicalTestType =
  | 'xet-nghiem-mau'
  | 'xet-nghiem-nuoc-tieu'
  | 'x-quang'
  | 'sieu-am'
  | 'ecg'
  | 'eeg'
  | 'ct-scan'
  | 'mri'
  | 'x-quang-quan-tim'
  | 'noi-soi'
  | 'lao-tes'
  | 'sinh-hoa';

export type ClinicalTestStatus = 'normal' | 'abnormal' | 'critical';
export type IndicatorStatus = 'normal' | 'high' | 'low';

export interface ClinicalTestIndicator {
  name: string;
  value: string;
  unit?: string;
  normalRange: string;
  status: IndicatorStatus;
}

export interface ClinicalTest {
  id: string;
  patientId: string;
  date: string;
  testType: ClinicalTestType;
  category: string;
  testName: string;
  result: string;
  status: ClinicalTestStatus;
  indicators?: ClinicalTestIndicator[];
  attachments?: string[];
  notes?: string;
  orderedBy: string;
  orderedByDoctorId?: string;
  performedAt?: string;
  labCode?: string;
  createdAt: string;
}

export const CLINICAL_TEST_TYPE_LABELS: Record<ClinicalTestType, string> = {
  'xet-nghiem-mau': 'Xét nghiệm máu',
  'xet-nghiem-nuoc-tieu': 'Xét nghiệm nước tiểu',
  'x-quang': 'Chụp X-quang',
  'sieu-am': 'Siêu âm',
  'ecg': 'Điện tâm đồ (ECG)',
  'eeg': 'Điện não đồ (EEG)',
  'ct-scan': 'Chụp cắt lớp vi tính (CT)',
  'mri': 'Chụp cộng hưởng từ (MRI)',
  'x-quang-quan-tim': 'X-quang quang tim phổi',
  'noi-soi': 'Nội soi',
  'lao-tes': 'Lao test',
  'sinh-hoa': 'Hóa sinh'
};

export interface GetClinicalTestsRequest {
  patientId: string;
  startDate?: string;
  endDate?: string;
  testType?: ClinicalTestType;
  status?: ClinicalTestStatus;
}

export interface GetClinicalTestsResponse {
  tests: ClinicalTest[];
  total: number;
  page: number;
  pageSize: number;
}