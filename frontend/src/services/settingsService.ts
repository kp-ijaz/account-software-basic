import api from './api';
import { SettingsResponse, SettingsUpdateRequest, MadrasaSettings } from '../types/settings';

class SettingsService {
  async getSettings(): Promise<MadrasaSettings> {
    try {
      const response = await api.get<SettingsResponse>('/settings');
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch settings';
      throw new Error(message);
    }
  }

  async updateSettings(data: SettingsUpdateRequest): Promise<MadrasaSettings> {
    try {
      const response = await api.put<SettingsResponse>('/settings', data);
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update settings';
      throw new Error(message);
    }
  }

  async uploadLogo(file: File): Promise<MadrasaSettings> {
    try {
      const logo = await this.fileToDataUrl(file);
      const response = await api.post<SettingsResponse>('/settings/logo', { logo });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to upload logo';
      throw new Error(message);
    }
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Could not read the selected image'));
      reader.readAsDataURL(file);
    });
  }
}

export default new SettingsService();
