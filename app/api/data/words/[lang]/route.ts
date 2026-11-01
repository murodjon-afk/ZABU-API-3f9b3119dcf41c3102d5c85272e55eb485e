
import { NextResponse } from "next/server";

import engWords from "../eng/words.json";
import farWords from "../far/words.json";
import tjkWords from "../tjk/words.json";

const dictionary: Record<string, unknown> = {
  eng: engWords,
  far: farWords,
  tjk: tjkWords,
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  try {
    const { lang } = await params;
    const data = dictionary[lang];

    if (!data) {
      return NextResponse.json(
        { error: "Язык не найден. Доступные: eng, far, tjk" },
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
