import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

export const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5,
  message: (req: Request, res: Response) => {
    return res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
  standardHeaders: true, 
  legacyHeaders: false,
});
