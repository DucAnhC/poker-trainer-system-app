import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const keyLength = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, keyLength).toString("hex");

  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hashedValue] = storedHash.split(":");

  if (!salt || !hashedValue) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, keyLength);
  const storedBuffer = Buffer.from(hashedValue, "hex");

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}
