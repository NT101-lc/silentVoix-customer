import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients and configured browser origins.
      if (!origin || env.frontendOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    credentials: true
  })
);
app.use(express.json());

app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

app.get('/', (_req, res) => {
  res.type('text/plain').status(200).send('SilentVoix backend is running');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend API listening on port ${env.port}`);
});
