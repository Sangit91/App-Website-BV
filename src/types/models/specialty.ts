export type IconType = 'cardiology' | 'obstetrics' | 'pediatrics' | 'emergency' | 'general' | 'diagnostics' | 'ent' | 'odontology';

export interface Specialty {
  id: string;
  name: string;
  description: string;
  iconType: IconType;
  detail: string;
}