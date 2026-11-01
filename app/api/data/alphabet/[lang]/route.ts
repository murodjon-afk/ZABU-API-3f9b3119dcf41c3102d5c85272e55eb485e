
import { NextResponse } from "next/server";

import engAlphabet from "../eng/alphabet.json";
import farAlphabet from "../far/alphabet.json";
import tjkAlphabet from "../tjk/alphabet.json";

const alphabetMap: Record<string, unknown> = {
  eng: engAlphabet,
  far: farAlphabet,
  tjk: tjkAlphabet,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
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
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
