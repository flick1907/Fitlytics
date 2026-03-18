import { Router } from 'express';
import { createProgress, getProgress } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createProgress);
router.get('/', authenticate, getProgress);

export default router;
