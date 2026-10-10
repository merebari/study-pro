import { NextResponse } from "next/server";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { runSeed } from "@/lib/seed-run";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";
// Generous budget for hosted functions (Netlify allows up to 26s on supported plans).
export const maxDuration = 60;

const DDL = `
CREATE TABLE IF NOT EXISTS bands (
  id serial PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  short text NOT NULL,
  blurb text NOT NULL,
  position integer NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS classes (
  id serial PRIMARY KEY,
  band_id integer NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  stage integer NOT NULL,
  tagline text NOT NULL,
  description text NOT NULL,
  exam text,
  exam_detail text
);
CREATE INDEX IF NOT EXISTS classes_band_idx ON classes(band_id);
CREATE TABLE IF NOT EXISTS subjects (
  id serial PRIMARY KEY,
  band_id integer NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text NOT NULL DEFAULT 'BookOpen',
  color text NOT NULL DEFAULT '#2E8B57',
  blurb text NOT NULL
);
CREATE INDEX IF NOT EXISTS subjects_band_idx ON subjects(band_id);
CREATE TABLE IF NOT EXISTS class_subjects (
  id serial PRIMARY KEY,
  class_id integer NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id integer NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS class_subject_unique ON class_subjects(class_id, subject_id);
CREATE TABLE IF NOT EXISTS topics (
  id serial PRIMARY KEY,
  subject_id integer NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  term integer NOT NULL DEFAULT 2,
  overview text NOT NULL DEFAULT '',
  objectives jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  explanation jsonb NOT NULL DEFAULT '[]'::jsonb,
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_terms jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary jsonb NOT NULL DEFAULT '[]'::jsonb,
  exam_tip text NOT NULL DEFAULT '',
  gloss text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0
);
CREATE UNIQUE INDEX IF NOT EXISTS topic_subject_slug_unique ON topics(subject_id, slug);
CREATE TABLE IF NOT EXISTS topic_classes (
  id serial PRIMARY KEY,
  topic_id integer NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  class_id integer NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  focus text
);
CREATE UNIQUE INDEX IF NOT EXISTS topic_class_unique ON topic_classes(topic_id, class_id);
CREATE TABLE IF NOT EXISTS questions (
  id serial PRIMARY KEY,
  subject_id integer NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id integer REFERENCES classes(id) ON DELETE SET NULL,
  topic_id integer REFERENCES topics(id) ON DELETE SET NULL,
  question text NOT NULL,
  options jsonb NOT NULL,
  answer_index integer NOT NULL,
  explanation text NOT NULL,
  level integer NOT NULL DEFAULT 1,
  exam text,
  year integer
);
CREATE INDEX IF NOT EXISTS questions_subject_idx ON questions(subject_id);
`;

async function subjectCount(): Promise<number> {
  try {
    const rows = await db.select({ id: subjects.id }).from(subjects).limit(1);
    return rows.length;
  } catch {
    // table missing
    return 0;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = process.env.BOOTSTRAP_SECRET;
  const provided = searchParams.get("secret") ?? "";

  // Guard: with BOOTSTRAP_SECRET set, only the secret holder may run.
  // Without it, bootstrapping is allowed only while the DB is still empty.
  const isAuthed = secret ? provided === secret : true;
  if (secret && !isAuthed) {
    return NextResponse.json({ ok: false, error: "Invalid secret." }, { status: 401 });
  }

  try {
    const existing = await subjectCount();
    if (existing > 0 && !secret) {
      return NextResponse.json({
        ok: true,
        action: "skipped",
        message: "Database already seeded. Set the BOOTSTRAP_SECRET env var and call /api/bootstrap?secret=YOUR_SECRET to force a reseed.",
      });
    }

    // create tables (idempotent), then seed
    await db.execute(sql.raw(DDL));
    const stats = await runSeed(db);

    return NextResponse.json({
      ok: true,
      action: "seeded",
      stats,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Bootstrap failed" },
      { status: 500 }
    );
  }
}

export const POST = GET;
