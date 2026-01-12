import { useQuery } from "@tanstack/react-query";
import { leaderboardAPI } from "../../lib/api";

// Query keys factory
export const leaderboardKeys = {
  all: ["leaderboard"] as const,
  list: () => [...leaderboardKeys.all, "list"] as const,
};

// Get leaderboard data
export function useLeaderboardQuery() {
  return useQuery({
    queryKey: leaderboardKeys.list(),
    queryFn: () => leaderboardAPI.getAll(),
    staleTime: 60_000, // 1 minute
  });
}

