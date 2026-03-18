import { Router } from 'express';
import { logBodyMetrics, getBodyMetrics } from '../controllers/metric.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, logBodyMetrics);
router.get('/', authenticate, getBodyMetrics);

export default router;
