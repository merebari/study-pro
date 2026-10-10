"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BookOpen, GraduationCap, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  subjects: Array<{ id: number; name: string; slug: string; color: string; blurb: string }>;
  topics: Array<{ id: number; slug: string; title: string; subject: { slug: string; name: string } }>;
  classes: Array<{ id: number; slug: string; name: string; tagline: string }>;
};

type FlatItem = { href: string; label: string; meta: string; kind: "subject" | "topic" | "class" };

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResult(null);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResult(null);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) setResult(await res.json());
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => clearTimeout(t);
  }, [query]);

  const flat: FlatItem[] = [];
  if (result) {
    for (const c of result.classes) flat.push({ href: `/classes/${c.slug}`, label: c.name, meta: "Class", kind: "class" });
    for (const s of result.subjects) flat.push({ href: `/subjects/${s.slug}`, label: s.name, meta: "Subject", kind: "subject" });
    for (const t of result.topics) flat.push({ href: `/subjects/${t.subject.slug}/${t.slug}`, label: t.title, meta: t.subject.name, kind: "topic" });
  }

  const go = useCallback(
    (item?: FlatItem) => {
      const target = item ?? flat[active];
      if (!target) return;
      onClose();
      router.push(target.href);
    },
    [active, flat, onClose, router]
  );

  useEffect(() => setActive(0), [flat.length]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <div className="mx-auto mt-[10vh] w-[min(92vw,680px)] px-2">
            <motion.div
              initial={{ y: 24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="overflow-hidden rounded-3xl border border-ink/10 bg-paper shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
                <Search className="size-5 shrink-0 text-ink/40" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKey}
                  placeholder="Search every subject & topic — try “photosynthesis”…"
                  className="w-full bg-transparent font-display text-lg text-ink placeholder:text-ink/30 focus:outline-none"
                />
                {loading ? (
                  <Loader2 className="size-5 animate-spin text-ink/40" />
                ) : (
                  <button onClick={onClose} className="rounded-full p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink" aria-label="Close search">
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="max-h-[55vh] overflow-y-auto p-2">
                {!query.trim() && (
                  <div className="px-4 py-8 text-center">
                    <p className="font-display text-lg text-ink/60">The whole Nigerian curriculum, one search away.</p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                      {["Fractions", "Algebra", "Mole concept", "Letter Writing", "Federalism", "WAEC Biology"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          className="rounded-full border border-ink/15 bg-card px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/40 hover:text-ink"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {query.trim() && !loading && flat.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-ink/50">
                    No matches for “{query}”. Try another word — e.g. a subject or topic name.
                  </p>
                )}

                {flat.map((item, i) => (
                  <button
                    key={item.href + item.kind}
                    onClick={() => go(item)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors",
                      i === active ? "bg-forest text-cream" : "text-ink hover:bg-card"
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        i === active ? "bg-cream/15" : "bg-ink/5"
                      )}
                    >
                      {item.kind === "class" ? (
                        <GraduationCap className="size-4" />
                      ) : (
                        <BookOpen className="size-4" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{item.label}</span>
                      <span className={cn("block text-xs", i === active ? "text-cream/60" : "text-ink/40")}>{item.meta}</span>
                    </span>
                    <ArrowRight className={cn("size-4 shrink-0", i === active ? "text-amber" : "text-ink/20")} />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3 text-[11px] font-semibold text-ink/40">
                <span>↑↓ to move · Enter to open · Esc to close</span>
                <span>{flat.length > 0 ? `${flat.length} result${flat.length === 1 ? "" : "s"}` : ""}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
