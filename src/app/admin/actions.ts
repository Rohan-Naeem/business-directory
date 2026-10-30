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
//
// IMPORTANT: this action NEVER throws for an expected failure. In a
// production build, a thrown Server Action error is masked by React as
// "Minified React error #441" (a Server Components render error, message
// omitted), so the user only ever saw #441 and never the real reason.
// Returning { success: false, error } instead lets the button show the
// real reason in plain text.
export async function updateListingStatusAction(
  id: string,
  status: 'approved' | 'rejected' | 'pending',
  slug?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
    if (!cookieValue) {
      return { success: false, error: 'Admin login required - no admin cookie found by the server. Please Exit Admin, login again, then click Approve.' };
    }
    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return { success: false, error: 'Admin login is not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD missing). Set them in Vercel, then redeploy.' };
    }
    if (!(await isAdminSession(cookieValue))) {
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
