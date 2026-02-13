import express from 'express';
import next from 'next';
import { registerRoutes } from './routes';
import { setupSecurity } from './security';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 5000;

app.prepare().then(async () => {
  const server = express();

  setupSecurity(server);

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
