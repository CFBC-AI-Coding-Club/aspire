import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { 
    getStocks, 
    getStockHistory,
    getStockByTickerHandler,
    createStockHandler,
    updateStockHandler,
    deleteStockHandler
} from '../controllers/stock-controller';
import { stockSchema, stockUpdateSchema } from '../schemas/stock';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = new Hono();

// GET routes (public)
router.get('/', getStocks);
router.get('/:ticker', getStockByTickerHandler);
router.get('/:ticker/history', getStockHistory);

// POST route with validation (admin only)
router.post(
    '/', 
    authMiddleware,
    adminMiddleware,
    zValidator('json', stockSchema),
    createStockHandler
);

// PUT route with validation (admin only)
router.put(
    '/:ticker', 
    authMiddleware,
    adminMiddleware,
    zValidator('json', stockUpdateSchema),
    updateStockHandler
);

// DELETE route (admin only)
router.delete('/:ticker', authMiddleware, adminMiddleware, deleteStockHandler);


export const stockRoutes = router;