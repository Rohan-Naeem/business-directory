import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
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
    title: `${city.name} Business Directory, ${country.name} - Verified Local Companies`,
    description: `Discover top rated businesses, software firms, medical clinics, and professional services in ${city.name}, ${country.name}. Find phone numbers, reviews, operating hours, and addresses.`,
    alternates: {
      canonical: `https://nexusbiz.directory/directories/${country.slug}/${city.slug}`,
    },
    openGraph: {
      title: `${city.name} Business Directory | ${country.name}`,
      description: `Explore verified businesses in ${city.name}, ${country.name}.`,
      url: `https://nexusbiz.directory/directories/${country.slug}/${city.slug}`,
    },
  };
}

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
    DirectoryRepository.searchBusinesses({ country: country.slug, city: city.slug, limit: 12 }),
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
        item: 'https://nexusbiz.directory',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: country.name,
        item: `https://nexusbiz.directory/directories/${country.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${city.name} Directory`,
        item: `https://nexusbiz.directory/directories/${country.slug}/${city.slug}`,
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
            { label: 'Directories', href: '/directories' },
            { label: country.name, href: `/directories/${country.slug}` },
            { label: city.name },
          ]}
        />

        {/* City Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-1">
                <MapPin className="w-4 h-4" />
                <span>{country.flag_emoji} {country.name} • Local Metropolitan Directory</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
                {city.name} Business Directory
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Explore authenticated commercial enterprises, medical facilities, legal consultancies, and consumer services located throughout {city.name}, {country.name}.
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
              Verified Businesses in {city.name} ({searchResult.total})
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
                  href={`/directories/${country.slug}/${other.slug}`}
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
