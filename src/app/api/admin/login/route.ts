import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_TOKEN_COOKIE, adminSessionValue, checkAdminCredentials } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body?.username ?? '').trim();
    const password = String(body?.password ?? '').trim();
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Admin login is not configured: set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel, then redeploy' }, { status: 500 });
    }
    if (!username || !password || !checkAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid admin username or password' }, { status: 401 });
    }
    const value = await adminSessionValue();
    if (!value) {
      return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    // Readable copy for Server Actions: the Cookie header is not reaching
    // Server Action POSTs on live Vercel, so the client sends this token
    // explicitly in the action arguments instead.
    res.cookies.set(ADMIN_TOKEN_COOKIE, value, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
