"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, X } from "lucide-react";
import { SubjectIcon } from "@/components/icon-map";
import { cn } from "@/lib/utils";

type CatalogEntry = {
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
};

const BAND_FILTERS = [
  { code: "ALL", label: "All schools" },
  { code: "PRI", label: "Primary" },
  { code: "JSS", label: "Junior Sec" },
  { code: "SSS", label: "Senior Sec" },
];

export function SubjectCatalog({ entries }: { entries: CatalogEntry[] }) {
  const [band, setBand] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .map((e) => {
        const rows = band === "ALL" ? e.rows : e.rows.filter((r) => r.bandCode === band);
        return { ...e, rows };
      })
      .filter((e) => e.rows.length > 0)
      .filter((e) => !q || e.name.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [entries, band, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${entries.length} subjects…`}
            className="w-full rounded-full border border-ink/15 bg-paper py-3.5 pl-11 pr-10 text-sm font-medium text-ink placeholder:text-ink/35 focus:border-ink/50 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 hover:bg-ink/5"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {BAND_FILTERS.map((f) => (
            <button
              key={f.code}
              onClick={() => setBand(f.code)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-xs font-bold transition-colors",
                band === f.code
                  ? "border-forest bg-forest text-cream"
                  : "border-ink/15 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm font-semibold text-ink/45">
        {filtered.length} subject{filtered.length === 1 ? "" : "s"}
        {band !== "ALL" && ` in ${BAND_FILTERS.find((f) => f.code === band)?.label}`}
        {query && ` matching “${query}”`}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((e) => {
            const href = `/subjects/${e.rows[0].slug}`;
            const totalTopics = e.rows.reduce((n, r) => n + r.topicCount, 0);
            return (
              <motion.div
                layout
                key={e.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Link
                  href={href}
                  className="lift group flex flex-col gap-4 rounded-3xl border border-ink/10 bg-paper p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span
                        className="grid size-12 shrink-0 place-items-center rounded-2xl text-cream"
                        style={{ backgroundColor: e.color }}
                      >
                        <SubjectIcon icon={e.icon} className="size-6" />
                      </span>
                      <div>
                        <h3 className="font-display text-xl font-semibold leading-tight text-ink">
                          {e.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.14em] text-ink/40">
                          {totalTopics} topic{totalTopics === 1 ? "" : "s"} · across{" "}
                          {e.rows.reduce((n, r) => n + r.classes.length, 0)} classes
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight className="size-5 shrink-0 text-ink/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {e.rows
                      .slice()
                      .sort((a, b) => a.bandCode.localeCompare(b.bandCode))
                      .map((r) => (
                        <span
                          key={r.slug}
                          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: `${e.color}14`, color: e.color }}
                        >
                          {r.bandShort} ·{" "}
                          {r.classes
                            .slice()
                            .sort((a, b) => a.stage - b.stage)
                            .map((c) => c.name.replace("Primary ", "P").replace("JSS ", "J").replace("SS ", "SS"))
                            .join(", ")}
                        </span>
                      ))}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
          <p className="font-display text-xl text-ink/60">No subjects match that filter.</p>
          <p className="mt-1 text-sm text-ink/40">Try clearing the search or choosing a different school band.</p>
        </div>
      )}
    </div>
  );
}
