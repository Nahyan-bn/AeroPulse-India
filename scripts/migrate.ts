import fs from "node:fs";
import path from "node:path";
import { getPool } from "../src/lib/db";

async function migrate() {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured");

  const directory = path.join(process.cwd(), "migrations");
  const files = fs.readdirSync(directory).filter((file) => file.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(directory, file), "utf8");
    await pool.query(sql);
    console.log(`Applied ${file}`);
  }
  await pool.end();
}

migrate().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
