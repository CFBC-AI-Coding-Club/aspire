import { Context } from 'hono';
import db from '../services/db';

export const getLeaderboard = async (c: Context) => {
    const users = await db.user.findMany({
        orderBy: {
            balance: 'desc'
        },
        take: 10
    });
    return c.json(users);
};
