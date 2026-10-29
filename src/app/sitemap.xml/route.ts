import { NextResponse } from 'next/server';
import { DirectoryRepository } from '@/lib/data/repository';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexusbiz.directory';

  const [countries, cities, categories, searchResult] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getCities(),
    DirectoryRepository.getCategories(),
    DirectoryRepository.searchBusinesses({ limit: 1000 }),
  ]);

  const staticUrls = [
    { loc: `${baseUrl}`, priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/categories`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${baseUrl}/directories`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${baseUrl}/add-business`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/guidelines`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${baseUrl}/privacy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${baseUrl}/terms`, priority: '0.3', changefreq: 'yearly' },
  ];

  // Country URLs
  const countryUrls = countries.map(c => ({
    loc: `${baseUrl}/directories/${c.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  // City URLs
  const cityUrls = cities.map(city => {
    const country = countries.find(c => c.id === city.country_id);
    const countrySlug = country?.slug || 'pakistan';
    return {
      loc: `${baseUrl}/directories/${countrySlug}/${city.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
    };
  });

  // Category URLs
  const categoryUrls = categories.map(cat => ({
    loc: `${baseUrl}/categories/${cat.slug}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  // Approved Business Profile URLs
  const businessUrls = searchResult.businesses.map(b => ({
    loc: `${baseUrl}/business/${b.slug}`,
    priority: '0.6',
    changefreq: 'monthly',
  }));

  const allUrls = [
    ...staticUrls,
    ...countryUrls,
    ...categoryUrls,
    ...cityUrls,
    ...businessUrls,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
