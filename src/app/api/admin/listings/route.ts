import { NextRequest, NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';
import { isAdminRequest } from '@/lib/admin-api-auth';

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: 'Admin login required' }, { status: 401 });
  try {
    const body = await req.json();
    const { id, action, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
    }

    if (action === 'toggle_featured') {
      const ok = await DirectoryRepository.toggleBusinessFeatured(id);
      return NextResponse.json({ success: ok, message: 'Featured status updated' });
    }

    if (action === 'update_status' && status) {
      const ok = await DirectoryRepository.updateBusinessStatus(id, status);
      return NextResponse.json({ success: ok, message: `Status updated to ${status}` });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: 'Admin login required' }, { status: 401 });
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
