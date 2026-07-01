import "dotenv/config";
import { createPrismaClient } from "../lib/database";
import { seedDatabase } from "../lib/seed-db";

const prisma = createPrismaClient();

seedDatabase(prisma)
  .then(() => console.log("Seed completed!"))
  .catch(console.error)
  .finally(() => prisma.$disconnect());
