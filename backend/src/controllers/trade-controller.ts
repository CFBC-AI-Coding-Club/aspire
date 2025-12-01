import { Context } from 'hono';
import db from '../services/db';
import { z } from 'zod';
import { publishTradeExecuted, publishStockUpdate } from '../services/redis-pubsub';
import { broadcast } from '..';

const TradeSchema = z.object({
  ticker: z.string(),
  action: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive()
});

export const makeTrade = async (c: Context) => {
  const authUser = c.get('user');
  if (!authUser) return c.json({ error: 'Unauthorized' }, 401); 

  const userId = authUser.id;
  
  try {
    const body = await c.req.json();
    const { ticker, action, quantity } = TradeSchema.parse(body);

    // Store stock price outside transaction scope
    let tradePrice = 0;

    // Transaction Logic (Atomic)
    const result = await db.$transaction(async (tx) => {
      const stock = await tx.stock.findUnique({ where: { ticker: ticker.toUpperCase() } });
      if (!stock) throw new Error('Stock not found');
      if (!stock.isActive) throw new Error('Stock is not active for trading');
      
      // Store price for use outside transaction
      tradePrice = stock.price;
      
      const total = stock.price * quantity;
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');
      if (!user.isActive) throw new Error('User account is inactive');

      if (action === 'BUY') {
        if (user.balance < total) {
          throw new Error(`Insufficient funds. Required: ${total.toFixed(2)}, Available: ${user.balance.toFixed(2)}`);
        }
      
        await tx.user.update({ where: { id: userId }, data: { balance: { decrement: total } } });
      
        const portfolio = await tx.portfolioItem.findUnique({ where: { userId_ticker: { userId, ticker: ticker.toUpperCase() } } });
        if (portfolio) {
          // Calculate weighted average price
          const newTotalCost = (portfolio.avgPrice * portfolio.quantity) + (stock.price * quantity);
          const newQuantity = portfolio.quantity + quantity;
          const newAvgPrice = newTotalCost / newQuantity;
          
          await tx.portfolioItem.update({
            where: { id: portfolio.id },
            data: { 
              quantity: { increment: quantity },
              avgPrice: newAvgPrice,
            }
          });
        } else {
          await tx.portfolioItem.create({
            data: { userId, ticker: ticker.toUpperCase(), quantity, avgPrice: stock.price }
          });
        }
      } else {
        // SELL Logic
        const portfolio = await tx.portfolioItem.findUnique({ where: { userId_ticker: { userId, ticker: ticker.toUpperCase() } } });
        if (!portfolio || portfolio.quantity < quantity) throw new Error('Not enough shares');
        
        await tx.user.update({ where: { id: userId }, data: { balance: { increment: total } } });
        
        if (portfolio.quantity === quantity) {
          // Remove portfolio item if selling all shares
          await tx.portfolioItem.delete({ where: { id: portfolio.id } });
        } else {
          await tx.portfolioItem.update({
            where: { id: portfolio.id },
            data: { quantity: { decrement: quantity } }
          });
        }
      }

      // Update stock volume and lastTradeDate
      await tx.stock.update({
        where: { ticker: ticker.toUpperCase() },
        data: {
          volume: { increment: quantity },
          lastTradeDate: new Date(),
        },
      });

      // Create price history snapshot
      await tx.stockPrice.create({
        data: {
          stockTicker: ticker.toUpperCase(),
          price: stock.price,
        },
      });

      return await tx.transaction.create({
        data: { userId, ticker: ticker.toUpperCase(), type: action, quantity, price: stock.price, total }
      });
    });

    // Fire and forget - don't await these, send response immediately
    setImmediate(() => {
      // Broadcast trade execution via WebSocket (non-blocking)
      try {
        broadcast("TRADE_EXECUTED", {
          userId,
          ticker: ticker.toUpperCase(),
          type: action,
          quantity,
          price: tradePrice,
          total: tradePrice * quantity,
          timestamp: result.timestamp.toISOString(),
        });
      } catch (broadcastError) {
        console.error('WebSocket broadcast error:', broadcastError);
      }

      // Publish to Redis (fire and forget)
      publishTradeExecuted({
        userId,
        ticker: ticker.toUpperCase(),
        type: action,
        quantity,
        price: tradePrice,
        total: tradePrice * quantity,
        timestamp: result.timestamp.toISOString(),
      }).catch(redisError => {
        console.error('Redis publish error:', redisError);
      });

      // Get updated stock info and publish (fire and forget)
      db.stock.findUnique({
        where: { ticker: ticker.toUpperCase() },
        select: { price: true, change: true, volume: true, lastTradeDate: true },
      }).then(updatedStock => {
        if (updatedStock) {
          publishStockUpdate({
            ticker: ticker.toUpperCase(),
            price: updatedStock.price,
            change: updatedStock.change,
            volume: updatedStock.volume,
            lastTradeDate: updatedStock.lastTradeDate?.toISOString() || null,
          }).catch(stockUpdateError => {
            console.error('Stock update publish error:', stockUpdateError);
          });
        }
      }).catch(stockFetchError => {
        console.error('Stock fetch error:', stockFetchError);
      });
    });

    // Return response immediately after transaction commits
    return c.json({ success: true, trade: result });
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.issues }, 400);
    }

    if (error instanceof Error) {
      const errorMessage = error.message;
      if (errorMessage.includes('Stock not found')) {
        return c.json({ error: errorMessage }, 404);
      }
      if (errorMessage.includes('Insufficient') || errorMessage.includes('Not enough')) {
        return c.json({ error: errorMessage }, 400);
      }
      if (errorMessage.includes('not active')) {
        return c.json({ error: errorMessage }, 400);
      }
    }
    console.error('Trade error:', error);
    return c.json({ error: 'Failed to execute trade' }, 500);
  }
};