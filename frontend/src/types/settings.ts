export interface MadrasaSettings {
  id: string;
  madrasaName: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol?: string;
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

export interface SettingsState {
  settings: MadrasaSettings | null;
  loading: boolean;
  error: string | null;
  saveLoading: boolean;
}

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
] as const;

export const MONTHS = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' },
] as const;
