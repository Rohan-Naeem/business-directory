import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { SearchPageClient } from '@/components/search/SearchPageClient';

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    country?: string;
    city?: string;
    sort?: 'featured' | 'rating' | 'reviews' | 'newest';
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = params.q ? `"${params.q}"` : '';
  const city = params.city ? `in ${params.city.replace(/-/g, ' ')}` : '';
  const country = params.country ? `(${params.country.toUpperCase()})` : '';

  const titleParts = ['Search Businesses', q, city, country].filter(Boolean);
  const title = titleParts.join(' ');

  return {
    title,
    description: `Search and find verified businesses, clinics, legal experts, and services ${city} ${country} on Global Bizz Hub Directory.`,
    robots: {
      // Prevent indexing of duplicate filtered query combinations
      index: !params.q && !params.sort,
      follow: true,
    },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const limit = 9;

  const [countries, categories, allCities, searchResult] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getCategories(),
    DirectoryRepository.getCities(),
    DirectoryRepository.searchBusinesses({
      q: params.q,
      category: params.category,
      country: params.country,
      city: params.city,
      sort: params.sort,
      page,
      limit,
    }),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center p-12 text-slate-400">Loading directory search...</div>}>
      <SearchPageClient
        initialBusinesses={searchResult.businesses}
        total={searchResult.total}
        currentPage={searchResult.page}
        totalPages={searchResult.totalPages}
        countries={countries}
        categories={categories}
        allCities={allCities}
        currentQuery={params.q || ''}
        currentCategory={params.category || ''}
        currentCountry={params.country || ''}
        currentCity={params.city || ''}
        currentSort={params.sort || 'featured'}
      />
    </Suspense>
  );
}
