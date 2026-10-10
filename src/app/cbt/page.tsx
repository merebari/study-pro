"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlarmClock,
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  MonitorPlay,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { recordQuizResult } from "@/lib/study-store";
import { cn } from "@/lib/utils";

type CatalogClass = {
  id: number;
  slug: string;
  name: string;
  subjects: Array<{ id: number; name: string; slug: string; count: number }>;
};

type CbtQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  subject: string;
};

const QUESTIONS_PER_SUBJECT = 8;

function formatClock(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function CbtPage() {
  const [phase, setPhase] = useState<"setup" | "exam" | "result">("setup");
  const [catalog, setCatalog] = useState<CatalogClass[]>([]);
  const [classId, setClassId] = useState<number | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flags, setFlags] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timeTotal, setTimeTotal] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => setCatalog(d.catalog ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "exam"]);

  const currentClass = catalog.find((c) => c.id === classId) ?? null;
  const totalAvailable = currentClass?.subjects.reduce((n, s) => n + s.count, 0) ?? 0;

  const toggleSubject = (id: number) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? p : [...p, id]));
  };

  const startExam = async () => {
    if (!currentClass || picked.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const bundles = await Promise.all(
        picked.map(async (sid) => {
          const name = currentClass.subjects.find((s) => s.id === sid)?.name ?? "Subject";
          const res = await fetch(`/api/quiz?subjectId=${sid}&limit=${QUESTIONS_PER_SUBJECT}`);
          const d = await res.json();
          return (d.questions ?? []).map((q: Omit<CbtQuestion, "subject">) => ({ ...q, subject: name }));
        })
      );
      const all = bundles.flat();
      if (all.length === 0) {
        setError("No questions available for those subjects yet. Try others.");
        return;
      }
      const totalSecs = Math.max(600, all.length * 45);
      setQuestions(all);
      setAnswers(new Array(all.length).fill(null));
      setFlags(new Array(all.length).fill(false));
      setCursor(0);
      setTimeTotal(totalSecs);
      setTimeLeft(totalSecs);
      setPhase("exam");
    } catch {
      setError("Could not load your exam. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const score = useMemo(
    () => answers.filter((a, i) => a !== null && a === questions[i]?.answerIndex).length,
    [answers, questions]
  );

  useEffect(() => {
    if (phase !== "result" || questions.length === 0) return;
    recordQuizResult({
      key: `cbt.${classId}.${picked.join("-")}`,
      label: `CBT simulation (${picked.length} subject${picked.length > 1 ? "s" : ""})`,
      score,
      total: questions.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const answeredCount = answers.filter((a) => a !== null).length;

  /* ───────────────────────── SETUP ───────────────────────── */
  if (phase === "setup") {
    return (
      <div className="bg-paper pb-24">
        <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-1.5 text-xs font-bold text-ink/60">
                <MonitorPlay className="size-3.5 text-leaf" /> JAMB-style timed practice
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
                CBT <span className="italic text-leaf">Arena</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
                The real exam feeling: a countdown clock, a question palette, flags for review, and
                one final submit. No explanations until the bell rings.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-10">
            <p className="font-display text-xl font-semibold text-ink">1 · Choose your class</p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {catalog.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setClassId(c.id);
                    setPicked([]);
                  }}
                  className={cn(
                    "rounded-2xl border-2 px-3 py-3 text-sm font-bold transition-all",
                    classId === c.id ? "border-forest bg-forest text-cream" : "border-ink/10 text-ink/60 hover:border-ink/40"
                  )}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {currentClass && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <div className="mt-8 flex items-baseline justify-between gap-3">
                  <p className="font-display text-xl font-semibold text-ink">2 · Pick up to 4 subjects</p>
                  <p className="text-xs font-bold text-ink/45">{picked.length}/4 selected</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentClass.subjects.map((s) => {
                    const on = picked.includes(s.id);
                    const locked = !on && picked.length >= 4;
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        disabled={locked}
                        className={cn(
                          "rounded-full border px-4 py-2.5 text-sm font-bold transition-all",
                          on
                            ? "border-leaf bg-leaf text-cream"
                            : locked
                              ? "cursor-not-allowed border-ink/10 text-ink/25"
                              : "border-ink/15 bg-card/60 text-ink/65 hover:border-ink/40"
                        )}
                      >
                        {s.name} <span className={cn("text-xs", on ? "text-cream/70" : "text-ink/35")}>{s.count}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs font-semibold text-ink/40">
                  {totalAvailable} questions banked for {currentClass.name} · {QUESTIONS_PER_SUBJECT} drawn per subject · 45 seconds each
                </p>
              </motion.div>
            )}

            {error && <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">{error}</p>}

            <div className="mt-10 border-t border-dashed border-ink/15 pt-8">
              <button
                onClick={startExam}
                disabled={loading || picked.length === 0}
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-bold text-cream transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <AlarmClock className="size-4 text-amber" />}
                Begin timed exam
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── RESULT ───────────────────────── */
  if (phase === "result") {
    const pct = Math.round((score / Math.max(1, questions.length)) * 100);
    const bySubject = [...new Set(questions.map((q) => q.subject))].map((name) => {
      const idxs = questions.map((q, i) => (q.subject === name ? i : -1)).filter((i) => i >= 0);
      const sc = idxs.filter((i) => answers[i] === questions[i].answerIndex).length;
      return { name, sc, total: idxs.length };
    });
    const timeUsed = timeTotal - timeLeft;
    return (
      <div className="bg-paper pb-24">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-10">
            <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
              <div className="relative mx-auto">
                <svg width="150" height="150" viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="54" fill="none" stroke="#0a1d1514" strokeWidth="14" />
                  <motion.circle
                    cx="75" cy="75" r="54" fill="none"
                    stroke={pct >= 50 ? "#2f9c68" : "#e45b3d"}
                    strokeWidth="14" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 * (1 - pct / 100) }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    transform="rotate(-90 75 75)"
                  />
                  <text x="75" y="70" textAnchor="middle" className="fill-ink font-display text-3xl font-bold">{pct}%</text>
                  <text x="75" y="92" textAnchor="middle" className="fill-ink/50 text-[11px] font-bold uppercase">{score}/{questions.length}</text>
                </svg>
                <Trophy className="absolute -right-2 -top-2 size-8 rotate-12 text-amber" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display text-3xl font-semibold text-ink sm:text-4xl">
                  {timeLeft === 0 ? "Time's up!" : pct >= 70 ? "Exam crushed!" : "Script submitted."}
                </p>
                <p className="mt-2 text-ink/60">
                  You answered {answeredCount} of {questions.length} questions in {formatClock(timeUsed)}.
                  {pct >= 70 ? " This is UTME-candidate material." : " Review your script below — every miss is a free lesson."}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <button
                    onClick={() => {
                      setPhase("setup");
                      setQuestions([]);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream"
                  >
                    <ArrowLeft className="size-4" /> New exam
                  </button>
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-4 py-2 text-xs font-bold text-leaf">
                    <Sparkles className="size-3.5" /> Score saved to My Space
                  </p>
                </div>
              </div>
            </div>

            {/* Per-subject breakdown */}
            <div className="mt-10 border-t border-dashed border-ink/15 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Subject breakdown</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {bySubject.map((s) => {
                  const p = Math.round((s.sc / s.total) * 100);
                  return (
                    <div key={s.name} className="rounded-2xl bg-card p-4">
                      <div className="flex items-center justify-between text-sm font-bold text-ink">
                        <span>{s.name}</span>
                        <span>{s.sc}/{s.total}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                        <motion.div
                          className={cn("h-full rounded-full", p >= 50 ? "bg-leaf" : "bg-clay")}
                          initial={{ width: 0 }}
                          animate={{ width: `${p}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Script review */}
            <div className="mt-10 border-t border-dashed border-ink/15 pt-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Script review</p>
              <ol className="mt-4 space-y-3">
                {questions.map((q, i) => {
                  const mine = answers[i];
                  const ok = mine === q.answerIndex;
                  return (
                    <li key={q.id} className="rounded-2xl border border-ink/10 bg-card/50 p-4">
                      <div className="flex items-start gap-3">
                        <span className={cn("mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-cream", ok ? "bg-leaf" : mine === null ? "bg-ink/30" : "bg-clay")}>
                          {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase tracking-wider" style={{ color: "#2f9c68" }}>{q.subject}</p>
                          <p className="mt-0.5 text-sm font-semibold text-ink">{i + 1}. {q.question}</p>
                          <p className="mt-1 text-xs font-semibold text-leaf">Correct: {q.options[q.answerIndex]}</p>
                          {mine !== null && !ok && (
                            <p className="text-xs font-semibold text-clay">You chose: {q.options[mine]}</p>
                          )}
                          {mine === null && <p className="text-xs font-semibold text-ink/40">You skipped this one.</p>}
                          <p className="mt-1.5 text-xs leading-relaxed text-ink/55">{q.explanation}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ───────────────────────── EXAM ───────────────────────── */
  const q = questions[cursor];
  const lowTime = timeLeft < 300;

  return (
    <div className="min-h-[80vh] bg-[#0a1d15] pb-10 text-[#f6f1e4]">
      {/* Exam top bar */}
      <div className="sticky top-[68px] z-30 border-b border-[#f6f1e4]/10 bg-[#0c241a]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-xl bg-[#f2b33d] font-display text-sm font-black text-[#0a1d15]">SP</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f6f1e4]/50">Study Pro CBT</p>
              <p className="text-sm font-bold">{q.subject}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-2 rounded-2xl px-4 py-2 font-mono text-xl font-bold tabular-nums", lowTime ? "animate-pulse bg-clay/20 text-clay" : "bg-[#f6f1e4]/10")}>
            <AlarmClock className="size-4" />
            {formatClock(timeLeft)}
          </div>
          <button
            onClick={() => setConfirmSubmit(true)}
            className="rounded-full bg-amber px-5 py-2.5 text-sm font-black text-[#0a1d15] transition-transform hover:-translate-y-0.5"
          >
            Submit
          </button>
        </div>
        <div className="h-1 bg-[#f6f1e4]/10">
          <div className="h-full bg-amber transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_260px]">
        {/* Question panel */}
        <div>
          <div className="rounded-3xl border border-[#f6f1e4]/10 bg-[#f6f1e4]/[0.04] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f6f1e4]/50">
                Question {cursor + 1} / {questions.length}
              </p>
              <button
                onClick={() => setFlags((f) => f.map((v, i) => (i === cursor ? !v : v)))}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors",
                  flags[cursor] ? "bg-amber text-[#0a1d15]" : "border border-[#f6f1e4]/20 text-[#f6f1e4]/60 hover:border-amber hover:text-amber"
                )}
              >
                <Flag className="size-3" /> {flags[cursor] ? "Flagged" : "Flag for review"}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={q.id + cursor} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                <h2 className="mt-5 font-display text-xl font-semibold leading-snug sm:text-2xl">{q.question}</h2>
                <div className="mt-6 grid gap-3">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setAnswers((a) => a.map((v, idx) => (idx === cursor ? i : v)))}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all",
                        answers[cursor] === i
                          ? "border-amber bg-amber/15 text-[#f6f1e4]"
                          : "border-[#f6f1e4]/10 bg-[#f6f1e4]/[0.03] text-[#f6f1e4]/75 hover:border-[#f6f1e4]/35"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-black",
                          answers[cursor] === i ? "border-amber bg-amber text-[#0a1d15]" : "border-[#f6f1e4]/25 text-[#f6f1e4]/60"
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={() => setCursor((c) => Math.max(0, c - 1))}
                disabled={cursor === 0}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#f6f1e4]/20 px-5 py-2.5 text-sm font-bold text-[#f6f1e4]/70 disabled:opacity-30"
              >
                <ChevronLeft className="size-4" /> Prev
              </button>
              <button
                onClick={() => setAnswers((a) => a.map((v, idx) => (idx === cursor ? null : v)))}
                className="text-xs font-bold text-[#f6f1e4]/40 underline-offset-4 hover:underline"
              >
                Clear answer
              </button>
              <button
                onClick={() => (cursor + 1 >= questions.length ? setConfirmSubmit(true) : setCursor((c) => c + 1))}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#f6f1e4] px-5 py-2.5 text-sm font-black text-[#0a1d15]"
              >
                {cursor + 1 >= questions.length ? "Finish" : "Next"} <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Palette */}
        <aside className="rounded-3xl border border-[#f6f1e4]/10 bg-[#f6f1e4]/[0.04] p-5 lg:sticky lg:top-36 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f6f1e4]/50">Question palette</p>
          <div className="mt-3 grid grid-cols-8 gap-1.5 lg:grid-cols-5">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCursor(i)}
                className={cn(
                  "grid aspect-square place-items-center rounded-lg font-mono text-xs font-bold transition-all",
                  i === cursor
                    ? "bg-[#f6f1e4] text-[#0a1d15]"
                    : answers[i] !== null
                      ? "bg-leaf text-white"
                      : flags[i]
                        ? "bg-amber text-[#0a1d15]"
                        : "bg-[#f6f1e4]/10 text-[#f6f1e4]/50 hover:bg-[#f6f1e4]/20"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1.5 text-[11px] font-semibold text-[#f6f1e4]/55">
            <p className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-leaf" /> Answered</p>
            <p className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-amber" /> Flagged</p>
            <p className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-[#f6f1e4]/10" /> Not answered</p>
          </div>
          <p className="mt-4 border-t border-[#f6f1e4]/10 pt-3 text-xs font-bold text-[#f6f1e4]/60">
            {answeredCount}/{questions.length} answered
          </p>
        </aside>
      </div>

      {/* Submit confirm modal */}
      <AnimatePresence>
        {confirmSubmit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 backdrop-blur-sm" onClick={() => setConfirmSubmit(false)}>
            <motion.div
              initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 8 }}
              className="w-full max-w-md rounded-3xl bg-[#0c241a] p-8 text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertTriangle className="mx-auto size-10 text-amber" />
              <h3 className="mt-4 font-display text-2xl font-semibold">Submit your script?</h3>
              <p className="mt-2 text-sm text-[#f6f1e4]/60">
                You have answered {answeredCount} of {questions.length} questions with{" "}
                <span className="font-mono font-bold text-amber">{formatClock(timeLeft)}</span> left. Unanswered questions score zero.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button onClick={() => setConfirmSubmit(false)} className="rounded-full border border-[#f6f1e4]/20 px-5 py-3 text-sm font-bold text-[#f6f1e4]/80">
                  Keep writing
                </button>
                <button
                  onClick={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setConfirmSubmit(false);
                    setPhase("result");
                  }}
                  className="rounded-full bg-amber px-5 py-3 text-sm font-black text-[#0a1d15]"
                >
                  Submit now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
