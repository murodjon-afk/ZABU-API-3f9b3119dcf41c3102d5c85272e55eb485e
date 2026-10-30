
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import engAlphabet from "../eng/alphabet.json";
import farAlphabet from "../far/alphabet.json";
import tjkAlphabet from "../tjk/alphabet.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const alphabetMap: Record<string, unknown> = {
  eng: engAlphabet,
  far: farAlphabet,
  tjk: tjkAlphabet,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const secret = process.env.LESSONS_API_SECRET;
  const authorization = request.headers.get("authorization");
  const providedKey = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!secret || !providedKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const expected = Buffer.from(secret);
  const received = Buffer.from(providedKey);

  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { lang } = await params;
    const data = alphabetMap[lang];

    if (!data) {
      return NextResponse.json(
        { error: "Алфавит не найден. Доступные: eng, far, tjk" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
