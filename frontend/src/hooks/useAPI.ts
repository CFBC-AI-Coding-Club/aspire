/**
 * API Hook
 *
 * DEPRECATED: Use the new API utilities and query hooks instead:
 *
 * API Utilities (in /lib/api.ts):
 * - stocksAPI.getAll()
 * - usersAPI.getProfile()
 * - tradesAPI.execute()
 *
 * Query Hooks (in /hooks/queries/):
 * - useStocksQuery()
 * - useUserProfileQuery()
 * - useExecuteTradeMutation()
 *
 * This file is kept for backwards compatibility only.
 */

import { apiFetch } from "../lib/api";

interface UseAPIOptions {
  data: {
    method: string;
    endpoint: string;
    body?: any;
  };
}

/**
 * @deprecated Use the new API utilities from /lib/api.ts instead
 */
export async function useAPI({ data }: UseAPIOptions) {
  const { method, endpoint, body } = data;

  return apiFetch(endpoint, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
}

// Re-export API utilities for convenience
export { stocksAPI, usersAPI, tradesAPI } from "../lib/api";
