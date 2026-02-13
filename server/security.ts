import cors from 'cors';
import { type Express, type Request, type Response, type NextFunction } from 'express';

export function setupSecurity(app: Express) {
  const allowedOrigins = (process.env.REPLIT_DOMAINS || '')
    .split(',')
    .map((d) => d.trim())
    .filter((d) => d.length > 0)
    .map((d) => `https://${d}`);

  if (process.env.REPLIT_DEV_DOMAIN) {
    allowedOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
  }

  // CORS Configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      const isDev = process.env.NODE_ENV !== 'production';

      if (allowedOrigins.indexOf(origin) !== -1 || isDev) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  // Security Headers Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    next();
  });
}
