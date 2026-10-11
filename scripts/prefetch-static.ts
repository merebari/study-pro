/**
 * Exports the whole seeded curriculum into public/json/*.json so the app can
 * be hosted as a fully-static site (GitHub Pages) with /api/* replaced by
 * prefetched JSON files. Runs inside GitHub Actions after `scripts/seed.ts`.
 */
import { config } from "dotenv";
config();

import { promises as fs } from "fs";
import path from "path";
import {
  getBands,
  getClasses,
  getStats,
  getClassBySlug,
  getSubjectBySlug,
  getSubjectsIndex,
  getClassesWithCounts,
  getPracticeCatalog,
  getPastQuestions,
} from "../src/lib/data";
import { db } from "../src/db";
import {
  questions,
  topics,
  topicClasses,
  subjects,
  bands as bandsTbl,
  classes as classesTbl,
} from "../src/db/schema";

const OUT = path.join(process.cwd(), "public", "json");

async function write(rel: string, data: unknown) {
  const p = path.join(OUT, rel);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data));
  return rel;
}

async function main() {
  await fs.rm(OUT, { recursive: true, force: true });

  const [bands, cls, stats, subjectsIndex, classesWithCounts, catalog, past] = await Promise.all([
    getBands(),
    getClasses(),
    getStats(),
    getSubjectsIndex(),
    getClassesWithCounts(),
    getPracticeCatalog(),
    getPastQuestions(),
  ]);

  await write("bands.json", bands);
  await write("classes.json", cls);
  await write("stats.json", stats);
  await write("subjects-index.json", subjectsIndex);
  await write("classes-with-counts.json", classesWithCounts);
  await write("catalog.json", catalog);
  await write("past-questions.json", past);

  // class pages
  for (const c of cls) {
    await write(`class/${c.slug}.json`, await getClassBySlug(c.slug));
  }

  // subject pages
  const subjSlugs = subjectsIndex.flatMap((e) => e.rows.map((r) => r.slug));
  for (const slug of subjSlugs) {
    await write(`subject/${slug}.json`, await getSubjectBySlug(slug));
  }

  // topic detail pages + flashcards + quiz aggregate (direct DB for accuracy)
  const [allTopics, allQ, allTc, subjRows, bandRows, classRows] = await Promise.all([
    db.select().from(topics),
    db.select().from(questions),
    db.select().from(topicClasses),
    db.select().from(subjects),
    db.select().from(bandsTbl),
    db.select().from(classesTbl),
  ]);

  const flashcards: Array<{ subjectId: number; classIds: number[]; front: string; back: string; topic: string }> = [];
  const searchIndex: {
    subjects: Array<{ id: number; name: string; slug: string }>;
    topics: Array<{ title: string; slug: string; subjectSlug: string; subjectName: string }>;
    classes: Array<{ slug: string; name: string; tagline: string }>;
  } = {
    subjects: subjRows.map((s) => ({ id: s.id, name: s.name, slug: s.slug })),
    topics: [],
    classes: classRows.map((c) => ({ slug: c.slug, name: c.name, tagline: c.tagline })),
  };

  for (const t of allTopics) {
    const subject = subjRows.find((s) => s.id === t.subjectId)!;
    const band = bandRows.find((b) => b.id === subject.bandId)!;
    const siblings = allTopics.filter((x) => x.subjectId === t.subjectId).sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((x) => x.id === t.id);
    const taughtIn = allTc
      .filter((tc) => tc.topicId === t.id)
      .map((tc) => ({
        cls: classRows.find((c) => c.id === tc.classId)!,
        focus: tc.focus,
      }))
      .sort((a, b) => a.cls.stage - b.cls.stage);

    await write(`topic/${subject.slug}__${t.slug}.json`, {
      subject,
      band,
      topic: t,
      taughtIn,
      questions: allQ.filter((q) => q.topicId === t.id),
      prev: idx > 0 ? siblings[idx - 1] : null,
      next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
    });

    searchIndex.topics.push({ title: t.title, slug: t.slug, subjectSlug: subject.slug, subjectName: subject.name });
    for (const kt of t.keyTerms ?? []) {
      flashcards.push({ subjectId: subject.id, classIds: taughtIn.map((x) => x.cls.id), front: kt.term, back: kt.def, topic: t.title });
    }
  }

  await write("flashcards.json", { cards: flashcards });
  await write("quiz.json", { questions: allQ });
  await write("search-index.json", searchIndex);

  console.log(
    `✓ Prefetch: ${cls.length} classes · ${subjSlugs.length} subjects · ${allTopics.length} topics · ${flashcards.length} flashcards · ${allQ.length} questions · search index ready.`
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
