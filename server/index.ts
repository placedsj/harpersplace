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

  // Parse allowed origins from REPLIT_DOMAINS
  const allowedOrigins = (process.env.REPLIT_DOMAINS || '').split(',').map(d => `https://${d.trim()}`);

  // In development, allow localhost/0.0.0.0
  if (dev) {
    allowedOrigins.push(`http://0.0.0.0:${PORT}`);
    allowedOrigins.push(`http://localhost:${PORT}`);
  }

  server.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In dev, allow any localhost/0.0.0.0 origin for flexibility
      if (dev && (origin.startsWith('http://localhost') || origin.startsWith('http://0.0.0.0'))) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // Create a structured error for CORS failure but don't leak details to client in production
        const msg = dev ? `The CORS policy for this site does not allow access from the specified Origin: ${origin}` : 'Not allowed by CORS';
        callback(new Error(msg));
      }
    },
    credentials: true,
  }));

  // Add security headers
  server.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

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
