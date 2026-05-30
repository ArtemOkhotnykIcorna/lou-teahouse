export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { ensureDatabase } = await import("./lib/ensure-db");
      await ensureDatabase();
    } catch (error) {
      console.error("Database initialization failed:", error);
    }
  }
}
