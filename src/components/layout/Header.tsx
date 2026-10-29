'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  PlusCircle, 
  Globe2, 
  ShieldCheck, 
  Layers, 
  Building2,
  User,
  ArrowRight
} from 'lucide-react';
import { CategoryIcon } from '../ui/CategoryIcon';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [directoriesOpen, setDirectoriesOpen] = useState(false);

  const catDropdownRef = useRef<HTMLDivElement>(null);
  const dirDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setDirectoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (dirDropdownRef.current && !dirDropdownRef.current.contains(event.target as Node)) {
        setDirectoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredCategories = [
    { name: 'IT & Software', slug: 'it-software', icon: 'Laptop', desc: 'Custom software & cloud' },
    { name: 'Healthcare & Medical', slug: 'healthcare', icon: 'Stethoscope', desc: 'Clinics & hospitals' },
    { name: 'Banking & Finance', slug: 'banking-finance', icon: 'Building2', desc: 'Banks & accounting' },
    { name: 'Construction & Real Estate', slug: 'construction-real-estate', icon: 'HardHat', desc: 'Developers & agencies' },
    { name: 'Restaurants & Dining', slug: 'restaurants-food', icon: 'UtensilsCrossed', desc: 'Fine dining & cafes' },
    { name: 'Legal Services', slug: 'legal-services', icon: 'Scale', desc: 'Corporate & immigration' },
  ];

  const countries = [
    { 
      name: 'Pakistan', 
      slug: 'pakistan', 
      flag: '🇵🇰', 
      cities: ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Rawalpindi'] 
    },
    { 
      name: 'United States', 
      slug: 'usa', 
      flag: '🇺🇸', 
      cities: ['New York City', 'San Francisco', 'Los Angeles', 'Austin', 'Chicago'] 
    },
    { 
      name: 'United Kingdom', 
      slug: 'uk', 
      flag: '🇬🇧', 
      cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'] 
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-950/10 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-[#172B45] flex items-center gap-1.5">
                Nexus<span className="text-[#10B981]">Biz</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Global Business Directory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 ${pathname === '/' ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
            >
              Home
            </Link>

            {/* Categories Mega Dropdown */}
            <div className="relative" ref={catDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setCategoriesOpen(!categoriesOpen);
                  setDirectoriesOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 cursor-pointer ${categoriesOpen || pathname.startsWith('/categories') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-[540px] mt-2 p-5 bg-white rounded-2xl shadow-xl border border-slate-200 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="col-span-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular Industries</span>
                    <Link href="/categories" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
                      View all categories <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {featuredCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#065F46] flex items-center justify-center shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                        <CategoryIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#172B45] group-hover:text-[#065F46] transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cat.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Directories Dropdown */}
            <div className="relative" ref={dirDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setDirectoriesOpen(!directoriesOpen);
                  setCategoriesOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 cursor-pointer ${directoriesOpen || pathname.startsWith('/directories') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
                aria-expanded={directoriesOpen}
              >
                <Globe2 className="w-4 h-4 text-[#10B981]" />
                <span>Directories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${directoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {directoriesOpen && (
                <div className="absolute top-full left-0 w-[420px] mt-2 p-5 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Supported Countries</span>
                    <Link href="/directories" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
                      Browse all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {countries.map((cnt) => (
                    <div key={cnt.slug} className="p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Link 
                          href={`/directories/${cnt.slug}`}
                          className="flex items-center gap-2 font-bold text-slate-900 hover:text-[#065F46]"
                        >
                          <span className="text-xl">{cnt.flag}</span>
                          <span>{cnt.name}</span>
                        </Link>
                        <Link 
                          href={`/directories/${cnt.slug}`} 
                          className="text-xs font-semibold text-[#065F46] hover:underline"
                        >
                          View Country
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cnt.cities.map(city => {
                          const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <Link
                              key={city}
                              href={`/directories/${cnt.slug}/${citySlug}`}
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 transition-colors font-medium"
                            >
                              {city}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/search" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 ${pathname.startsWith('/search') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search</span>
            </Link>

            <Link 
              href="/admin" 
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-slate-500 hover:text-[#065F46] hover:bg-slate-50 ${pathname.startsWith('/admin') ? 'text-[#065F46] font-semibold' : ''}`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#065F46] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-900/10 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Business</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/add-business"
              className="inline-flex items-center gap-1 bg-[#10B981] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${pathname === '/' ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-800'}`}
            >
              Home
            </Link>
            
            <Link
              href="/search"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold ${pathname.startsWith('/search') ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-800'}`}
            >
              <Search className="w-5 h-5 text-slate-400" />
              Search Directory
            </Link>

            <Link
              href="/categories"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800"
            >
              <Layers className="w-5 h-5 text-slate-400" />
              All Categories
            </Link>

            <Link
              href="/directories"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800"
            >
              <Globe2 className="w-5 h-5 text-slate-400" />
              Country Directories
            </Link>

            {/* Mobile Country List */}
            <div className="pl-4 py-2 space-y-2 border-l-2 border-slate-100 ml-3">
              {countries.map((cnt) => (
                <div key={cnt.slug} className="space-y-1">
                  <Link
                    href={`/directories/${cnt.slug}`}
                    className="flex items-center gap-2 text-sm font-bold text-slate-900"
                  >
                    <span>{cnt.flag}</span>
                    <span>{cnt.name}</span>
                  </Link>
                  <div className="flex flex-wrap gap-1 pl-6">
                    {cnt.cities.slice(0, 3).map(city => (
                      <Link
                        key={city}
                        href={`/directories/${cnt.slug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700"
            >
              <ShieldCheck className="w-5 h-5 text-slate-400" />
              Admin Portal
            </Link>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/add-business"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] transition-colors shadow-xs"
            >
              Submit Your Business Listing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
