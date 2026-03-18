import { Router } from 'express';
import { createWorkoutPlan, getWorkoutPlans, deleteWorkoutPlan } from '../controllers/plan.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createWorkoutPlan);
router.get('/', authenticate, getWorkoutPlans);
router.delete('/:id', authenticate, deleteWorkoutPlan);

export default router;
