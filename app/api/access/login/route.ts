import { NextResponse } from "next/server";
import { loginWithAccessCode } from "@/lib/accessAccount";
import { getAccessSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // TODO: Add production Redis/Upstash rate limiting before public deployment of numeric-code login.
  try {
    const body = (await request.json()) as { code?: unknown };
    const result = await loginWithAccessCode(typeof body.code === "string" ? body.code : "");

    if (!result.ok && result.reason === "invalid-length") {
      return NextResponse.json({ error: "Код має містити 16 цифр" }, { status: 400 });
    }

    if (!result.ok && result.reason === "unavailable") {
      return NextResponse.json({ error: "Синхронізація недоступна в цій збірці." }, { status: 503 });
    }

    if (!result.ok) {
      return NextResponse.json({ error: "Неправильний код доступу" }, { status: 401 });
    }

    const session = await getAccessSession();
    session.accountId = result.accountId;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to log in with access code.", error);
    return NextResponse.json({ error: "Неправильний код доступу" }, { status: 401 });
  }
}
