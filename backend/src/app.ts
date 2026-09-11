import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth';
import childrenRoutes from './routes/children';
import recordRoutes from './routes/records';
import dashboardRoutes from './routes/dashboard';
import healthRoutes from './routes/health';
import pushRoutes from './routes/pushRoutes';

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { status: 'error', message: 'Muitas requisições. Tente novamente em 15 minutos.' },
});
app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { status: 'error', message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api', recordRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', healthRoutes);
app.use('/api/push', pushRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
