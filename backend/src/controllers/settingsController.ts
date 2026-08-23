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
      message: 'Settings saved successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadLogo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logo = req.body?.logo as string | undefined;
    if (!logo) {
      throw new ApiError(400, 'Please choose an image to upload');
    }

    const settings = await settingsService.updateLogo(logo);

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
