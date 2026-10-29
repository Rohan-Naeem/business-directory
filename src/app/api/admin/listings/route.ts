import { NextRequest, NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';
import { isAdminRequest } from '@/lib/admin-api-auth';

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdminRequest(req))) return NextResponse.json({ error: 'Admin login required - please login to admin again' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Admin check failed: ' + (e?.message || 'unknown') }, { status: 500 });
  }
  try {
    const body = await req.json();
    const { id, action, status, slug } = body;

    if (!id) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    if (action === 'toggle_featured') {
      const ok = await DirectoryRepository.toggleBusinessFeatured(id);
      return NextResponse.json({ success: ok, message: 'Featured status updated' });
    }

    if (action === 'update_status' && status) {
      const ok = await DirectoryRepository.updateBusinessStatus(id, status, slug);
      if (!ok) return NextResponse.json({ error: 'Status update failed in database. Check SUPABASE_SERVICE_ROLE_KEY in Vercel - an anon key cannot approve pending rows.' }, { status: 500 });
      return NextResponse.json({ success: true, message: `Status updated to ${status}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdminRequest(req))) return NextResponse.json({ error: 'Admin login required - please login to admin again' }, { status: 401 });
  } catch (e: any) {
    return NextResponse.json({ error: 'Admin check failed: ' + (e?.message || 'unknown') }, { status: 500 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    const ok = await DirectoryRepository.deleteBusiness(id);
    return NextResponse.json({ success: ok, message: 'Business deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
