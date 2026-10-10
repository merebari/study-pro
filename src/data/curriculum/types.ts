export type BandCode = "PRI" | "JSS" | "SSS";

/** A topic as defined in the Nigerian curriculum data files. */
export interface TopicDef {
  /** Title of the topic, e.g. "Fractions" */
  t: string;
  /** Class codes where the topic is taught (defaults to all subject classes) */
  classes?: string[];
  /** Optional hand-written description override */
  d?: string;
  /** Class-specific focus notes, keyed by class code */
  focus?: Record<string, string>;
  /** Scheme-of-work term: 1 = First, 2 = Second, 3 = Third */
  term?: 1 | 2 | 3;
}

/* ── Rich lesson-note content (per-topic overrides from content batches) ── */

export interface WorkedExample {
  /** The question, written for the learner */
  q: string;
  /** Clear numbered steps */
  steps: string[];
  /** Final answer */
  answer: string;
}

export interface KeyTerm {
  term: string;
  def: string;
}

/** Hand-written lesson content attached to a topic by exact title. */
export interface RichTopic {
  /** Full lesson explanation, one string per paragraph */
  explain?: string[];
  examples?: WorkedExample[];
  keyTerms?: KeyTerm[];
  summary?: string[];
  /** Force the scheme-of-work term for this topic */
  term?: 1 | 2 | 3;
}

/** A hand-written content batch for one subject + band, e.g. Primary 1 Mathematics. */
export interface RichBatch {
  subject: string;
  band: BandCode;
  /** Brand-new topics to insert into the subject (top of the list) */
  additions?: TopicDef[];
  /** Rich lesson content keyed by exact topic title */
  notes: Record<string, RichTopic>;
}

export interface SubjectDef {
  name: string;
  /** Lucide icon key, resolved in components/icon-map.tsx */
  icon: string;
  /** Hex accent colour */
  color: string;
  band: BandCode;
  blurb: string;
  /** Class codes where the subject is offered */
  classes: string[];
  topics: TopicDef[];
}

export interface ClassDef {
  code: string;
  slug: string;
  name: string;
  band: BandCode;
  /** Position 1..12 across the whole school journey */
  stage: number;
  tagline: string;
  description: string;
  /** Key external exam attached to this class, if any */
  exam?: string;
  examDetail?: string;
}

export interface BandDef {
  code: BandCode;
  name: string;
  short: string;
  blurb: string;
}
