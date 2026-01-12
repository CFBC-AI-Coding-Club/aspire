import { Hono } from 'hono';
import { getProfile, getChildren, createChild, getUserById } from '../controllers/user-controller';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

router.get('/me', authMiddleware, getProfile);
router.get('/:id', authMiddleware, getUserById);
router.get('/children', authMiddleware, getChildren); // Parent only
router.post('/children', authMiddleware, createChild); // Parent only - create child account

export const userRoutes = router;
