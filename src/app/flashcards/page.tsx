"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Layers,
  Loader2,
  RotateCcw,
  Shuffle,
  Sparkles,
  X,
} from "lucide-react";
import { awardXp } from "@/lib/study-store";
import { cn } from "@/lib/utils";

type CatalogClass = {
  id: number;
  name: string;
  subjects: Array<{ id: number; name: string; slug: string; count: number }>;
};

type Card = { front: string; back: string; topic: string };

export default function FlashcardsPage() {
  const [catalog, setCatalog] = useState<CatalogClass[]>([]);
  const [allSubjects, setAllSubjects] = useState<CatalogClass["subjects"]>([]);
  const [classId, setClassId] = useState<number | null>(null);
  const [subjectId, setSubjectId] = useState<number | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
  const [cursor, setCursor] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());
  const [review, setReview] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        setCatalog(d.catalog ?? []);
        // Flashcards work for every subject with key terms, not only quiz subjects:
        // the catalog only includes subjects with questions, so also fetch full list via search-free route
      })
      .catch(() => {});
  }, []);

  // Load full subject list per class lazily from the server-rendered catalog fallback
  useEffect(() => {
    if (!classId) return;
    const cls = catalog.find((c) => c.id === classId);
    setAllSubjects(cls?.subjects ?? []);
    setSubjectId(null);
  }, [classId, catalog]);

  const currentClass = catalog.find((c) => c.id === classId) ?? null;

  const buildDeck = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ subject: String(subjectId) });
      if (classId) params.set("class", String(classId));
      const res = await fetch(`/api/flashcards?${params.toString()}`);
      const d = await res.json();
      setDeck(d.cards ?? []);
      setCursor(0);
      setFlipped(false);
      setKnown(new Set());
      setReview(new Set());
      setStarted(true);
    } finally {
      setLoading(false);
    }
  };

  const mark = (isKnown: boolean) => {
    if (isKnown) {
      setKnown((k) => new Set(k).add(cursor));
      awardXp(2, "Flashcard mastered");
    } else {
      setReview((r) => new Set(r).add(cursor));
    }
    setFlipped(false);
    setTimeout(() => setCursor((c) => c + 1), 180);
  };

  const finished = started && deck.length > 0 && cursor >= deck.length;

  const reviewDeck = useMemo(() => [...review].map((i) => deck[i]).filter(Boolean), [review, deck]);

  /* ── Setup ── */
  if (!started || deck.length === 0) {
    return (
      <div className="bg-paper pb-24">
        <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-1.5 text-xs font-bold text-ink/60">
                <Layers className="size-3.5 text-leaf" /> Flip-to-learn revision
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
                Flash<span className="italic text-leaf">cards</span>
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
                Key terms from every topic, turned into quick-fire decks. Flip, decide if you knew it,
                and drill your weak cards again.
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
                  onClick={() => setClassId(c.id)}
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
                <p className="mt-8 font-display text-xl font-semibold text-ink">2 · Choose a subject</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {allSubjects.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSubjectId(s.id)}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-sm font-bold transition-all",
                        subjectId === s.id
                          ? "border-leaf bg-leaf text-cream"
                          : "border-ink/15 bg-card/60 text-ink/65 hover:border-ink/40"
                      )}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {started && deck.length === 0 && !loading && (
              <p className="mt-6 rounded-2xl bg-amber/10 px-4 py-3 text-sm font-semibold text-amber">
                No cards for this selection yet — full lesson batches are rolling out subject by subject.
              </p>
            )}

            <div className="mt-10 border-t border-dashed border-ink/15 pt-8">
              <button
                onClick={buildDeck}
                disabled={loading || !subjectId}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-bold text-cream transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Shuffle className="size-4 text-amber" />}
                Deal the deck
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Finished ── */
  if (finished) {
    const pct = Math.round((known.size / deck.length) * 100);
    return (
      <div className="bg-paper pb-24">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-ink/10 bg-paper p-10 text-center">
            <Sparkles className="mx-auto size-10 text-amber" />
            <h2 className="mt-4 font-display text-4xl font-semibold text-ink">Deck complete!</h2>
            <p className="mt-2 text-ink/60">
              You knew <strong className="text-ink">{known.size}</strong> of {deck.length} cards ({pct}%).
              {review.size > 0 && ` ${review.size} cards went to your review pile.`}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {review.size > 0 && (
                <button
                  onClick={() => {
                    setDeck(reviewDeck);
                    setCursor(0);
                    setKnown(new Set());
                    setReview(new Set());
                    setFlipped(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-black text-[#0a1d15]"
                >
                  <RotateCcw className="size-4" /> Drill the {review.size} weak cards
                </button>
              )}
              <button
                onClick={() => {
                  setStarted(false);
                  setDeck([]);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream"
              >
                <ArrowLeft className="size-4" /> New deck
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Playing ── */
  const card = deck[cursor];
  return (
    <div className="bg-paper pb-24">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setStarted(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/45 hover:text-ink"
          >
            <ArrowLeft className="size-3.5" /> End deck
          </button>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
            Card {cursor + 1} of {deck.length}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
          <motion.div className="h-full rounded-full bg-leaf" animate={{ width: `${((cursor) / deck.length) * 100}%` }} />
        </div>

        {/* Card */}
        <div className="mt-8" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait">
            <motion.button
              key={cursor}
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -2 }}
              transition={{ duration: 0.25 }}
              onClick={() => setFlipped((f) => !f)}
              className="relative block min-h-[340px] w-full cursor-pointer text-left sm:min-h-[380px]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full min-h-[inherit]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border-2 border-ink/10 bg-paper p-8 shadow-xl"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <span className="rounded-full bg-leaf/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-leaf">
                    {card.topic}
                  </span>
                  <p className="mt-6 max-w-lg text-center font-display text-3xl font-semibold leading-tight text-balance text-ink sm:text-4xl">
                    {card.front}
                  </p>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-ink/35">
                    Tap to flip
                  </p>
                </div>
                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] border-2 border-leaf/40 bg-forest p-8 text-cream shadow-xl"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <span className="rounded-full bg-amber/20 px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-amber">
                    Meaning
                  </span>
                  <p className="mt-6 max-w-lg text-center font-display text-xl font-medium leading-relaxed text-balance sm:text-2xl">
                    {card.back}
                  </p>
                </div>
              </motion.div>
            </motion.button>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={() => mark(false)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-clay/40 bg-clay/10 px-6 py-4 text-sm font-bold text-clay transition-all hover:-translate-y-0.5"
          >
            <X className="size-4" /> Still learning
          </button>
          <button
            onClick={() => mark(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-leaf bg-leaf px-6 py-4 text-sm font-bold text-cream transition-all hover:-translate-y-0.5"
          >
            <Check className="size-4" /> I know this
          </button>
        </div>
        <p className="mt-4 text-center text-xs font-semibold text-ink/40">
          Known: {known.size} · Review pile: {review.size} · Remaining: {deck.length - cursor}
        </p>
      </div>
    </div>
  );
}
