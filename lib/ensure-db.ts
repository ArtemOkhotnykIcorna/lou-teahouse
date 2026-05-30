import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { seedDatabase } from "@/lib/seed-db";

let ensured = false;

function resolveDbPath(): string {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const filePath = url.replace(/^file:/, "");
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

function runPrismaMigrateDeploy(): void {
  const prismaCli = path.join(
    process.cwd(),
    "node_modules",
    "prisma",
    "build",
    "index.js"
  );

  execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
    env: process.env,
    stdio: "inherit",
    cwd: process.cwd(),
  });
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export async function ensureDatabase(): Promise<void> {
  if (ensured) return;
  ensured = true;

  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  runPrismaMigrateDeploy();

  const prisma = createPrismaClient();
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      await seedDatabase(prisma);
    }
  } finally {
    await prisma.$disconnect();
  }
}
