import { Router } from 'express';
import { 
  getInsights, 
  getWorkoutHeatmap, 
  getPersonalRecords, 
  getTimeline, 
  getExerciseProgress, 
  getTrainingVolume 
} from '../controllers/analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/insights', authenticate, getInsights);
router.get('/heatmap', authenticate, getWorkoutHeatmap);
router.get('/records', authenticate, getPersonalRecords);
router.get('/timeline', authenticate, getTimeline);
router.get('/exercise-progress/:exercise', authenticate, getExerciseProgress);
router.get('/training-volume', authenticate, getTrainingVolume);

export default router;
