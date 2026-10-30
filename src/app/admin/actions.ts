'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';
import { DirectoryRepository } from '@/lib/data/repository';

// Approve/reject as a Server Action, not an /api fetch.
// Live proof (2026-10-30): the dashboard page GET sees the httpOnly
// cookie, but the Server Action POST does not see it at all
// ("no admin cookie found by the server"), even though the action runs.
// The POST body does reach the server, so the client also sends the
// readable session token (gbh_admin_token, set at login) explicitly in
// the action arguments, and either the Cookie header or that token
// passing the same hash check is enough.
//
// IMPORTANT: this action NEVER throws for an expected failure. In a
// production build, a thrown Server Action error is masked by React as
// "Minified React error #441", so the user only ever saw #441 and never
// the real reason. Returning { success: false, error } instead lets the
// button show the real reason in plain text.
export async function updateListingStatusAction(
  id: string,
  status: 'approved' | 'rejected' | 'pending',
  slug?: string,
  token?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
    const sessionValue = cookieValue || token || null;
    if (!sessionValue) {
      return { success: false, error: 'Admin login required - no admin session found by the server. Please Exit Admin, login again, then click Approve.' };
    }
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return { success: false, error: 'Admin login is not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD missing). Set them in Vercel, then redeploy.' };
    }
    if (!(await isAdminSession(sessionValue))) {
      return { success: false, error: 'Admin login required - admin session does not match the server. Please Exit Admin, login again, then click Approve.' };
    }
    const ok = await DirectoryRepository.updateBusinessStatus(id, status, slug);
    if (!ok) {
      return { success: false, error: 'Status update failed in database. Check SUPABASE_SERVICE_ROLE_KEY in Vercel - an anon key cannot approve pending rows.' };
    }
    revalidatePath('/admin');
    revalidatePath('/admin/listings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}
