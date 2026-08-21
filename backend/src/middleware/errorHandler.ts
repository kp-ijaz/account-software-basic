import { Request, Response, NextFunction } from 'express';
import { ApiError, createErrorResponse } from '../utils/errorHandler';
import logger from '../utils/logger';

export const errorHandlerMiddleware = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.warn(`API Error [${err.statusCode}]: ${err.message}`);
    res.status(err.statusCode).json(
      createErrorResponse(false, err.message, [])
    );
    return;
  }

  // Log unexpected errors
  logger.error(`Unexpected error: ${err.message}`, err);

  // Don't expose internal error details in production
  const message =
    process.env.NODE_ENV === 'development'
      ? err.message
      : 'An unexpected error occurred. Please try again later.';

  res.status(500).json(
    createErrorResponse(false, message, [])
  );
};

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.warn(`404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json(
    createErrorResponse(false, `Route not found: ${req.method} ${req.path}`, [])
  );
};
