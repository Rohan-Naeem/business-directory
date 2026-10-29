export const ADMIN_COOKIE = 'gbh_admin_session';

// The admin username/password are NEVER hard-coded here. They come only
// from Vercel Environment Variables (ADMIN_USERNAME / ADMIN_PASSWORD),
// so they never appear in GitHub code. If they are not set, admin login
// is disabled rather than falling back to a default password.
// Uses Web Crypto (Edge-compatible) instead of Node's crypto module.
async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function adminSessionValue(): Promise<string | null> {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return null;
  return sha256Hex(`${username}:${password}`);
}

export async function isAdminSession(cookieValue: string | undefined | null): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await adminSessionValue();
  if (!expected || cookieValue.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

export function checkAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPass) return false;
  return username === expectedUser && password === expectedPass;
}
