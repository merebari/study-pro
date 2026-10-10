import { NextResponse } from "next/server";
import { searchAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json({ subjects: [], topics: [], classes: [] });
  }
  try {
    const result = await searchAll(q, 8);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ subjects: [], topics: [], classes: [] }, { status: 500 });
  }
}
