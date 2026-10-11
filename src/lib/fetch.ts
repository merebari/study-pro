"use client";

/**
 * Static-host fallback fetch: in static (GitHub Pages / no-API) hosting,
 * /json/*.json files replace the /api/* routes transparently.
 */

export function isStaticHost(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NEXT_PUBLIC_STATIC_HOST === "1";
}

/** Repo-subpath prefix baked at build time for GitHub Pages hosting. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Fetch quiz questions; falls back to /json/quiz.json on static hosts. */
export async function fetchQuizQuestions(params: {
  subjectId?: number;
  classId?: number;
  topicId?: number;
  limit?: number;
}) {
  if (!isStaticHost()) {
    const sp = new URLSearchParams();
    if (params.subjectId) sp.set("subjectId", String(params.subjectId));
    if (params.classId) sp.set("classId", String(params.classId));
    if (params.topicId) sp.set("topicId", String(params.topicId));
    if (params.limit) sp.set("limit", String(params.limit));
    const res = await fetch(`/api/quiz?${sp.toString()}`);
    const d = await res.json();
    return d.questions ?? [];
  }
  const res = await fetch(`${BASE_PATH}/json/quiz.json`);
  const d = await res.json();
  let rows = (d.questions ?? []) as Array<{
    id: number;
    subjectId: number;
    classId: number | null;
    topicId: number | null;
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
    level: number;
  }>;
  if (params.subjectId) rows = rows.filter((r) => r.subjectId === params.subjectId);
  if (params.classId) rows = rows.filter((r) => r.classId === params.classId);
  if (params.topicId) rows = rows.filter((r) => r.topicId === params.topicId);
  // shuffle + limit
  const arr = [...rows];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, params.limit ?? 10);
}

/** Fetch the practice/flashcard catalog; falls back to /json/catalog.json. */
export async function fetchCatalog() {
  if (!isStaticHost()) {
    const res = await fetch("/api/catalog");
    const d = await res.json();
    return d.catalog ?? [];
  }
  const res = await fetch(`${BASE_PATH}/json/catalog.json`);
  const d = await res.json();
  return d.catalog ?? [];
}

/** Fetch flashcards for a subject (+optional class); falls back to /json/flashcards.json. */
export async function fetchFlashcards(subjectId: number, classId?: number) {
  if (!isStaticHost()) {
    const sp = new URLSearchParams({ subject: String(subjectId) });
    if (classId) sp.set("class", String(classId));
    const res = await fetch(`/api/flashcards?${sp.toString()}`);
    const d = await res.json();
    return d.cards ?? [];
  }
  const res = await fetch(`${BASE_PATH}/json/flashcards.json`);
  const d = await res.json();
  let cards = (d.cards ?? []) as Array<{ subjectId: number; classIds: number[]; front: string; back: string; topic: string }>;
  cards = cards.filter((c) => c.subjectId === subjectId);
  if (classId) cards = cards.filter((c) => c.classIds.includes(classId));
  const arr = cards.map(({ front, back, topic }) => ({ front, back, topic }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
