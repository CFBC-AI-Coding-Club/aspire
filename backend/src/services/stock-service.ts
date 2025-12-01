import db from "./db";
import { Prisma, Stock, StockPrice } from "../db/generated/client";
import { z } from "zod";
import {
  stockSchema,
  stockUpdateSchema,
  stockUpdateType,
  stockCreateType,
} from "../schemas/stock";

export async function createStock(stockData: stockCreateType): Promise<Stock> {
  const validatedData = stockSchema.parse(stockData);

  const stockPayload = {
    ...validatedData,
    description: validatedData.description ?? null,
    change: validatedData.change ?? 0.00,
    volume: validatedData.volume ?? 0,
    isActive: validatedData.isActive ?? true,
  };

  try {
    const [newStock] = await db.$transaction(async (tx) => {
      const stock = await tx.stock.create({
        data: stockPayload,
      });

      await tx.stockPrice.create({
        data: {
          stockTicker: stock.ticker,
          price: stock.price,
        },
      });

      return [stock];
    });

    console.log(
      `Successfully created new stock: ${newStock.ticker} and initial price snapshot.`,
    );
    return newStock;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error(
        `Stock creation failed: The ticker '${stockData.ticker}' already exists.`,
      );
    }
    console.error("Prisma Error:", error);
    throw new Error("An unexpected error occurred during stock creation.");
  }
}

export async function findStockByTicker(ticker: string): Promise<Stock | null> {
  try {
    const stock = await db.stock.findUnique({
      where: {
        ticker: ticker,
      },
    });
    return stock;
  } catch (error) {
    console.error(
      `[DB ERROR] Failed to find ${ticker} stock by ticker:`,
      error,
    );
    throw new Error(`Database operation failed when querying stock ${ticker}.`);
  }
}

export async function deleteStock(ticker: string): Promise<Stock | null> {
  try {
    const [, stockDeletionResult] = await db.$transaction([
      db.stockPrice.deleteMany({
        where: { stockTicker: ticker },
      }),
      db.stock.delete({
        where: { ticker: ticker },
      }),
    ]);
    return stockDeletionResult;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log(`Deletion skipped: Stock with ticker ${ticker} not found.`);
      return null;
    }
    console.error(`[DB ERROR] Failed to delete stock ${ticker}:`, error);
    throw new Error(
      `Critical database error during deletion of stock ${ticker}.`,
    );
  }
}

export async function updateStock(
  ticker: string,
  updateData: stockUpdateType,
): Promise<Stock | null> {
  const validatedData = stockUpdateSchema.parse(updateData);

  if (Object.keys(validatedData).length === 0) {
    throw new Error("No valid data provided for stock update.");
  }

  const isPriceUpdated = validatedData.price !== undefined;

  try {
    const [updatedStock] = await db.$transaction(async (tx) => {
      const stock = await tx.stock.update({
        where: { ticker: ticker },
        data: validatedData,
      });

      if (isPriceUpdated) {
        await tx.stockPrice.create({
          data: {
            stockTicker: stock.ticker,
            price: stock.price,
          },
        });
      }
      return [stock];
    });

    return updatedStock;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log(`Update skipped: Stock with ticker ${ticker} not found.`);
      return null;
    }

    console.error(`[DB ERROR] Failed to update stock ${ticker}:`, error);
    throw new Error(
      `Database operation failed during update of stock ${ticker}.`,
    );
  }
}
