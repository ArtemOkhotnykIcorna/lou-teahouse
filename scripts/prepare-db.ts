import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { seedDatabase } from "@/lib/seed-db";

async function main() {
  const root = process.cwd();
  const dataDir = path.join(root, "data");
  const dbPath = path.join(dataDir, "lou-store.db");

  fs.mkdirSync(dataDir, { recursive: true });

  const databaseUrl = `file:${dbPath}`;
  process.env.DATABASE_URL = databaseUrl;

  const prismaCli = path.join(
    root,
    "node_modules",
    "prisma",
    "build",
    "index.js"
  );

  execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], {
    env: process.env,
    stdio: "inherit",
    cwd: root,
  });

  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  const prisma = new PrismaClient({ adapter });

  try {
    await seedDatabase(prisma);
  } finally {
    await prisma.$disconnect();
  }

  console.log(`Database prepared at ${dbPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
