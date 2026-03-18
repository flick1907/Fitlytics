import { Router } from 'express';
import { getWorkoutRecommendations } from '../controllers/recommendation.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/workout', authenticate, getWorkoutRecommendations);

export default router;
