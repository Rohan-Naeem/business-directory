import { NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';

export async function GET() {
  try {
    const [countries, regions, cities, categories, subcategories, businesses, reviews, reports] = await Promise.all([
      DirectoryRepository.getCountries(),
      DirectoryRepository.getRegions(),
      DirectoryRepository.getCities(),
      DirectoryRepository.getCategories(),
      DirectoryRepository.getSubcategories(),
      DirectoryRepository.getAllBusinessesForAdmin('all'),
      DirectoryRepository.getReviews(undefined, 'all'),
      DirectoryRepository.getReports(),
    ]);

    return NextResponse.json({
      countries,
      regions,
      cities,
      categories,
      subcategories,
      businesses,
      reviews,
      reports,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
