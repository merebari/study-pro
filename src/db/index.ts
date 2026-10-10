import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Netlify's Neon integration injects NETLIFY_DATABASE_URL — fall back to it.
const databaseUrl = process.env.DATABASE_URL ?? process.env.NETLIFY_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

// Remote hosted Postgres (Neon, Supabase, Railway…) requires TLS.
// Local/dev URLs (localhost / 127.0.0.1) run without SSL.
const needsSsl = !/(localhost|127\.0\.0\.1)/.test(databaseUrl);

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    max: 3, // serverless-friendly: keep connections scarce
    idleTimeoutMillis: 20_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
