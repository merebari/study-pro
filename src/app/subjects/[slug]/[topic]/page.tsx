import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCopy,
  GraduationCap,
  Layers,
  Lightbulb,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { SubjectIcon } from "@/components/icon-map";
import { TopicQuiz } from "@/components/topic-quiz";
import { MarkComplete } from "@/components/mark-complete";
import { BookmarkButton, PrintButton } from "@/components/save-buttons";
import { getTopicDetail, getSubjectsIndex, getSubjectBySlug } from "@/lib/data";

export const dynamic = "force-dynamic";

const TERM_NAMES: Record<number, string> = { 1: "First Term", 2: "Second Term", 3: "Third Term" };

export async function generateStaticParams() {
  const index = await getSubjectsIndex();
  const out: Array<{ slug: string; topic: string }> = [];
  for (const entry of index) {
    for (const row of entry.rows) {
      const detail = await getSubjectBySlug(row.slug);
      if (!detail) continue;
      const seen = new Set<string>();
      for (const perClass of detail.topicsPerClass) {
        for (const t of perClass.topics) {
          if (seen.has(t.topic.slug)) continue;
          seen.add(t.topic.slug);
          out.push({ slug: row.slug, topic: t.topic.slug });
        }
      }
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}): Promise<Metadata> {
  const { slug, topic } = await params;
  const data = await getTopicDetail(slug, topic).catch(() => null);
  if (!data) return { title: "Topic not found" };
  return {
    title: `${data.topic.title} — ${data.subject.name} Lesson Notes & Quiz`,
    description: data.topic.overview.slice(0, 155),
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string; topic: string }>;
}) {
  const { slug, topic: topicSlug } = await params;
  const data = await getTopicDetail(slug, topicSlug);
  if (!data) notFound();

  const { subject, band, topic, taughtIn, questions, prev, next } = data;
  const color = subject.color;
  const termName = TERM_NAMES[topic.term] ?? "Second Term";
  const firstClass = taughtIn[0]?.cls;

  return (
    <div className="bg-paper pb-24">
      {/* Header */}
      <section
        className="dotgrid relative overflow-hidden pb-10 pt-12 sm:pt-16"
        style={{ background: `linear-gradient(180deg, ${color}14 0%, transparent 100%)` }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <nav className="no-print flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink/45">
              <Link href="/" className="hover:text-ink">Home</Link>
              <ChevronRight className="size-3" />
              {firstClass && (
                <>
                  <Link href={`/classes/${firstClass.slug}`} className="hover:text-ink">
                    {firstClass.name}
                  </Link>
                  <ChevronRight className="size-3" />
                </>
              )}
              <Link href={`/subjects/${subject.slug}`} className="hover:text-ink">
                {subject.name}
              </Link>
              <ChevronRight className="size-3" />
              <span className="text-ink/70">{termName}</span>
              <ChevronRight className="size-3" />
              <span className="text-ink/70">{topic.title}</span>
            </nav>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {subject.name} · {band.short}
                </span>
                <span className="rounded-full border border-ink/15 bg-paper px-3 py-1 text-[11px] font-bold text-ink/60">
                  {termName}
                </span>
                {taughtIn.map(({ cls }) => (
                  <Link
                    key={cls.id}
                    href={`/classes/${cls.slug}`}
                    className="no-print rounded-full border border-ink/15 bg-paper px-3 py-1 text-[11px] font-bold text-ink/60 transition-colors hover:border-ink hover:text-ink"
                  >
                    {cls.name}
                  </Link>
                ))}
              </div>
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-balance text-ink sm:text-7xl">
                {topic.title}
              </h1>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px]">
        {/* ── Main column ── */}
        <div className="min-w-0">
          {/* Overview */}
          <Reveal className="print-block rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
            <div className="no-print flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
              <BookOpen className="size-4" style={{ color }} /> Study notes · {termName}
            </div>
            <p className="mt-4 text-lg leading-relaxed text-ink/80">{topic.overview}</p>
            {topic.gloss && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl p-5" style={{ backgroundColor: `${color}10` }}>
                <Lightbulb className="mt-0.5 size-5 shrink-0" style={{ color }} />
                <p className="text-sm leading-relaxed text-ink/75">
                  <strong className="font-semibold text-ink">In plain words: </strong>
                  {topic.gloss.charAt(0).toUpperCase() + topic.gloss.slice(1)}.
                </p>
              </div>
            )}
          </Reveal>

          {/* Key terms */}
          {topic.keyTerms.length > 0 && (
            <Reveal className="print-block mt-6 rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                <Sparkles className="size-4" style={{ color }} /> Key terms to master
              </div>
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {topic.keyTerms.map((kt) => (
                  <div key={kt.term} className="rounded-2xl bg-card p-4">
                    <dt className="font-display text-base font-semibold" style={{ color }}>
                      {kt.term}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink/70">{kt.def}</dd>
                  </div>
                ))}
              </dl>
              <Link
                href={`/flashcards?subject=${subject.id}`}
                className="no-print mt-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-xs font-bold text-ink transition-colors hover:border-ink"
              >
                <Layers className="size-3.5" style={{ color }} /> Revise these terms as flashcards
              </Link>
            </Reveal>
          )}

          {/* Full lesson explanation (rich batches) */}
          {topic.explanation.length > 0 && (
            <Reveal className="print-block mt-6 rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                <BookOpen className="size-4" style={{ color }} /> The full lesson
              </div>
              <div className="mt-5 space-y-4">
                {topic.explanation.map((para, i) => (
                  <p key={i} className="text-[17px] leading-relaxed text-ink/80">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
          )}

          {/* Worked examples */}
          {topic.examples.length > 0 && (
            <section className="print-block mt-6 rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
                <ClipboardCopy className="size-4" style={{ color }} /> Worked examples
              </div>
              <div className="mt-5 space-y-5">
                {topic.examples.map((ex, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-ink/10">
                    <div className="px-5 py-4" style={{ backgroundColor: `${color}0d` }}>
                      <p className="text-sm font-bold uppercase tracking-[0.14em]" style={{ color }}>
                        Example {i + 1}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold leading-snug text-ink">{ex.q}</p>
                    </div>
                    <ol className="space-y-2.5 px-5 py-4">
                      {ex.steps.map((step, si) => (
                        <li key={si} className="flex items-start gap-3 text-sm leading-relaxed text-ink/75">
                          <span
                            className="mt-0.5 grid size-5.5 size-6 shrink-0 place-items-center rounded-full text-xs font-black text-cream"
                            style={{ backgroundColor: color }}
                          >
                            {si + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <div className="border-t border-dashed border-ink/15 px-5 py-3.5">
                      <p className="text-sm">
                        <span className="font-black uppercase tracking-[0.14em] text-leaf">Answer: </span>
                        <span className="font-semibold text-ink">{ex.answer}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Objectives */}
          <Reveal className="print-block mt-6 rounded-3xl border border-ink/10 bg-paper p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ink/45">
              <Target className="size-4" style={{ color }} /> By the end, you can…
            </div>
            <ul className="mt-5 space-y-3">
              {topic.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-leaf" />
                  <span className="text-[15px] leading-relaxed text-ink/75">{obj}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Class by class */}
          <section className="no-print mt-10">
            <Reveal>
              <h2 className="flex items-center gap-2.5 font-display text-3xl font-semibold text-ink">
                <GraduationCap className="size-7" style={{ color }} />
                Class by class
              </h2>
              <p className="mt-2 text-ink/55">
                The same topic grows with you. Here is exactly what each level expects:
              </p>
            </Reveal>
            <StaggerGroup className="mt-6 grid gap-3">
              {taughtIn.map(({ cls, focus }) => (
                <StaggerItem key={cls.id}>
                  <div className="sweep grid gap-1 rounded-2xl border border-ink/10 bg-paper px-5 py-4 sm:grid-cols-[140px_1fr] sm:items-center sm:gap-4" style={{ ["--sweep-color" as string]: color }}>
                    <Link
                      href={`/classes/${cls.slug}`}
                      className="font-display text-lg font-semibold text-ink hover:underline"
                    >
                      {cls.name}
                    </Link>
                    <p className="text-sm leading-relaxed text-ink/60">
                      {focus ?? `Build solid foundations on ${topic.title.toLowerCase()} at ${cls.name} level.`}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>

          {/* Summary */}
          {topic.summary.length > 0 && (
            <section className="print-block mt-6">
              <Reveal className="rounded-3xl border-2 p-6 sm:p-8" >
                <div className="rounded-3xl p-6 sm:p-8" style={{ backgroundColor: `${color}0d` }}>
                  <h2 className="flex items-center gap-2.5 font-display text-2xl font-semibold text-ink">
                    <ListChecks className="size-6" style={{ color }} />
                    Summary — remember these
                  </h2>
                  <ul className="mt-5 space-y-3">
                    {topic.summary.map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-black text-cream"
                          style={{ backgroundColor: color }}
                        >
                          {i + 1}
                        </span>
                        <p className="text-[15px] leading-relaxed text-ink/75">{s}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </section>
          )}

          {/* Quiz */}
          {questions.length > 0 && (
            <section className="no-print mt-10">
              <Reveal>
                <h2 className="font-display text-3xl font-semibold text-ink">
                  Test yourself <span className="italic" style={{ color }}>right now</span>
                </h2>
                <p className="mt-2 text-ink/55">
                  Instant answers with explanations — exam-style, calibrated to this topic.
                </p>
              </Reveal>
              <Reveal className="mt-6">
                <TopicQuiz
                  accent={color}
                  topicKey={`${subject.slug}/${topic.slug}`}
                  label={`${topic.title} (${subject.name})`}
                  questions={questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    answerIndex: q.answerIndex,
                    explanation: q.explanation,
                  }))}
                />
              </Reveal>
            </section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="no-print lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-4">
            <div className="rounded-3xl border border-ink/10 bg-paper p-6">
              <Link href={`/subjects/${subject.slug}`} className="flex items-center gap-3">
                <span
                  className="grid size-11 place-items-center rounded-2xl text-cream"
                  style={{ backgroundColor: color }}
                >
                  <SubjectIcon icon={subject.icon} className="size-5" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-ink/40">
                    {termName} · Topic
                  </span>
                  <span className="font-display text-lg font-semibold text-ink">{subject.name}</span>
                </span>
              </Link>
              <div className="mt-5 space-y-2.5">
                <MarkComplete
                  topicSlug={topic.slug}
                  title={topic.title}
                  subjectSlug={subject.slug}
                  subjectName={subject.name}
                  color={color}
                />
                <BookmarkButton
                  topicSlug={topic.slug}
                  title={topic.title}
                  subjectSlug={subject.slug}
                  subjectName={subject.name}
                  color={color}
                  term={topic.term}
                />
                <PrintButton />
              </div>
            </div>

            <div className="rounded-3xl border border-amber/40 bg-amber/10 p-6">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber">
                <Lightbulb className="size-4" /> Exam tip
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{topic.examTip}</p>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-paper p-2">
              {prev && (
                <Link
                  href={`/subjects/${subject.slug}/${prev.slug}`}
                  className="group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:bg-card"
                >
                  <ArrowLeft className="size-4 shrink-0 text-ink/30 transition-transform group-hover:-translate-x-1" />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                      Previous topic
                    </span>
                    <span className="block truncate text-sm font-semibold text-ink">{prev.title}</span>
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/subjects/${subject.slug}/${next.slug}`}
                  className="group flex items-center justify-end gap-3 rounded-2xl px-4 py-3.5 text-right transition-colors hover:bg-card"
                >
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-ink/40">
                      Next topic
                    </span>
                    <span className="block truncate text-sm font-semibold text-ink">{next.title}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-ink/30 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              <Link
                href={`/subjects/${subject.slug}`}
                className="group flex items-center justify-center gap-2 rounded-2xl bg-ink/[0.04] px-4 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink/[0.07]"
              >
                All {subject.name} topics
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
