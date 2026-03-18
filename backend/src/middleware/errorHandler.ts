import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = (err as any).status || 500;
  const isDev = env.NODE_ENV === 'development';

  console.error(`[Error] ${err.name}: ${err.message}`);
  if (isDev) {
    console.error('Stack:', err.stack);
  }

  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : err.name,
    message: isDev || statusCode < 500 ? err.message : 'Something went wrong on our end',
    ...(isDev && { stack: err.stack }),
  });
};
