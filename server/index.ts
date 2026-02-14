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

  // Parse allowed origins from REPLIT_DOMAINS environment variable
  const allowedOrigins = (process.env.REPLIT_DOMAINS || "").split(",").filter(Boolean).map(d => `https://${d.trim()}`);

  // Allow local development origins
  if (process.env.NODE_ENV !== "production") {
    allowedOrigins.push(`http://0.0.0.0:${PORT}`);
    allowedOrigins.push(`http://localhost:${PORT}`);
    allowedOrigins.push(`http://127.0.0.1:${PORT}`);
  }

  server.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check for exact match or subdomain match
      if (allowedOrigins.includes(origin) || allowedOrigins.some(allowed => {
        const domain = allowed.split("://")[1];
        return origin.endsWith(`.${domain}`) && origin.startsWith(allowed.split("://")[0]); // Ensure protocol matches too
      })) {
        return callback(null, true);
      }

      // If we are in dev mode and strict check failed, log it but maybe allow it if it looks like localhost?
      // But we added localhost to allowedOrigins, so strict check should pass.

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }));

  // Security headers middleware
  server.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN"); // Allow framing by same origin (e.g. Replit)
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
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
