import { config } from "dotenv";
config();

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { runSeed } from "../src/lib/seed-run";
import * as schema from "../src/db/schema";

const databaseUrl = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required (local .env or env var).");
  process.exit(1);
}

const needsSsl = !/(localhost|127\.0\.0\.1)/.test(databaseUrl);
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});
const db = drizzle(pool, { schema });

async function main() {
  console.log("Seeding Study Pro curriculum…");
  const stats = await runSeed(db);
  console.log(
    `✓ Done. ${stats.topics} topics (${stats.rich} rich) · ${stats.focusNotes} focus notes · ${stats.questions} questions.`
  );
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
