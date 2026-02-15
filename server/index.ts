import express from 'express';
import next from 'next';
import cors from 'cors';
import { registerRoutes } from './routes';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5000;

app.prepare().then(async () => {
  const server = express();

  // Security Headers Middleware
  server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // X-Frame-Options omitted to prevent breaking Replit preview
    next();
  });

  // Strict CORS configuration
  const allowedOrigins = process.env.REPLIT_DOMAINS
    ? process.env.REPLIT_DOMAINS.split(',').map(d => `https://${d.trim().replace(/\/$/, '')}`)
    : [];

  // Add local development origins if needed
  if (dev) {
    allowedOrigins.push('http://localhost:5000');
    allowedOrigins.push('http://0.0.0.0:5000');
  }

  server.use(cors({
    // @ts-ignore - cors types don't support (req, origin, callback) signature but the library does
    origin: (req, origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Check if origin matches the request host (Same-Origin fallback)
      const host = req.get('host');
      if (host) {
        try {
          const originHost = new URL(origin).host;
          if (originHost === host) {
            return callback(null, true);
          }
        } catch (e) {
          // ignore invalid origin
        }
      }

      console.error(`CORS blocked origin: ${origin} (Host: ${host})`);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  const httpServer = await registerRoutes(server);

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`> Server ready on http://0.0.0.0:${PORT}`);
  });
});
