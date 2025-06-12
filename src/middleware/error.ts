import { Request, Response, NextFunction } from 'express';
import logger, { logError } from '@/utils/logger';
import { BuilderApiError } from '@/builder/types';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

/**
 * Custom error class for API errors
 */
export class AppError extends Error implements ApiError {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Ensure the stack trace points to where the error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(
  error: Error | ApiError | BuilderApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logError(error as Error, {
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  // Handle different types of errors
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: any = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    code = error.code;
    message = error.message;
    details = error.details;
  } else if ('code' in error && 'message' in error) {
    // Builder API error
    const builderError = error as BuilderApiError;
    statusCode = builderError.code ? parseInt(builderError.code) : 500;
    code = builderError.code || 'BUILDER_API_ERROR';
    message = builderError.message;
    details = builderError.details;
  } else if ('name' in error && error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = error.message;
  } else if ('name' in error && error.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if ('name' in error && error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'Duplicate entry';
  } else {
    // Generic error
    message = error.message || 'Internal server error';
  }

  // Don't expose internal errors in production
  if (process.env['NODE_ENV'] === 'production' && statusCode === 500) {
    message = 'Internal server error';
    details = undefined;
  }

  // Send error response
  const errorResponse: any = {
    error: code,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
  };

  if (details) {
    errorResponse.details = details;
  }

  // Include stack trace in development
  if (process.env['NODE_ENV'] === 'development') {
    errorResponse.stack = 'stack' in error ? error.stack : undefined;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * 404 handler middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  logger.warn('Route not found', {
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
    path: req.url,
  });
}

/**
 * Async error wrapper to catch async errors in route handlers
 */
export function asyncHandler<T extends Request, U extends Response>(
  fn: (req: T, res: U, next: NextFunction) => Promise<any>
) {
  return (req: T, res: U, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Create standardized error responses
 */
export const createError = {
  badRequest: (message: string, details?: any) => 
    new AppError(message, 400, 'BAD_REQUEST', details),
  
  unauthorized: (message: string = 'Unauthorized') => 
    new AppError(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message: string = 'Forbidden') => 
    new AppError(message, 403, 'FORBIDDEN'),
  
  notFound: (message: string = 'Resource not found') => 
    new AppError(message, 404, 'NOT_FOUND'),
  
  conflict: (message: string, details?: any) => 
    new AppError(message, 409, 'CONFLICT', details),
  
  unprocessableEntity: (message: string, details?: any) => 
    new AppError(message, 422, 'UNPROCESSABLE_ENTITY', details),
  
  tooManyRequests: (message: string = 'Too many requests') => 
    new AppError(message, 429, 'TOO_MANY_REQUESTS'),
  
  internal: (message: string = 'Internal server error', details?: any) => 
    new AppError(message, 500, 'INTERNAL_ERROR', details),
  
  serviceUnavailable: (message: string = 'Service unavailable') => 
    new AppError(message, 503, 'SERVICE_UNAVAILABLE'),
};

/**
 * Middleware to handle uncaught exceptions
 */
export function setupGlobalErrorHandlers(): void {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack,
    });
    
    // Give the logger time to write the log
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      reason: reason?.message || reason,
      stack: reason?.stack,
      promise: promise.toString(),
    });
    
    // Give the logger time to write the log
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
}
