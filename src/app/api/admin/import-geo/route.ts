import { NextRequest, NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';
import { GEOGRAPHIC_DATA_PACKAGES } from '@/lib/data/geo-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetRegionSlug = body.region_slug; // optional: import specific region or all

    const countries = await DirectoryRepository.getCountries();
    const regions = await DirectoryRepository.getRegions();

    let totalAdded = 0;
    let totalSkipped = 0;

    for (const pkg of GEOGRAPHIC_DATA_PACKAGES) {
      if (targetRegionSlug && pkg.region_slug !== targetRegionSlug) {
        continue;
      }

      const country = countries.find(c => c.slug === pkg.country_slug);
      let region = regions.find(r => r.slug === pkg.region_slug && r.country_id === country?.id);

      if (!country) continue;
      
      // If region doesn't exist yet, we can use the first matching country region or create
      if (!region) {
        const countryRegs = regions.filter(r => r.country_id === country.id);
        region = countryRegs[0];
      }

      if (region) {
        const result = await DirectoryRepository.importCities(country.id, region.id, pkg.cities);
        totalAdded += result.added;
        totalSkipped += result.skipped;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Geographic dataset import complete. Added: ${totalAdded}, Skipped (Already existed): ${totalSkipped}`,
      added: totalAdded,
      skipped: totalSkipped,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
