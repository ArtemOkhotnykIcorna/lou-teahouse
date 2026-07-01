import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";
import { getTursoClientConfig } from "@/lib/database";

function splitSqlStatements(sql: string): string[] {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.startsWith("--"));
}

export async function applyTursoMigrations(): Promise<void> {
  const config = getTursoClientConfig();
  if (!config) return;

  const client = createClient(config);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id" TEXT PRIMARY KEY NOT NULL,
      "checksum" TEXT NOT NULL,
      "finished_at" DATETIME,
      "migration_name" TEXT NOT NULL,
      "logs" TEXT,
      "rolled_back_at" DATETIME,
      "started_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )
  `);

  const migrationsDir = path.join(process.cwd(), "prisma/migrations");
  const migrationNames = fs
    .readdirSync(migrationsDir)
    .filter((name) => fs.statSync(path.join(migrationsDir, name)).isDirectory())
    .sort();

  for (const migrationName of migrationNames) {
    const applied = await client.execute({
      sql: 'SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = ? LIMIT 1',
      args: [migrationName],
    });

    if (applied.rows.length > 0) {
      continue;
    }

    const sql = fs.readFileSync(
      path.join(migrationsDir, migrationName, "migration.sql"),
      "utf8"
    );

    for (const statement of splitSqlStatements(sql)) {
      await client.execute(statement);
    }

    await client.execute({
      sql: `INSERT INTO "_prisma_migrations"
        ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
        VALUES (?, ?, CURRENT_TIMESTAMP, ?, CURRENT_TIMESTAMP, 1)`,
      args: [randomUUID(), "manual", migrationName],
    });

    console.log(`Applied Turso migration: ${migrationName}`);
  }
}
