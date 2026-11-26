import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DirectoryRepository } from '@/lib/data/repository';

// Day 10: a business owner claims a listing. The claim is stored for admin
// review; approving it sets the business's is_verified to true (the Verified
// badge only renders when is_verified is true).
const claimSchema = z.object({
  business_id: z.string().min(1, 'Business ID is required'),
  claimant_name: z.string().min(2, 'Name must be at least 2 characters'),
  claimant_email: z.string().email('Valid email is required'),
  claimant_phone: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = claimSchema.parse(body);

    const business = await DirectoryRepository.getBusinessById(validated.business_id);
    if (!business || business.status !== 'approved') {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 });
    }
    if (business.is_verified) {
      return NextResponse.json({ error: 'This listing is already verified' }, { status: 409 });
    }

    const claim = await DirectoryRepository.submitClaim({
      business_id: business.id,
      business_name: business.name,
      claimant_name: validated.claimant_name,
      claimant_email: validated.claimant_email,
      claimant_phone: validated.claimant_phone?.trim() || undefined,
      message: validated.message?.trim() || undefined,
    });

    return NextResponse.json(
      { message: 'Claim request submitted for review', claim },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: error.message || 'Failed to submit claim' }, { status: 500 });
  }
}
