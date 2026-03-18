import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import workoutRoutes from './routes/workout.routes';
import progressRoutes from './routes/progress.routes';
import goalRoutes from './routes/goal.routes';
import statsRoutes from './routes/stats.routes';
import analyticsRoutes from './routes/analytics.routes';
import exportRoutes from './routes/export.routes';
import recommendationRoutes from './routes/recommendation.routes';
import recoveryRoutes from './routes/recovery.routes';
import planRoutes from './routes/plan.routes';
import metricRoutes from './routes/metric.routes';
import libraryRoutes from './routes/library.routes';

const app = express();

// Middleware - CORS FIRST
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.includes("localhost")) {
        return callback(null, true);
      }

      // Allow ANY vercel deployment
      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// VERY IMPORTANT (preflight fix)
app.options("*", cors());

// then express.json()
app.use(express.json());

// Request Logging - DEBUG
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/recovery', recoveryRoutes);
app.use('/api/workout-plan', planRoutes);
app.use('/api/body-metrics', metricRoutes);
app.use('/api/exercises', libraryRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

});

export default app;
