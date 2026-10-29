import { NextResponse } from 'next/server';

// Intentionally a no-op. Admin auth is checked in Node server code only
// (AdminShell + /api/admin routes), because Vercel Secret environment
// variables are NOT available to Edge middleware. When the guard lived
// here, login (Node) succeeded but every sidebar click was rejected by
// Edge and sent back to /admin/login in a loop. Do NOT re-add an admin
// check to this file.
export function middleware() {
  return NextResponse.next();
}
