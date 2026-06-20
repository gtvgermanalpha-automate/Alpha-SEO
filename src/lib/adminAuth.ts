/**
 * Session auth for the CMS admin area.
 *
 * A single shared password (ADMIN_PASSWORD) is exchanged for a short-lived,
 * HMAC-signed session token stored in an httpOnly cookie. All crypto uses the
 * Web Crypto API (crypto.subtle) so the SAME code verifies the cookie in both
 * the Edge runtime (middleware.ts) and the Node runtime (route handlers).
 *
 * Required env vars: ADMIN_PASSWORD, ADMIN_SESSION_SECRET.
 */

export const ADMIN_COOKIE = "alpha_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

/** Both secrets must be present for the CMS to accept logins. */
export function isConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

/** Constant-time string comparison (avoids leaking length-prefix timing). */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

/** Compare a submitted password to ADMIN_PASSWORD in constant time. */
export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  return timingSafeEqual(input, expected);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET as string;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return bufferToBase64Url(signature);
}

/** Create a signed token `${expiryEpochSeconds}.${signature}`, or null if unconfigured. */
export async function createSessionToken(): Promise<string | null> {
  if (!isConfigured()) return null;
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = String(expiry);
  const signature = await sign(payload);
  return `${payload}.${signature}`;
}

/** Verify a session token's signature and expiry. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !isConfigured()) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const expected = await sign(payload);
  if (!timingSafeEqual(signature, expected)) return false;

  const expiry = Number(payload);
  if (!Number.isFinite(expiry)) return false;
  return expiry * 1000 > Date.now();
}
