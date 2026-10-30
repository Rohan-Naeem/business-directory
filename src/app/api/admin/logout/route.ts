import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_TOKEN_COOKIE } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/admin/login', req.nextUrl.origin));
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set(ADMIN_TOKEN_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
