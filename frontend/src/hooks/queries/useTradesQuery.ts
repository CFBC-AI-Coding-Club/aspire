import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tradesAPI } from "../../lib/api";
import { stockKeys } from "./useStocksQuery";
import { userKeys } from "./useUsersQuery";

// Execute trade mutation
export function useExecuteTradeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      ticker: string;
      action: "BUY" | "SELL";
      quantity: number;
    }) => tradesAPI.execute(data),
    onSuccess: () => {
      // Invalidate user profile (balance, portfolio value)
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });

      // Invalidate stocks list (to refresh prices)
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}
