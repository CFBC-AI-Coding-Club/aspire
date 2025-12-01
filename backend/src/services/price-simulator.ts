import db from "./db";
import { broadcast } from "..";
import { publishMarketUpdate, publishStockUpdate, publishPriceChange } from "./redis-pubsub";
import { Prisma } from "../db/generated/client";

export async function updatePrices() {
  const stocks = await db.stock.findMany({ where: { isActive: true } });

  const updatedStocks = stocks.map((stock) => {
    const change = (Math.random() - 0.5) * stock.volatility;
    const newPrice = Number((stock.price * (1 + change)).toFixed(2));
    const finalPrice = newPrice > 0.1 ? newPrice : stock.price;
    const priceChange = Number((finalPrice - stock.price).toFixed(2));

    return {
      ...stock,
      price: finalPrice,
      change: priceChange,
    };
  });

  try {
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await Promise.all(
        updatedStocks.map((stock) =>
          tx.stock.update({
            where: { id: stock.id },
            data: {
              price: stock.price,
              change: stock.change,
            },
          }),
        ),
      );

      await tx.stockPrice.createMany({
        data: updatedStocks.map((s) => ({
          stockTicker: s.ticker,
          price: s.price,
        })),
      });
    });

    // Broadcast via WebSocket
    broadcast("MARKET_UPDATE", {
      stocks: updatedStocks.map((s) => ({
        ticker: s.ticker,
        price: s.price,
        change: s.change,
        volume: s.volume,
        lastTradeDate: s.lastTradeDate,
      })),
    });

    
    await publishMarketUpdate({
      stocks: updatedStocks.map((s) => ({
        ticker: s.ticker,
        price: s.price,
        change: s.change,
        volume: s.volume,
        lastTradeDate: s.lastTradeDate,
      })),
    });

    
    for (const stock of updatedStocks) {
      if (stock.change !== 0) {
        const previousPrice = stock.price - stock.change;
        await publishPriceChange({
          ticker: stock.ticker,
          oldPrice: previousPrice,
          newPrice: stock.price,
          change: stock.change,
          changePercent: (stock.change / previousPrice) * 100,
        });
      }

      await publishStockUpdate({
        ticker: stock.ticker,
        price: stock.price,
        change: stock.change,
        volume: stock.volume,
        lastTradeDate: stock.lastTradeDate,
      });
    }
  } catch (e) {
    console.error("Transaction failed to update prices:", e);
  }
}
