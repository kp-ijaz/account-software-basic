import { db } from '../config/database';
import { MadrasaSettings, SettingsUpdateRequest } from '../types/settings';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
};

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

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

      if (
        data.financialYearEnd !== undefined &&
        (data.financialYearEnd < 1 || data.financialYearEnd > 12)
      ) {
        throw new ApiError(400, 'Financial year end month must be between 1 and 12');
      }

      if (data.phone && data.phone.replace(/\D/g, '').length < 8) {
        throw new ApiError(400, 'Please enter a valid phone number');
      }

      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      const existing = await this.getOrCreateSettings();
      const currency = data.currency || existing.currency || 'INR';

      const coreData = {
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
      };

      const extraData = {
        ...(data.financialYearEnd !== undefined && {
          financialYearEnd: data.financialYearEnd,
        }),
        ...(data.website !== undefined && { website: data.website || null }),
        ...(data.taxId !== undefined && { taxId: data.taxId || null }),
        ...(data.registrationNumber !== undefined && {
          registrationNumber: data.registrationNumber || null,
        }),
      };

      let settings;
      try {
        settings = await db.settings.update({
          where: { id: existing.id },
          data: { ...coreData, ...extraData },
        });
      } catch (updateError) {
        logger.warn(`Saving extended settings fields failed, saving core fields only: ${updateError}`);
        settings = await db.settings.update({
          where: { id: existing.id },
          data: coreData,
        });
      }

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
    let settings = await db.settings.findFirst();

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
      });
    }

    return settings;
  }

  private formatSettings(settings: any): MadrasaSettings {
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
      financialYearEnd: settings.financialYearEnd || 12,
      website: settings.website || '',
      taxId: settings.taxId || '',
      registrationNumber: settings.registrationNumber || '',
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}

export default new SettingsService();
