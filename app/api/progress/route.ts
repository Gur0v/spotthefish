import { NextResponse } from "next/server";
import { AccessSession, getAccessSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSessionOrNull();
  if (!session.accountId) {
    return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("account_progress")
    .select("progress_json")
    .eq("account_id", session.accountId)
    .single();

  if (error) {
    return NextResponse.json({ error: "Не вдалося завантажити прогрес" }, { status: 500 });
  }

  return NextResponse.json({ progress: data?.progress_json ?? {} });
}

export async function PUT(request: Request) {
  const session = await getSessionOrNull();
  if (!session.accountId) {
    return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { progress?: unknown };
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("account_progress")
      .upsert({
        account_id: session.accountId,
        progress_json: body.progress ?? {},
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: "Не вдалося зберегти прогрес" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося зберегти прогрес" }, { status: 500 });
  }
}

async function getSessionOrNull(): Promise<AccessSession> {
  try {
    return await getAccessSession();
  } catch {
    return {};
  }
}
