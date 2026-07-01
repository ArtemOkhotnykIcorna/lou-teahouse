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

  if (process.env.VERCEL) {
    // On Vercel the deployed function's filesystem is read-only outside of
    // /tmp, and any local sqlite file written during the build doesn't ship
    // with the function bundle. Without Turso configured this would otherwise
    // fail at runtime with a confusing EROFS/ENOENT error on first request.
    throw new Error(
      "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in the Vercel project's " +
        "Environment Variables. Local SQLite is only supported for local development."
    );
  }

  const dbPath = getLocalDatabaseUrl().replace(/^file:/, "");
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  runPrismaMigrateDeploy();
  await seedIfEmpty();
}
