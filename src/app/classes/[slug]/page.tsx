import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { SubjectCard } from "@/components/cards";
import { getClassBySlug, getClasses, getClassesWithCounts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const cls = await getClasses();
  return cls.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getClassBySlug(slug).catch(() => null);
  if (!data) return { title: "Class not found" };
  return {
    title: `${data.cls.name} — ${data.band.name} Subjects & Topics`,
    description: data.cls.description,
  };
}

const BAND_STYLES: Record<string, string> = {
  PRI: "bg-leaf/10 text-leaf",
  JSS: "bg-skyblue/10 text-skyblue",
  SSS: "bg-clay/10 text-clay",
};

export default async function ClassDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, allClasses] = await Promise.all([getClassBySlug(slug), getClassesWithCounts()]);
  if (!data) notFound();

  const { cls, band, subjects } = data;
  const idx = allClasses.findIndex((c) => c.slug === slug);
  const prev = idx > 0 ? allClasses[idx - 1] : null;
  const next = idx < allClasses.length - 1 ? allClasses[idx + 1] : null;
  const totalTopics = subjects.reduce((n, s) => n + s.topicCount, 0);
  const totalQs = subjects.reduce((n, s) => n + s.questionCount, 0);

  return (
    <div className="bg-paper">
      {/* Header */}
      <section className="dotgrid relative overflow-hidden pb-12 pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className={cn("rounded-full px-4 py-1.5 text-xs font-bold", BAND_STYLES[band.code])}>
                {band.name}
              </span>
              <span className="rounded-full border border-ink/15 px-4 py-1.5 text-xs font-bold text-ink/60">
                Stage {String(cls.stage).padStart(2, "0")} / 12
              </span>
              {cls.exam && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-4 py-1.5 text-xs font-bold text-amber">
                  <Trophy className="size-3.5" /> {cls.exam}
                </span>
              )}
            </div>
            <h1 className="mt-5 font-display text-6xl font-semibold tracking-tight text-ink sm:text-8xl">
              {cls.name}
            </h1>
            <p className="mt-3 font-display text-xl italic text-ink/50">{cls.tagline}</p>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/60">{cls.description}</p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-dashed border-ink/15 py-5">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Subjects</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink">{subjects.length}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Topics</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink">{totalTopics}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Quiz questions</dt>
                <dd className="mt-1 font-display text-3xl font-semibold text-ink">{totalQs}</dd>
              </div>
              {totalQs > 0 && (
                <div className="ml-auto self-center">
                  <Link
                    href={`/practice?class=${cls.id}`}
                    className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream transition-all hover:-translate-y-0.5"
                  >
                    Quiz me on {cls.name}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              )}
            </dl>

            {cls.exam && cls.examDetail && (
              <div className="mt-6 flex items-start gap-3 rounded-3xl border border-amber/40 bg-amber/10 p-5">
                <Trophy className="mt-0.5 size-5 shrink-0 text-amber" />
                <p className="text-sm leading-relaxed text-ink/70">
                  <strong className="font-semibold text-ink">Exam focus — {cls.exam}: </strong>
                  {cls.examDetail}
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Subjects */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-ink">
              Subjects in {cls.name}
            </h2>
            <p className="mt-2 text-ink/55">
              Open any subject to see its topic-by-topic breakdown for this class.
            </p>
          </Reveal>
          <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjects.map(({ subject, topicCount, questionCount }) => (
              <StaggerItem key={subject.id}>
                <SubjectCard
                  subject={subject}
                  topicCount={topicCount}
                  questionCount={questionCount}
                  classSlug={cls.slug}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* Prev / next */}
      <section className="border-t border-ink/10 bg-card">
        <div className="mx-auto grid max-w-7xl gap-px sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/classes/${prev.slug}`}
              className="group flex items-center gap-4 px-6 py-8 transition-colors hover:bg-paper"
            >
              <ArrowLeft className="size-5 text-ink/30 transition-transform group-hover:-translate-x-1" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-ink/40">Previous class</span>
                <span className="font-display text-2xl font-semibold text-ink">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/classes/${next.slug}`}
              className="group flex items-center justify-end gap-4 px-6 py-8 text-right transition-colors hover:bg-paper"
            >
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.18em] text-ink/40">Next class</span>
                <span className="font-display text-2xl font-semibold text-ink">{next.name}</span>
              </span>
              <ArrowRight className="size-5 text-ink/30 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
