export type Stock = {
  id: string;
  ticker: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  sector: string;
  volatility: "low" | "medium" | "high";
  description?: string;
};
