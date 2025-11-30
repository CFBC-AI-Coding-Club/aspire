import { createServerFn } from "@tanstack/react-start";

const AUTH_API_URL = "http://localhost:8080";

export interface AuthInfo {
  user?: {
    id: string;
    username: string;
    email: string;
  };
  authenticated: boolean;
  token?: string;
}

export const getAuthInfo = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const response = await fetch(AUTH_API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch auth info: ${response.statusText}`);
      }

      const authInfo: AuthInfo = await response.json();
      return authInfo;
    } catch (error) {
      console.error("Error fetching auth information:", error);
      throw error;
    }
  },
);
