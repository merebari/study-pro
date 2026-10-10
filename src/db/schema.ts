import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const bands = pgTable("bands", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  short: text("short").notNull(),
  blurb: text("blurb").notNull(),
  position: integer("position").notNull().default(0),
});

export const classes = pgTable(
  "classes",
  {
    id: serial("id").primaryKey(),
    bandId: integer("band_id")
      .notNull()
      .references(() => bands.id, { onDelete: "cascade" }),
    code: text("code").notNull().unique(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    stage: integer("stage").notNull(),
    tagline: text("tagline").notNull(),
    description: text("description").notNull(),
    exam: text("exam"),
    examDetail: text("exam_detail"),
  },
  (t) => [index("classes_band_idx").on(t.bandId)]
);

export const subjects = pgTable(
  "subjects",
  {
    id: serial("id").primaryKey(),
    bandId: integer("band_id")
      .notNull()
      .references(() => bands.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull().default("BookOpen"),
    color: text("color").notNull().default("#2E8B57"),
    blurb: text("blurb").notNull(),
  },
  (t) => [index("subjects_band_idx").on(t.bandId)]
);

export const classSubjects = pgTable(
  "class_subjects",
  {
    id: serial("id").primaryKey(),
    classId: integer("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [uniqueIndex("class_subject_unique").on(t.classId, t.subjectId)]
);

export const topics = pgTable(
  "topics",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    term: integer("term").notNull().default(2),
    overview: text("overview").notNull().default(""),
    objectives: jsonb("objectives").$type<string[]>().notNull().default([]),
    keyPoints: jsonb("key_points").$type<string[]>().notNull().default([]),
    explanation: jsonb("explanation").$type<string[]>().notNull().default([]),
    examples:
      jsonb("examples")
        .$type<Array<{ q: string; steps: string[]; answer: string }>>()
        .notNull()
        .default([]),
    keyTerms:
      jsonb("key_terms")
        .$type<Array<{ term: string; def: string }>>()
        .notNull()
        .default([]),
    summary: jsonb("summary").$type<string[]>().notNull().default([]),
    examTip: text("exam_tip").notNull().default(""),
    gloss: text("gloss").notNull().default(""),
    position: integer("position").notNull().default(0),
  },
  (t) => [uniqueIndex("topic_subject_slug_unique").on(t.subjectId, t.slug)]
);

export const topicClasses = pgTable(
  "topic_classes",
  {
    id: serial("id").primaryKey(),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    classId: integer("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    focus: text("focus"),
  },
  (t) => [uniqueIndex("topic_class_unique").on(t.topicId, t.classId)]
);

export const questions = pgTable(
  "questions",
  {
    id: serial("id").primaryKey(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    classId: integer("class_id").references(() => classes.id, {
      onDelete: "set null",
    }),
    topicId: integer("topic_id").references(() => topics.id, {
      onDelete: "set null",
    }),
    question: text("question").notNull(),
    options: jsonb("options").$type<string[]>().notNull(),
    answerIndex: integer("answer_index").notNull(),
    explanation: text("explanation").notNull(),
    level: integer("level").notNull().default(1),
    /** Source examination for past questions, e.g. "WAEC", "NECO", "JAMB", "BECE", "Common Entrance" */
    exam: text("exam"),
    year: integer("year"),
  },
  (t) => [index("questions_subject_idx").on(t.subjectId)]
);

export type Band = typeof bands.$inferSelect;
export type ClassRow = typeof classes.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type Topic = typeof topics.$inferSelect;
export type Question = typeof questions.$inferSelect;
