import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SubjectCatalog } from "@/components/subject-catalog";
import { getSubjectsIndex, getStats } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subject Catalog — Every Nigerian School Subject",
  description:
    "The complete list of subjects for Primary, Junior Secondary and Senior Secondary in Nigeria, each broken down topic-by-topic.",
};

export default async function SubjectsPage() {
  const [entries, stats] = await Promise.all([getSubjectsIndex(), getStats()]);

  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="font-display text-sm font-medium italic text-leaf">The full syllabus atlas</p>
            <h1 className="mt-2 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              {stats.subjects} subjects, <span className="italic text-leaf">{stats.topics}</span> topics deep.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              Filter by school band or search by name. Every subject opens into its exact
              class-by-class topic list — the same structure your teachers follow.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <SubjectCatalog
          entries={entries.map((e) => ({
            name: e.name,
            icon: e.icon,
            color: e.color,
            rows: e.rows,
          }))}
        />
      </section>
    </div>
  );
}
