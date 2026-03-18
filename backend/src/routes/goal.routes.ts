import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createGoal);
router.get('/', authenticate, getGoals);
router.put('/:id', authenticate, updateGoal);
router.delete('/:id', authenticate, deleteGoal);

export default router;
