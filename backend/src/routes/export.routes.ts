import { Router } from 'express';
import { exportWorkouts } from '../controllers/export.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/workouts', authenticate, exportWorkouts);

export default router;
