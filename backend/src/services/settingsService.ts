import { db } from '../config/database';
import { MadrasaSettings, SettingsUpdateRequest } from '../types/settings';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
};

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

const SETTINGS_SELECT = {
  id: true,
  madrasaName: true,
  logo: true,
  address: true,
  phone: true,
  email: true,
  currency: true,
  currencySymbol: true,
  financialYearStart: true,
  openingBalance: true,
  createdAt: true,
  updatedAt: true,
} as const;

function yearEndFromStart(startMonth: number): number {
  return startMonth === 1 ? 12 : startMonth - 1;
}

class SettingsService {
  async getSettings(): Promise<MadrasaSettings> {
    try {
      const settings = await this.getOrCreateSettings();
      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error fetching settings: ${error}`);
      throw error;
    }
  }

  async updateSettings(data: SettingsUpdateRequest): Promise<MadrasaSettings> {
    try {
      if (
        data.financialYearStart !== undefined &&
        (data.financialYearStart < 1 || data.financialYearStart > 12)
      ) {
        throw new ApiError(400, 'Financial year start month must be between 1 and 12');
      }

      if (data.phone && data.phone.replace(/\D/g, '').length < 8) {
        throw new ApiError(400, 'Please enter a valid phone number');
      }

      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      const existing = await this.getOrCreateSettings();
      const currency = data.currency || existing.currency || 'INR';

      const settings = await db.settings.update({
        where: { id: existing.id },
        data: {
          ...(data.madrasaName !== undefined && { madrasaName: data.madrasaName.trim() }),
          ...(data.address !== undefined && { address: data.address }),
          ...(data.phone !== undefined && { phone: data.phone }),
          ...(data.email !== undefined && { email: data.email }),
          ...(data.currency !== undefined && {
            currency,
            currencySymbol: CURRENCY_SYMBOLS[currency] || existing.currencySymbol,
          }),
          ...(data.financialYearStart !== undefined && {
            financialYearStart: data.financialYearStart,
          }),
        },
        select: SETTINGS_SELECT,
      });

      logger.info('Settings updated successfully');
      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error updating settings: ${error}`);
      throw error;
    }
  }

  async updateLogo(logoDataUrl: string): Promise<MadrasaSettings> {
    try {
      this.validateLogo(logoDataUrl);

      const existing = await this.getOrCreateSettings();
      const settings = await db.settings.update({
        where: { id: existing.id },
        data: { logo: logoDataUrl },
        select: SETTINGS_SELECT,
      });

      logger.info('Logo updated successfully');
      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error updating logo: ${error}`);
      throw error;
    }
  }

  private validateLogo(logoDataUrl: string) {
    if (!logoDataUrl?.startsWith('data:image/')) {
      throw new ApiError(400, 'Please upload a valid image file');
    }

    const match = logoDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
    if (!match) {
      throw new ApiError(400, 'Please upload a PNG, JPG, or GIF image');
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowed.includes(match[1].toLowerCase())) {
      throw new ApiError(400, 'Logo must be a PNG, JPG, GIF, or WEBP image');
    }

    const padding = (match[2].match(/=+$/) || [''])[0].length;
    const bytes = Math.floor((match[2].length * 3) / 4) - padding;
    if (bytes > MAX_LOGO_BYTES) {
      throw new ApiError(400, 'Logo must be smaller than 2MB');
    }
  }

  private async getOrCreateSettings() {
    let settings = await db.settings.findFirst({
      select: SETTINGS_SELECT,
    });

    if (!settings) {
      settings = await db.settings.create({
        data: {
          madrasaName: 'My Madrasa',
          address: '',
          phone: '',
          email: '',
          currency: 'INR',
          currencySymbol: '₹',
          financialYearStart: 1,
        },
        select: SETTINGS_SELECT,
      });
    }

    return settings;
  }

  private formatSettings(settings: {
    id: string;
    madrasaName: string;
    logo: string | null;
    address: string | null;
    phone: string | null;
    email: string | null;
    currency: string;
    currencySymbol: string;
    financialYearStart: number;
    createdAt: Date;
    updatedAt: Date;
  }): MadrasaSettings {
    return {
      id: settings.id,
      madrasaName: settings.madrasaName,
      logo: settings.logo || undefined,
      address: settings.address || '',
      phone: settings.phone || '',
      email: settings.email || '',
      currency: settings.currency,
      currencySymbol: settings.currencySymbol || '₹',
      financialYearStart: settings.financialYearStart,
      financialYearEnd: yearEndFromStart(settings.financialYearStart),
      website: '',
      taxId: '',
      registrationNumber: '',
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}

export default new SettingsService();
