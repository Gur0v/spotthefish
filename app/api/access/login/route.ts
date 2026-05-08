import { verify } from "@node-rs/argon2";
import { NextResponse } from "next/server";
import { createLookupHash, normalizeAccessCode } from "@/lib/accessCode";
import { getAccessSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // TODO: Add production Redis/Upstash rate limiting before public deployment of numeric-code login.
  try {
    const body = (await request.json()) as { code?: unknown };
    const code = normalizeAccessCode(typeof body.code === "string" ? body.code : "");

    if (code.length !== 16) {
      return NextResponse.json({ error: "Код має містити 16 цифр" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const lookupHash = createLookupHash(code);
    const { data: account, error } = await supabase
      .from("access_accounts")
      .select("id, code_secret_hash")
      .eq("code_lookup_hash", lookupHash)
      .single();

    if (error || !account) {
      return NextResponse.json({ error: "Неправильний код доступу" }, { status: 401 });
    }

    const valid = await verify(account.code_secret_hash, code);
    if (!valid) {
      return NextResponse.json({ error: "Неправильний код доступу" }, { status: 401 });
    }

    await supabase
      .from("access_accounts")
      .update({ last_seen_at: new Date().toISOString() })
      .eq("id", account.id);

    const session = await getAccessSession();
    session.accountId = account.id;
    await session.save();

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Неправильний код доступу" }, { status: 401 });
  }
}
