import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/db/schema.prisma",
  migrations: {
    path: "src/db/migrations",
    seed: "src/db/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
