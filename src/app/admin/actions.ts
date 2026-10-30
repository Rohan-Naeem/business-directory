'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';
import { DirectoryRepository } from '@/lib/data/repository';

// Approve/reject as a Server Action, not an /api fetch.
//
// Temporary safe diagnostics (STEP 4, user request 2026-10-30): when
// authentication fails, the returned error includes ONLY booleans and
// lengths, never a token, password, or key value. Example:
// "Diagnostics: serverCookie=false, tokenArg=false, tokenLen=0,
// cookieLen=0, envConfigured=true, validation=false"
// That tells us exactly which channel failed, without leaking anything.
//
// Auth channels, in order:
// 1. Server Cookie header (cookies() in this action) - proven missing
//    on live Vercel for POSTs, even when the page GET sees it.
// 2. Token argument from document.cookie (gbh_admin_token, set at login)
//    - proven missing too after commit 85531b, even after a fresh login.
// 3. Token argument from the page itself (adminToken prop, rendered by
//    the server page that *did* see the httpOnly cookie). This is the
//    standard CSRF-token pattern: the server that rendered the page
//    already proved the admin, so it hands the client a token to send
//    back in the action body. The body *does* reach the server (the
//    action runs and returns diagnostics), so this channel cannot fail
//    the same way the Cookie header does, unless the page itself was
//    served from cache with no token prop at all.
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
    const envConfigured = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
    const diag = `Diagnostics: serverCookie=${Boolean(cookieValue)}, tokenArg=${Boolean(token)}, tokenLen=${token ? token.length : 0}, cookieLen=${cookieValue ? cookieValue.length : 0}, envConfigured=${envConfigured}`;
    if (!sessionValue) {
      return { success: false, error: `Admin login required - no admin session found by the server. ${diag} Please hard-refresh, Exit Admin, login again, then click Approve.` };
    }
    if (!envConfigured) {
      return { success: false, error: `Admin login is not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD missing). ${diag} Set them in Vercel, then redeploy.` };
    }
    const valid = await isAdminSession(sessionValue);
    if (!valid) {
      return { success: false, error: `Admin login required - admin session does not match the server. ${diag}, validation=false. Please hard-refresh, Exit Admin, login again, then click Approve.` };
    }
    const ok = await DirectoryRepository.updateBusinessStatus(id, status, slug);
    if (!ok) {
      return { success: false, error: `Status update failed in database. ${diag}, validation=true. Check SUPABASE_SERVICE_ROLE_KEY in Vercel - an anon key cannot approve pending rows.` };
    }
    revalidatePath('/admin');
    revalidatePath('/admin/listings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}
