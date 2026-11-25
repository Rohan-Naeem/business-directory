import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import CountryFlag from '@/components/ui/CountryFlag';
import { BusinessCard } from '@/components/business/BusinessCard';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { MapPin, Search, PlusCircle, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

interface CityPageProps {
  params: Promise<{
    country: string;
    city: string;
  }>;
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { country: countrySlug, city: citySlug } = await params;
  const [country, city] = await Promise.all([
    DirectoryRepository.getCountryBySlug(countrySlug),
    DirectoryRepository.getCityBySlug(countrySlug, citySlug),
  ]);

  if (!country || !city) {
    return { title: 'City Directory Not Found' };
  }

  return {
    title: `${city.name} Business Directory, ${country.name} - Find Local Businesses`,
    description: `Find local businesses in ${city.name}, ${country.name}. Browse ${city.name} businesses by category, from software companies to hospitals and restaurants, with contact details and reviews where listed.`,
    alternates: {
      canonical: `https://www.globalbizzhub.com/${country.slug}/${city.slug}`,
    },
    openGraph: {
      title: `${city.name} Business Directory | ${country.name}`,
      description: `Explore businesses in ${city.name}, ${country.name}.`,
      url: `https://www.globalbizzhub.com/${country.slug}/${city.slug}`,
    },
  };
}

// Extra intro sentence for cities with GSC queries the template intro does not
// cover (checked 2026-11-19: each word below matches a real query for that city).
const CITY_INTRO_OVERRIDES: Record<string, string> = {
  'uk/birmingham':
    'Browse software houses and small businesses in Birmingham, from IT companies to manufacturers, clinics and shops.',
  'uk/manchester':
    'Find solicitors and law firms in Manchester, with addresses and contact details where listed.',
  'uk/leeds':
    'Find solicitors and law firms in Leeds, with addresses and contact details where listed.',
  'usa/dallas':
    'Find manufacturers and manufacturing companies in Dallas, TX, with addresses and contact details where listed.',
  'usa/san-diego':
    'Find franchises, restaurants and shops in San Diego, with addresses and contact details where listed.',
  'usa/chicago':
    'Find companies based in Chicago, with addresses and contact details where listed.',
  'pakistan/lahore':
    'Find software houses and IT companies in Lahore, with addresses and contact details where listed.',
};

export default async function CityDirectoryPage({ params }: CityPageProps) {
  const { country: countrySlug, city: citySlug } = await params;
  const [country, city] = await Promise.all([
    DirectoryRepository.getCountryBySlug(countrySlug),
    DirectoryRepository.getCityBySlug(countrySlug, citySlug),
  ]);

  if (!country || !city) {
    notFound();
  }

  const [categories, nearbyCities, searchResult] = await Promise.all([
    DirectoryRepository.getCategories(),
    DirectoryRepository.getCities({ countryId: country.id }),
    // Show ALL businesses of this city (was limit 12 — the heading shows
    // the full total, so the list must match it). No city has more than
    // ~50 listings, so 1000 is effectively "all".
    DirectoryRepository.searchBusinesses({ country: country.slug, city: city.slug, limit: 1000 }),
  ]);

  const otherCities = nearbyCities.filter(c => c.id !== city.id).slice(0, 8);

  // Breadcrumb Schema.org JSON-LD
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.globalbizzhub.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: country.name,
        item: `https://www.globalbizzhub.com/${country.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${city.name} Directory`,
        item: `https://www.globalbizzhub.com/${country.slug}/${city.slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: country.name, href: `/${country.slug}` },
            { label: city.name },
          ]}
        />

        {/* City Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-1">
                <MapPin className="w-4 h-4" />
                <span className="inline-flex items-center gap-2"><CountryFlag country={country} className="h-6 w-6" /> {country.name} • Local Metropolitan Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
                {city.name} Business Directory, {country.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Find local businesses in {city.name}, {country.name} — explore companies, manufacturers, shops, hospitals, restaurants and services located throughout the city, with addresses and contact details where listed.
                {CITY_INTRO_OVERRIDES[`${country.slug}/${city.slug}`]
                  ? ` ${CITY_INTRO_OVERRIDES[`${country.slug}/${city.slug}`]}`
                  : ''}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/search?country=${country.slug}&city=${city.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Search className="w-4 h-4 text-[#10B981]" />
                <span>Search in {city.name}</span>
              </Link>

              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add {city.name} Business</span>
              </Link>
            </div>
          </div>
        </div>

        {/* City Categories Quick Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Popular Industries in {city.name}:
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?country=${country.slug}&city=${city.slug}&category=${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#065F46] text-xs font-medium border border-slate-200/70 transition-colors"
              >
                <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-[#10B981]" />
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Listings in this City */}
        <div className="space-y-6 mb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#172B45]">
              Businesses in {city.name} ({searchResult.total})
            </h2>
            <Link
              href={`/search?country=${country.slug}&city=${city.slug}`}
              className="text-xs font-semibold text-[#065F46] hover:underline"
            >
              Advanced Search in {city.name} &rarr;
            </Link>
          </div>

          {searchResult.businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResult.businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">
                No published businesses currently registered in {city.name}.
              </p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#10B981] hover:underline"
              >
                Submit the first {city.name} business listing &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Nearby / Other Cities in Country */}
        {otherCities.length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-[#172B45] mb-4">
              Explore Other Cities in {country.name}:
            </h3>
            <div className="flex flex-wrap gap-2">
              {otherCities.map((other) => (
                <Link
                  key={other.id}
                  href={`/${country.slug}/${other.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 font-medium transition-colors"
                >
                  {other.name} ({other.business_count ?? 0})
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
