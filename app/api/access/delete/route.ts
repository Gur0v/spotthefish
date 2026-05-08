import { NextResponse } from "next/server";
import { getAccessSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getAccessSession();
    if (!session.accountId) {
      return NextResponse.json({ error: "Не виконано вхід" }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("access_accounts")
      .delete()
      .eq("id", session.accountId);

    if (error) {
      return NextResponse.json({ error: "Не вдалося видалити код доступу" }, { status: 500 });
    }

    session.destroy();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не вдалося видалити код доступу" }, { status: 500 });
  }
}
