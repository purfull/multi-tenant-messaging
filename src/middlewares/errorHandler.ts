import type { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('error:', err);

  const status = err.status || err.code || 500;
  const message = err.message || 'internal server error';

  res.status(status).json({ success: false, error: message });
};
