import { Hono } from 'hono';
import { getProfile, getChildren, createChild } from '../controllers/user-controller';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

// Note: login and register are now handled by better-auth at /api/auth/*
router.get('/me', authMiddleware, getProfile);
router.get('/children', authMiddleware, getChildren); // Parent only
router.post('/children', authMiddleware, createChild); // Parent only - create child account

export const userRoutes = router;
