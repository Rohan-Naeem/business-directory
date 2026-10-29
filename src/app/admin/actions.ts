'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';
import { DirectoryRepository } from '@/lib/data/repository';

// Approve/reject as a Server Action, not an /api fetch. This runs in the
// same server context as the admin dashboard page itself (cookies() from
// next/headers, the same check AdminShell uses), so it cannot disagree
// with the dashboard about whether the admin is logged in. The /api route
// was returning 401 even when the dashboard was open, which means the
// cookie was not reaching the /api route handler in the live deployment.
export async function updateListingStatusAction(
  id: string,
  status: 'approved' | 'rejected' | 'pending',
  slug?: string,
): Promise<{ success: true }> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!cookieValue) {
    throw new Error('Admin login required - no admin cookie found by the server. Please Exit Admin, login again, then click Approve.');
  }
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error('Admin login is not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD missing). Set them in Vercel, then redeploy.');
  }
  if (!(await isAdminSession(cookieValue))) {
    throw new Error('Admin login required - admin session does not match the server. Please Exit Admin, login again, then click Approve.');
  }
  const ok = await DirectoryRepository.updateBusinessStatus(id, status, slug);
  if (!ok) {
    throw new Error('Status update failed in database. Check SUPABASE_SERVICE_ROLE_KEY in Vercel - an anon key cannot approve pending rows.');
  }
  revalidatePath('/admin');
  revalidatePath('/admin/listings');
  return { success: true };
}
