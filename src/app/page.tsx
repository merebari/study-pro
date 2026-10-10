import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  Compass,
  Flame,
  ListChecks,
  Search,
  TrendingUp,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion";
import { SectionHeading, Scribble } from "@/components/ornaments";
import { ClassCard } from "@/components/cards";
import { SubjectIcon } from "@/components/icon-map";
import { getClassesWithCounts, getStats, getSubjectsIndex } from "@/lib/data";

export const dynamic = "force-dynamic";

const MARQUEE = [
  "Mathematics",
  "English Language",
  "Basic Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Government",
  "Literature-in-English",
  "Economics",
  "Financial Accounting",
  "Verbal Reasoning",
  "Computer Studies",
];

const FEATURES = [
  {
    icon: ListChecks,
    title: "Notes that actually make sense",
    body: "Every topic explains what each class must know — with objectives you can tick, focus notes per class, and an exam tip written for NERDC marking schemes.",
  },
  {
    icon: ClipboardList,
    title: "Quizzes with real feedback",
    body: "Timed practice built like the real thing. Every answer comes with a clear explanation, so a wrong guess becomes a lesson, not a mystery.",
  },
  {
    icon: TrendingUp,
    title: "Progress you can feel",
    body: "Mark topics complete as you master them and watch your coverage grow per subject. Small ticks, giant confidence.",
  },
  {
    icon: Search,
    title: "Search the whole syllabus",
    body: "Can't remember where 'Pythagoras' or 'indemnity' lives? Press ⌘K and jump straight to the topic from anywhere.",
  },
];

const EXAMS = [
  {
    name: "Common Entrance",
    short: "NCEE",
    desc: "Your ticket to Unity Schools & top secondaries. Master Primary 6 revision, reasoning speed and accuracy.",
    classSlug: "primary-6",
    className: "Primary 6",
    color: "#2f9c68",
  },
  {
    name: "BECE (JSCE)",
    short: "BECE",
    desc: "Round off Junior Secondary properly. Coverage of all JSS 3 subjects with BECE-style objectives.",
    classSlug: "jss-3",
    className: "JSS 3",
    color: "#5ab3e8",
  },
  {
    name: "WAEC & NECO",
    short: "SSCE",
    desc: "The big one. Every SS 1–SS 3 topic organised exactly like the syllabus — revision without the panic.",
    classSlug: "ss-3",
    className: "SS 3",
    color: "#e45b3d",
  },
  {
    name: "UTME (JAMB)",
    short: "UTME",
    desc: "Sharpen English, Mathematics and your three subjects with focused topic drills before the CBT.",
    classSlug: "practice",
    className: "Practice",
    color: "#f2b33d",
    href: "/cbt",
  },
];

export default async function HomePage() {
  const [stats, classesWithCounts, subjectsIndex] = await Promise.all([
    getStats(),
    getClassesWithCounts(),
    getSubjectsIndex(),
  ]);

  const featured = subjectsIndex
    .flatMap((e) =>
      e.rows.map((r) => ({
        name: e.name,
        icon: e.icon,
        color: e.color,
        slug: r.slug,
        bandShort: r.bandShort,
        topicCount: r.topicCount,
      }))
    )
    .sort((a, b) => b.topicCount - a.topicCount)
    .slice(0, 9);

  const bands = [ ...new Set(classesWithCounts.map((c) => c.band.code)) ].map((code) => {
    const band = classesWithCounts.find((c) => c.band.code === code)!.band;
    return { band, classes: classesWithCounts.filter((c) => c.band.code === code) };
  });

  return (
    <>
      <Hero stats={stats} marqueeSubjects={MARQUEE} />

      {/* ── Class journey ─────────────────────────────── */}
      <section className="relative bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="The full journey"
              title={
                <>
                  Twelve classes,{" "}
                  <span className="italic text-leaf">zero</span> <Scribble>gaps</Scribble>
                </>
              }
              description="Choose where you are on the ladder. Every class page lists its exact subjects and topics — no more, no less than the curriculum expects."
            />
          </Reveal>

          <div className="mt-14 space-y-14">
            {bands.map(({ band, classes }) => (
              <div key={band.code}>
                <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-ink/40">
                      {String(band.position + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                      {band.name}
                    </h3>
                  </div>
                  <p className="max-w-md text-sm text-ink/55">{band.blurb}</p>
                </Reveal>
                <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {classes.map((cls) => (
                    <StaggerItem key={cls.slug} className="xl:col-span-2">
                      <ClassCard cls={cls} band={band} subjectCount={cls.subjectCount} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured subjects ─────────────────────────── */}
      <section className="relative overflow-hidden bg-card py-20 sm:py-28">
        <div className="noise absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Subject index"
              title={
                <>
                  Start with the <span className="italic text-clay">heaviest</span> hitters
                </>
              }
              description="The deepest libraries first — the subjects where students lose the most marks. Every one opens into a complete topic-by-topic syllabus."
            />
            <Link
              href="/subjects"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold text-ink transition-colors hover:border-ink"
            >
              Browse all {stats.subjects} subjects
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>

          <StaggerGroup className="mt-12 grid gap-x-8 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <StaggerItem key={s.slug}>
                <Link
                  href={`/subjects/${s.slug}`}
                  className="sweep group flex items-center gap-4 border-b border-ink/10 py-5"
                  style={{ ["--sweep-color" as string]: s.color }}
                >
                  <span
                    className="grid size-11 shrink-0 place-items-center rounded-2xl text-cream"
                    style={{ backgroundColor: s.color }}
                  >
                    <SubjectIcon icon={s.icon} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-lg font-semibold text-ink">
                      {s.name}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-ink/40">
                      {s.bandShort} · {s.topicCount} topics
                    </span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-ink/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Features (dark) ───────────────────────────── */}
      <section className="relative overflow-hidden bg-forest py-20 text-cream sm:py-28">
        <div className="dotgrid-light absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <SectionHeading
                dark
                eyebrow="Why Study Pro works"
                title={
                  <>
                    Studying that feels like <span className="italic text-amber">winning</span>
                  </>
                }
                description="No walls of PDF. No mystery notes. Just a clear syllabus, honest practice and visible momentum — designed for Nigerian students, prices set to zero."
              />
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative mt-10 max-w-sm">
                <div className="rotate-[-3deg] overflow-hidden rounded-[2rem] border border-cream/15 bg-pine shadow-2xl">
                  <Image
                    src="/images/trophy.png"
                    alt="Golden trophy, rosette medal and graduation cap"
                    width={640}
                    height={640}
                    className="h-auto w-full object-cover"
                  />
                </div>
                <span className="animate-floaty absolute -right-6 -top-5 flex items-center gap-1.5 rounded-2xl bg-amber px-4 py-2 text-xs font-black uppercase tracking-wider text-ink shadow-xl">
                  <Flame className="size-3.5" /> Keep the streak
                </span>
              </div>
            </Reveal>
          </div>

          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title}>
                <div className="lift h-full rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm">
                  <span className="grid size-11 place-items-center rounded-2xl bg-amber/15 text-amber">
                    <f.icon className="size-5" strokeWidth={2.2} />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-cream">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Exam goals ────────────────────────────────── */}
      <section className="bg-paper py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              align="center"
              eyebrow="Aim at the target"
              title={
                <>
                  Built around the <Scribble color="#2f9c68">exams</Scribble> that decide everything
                </>
              }
              description="Every note points at a real examination. Pick your battlefield and start where it counts."
            />
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {EXAMS.map((exam, i) => (
              <StaggerItem key={exam.name}>
                <Link
                  href={exam.href ?? `/classes/${exam.classSlug}`}
                  className="lift group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-paper p-6"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-1.5"
                    style={{ backgroundColor: exam.color }}
                  />
                  <span
                    className="font-display text-6xl font-bold"
                    style={{ color: `${exam.color}26` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="-mt-4 text-[11px] font-black uppercase tracking-[0.22em]"
                    style={{ color: exam.color }}
                  >
                    {exam.short}
                  </span>
                  <h3 className="mt-1.5 font-display text-2xl font-semibold text-ink">{exam.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/55">{exam.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-ink">
                    <Compass className="size-4" style={{ color: exam.color }} />
                    {exam.href ? "Open practice mode" : `Enter ${exam.className}`}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="px-4 pb-24 sm:px-6">
        <Reveal>
          <div className="dotgrid-light relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-pine px-6 py-16 text-center text-cream sm:px-12 sm:py-20">
            <div
              className="absolute -left-24 -top-24 size-72 rounded-full bg-leaf/20 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-24 -right-24 size-72 rounded-full bg-amber/20 blur-3xl"
              aria-hidden
            />
            <p className="relative text-xs font-bold uppercase tracking-[0.24em] text-cream/50">
              Free forever · No sign-up needed
            </p>
            <h2 className="relative mx-auto mt-4 max-w-3xl font-display text-4xl font-semibold leading-tight text-balance sm:text-6xl">
              Your future self is watching. <span className="italic text-amber">Make them proud.</span>
            </h2>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/classes"
                className="group inline-flex items-center gap-2 rounded-full bg-cream px-8 py-4 text-sm font-bold text-ink transition-all hover:-translate-y-0.5"
              >
                Start learning now
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/practice"
                className="inline-flex items-center gap-2 rounded-full border-2 border-cream/25 px-8 py-[14px] text-sm font-bold text-cream transition-colors hover:border-cream"
              >
                <ClipboardList className="size-4 text-amber" />
                Take a 5-question quiz
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
