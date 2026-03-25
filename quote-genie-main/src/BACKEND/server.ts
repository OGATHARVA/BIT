import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Import routes
import quotationRoutes from './routes/quotation.js';
import proposalRoutes from './routes/proposal.js';
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/file.js';
import healthRoutes from './routes/health.js';
import generatorRoutes from './routes/generator.js';

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.use('/api/health', healthRoutes);

// API Routes
app.use('/api/quotations', quotationRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/generator', generatorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:8080'}`);
});

export default app;
