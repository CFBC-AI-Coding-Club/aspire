import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "STUDENT",
      },
      parentId: {
        type: "string",
        required: false,
      },
    }
  },
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5491",
  basePath: "/api/auth",
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:7823",
    "http://localhost:5491",
    "https://aspire.fraimer.dev",
    "https://aspire-api.fraimer.dev",
  ],
});
