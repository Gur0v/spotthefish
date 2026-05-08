import { NextResponse } from "next/server";
import { loadSyncedProgress, saveSyncedProgress } from "@/lib/progressSync";
import { getAccessSessionOrNull } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAccessSessionOrNull();
  if (!session.accountId) {
    return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
  }

  try {
    const progress = await loadSyncedProgress(session.accountId);
    return NextResponse.json({ progress });
  } catch {
    return NextResponse.json({ error: "Не вдалося завантажити прогрес" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAccessSessionOrNull();
  if (!session.accountId) {
    return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { progress?: unknown };
    await saveSyncedProgress(session.accountId, body.progress ?? {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося зберегти прогрес" }, { status: 500 });
  }
}
