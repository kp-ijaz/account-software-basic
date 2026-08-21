import { db } from '../config/database';
import { MadrasaSettings, SettingsUpdateRequest, SettingsResponse } from '../types/settings';
import { ApiError } from '../utils/errorHandler';
import logger from '../utils/logger';

class SettingsService {
  async getSettings(): Promise<MadrasaSettings> {
    try {
      let settings = await db.settings.findFirst();

      // Create default settings if not found
      if (!settings) {
        settings = await db.settings.create({
          data: {
            madrasaName: 'My Madrasa',
            address: '',
            phone: '',
            email: '',
            currency: 'USD',
            financialYearStart: 1,
          },
        });
      }

      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error fetching settings: ${error}`);
      throw error;
    }
  }

  async updateSettings(data: SettingsUpdateRequest): Promise<MadrasaSettings> {
    try {
      // Validate financial year
      if (data.financialYearStart) {
        if (data.financialYearStart < 1 || data.financialYearStart > 12) {
          throw new ApiError(400, 'Financial year start month must be between 1 and 12');
        }
      }

      // Validate phone format (basic)
      if (data.phone && !/^\+?[\d\s\-()]{10,}$/.test(data.phone.replace(/\s/g, ''))) {
        throw new ApiError(400, 'Invalid phone number format');
      }

      // Validate email format (basic)
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new ApiError(400, 'Invalid email format');
      }

      // Get existing settings or create new
      let settings = await db.settings.findFirst();

      if (!settings) {
        settings = await db.settings.create({
          data: {
            madrasaName: data.madrasaName || 'My Madrasa',
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            currency: data.currency || 'USD',
            financialYearStart: data.financialYearStart || 1,
          },
        });
      } else {
        settings = await db.settings.update({
          where: { id: settings.id },
          data: {
            ...(data.madrasaName !== undefined && { madrasaName: data.madrasaName }),
            ...(data.address !== undefined && { address: data.address }),
            ...(data.phone !== undefined && { phone: data.phone }),
            ...(data.email !== undefined && { email: data.email }),
            ...(data.currency !== undefined && { currency: data.currency }),
            ...(data.financialYearStart !== undefined && { financialYearStart: data.financialYearStart }),
          },
        });
      }

      logger.info('Settings updated successfully');

      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error updating settings: ${error}`);
      throw error;
    }
  }

  async updateLogo(logoPath: string): Promise<MadrasaSettings> {
    try {
      let settings = await db.settings.findFirst();

      if (!settings) {
        settings = await db.settings.create({
          data: {
            madrasaName: 'My Madrasa',
            address: '',
            phone: '',
            email: '',
            currency: 'USD',
            financialYearStart: 1,
            logo: logoPath,
          },
        });
      } else {
        settings = await db.settings.update({
          where: { id: settings.id },
          data: { logo: logoPath },
        });
      }

      logger.info('Logo updated successfully');

      return this.formatSettings(settings);
    } catch (error) {
      logger.error(`Error updating logo: ${error}`);
      throw error;
    }
  }

  private formatSettings(settings: any): MadrasaSettings {
    return {
      id: settings.id,
      madrasaName: settings.madrasaName,
      logo: settings.logo || undefined,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      currency: settings.currency,
      financialYearStart: settings.financialYearStart,
      createdAt: settings.createdAt.toISOString(),
      updatedAt: settings.updatedAt.toISOString(),
    };
  }
}

export default new SettingsService();
