
import { NextResponse } from "next/server";

import lessons from "./lessons-a1.json";
export async function GET() {
  return NextResponse.json(lessons, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
