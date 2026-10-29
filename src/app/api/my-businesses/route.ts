import { NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';
import { getAuthUserFromRequest } from '@/lib/account-auth';

export async function GET(req: Request) {
  const user = await getAuthUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Login required' }, { status: 401 });
  const all = await DirectoryRepository.getAllBusinessesForAdmin('all');
  const email = (user.email || '').toLowerCase();
  const mine = all.filter((b: any) => b.user_id === user.id || (email && b.email && b.email.toLowerCase() === email));
  return NextResponse.json({ businesses: mine });
}
