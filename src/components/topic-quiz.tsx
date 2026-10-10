"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Lightbulb, RotateCcw, Sparkles, Trophy, X } from "lucide-react";
import { recordQuizResult } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export function TopicQuiz({
  questions,
  accent,
  topicKey,
  label,
}: {
  questions: QuizQuestion[];
  accent: string;
  topicKey?: string;
  label?: string;
}) {
  const qs = useMemo(() => questions, [questions]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [xpNote, setXpNote] = useState<string | null>(null);

  const q = qs[index];

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const nextQ = () => {
    if (index + 1 >= qs.length) setDone(true);
    else {
      setIndex((i) => i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIndex(0);
    setPicked(null);
    setScore(0);
    setDone(false);
    setXpNote(null);
  };

  useEffect(() => {
    if (!done) return;
    const entry = recordQuizResult({
      key: topicKey ?? "topic-quiz",
      label: label ?? "Topic quiz",
      score,
      total: qs.length,
    });
    setXpNote(`+${Math.max(2, Math.round(entry.pct / 10))} XP earned`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div className="rounded-3xl border border-ink/10 bg-paper p-8 text-center">
        <Trophy className="mx-auto size-10" style={{ color: accent }} />
        <p className="mt-3 font-display text-3xl font-semibold text-ink">
          {score} / {qs.length}
        </p>
        <p className="mt-1 text-sm text-ink/55">
          {pct >= 80
            ? "Outstanding — this topic is yours. Mark it complete below."
            : pct >= 50
              ? "Solid ground! Review the explanations once more, then move on."
              : "No shame — re-read the notes above and try again."}
        </p>
        {xpNote && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-4 py-1.5 text-xs font-bold text-leaf">
            <Sparkles className="size-3.5" /> {xpNote} · saved to My Space
          </p>
        )}
        <div>
          <button
            onClick={restart}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-cream"
            style={{ backgroundColor: accent }}
          >
            <RotateCcw className="size-4" /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
          Question {index + 1} / {qs.length}
        </p>
        <div className="flex gap-1.5">
          {qs.map((_, i) => (
            <span
              key={i}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6" : "w-3")}
              style={{ backgroundColor: i === index ? accent : "#0a1d1522" }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="mt-4 font-display text-xl font-semibold leading-snug text-ink sm:text-2xl">
            {q.question}
          </h3>

          <div className="mt-5 grid gap-3">
            {q.options.map((opt, i) => {
              const isCorrect = picked !== null && i === q.answerIndex;
              const isWrongPick = picked === i && i !== q.answerIndex;
              return (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  disabled={picked !== null}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-sm font-semibold transition-all",
                    picked === null && "border-ink/10 bg-card/60 text-ink hover:border-ink/40",
                    isCorrect && "border-leaf bg-leaf/10 text-ink",
                    isWrongPick && "border-clay bg-clay/10 text-ink",
                    picked !== null && !isCorrect && !isWrongPick && "border-ink/10 bg-card/40 text-ink/40"
                  )}
                >
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-black",
                      isCorrect && "border-leaf bg-leaf text-cream",
                      isWrongPick && "border-clay bg-clay text-cream",
                      !isCorrect && !isWrongPick && "border-ink/20 text-ink/50"
                    )}
                  >
                    {isCorrect ? <Check className="size-3.5" /> : isWrongPick ? <X className="size-3.5" /> : String.fromCharCode(65 + i)}
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
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-amber/10 p-4">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber" />
                  <p className="text-sm leading-relaxed text-ink/70">{q.explanation}</p>
                </div>
                <button
                  onClick={nextQ}
                  className="mt-4 rounded-full px-6 py-3 text-sm font-bold text-cream"
                  style={{ backgroundColor: accent }}
                >
                  {index + 1 === qs.length ? "See my score" : "Next question →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
