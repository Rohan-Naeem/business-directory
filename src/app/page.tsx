import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  PlusCircle, 
  Globe2, 
  Star, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';
import { DirectoryRepository } from '@/lib/data/repository';
import { HeroSearch } from '@/components/search/HeroSearch';
import { BusinessCard } from '@/components/business/BusinessCard';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { CountryExplorer } from '@/components/home/CountryExplorer';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AddBusinessCTA } from '@/components/home/AddBusinessCTA';
import { FaqAccordion } from '@/components/home/FaqAccordion';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [countries, categories, cities, regions, featuredBusinesses] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getCategories(),
    DirectoryRepository.getCities(),
    DirectoryRepository.getRegions(),
    DirectoryRepository.getFeaturedBusinesses(6),
  ]);

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://nexusbiz.directory/#website',
        url: 'https://nexusbiz.directory',
        name: 'Global Bizz Hub Business Directory',
        description: 'Comprehensive Multi-Country Business Directory for Pakistan, USA, and UK.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://nexusbiz.directory/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://nexusbiz.directory/#organization',
        name: 'Global Bizz Hub',
        url: 'https://nexusbiz.directory',
        logo: 'https://nexusbiz.directory/logo.svg',
        sameAs: [],
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* SECTION A: HERO */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-white overflow-hidden border-b border-slate-100">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-200/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-emerald-200/70 text-xs font-semibold text-[#065F46] mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>Verified International Directory • PK, US, UK</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#172B45] tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none mb-6">
            Discover <span className="text-[#065F46]">Trusted Businesses</span> Across Major Global Cities
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Find vetted software houses, hospitals, law advocates, financial consultants, and commercial services with genuine reviews, hours, and direct contact details.
          </p>

          {/* Hero Search Box */}
          <div className="mb-8">
            <HeroSearch 
              countries={countries} 
              categories={categories} 
              initialCities={cities} 
            />
          </div>

          {/* Secondary Hero Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044E39] text-white text-xs sm:text-sm font-bold px-5 py-3 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-[#10B981]" />
              <span>Add Your Business Free</span>
            </Link>

            <Link
              href="/directories"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-xs transition-all"
            >
              <Globe2 className="w-4 h-4 text-slate-500" />
              <span>Browse All Directories</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-black text-[#172B45]">3</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Countries Active</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#172B45]">{cities.length}+</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Populated Cities</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#172B45]">{categories.length}</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Industries Covered</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#10B981]">100%</div>
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Editorial Moderated</div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION B: TOP LISTINGS */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Featured Selections</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
                Top Rated Business Listings
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Verified establishments known for exceptional service quality and client satisfaction.
              </p>
            </div>

            <Link
              href="/search?sort=featured"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#065F46] hover:text-[#10B981] transition-colors"
            >
              <span>Explore all listings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBusinesses.map((biz) => (
              <BusinessCard key={biz.id} business={biz} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION C: BROWSE BY CATEGORY */}
      <section className="py-16 md:py-24 bg-[#F7F9FC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Industry Sectors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
              Browse Businesses by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select an industry to find specialized service providers, legal counsel, medical clinics, and manufacturers.
            </p>
          </div>

          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* SECTION D: DISCOVER BY COUNTRY AND CITY */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Geographic Coverage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
              Discover Businesses by Country & City
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse localized directories tailored for Pakistan, the United States, and the United Kingdom.
            </p>
          </div>

          <CountryExplorer 
            countries={countries} 
            regions={regions} 
            cities={cities} 
          />
        </div>
      </section>

      {/* SECTION E: HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-[#F7F9FC] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
              How Global Bizz Hub Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A streamlined experience for customers looking for quality services and business owners seeking visibility.
            </p>
          </div>

          <HowItWorks />
        </div>
      </section>

      {/* SECTION F: ADD YOUR BUSINESS CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AddBusinessCTA />
        </div>
      </section>

      {/* SECTION G: FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 md:py-24 bg-[#F7F9FC] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Everything you need to know about searching, verification, and listing your business on Global Bizz Hub.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

    </div>
  );
}

