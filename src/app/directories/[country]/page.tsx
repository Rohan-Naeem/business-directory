import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BusinessCard } from '@/components/business/BusinessCard';
import { MapPin, Globe2, Search, ArrowRight, ShieldCheck } from 'lucide-react';

interface CountryPageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: countrySlug } = await params;
  const country = await DirectoryRepository.getCountryBySlug(countrySlug);

  if (!country) {
    return { title: 'Country Directory Not Found' };
  }

  return {
    title: `${country.name} Business Directory - Verified Companies & Cities`,
    description: `Browse verified business listings, healthcare centers, law offices, and software providers in ${country.name}. Discover top companies in major ${country.name} metropolitan areas.`,
    alternates: {
      canonical: `https://nexusbiz.directory/directories/${country.slug}`,
    },
    openGraph: {
      title: `${country.name} Business Directory | Global Bizz Hub`,
      description: `Explore verified businesses across ${country.name}.`,
      url: `https://nexusbiz.directory/directories/${country.slug}`,
    },
  };
}

export default async function CountryDirectoryPage({ params }: CountryPageProps) {
  const { country: countrySlug } = await params;
  const country = await DirectoryRepository.getCountryBySlug(countrySlug);

  if (!country) {
    notFound();
  }

  const [regions, cities, searchResult] = await Promise.all([
    DirectoryRepository.getRegions(country.id),
    DirectoryRepository.getCities({ countryId: country.id }),
    DirectoryRepository.searchBusinesses({ country: country.slug, limit: 9 }),
  ]);

  const popularCities = cities.filter(c => c.is_popular);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Directories', href: '/directories' },
            { label: country.name },
          ]}
        />

        {/* Country Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl sm:text-5xl shrink-0">{country.flag_emoji}</span>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>National Commercial Directory</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
                  {country.name} Business Directory
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  Discover verified commercial entities, industrial facilities, medical clinics, legal advocates, and technical enterprises across {regions.length} regions and {cities.length} cities in {country.name}.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/search?country=${country.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Search className="w-4 h-4 text-[#10B981]" />
                <span>Search in {country.name}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Cities Section */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs mb-10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <h2 className="font-bold text-base text-[#172B45] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#10B981]" />
              Major Cities in {country.name}
            </h2>
            <span className="text-xs text-slate-400 font-semibold">
              {cities.length} Cities Covered
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/directories/${country.slug}/${city.slug}`}
                className="p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/40 text-center transition-all group"
              >
                <div className="text-sm font-bold text-slate-800 group-hover:text-[#065F46] transition-colors truncate">
                  {city.name}
                </div>
                <div className="text-[11px] text-slate-400">
                  {city.business_count ?? 0} listings
                </div>
              </Link>
            ))}
          </div>

          {/* Region list */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Regions & Provinces:
            </span>
            {regions.map((reg) => (
              <span
                key={reg.id}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
              >
                {reg.name}
              </span>
            ))}
          </div>
        </div>

        {/* Businesses in this Country */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#172B45]">
              Featured Businesses in {country.name} ({searchResult.total})
            </h2>
            <Link
              href={`/search?country=${country.slug}`}
              className="text-xs font-semibold text-[#065F46] hover:underline"
            >
              View all {country.name} listings &rarr;
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
                No published businesses in {country.name} yet.
              </p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#10B981] hover:underline"
              >
                Add the first {country.name} listing &rarr;
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
