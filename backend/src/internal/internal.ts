// src/routes/internal.ts

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { Prisma } from "../db/generated/client";
import { prisma } from "../db/prisma";
import { eventSchema, type NewsEventPayload } from "../schemas/event";

// import { redisClient } from '../services/redis-client'; // future

const internalRouter = new Hono();

internalRouter.get("/market-data", async (c) => {
	try {
		const rawMarketData = await prisma.stock.findMany({
			// make sure only relevant data is selected
			select: {
				ticker: true,
				sector: true,
				name: true,
				price: true,
				history: true,
			},
		});
		return c.json(rawMarketData);
	} catch (error) {
		console.error("Error fetching market data for AI:", error);
		return c.json({ error: "Failed to fetch market data." }, 500);
	}
});

internalRouter.post(
	"/events/create",
	zValidator("json", eventSchema),
	async (c) => {
		const payload = c.req.valid("json") as NewsEventPayload;

		try {
			const result = await prisma.$transaction(
				async (tx: Prisma.TransactionClient) => {
					const newsEvent = await tx.newsEvent.create({
						data: {
							headline: payload.headline,
							summary: payload.summary,
							sector: payload.sector_applied,
							magnitude: payload.magnitude,
							duration: payload.duration,
							sentiment: payload.sentiment,
						},
					});

					const targetSector = payload.sector_applied.toUpperCase();

					const updatedCount = await tx.$executeRaw`
                UPDATE "Stock"
                SET price = price * (1 + ${payload.magnitude})
                -- CRITICAL FIX: Ensure the sector value matches the DB casing exactly.
                -- If your DB sectors are 'Banking', 'Telecom', this must match.
                WHERE sector = ${targetSector};
            `;

					const updatedStocks = await tx.stock.findMany({
						where: { sector: targetSector },
						select: { ticker: true, price: true },
					});

					await tx.stockPrice.createMany({
						data: updatedStocks.map((s) => ({
							stockTicker: s.ticker,
							price: s.price,
							// time is just now()
						})),
					});

					return { newsEvent, updatedCount: updatedStocks.length };
				},
			);

			// Future
			// await redisClient.publish('market-updates', JSON.stringify({
			//     news: result.newsEvent,
			//     count: result.updatedCount
			// }));

			console.log(
				`[EVENT] ${payload.headline} applied to ${result.updatedCount} stocks.`,
			);

			return c.json(
				{
					message:
						"Event created, market changes applied, and broadcast initiated.",
					event_id: result.newsEvent.id,
					stocks_affected: Number(result.updatedCount),
				},
				201,
			); // 201 means created successfully
		} catch (error) {
			console.error("Prisma Transaction Error:", error);
			// 500 means db transaction failed.
			return c.json(
				{ error: "Failed to process market event due to transaction failure." },
				500,
			);
		}
	},
);

export { internalRouter };
