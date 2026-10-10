"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Flame,
  Sparkles,
  Trash2,
  Trophy,
  Zap,
} from "lucide-react";
import {
  currentStreak,
  getBookmarks,
  getCompleted,
  getScores,
  getXp,
  xpLevel,
  STORE_EVENT,
} from "@/lib/study-store";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "progress", label: "Completed Topics", icon: CheckCircle2 },
  { id: "bookmarks", label: "Bookmarks", icon: BookMarked },
  { id: "scores", label: "Quiz Scores", icon: ClipboardList },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProgressPage() {
  const [tab, setTab] = useState<TabId>("progress");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const sync = () => setTick((t) => t + 1);
    window.addEventListener(STORE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const completed = useMemo(() => getCompleted(), [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const bookmarks = useMemo(() => getBookmarks(), [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const scores = useMemo(() => getScores(), [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const xp = useMemo(() => getXp(), [tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const level = xpLevel(xp.total);
  const streak = currentStreak(xp.history);

  const bySubject = useMemo(() => {
    const map = new Map<string, { name: string; slug: string; color: string; items: typeof completed }>();
    for (const e of completed) {
      const g = map.get(e.subjectSlug) ?? { name: e.subjectName, slug: e.subjectSlug, color: e.color, items: [] };
      g.items.push(e);
      map.set(e.subjectSlug, g);
    }
    return [...map.values()].sort((a, b) => b.items.length - a.items.length);
  }, [completed]);

  const clearAll = () => {
    if (window.confirm("Reset completed topics, bookmarks, scores and XP? This cannot be undone.")) {
      for (const k of ["studypro.completed.v1", "studypro.bookmarks.v1", "studypro.scores.v1", "studypro.xp.v1"]) {
        window.localStorage.removeItem(k);
      }
      window.dispatchEvent(new Event(STORE_EVENT));
    }
  };

  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="font-display text-sm font-medium italic text-leaf">Saved on this device</p>
            <h1 className="mt-2 max-w-2xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              My <span className="italic text-leaf">space</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              Your mastery map: completed topics, saved bookmarks and every quiz score — proof that
              you are becoming unstoppable.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Zap, label: "Total XP", value: xp.total, sub: `Level ${level.level} · ${level.pct}% to next`, color: "#f2b33d" },
            { icon: Flame, label: "Study streak", value: `${streak} day${streak === 1 ? "" : "s"}`, sub: streak > 0 ? "Keep the fire alive" : "Start today", color: "#e45b3d" },
            { icon: CheckCircle2, label: "Topics completed", value: completed.length, sub: `${bySubject.length} subjects covered`, color: "#2f9c68" },
            { icon: Trophy, label: "Quiz attempts", value: scores.length, sub: scores.length ? `Best: ${Math.max(...scores.map((s) => s.pct))}%` : "Take your first quiz", color: "#5ab3e8" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="rounded-3xl border border-ink/10 bg-paper p-5"
            >
              <span className="grid size-10 place-items-center rounded-2xl" style={{ backgroundColor: `${s.color}1c`, color: s.color }}>
                <s.icon className="size-4" strokeWidth={2.4} />
              </span>
              <p className="mt-3 font-display text-3xl font-semibold text-ink">{s.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{s.label}</p>
              <p className="mt-0.5 text-xs text-ink/40">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors",
                tab === t.id ? "border-forest bg-forest text-cream" : "border-ink/15 text-ink/60 hover:border-ink/40"
              )}
            >
              <t.icon className="size-4" />
              {t.label}
              <span className={cn("text-xs", tab === t.id ? "text-cream/70" : "text-ink/35")}>
                {t.id === "progress" ? completed.length : t.id === "bookmarks" ? bookmarks.length : scores.length}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "progress" &&
            (completed.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No topics completed yet"
                body="Open any topic, study the notes, then hit 'Mark topic as complete'. Your map fills up from here."
                cta={{ href: "/classes", label: "Browse classes" }}
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {bySubject.map((g) => (
                  <div key={g.slug} className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                    <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="size-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                        <p className="font-display text-lg font-semibold text-ink">{g.name}</p>
                      </div>
                      <Link href={`/subjects/${g.slug}`} className="text-xs font-bold text-ink/45 hover:text-ink">
                        Open subject ↗
                      </Link>
                    </div>
                    <ul className="divide-y divide-ink/5">
                      {g.items.map((e) => (
                        <li key={e.key}>
                          <Link href={`/subjects/${e.key}`} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-card">
                            <CheckCircle2 className="size-4 shrink-0 text-leaf" />
                            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink/80 group-hover:text-ink">
                              {e.title}
                            </span>
                            {e.term && (
                              <span className="shrink-0 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-ink/45">
                                T{e.term}
                              </span>
                            )}
                            <span className="shrink-0 text-[11px] font-bold text-ink/35">
                              {new Date(e.ts).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}

          {tab === "bookmarks" &&
            (bookmarks.length === 0 ? (
              <EmptyState
                icon={BookMarked}
                title="No bookmarks saved"
                body="Spot a tricky topic? Bookmark it and it waits here for revision day — like a personal reading list."
                cta={{ href: "/subjects", label: "Open subject catalog" }}
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {bookmarks.map((b) => (
                  <Link
                    key={b.key}
                    href={`/subjects/${b.key}`}
                    className="lift group flex items-center gap-4 rounded-3xl border border-ink/10 bg-paper p-5"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-amber/15 text-amber">
                      <BookMarked className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-lg font-semibold text-ink">{b.title}</span>
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">{b.subjectName}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-ink/25 transition-transform group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            ))}

          {tab === "scores" &&
            (scores.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No quiz scores yet"
                body="Scores from topic quizzes, Practice mode and CBT exams all land here so you can watch yourself improve."
                cta={{ href: "/practice", label: "Take a practice quiz" }}
              />
            ) : (
              <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                <ul className="divide-y divide-ink/5">
                  {scores.map((s, i) => (
                    <li key={`${s.key}-${s.ts}-${i}`} className="flex items-center gap-4 px-5 py-4">
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-2xl font-display text-sm font-black text-cream",
                          s.pct >= 80 ? "bg-leaf" : s.pct >= 50 ? "bg-amber text-[#0a1d15]" : "bg-clay"
                        )}
                      >
                        {s.pct}%
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink">{s.label}</span>
                        <span className="text-xs text-ink/45">
                          {s.score}/{s.total} correct · {new Date(s.ts).toLocaleDateString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </span>
                      {s.pct >= 80 && <Sparkles className="size-4 shrink-0 text-amber" />}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-xs font-bold text-ink/40 transition-colors hover:border-clay hover:text-clay"
          >
            <Trash2 className="size-3.5" /> Reset everything
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
}: {
  icon: typeof BookOpen;
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <div className="rounded-[2rem] border border-dashed border-ink/20 bg-paper p-12 text-center">
      <Icon className="mx-auto size-10 text-ink/20" />
      <h3 className="mt-4 font-display text-2xl font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink/55">{body}</p>
      <Link
        href={cta.href}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream"
      >
        {cta.label} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
