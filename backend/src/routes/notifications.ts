import { Hono } from 'hono';
// import { getNotifications } from '../controllers/notification-controller';

const router = new Hono();

// router.get('/', getNotifications);

export const notificationRoutes = router;
