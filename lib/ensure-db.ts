import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createPrismaClient, getLocalDatabaseUrl, isTursoDatabase } from "@/lib/database";
import { seedDatabase } from "@/lib/seed-db";

let ensured = false;

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

async function seedIfEmpty(): Promise<void> {
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

export async function ensureDatabase(): Promise<void> {
  if (ensured) return;
  ensured = true;

  if (isTursoDatabase()) {
    await seedIfEmpty();
    return;
  }

  const dbPath = getLocalDatabaseUrl().replace(/^file:/, "");
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  runPrismaMigrateDeploy();
  await seedIfEmpty();
}
