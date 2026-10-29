'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Layers, 
  Globe2, 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Country, City, Category, Business } from '@/lib/types';
import { BusinessCard } from '@/components/business/BusinessCard';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface SearchPageClientProps {
  initialBusinesses: Business[];
  total: number;
  currentPage: number;
  totalPages: number;
  countries: Country[];
  categories: Category[];
  allCities: City[];
  currentQuery: string;
  currentCategory: string;
  currentCountry: string;
  currentCity: string;
  currentSort: string;
}

export const SearchPageClient: React.FC<SearchPageClientProps> = ({
  initialBusinesses,
  total,
  currentPage,
  totalPages,
  countries,
  categories,
  allCities,
  currentQuery,
  currentCategory,
  currentCountry,
  currentCity,
  currentSort,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(currentQuery);
  const [selectedCategory, setSelectedCategory] = useState(currentCategory);
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [selectedSort, setSelectedSort] = useState(currentSort || 'featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter cities by selected country
  const [availableCities, setAvailableCities] = useState<City[]>(allCities);

  useEffect(() => {
    if (!selectedCountry || selectedCountry === 'all') {
      setAvailableCities(allCities);
    } else {
      const countryObj = countries.find(c => c.slug === selectedCountry);
      if (countryObj) {
        setAvailableCities(allCities.filter(c => c.country_id === countryObj.id));
      } else {
        setAvailableCities(allCities);
      }
    }
  }, [selectedCountry, countries, allCities]);

  // Push new params to URL
  const applyFilters = (overrides?: {
    q?: string;
    category?: string;
    country?: string;
    city?: string;
    sort?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    const queryVal = overrides?.q !== undefined ? overrides.q : q;
    const catVal = overrides?.category !== undefined ? overrides.category : selectedCategory;
    const countryVal = overrides?.country !== undefined ? overrides.country : selectedCountry;
    const cityVal = overrides?.city !== undefined ? overrides.city : selectedCity;
    const sortVal = overrides?.sort !== undefined ? overrides.sort : selectedSort;
    const pageVal = overrides?.page !== undefined ? overrides.page : 1;

    if (queryVal.trim()) params.set('q', queryVal.trim());
    if (catVal && catVal !== 'all') params.set('category', catVal);
    if (countryVal && countryVal !== 'all') params.set('country', countryVal);
    if (cityVal && cityVal !== 'all') params.set('city', cityVal);
    if (sortVal && sortVal !== 'featured') params.set('sort', sortVal);
    if (pageVal > 1) params.set('page', pageVal.toString());

    router.push(`/search?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ page: 1 });
    setMobileFiltersOpen(false);
  };

  const handleCountryChange = (newCountry: string) => {
    setSelectedCountry(newCountry);
    setSelectedCity('');
    applyFilters({ country: newCountry, city: '', page: 1 });
  };

  const clearAllFilters = () => {
    setQ('');
    setSelectedCategory('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedSort('featured');
    router.push('/search');
    setMobileFiltersOpen(false);
  };

  const hasActiveFilters = Boolean(q || selectedCategory || selectedCountry || selectedCity);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Header */}
        <div className="mb-4">
          <Breadcrumbs
            items={[
              { label: 'Directory Search', href: '/search' },
              ...(selectedCountry ? [{ label: selectedCountry.toUpperCase() }] : []),
              ...(selectedCity ? [{ label: selectedCity }] : []),
            ]}
          />
        </div>

        {/* Top Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-full md:flex-1 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search business name, service, or keyword..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-hidden focus:border-[#10B981] focus:bg-white transition-all"
              />
              {q && (
                <button
                  type="button"
                  onClick={() => { setQ(''); applyFilters({ q: '' }); }}
                  className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Update Results</span>
            </button>

            {/* Mobile Filter Drawer Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="w-full md:hidden py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#10B981]" />
              <span>Filter Options ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>
          </form>

          {/* Active Filters Badges */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Active Filters:</span>
              {q && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#065F46] font-medium border border-emerald-200">
                  Keyword: "{q}"
                  <button type="button" onClick={() => { setQ(''); applyFilters({ q: '' }); }}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedCountry && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#065F46] font-medium border border-emerald-200">
                  Country: {selectedCountry}
                  <button type="button" onClick={() => handleCountryChange('')}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedCity && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#065F46] font-medium border border-emerald-200">
                  City: {selectedCity}
                  <button type="button" onClick={() => { setSelectedCity(''); applyFilters({ city: '' }); }}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#065F46] font-medium border border-emerald-200">
                  Category: {selectedCategory}
                  <button type="button" onClick={() => { setSelectedCategory(''); applyFilters({ category: '' }); }}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline ml-1 cursor-pointer"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-[#172B45] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#10B981]" />
                  Filter Directory
                </h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-xs text-slate-400 hover:text-rose-600 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Country
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleCountryChange('')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      !selectedCountry ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Countries</span>
                  </button>
                  {countries.map((cnt) => (
                    <button
                      key={cnt.id}
                      type="button"
                      onClick={() => handleCountryChange(cnt.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCountry === cnt.slug ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cnt.flag_emoji}</span>
                        <span>{cnt.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  City Location
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    applyFilters({ city: e.target.value, page: 1 });
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#10B981] focus:bg-white cursor-pointer"
                >
                  <option value="">All Cities in Selection</option>
                  {availableCities.map((city) => (
                    <option key={city.id} value={city.slug}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Industry Category
                </label>
                <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('');
                      applyFilters({ category: '', page: 1 });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      !selectedCategory ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>All Industries</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        applyFilters({ category: cat.slug, page: 1 });
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal ml-1">
                        {cat.business_count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Search Results Area */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Header / Sort Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-[#172B45]">
                  {total} {total === 1 ? 'Business Found' : 'Businesses Found'}
                </h1>
                <p className="text-xs text-slate-500">
                  Showing page {currentPage} of {totalPages}
                </p>
              </div>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 shrink-0">Sort By:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    applyFilters({ sort: e.target.value, page: 1 });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-[#10B981] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviewed</option>
                  <option value="newest">Newly Listed</option>
                </select>
              </div>
            </div>

            {/* Results Grid or Empty State */}
            {initialBusinesses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialBusinesses.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center max-w-xl mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-[#172B45]">
                  No matching businesses found
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We couldn't find listings matching your exact combination. Try broadening your keywords, selecting "All Categories", or checking another city.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#065F46] text-white text-xs font-bold hover:bg-[#044E39] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Search Filters
                  </button>
                </div>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => applyFilters({ page: currentPage - 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-xs flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-bold">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => applyFilters({ page: p })}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        p === currentPage
                          ? 'bg-[#065F46] text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => applyFilters({ page: currentPage + 1 })}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 font-semibold text-xs flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-over Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs" 
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-[#172B45]">
                  Filter Directory
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Mobile City */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="">All Cities</option>
                  {availableCities.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="w-full py-3 rounded-xl bg-[#10B981] text-white font-bold text-sm shadow-xs"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
