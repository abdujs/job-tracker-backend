import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import { Request, Response, NextFunction } from 'express';

/**
 * Main entry point for the Job Tracker backend API.
 *
 * @fileoverview
 * - Sets up Express application and middleware
 * - Registers user and job routes
 * - Loads environment variables
 * - Starts the HTTP server
 *
 * @module app
 */

dotenv.config();

const app = express();
app.use(express.json());

/**
 * Health check endpoint.
 * @route GET /
 * @returns {string} Confirmation that API is running.
 */
app.get('/', (_, res) => {
  res.send('API is running');
});


app.use(userRoutes);
app.use(jobRoutes);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    details: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
