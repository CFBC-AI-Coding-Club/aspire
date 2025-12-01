import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { makeTrade } from '../controllers/trade-controller';

const router = new Hono();

router.post('/', authMiddleware, makeTrade);

export const tradeRoutes = router;
