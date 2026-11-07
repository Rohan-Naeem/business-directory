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
        '@id': 'https://globalbizzhub.vercel.app/#website',
        url: 'https://globalbizzhub.vercel.app',
        name: 'Global Bizz Hub Business Directory',
        description: 'Comprehensive Multi-Country Business Directory for Pakistan, USA, and UK.',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://globalbizzhub.vercel.app/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://globalbizzhub.vercel.app/#organization',
        name: 'Global Bizz Hub',
        url: 'https://globalbizzhub.vercel.app',
        logo: 'https://globalbizzhub.vercel.app/logo.svg',
        sameAs: [],
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a free business directory?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A free business directory is a searchable list of real businesses by city and category. On Global Bizz Hub you can find local businesses in Pakistan, USA and UK, see their contact details and reviews, and business owners can list their business free.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is listing my business on Global Bizz Hub free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Standard business listing submissions on Global Bizz Hub are 100% free. Once you submit your details through our multi-step form, our editorial moderation team reviews the information before publishing it live on the directory.',
        },
      },
      {
        '@type': 'Question',
        name: 'What makes Global Bizz Hub different from other business directories?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Listing and searching are free, and one directory covers Pakistan, USA and UK instead of one country only. Every listing is checked before it goes live, and business profiles show contact details and reviews so you can reach the business directly.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find local businesses near me?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Choose your country, then your city, then a category, or search by service name. For example, search for a hospital in Karachi, a restaurant in London, or a software company in Lahore, and you will see only businesses listed for that city.',
        },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
            Global Bizz Hub: <span className="text-[#065F46]">Free Business Directory</span> for Pakistan, USA &amp; UK
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

      {/* SECTION: WHAT IS GLOBAL BIZZ HUB - inspired by competitor structure, original wording */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mb-2">
              What is Global Bizz Hub?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Global Bizz Hub is a free, multi-country business directory. It helps people find a
              real business near them, and helps businesses get found online, win more customers,
              and grow faster, without paying to be listed.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-base font-bold text-[#172B45] mb-2">Search &amp; Discover</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Search by business name, service, or keyword, then open a full profile with contact details and reviews.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-base font-bold text-[#172B45] mb-2">Browse by Location</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Browse by country and city, so you only see businesses that actually serve your area.</p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
              <h3 className="text-base font-bold text-[#172B45] mb-2">Free Listings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Listing a business is free, with no hidden cost. Every submission is checked before it goes live.</p>
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
                Our Top Listings
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
              Discover Businesses in Top Cities
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

          {/* Top cities as headings, linking to real city directories */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {[
              { name: 'Karachi', href: '/directories/pakistan/karachi' },
              { name: 'Lahore', href: '/directories/pakistan/lahore' },
              { name: 'Islamabad', href: '/directories/pakistan/islamabad' },
              { name: 'Rawalpindi', href: '/directories/pakistan/rawalpindi' },
              { name: 'Faisalabad', href: '/directories/pakistan/faisalabad' },
              { name: 'Multan', href: '/directories/pakistan/multan' },
              { name: 'London', href: '/directories/uk/london' },
              { name: 'New York City', href: '/directories/usa/new-york-city' },
            ].map((city) => (
              <Link key={city.href} href={city.href} className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <h3 className="text-sm font-bold text-[#172B45]">{city.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: POPULAR SEARCHES - real filtered search pages, no new URLs */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight mb-2">
              Popular Searches
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              The searches people run most on Global Bizz Hub, by city and category.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Restaurants in Karachi', href: '/search?country=pakistan&city=karachi&category=restaurants-food' },
              { label: 'Software companies in Lahore', href: '/search?country=pakistan&city=lahore&category=it-software' },
              { label: 'Hospitals in Lahore', href: '/search?country=pakistan&city=lahore&category=healthcare' },
              { label: 'Software companies in Karachi', href: '/search?country=pakistan&city=karachi&category=it-software' },
              { label: 'Hotels in London', href: '/search?country=uk&city=london&category=hotels-travel' },
              { label: 'Restaurants in London', href: '/search?country=uk&city=london&category=restaurants-food' },
              { label: 'Restaurants in Lahore', href: '/search?country=pakistan&city=lahore&category=restaurants-food' },
              { label: 'Hospitals in Karachi', href: '/search?country=pakistan&city=karachi&category=healthcare' },
              { label: 'Hotels in Karachi', href: '/search?country=pakistan&city=karachi&category=hotels-travel' },
              { label: 'List your business free', href: '/add-business' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
                <h3 className="text-sm font-bold text-[#172B45]">{item.label}</h3>
              </Link>
            ))}
          </div>
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

