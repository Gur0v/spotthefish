import "server-only";

import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const PBKDF2_PREFIX = "pbkdf2-sha256";
const PBKDF2_ITERATIONS = 310000;
const PBKDF2_KEY_LENGTH = 32;
const PBKDF2_DIGEST = "sha256";

export async function hashAccessCodeSecret(code: string): Promise<string> {
  const argon2 = await loadArgon2();
  if (argon2) {
    return argon2.hash(code, { algorithm: 2 });
  }

  const salt = randomBytes(16);
  const hash = await pbkdf2Async(code, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_DIGEST);
  return [
    PBKDF2_PREFIX,
    String(PBKDF2_ITERATIONS),
    salt.toString("base64url"),
    hash.toString("base64url"),
  ].join("$");
}

export async function verifyAccessCodeSecret(storedHash: string, code: string): Promise<boolean> {
  if (storedHash.startsWith(`${PBKDF2_PREFIX}$`)) {
    return verifyPbkdf2Hash(storedHash, code);
  }

  const argon2 = await loadArgon2();
  if (!argon2) {
    console.error("Argon2 access-code verification unavailable for stored Argon2 hash.");
    return false;
  }

  return argon2.verify(storedHash, code);
}

async function loadArgon2(): Promise<typeof import("@node-rs/argon2") | null> {
  try {
    return await import("@node-rs/argon2");
  } catch (error) {
    console.error("Unable to load @node-rs/argon2. Falling back to PBKDF2 for new access codes.", error);
    return null;
  }
}

async function verifyPbkdf2Hash(storedHash: string, code: string): Promise<boolean> {
  const [, iterationsRaw, saltRaw, hashRaw] = storedHash.split("$");
  const iterations = Number(iterationsRaw);

  if (!Number.isInteger(iterations) || iterations <= 0 || !saltRaw || !hashRaw) {
    return false;
  }

  const expected = Buffer.from(hashRaw, "base64url");
  const actual = await pbkdf2Async(code, Buffer.from(saltRaw, "base64url"), iterations, expected.length, PBKDF2_DIGEST);

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
