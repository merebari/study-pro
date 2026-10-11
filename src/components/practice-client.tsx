"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Lightbulb,
  Loader2,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { recordQuizResult } from "@/lib/study-store";
import { fetchQuizQuestions } from "@/lib/fetch";
import { useEffect } from "react";

type CatalogClass = {
  id: number;
  slug: string;
  name: string;
  stage: number;
  subjects: Array<{ id: number; name: string; slug: string; count: number }>;
};

type ApiQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  level: number;
};

type Phase = "setup" | "playing" | "results";

const COUNTS = [5, 10, 15] as const;

export function PracticeClient({
  catalog,
  initialClassId,
  initialSubjectId,
}: {
  catalog: CatalogClass[];
  initialClassId?: number;
  initialSubjectId?: number;
}) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [classId, setClassId] = useState<number | null>(
    initialClassId && catalog.some((c) => c.id === initialClassId) ? initialClassId : null
  );
  const [subjectId, setSubjectId] = useState<number | null>(initialSubjectId ?? null);
  const [count, setCount] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [questions, setQuestions] = useState<ApiQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ qid: number; picked: number | null }>>([]);
  const recordedRef = useMemo(() => ({ done: false }), []);

  useEffect(() => {
    if (phase !== "results" || recordedRef.done || questions.length === 0) return;
    recordedRef.done = true;
    const cls = catalog.find((c) => c.id === classId);
    const subj = cls?.subjects.find((s) => s.id === subjectId);
    const sc = answers.filter((a) => questions.find((q) => q.id === a.qid)?.answerIndex === a.picked).length;
    recordQuizResult({
      key: `practice.${subjectId ?? "mixed"}.${classId ?? "all"}`,
      label: subj ? `${subj.name} quiz (${cls?.name ?? "mixed class"})` : "Mixed practice quiz",
      score: sc,
      total: questions.length,
    });
  }, [phase, questions, answers, catalog, classId, subjectId, recordedRef]);

  const currentClass = catalog.find((c) => c.id === classId) ?? null;
  const subjectPool = currentClass?.subjects ?? [];
  const allWithQuestions = catalog.reduce((n, c) => n + c.subjects.length, 0);

  const canStart = (classId !== null && subjectId !== null) || (classId === null && subjectId === null);

  const startQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = (await fetchQuizQuestions({
        subjectId: subjectId ?? undefined,
        classId: !subjectId && classId ? classId : undefined,
        limit: count,
      })) as ApiQuestion[];
      if (!list.length) {
        setError("No questions available for that selection yet — try another class or subject.");
        setLoading(false);
        return;
      }
      recordedRef.done = false;
      setQuestions(list);
      setIndex(0);
      setPicked(null);
      setAnswers([]);
      setPhase("playing");
    } catch {
      setError("Something went wrong loading your quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, { qid: questions[index].id, picked: i }]);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setPhase("results");
    } else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  const score = useMemo(
    () => answers.filter((a) => questions.find((q) => q.id === a.qid)?.answerIndex === a.picked).length,
    [answers, questions]
  );

  const resetToSetup = () => {
    setPhase("setup");
    setQuestions([]);
    setAnswers([]);
    setIndex(0);
    setPicked(null);
  };

  /* ── SETUP ── */
  if (phase === "setup") {
    return (
      <div className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/45">
          <ClipboardList className="size-4 text-leaf" /> Build your quiz
        </div>

        <div className="mt-8">
          <p className="font-display text-xl font-semibold text-ink">1 · Which class?</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {catalog.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setClassId(c.id === classId ? null : c.id);
                  setSubjectId(null);
                }}
                className={cn(
                  "rounded-full border px-4 py-2.5 text-sm font-bold transition-all",
                  classId === c.id
                    ? "border-forest bg-forest text-cream"
                    : "border-ink/15 bg-card/60 text-ink/65 hover:border-ink/40 hover:text-ink"
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {currentClass && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-8">
                <p className="font-display text-xl font-semibold text-ink">2 · Which subject?</p>
                {subjectPool.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {subjectPool.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSubjectId(s.id === subjectId ? null : s.id)}
                        className={cn(
                          "rounded-full border px-4 py-2.5 text-sm font-bold transition-all",
                          subjectId === s.id
                            ? "border-leaf bg-leaf text-cream"
                            : "border-ink/15 bg-card/60 text-ink/65 hover:border-ink/40 hover:text-ink"
                        )}
                      >
                        {s.name}
                        <span className={cn("ml-1.5 text-xs", subjectId === s.id ? "text-cream/70" : "text-ink/35")}>
                          {s.count}
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => setSubjectId(null)}
                      className={cn(
                        "rounded-full border border-dashed px-4 py-2.5 text-sm font-bold transition-all",
                        subjectId === null ? "border-ink text-ink" : "border-ink/25 text-ink/50 hover:border-ink/50"
                      )}
                    >
                      Surprise me (mixed)
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl bg-card p-4 text-sm text-ink/55">
                    Question bank for this class is still growing — try another class, or start a mixed quiz below.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8">
          <p className="font-display text-xl font-semibold text-ink">{currentClass ? "3" : "2"} · How many questions?</p>
          <div className="mt-4 flex gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={cn(
                  "grid size-14 place-items-center rounded-2xl border-2 font-display text-xl font-bold transition-all",
                  count === n ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/50 hover:border-ink/40"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-2xl bg-clay/10 px-4 py-3 text-sm font-semibold text-clay">{error}</p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-dashed border-ink/15 pt-8">
          <button
            onClick={startQuiz}
            disabled={loading || (!canStart && subjectPool.length === 0)}
            className="group inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-bold text-cream shadow-[0_16px_36px_-12px_rgba(15,46,33,0.5)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-amber" />}
            Start my quiz
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <p className="text-xs font-semibold text-ink/45">
            {allWithQuestions} subjects currently in the question bank
          </p>
        </div>
      </div>
    );
  }

  /* ── PLAYING ── */
  if (phase === "playing") {
    const q = questions[index];
    const progress = ((index + 1) / questions.length) * 100;
    return (
      <div className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={resetToSetup}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/45 transition-colors hover:text-ink"
          >
            <ArrowLeft className="size-3.5" /> Quit quiz
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            Question {index + 1} of {questions.length}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full bg-leaf"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mt-8 font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              {q.question}
            </h2>

            <div className="mt-6 grid gap-3">
              {q.options.map((opt, i) => {
                const isCorrect = picked !== null && i === q.answerIndex;
                const isWrongPick = picked === i && i !== q.answerIndex;
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={picked !== null}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-[15px] font-semibold transition-all",
                      picked === null && "border-ink/10 bg-card/50 text-ink hover:-translate-y-0.5 hover:border-ink/40",
                      isCorrect && "border-leaf bg-leaf/10 text-ink",
                      isWrongPick && "border-clay bg-clay/10 text-ink",
                      picked !== null && !isCorrect && !isWrongPick && "border-ink/10 bg-card/40 text-ink/40"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-8 shrink-0 place-items-center rounded-full border text-xs font-black",
                        isCorrect && "border-leaf bg-leaf text-cream",
                        isWrongPick && "border-clay bg-clay text-cream",
                        !isCorrect && !isWrongPick && "border-ink/20 text-ink/50"
                      )}
                    >
                      {isCorrect ? <Check className="size-4" /> : isWrongPick ? <X className="size-4" /> : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <AnimatePresence>
              {picked !== null && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 flex items-start gap-3 rounded-2xl bg-amber/10 p-4">
                    <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" />
                    <p className="text-sm leading-relaxed text-ink/75">{q.explanation}</p>
                  </div>
                  <button
                    onClick={next}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 text-sm font-bold text-cream"
                  >
                    {index + 1 === questions.length ? "See my results" : "Next question"}
                    <ChevronRight className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  /* ── RESULTS ── */
  const pct = Math.round((score / questions.length) * 100);
  const ring = 2 * Math.PI * 54;
  const verdict =
    pct >= 80
      ? "Champion territory. WAEC should be worried about you."
      : pct >= 50
        ? "A solid base — review the misses below and run it back."
        : "Every expert was once here. Read the explanations, then try again.";

  return (
    <div className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-10">
      <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr]">
        <div className="relative mx-auto">
          <svg width="150" height="150" viewBox="0 0 150 150">
            <circle cx="75" cy="75" r="54" fill="none" stroke="#0a1d1514" strokeWidth="14" />
            <motion.circle
              cx="75"
              cy="75"
              r="54"
              fill="none"
              stroke={pct >= 50 ? "#2f9c68" : "#e45b3d"}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={ring}
              initial={{ strokeDashoffset: ring }}
              animate={{ strokeDashoffset: ring - (ring * pct) / 100 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              transform="rotate(-90 75 75)"
            />
            <text x="75" y="70" textAnchor="middle" className="fill-ink font-display text-3xl font-bold">
              {pct}%
            </text>
            <text x="75" y="92" textAnchor="middle" className="fill-ink/50 text-[11px] font-bold uppercase">
              {score}/{questions.length} correct
            </text>
          </svg>
          <Trophy className="absolute -right-2 -top-2 size-8 rotate-12 text-amber" />
        </div>
        <div className="text-center sm:text-left">
          <p className="font-display text-3xl font-semibold text-ink sm:text-4xl">
            {pct >= 80 ? "Nigeria is proud of you!" : pct >= 50 ? "Good hustle!" : "Keep pushing — you will get there."}
          </p>
          <p className="mt-2 text-ink/60">{verdict}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:justify-start">
            <button
              onClick={() => {
                setPhase("setup");
                setPicked(null);
                setAnswers([]);
                setIndex(0);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream"
            >
              <RotateCcw className="size-4" /> New quiz
            </button>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-dashed border-ink/15 pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Review your answers</p>
        <div className="mt-4 space-y-3">
          {questions.map((q, i) => {
            const a = answers.find((x) => x.qid === q.id);
            const ok = a?.picked === q.answerIndex;
            return (
              <div key={q.id} className="rounded-2xl border border-ink/10 bg-card/50 p-4">
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-cream",
                      ok ? "bg-leaf" : "bg-clay"
                    )}
                  >
                    {ok ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {i + 1}. {q.question}
                    </p>
                    {!ok && a?.picked !== undefined && (
                      <p className="mt-1 text-xs font-semibold text-clay">
                        You chose: {a?.picked !== null ? q.options[a.picked] : "—"}
                      </p>
                    )}
                    <p className="mt-1 text-xs font-semibold text-leaf">Correct: {q.options[q.answerIndex]}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink/55">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 rounded-2xl bg-leaf/10 px-5 py-4 text-sm font-semibold text-moss">
        <GraduationCap className="size-5 shrink-0" />
        Tip: open the topics you missed from the subject pages and mark them complete once you re-study.
      </div>
    </div>
  );
}
