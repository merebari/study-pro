"use client";

/**
 * Study Pro browser store — XP, streaks, completed topics, bookmarks & quiz scores.
 * Everything persists in localStorage and syncs live via a custom event.
 */

export type CompletedEntry = {
  key: string; // `${subjectSlug}/${topicSlug}`
  title: string;
  subjectSlug: string;
  subjectName: string;
  color: string;
  term?: number;
  ts: number;
};

export type BookmarkEntry = CompletedEntry;

export type QuizScore = {
  key: string; // reference: subject slug, 'practice', 'cbt', etc.
  label: string;
  score: number;
  total: number;
  pct: number;
  ts: number;
};

export type XpState = {
  total: number;
  history: Array<{ ts: number; amount: number; why: string }>;
};

const K = {
  completed: "studypro.completed.v1",
  bookmarks: "studypro.bookmarks.v1",
  scores: "studypro.scores.v1",
  xp: "studypro.xp.v1",
  planner: "studypro.planner.v1",
  theme: "studypro.theme",
};

export const STORE_EVENT = "studypro:store";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(STORE_EVENT));
}

/* ── Completed topics ── */
export const getCompleted = () => read<CompletedEntry[]>(K.completed, []);

export function toggleCompleted(entry: Omit<CompletedEntry, "ts">): boolean {
  const list = getCompleted();
  const exists = list.some((e) => e.key === entry.key);
  const next = exists
    ? list.filter((e) => e.key !== entry.key)
    : [{ ...entry, ts: Date.now() }, ...list];
  write(K.completed, next);
  if (!exists) awardXp(20, `Completed “${entry.title}”`);
  return !exists;
}

/* ── Bookmarks ── */
export const getBookmarks = () => read<BookmarkEntry[]>(K.bookmarks, []);

export function toggleBookmarked(entry: Omit<BookmarkEntry, "ts">): boolean {
  const list = getBookmarks();
  const exists = list.some((e) => e.key === entry.key);
  const next = exists
    ? list.filter((e) => e.key !== entry.key)
    : [{ ...entry, ts: Date.now() }, ...list];
  write(K.bookmarks, next);
  if (!exists) awardXp(5, `Bookmarked “${entry.title}”`);
  return !exists;
}

/* ── Quiz scores ── */
export const getScores = () => read<QuizScore[]>(K.scores, []);

export function recordQuizResult(score: Omit<QuizScore, "pct" | "ts">) {
  const entry: QuizScore = {
    ...score,
    pct: Math.round((score.score / Math.max(1, score.total)) * 100),
    ts: Date.now(),
  };
  const list = getScores().filter((s) => s.key !== entry.key || Date.now() - s.ts > 1000 * 60);
  write(K.scores, [entry, ...list].slice(0, 200));
  awardXp(Math.max(2, Math.round(entry.pct / 10)), `Quiz: ${entry.label} (${entry.pct}%)`);
  return entry;
}

/* ── XP, levels & streaks ── */
export const getXp = () => read<XpState>(K.xp, { total: 0, history: [] });

export function awardXp(amount: number, why: string) {
  const xp = getXp();
  write(K.xp, {
    total: xp.total + amount,
    history: [{ ts: Date.now(), amount, why }, ...xp.history].slice(0, 300),
  });
}

export function xpLevel(total: number) {
  const level = Math.floor(total / 120) + 1;
  const into = total % 120;
  return { level, into, needed: 120, pct: Math.round((into / 120) * 100) };
}

export function currentStreak(history: XpState["history"]): number {
  if (!history.length) return 0;
  const days = new Set(history.map((h) => new Date(h.ts).toDateString()));
  let streak = 0;
  const cursor = new Date();
  // allow today or yesterday as the anchor
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/* ── Planner (parent/teacher) ── */
export type PlannerSession = {
  id: string;
  day: number; // 0 = Monday … 6 = Sunday
  time: string;
  minutes: number;
  subject: string;
  detail: string;
  className: string;
};

export const getPlanner = () => read<PlannerSession[]>(K.planner, []);
export const savePlanner = (rows: PlannerSession[]) => write(K.planner, rows);

/* ── Theme ── */
export const getStoredTheme = () => (typeof window === "undefined" ? "light" : window.localStorage.getItem(K.theme) ?? "light");
export const storeTheme = (t: string) => window.localStorage.setItem(K.theme, t);
