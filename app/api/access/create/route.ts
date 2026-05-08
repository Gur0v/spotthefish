import { NextResponse } from "next/server";
import { createLookupHash, formatAccessCode, generateAccessCode } from "@/lib/accessCode";
import { hashAccessCodeSecret } from "@/lib/codeSecret";
import { getAccessSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = getSupabaseAdmin();
    const session = await getAccessSession();
    const code = generateAccessCode();
    const codeLookupHash = createLookupHash(code);
    const codeSecretHash = await hashAccessCodeSecret(code);

    const { data: account, error: accountError } = await supabase
      .from("access_accounts")
      .insert({
        code_lookup_hash: codeLookupHash,
        code_secret_hash: codeSecretHash,
        last_seen_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (accountError || !account) {
      console.error("Failed to insert access account.", accountError);
      return NextResponse.json({ error: "Не вдалося створити код доступу" }, { status: 500 });
    }

    const { error: progressError } = await supabase
      .from("account_progress")
      .insert({ account_id: account.id, progress_json: {} });

    if (progressError) {
      console.error("Failed to insert account progress.", progressError);
      return NextResponse.json({ error: "Не вдалося створити код доступу" }, { status: 500 });
    }

    session.accountId = account.id;
    await session.save();

    return NextResponse.json({ accessCode: formatAccessCode(code) });
  } catch (error) {
    console.error("Failed to create access code.", error);
    return NextResponse.json({ error: "Не вдалося створити код доступу" }, { status: 500 });
  }
}
