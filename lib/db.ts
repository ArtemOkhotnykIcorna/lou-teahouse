import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { ensureDatabase } from "@/lib/ensure-db";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  if (url.startsWith("file:")) {
    const filePath = url.replace(/^file:/, "");
    const absolute = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    return `file:${absolute}`;
  }
  return url;
}

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: getDatabaseUrl() });
  return new PrismaClient({ adapter });
}

let prisma: PrismaClient | undefined;
let initPromise: Promise<PrismaClient> | undefined;

export async function getDb(): Promise<PrismaClient> {
  if (prisma) return prisma;

  if (!initPromise) {
    initPromise = (async () => {
      await ensureDatabase();
      prisma = globalForPrisma.prisma ?? createPrismaClient();
      globalForPrisma.prisma = prisma;
      return prisma;
    })();
  }

  return initPromise;
}
