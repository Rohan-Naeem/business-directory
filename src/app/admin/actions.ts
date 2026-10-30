'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';
import { DirectoryRepository } from '@/lib/data/repository';
import { GEOGRAPHIC_DATA_PACKAGES } from '@/lib/data/geo-data';

// All admin mutations live here as Server Actions, not /api fetches.
//
// Why: live proof (2026-10-29/30) showed the Cookie header is not
// reaching /api route handlers or Server Action POSTs on Vercel, even
// when the dashboard page GET sees the httpOnly cookie. The page
// itself *does* see the cookie, so each admin page passes its session
// value as an `adminToken` page prop (the standard CSRF-token pattern),
// and every action below accepts that token in its arguments, with
// the Cookie header and document.cookie token as fallbacks. The body
// *does* reach the server, so this channel works where /api fetches
// returned 401 "Admin login required".
//
// IMPORTANT: every action NEVER throws for an expected failure. In a
// production build, a thrown Server Action error is masked by React as
// "Minified React error #441". Returning { success: false, error }
// instead lets the button show the real reason in plain text.
//
// Diagnostics are safe only: booleans and lengths, never a token,
// password, or key value. Server-side authorization is enforced in
// every action: the token is re-checked against the Vercel env admin
// hash with isAdminSession before any database change. A prop token
// is never trusted on its own.

type ActionResult = { success: boolean; error?: string; message?: string; added?: number; skipped?: number };

async function checkAdmin(token?: string): Promise<{ ok: boolean; diag: string }> {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE)?.value;
  const sessionValue = cookieValue || token || null;
  const envConfigured = Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
  const diag = `Diagnostics: serverCookie=${Boolean(cookieValue)}, tokenArg=${Boolean(token)}, tokenLen=${token ? token.length : 0}, cookieLen=${cookieValue ? cookieValue.length : 0}, envConfigured=${envConfigured}`;
  if (!sessionValue) return { ok: false, diag: `${diag} - no admin session found. Please hard-refresh, Exit Admin, login again, then try again.` };
  if (!envConfigured) return { ok: false, diag: `${diag} - admin login is not configured on the server (ADMIN_USERNAME / ADMIN_PASSWORD missing). Set them in Vercel, then redeploy.` };
  if (!(await isAdminSession(sessionValue))) return { ok: false, diag: `${diag}, validation=false - admin session does not match the server. Please hard-refresh, Exit Admin, login again, then try again.` };
  return { ok: true, diag };
}

export async function updateListingStatusAction(
  id: string,
  status: 'approved' | 'rejected' | 'pending',
  slug?: string,
  token?: string,
): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const ok = await DirectoryRepository.updateBusinessStatus(id, status, slug);
    if (!ok) return { success: false, error: 'Status update failed in database. Check SUPABASE_SERVICE_ROLE_KEY in Vercel - an anon key cannot approve pending rows.' };
    revalidatePath('/admin');
    revalidatePath('/admin/listings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}

export async function toggleBusinessFeaturedAction(id: string, token?: string): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const ok = await DirectoryRepository.toggleBusinessFeatured(id);
    if (!ok) return { success: false, error: 'Featured update failed - business not found.' };
    revalidatePath('/admin');
    revalidatePath('/admin/listings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}

export async function deleteBusinessAction(id: string, token?: string): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const ok = await DirectoryRepository.deleteBusiness(id);
    if (!ok) return { success: false, error: 'Delete failed - business not found.' };
    revalidatePath('/admin');
    revalidatePath('/admin/listings');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}

export async function updateReviewStatusAction(id: string, status: 'approved' | 'rejected', token?: string): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const ok = await DirectoryRepository.updateReviewStatus(id, status);
    if (!ok) return { success: false, error: 'Review status update failed - review not found.' };
    revalidatePath('/admin');
    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}

export async function updateReportStatusAction(id: string, status: 'resolved' | 'dismissed', token?: string): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const ok = await DirectoryRepository.updateReportStatus(id, status);
    if (!ok) return { success: false, error: 'Report status update failed - report not found.' };
    revalidatePath('/admin');
    revalidatePath('/admin/reports');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}

export async function importGeoAction(regionSlug: string | undefined, token?: string): Promise<ActionResult> {
  try {
    const auth = await checkAdmin(token);
    if (!auth.ok) return { success: false, error: `Admin login required. ${auth.diag}` };
    const countries = await DirectoryRepository.getCountries();
    const regions = await DirectoryRepository.getRegions();
    let totalAdded = 0;
    let totalSkipped = 0;
    for (const pkg of GEOGRAPHIC_DATA_PACKAGES) {
      if (regionSlug && pkg.region_slug !== regionSlug) continue;
      const country = countries.find(c => c.slug === pkg.country_slug);
      if (!country) continue;
      let region = regions.find(r => r.slug === pkg.region_slug && r.country_id === country.id);
      if (!region) region = regions.filter(r => r.country_id === country.id)[0];
      if (region) {
        const result = await DirectoryRepository.importCities(country.id, region.id, pkg.cities);
        totalAdded += result.added;
        totalSkipped += result.skipped;
      }
    }
    revalidatePath('/admin');
    revalidatePath('/admin/locations');
    return { success: true, message: `Geographic dataset import complete. Added: ${totalAdded}, Skipped (Already existed): ${totalSkipped}`, added: totalAdded, skipped: totalSkipped };
  } catch (e: any) {
    return { success: false, error: 'Server action failed: ' + (e?.message || 'unknown error') };
  }
}
