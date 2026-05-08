import "server-only";

import { createHmac, randomInt } from "node:crypto";

export function generateAccessCode(): string {
  let code = "";
  for (let index = 0; index < 16; index += 1) {
    code += String(randomInt(0, 10));
  }
  return code;
}

export function formatAccessCode(code: string): string {
  return normalizeAccessCode(code).replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function normalizeAccessCode(input: string): string {
  return input.replace(/\D/g, "");
}

export function createLookupHash(code: string): string {
  const secret = process.env.ACCOUNT_LOOKUP_SECRET;
  if (!secret) {
    throw new Error("Missing required environment variable: ACCOUNT_LOOKUP_SECRET");
  }

  return createHmac("sha256", secret).update(normalizeAccessCode(code)).digest("hex");
}
