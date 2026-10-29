import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { DirectoryRepository } from '@/lib/data/repository';

const businessSubmissionSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  category_id: z.string().min(1, 'Category is required'),
  subcategory_id: z.string().optional(),
  country_id: z.string().min(1, 'Country is required'),
  region_id: z.string().min(1, 'Region is required'),
  city_id: z.string().min(1, 'City is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  postal_code: z.string().optional(),
  phone: z.string().min(6, 'Valid phone number is required'),
  email: z.string().email('Valid email address is required'),
  website: z.string().url().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(30, 'Detailed description must be at least 30 characters'),
  cover_image_url: z.string().url().optional().or(z.literal('')),
  logo_url: z.string().url().optional().or(z.literal('')),
  hours: z.array(z.object({
    day_of_week: z.number().int().min(0).max(6),
    opens_at: z.string(),
    closes_at: z.string(),
    is_closed: z.boolean(),
  })).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || undefined;
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const city = searchParams.get('city') || undefined;
    const sort = (searchParams.get('sort') as any) || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const result = await DirectoryRepository.searchBusinesses({
      q,
      category,
      country,
      city,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = businessSubmissionSchema.parse(body);

    const newBusiness = await DirectoryRepository.createBusiness({
      name: validated.name,
      slug: '', // generated automatically in repository
      category_id: validated.category_id,
      subcategory_id: validated.subcategory_id,
      country_id: validated.country_id,
      region_id: validated.region_id,
      city_id: validated.city_id,
      address: validated.address,
      postal_code: validated.postal_code,
      phone: validated.phone,
      email: validated.email,
      website: validated.website || undefined,
      whatsapp: validated.whatsapp || undefined,
      short_description: validated.short_description,
      description: validated.description,
      cover_image_url: validated.cover_image_url || undefined,
      logo_url: validated.logo_url || undefined,
      hours: validated.hours,
    });

    return NextResponse.json(
      {
        message: 'Business listing successfully submitted for review',
        business: newBusiness,
      },
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
      { error: error.message || 'Failed to submit business listing' },
      { status: 500 }
    );
  }
}
