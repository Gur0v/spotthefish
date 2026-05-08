import "server-only";

import { createClient } from "@supabase/supabase-js";

const requiredSupabaseAdminEnvNames = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

export type SupabaseAdminEnvName = (typeof requiredSupabaseAdminEnvNames)[number];

export function getMissingSupabaseAdminEnvNames(): SupabaseAdminEnvName[] {
  return requiredSupabaseAdminEnvNames.filter((name) => !process.env[name]);
}

export function isSupabaseSyncConfigured() {
  return getMissingSupabaseAdminEnvNames().length === 0;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseAdmin() {
  const missingEnvNames = getMissingSupabaseAdminEnvNames();
  if (missingEnvNames.length) {
    throw new Error(`Missing required Supabase admin environment variables: ${missingEnvNames.join(", ")}`);
  }

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
