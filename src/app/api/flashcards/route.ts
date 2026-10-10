import { NextResponse } from "next/server";
import { db } from "@/db";
import { topics, topicClasses } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subjectId = Number(searchParams.get("subject") ?? "");
  const classId = Number(searchParams.get("class") ?? "");
  if (!subjectId || Number.isNaN(subjectId)) {
    return NextResponse.json({ cards: [] });
  }
  try {
    let rows = await db
      .select({ id: topics.id, title: topics.title, keyTerms: topics.keyTerms })
      .from(topics)
      .where(eq(topics.subjectId, subjectId));

    if (classId && !Number.isNaN(classId)) {
      const links = await db
        .select({ topicId: topicClasses.topicId })
        .from(topicClasses)
        .where(and(eq(topicClasses.classId, classId), inArray(topicClasses.topicId, rows.map((r) => r.id))));
      const allowed = new Set(links.map((l) => l.topicId));
      rows = rows.filter((r) => allowed.has(r.id));
    }

    const cards = rows.flatMap((t) =>
      (t.keyTerms ?? []).map((kt) => ({
        front: kt.term,
        back: kt.def,
        topic: t.title,
      }))
    );

    // shuffle
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    return NextResponse.json({ cards });
  } catch {
    return NextResponse.json({ cards: [] }, { status: 500 });
  }
}
