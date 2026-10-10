"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Eye, EyeOff, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  id: number;
  exam: string;
  year: number | null;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  subjectName: string;
  subjectSlug: string;
  subjectColor: string;
  className: string | null;
};

const EXAM_COLORS: Record<string, string> = {
  WAEC: "#e45b3d",
  NECO: "#5ab3e8",
  JAMB: "#2f9c68",
  BECE: "#8b5cf6",
  "Common Entrance": "#f2b33d",
};

export function PastQuestionsClient({ items, exams }: { items: Item[]; exams: string[] }) {
  const [exam, setExam] = useState<string>("ALL");
  const [subject, setSubject] = useState<string>("ALL");
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [tries, setTries] = useState<Record<number, number>>({});

  const subjects = useMemo(
    () => [...new Set(items.filter((i) => exam === "ALL" || i.exam === exam).map((i) => i.subjectName))].sort(),
    [items, exam]
  );

  const filtered = items.filter(
    (i) => (exam === "ALL" || i.exam === exam) && (subject === "ALL" || i.subjectName === subject)
  );

  return (
    <div>
      {/* Filters */}
      <div className="sticky top-[84px] z-20 rounded-3xl border border-ink/10 bg-paper/95 p-4 shadow-lg backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-2">
          <FileText className="size-4 text-ink/40" />
          {["ALL", ...exams].map((e) => (
            <button
              key={e}
              onClick={() => {
                setExam(e);
                setSubject("ALL");
              }}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
                exam === e ? "border-forest bg-forest text-cream" : "border-ink/15 text-ink/60 hover:border-ink/40"
              )}
              style={exam === e && e !== "ALL" ? { backgroundColor: EXAM_COLORS[e], borderColor: EXAM_COLORS[e] } : undefined}
            >
              {e === "ALL" ? "All exams" : e}
            </button>
          ))}
          <div className="relative ml-auto">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="appearance-none rounded-full border border-ink/15 bg-paper py-1.5 pl-4 pr-9 text-xs font-bold text-ink/70 focus:outline-none"
            >
              <option value="ALL">All subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-ink/40" />
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink/45">
        {filtered.length} past question{filtered.length === 1 ? "" : "s"}
        {exam !== "ALL" && ` from ${exam}`}
        {subject !== "ALL" && ` in ${subject}`}
      </p>

      {/* Question cards */}
      <div className="mt-4 space-y-4">
        {filtered.map((item, i) => {
          const isRevealed = revealed.has(item.id);
          const myTry = tries[item.id];
          const examColor = EXAM_COLORS[item.exam] ?? "#2f9c68";
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.3) }}
              className="overflow-hidden rounded-3xl border border-ink/10 bg-paper"
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 px-5 py-3">
                <span className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-cream" style={{ backgroundColor: examColor }}>
                  {item.exam}{item.year ? ` ${item.year}` : ""}
                </span>
                <Link href={`/subjects/${item.subjectSlug}`} className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider hover:underline" style={{ backgroundColor: `${item.subjectColor}14`, color: item.subjectColor }}>
                  {item.subjectName}
                </Link>
                {item.className && (
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-ink/50">
                    {item.className}
                  </span>
                )}
              </div>

              <div className="px-5 py-5 sm:px-7">
                <p className="font-display text-lg font-semibold leading-snug text-ink sm:text-xl">
                  {item.question}
                </p>

                <div className="mt-4 grid gap-2">
                  {item.options.map((opt, oi) => {
                    const selected = myTry === oi;
                    const correct = isRevealed && oi === item.answerIndex;
                    const wrongPick = isRevealed && selected && oi !== item.answerIndex;
                    return (
                      <button
                        key={oi}
                        onClick={() => setTries((t) => ({ ...t, [item.id]: oi }))}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all",
                          !isRevealed && !selected && "border-ink/10 bg-card/50 text-ink hover:border-ink/35",
                          !isRevealed && selected && "border-ink bg-ink/5 text-ink",
                          correct && "border-leaf bg-leaf/10 text-ink",
                          wrongPick && "border-clay bg-clay/10 text-ink",
                          isRevealed && !correct && !wrongPick && "border-ink/10 bg-card/30 text-ink/40"
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full border text-[11px] font-black",
                            correct && "border-leaf bg-leaf text-cream",
                            wrongPick && "border-clay bg-clay text-cream",
                            !correct && !wrongPick && "border-ink/20 text-ink/50"
                          )}
                        >
                          {correct ? <Check className="size-3" /> : String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setRevealed((r) => {
                      const next = new Set(r);
                      if (next.has(item.id)) next.delete(item.id);
                      else next.add(item.id);
                      return next;
                    })
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-cream"
                >
                  {isRevealed ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                  {isRevealed ? "Hide answer" : "Reveal answer & explanation"}
                </button>

                <AnimatePresence>
                  {isRevealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 rounded-2xl bg-amber/10 p-4">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-amber">Marking scheme</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
          <p className="font-display text-xl text-ink/60">Nothing here for that filter yet.</p>
          <p className="mt-1 text-sm text-ink/40">The vault grows with every content batch — try a different exam or subject.</p>
        </div>
      )}
    </div>
  );
}
