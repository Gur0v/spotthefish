import "server-only";

import { createLookupHash, formatAccessCode, generateAccessCode, normalizeAccessCode } from "@/lib/accessCode";
import { hashAccessCodeSecret, verifyAccessCodeSecret } from "@/lib/codeSecret";
import { getSupabaseAdmin, isSupabaseSyncConfigured } from "@/lib/supabaseAdmin";

export type CreatedAccessCode = {
  accountId: string;
  accessCode: string;
};

export type LoginResult =
  | { ok: true; accountId: string }
  | { ok: false; reason: "invalid-length" | "bad-code" | "unavailable" };

export function isAccessSyncConfigured() {
  return isSupabaseSyncConfigured() && Boolean(process.env.ACCOUNT_LOOKUP_SECRET) && Boolean(process.env.SESSION_PASSWORD);
}

export async function createAccessAccount(): Promise<CreatedAccessCode> {
  ensureAccessSyncConfigured();

  const supabase = getSupabaseAdmin();
  const rawCode = generateAccessCode();
  const code_lookup_hash = createLookupHash(rawCode);
  const code_secret_hash = await hashAccessCodeSecret(rawCode);

  const { data: account, error: accountError } = await supabase
    .from("access_accounts")
    .insert({
      code_lookup_hash,
      code_secret_hash,
      last_seen_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (accountError || !account) {
    console.error("Failed to insert access account.", accountError);
    throw new Error("ACCESS_ACCOUNT_CREATE_FAILED");
  }

  const { error: progressError } = await supabase
    .from("account_progress")
    .insert({ account_id: account.id, progress_json: {} });

  if (progressError) {
    console.error("Failed to insert account progress.", progressError);
    await deleteAccessAccount(account.id);
    throw new Error("ACCESS_PROGRESS_CREATE_FAILED");
  }

  return {
    accountId: account.id,
    accessCode: formatAccessCode(rawCode),
  };
}

export async function loginWithAccessCode(input: string): Promise<LoginResult> {
  if (!isAccessSyncConfigured()) {
    return { ok: false, reason: "unavailable" };
  }

  const code = normalizeAccessCode(input);
  if (code.length !== 16) {
    return { ok: false, reason: "invalid-length" };
  }

  const supabase = getSupabaseAdmin();
  const lookupHash = createLookupHash(code);
  const { data: account, error } = await supabase
    .from("access_accounts")
    .select("id, code_secret_hash")
    .eq("code_lookup_hash", lookupHash)
    .single();

  if (error || !account) {
    return { ok: false, reason: "bad-code" };
  }

  const valid = await verifyAccessCodeSecret(account.code_secret_hash, code);
  if (!valid) {
    return { ok: false, reason: "bad-code" };
  }

  await touchAccessAccount(account.id);
  return { ok: true, accountId: account.id };
}

export async function regenerateAccessCode(accountId: string): Promise<string> {
  ensureAccessSyncConfigured();

  const supabase = getSupabaseAdmin();
  const rawCode = generateAccessCode();
  const code_lookup_hash = createLookupHash(rawCode);
  const code_secret_hash = await hashAccessCodeSecret(rawCode);

  // Regeneration keeps the same account row and progress, but replaces both hashes.
  // The previous raw code cannot be recovered from stored data and stops matching immediately.
  const { error } = await supabase
    .from("access_accounts")
    .update({
      code_lookup_hash,
      code_secret_hash,
      last_seen_at: new Date().toISOString(),
    })
    .eq("id", accountId);

  if (error) {
    console.error("Failed to regenerate access code.", error);
    throw new Error("ACCESS_CODE_REGENERATE_FAILED");
  }

  return formatAccessCode(rawCode);
}

export async function deleteAccessAccount(accountId: string) {
  ensureAccessSyncConfigured();

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("access_accounts")
    .delete()
    .eq("id", accountId);

  if (error) {
    console.error("Failed to delete access account.", error);
    throw new Error("ACCESS_ACCOUNT_DELETE_FAILED");
  }
}

async function touchAccessAccount(accountId: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("access_accounts")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", accountId);

  if (error) {
    console.error("Failed to update access account last_seen_at.", error);
  }
}

function ensureAccessSyncConfigured() {
  if (!isAccessSyncConfigured()) {
    throw new Error("ACCESS_SYNC_NOT_CONFIGURED");
  }
}
