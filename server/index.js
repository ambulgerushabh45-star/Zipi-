import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import inquiryRoutes from './routes/inquiries.js';
import orderRoutes from './routes/orders.js';
import { verifySmtp } from './utils/mailer.js';

// Always load .env from the server folder even if started from another working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zipi';
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5174,http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();

app.use(helmet());

app.use(
  cors({
    origin(reqOrigin, callback) {
      if (!reqOrigin || ALLOWED_ORIGINS.includes(reqOrigin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-admin-key'],
  })
);

app.use(express.json({ limit: '50kb' }));

// JSON parse and body-limit error handling
app.use((err, _req, res, next) => {
  if (err?.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request payload exceeds the 50kb limit.' });
  }
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Malformed JSON payload.' });
  }
  return next(err);
});

app.get('/api/health', (_req, res) => {
  const readyState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const db = states[readyState] || 'unknown';
  const ok = readyState === 1;
  return res.status(ok ? 200 : 503).json({ ok, db });
});

app.use('/api', inquiryRoutes);
app.use('/api', orderRoutes);

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB (${mongoose.connection.name})`);
  } catch (err) {
    console.error('Initial MongoDB connection error:', err?.message || err);
  }

  // Verify SMTP connectivity if configured
  await verifySmtp();

  app.listen(PORT, () => {
    console.log(`ZIPI Drones & Controls API listening on http://localhost:${PORT}`);
  });
}

start();
