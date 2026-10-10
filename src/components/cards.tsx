import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, ClipboardList } from "lucide-react";
import type { Band, ClassRow, Subject } from "@/db/schema";
import { SubjectIcon } from "@/components/icon-map";
import { cn } from "@/lib/utils";

const BAND_ACCENT: Record<string, { bar: string; text: string; soft: string }> = {
  PRI: { bar: "bg-leaf", text: "text-leaf", soft: "bg-leaf/10" },
  JSS: { bar: "bg-skyblue", text: "text-skyblue", soft: "bg-skyblue/10" },
  SSS: { bar: "bg-clay", text: "text-clay", soft: "bg-clay/10" },
};

export function ClassCard({
  cls,
  band,
  subjectCount,
}: {
  cls: ClassRow;
  band: Band;
  subjectCount: number;
}) {
  const accent = BAND_ACCENT[band.code] ?? BAND_ACCENT.PRI;
  return (
    <Link
      href={`/classes/${cls.slug}`}
      className="lift group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6"
    >
      <span className={cn("absolute inset-x-0 top-0 h-1.5", accent.bar)} />
      <span
        className="pointer-events-none absolute -right-4 -top-6 select-none font-display text-[7rem] font-bold leading-none text-ink/[0.055] transition-transform duration-500 group-hover:scale-110"
        aria-hidden
      >
        {cls.stage}
      </span>
      <span className={cn("text-[11px] font-bold uppercase tracking-[0.2em]", accent.text)}>
        {band.short} School
      </span>
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink">{cls.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55">{cls.tagline}</p>
      <div className="mt-auto flex items-center justify-between pt-6">
        <span className="text-xs font-bold text-ink/45">{subjectCount} subjects</span>
        <span className="grid size-9 place-items-center rounded-full bg-ink/[0.06] text-ink transition-all duration-300 group-hover:bg-forest group-hover:text-cream">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
    </Link>
  );
}

export function SubjectCard({
  subject,
  topicCount,
  questionCount = 0,
  classSlug,
}: {
  subject: Subject;
  topicCount: number;
  questionCount?: number;
  classSlug?: string;
}) {
  return (
    <Link
      href={`/subjects/${subject.slug}${classSlug ? `?class=${classSlug}` : ""}`}
      className="lift group relative flex flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6"
    >
      <span
        className="absolute -right-10 -top-10 size-32 rounded-full opacity-[0.07] transition-transform duration-500 group-hover:scale-125"
        style={{ backgroundColor: subject.color }}
        aria-hidden
      />
      <div className="flex items-start justify-between">
        <span
          className="grid size-12 place-items-center rounded-2xl text-cream shadow-sm"
          style={{ backgroundColor: subject.color }}
        >
          <SubjectIcon icon={subject.icon} className="size-6" />
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">
        {subject.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/55">{subject.blurb}</p>
      <div className="mt-auto flex items-center gap-3 pt-5 text-xs font-bold text-ink/45">
        <span className="inline-flex items-center gap-1">
          <BookOpen className="size-3.5" /> {topicCount} topics
        </span>
        {questionCount > 0 && (
          <span className="inline-flex items-center gap-1 text-leaf">
            <ClipboardList className="size-3.5" /> {questionCount} quiz Qs
          </span>
        )}
        <ArrowRight className="ml-auto size-4 text-ink/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink" />
      </div>
    </Link>
  );
}

export function TopicRow({
  subjectSlug,
  slug,
  title,
  focus,
  index,
  color,
  questionCount = 0,
  rich = false,
}: {
  subjectSlug: string;
  slug: string;
  title: string;
  focus?: string | null;
  index: number;
  color: string;
  questionCount?: number;
  rich?: boolean;
}) {
  return (
    <Link
      href={`/subjects/${subjectSlug}/${slug}`}
      className="sweep group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-ink/10 px-4 py-4 last:border-b-0 sm:px-6"
      style={{ ["--sweep-color" as string]: color }}
    >
      <span className="w-9 shrink-0 font-display text-lg font-semibold tabular-nums text-ink/30 transition-colors group-hover:text-ink/60">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 font-semibold text-ink">
          {title}
          {rich && (
            <span className="rounded-full bg-amber/15 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber">
              Full Notes
            </span>
          )}
        </span>
        {focus && <span className="mt-0.5 block truncate text-xs text-ink/45 sm:text-sm">{focus}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        {questionCount > 0 && (
          <span className="hidden items-center gap-1 rounded-full bg-leaf/10 px-2.5 py-1 text-[11px] font-bold text-leaf sm:inline-flex">
            <CheckCircle2 className="size-3" /> quiz
          </span>
        )}
        <ArrowRight className="size-4 text-ink/25 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink" />
      </span>
    </Link>
  );
}

export function ClassPill({
  slug,
  name,
  active = false,
}: {
  slug: string;
  name: string;
  active?: boolean;
}) {
  return (
    <Link
      href={`/classes/${slug}`}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors",
        active
          ? "border-forest bg-forest text-cream"
          : "border-ink/15 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink"
      )}
    >
      {name}
    </Link>
  );
}
