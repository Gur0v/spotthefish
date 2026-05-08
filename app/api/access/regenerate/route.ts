import { NextResponse } from "next/server";
import { isAccessSyncConfigured, regenerateAccessCode } from "@/lib/accessAccount";
import { getAccessSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!isAccessSyncConfigured()) {
      return NextResponse.json({ error: "Синхронізація недоступна в цій збірці." }, { status: 503 });
    }

    const session = await getAccessSession();
    if (!session.accountId) {
      return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
    }

    const accessCode = await regenerateAccessCode(session.accountId);
    return NextResponse.json({ accessCode });
  } catch (error) {
    console.error("Failed to regenerate access code.", error);
    return NextResponse.json({ error: "Не вдалося створити новий код доступу" }, { status: 500 });
  }
}
