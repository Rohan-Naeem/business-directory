'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Download, 
  CheckCircle2, 
  Globe2, 
  Building, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Country, Region, City } from '@/lib/types';
import { GEOGRAPHIC_DATA_PACKAGES } from '@/lib/data/geo-data';

interface AdminGeoImporterClientProps {
  countries: Country[];
  regions: Region[];
  cities: City[];
}

export const AdminGeoImporterClient: React.FC<AdminGeoImporterClientProps> = ({
  countries,
  regions,
  cities: initialCities,
}) => {
  const [cities, setCities] = useState<City[]>(initialCities);
  const [selectedCountrySlug, setSelectedCountrySlug] = useState('pakistan');
  const [importingRegion, setImportingRegion] = useState<string | null>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const activeCountry = countries.find(c => c.slug === selectedCountrySlug) || countries[0];
  const countryCities = cities.filter(c => c.country_id === activeCountry.id);
  const countryRegions = regions.filter(r => r.country_id === activeCountry.id);

  // Available packages for selected country
  const packages = GEOGRAPHIC_DATA_PACKAGES.filter(p => p.country_slug === activeCountry.slug);

  const runImport = async (regionSlug?: string) => {
    setImportingRegion(regionSlug || 'all');
    setImportMessage(null);

    try {
      const res = await fetch('/api/admin/import-geo', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region_slug: regionSlug }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');

      setImportMessage(data.message);
      
      // Refresh cities list
      const updated = await fetch('/api/businesses?limit=1').then(() => {
        // Trigger page refresh or local state update
        window.location.reload();
      });
    } catch (err: any) {
      alert(err.message || 'Import failed');
    } finally {
      setImportingRegion(null);
    }
  };

  return (
    <div className="space-y-8">
      {importMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-2xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-semibold">{importMessage}</span>
        </div>
      )}

      {/* Country Selection Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        {countries.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCountrySlug(c.slug)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
              selectedCountrySlug === c.slug
                ? 'bg-[#065F46] text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg">{c.flag_emoji}</span>
            <span>{c.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {cities.filter(item => item.country_id === c.id).length} Cities
            </span>
          </button>
        ))}
      </div>

      {/* Bulk Geographic Dataset Import Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#172B45] flex items-center gap-2">
              <Download className="w-5 h-5 text-[#10B981]" />
              Ready-to-Import Geographic Packages for {activeCountry.name}
            </h2>
            <p className="text-xs text-slate-500">
              Curated official administrative divisions and populated cities ready for instant ingestion.
            </p>
          </div>

          <button
            type="button"
            disabled={Boolean(importingRegion)}
            onClick={() => runImport()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${importingRegion ? 'animate-spin' : ''}`} />
            <span>{importingRegion ? 'Importing Dataset...' : `Import All ${activeCountry.name} Packages`}</span>
          </button>
        </div>

        {/* Packages Cards */}
        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.region_slug}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-slate-900">
                      {pkg.region_name}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {pkg.cities.length} Cities
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    Includes: {pkg.cities.map(c => c.name).join(', ')}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={importingRegion === pkg.region_slug}
                  onClick={() => runImport(pkg.region_slug)}
                  className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 text-[#065F46] font-bold text-xs border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{importingRegion === pkg.region_slug ? 'Ingesting...' : `Import ${pkg.region_name} Cities`}</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            All geographic packages for this country have been imported and synchronized!
          </div>
        )}
      </div>

      {/* Currently Ingested Cities Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#172B45] flex items-center gap-2">
            <Building className="w-4 h-4 text-[#10B981]" />
            Active Cities in {activeCountry.name} ({countryCities.length})
          </h3>
          <span className="text-xs text-slate-400">
            Database Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">City Name</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Postal Code</th>
                <th className="py-3 px-4">Popular Status</th>
                <th className="py-3 px-4 text-right">Registered Listings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {countryCities.map((city) => (
                <tr key={city.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {city.name}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {city.slug}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {city.postal_code || '—'}
                  </td>
                  <td className="py-3 px-4">
                    {city.is_popular ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Popular Metro
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Standard</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-700">
                    {city.business_count ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
