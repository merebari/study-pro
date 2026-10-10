"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  Atom,
  Award,
  Calculator,
  Delete,
  GraduationCap,
  Info,
  Plus,
  Ruler,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { awardXp } from "@/lib/study-store";
import { CATEGORY_META, ELEMENTS, type ElementInfo } from "@/data/elements";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "gpa", label: "GPA & WAEC Aggregate", icon: Award },
  { id: "calc", label: "Scientific Calculator", icon: Calculator },
  { id: "units", label: "Unit Converter", icon: Ruler },
  { id: "periodic", label: "Periodic Table", icon: Atom },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ══════════════════════════ GPA / WAEC AGGREGATE ══════════════════════════ */

const WAEC_GRADES = [
  { grade: "A1", points: 9, remark: "Excellent" },
  { grade: "B2", points: 8, remark: "Very Good" },
  { grade: "B3", points: 7, remark: "Good" },
  { grade: "C4", points: 6, remark: "Credit" },
  { grade: "C5", points: 5, remark: "Credit" },
  { grade: "C6", points: 4, remark: "Credit" },
  { grade: "D7", points: 3, remark: "Pass" },
  { grade: "E8", points: 2, remark: "Pass" },
  { grade: "F9", points: 0, remark: "Fail" },
];

function GpaTool() {
  const [rows, setRows] = useState<Array<{ name: string; points: number }>>([
    { name: "English Language", points: 9 },
    { name: "Mathematics", points: 9 },
    { name: "Biology", points: 8 },
    { name: "Chemistry", points: 8 },
    { name: "Physics", points: 7 },
    { name: "Civic Education", points: 7 },
  ]);

  const sorted = [...rows].sort((a, b) => b.points - a.points);
  const best6 = sorted.slice(0, 6);
  const aggregate = best6.reduce((n, r) => n + r.points, 0);
  const maxPoints = 54;
  const credits = rows.filter((r) => r.points >= 4).length;

  const verdict =
    aggregate >= 45
      ? { label: "Outstanding — direct-entry & scholarship territory", color: "#2f9c68" }
      : aggregate >= 36
        ? { label: "Excellent — comfortably above most cut-offs", color: "#2f9c68" }
        : aggregate >= 28
          ? { label: "Good — strong for many courses", color: "#f2b33d" }
          : aggregate >= 20
            ? { label: "Fair — push the weaker subjects up a grade", color: "#f2b33d" }
            : { label: "Keep working — every grade you lift changes everything", color: "#e45b3d" };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Your subjects & grades</p>
          <button
            onClick={() => rows.length < 9 && setRows((r) => [...r, { name: "", points: 9 }])}
            disabled={rows.length >= 9}
            className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-bold text-cream disabled:opacity-40"
          >
            <Plus className="size-3.5" /> Add subject
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={row.name}
                onChange={(e) => setRows((r) => r.map((x, xi) => (xi === i ? { ...x, name: e.target.value } : x)))}
                placeholder={`Subject ${i + 1}`}
                className="min-w-0 flex-1 rounded-2xl border border-ink/10 bg-card/60 px-4 py-3 text-sm font-semibold text-ink placeholder:text-ink/30 focus:outline-none"
              />
              <select
                value={row.points}
                onChange={(e) => {
                  const pts = Number(e.target.value);
                  setRows((r) => r.map((x, xi) => (xi === i ? { ...x, points: pts } : x)));
                  awardXp(1, "Checked WAEC aggregate");
                }}
                className="rounded-2xl border border-ink/10 bg-paper px-3 py-3 text-sm font-black text-ink focus:outline-none"
              >
                {WAEC_GRADES.map((g) => (
                  <option key={g.grade} value={g.points}>{g.grade}</option>
                ))}
              </select>
              <button
                onClick={() => rows.length > 5 && setRows((r) => r.filter((_, xi) => xi !== i))}
                className="grid size-10 place-items-center rounded-2xl text-ink/30 transition-colors hover:bg-clay/10 hover:text-clay disabled:opacity-20"
                disabled={rows.length <= 5}
                aria-label="Remove subject"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-ink/45">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          WAEC aggregate = sum of grade points from your best six subjects (A1 = 9 … F9 = 0). English and Mathematics usually must be credits (C4–C6) or better.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-3xl border border-ink/10 bg-card p-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Best-6 aggregate</p>
          <p className="mt-2 font-display text-6xl font-bold text-ink">
            {aggregate}<span className="text-2xl text-ink/40">/{maxPoints}</span>
          </p>
          <p className="mt-3 inline-block rounded-full px-4 py-2 text-xs font-bold text-cream" style={{ backgroundColor: verdict.color }}>
            {verdict.label}
          </p>
          <p className="mt-3 text-xs font-semibold text-ink/50">{credits} credit{credits === 1 ? "" : "s"} of {rows.length} subjects</p>
        </div>
        <div className="rounded-3xl border border-ink/10 bg-paper p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/45">Grading reference</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {WAEC_GRADES.map((g) => (
              <div key={g.grade} className={cn("rounded-xl px-3 py-2 text-center", g.points >= 4 ? "bg-leaf/10" : g.points > 0 ? "bg-amber/10" : "bg-clay/10")}>
                <p className="font-black text-ink">{g.grade} = {g.points}</p>
                <p className="text-[10px] font-semibold text-ink/50">{g.remark}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ SCIENTIFIC CALCULATOR ══════════════════════════ */

const CALC_ROWS: string[][] = [
  ["C", "(", ")", "⌫", "÷"],
  ["√(", "sin(", "cos(", "tan(", "×"],
  ["^", "ln(", "log(", "π", "−"],
  ["7", "8", "9", "²", "+"],
  ["4", "5", "6", "e", "DEG"],
  ["1", "2", "3", "%", "="],
  ["0", ".", "00", "", ""],
];

function CalcTool() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [deg, setDeg] = useState(true);

  const press = (key: string) => {
    if (!key) return;
    if (key === "C") { setExpr(""); setResult(null); return; }
    if (key === "⌫") { setExpr((e) => e.slice(0, -1)); return; }
    if (key === "DEG") { setDeg((d) => !d); return; }
    if (key === "=") { evaluate(); return; }
    if (key === "²") { setExpr((e) => e + "^2"); return; }
    if (result !== null) { setResult(null); setExpr(key.match(/[0-9.()]/) ? key : `(${result})${key === "÷" ? "÷" : key}`); return; }
    setExpr((e) => e + key);
  };

  const evaluate = () => {
    if (!expr) return;
    try {
      let s = expr
        .replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-")
        .replace(/√\(/g, "Math.sqrt(").replace(/π/g, "(Math.PI)")
        .replace(/ln\(/g, "Math.log(").replace(/log\(/g, "Math.log10(")
        .replace(/sin\(/g, deg ? "Math.sin((Math.PI/180)*" : "Math.sin(")
        .replace(/cos\(/g, deg ? "Math.cos((Math.PI/180)*" : "Math.cos(")
        .replace(/tan\(/g, deg ? "Math.tan((Math.PI/180)*" : "Math.tan(")
        .replace(/\^/g, "**").replace(/%/g, "/100");
      // security: after removing known Math.* calls only digits/operators may remain
      if (!/^[\d\s+\-*/().,]*$/.test(s.replace(/Math\.\w+/g, ""))) throw new Error("bad input");
      const value = Function(`"use strict"; return (${s})`)() as number;
      if (typeof value !== "number" || !isFinite(value) || Number.isNaN(value)) throw new Error("math");
      const formatted = Math.abs(value) < 1e-10 ? "0" : String(Number(value.toPrecision(10)));
      setResult(formatted);
      awardXp(1, "Used the scientific calculator");
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-[2rem] border border-ink/10 bg-[#0a1d15] p-4 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f6f1e4]/40">Study Pro Calc</p>
          <p className="rounded-full bg-[#f6f1e4]/10 px-3 py-1 text-[10px] font-black tracking-widest text-amber">{deg ? "DEG" : "RAD"}</p>
        </div>
        <div className="min-h-[88px] rounded-2xl bg-[#f6f1e4]/[0.05] px-4 py-3 text-right">
          <p className="min-h-6 break-all font-mono text-sm text-[#f6f1e4]/60">{expr || "0"}</p>
          <p className="mt-1 break-all font-mono text-3xl font-bold text-[#f6f1e4]">{result ?? ""}</p>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-2">
          {CALC_ROWS.flat().map((key, i) => {
            if (!key) return <span key={i} />;
            const isOp = ["÷", "×", "−", "+", "^", "%"].includes(key);
            const isFn = key.endsWith("(") || key === "π" || key === "e" || key === "²";
            return (
              <button
                key={`${key}-${i}`}
                onClick={() => press(key)}
                className={cn(
                  "grid h-12 place-items-center rounded-2xl font-mono text-sm font-bold transition-all active:scale-95 sm:h-14",
                  key === "=" && "bg-amber text-[#0a1d15]",
                  key === "C" && "bg-clay/80 text-white",
                  key === "⌫" && "bg-[#f6f1e4]/15 text-[#f6f1e4]",
                  key === "DEG" && (deg ? "bg-leaf text-white" : "bg-[#f6f1e4]/10 text-[#f6f1e4]/60"),
                  isOp && "bg-leaf/25 text-sprout",
                  isFn && "bg-[#f6f1e4]/10 text-[#f6f1e4]/85",
                  !["=", "C", "⌫", "DEG"].includes(key) && !isOp && !isFn && "bg-[#f6f1e4]/[0.07] text-[#f6f1e4]"
                )}
              >
                {key === "⌫" ? <Delete className="size-4" /> : key}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-center text-xs font-semibold text-ink/40">
        Supports: + − × ÷ √ x² xʸ % sin cos tan ln log π e — perfect for Physics & Further Maths.
      </p>
    </div>
  );
}

/* ══════════════════════════ UNIT CONVERTER ══════════════════════════ */

type UnitDef = { label: string; factor?: number; toBase?: (v: number) => number; fromBase?: (v: number) => number };
const UNIT_CATS: Array<{ id: string; label: string; units: UnitDef[] }> = [
  { id: "length", label: "Length", units: [
    { label: "Kilometre (km)", factor: 1000 }, { label: "Metre (m)", factor: 1 },
    { label: "Centimetre (cm)", factor: 0.01 }, { label: "Millimetre (mm)", factor: 0.001 },
    { label: "Inch (in)", factor: 0.0254 }, { label: "Foot (ft)", factor: 0.3048 },
    { label: "Yard (yd)", factor: 0.9144 }, { label: "Mile (mi)", factor: 1609.344 },
  ]},
  { id: "mass", label: "Mass", units: [
    { label: "Tonne (t)", factor: 1000 }, { label: "Kilogram (kg)", factor: 1 },
    { label: "Gram (g)", factor: 0.001 }, { label: "Milligram (mg)", factor: 0.000001 },
    { label: "Pound (lb)", factor: 0.453592 },
  ]},
  { id: "volume", label: "Volume", units: [
    { label: "Litre (L)", factor: 1 }, { label: "Millilitre (mL)", factor: 0.001 },
    { label: "Cubic metre (m³)", factor: 1000 }, { label: "Cubic centimetre (cm³)", factor: 0.001 },
    { label: "Gallon (US)", factor: 3.78541 },
  ]},
  { id: "temp", label: "Temperature", units: [
    { label: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
    { label: "Fahrenheit (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { label: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ]},
  { id: "time", label: "Time", units: [
    { label: "Second (s)", factor: 1 }, { label: "Minute (min)", factor: 60 },
    { label: "Hour (h)", factor: 3600 }, { label: "Day", factor: 86400 }, { label: "Week", factor: 604800 },
  ]},
  { id: "data", label: "Data (binary)", units: [
    { label: "Byte (B)", factor: 1 }, { label: "Kilobyte (KB)", factor: 1024 },
    { label: "Megabyte (MB)", factor: 1048576 }, { label: "Gigabyte (GB)", factor: 1073741824 },
  ]},
];

function UnitTool() {
  const [catId, setCatId] = useState("length");
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(1);
  const [value, setValue] = useState("1");
  const cat = UNIT_CATS.find((c) => c.id === catId)!;

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return null;
    const fu = cat.units[from];
    const tu = cat.units[to];
    const base = fu.toBase ? fu.toBase(v) : v * (fu.factor ?? 1);
    const out = tu.fromBase ? tu.fromBase(base) : base / (tu.factor ?? 1);
    return Number(out.toPrecision(8));
  }, [value, from, to, cat]);

  const switchCat = (id: string) => {
    setCatId(id);
    setFrom(0);
    setTo(1);
    setValue("1");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-wrap justify-center gap-2">
        {UNIT_CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => switchCat(c.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-bold transition-colors",
              catId === c.id ? "border-forest bg-forest text-cream" : "border-ink/15 text-ink/60 hover:border-ink/40"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <label className="text-xs font-bold uppercase tracking-[0.18em] text-ink/45">Convert</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9.eE+-]/g, ""))}
          inputMode="decimal"
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-paper px-5 py-4 font-display text-3xl font-semibold text-ink focus:outline-none"
        />
        <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <select value={from} onChange={(e) => setFrom(Number(e.target.value))} className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3.5 text-sm font-bold text-ink focus:outline-none">
            {cat.units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
          </select>
          <button
            onClick={() => { setFrom(to); setTo(from); }}
            className="mx-auto grid size-10 place-items-center rounded-full bg-forest text-cream"
            aria-label="Swap units"
          >
            <ArrowLeftRight className="size-4" />
          </button>
          <select value={to} onChange={(e) => setTo(Number(e.target.value))} className="w-full rounded-2xl border border-ink/10 bg-paper px-4 py-3.5 text-sm font-bold text-ink focus:outline-none">
            {cat.units.map((u, i) => <option key={u.label} value={i}>{u.label}</option>)}
          </select>
        </div>
        <div className="mt-5 rounded-2xl bg-paper px-5 py-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">Result</p>
          <p className="mt-1 font-display text-3xl font-bold text-ink">
            {result === null ? "—" : result.toLocaleString("en-NG")}
          </p>
          <p className="text-sm font-semibold text-leaf">{cat.units[to].label}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════ PERIODIC TABLE ══════════════════════════ */

function PeriodicTool() {
  const [selected, setSelected] = useState<ElementInfo | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  const cell = (z: number) => ELEMENTS.find((e) => e.z === z);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-1.5">
        <button
          onClick={() => setFilter(null)}
          className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold", filter === null ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/55")}
        >
          All
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setFilter(filter === key ? null : key)}
            className={cn("rounded-full border px-3 py-1.5 text-[11px] font-bold transition-all", filter === key ? "text-cream" : "text-ink/55")}
            style={filter === key ? { backgroundColor: meta.color, borderColor: meta.color } : { borderColor: `${meta.color}55` }}
          >
            {meta.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto pb-2">
        <div className="mx-auto grid min-w-[860px] grid-cols-[repeat(18,minmax(44px,1fr))] gap-1">
          {Array.from({ length: 10 }, (_, r) => r + 1).map((row) =>
            Array.from({ length: 18 }, (_, c) => c + 1).map((col) => {
              if ((row === 8) || (row > 7 && col < 4) || (row === 6 && col === 3) || (row === 7 && col === 3)) {
                if (row === 6 && col === 3)
                  return <div key={`${row}-${col}`} className="grid aspect-square place-items-center rounded-md bg-ink/5 text-[9px] font-black text-ink/40">57–71</div>;
                if (row === 7 && col === 3)
                  return <div key={`${row}-${col}`} className="grid aspect-square place-items-center rounded-md bg-ink/5 text-[9px] font-black text-ink/40">89–103</div>;
                return <div key={`${row}-${col}`} />;
              }
              const el = ELEMENTS.find((e) => e.col === col && e.row === row);
              if (!el) return <div key={`${row}-${col}`} />;
              void cell;
              const dim = filter && el.cat !== filter;
              const color = CATEGORY_META[el.cat].color;
              return (
                <button
                  key={el.z}
                  onClick={() => setSelected(el)}
                  className={cn(
                    "group grid aspect-square place-items-center rounded-md border text-center transition-all hover:scale-110 hover:z-10",
                    selected?.z === el.z && "ring-2 ring-amber"
                  )}
                  style={{
                    backgroundColor: dim ? "transparent" : `${color}1e`,
                    borderColor: `${color}66`,
                    opacity: dim ? 0.25 : 1,
                  }}
                  title={el.name}
                >
                  <span className="leading-none">
                    <span className="block text-[8px] font-bold text-ink/45">{el.z}</span>
                    <span className="block font-display text-sm font-bold sm:text-base" style={{ color }}>{el.sym}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.z}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-6 max-w-2xl rounded-3xl border p-6"
            style={{ borderColor: `${CATEGORY_META[selected.cat].color}66`, backgroundColor: `${CATEGORY_META[selected.cat].color}0f` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="grid size-16 place-items-center rounded-2xl text-cream" style={{ backgroundColor: CATEGORY_META[selected.cat].color }}>
                  <span className="text-center leading-none">
                    <span className="block text-[10px] font-bold opacity-80">{selected.z}</span>
                    <span className="block font-display text-2xl font-bold">{selected.sym}</span>
                  </span>
                </span>
                <div>
                  <p className="font-display text-2xl font-semibold text-ink">{selected.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: CATEGORY_META[selected.cat].color }}>
                    {CATEGORY_META[selected.cat].label}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full p-2 text-ink/40 hover:bg-ink/5" aria-label="Close element details">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { k: "Atomic number", v: selected.z },
                { k: "Atomic mass", v: selected.mass },
                { k: "Group", v: selected.row > 8 ? "f-block" : selected.col },
                { k: "Period", v: selected.row > 8 ? (selected.row === 9 ? 6 : 7) : selected.row },
              ].map((f) => (
                <div key={f.k} className="rounded-xl bg-paper/70 p-3 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-ink/45">{f.k}</p>
                  <p className="font-display text-lg font-bold text-ink">{f.v}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <p className="mt-6 text-center text-sm font-semibold text-ink/40">
            Tap any element to see its details — great for SS1–SS3 Chemistry revision.
          </p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════ PAGE ══════════════════════════ */

export default function ToolsPage() {
  const [tab, setTab] = useState<TabId>("gpa");
  return (
    <div className="bg-paper pb-24">
      <section className="dotgrid relative overflow-hidden pb-10 pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-1.5 text-xs font-bold text-ink/60">
              <Wrench className="size-3.5 text-leaf" /> Free student utilities
            </p>
            <h1 className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight text-ink sm:text-7xl">
              Study <span className="italic text-leaf">tools</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/60">
              The pocket toolkit every serious student needs — no downloads, no adverts, works offline.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all",
                tab === t.id ? "border-forest bg-forest text-cream" : "border-ink/15 bg-paper text-ink/60 hover:border-ink/40"
              )}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            {tab === "gpa" && (
              <div>
                <div className="mb-8 text-center">
                  <GraduationCap className="mx-auto size-8 text-leaf" />
                  <h2 className="mt-2 font-display text-3xl font-semibold text-ink">WAEC Aggregate & GPA</h2>
                  <p className="mt-1 text-sm text-ink/55">Enter your grades and instantly see your best-six aggregate like admission officers do.</p>
                </div>
                <GpaTool />
              </div>
            )}
            {tab === "calc" && <CalcTool />}
            {tab === "units" && (
              <div>
                <div className="mb-8 text-center">
                  <h2 className="font-display text-3xl font-semibold text-ink">Unit Converter</h2>
                  <p className="mt-1 text-sm text-ink/55">Length, mass, volume, temperature, time and data — exam-friendly conversions.</p>
                </div>
                <UnitTool />
              </div>
            )}
            {tab === "periodic" && (
              <div>
                <div className="mb-6 text-center">
                  <h2 className="font-display text-3xl font-semibold text-ink">Interactive Periodic Table</h2>
                  <p className="mt-1 text-sm text-ink/55">All 118 elements, colour-coded by family.</p>
                </div>
                <PeriodicTool />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
