import { db } from "@/db";
import {
  bands,
  classes,
  subjects,
  classSubjects,
  topics,
  topicClasses,
  questions,
} from "@/db/schema";
import { and, asc, eq, ilike, inArray, isNotNull, or } from "drizzle-orm";

export type SubjectWithCount = {
  subject: typeof subjects.$inferSelect;
  topicCount: number;
  questionCount: number;
};

export async function getBands() {
  return db.select().from(bands).orderBy(asc(bands.position));
}

export async function getClasses() {
  return db.select().from(classes).orderBy(asc(classes.stage));
}

export async function getStats() {
  const [t, s, c, q] = await Promise.all([
    db.select({ id: topics.id }).from(topics),
    db.select({ id: subjects.id }).from(subjects),
    db.select({ id: classes.id }).from(classes),
    db.select({ id: questions.id }).from(questions),
  ]);
  // subjects table holds one row per band — count distinct display names
  const subjRows = await db.select({ name: subjects.name }).from(subjects);
  const distinctSubjects = new Set(subjRows.map((r) => r.name)).size;
  return {
    topics: t.length,
    subjects: distinctSubjects,
    subjectRows: s.length,
    classes: c.length,
    questions: q.length,
  };
}

export async function getClassesWithCounts() {
  const cls = await getClasses();
  const bandRows = await getBands();
  const csRows = await db.select().from(classSubjects);
  return cls.map((c) => ({
    ...c,
    band: bandRows.find((b) => b.id === c.bandId)!,
    subjectCount: csRows.filter((r) => r.classId === c.id).length,
  }));
}

export async function getClassBySlug(slug: string) {
  const [cls] = await db.select().from(classes).where(eq(classes.slug, slug));
  if (!cls) return null;
  const [band] = await db.select().from(bands).where(eq(bands.id, cls.bandId));

  const csRows = await db
    .select()
    .from(classSubjects)
    .where(eq(classSubjects.classId, cls.id))
    .orderBy(asc(classSubjects.position));

  const subjIds = csRows.map((r) => r.subjectId);
  const subjRows = subjIds.length
    ? await db.select().from(subjects).where(inArray(subjects.id, subjIds))
    : [];

  // topics taught in this class
  const tcRows = await db
    .select()
    .from(topicClasses)
    .where(eq(topicClasses.classId, cls.id));
  const perSubjectTopicCount = new Map<number, number>();
  const topicIds = tcRows.map((r) => r.topicId);
  const topicRows = topicIds.length
    ? await db.select().from(topics).where(inArray(topics.id, topicIds))
    : [];
  for (const t of topicRows) {
    perSubjectTopicCount.set(t.subjectId, (perSubjectTopicCount.get(t.subjectId) ?? 0) + 1);
  }

  const qRows = await db.select().from(questions).where(eq(questions.classId, cls.id));
  const perSubjectQCount = new Map<number, number>();
  for (const q of qRows) {
    perSubjectQCount.set(q.subjectId, (perSubjectQCount.get(q.subjectId) ?? 0) + 1);
  }

  const ordered = csRows
    .map((cs) => subjRows.find((s) => s.id === cs.subjectId))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return {
    cls,
    band,
    subjects: ordered.map((subject) => ({
      subject,
      topicCount: perSubjectTopicCount.get(subject.id) ?? 0,
      questionCount: perSubjectQCount.get(subject.id) ?? 0,
    })),
  };
}

export async function getSubjectBySlug(slug: string) {
  const [subject] = await db.select().from(subjects).where(eq(subjects.slug, slug));
  if (!subject) return null;
  const [band] = await db.select().from(bands).where(eq(bands.id, subject.bandId));

  const csRows = await db
    .select()
    .from(classSubjects)
    .where(eq(classSubjects.subjectId, subject.id))
    .orderBy(asc(classSubjects.position));
  const classIdsList = csRows.map((r) => r.classId);
  const classRows = classIdsList.length
    ? await db.select().from(classes).where(inArray(classes.id, classIdsList))
    : [];

  const topicRows = await db
    .select()
    .from(topics)
    .where(eq(topics.subjectId, subject.id))
    .orderBy(asc(topics.position));

  const topicIds = topicRows.map((t) => t.id);
  const tcRows = topicIds.length
    ? await db.select().from(topicClasses).where(inArray(topicClasses.topicId, topicIds))
    : [];

  const qRows = await db
    .select({ id: questions.id, topicId: questions.topicId })
    .from(questions)
    .where(eq(questions.subjectId, subject.id));

  const topicsPerClass = classRows
    .sort((a, b) => a.stage - b.stage)
    .map((cls) => ({
      cls,
      topics: topicRows
        .filter((t) => tcRows.some((tc) => tc.topicId === t.id && tc.classId === cls.id))
        .map((t) => ({
          topic: t,
          focus: tcRows.find((tc) => tc.topicId === t.id && tc.classId === cls.id)?.focus ?? null,
          questionCount: qRows.filter((q) => q.topicId === t.id).length,
        })),
    }));

  return {
    subject,
    band,
    classes: classRows,
    topicsPerClass,
    totalTopics: topicRows.length,
    totalQuestions: qRows.length,
  };
}

export async function getTopicDetail(subjectSlug: string, topicSlug: string) {
  const [subject] = await db.select().from(subjects).where(eq(subjects.slug, subjectSlug));
  if (!subject) return null;
  const [topic] = await db
    .select()
    .from(topics)
    .where(and(eq(topics.subjectId, subject.id), eq(topics.slug, topicSlug)));
  if (!topic) return null;

  const [band] = await db.select().from(bands).where(eq(bands.id, subject.bandId));

  const tcRows = await db
    .select()
    .from(topicClasses)
    .where(eq(topicClasses.topicId, topic.id));
  const classRows = await db
    .select()
    .from(classes)
    .where(inArray(classes.id, tcRows.map((r) => r.classId)));

  const taughtIn = classRows
    .sort((a, b) => a.stage - b.stage)
    .map((cls) => ({
      cls,
      focus: tcRows.find((r) => r.classId === cls.id)?.focus ?? null,
    }));

  const siblings = await db
    .select()
    .from(topics)
    .where(eq(topics.subjectId, subject.id))
    .orderBy(asc(topics.position));
  const idx = siblings.findIndex((t) => t.id === topic.id);

  const questionRows = await db
    .select()
    .from(questions)
    .where(eq(questions.topicId, topic.id));

  return {
    subject,
    band,
    topic,
    taughtIn,
    questions: questionRows,
    prev: idx > 0 ? siblings[idx - 1] : null,
    next: idx < siblings.length - 1 ? siblings[idx + 1] : null,
  };
}

export async function getSubjectsIndex() {
  const subjRows = await db.select().from(subjects);
  const bandRows = await getBands();
  const classRows = await getClasses();
  const csRows = await db.select().from(classSubjects);
  const topicRows = await db.select({ id: topics.id, subjectId: topics.subjectId }).from(topics);

  const countPerSubject = new Map<number, number>();
  for (const t of topicRows) countPerSubject.set(t.subjectId, (countPerSubject.get(t.subjectId) ?? 0) + 1);

  // group band-rows under one display name
  const byName = new Map<string, {
    name: string;
    icon: string;
    color: string;
    rows: Array<{
      slug: string;
      bandCode: string;
      bandShort: string;
      classes: Array<{ slug: string; name: string; stage: number }>;
      topicCount: number;
    }>;
  }>();

  for (const s of subjRows) {
    const band = bandRows.find((b) => b.id === s.bandId)!;
    const entry =
      byName.get(s.name) ??
      { name: s.name, icon: s.icon, color: s.color, rows: [] };
    const classesForRow = csRows
      .filter((cs) => cs.subjectId === s.id)
      .sort((a, b) => a.position - b.position)
      .map((cs) => {
        const c = classRows.find((cl) => cl.id === cs.classId)!;
        return { slug: c.slug, name: c.name, stage: c.stage };
      });
    entry.rows.push({
      slug: s.slug,
      bandCode: band.code,
      bandShort: band.short,
      classes: classesForRow,
      topicCount: countPerSubject.get(s.id) ?? 0,
    });
    byName.set(s.name, entry);
  }

  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function searchAll(q: string, limit = 8) {
  const pattern = `%${q}%`;
  const [subjRows, topicRows, classRows] = await Promise.all([
    db
      .select()
      .from(subjects)
      .where(or(ilike(subjects.name, pattern), ilike(subjects.blurb, pattern)))
      .limit(limit),
    db
      .select({
        id: topics.id,
        slug: topics.slug,
        title: topics.title,
        subjectId: topics.subjectId,
      })
      .from(topics)
      .where(ilike(topics.title, pattern))
      .limit(limit * 2),
    db
      .select()
      .from(classes)
      .where(or(ilike(classes.name, pattern), ilike(classes.tagline, pattern)))
      .limit(4),
  ]);

  const subjIds = [...new Set(topicRows.map((t) => t.subjectId))];
  const subjForTopics = subjIds.length
    ? await db.select().from(subjects).where(inArray(subjects.id, subjIds))
    : [];

  return {
    subjects: subjRows.slice(0, limit),
    topics: topicRows.slice(0, limit * 2).map((t) => ({
      ...t,
      subject: subjForTopics.find((s) => s.id === t.subjectId)!,
    })),
    classes: classRows,
  };
}

export async function getQuizQuestions(filters: {
  subjectId?: number;
  classId?: number;
  topicId?: number;
  limit?: number;
}) {
  const limit = Math.min(filters.limit ?? 10, 25);
  const conditions = [];
  if (filters.subjectId) conditions.push(eq(questions.subjectId, filters.subjectId));
  if (filters.classId) conditions.push(eq(questions.classId, filters.classId));
  if (filters.topicId) conditions.push(eq(questions.topicId, filters.topicId));
  const rows = await db
    .select()
    .from(questions)
    .where(conditions.length ? and(...conditions) : undefined)
    .limit(200);

  // Fisher–Yates shuffle, then take `limit`
  const arr = [...rows];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, limit);
}

export async function getPracticeCatalog() {
  const classRows = await getClasses();
  const qRows = await db
    .select({ subjectId: questions.subjectId, classId: questions.classId })
    .from(questions);
  const subjRows = await db.select().from(subjects);
  const csRows = await db.select().from(classSubjects);

  const counts = new Map<string, number>();
  for (const q of qRows) {
    counts.set(`${q.classId}::${q.subjectId}`, (counts.get(`${q.classId}::${q.subjectId}`) ?? 0) + 1);
  }

  return classRows.map((cls) => ({
    id: cls.id,
    slug: cls.slug,
    name: cls.name,
    stage: cls.stage,
    subjects: csRows
      .filter((cs) => cs.classId === cls.id)
      .sort((a, b) => a.position - b.position)
      .map((cs) => {
        const s = subjRows.find((x) => x.id === cs.subjectId)!;
        return {
          id: s.id,
          name: s.name,
          slug: s.slug,
          count: counts.get(`${cls.id}::${s.id}`) ?? 0,
        };
      }),
  }));
}

export async function getPastQuestions() {
  const rows = await db
    .select()
    .from(questions)
    .where(isNotNull(questions.exam))
    .orderBy(asc(questions.year));
  const subjRows = await db.select().from(subjects);
  const classRows = await db.select().from(classes);
  return rows.map((r) => ({
    ...r,
    subject: subjRows.find((s) => s.id === r.subjectId)!,
    cls: r.classId ? classRows.find((c) => c.id === r.classId) ?? null : null,
  }));
}
