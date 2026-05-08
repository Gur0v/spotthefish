import { NextResponse } from "next/server";
import { getAccessSession } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getAccessSession();
    return NextResponse.json({ loggedIn: Boolean(session.accountId) });
  } catch {
    return NextResponse.json({ loggedIn: false });
  }
}
