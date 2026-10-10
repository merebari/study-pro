"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ClipboardList,
  Sparkles,
  Star,
} from "lucide-react";
import { Scribble } from "@/components/ornaments";

const easeOut = [0.22, 1, 0.36, 1] as const;

const FLOAT_CHIPS = [
  { label: "Fractions", color: "#f2b33d", top: "6%", left: "-6%", rot: "-6deg", delay: 0 },
  { label: "Photosynthesis", color: "#2f9c68", top: "16%", right: "-9%", rot: "5deg", delay: 0.8 },
  { label: "Comprehension", color: "#5ab3e8", bottom: "26%", left: "-12%", rot: "-4deg", delay: 1.6 },
  { label: "Mole Concept", color: "#e45b3d", bottom: "8%", right: "-5%", rot: "7deg", delay: 2.4 },
] as const;

export function Hero({
  stats,
  marqueeSubjects,
}: {
  stats: { topics: number; subjects: number; classes: number; questions: number };
  marqueeSubjects: string[];
}) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="dotgrid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute -left-40 top-10 size-[480px] rounded-full bg-leaf/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -right-32 bottom-0 size-[420px] rounded-full bg-amber/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2 text-xs font-bold text-ink/70"
          >
            <Sparkles className="size-3.5 text-amber" />
            Free · NERDC &amp; WAEC curriculum · Nigeria
          </motion.div>

          <h1 className="mt-6 font-display text-[3.4rem] font-semibold leading-[0.98] tracking-tight text-ink sm:text-7xl lg:text-[5.4rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease: easeOut }}
            >
              Every subject.
            </motion.span>
            <motion.span
              className="block italic text-leaf"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: easeOut }}
            >
              Every class.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.28, ease: easeOut }}
            >
              One <Scribble>smart padi</Scribble>.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: easeOut }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60"
          >
            Complete study notes and practice quizzes for{" "}
            <strong className="font-semibold text-ink">Primary 1–6, JSS 1–3 and SS 1–3</strong> —
            every topic mapped to the Nigerian curriculum and the exams that matter: Common Entrance,
            BECE, WAEC, NECO &amp; UTME.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/classes"
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-4 text-sm font-bold text-cream shadow-[0_16px_36px_-12px_rgba(15,46,33,0.5)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(15,46,33,0.6)]"
            >
              Pick my class
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/practice"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-ink/15 bg-paper px-7 py-[14px] text-sm font-bold text-ink transition-all hover:-translate-y-0.5 hover:border-ink"
            >
              <ClipboardList className="size-4 text-leaf" />
              Try a quick quiz
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.62, ease: easeOut }}
            className="mt-10 grid max-w-xl grid-cols-4 divide-x divide-dashed divide-ink/15 border-y border-dashed border-ink/15 py-5"
          >
            {[
              { k: stats.classes, label: "Classes" },
              { k: stats.subjects, label: "Subjects" },
              { k: stats.topics, label: "Topics" },
              { k: stats.questions, label: "Quiz Qs" },
            ].map((s) => (
              <div key={s.label} className="px-4 first:pl-0">
                <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink/45">
                  {s.label}
                </dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {s.k}
                  <span className="text-leaf">+</span>
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: easeOut }}
          className="relative mx-auto w-full max-w-[520px]"
        >
          <div className="relative rotate-[2.5deg] overflow-hidden rounded-[2.2rem] border-4 border-ink/10 bg-sand shadow-[0_40px_80px_-30px_rgba(10,29,21,0.4)] transition-transform duration-500 hover:rotate-0">
            <Image
              src="/images/hero-stack.png"
              alt="A playful stack of school books, calculator, pencils and a globe"
              width={780}
              height={780}
              className="h-auto w-full object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-ink/10" />
          </div>

          {/* Stamp badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -14 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            className="absolute -left-5 -top-6 grid size-24 place-items-center rounded-full bg-amber text-ink shadow-xl sm:-left-8 sm:size-28"
          >
            <span className="animate-spin-slow absolute inset-2 rounded-full border-2 border-dashed border-ink/30" aria-hidden />
            <span className="text-center text-[10px] font-black uppercase leading-tight tracking-wider">
              100%<br />free
            </span>
          </motion.div>

          {/* Floating chips */}
          {FLOAT_CHIPS.map((chip) => (
            <motion.span
              key={chip.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + chip.delay * 0.25, ease: easeOut }}
              className="animate-floaty absolute z-10 flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold text-ink shadow-lg"
              style={
                {
                  backgroundColor: chip.color,
                  top: "top" in chip ? chip.top : undefined,
                  bottom: "bottom" in chip ? chip.bottom : undefined,
                  left: "left" in chip ? chip.left : undefined,
                  right: "right" in chip ? chip.right : undefined,
                  "--rot": chip.rot,
                  rotate: chip.rot,
                  animationDelay: `${chip.delay}s`,
                } as React.CSSProperties
              }
            >
              <Star className="size-3 fill-ink/20 text-ink/20" />
              {chip.label}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative border-y-2 border-ink/10 bg-forest py-4">
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-8 pr-8">
            {[...marqueeSubjects, ...marqueeSubjects].map((s, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap">
                <span className="font-display text-lg font-medium italic text-cream/90">{s}</span>
                <Sparkles className="size-4 text-amber" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
