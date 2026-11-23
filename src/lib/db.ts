import { Pool, QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { aeropulsePool?: Pool };

export function getPool() {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForDb.aeropulsePool) {
    globalForDb.aeropulsePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined,
    });
  }
  return globalForDb.aeropulsePool;
}

export async function testDatabase(): Promise<{ ok: boolean; detail: string }> {
  const pool = getPool();
  if (!pool) return { ok: false, detail: "DATABASE_URL is not configured" };
  try {
    await pool.query("SELECT 1");
    return { ok: true, detail: "Database connection successful" };
  } catch (error) {
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Database connection failed",
    };
  }
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured");
  return pool.query<T>(text, params);
}
