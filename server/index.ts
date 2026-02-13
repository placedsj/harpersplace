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

  server.use(cors({
    origin: true,
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
