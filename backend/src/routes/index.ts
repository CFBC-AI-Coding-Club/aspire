import { Hono } from 'hono';
import { userRoutes } from './users';
import { stockRoutes } from './stocks';
import { tradeRoutes } from './trades';
import { aiRoutes } from './ai';
import { adminRoutes } from './admin';
import { leaderboardRoutes } from './leaderboards';
import { internalRouter } from '../internal/internal';
import { showRoutes } from 'hono/dev';

export const apiRouter = new Hono();

apiRouter.route('/users', userRoutes);
apiRouter.route('/stocks', stockRoutes);
apiRouter.route('/trades', tradeRoutes);
apiRouter.route('/ai', aiRoutes);
apiRouter.route('/admin', adminRoutes);
apiRouter.route('/leaderboard', leaderboardRoutes);
apiRouter.route('/internal', internalRouter);

showRoutes(apiRouter);

