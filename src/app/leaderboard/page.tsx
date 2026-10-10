"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame, Medal, Sparkles, TrendingUp, Trophy, Zap } from "lucide-react";
import {
  currentStreak,
  getBookmarks,
  getCompleted,
  getScores,
  getXp,
  xpLevel,
  STORE_EVENT,
} from "@/lib/study-store";
import { cn } from "@/lib/utils";

const RIVALS = [
  { name: "Adaeze", school: "Queen's College, Enugu" },
  { name: "Tunde", school: "King's College, Lagos" },
  { name: "Chiamaka", school: "FGGC Owerri" },
  { name: "Ibrahim", school: "Barewa College, Zaria" },
  { name: "Ngozi", school: "St. Louis, Jos" },
  { name: "Emeka", school: "Government College, Ibadan" },
  { name: "Zainab", school: "GGSS Kano" },
  { name: "Femi", school: "CMS Grammar, Bariga" },
];

function hashName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

const BADGES = [
  { id: "first", name: "First Steps", desc: "Complete your first topic", icon: Sparkles, test: (s: Stats) => s.completed >= 1 },
  { id: "bookworm", name: "Bookworm", desc: "Complete 5 topics", icon: Medal, test: (s: Stats) => s.completed >= 5 },
  { id: "scholar", name: "Scholar", desc: "Complete 15 topics", icon: Trophy, test: (s: Stats) => s.completed >= 15 },
  { id: "streak3", name: "On Fire", desc: "Study 3 days in a row", icon: Flame, test: (s: Stats) => s.streak >= 3 },
  { id: "streak7", name: "Unstoppable", desc: "Study 7 days in a row", icon: Zap, test: (s: Stats) => s.streak >= 7 },
  { id: "marksman", name: "Marksman", desc: "Score 80%+ on any quiz", icon: TrendingUp, test: (s: Stats) => s.bestPct >= 80 },
  { id: "curious", name: "Curious Mind", desc: "Bookmark 3 topics for revision", icon: Medal, test: (s: Stats) => s.bookmarks >= 3 },
  { id: "centurion", name: "Centurion", desc: "Earn 100 XP", icon: Crown, test: (s: Stats) => s.xp >= 100 },
] as const;

type Stats = { xp: number; completed: number; bookmarks: number; streak: number; bestPct: number };

const AVATAR_COLORS = ["#e45b3d", "#2f9c68", "#5ab3e8", "#f2b33d", "#8b5cf6", "#c24d6d", "#3e92cc", "#b4742e", "#3e8e7e"];

export default function LeaderboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const sync = () => {
      const xp = getXp();
      const scores = getScores();
      setStats({
        xp: xp.total,
        completed: getCompleted().length,
        bookmarks: getBookmarks().length,
        streak: currentStreak(xp.history),
        bestPct: scores.length ? Math.max(...scores.map((s) => s.pct)) : 0,
      });
    };
    sync();
    window.addEventListener(STORE_EVENT, sync);
    return () => window.removeEventListener(STORE_EVENT, sync);
  }, []);

  const weekBucket = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000 / 7);
  const board = useMemo(() => {
    const rivals = RIVALS.map((r, i) => {
      const base = hashName(r.name) % 220;
      const weekly = ((hashName(r.name) + weekBucket * 97) % 130) + base;
      return { ...r, xp: weekly, color: AVATAR_COLORS[i % AVATAR_COLORS.length], me: false };
    });
    const meXp = stats?.xp ?? 0;
    return [...rivals, { name: "You", school: "Study Pro", xp: meXp, color: "#f2b33d", me: true }].sort(
      (a, b) => b.xp - a.xp
    );
  }, [stats, weekBucket]);

  const myRank = board.findIndex((b) => b.me) + 1;
  const level = xpLevel(stats?.xp ?? 0);

  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-1.5 text-xs font-bold text-ink/60">
              <Trophy className="size-3.5 text-amber" /> XP · Streaks · Badges
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
              The <span className="italic text-leaf">leaderboard</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
              Every topic, quiz and flashcard earns XP. Climb past your rivals and keep the streak
              fire burning — one study session a day.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Player card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#0a1d15] p-6 text-[#f6f1e4] sm:p-8"
        >
          <div className="dotgrid-light absolute inset-0 opacity-30" aria-hidden />
          <div className="relative grid items-center gap-6 sm:grid-cols-[auto_1fr_auto]">
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-amber font-display text-3xl font-black text-[#0a1d15]">
              {level.level}
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f6f1e4]/50">Your level</p>
              <h2 className="mt-1 font-display text-3xl font-semibold">
                {level.level <= 2 ? "Rising Scholar" : level.level <= 4 ? "Sharp Mind" : level.level <= 6 ? "Exam Warrior" : "Grandmaster"}
              </h2>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#f6f1e4]/15">
                <motion.div
                  className="h-full rounded-full bg-amber"
                  initial={{ width: 0 }}
                  animate={{ width: `${level.pct}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              <p className="mt-1.5 text-xs font-bold text-[#f6f1e4]/60">{level.into}/{level.needed} XP to Level {level.level + 1}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center sm:gap-5">
              {[
                { k: "Total XP", v: stats?.xp ?? 0, icon: Zap, color: "#f2b33d" },
                { k: "Day streak", v: stats?.streak ?? 0, icon: Flame, color: "#e45b3d" },
                { k: "Global rank", v: `#${myRank}`, icon: Trophy, color: "#2f9c68" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-[#f6f1e4]/[0.06] px-4 py-3">
                  <s.icon className="mx-auto size-4" style={{ color: s.color }} />
                  <p className="mt-1 font-display text-2xl font-bold">{s.v}</p>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#f6f1e4]/45">{s.k}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Board */}
          <div className="rounded-3xl border border-ink/10 bg-paper p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/45">This week's board</p>
            <ol className="mt-4 space-y-2">
              {board.map((row, i) => (
                <motion.li
                  key={row.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border px-4 py-3",
                    row.me ? "border-amber bg-amber/10" : "border-ink/10 bg-card/50"
                  )}
                >
                  <span
                    className={cn(
                      "grid w-8 shrink-0 place-items-center font-display text-lg font-bold",
                      i === 0 && "text-amber",
                      i === 1 && "text-ink/60",
                      i === 2 && "text-clay",
                      i > 2 && "text-ink/30"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full font-display text-sm font-bold text-cream"
                    style={{ backgroundColor: row.color }}
                  >
                    {row.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm font-bold", row.me ? "text-ink" : "text-ink/80")}>
                      {row.name} {row.me && <span className="text-amber">· that's you</span>}
                    </span>
                    <span className="block truncate text-xs text-ink/45">{row.school}</span>
                  </span>
                  {i === 0 && <Crown className="size-4 shrink-0 text-amber" />}
                  <span className="shrink-0 font-mono text-sm font-black text-ink">{row.xp} <span className="text-[10px] text-ink/40">XP</span></span>
                </motion.li>
              ))}
            </ol>
            <p className="mt-4 text-center text-xs font-semibold text-ink/40">
              Rival scores refresh weekly · your XP counts everything you do on this device
            </p>
          </div>

          {/* Badges */}
          <div className="rounded-3xl border border-ink/10 bg-paper p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-ink/45">Badge cabinet</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {BADGES.map((b) => {
                const earned = stats ? b.test(stats) : false;
                return (
                  <div
                    key={b.id}
                    className={cn(
                      "rounded-2xl border p-4 text-center transition-all",
                      earned ? "border-amber/50 bg-amber/10" : "border-ink/10 bg-card/40 opacity-50"
                    )}
                  >
                    <b.icon className={cn("mx-auto size-6", earned ? "text-amber" : "text-ink/25")} />
                    <p className={cn("mt-2 text-sm font-bold", earned ? "text-ink" : "text-ink/40")}>{b.name}</p>
                    <p className="mt-0.5 text-[11px] leading-tight text-ink/45">{b.desc}</p>
                    {earned && <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-leaf">Earned ✓</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
