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

export interface PatientCheckRequest {
  identity_card: string;
  full_name: string;
  dob: string;
  phone: string;
}

export interface PatientCheckResponse {
  exists: boolean;
  patientCode?: string;
  message?: string;
}

export interface OTPSendRequest {
  patientCode: string;
  phone: string;
}

export interface OTPSendResponse {
  success: boolean;
  sessionId?: string;
  message?: string;
}

export interface OTPVerifyRequest {
  sessionId: string;
  otpCode: string;
}

export interface OTPVerifyResponse {
  success: boolean;
  readToken?: string;
  expiresIn?: number;
  message?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}