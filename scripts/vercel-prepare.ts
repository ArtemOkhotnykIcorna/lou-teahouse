import { createPrismaClient, isTursoDatabase } from "@/lib/database";
import { seedDatabase } from "@/lib/seed-db";
import { applyTursoMigrations } from "./turso-migrate";

async function main() {
  if (!isTursoDatabase()) {
    console.log("Skipping Turso setup (local SQLite build)");
    return;
  }

  await applyTursoMigrations();

  const prisma = createPrismaClient();
  try {
    const count = await prisma.category.count();
    if (count === 0) {
      await seedDatabase(prisma);
      console.log("Turso database seeded");
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
