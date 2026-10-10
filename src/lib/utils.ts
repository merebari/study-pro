export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Deterministic 32-bit hash for stable pseudo-random variety. */
export function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function bandShort(code: string) {
  return code === "PRI" ? "Primary" : code === "JSS" ? "JSS" : "SS";
}

export const BAND_GRADIENT: Record<string, string> = {
  PRI: "from-[#3FA66A] to-[#7A9B2E]",
  JSS: "from-[#3E92CC] to-[#6C5CE7]",
  SSS: "from-[#E0682D] to-[#DC5B45]",
};
