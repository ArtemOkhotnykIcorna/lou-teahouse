import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma 7 CLI commands (generate/migrate/validate) require a datasource
    // url to be present even when the app connects through a driver adapter
    // at runtime. Falling back to the local sqlite file mirrors the runtime
    // default in lib/database.ts and prevents `prisma generate` from failing
    // during `npm install`/`vercel-build` when TURSO_* env vars aren't set
    // (e.g. a Preview deployment without secrets configured yet).
    url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
