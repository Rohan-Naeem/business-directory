import { NextRequest } from 'next/server';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';

export async function isAdminRequest(req: NextRequest): Promise<boolean> {
  return isAdminSession(req.cookies.get(ADMIN_COOKIE)?.value);
}
