"use client";

import { useEffect, useState } from "react";
import { Bookmark, Printer } from "lucide-react";
import { getBookmarks, toggleBookmarked, STORE_EVENT } from "@/lib/study-store";
import { cn } from "@/lib/utils";

export function BookmarkButton({
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(getBookmarks().some((e) => e.key === key));
    sync();
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, [key]);

  return (
    <button
      onClick={() =>
        setSaved(
          toggleBookmarked({ key, title, subjectSlug, subjectName, color, term })
        )
      }
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-bold transition-all",
        saved
          ? "border-amber bg-amber/15 text-amber"
          : "border-ink/15 bg-paper text-ink hover:border-amber hover:text-amber"
      )}
    >
      <Bookmark className={cn("size-4", saved && "fill-amber")} />
      {saved ? "Bookmarked" : "Bookmark for revision"}
    </button>
  );
}

export function PrintButton() {
  return (
    <button
      onClick={() => {
        const wasDark = document.documentElement.classList.contains("dark");
        if (wasDark) document.documentElement.classList.remove("dark");
        setTimeout(() => {
          window.print();
          if (wasDark) document.documentElement.classList.add("dark");
        }, 50);
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink/15 bg-paper px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-ink"
    >
      <Printer className="size-4" />
      Print / Save as PDF
    </button>
  );
}
