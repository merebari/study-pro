import type { BandDef, ClassDef } from "./types";

export const BANDS: BandDef[] = [
  {
    code: "PRI",
    name: "Primary School",
    short: "Primary",
    blurb:
      "Basic 1–6. Build rock-solid foundations in language, numbers, science and character — the NERDC Basic Education curriculum, topic by topic.",
  },
  {
    code: "JSS",
    name: "Junior Secondary",
    short: "JSS",
    blurb:
      "JSS 1–3. Explore the full 9-Year Basic Education spread: sciences, technology, business and the arts — and finish strong at BECE.",
  },
  {
    code: "SSS",
    name: "Senior Secondary",
    short: "SSS",
    blurb:
      "SS 1–3. Specialise across Science, Arts and Commercial tracks and walk into WAEC, NECO and UTME with total confidence.",
  },
];

export const CLASSES: ClassDef[] = [
  {
    code: "P1",
    slug: "primary-1",
    name: "Primary 1",
    band: "PRI",
    stage: 1,
    tagline: "Letters, numbers & first discoveries",
    description:
      "The very first rung: phonics and reading, counting to 100, the world around us and good habits that last a lifetime.",
  },
  {
    code: "P2",
    slug: "primary-2",
    name: "Primary 2",
    band: "PRI",
    stage: 2,
    tagline: "Reading grows, numbers grow",
    description:
      "Confident simple reading, addition and subtraction, telling time, family and community — with plenty of play-based practice.",
  },
  {
    code: "P3",
    slug: "primary-3",
    name: "Primary 3",
    band: "PRI",
    stage: 3,
    tagline: "From phonics to full paragraphs",
    description:
      "Times tables begin, sentences become stories, and learners start measuring, describing and questioning their world.",
  },
  {
    code: "P4",
    slug: "primary-4",
    name: "Primary 4",
    band: "PRI",
    stage: 4,
    tagline: "Fractions, facts & big ideas",
    description:
      "Fractions and long multiplication, comprehension passages, living things and simple machines — thinking gets bigger.",
  },
  {
    code: "P5",
    slug: "primary-5",
    name: "Primary 5",
    band: "PRI",
    stage: 5,
    tagline: "Sharper skills, wider world",
    description:
      "Decimals, percentages and word problems; essay skills; energy, matter and national life. The Common Entrance runway.",
  },
  {
    code: "P6",
    slug: "primary-6",
    name: "Primary 6",
    band: "PRI",
    stage: 6,
    tagline: "Final lap before secondary",
    description:
      "Consolidate six years of learning and master every Common Entrance skill: reasoning, accuracy, speed and confidence.",
    exam: "Common Entrance (NCEE)",
    examDetail:
      "The National Common Entrance Examination opens the door to Unity Schools and top secondary schools across Nigeria.",
  },
  {
    code: "J1",
    slug: "jss-1",
    name: "JSS 1",
    band: "JSS",
    stage: 7,
    tagline: "Secondary school, unlocked",
    description:
      "A bigger timetable: Basic Science, Basic Technology, Business Studies and more — organised study habits start here.",
  },
  {
    code: "J2",
    slug: "jss-2",
    name: "JSS 2",
    band: "JSS",
    stage: 8,
    tagline: "Deeper concepts, braver thinking",
    description:
      "Algebra takes shape, experiments get serious and learners connect ideas across subjects with growing independence.",
  },
  {
    code: "J3",
    slug: "jss-3",
    name: "JSS 3",
    band: "JSS",
    stage: 9,
    tagline: "The BECE year",
    description:
      "Round off junior secondary and prepare deliberately for the Basic Education Certificate Examination in every subject.",
    exam: "BECE (JSCE)",
    examDetail:
      "The Basic Education Certificate Examination is the gateway to Senior Secondary, sat in JSS 3 in every state of Nigeria.",
  },
  {
    code: "S1",
    slug: "ss-1",
    name: "SS 1",
    band: "SSS",
    stage: 10,
    tagline: "Choose your track",
    description:
      "Science, Arts or Commercial — SS 1 sets the direction. Core English and Mathematics anchor every subject combination.",
  },
  {
    code: "S2",
    slug: "ss-2",
    name: "SS 2",
    band: "SSS",
    stage: 11,
    tagline: "Momentum toward the exams",
    description:
      "The syllabus deepens fast. SS 2 is where disciplined revision plans and past-question practice pay off most.",
  },
  {
    code: "S3",
    slug: "ss-3",
    name: "SS 3",
    band: "SSS",
    stage: 12,
    tagline: "WAEC, NECO & UTME season",
    description:
      "Final year: complete the syllabus early, master WAEC and NECO past questions and walk into every paper battle-ready.",
    exam: "WAEC · NECO · UTME",
    examDetail:
      "SSCE (WAEC & NECO) and the UTME decide university admission. Every topic here maps directly to exam past questions.",
  },
];
