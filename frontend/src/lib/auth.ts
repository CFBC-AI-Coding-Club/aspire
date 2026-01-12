import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	baseURL: process.env.AUTH_BASE_URL ?? "http://localhost:5491",
});

export const { signIn, signUp, signOut, useSession, } = authClient;
