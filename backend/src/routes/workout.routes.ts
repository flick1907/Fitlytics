import { Router } from 'express';
import { logWorkout, getWorkouts, deleteWorkout } from '../controllers/workout.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/log', authenticate, logWorkout);
router.get('/', authenticate, getWorkouts);
router.delete('/:id', authenticate, deleteWorkout);

export default router;
