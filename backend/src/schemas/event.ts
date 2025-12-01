import { z } from "zod";
import { Sentiment } from "../db/generated/client";

// uppercase inputs only
const SentimentInputSchema = z
  .string()
  .toUpperCase()
  .pipe(
    z.nativeEnum(Sentiment, {
      message: "Sentiment must be POSITIVE, NEGATIVE, or NEUTRAL.",
    }),
  );

export const eventSchema = z.object({
  headline: z.string().min(5, "Headline must be at least 5 characters long."),
  summary: z.string().min(10, "Summary must be at least 10 characters long."),
  sector_applied: z.string().min(1, "Sector is required.").toUpperCase(),
  magnitude: z
    .number()
    .min(-1.0, "Magnitude must be between -1.0 and 1.0.")
    .max(1.0),
  duration: z.number().int().positive("Duration must be a positive integer."),
  sentiment: SentimentInputSchema,
});

export type NewsEventPayload = z.infer<typeof eventSchema>;
