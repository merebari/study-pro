"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TopicRow } from "@/components/cards";
import { cn } from "@/lib/utils";

type TopicItem = {
  slug?: string;
  title: string;
  focus: string | null;
  questionCount: number;
  term?: number;
  rich?: boolean;
};

const TERMS = [
  { n: 1, label: "First Term" },
  { n: 2, label: "Second Term" },
  { n: 3, label: "Third Term" },
];

export function TopicTabs({
  subjectSlug,
  color,
  tabs,
  defaultTab,
}: {
  subjectSlug: string;
  color: string;
  tabs: Array<{ slug: string; name: string; topics: TopicItem[] }>;
  defaultTab?: string;
}) {
  const [active, setActive] = useState(
    defaultTab && tabs.some((t) => t.slug === defaultTab) ? defaultTab : tabs[0]?.slug
  );
  const current = tabs.find((t) => t.slug === active) ?? tabs[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.slug}
            onClick={() => setActive(t.slug)}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-bold transition-colors",
              active === t.slug
                ? "border-ink text-cream"
                : "border-ink/15 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink"
            )}
            style={active === t.slug ? { backgroundColor: color, borderColor: color } : undefined}
          >
            {t.name}
            <span className={cn("ml-2 text-xs", active === t.slug ? "text-cream/70" : "text-ink/35")}>
              {t.topics.length}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mt-6 space-y-8"
      >
        {current && current.topics.length > 0 ? (
          TERMS.map((term) => {
            const termTopics = current.topics.filter((t) => (t.term ?? 2) === term.n);
            if (termTopics.length === 0) return null;
            return (
              <div key={term.n}>
                <div className="mb-3 flex items-center gap-3">
                  <h3 className="font-display text-xl font-semibold text-ink">{term.label}</h3>
                  <span className="h-px flex-1 bg-ink/10" />
                  <span className="text-xs font-bold text-ink/40">{termTopics.length} topics</span>
                </div>
                <div className="overflow-hidden rounded-3xl border border-ink/10 bg-paper">
                  {termTopics.map((t, i) => (
                    <TopicRow
                      key={t.slug ?? t.title}
                      subjectSlug={subjectSlug}
                      slug={t.slug!}
                      title={t.title}
                      focus={t.focus}
                      index={i}
                      color={color}
                      questionCount={t.questionCount}
                      rich={t.rich}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-3xl border border-ink/10 bg-paper px-6 py-10 text-center text-sm text-ink/45">
            No topics listed for this class yet — check another tab.
          </p>
        )}
      </motion.div>
    </div>
  );
}
