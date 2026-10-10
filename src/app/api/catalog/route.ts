import { NextResponse } from "next/server";
import { getPracticeCatalog } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getPracticeCatalog();
    return NextResponse.json({ catalog });
  } catch {
    return NextResponse.json({ catalog: [] }, { status: 500 });
  }
}
