import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { getAiAdvice } from '../controllers/ai-controller';

const router = new Hono();

// GET /api/ai/coach
router.get('/coach', authMiddleware, getAiAdvice);

export const aiRoutes = router;
