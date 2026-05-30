import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../lib/generated/prisma/client";
import { seedDatabase } from "../lib/seed-db";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

seedDatabase(prisma)
  .then(() => console.log("Seed completed!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
