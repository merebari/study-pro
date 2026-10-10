import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { PracticeClient } from "@/components/practice-client";
import { getPracticeCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Practice Quiz — Test Yourself",
  description:
    "Exam-style practice questions with instant explanations for Nigerian classes and subjects — Primary to Certificate level.",
};

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string; subject?: string }>;
}) {
  const catalog = await getPracticeCatalog();
  const params = await searchParams;
  const num = (v?: string) => (v && /^\d+$/.test(v) ? Number(v) : undefined);

  return (
    <div className="relative bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <p className="font-display text-sm font-medium italic text-leaf">No pressure. All progress.</p>
            <h1 className="mt-2 max-w-2xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              The quiz <span className="italic text-leaf">arena</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              Pick your class, choose a subject (or go mixed), and face exam-objective questions with
              instant explanations for every answer.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal delay={0.1}>
          <PracticeClient
            catalog={catalog}
            initialClassId={num(params.class)}
            initialSubjectId={num(params.subject)}
          />
        </Reveal>
      </section>
    </div>
  );
}
