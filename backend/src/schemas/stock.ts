import { z } from 'zod';

export const stockSchema = z.object ({
    ticker: z.string().min(2, "Ticker must be at least 2 characters long").max(25, "Ticker cannot be more than 25 characters").toUpperCase(),
    name: z.string().min(4, "Name must be at least 4 characters long").max(150, "Name cannot be more than 150 characters"),
    sector: z.string().min(3, "Sector must at least 3 characters long").max(50, "Sector cannot be more than 50 characters").toUpperCase(),
    price: z.number().min(0.01, "Price must be at least $0.01").max(200, "Price cannot be more than $200"),
    change: z.number().optional().default(0.00),
    volume: z.number().int().min(0).optional().default(0),
    volatility: z.number().min(0.01, "Volatility must be at least 0.01").max(1, "Volatility cannot be more than 1"),
    description: z.string()
        .min(10, "Description must be at least 10 characters long")
        .max(250, "Description cannot be more than 250 characters long")
        .optional(),
    isActive: z.boolean().optional().default(true),
})



export const stockUpdateSchema = stockSchema.partial();

export type stockUpdateType = z.infer<typeof stockUpdateSchema>;

export type stockCreateType = z.infer<typeof stockSchema>;