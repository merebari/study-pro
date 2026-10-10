"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  Brain,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  Layers,
  Menu,
  MonitorPlay,
  Search,
  Trophy,
  Wrench,
  X,
} from "lucide-react";
import { SearchOverlay } from "@/components/search-overlay";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const MAIN_NAV = [
  { href: "/classes", label: "Classes" },
  { href: "/subjects", label: "Subjects" },
  { href: "/cbt", label: "CBT Mode" },
  { href: "/past-questions", label: "Past Questions" },
];

const MORE_NAV = [
  { href: "/flashcards", label: "Flashcards", icon: Layers, note: "Flip-to-learn revision decks" },
  { href: "/practice", label: "Practice Quiz", icon: ClipboardList, note: "Instant-marking question sets" },
  { href: "/tools", label: "Study Tools", icon: Wrench, note: "GPA, calculator, converter, periodic table" },
  { href: "/parents", label: "Parents & Teachers", icon: CalendarDays, note: "Study planner & exam calendar" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, note: "XP, streaks & friendly rivals" },
  { href: "/progress", label: "My Space", icon: BookMarked, note: "Progress, bookmarks & scores" },
];

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span
        className={cn(
          "grid size-10 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105",
          dark ? "bg-amber text-[#0a1d15]" : "bg-forest text-cream"
        )}
      >
        <GraduationCap className="size-5" strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-xl font-semibold tracking-tight", dark ? "text-[#f6f1e4]" : "text-ink")}>
          Study<span className={dark ? "text-amber" : "text-leaf"}>Pro</span>
        </span>
        <span className={cn("block text-[10px] font-semibold uppercase tracking-[0.22em]", dark ? "text-[#f6f1e4]/50" : "text-ink/50")}>
          Primary 1 → SS3
        </span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const moreActive = MORE_NAV.some((m) => pathname === m.href || pathname.startsWith(m.href + "/"));

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled
            ? "border-ink/10 bg-paper/90 shadow-[0_6px_24px_-12px_rgba(10,29,21,0.25)] backdrop-blur-xl"
            : "border-transparent bg-paper/60 backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-0.5 xl:flex">
            {MAIN_NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                    active ? "bg-forest text-cream" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={cn(
                  "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
                  moreActive || moreOpen ? "bg-forest text-cream" : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                )}
              >
                More <ChevronDown className={cn("size-3.5 transition-transform", moreOpen && "rotate-180")} />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-12 w-80 overflow-hidden rounded-3xl border border-ink/10 bg-paper p-2 shadow-2xl">
                  {MORE_NAV.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="flex items-start gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-card"
                    >
                      <m.icon className="mt-0.5 size-4 shrink-0 text-leaf" />
                      <span>
                        <span className="block text-sm font-bold text-ink">{m.label}</span>
                        <span className="block text-xs text-ink/50">{m.note}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-3.5 py-2 text-sm text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
              aria-label="Search topics and subjects"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Search…</span>
              <kbd className="hidden rounded-md border border-ink/15 bg-card px-1.5 py-0.5 text-[10px] font-bold text-ink/50 md:inline">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="grid size-10 place-items-center rounded-full border border-ink/15 text-ink xl:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="max-h-[70vh] overflow-y-auto border-t border-ink/10 bg-paper px-4 py-4 xl:hidden">
            <div className="mx-auto grid max-w-7xl gap-1">
              {([
                ...MAIN_NAV.map((n) => ({ ...n, icon: BookMarked as typeof BookMarked | undefined })),
                { href: "/cbt", label: "CBT Exam Simulator", icon: MonitorPlay as typeof BookMarked | undefined },
                ...MORE_NAV.map((n) => ({ ...n, icon: n.icon as typeof BookMarked | undefined })),
              ]
                .filter((v, i, a) => a.findIndex((x) => x.href === v.href) === i)
                .map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 font-display text-lg font-medium text-ink hover:bg-card"
                  >
                    {item.icon ? <item.icon className="size-4 text-leaf" /> : <Brain className="size-4 text-leaf" />}
                    {item.label}
                  </Link>
                )))}
            </div>
          </nav>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a1d15] text-[#f6f1e4] no-print">
      <div className="dotgrid-light absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo dark />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#f6f1e4]/60">
              The study app built for Nigerian classrooms: full lesson notes, quizzes, past questions,
              CBT practice, flashcards and tools — Primary 1 to SS3, free forever, works offline.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6f1e4]/40">Learn</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/classes">Classes P1 → SS3</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/subjects">Subject Catalog</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/flashcards">Flashcards</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/progress">My Space</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6f1e4]/40">Exams</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/cbt">CBT Simulator</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/past-questions">Past Questions</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/practice">Practice Quiz</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f6f1e4]/40">More</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/tools">Study Tools</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/parents">Parents & Teachers</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/classes/primary-6">Common Entrance</Link></li>
              <li><Link className="text-[#f6f1e4]/70 transition-colors hover:text-amber" href="/classes/ss-3">WAEC · NECO · UTME</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#f6f1e4]/10 pt-6 text-xs text-[#f6f1e4]/40 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Study Pro. Learn like a champion.</p>
          <p>
            Press <kbd className="rounded border border-[#f6f1e4]/20 px-1.5 py-0.5 font-bold text-[#f6f1e4]/60">⌘K</kbd> to search · Installable & offline-ready
          </p>
        </div>
      </div>
    </footer>
  );
}
