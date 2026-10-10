import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { PastQuestionsClient } from "@/components/past-questions-client";
import { getPastQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Past Questions — WAEC, NECO, JAMB, BECE & Common Entrance",
  description:
    "Authentic exam-style past questions from WAEC, NECO, JAMB (UTME), Junior WAEC (BECE) and the Common Entrance, each with a full explanation.",
};

export default async function PastQuestionsPage() {
  const rows = await getPastQuestions();

  const items = rows.map((r) => ({
    id: r.id,
    exam: r.exam!,
    year: r.year,
    question: r.question,
    options: r.options,
    answerIndex: r.answerIndex,
    explanation: r.explanation,
    subjectName: r.subject.name,
    subjectSlug: r.subject.slug,
    subjectColor: r.subject.color,
    className: r.cls?.name ?? null,
  }));

  const exams = [...new Set(items.map((i) => i.exam))];

  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <p className="font-display text-sm font-medium italic text-leaf">
              WAEC · NECO · JAMB · BECE · Common Entrance
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              The past-question <span className="italic text-leaf">vault</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              Every serious candidate drills past questions. Filter by exam and subject, attempt each
              one yourself, then reveal the marking-scheme answer with a full explanation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <PastQuestionsClient items={items} exams={exams} />
      </section>
    </div>
  );
}
