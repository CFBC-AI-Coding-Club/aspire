import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	getSystemStats,
} from '../controllers/admin-controller';

const router = new Hono();

router.use('*', authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/stats', getSystemStats);

export const adminRoutes = router;

