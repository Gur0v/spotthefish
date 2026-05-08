import { NextResponse } from "next/server";
import { createAccessAccount, deleteAccessAccount, isAccessSyncConfigured } from "@/lib/accessAccount";
import { getAccessSession } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  try {
    if (!isAccessSyncConfigured()) {
      return NextResponse.json({ error: "Синхронізація недоступна в цій збірці." }, { status: 503 });
    }

    const session = await getAccessSession();
    const created = await createAccessAccount();
    session.accountId = created.accountId;
    try {
      await session.save();
    } catch (error) {
      await deleteAccessAccount(created.accountId);
      throw error;
    }

    return NextResponse.json({ accessCode: created.accessCode });
  } catch (error) {
    console.error("Failed to create access code.", error);
    if (error instanceof Error && error.message === "ACCESS_SYNC_NOT_CONFIGURED") {
      return NextResponse.json({ error: "Синхронізація недоступна в цій збірці." }, { status: 503 });
    }
    return NextResponse.json({ error: "Не вдалося створити код доступу" }, { status: 500 });
  }
}
