import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DirectoryRepository } from '@/lib/data/repository';

const reviewSchema = z.object({
  business_id: z.string().min(1, 'Business ID is required'),
  user_name: z.string().min(2, 'Name must be at least 2 characters'),
  user_email: z.string().email('Valid email is required'),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(5, 'Review comment must be at least 5 characters'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get('business_id') || undefined;
    const status = (searchParams.get('status') as any) || 'approved';

    const reviews = await DirectoryRepository.getReviews(businessId, status);
    return NextResponse.json(reviews);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reviewSchema.parse(body);

    const review = await DirectoryRepository.createReview({
      business_id: validated.business_id,
      user_name: validated.user_name,
      user_email: validated.user_email,
      rating: validated.rating,
      title: validated.title || undefined,
      comment: validated.comment,
    });

    return NextResponse.json(
      { message: 'Review submitted for moderation', review },
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
      { error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}
