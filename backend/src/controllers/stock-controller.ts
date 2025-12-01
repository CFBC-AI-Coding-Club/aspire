// src/controllers/stock-controller.ts

import { Context } from 'hono';
import db from '../services/db'; 
import { stockCreateType, stockUpdateType } from "../schemas/stock"; 

import { 
    createStock, 
    findStockByTicker, 
    updateStock, 
    deleteStock 
} from '../services/stock-service'; 


export const getStocks = async (c: Context) => {
    try {
        const isActive = c.req.query('active');
        const where = isActive === 'false' ? { isActive: false } : { isActive: true };
        
        const stocks = await db.stock.findMany({ 
            where,
            orderBy: { ticker: 'asc' },
            select: {
                id: true,
                ticker: true,
                name: true,
                sector: true,
                price: true,
                change: true,
                volume: true,
                volatility: true,
                description: true,
                lastTradeDate: true,
                isActive: true,
                createdAt: true,
            }
        });
        return c.json(stocks);
    } catch (error) {
        console.error('Error fetching all stocks:', error);
        return c.json({ error: 'Failed to retrieve stock list' }, 500);
    }
};


export const getStockHistory = async (c: Context) => {
    const ticker = c.req.param('ticker'); 
    
    if (!ticker) {
        return c.json({ error: 'Ticker is required' }, 400); 
    }

    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)); 

    try {
        const history = await db.stockPrice.findMany({
            where: {
                stockTicker: ticker.toUpperCase(), 
                timestamp: {
                    gt: twentyFourHoursAgo, 
                },
            },
            orderBy: {
                timestamp: 'asc', 
            },
            select: {
                price: true,
                timestamp: true,
            },
        });

        if (history.length === 0) {
            return c.json({ error: `No price history found for ticker ${ticker} in the last 24 hours` }, 404);
        }

        return c.json(history);

    } catch (error) {
        console.error('Error fetching stock history:', error);
        return c.json({ error: 'Failed to retrieve stock history' }, 500);
    }
};

export const getStockByTickerHandler = async (c: Context) => {
    const ticker = c.req.param('ticker'); 

    try {
        const stock = await db.stock.findUnique({
            where: { ticker: ticker.toUpperCase() },
            include: {
                history: {
                    take: 100,
                    orderBy: { timestamp: 'desc' },
                    select: {
                        price: true,
                        timestamp: true,
                    },
                },
            },
        });

        if (!stock) {
            return c.json({ error: `Stock with ticker ${ticker} not found.` }, 404);
        }

        // Calculate additional stats
        const recentTrades = await db.transaction.findMany({
            where: { ticker: ticker.toUpperCase() },
            orderBy: { timestamp: 'desc' },
            take: 10,
            select: {
                type: true,
                quantity: true,
                price: true,
                timestamp: true,
            },
        });

        return c.json({
            ...stock,
            recentTrades,
        });
    } catch (error) {
        console.error('Handler Error:', error);
        return c.json({ error: 'Failed to retrieve stock data.' }, 500);
    }
};


// 4. POST /stocks: Create a new stock (Admin only)
export const createStockHandler = async (c: Context) => {
    const stockData = c.req.valid('json' as never) as stockCreateType; 

    try {
        const newStock = await createStock(stockData); 
        return c.json(newStock, 201); // 201 Created
    } catch (error) {

        if (error instanceof Error && error.message.includes('already exists')) {
            return c.json({ error: error.message }, 409); 
        }
        console.error('Handler Error:', error);
        return c.json({ error: 'Could not create stock.' }, 500);
    }
};


export const updateStockHandler =  async (c: Context) => {
    const ticker = c.req.param('ticker');
    const updateData = c.req.valid('json' as never) as stockUpdateType; 

    try {
        const updatedStock = await updateStock(ticker.toUpperCase(), updateData);

        if (!updatedStock) {
            return c.json({ error: `Stock with ticker ${ticker} not found.` }, 404);
        }

        return c.json(updatedStock);
    } catch (error) {
        if (error instanceof Error && error.message.includes('No valid data')) {
            return c.json({ error: error.message }, 400); 
        }
        console.error('Handler Error:', error);
        return c.json({ error: 'Could not update stock.' }, 500);
    }
};



export const deleteStockHandler = async (c: Context) => {
    const ticker = c.req.param('ticker');

    try {
        // The service function handles P2025 (Not Found) internally and returns null
        const deletedStock = await deleteStock(ticker.toUpperCase());

        if (!deletedStock) {
            return c.json({ error: `Stock with ticker ${ticker} not found.` }, 404);
        }

        return c.json({ message: `Stock ${ticker} and its history successfully deleted.` }, 200); 

    } catch (error) {
        console.error('Handler Error:', error);
        return c.json({ error: 'Failed to delete stock.' }, 500);
    }
};
