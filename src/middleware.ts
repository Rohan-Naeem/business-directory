import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';

// Admin is hidden from the public site: /admin/* requires the admin session
// cookie set by /api/admin/login. Everyone else is sent to /admin/login.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) return NextResponse.next();
  if (pathname === '/admin/login' || pathname === '/api/admin/login') return NextResponse.next();
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  if (await isAdminSession(cookie)) return NextResponse.next();
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Admin login required' }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = '/admin/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
