"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Plus,
  Printer,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { getPlanner, savePlanner, type PlannerSession } from "@/lib/study-store";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EXAM_CALENDAR = [
  { exam: "NCEE Registration", when: "October – December", note: "Register early through your school." },
  { exam: "Common Entrance (NCEE)", when: "April / May", note: "For Unity Schools & top federal colleges." },
  { exam: "BECE (Junior WAEC)", when: "May – June", note: "JSS 3 external exam in all states." },
  { exam: "WAEC (May/June)", when: "April – June", note: "SS 3 school candidates." },
  { exam: "NECO (June/July)", when: "June – August", note: "Second major SSCE sitting." },
  { exam: "UTME (JAMB)", when: "April – May", note: "Computer-based test nationwide." },
];

const GUIDES = [
  {
    icon: HeartHandshake,
    title: "Support without pressure",
    body: "Ask “what did you learn today?” instead of “did you read?”. Small wins praised loudly beat big sermons. Celebrate completed topics together on the Progress page.",
  },
  {
    icon: Clock,
    title: "Short sprints beat marathons",
    body: "45 focused minutes with phone away outperforms 3 distracted hours. Use the planner below for 2–3 sprints a day and protect them like meal times.",
  },
  {
    icon: BookOpenCheck,
    title: "Notes → Quiz → Repeat",
    body: "The winning loop: read the topic notes, close the book, attempt the quiz, redo the weak spots a week later. CBT Mode adds the real exam pressure.",
  },
  {
    icon: Users,
    title: "Study with purpose",
    body: "Help your child pick 3 core subjects to attack each week and rotate. Flashcards are perfect for 10-minute kitchen-table drills you can run together.",
  },
];

export default function ParentsPage() {
  const [sessions, setSessions] = useState<PlannerSession[]>([]);
  const [mounted, setMounted] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);
  const [form, setForm] = useState({ time: "17:00", minutes: 45, subject: "Mathematics", detail: "", className: "JSS 1" });

  useEffect(() => {
    setSessions(getPlanner());
    setMounted(true);
  }, []);

  const persist = (rows: PlannerSession[]) => {
    setSessions(rows);
    savePlanner(rows);
  };

  const addSession = () => {
    if (adding === null || !form.subject.trim()) return;
    persist([
      ...sessions,
      {
        id: `${Date.now()}`,
        day: adding,
        time: form.time,
        minutes: form.minutes,
        subject: form.subject.trim(),
        detail: form.detail.trim(),
        className: form.className,
      },
    ]);
    setAdding(null);
    setForm((f) => ({ ...f, detail: "" }));
  };

  const totalMinutes = sessions.reduce((n, s) => n + s.minutes, 0);

  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-1.5 text-xs font-bold text-ink/60">
              <Users className="size-3.5 text-leaf" /> Parents & Teachers
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-7xl">
              A co-pilot for the <span className="italic text-leaf">grown-ups</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
              Build a weekly study timetable, follow the exam calendar, and learn exactly how to
              support a Primary-to-SS3 learner without the drama.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Guidance */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {GUIDES.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="lift rounded-3xl border border-ink/10 bg-paper p-6"
            >
              <span className="grid size-11 place-items-center rounded-2xl bg-leaf/10 text-leaf">
                <g.icon className="size-5" strokeWidth={2.2} />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{g.body}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Planner */}
      <div className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] border border-ink/10 bg-paper p-6 sm:p-8" id="planner">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-leaf/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-leaf">
                <CalendarDays className="size-3.5" /> Study Planner
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">The weekly timetable</h2>
              <p className="mt-1 text-sm text-ink/55">
                {mounted
                  ? `${sessions.length} session${sessions.length === 1 ? "" : "s"} planned · ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m of focused study a week`
                  : "Loading your planner…"}
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="no-print inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2.5 text-xs font-bold text-ink hover:border-ink"
            >
              <Printer className="size-4" /> Print timetable
            </button>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {DAYS.map((day, di) => {
              const daySessions = sessions
                .filter((s) => s.day === di)
                .sort((a, b) => a.time.localeCompare(b.time));
              return (
                <div key={day} className="rounded-2xl border border-ink/10 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-semibold text-ink">{day}</p>
                    <button
                      onClick={() => setAdding(adding === di ? null : di)}
                      className="no-print grid size-8 place-items-center rounded-full bg-leaf/10 text-leaf transition-colors hover:bg-leaf hover:text-cream"
                      aria-label={`Add session on ${day}`}
                    >
                      {adding === di ? <X className="size-4" /> : <Plus className="size-4" />}
                    </button>
                  </div>

                  <div className="mt-3 space-y-2">
                    {daySessions.map((s) => (
                      <div key={s.id} className="group flex items-start gap-3 rounded-xl bg-paper p-3">
                        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-leaf/10 font-mono text-[11px] font-black text-leaf">
                          {s.time}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-ink">{s.subject}</p>
                          <p className="text-xs text-ink/50">
                            {s.className} · {s.minutes} min{s.detail ? ` · ${s.detail}` : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => persist(sessions.filter((x) => x.id !== s.id))}
                          className="no-print shrink-0 text-ink/20 transition-colors hover:text-clay"
                          aria-label="Delete session"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}
                    {daySessions.length === 0 && (
                      <p className="rounded-xl border border-dashed border-ink/15 py-3 text-center text-xs font-semibold text-ink/35">
                        Rest or free study
                      </p>
                    )}
                  </div>

                  <AnimatePresence>
                    {adding === di && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="no-print overflow-hidden"
                      >
                        <div className="mt-3 space-y-2 rounded-xl bg-paper p-3">
                          <input
                            value={form.subject}
                            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                            placeholder="Subject (e.g. Biology)"
                            className="w-full rounded-lg border border-ink/10 bg-card px-3 py-2 text-sm font-semibold focus:outline-none"
                          />
                          <input
                            value={form.detail}
                            onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
                            placeholder="Topic (optional)"
                            className="w-full rounded-lg border border-ink/10 bg-card px-3 py-2 text-sm focus:outline-none"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <select
                              value={form.className}
                              onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                              className="rounded-lg border border-ink/10 bg-card px-2 py-2 text-xs font-bold focus:outline-none"
                            >
                              {[..."P1,P2,P3,P4,P5,P6,JSS1,JSS2,JSS3,SS1,SS2,SS3".split(",")].map((c) => (
                                <option key={c} value={c.replace("P", "Primary ").replace("JSS", "JSS ").replace("SS", "SS ")}>
                                  {c}
                                </option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={form.time}
                              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                              className="rounded-lg border border-ink/10 bg-card px-2 py-2 text-xs font-bold focus:outline-none"
                            />
                            <select
                              value={form.minutes}
                              onChange={(e) => setForm((f) => ({ ...f, minutes: Number(e.target.value) }))}
                              className="rounded-lg border border-ink/10 bg-card px-2 py-2 text-xs font-bold focus:outline-none"
                            >
                              {[30, 45, 60, 90, 120].map((m) => (
                                <option key={m} value={m}>{m} min</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={addSession}
                            className="w-full rounded-lg bg-forest py-2.5 text-sm font-bold text-cream"
                          >
                            Add session
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Exam calendar */}
      <div className="mx-auto mt-14 max-w-5xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl font-semibold text-ink">Nigeria's exam calendar</h2>
          <p className="mt-1 text-sm text-ink/55">Typical windows — confirm each year with your school and the exam body's website.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXAM_CALENDAR.map((e) => (
              <div key={e.exam} className="rounded-2xl border border-ink/10 bg-card p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-leaf" />
                  <p className="font-display text-lg font-semibold text-ink">{e.exam}</p>
                </div>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-amber">{e.when}</p>
                <p className="mt-2 text-sm text-ink/60">{e.note}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
