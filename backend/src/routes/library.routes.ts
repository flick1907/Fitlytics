import { Router } from 'express';
import { getExercises } from '../controllers/library.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getExercises);

export default router;
