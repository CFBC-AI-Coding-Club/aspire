import { Context } from 'hono';
import db from '../services/db';

export const getNotifications = async (c: Context) => {
    const userId = c.get('user').id;
    const notifications = await db.notification.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
    return c.json(notifications);
};
