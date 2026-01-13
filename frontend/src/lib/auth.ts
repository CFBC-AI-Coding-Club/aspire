import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_BACKEND_URL ?? "http://localhost:5491",
	fetchOptions: {
		credentials: "include", // Ensure cookies are sent with all auth requests
	},
});

export const { signIn, signUp, signOut, useSession } = authClient;
