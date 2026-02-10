import express from 'express';
import next from 'next';
import cors from 'cors';
import { registerRoutes } from './routes';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = parseInt(process.env.PORT || '5000', 10);

app.prepare().then(async () => {
  const server = express();

  server.use(cors({
    origin: true,
    credentials: true,
  }));

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Security headers middleware
  server.use((req, res, next) => {
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  const httpServer = await registerRoutes(server);

  server.use((req, res) => {
    return handle(req, res);
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`> Server ready on http://0.0.0.0:${PORT}`);
  });
});
