"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { getCompleted, toggleCompleted, STORE_EVENT, type CompletedEntry } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export type { CompletedEntry };
export const readCompleted = getCompleted;

export function MarkComplete({
  topicSlug,
  title,
  subjectSlug,
  subjectName,
  color,
  term,
}: {
  topicSlug: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  color: string;
  term?: number;
}) {
  const key = `${subjectSlug}/${topicSlug}`;
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => setDone(getCompleted().some((e) => e.key === key));
    sync();
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, [key]);

  return (
    <button
      onClick={() => setDone(toggleCompleted({ key, title, subjectSlug, subjectName, color, term }))}
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 px-6 py-3.5 text-sm font-bold transition-all",
        done
          ? "border-leaf bg-leaf text-cream"
          : "border-ink/15 bg-paper text-ink hover:border-leaf hover:text-leaf"
      )}
    >
      {done ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
      {mounted && done ? "Topic mastered ✓" : "Mark topic as complete"}
    </button>
  );
}
