import { Request, Response, NextFunction } from 'express';
import settingsService from '../services/settingsService';
import { SettingsUpdateRequest } from '../types/settings';
import { ApiError } from '../utils/errorHandler';

export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await settingsService.getSettings();
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: SettingsUpdateRequest = req.body;

    const settings = await settingsService.updateSettings(data);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    // In a real application, you would handle file storage
    // For now, we'll just save the filename
    const logoPath = `/uploads/logo/${req.file.filename}`;

    const settings = await settingsService.updateLogo(logoPath);

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
