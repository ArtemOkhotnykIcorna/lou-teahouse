import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/lib/generated/prisma/client";

export function getDatabaseUrl(): string {
  return (
    process.env.TURSO_DATABASE_URL ??
    process.env.DATABASE_URL ??
    "file:./dev.db"
  );
}

export function isTursoDatabase(url = getDatabaseUrl()): boolean {
  return url.startsWith("libsql:");
}

export function getLocalDatabaseUrl(): string {
  const url = getDatabaseUrl();
  if (!url.startsWith("file:")) {
    return "file:./dev.db";
  }

  const filePath = url.replace(/^file:/, "");
  const absolute = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
  return `file:${absolute}`;
}

export function createPrismaClient(): PrismaClient {
  const url = getDatabaseUrl();

  if (isTursoDatabase(url)) {
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!authToken) {
      throw new Error("TURSO_AUTH_TOKEN is required when using Turso");
    }

    const adapter = new PrismaLibSql({ url, authToken });
    return new PrismaClient({ adapter });
  }

  const adapter = new PrismaBetterSqlite3({ url: getLocalDatabaseUrl() });
  return new PrismaClient({ adapter });
}

export function getTursoClientConfig(): { url: string; authToken: string } | null {
  const url = getDatabaseUrl();
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!isTursoDatabase(url) || !authToken) {
    return null;
  }

  return { url, authToken };
}
