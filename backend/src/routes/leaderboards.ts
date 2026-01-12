import { Hono } from 'hono';
import { getLeaderboard } from '../controllers/leaderboard-controller';

const router = new Hono();

router.get('/', getLeaderboard);

export const leaderboardRoutes = router;
