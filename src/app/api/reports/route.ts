import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DirectoryRepository } from '@/lib/data/repository';

const reportSchema = z.object({
  business_id: z.string().min(1, 'Business ID is required'),
  reporter_email: z.string().email('Valid email is required'),
  reason: z.string().min(2, 'Reason is required'),
  details: z.string().optional(),
});

export async function GET() {
  try {
    const reports = await DirectoryRepository.getReports();
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reportSchema.parse(body);

    const report = await DirectoryRepository.createReport({
      business_id: validated.business_id,
      reporter_email: validated.reporter_email,
      reason: validated.reason,
      details: validated.details || undefined,
    });

    return NextResponse.json(
      { message: 'Report submitted successfully', report },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || 'Failed to submit report' },
      { status: 500 }
    );
  }
}
