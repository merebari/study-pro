import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ClipboardList } from "lucide-react";
import { Reveal } from "@/components/motion";
import { SubjectIcon } from "@/components/icon-map";
import { TopicTabs } from "@/components/topic-tabs";
import { getSubjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSubjectBySlug(slug).catch(() => null);
  if (!data) return { title: "Subject not found" };
  return {
    title: `${data.subject.name} (${data.band.name}) — Topics & Notes`,
    description: data.subject.blurb,
  };
}

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ class?: string }>;
}) {
  const { slug } = await params;
  const { class: classParam } = await searchParams;
  const data = await getSubjectBySlug(slug);
  if (!data) notFound();

  const { subject, band, classes, topicsPerClass, totalTopics, totalQuestions } = data;

  return (
    <div className="bg-paper pb-24">
      {/* Header band */}
      <section
        className="dotgrid relative overflow-hidden pb-12 pt-14 sm:pt-20"
        style={{ background: `linear-gradient(180deg, ${subject.color}14 0%, transparent 100%)` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink/45">
              <Link href="/" className="hover:text-ink">Home</Link>
              <ChevronRight className="size-3" />
              <Link href="/subjects" className="hover:text-ink">Subjects</Link>
              <ChevronRight className="size-3" />
              <span className="text-ink/70">{subject.name}</span>
            </nav>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-start gap-5">
                <span
                  className="grid size-16 shrink-0 place-items-center rounded-3xl text-cream shadow-lg sm:size-20"
                  style={{ backgroundColor: subject.color }}
                >
                  <SubjectIcon icon={subject.icon} className="size-8 sm:size-10" />
                </span>
                <div>
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                    style={{ backgroundColor: `${subject.color}18`, color: subject.color }}
                  >
                    {band.name}
                  </span>
                  <h1 className="mt-2 font-display text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
                    {subject.name}
                  </h1>
                </div>
              </div>

              <dl className="flex gap-8 lg:text-right">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Topics</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">{totalTopics}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Classes</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">{classes.length}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">Quiz Qs</dt>
                  <dd className="mt-1 font-display text-3xl font-semibold text-ink">{totalQuestions}</dd>
                </div>
              </dl>
            </div>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/60">{subject.blurb}</p>

            {totalQuestions > 0 && (
              <Link
                href={`/practice?subject=${subject.id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-cream shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: subject.color }}
              >
                <ClipboardList className="size-4" />
                Practice {subject.name} questions ({totalQuestions})
              </Link>
            )}
          </Reveal>
        </div>
      </section>

      {/* Topics by class */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold text-ink">The syllabus, class by class</h2>
            <p className="mt-2 text-ink/55">
              Pick your class tab — the list below shows exactly what {subject.name} expects at that level.
            </p>
          </div>
        </Reveal>

        <TopicTabs
          subjectSlug={subject.slug}
          color={subject.color}
          defaultTab={classParam}
          tabs={topicsPerClass.map(({ cls, topics }) => ({
            slug: cls.slug,
            name: cls.name,
            topics: topics.map((t) => ({
              slug: t.topic.slug,
              title: t.topic.title,
              focus: t.focus,
              questionCount: t.questionCount,
              term: t.topic.term,
              rich: t.topic.explanation.length > 0,
            })),
          }))}
        />
      </section>
    </div>
  );
}
