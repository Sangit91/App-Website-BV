export type TestResultStatus = 'normal' | 'high' | 'low';

export interface TestResultIndicator {
  name: string;
  value: string;
  range: string;
  status: TestResultStatus;
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