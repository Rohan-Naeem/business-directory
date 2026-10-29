import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { Globe2, MapPin, ArrowRight, Building2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Country & City Business Directories | Pakistan, USA, UK',
  description: 'Explore comprehensive business directories for Pakistan, the United States, and the United Kingdom. Discover trusted local companies across major metropolitan regions.',
};

export const revalidate = 60;

export default async function DirectoriesOverviewPage() {
  const [countries, regions, cities] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getRegions(),
    DirectoryRepository.getCities(),
  ]);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Directories' }]} />

        {/* Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
            <Globe2 className="w-4 h-4" />
            <span>Geographic Directories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-3">
            Browse by Country & City
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Global Bizz Hub currently provides curated commercial coverage across Pakistan, the United States, and the United Kingdom, spanning over {cities.length} populated cities.
          </p>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {countries.map((country) => {
            const countryRegions = regions.filter(r => r.country_id === country.id);
            const countryCities = cities.filter(c => c.country_id === country.id);
            const popularCities = countryCities.filter(c => c.is_popular);

            return (
              <div
                key={country.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{country.flag_emoji}</span>
                      <div>
                        <h2 className="text-xl font-bold text-[#172B45]">
                          {country.name}
                        </h2>
                        <span className="text-xs text-slate-400 font-semibold">
                          ISO: {country.code} • Currency: {country.currency}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-[#065F46]">
                      {country.business_count ?? 0} Listings
                    </span>
                  </div>

                  {/* Popular Cities */}
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                      Key Metros & Cities:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {popularCities.map((city) => (
                        <Link
                          key={city.id}
                          href={`/directories/${country.slug}/${city.slug}`}
                          className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-[#065F46] text-slate-700 font-medium border border-slate-200/70 transition-colors"
                        >
                          {city.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Regions overview */}
                  <div className="mb-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Regions / Provinces:
                    </span>
                    <p className="text-xs text-slate-600">
                      {countryRegions.map(r => r.name).join(', ')}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/directories/${country.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold transition-colors"
                >
                  <span>Enter {country.name} Directory</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
