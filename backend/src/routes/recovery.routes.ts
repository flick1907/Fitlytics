import { Router } from 'express';
import { getRecoveryStatus } from '../controllers/recovery.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/status', authenticate, getRecoveryStatus);

export default router;
