import { createPrismaClient } from "@/lib/database";
import { ensureDatabase } from "@/lib/ensure-db";
import { PrismaClient } from "@/lib/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

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

export { createPrismaClient } from "@/lib/database";
