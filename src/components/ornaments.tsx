import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* SVG squiggle used under emphasised words */
export function Scribble({ children, color = "#F2B33D", className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span className={cn("scribble", className)}>
      {children}
      <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden>
        <path
          d="M3 9 C 22 3, 42 11, 62 6 C 82 2, 102 10, 117 5"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]",
        dark ? "border-cream/20 bg-cream/5 text-cream/70" : "border-ink/15 bg-paper text-ink/60",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-amber" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={cn(
          "mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl",
          dark ? "text-cream" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base leading-relaxed sm:text-lg",
            dark ? "text-cream/60" : "text-ink/60",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

/* Rounded "sticker" chip */
export function Chip({
  children,
  color = "#2f9c68",
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold", className)}
      style={{ backgroundColor: `${color}1f`, color }}
    >
      {children}
    </span>
  );
}

/* Torn-paper divider edge */
export function TornEdge({ fill = "#0f2e21", flip = false, className }: { fill?: string; flip?: boolean; className?: string }) {
  return (
    <svg
      className={cn("block h-8 w-full sm:h-12", flip && "-scale-y-100", className)}
      viewBox="0 0 1440 48"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 48 L0 30 Q 60 12 120 26 T 240 22 T 360 30 T 480 16 T 600 28 T 720 18 T 840 30 T 960 14 T 1080 26 T 1200 20 T 1320 28 T 1440 22 L1440 48 Z"
        fill={fill}
      />
    </svg>
  );
}
