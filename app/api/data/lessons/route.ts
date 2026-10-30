
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

import lessons from "./lessons.json";


export async function GET(request: NextRequest) {
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

  return NextResponse.json(lessons, {
    headers: { "Cache-Control": "no-store" },
  });
}
