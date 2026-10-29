import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DirectoryRepository } from '@/lib/data/repository';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAuthUserFromRequest } from '@/lib/account-auth';

export async function DELETE(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!serviceKey || !url) {
    return NextResponse.json({ error: 'Account deletion is not configured: SUPABASE_SERVICE_ROLE_KEY is missing in Vercel' }, { status: 500 });
  }
  const email = (user.email || '').toLowerCase();
  const all = await DirectoryRepository.getAllBusinessesForAdmin('all');
  const mine = all.filter((b: any) => b.user_id === user.id || (email && b.email && b.email.toLowerCase() === email));
  // Delete the user's businesses first (Supabase delete cascades hours, images, reviews, reports).
  for (const biz of mine) {
    try { await DirectoryRepository.deleteBusiness(biz.id); } catch { /* continue */ }
  }
  const server = getSupabaseServerClient();
  if (server) {
    await server.from('businesses').delete().eq('user_id', user.id);
    if (email) await server.from('businesses').delete().eq('email', user.email);
    await server.from('profiles').delete().eq('id', user.id);
  }
  // Finally delete the Auth user itself (needs the service_role key).
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ error: 'Could not delete account: ' + error.message }, { status: 500 });
  return NextResponse.json({ success: true, deletedBusinesses: mine.length });
}
