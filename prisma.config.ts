import path from "path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("src", "database", "schema"),
  migrations: {
    path: path.join("src", "database", "migrations"),
    seed: path.join("src", "database", "seed"),
  },
});
