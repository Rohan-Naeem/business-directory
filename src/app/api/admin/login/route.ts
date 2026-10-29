import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, adminSessionValue, checkAdminCredentials } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password || !checkAdminCredentials(String(username), String(password))) {
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
    return res;
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
