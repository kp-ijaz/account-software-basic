export interface MadrasaSettings {
  id: string;
  madrasaName: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  financialYearStart: number;
  financialYearEnd: number;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsUpdateRequest {
  madrasaName?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency?: string;
  financialYearStart?: number;
  financialYearEnd?: number;
  website?: string;
  taxId?: string;
  registrationNumber?: string;
}

export interface SettingsResponse {
  success: boolean;
  message?: string;
  data: MadrasaSettings;
}

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
] as const;
