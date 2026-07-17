export type Role = 'Super Admin' | 'Receptionist' | 'Doctor' | 'Department Admin';

export interface ActiveUser {
  role: Role;
  name: string;
  department?: string;
}