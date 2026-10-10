import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="dotgrid relative flex min-h-[70vh] items-center justify-center bg-paper px-4 py-24">
      <div className="text-center">
        <p className="text-outline font-display text-[9rem] font-bold leading-none sm:text-[12rem]">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
          This page skipped class.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/55">
          The link may be old or mistyped. Let's get you back to somewhere with actual notes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-bold text-cream"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3 text-sm font-bold text-ink hover:border-ink"
          >
            <Compass className="size-4 text-leaf" /> Browse classes
          </Link>
        </div>
      </div>
    </div>
  );
}
