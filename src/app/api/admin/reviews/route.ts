import { NextRequest, NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';
import { isAdminRequest } from '@/lib/admin-api-auth';

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest(req))) return NextResponse.json({ error: 'Admin login required' }, { status: 401 });
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    const ok = await DirectoryRepository.updateReviewStatus(id, status);
    return NextResponse.json({ success: ok, message: `Review status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
