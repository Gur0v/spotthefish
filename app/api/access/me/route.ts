import { NextResponse } from "next/server";
import { isAccessSyncConfigured } from "@/lib/accessAccount";
import { getAccessSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAccessSession();
    return NextResponse.json({ loggedIn: Boolean(session.accountId), syncAvailable: isAccessSyncConfigured() });
  } catch {
    return NextResponse.json({ loggedIn: false, syncAvailable: isAccessSyncConfigured() });
  }
}
