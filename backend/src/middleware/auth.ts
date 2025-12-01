import { Context, Next } from 'hono';
import { Role } from '../db/generated/enums';
import db from '../services/db';
import { auth } from '../lib/auth';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Get session from better-auth using the request
    // Better-auth automatically reads cookies from headers
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session?.user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user from database to check role and active status
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return c.json({ error: 'User not found or inactive' }, 403);
    }

    c.set('user', { id: user.id, role: user.role });
    await next();
  } catch (e) {
    console.error('Auth middleware error:', e);
    return c.json({ error: 'Unauthorized' }, 401);
  }
};

export const adminMiddleware = async (c: Context, next: Next) => {
  const authUser = c.get('user');
  if (!authUser) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  if (authUser.role !== Role.ADMIN) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
};