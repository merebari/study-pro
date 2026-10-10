import { NextResponse } from "next/server";
import { getQuizQuestions } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const num = (key: string) => {
    const v = searchParams.get(key);
    return v ? Number(v) : undefined;
  };
  try {
    const rows = await getQuizQuestions({
      subjectId: num("subjectId"),
      classId: num("classId"),
      topicId: num("topicId"),
      limit: num("limit"),
    });
    return NextResponse.json({ questions: rows });
  } catch {
    return NextResponse.json({ questions: [] }, { status: 500 });
  }
}
