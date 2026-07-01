import { execSync } from "node:child_process";

execSync("npx prisma generate", { stdio: "inherit" });

const databaseUrl =
  process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

const usesLocalSqlite = databaseUrl.startsWith("file:") || databaseUrl.length === 0;

if (usesLocalSqlite && !process.env.VERCEL) {
  try {
    execSync("npm rebuild better-sqlite3", { stdio: "inherit" });
  } catch {
    console.warn("better-sqlite3 rebuild skipped");
  }
}
