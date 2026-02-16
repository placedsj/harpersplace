import express from 'express';
import next from 'next';
import cors from 'cors';
import { createCorsOriginCheck } from './security';
import { registerRoutes } from './routes';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5000;

app.prepare().then(async () => {
  const server = express();

  const allowedDomains = (process.env.REPLIT_DOMAINS?.split(',') || []).filter(Boolean);

  if (dev) {
    allowedDomains.push('localhost:3000', 'localhost:5000', '127.0.0.1:3000', '127.0.0.1:5000');
  }

  server.use(cors({
    origin: createCorsOriginCheck(allowedDomains),
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
