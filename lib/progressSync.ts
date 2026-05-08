import "server-only";

import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function loadSyncedProgress(accountId: string) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("account_progress")
    .select("progress_json")
    .eq("account_id", accountId)
    .single();

  if (error) {
    console.error("Failed to load synced progress.", error);
    throw new Error("PROGRESS_LOAD_FAILED");
  }

  return data?.progress_json ?? {};
}

export async function saveSyncedProgress(accountId: string, progress: unknown) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("account_progress")
    .upsert({
      account_id: accountId,
      progress_json: progress ?? {},
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Failed to save synced progress.", error);
    throw new Error("PROGRESS_SAVE_FAILED");
  }
}
