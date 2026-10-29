'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe2, MapPin, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Country, Region, City } from '@/lib/types';

interface CountryExplorerProps {
  countries: Country[];
  regions: Region[];
  cities: City[];
}

export const CountryExplorer: React.FC<CountryExplorerProps> = ({ countries, regions, cities }) => {
  const [activeCountrySlug, setActiveCountrySlug] = useState('pakistan');

  const activeCountry = countries.find(c => c.slug === activeCountrySlug) || countries[0];
  const countryRegions = regions.filter(r => r.country_id === activeCountry.id);
  const countryCities = cities.filter(c => c.country_id === activeCountry.id);
  const popularCities = countryCities.filter(c => c.is_popular);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
      {/* Country Selector Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-6 mb-8">
        {countries.map((cnt) => {
          const isActive = cnt.slug === activeCountrySlug;
          return (
            <button
              key={cnt.id}
              type="button"
              onClick={() => setActiveCountrySlug(cnt.slug)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#065F46] text-white shadow-md shadow-emerald-950/10 scale-102'
                  : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <span className="text-xl">{cnt.flag_emoji}</span>
              <span>{cnt.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {cnt.business_count ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Country Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Country Highlight Card */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-slate-50 p-6 rounded-2xl border border-emerald-100/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-[#172B45] mb-2">
              <span>{activeCountry.flag_emoji}</span>
              <span>{activeCountry.name} Directory</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Explore verified commercial listings, authorized agencies, hospitals, and local enterprises throughout {activeCountry.name}.
            </p>

            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>{countryRegions.length} Regions & Territories</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>{countryCities.length} Major Populated Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Verified phone numbers & office addresses</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Link
              href={`/directories/${activeCountry.slug}`}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Explore Complete {activeCountry.name} Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Popular Cities in Active Country */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#172B45] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#10B981]" />
                Popular Cities in {activeCountry.name}
              </h3>
              <Link 
                href={`/directories/${activeCountry.slug}`}
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                View all cities &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {popularCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/directories/${activeCountry.slug}/${city.slug}`}
                  className="group p-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-[#065F46] transition-colors">
                      {city.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {city.business_count ?? 0} listings
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#10B981] group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>

            {/* Regions / Provinces Pills */}
            <div className="border-t border-slate-100 pt-4">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Browse by Region / Province:
              </span>
              <div className="flex flex-wrap gap-2">
                {countryRegions.map((reg) => (
                  <Link
                    key={reg.id}
                    href={`/directories/${activeCountry.slug}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                  >
                    {reg.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
