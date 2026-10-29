'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Layers, Globe2, ArrowRight } from 'lucide-react';
import { Country, City, Category } from '@/lib/types';

interface HeroSearchProps {
  countries: Country[];
  categories: Category[];
  initialCities: City[];
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ countries, categories, initialCities }) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('pakistan'); // Default to PK or first country
  const [selectedCity, setSelectedCity] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Update cities when selectedCountry changes
  useEffect(() => {
    if (!selectedCountry || selectedCountry === 'all') {
      setFilteredCities(initialCities);
    } else {
      const countryObj = countries.find(c => c.slug === selectedCountry);
      if (countryObj) {
        setFilteredCities(initialCities.filter(c => c.country_id === countryObj.id));
      } else {
        setFilteredCities(initialCities);
      }
    }
    setSelectedCity('');
  }, [selectedCountry, countries, initialCities]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedCountry && selectedCountry !== 'all') params.set('country', selectedCountry);
    if (selectedCity && selectedCity !== 'all') params.set('city', selectedCity);

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form 
        onSubmit={handleSearchSubmit}
        className="bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-center gap-3"
      >
        {/* Keyword Input */}
        <div className="w-full md:w-2/5 flex items-center gap-2.5 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label htmlFor="hero-keyword" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Business or Service
            </label>
            <input
              id="hero-keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Systems Limited, Dentist, Law Firm..."
              className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-1/4 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
          <Layers className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label htmlFor="hero-category" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              id="hero-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Country Selector */}
        <div className="w-full md:w-1/4 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
          <Globe2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <div className="flex-1">
            <label htmlFor="hero-country" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Country
            </label>
            <select
              id="hero-country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {countries.map((cnt) => (
                <option key={cnt.id} value={cnt.slug}>
                  {cnt.flag_emoji} {cnt.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic City Selector */}
        <div className="w-full md:w-1/4 flex items-center gap-2 px-3 py-2 bg-slate-50/80 rounded-2xl border border-slate-200/60 focus-within:border-emerald-500 focus-within:bg-white transition-all">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="flex-1">
            <label htmlFor="hero-city" className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              City
            </label>
            <select
              id="hero-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="">All Cities</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:w-auto px-6 py-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          <span>Search</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Popular Quick Filter Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-400">Popular Searches:</span>
        <button
          type="button"
          onClick={() => { setSelectedCategory('it-software'); router.push('/search?category=it-software'); }}
          className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-[#065F46] border border-slate-200/80 transition-colors cursor-pointer"
        >
          Software Houses
        </button>
        <button
          type="button"
          onClick={() => { setSelectedCategory('healthcare'); router.push('/search?category=healthcare'); }}
          className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-[#065F46] border border-slate-200/80 transition-colors cursor-pointer"
        >
          Hospitals & Clinics
        </button>
        <button
          type="button"
          onClick={() => { router.push('/search?country=pakistan&city=lahore'); }}
          className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-[#065F46] border border-slate-200/80 transition-colors cursor-pointer"
        >
          🇵🇰 Lahore Businesses
        </button>
        <button
          type="button"
          onClick={() => { router.push('/search?country=usa&city=new-york-city'); }}
          className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-[#065F46] border border-slate-200/80 transition-colors cursor-pointer"
        >
          🇺🇸 NYC Businesses
        </button>
        <button
          type="button"
          onClick={() => { router.push('/search?country=uk&city=london'); }}
          className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-emerald-50 text-slate-600 hover:text-[#065F46] border border-slate-200/80 transition-colors cursor-pointer"
        >
          🇬🇧 London Firms
        </button>
      </div>
    </div>
  );
};
