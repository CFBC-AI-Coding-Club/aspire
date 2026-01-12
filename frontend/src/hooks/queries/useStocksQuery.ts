import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stocksAPI } from "../../lib/api";

// Query keys factory - React Compiler friendly (no inline objects)
export const stockKeys = {
  all: ["stocks"] as const,
  lists: () => [...stockKeys.all, "list"] as const,
  list: (active?: boolean) => [...stockKeys.lists(), { active }] as const,
  details: () => [...stockKeys.all, "detail"] as const,
  detail: (ticker: string) => [...stockKeys.details(), ticker] as const,
  history: (ticker: string) => [...stockKeys.all, "history", ticker] as const,
};

// Get all stocks
export function useStocksQuery(active = true) {
  return useQuery({
    queryKey: stockKeys.list(active),
    queryFn: () => stocksAPI.getAll(active),
    staleTime: 30_000, // 30 seconds
  });
}

// Get stock by ticker
export function useStockQuery(ticker: string) {
  return useQuery({
    queryKey: stockKeys.detail(ticker),
    queryFn: () => stocksAPI.getByTicker(ticker),
    enabled: Boolean(ticker),
    staleTime: 10_000, // 10 seconds
  });
}

// Get stock price history
export function useStockHistoryQuery(ticker: string) {
  return useQuery({
    queryKey: stockKeys.history(ticker),
    queryFn: () => stocksAPI.getHistory(ticker),
    enabled: Boolean(ticker),
    staleTime: 5_000, // 5 seconds - more frequent updates for real-time data
  });
}

// Create stock mutation (admin only)
export function useCreateStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      ticker: string;
      name: string;
      sector: string;
      price: number;
      description?: string;
      volatility?: "low" | "medium" | "high";
    }) => stocksAPI.create(data),
    onSuccess: () => {
      // Invalidate and refetch stocks list
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}

// Update stock mutation (admin only)
export function useUpdateStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      ticker: string;
      updates: {
        name?: string;
        sector?: string;
        price?: number;
        description?: string;
        volatility?: "low" | "medium" | "high";
      };
    }) => stocksAPI.update(data.ticker, data.updates),
    onSuccess: (_, variables) => {
      // Invalidate specific stock and lists
      queryClient.invalidateQueries({
        queryKey: stockKeys.detail(variables.ticker),
      });
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}

// Delete stock mutation (admin only)
export function useDeleteStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticker: string) => stocksAPI.delete(ticker),
    onSuccess: (_, ticker) => {
      // Remove stock from cache and invalidate lists
      queryClient.removeQueries({ queryKey: stockKeys.detail(ticker) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}
