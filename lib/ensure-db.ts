import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

let ensured = false;

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const filePath = url.replace("file:", "");
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

export async function ensureDatabase(): Promise<void> {
  if (ensured) return;
  ensured = true;

  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  execSync("npx prisma migrate deploy", {
    env: process.env,
    stdio: "pipe",
  });

  if (!fs.existsSync(dbPath)) return;

  try {
    const { PrismaClient } = await import("@/lib/generated/prisma/client");
    const { PrismaBetterSqlite3 } = await import(
      "@prisma/adapter-better-sqlite3"
    );
    const adapter = new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? "file:./dev.db",
    });
    const prisma = new PrismaClient({ adapter });
    const count = await prisma.category.count();
    await prisma.$disconnect();

    if (count === 0) {
      execSync("npx tsx prisma/seed.ts", {
        env: process.env,
        stdio: "pipe",
      });
    }
  } catch {
    // Tables may not exist yet on first run — migrate handles schema
  }
}
