import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

interface AppError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
  kind?: string;
}

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error: AppError = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Express identifies error-handling middleware by arity (4 params), so req and next
// must stay in the signature even though this handler doesn't use them.
export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction
): void => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Server Error';

  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.code === 11000 && err.keyValue) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
