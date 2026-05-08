import "server-only";

import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";

export type AccessSession = {
  accountId?: string;
};

function getSessionPassword() {
  const password = process.env.SESSION_PASSWORD;
  if (!password) {
    throw new Error("Missing required environment variable: SESSION_PASSWORD");
  }
  return password;
}

export async function getAccessSession() {
  const sessionOptions: SessionOptions = {
    cookieName: "spot_the_fish_session",
    password: getSessionPassword(),
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  };

  return getIronSession<AccessSession>(await cookies(), sessionOptions);
}
