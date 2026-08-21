export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const catchAsyncErrors = (fn: Function) => {
  return (...args: any[]) => {
    Promise.resolve(fn(...args)).catch(args[args.length - 1]);
  };
};

export const createErrorResponse = (
  success: boolean = false,
  message: string = 'An error occurred',
  errors: any[] = []
) => {
  return {
    success,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
};
