import type { Metadata } from "next";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { SectionHeading } from "@/components/ornaments";
import { ClassCard } from "@/components/cards";
import { getClassesWithCounts } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All Classes — Primary 1 to SS3",
  description:
    "Browse every class in the Nigerian school system: Primary 1–6, JSS 1–3 and SS 1–3, each with its complete subject list.",
};

export default async function ClassesPage() {
  const classes = await getClassesWithCounts();
  const bands = [...new Set(classes.map((c) => c.band.code))].map((code) => {
    const band = classes.find((c) => c.band.code === code)!.band;
    return { band, classes: classes.filter((c) => c.band.code === code) };
  });

  return (
    <div className="relative">
      <section className="dotgrid relative overflow-hidden bg-paper pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="font-display text-sm font-medium italic text-leaf">
              Step {`{01}`} of the journey
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              Where are you <span className="italic text-leaf">right now?</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              Twelve classes from your very first day of Primary 1 to the final bell of SS3 —
              each with its own subject map, topic lists and exam targets.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper pb-24">
        <div className="mx-auto max-w-7xl space-y-16 px-4 pt-10 sm:px-6">
          {bands.map(({ band, classes: cls }) => (
            <div key={band.code}>
              <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-dashed border-ink/15 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink/40">
                    Band {String(band.position + 1).padStart(2, "0")}
                  </p>
                  <h2 className="mt-1 font-display text-3xl font-semibold text-ink">{band.name}</h2>
                </div>
                <p className="max-w-lg text-sm text-ink/55">{band.blurb}</p>
              </Reveal>
              <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cls.map((c) => (
                  <StaggerItem key={c.slug}>
                    <ClassCard cls={c} band={band} subjectCount={c.subjectCount} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
