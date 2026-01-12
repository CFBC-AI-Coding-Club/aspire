import { authClient } from "./auth";

export const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5491/api";

// Helper to get auth token
async function getAuthToken() {
  const session = await authClient.getSession();
  return session.data?.session?.token;
}

// Generic API fetch wrapper with authentication
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }

  return response.json();
}

// Stocks API
export const stocksAPI = {
  getAll: (active?: boolean) => {
    const params = new URLSearchParams();
    if (active !== undefined) {
      params.append("active", String(active));
    }
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiFetch(`/stocks${query}`);
  },

  getByTicker: (ticker: string) => {
    return apiFetch(`/stocks/${ticker.toUpperCase()}`);
  },

  getHistory: (ticker: string) => {
    return apiFetch(`/stocks/${ticker.toUpperCase()}/history`);
  },

  create: (data: {
    ticker: string;
    name: string;
    sector: string;
    price: number;
    description?: string;
    volatility?: "low" | "medium" | "high";
  }) => {
    return apiFetch("/stocks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (ticker: string, updates: any) => {
    return apiFetch(`/stocks/${ticker.toUpperCase()}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  delete: (ticker: string) => {
    return apiFetch(`/stocks/${ticker.toUpperCase()}`, {
      method: "DELETE",
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: () => {
    return apiFetch("/users/me");
  },

  getById: (userId: string) => {
    return apiFetch(`/users/${userId}`);
  },

  getChildren: () => {
    return apiFetch("/users/children");
  },

  createChild: (data: {
    name: string;
    age: number;
    email: string;
    password: string;
  }) => {
    return apiFetch("/users/children", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// Trades API
export const tradesAPI = {
  execute: (data: {
    ticker: string;
    action: "BUY" | "SELL";
    quantity: number;
  }) => {
    return apiFetch("/trades", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
