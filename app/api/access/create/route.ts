import { NextResponse } from "next/server";
import { createLookupHash, formatAccessCode, generateAccessCode } from "@/lib/accessCode";
import { hashAccessCodeSecret } from "@/lib/codeSecret";
import { getAccessSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST() {
  let createdAccountId: string | null = null;

  try {
    let supabase: ReturnType<typeof getSupabaseAdmin>;
    try {
      supabase = getSupabaseAdmin();
    } catch (error) {
      console.error("Access code create failed during Supabase config.", error);
      return createAccessError("CONFIG");
    }

    let session: Awaited<ReturnType<typeof getAccessSession>>;
    try {
      session = await getAccessSession();
    } catch (error) {
      console.error("Access code create failed during session setup.", error);
      return createAccessError("SESSION");
    }

    const code = generateAccessCode();
    let codeLookupHash: string;
    try {
      codeLookupHash = createLookupHash(code);
    } catch (error) {
      console.error("Access code create failed during lookup hash setup.", error);
      return createAccessError("LOOKUP_SECRET");
    }

    let codeSecretHash: string;
    try {
      codeSecretHash = await hashAccessCodeSecret(code);
    } catch (error) {
      console.error("Access code create failed during secret hashing.", error);
      return createAccessError("SECRET_HASH");
    }

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
      return createAccessError("ACCOUNT_INSERT");
    }

    createdAccountId = account.id;

    const { error: progressError } = await supabase
      .from("account_progress")
      .insert({ account_id: account.id, progress_json: {} });

    if (progressError) {
      console.error("Failed to insert account progress.", progressError);
      await cleanupAccessAccount(supabase, account.id);
      return createAccessError("PROGRESS_INSERT");
    }

    session.accountId = account.id;
    try {
      await session.save();
    } catch (error) {
      console.error("Access code create failed while saving session.", error);
      await cleanupAccessAccount(supabase, account.id);
      return createAccessError("SESSION_SAVE");
    }

    return NextResponse.json({ accessCode: formatAccessCode(code) });
  } catch (error) {
    console.error("Failed to create access code.", error);
    return createAccessError(createdAccountId ? "UNKNOWN_AFTER_ACCOUNT" : "UNKNOWN");
  }
}

function createAccessError(debugCode: string) {
  return NextResponse.json(
    { error: "Не вдалося створити код доступу", debugCode },
    { status: 500 },
  );
}

async function cleanupAccessAccount(supabase: ReturnType<typeof getSupabaseAdmin>, accountId: string) {
  const { error } = await supabase
    .from("access_accounts")
    .delete()
    .eq("id", accountId);

  if (error) {
    console.error("Failed to clean up incomplete access account.", error);
  }
}
