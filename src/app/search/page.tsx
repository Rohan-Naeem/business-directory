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
  const [category, country, city] = await Promise.all([
    params.category ? DirectoryRepository.getCategoryBySlug(params.category) : Promise.resolve(null),
    params.country ? DirectoryRepository.getCountryBySlug(params.country) : Promise.resolve(null),
    params.country && params.city
      ? DirectoryRepository.getCityBySlug(params.country, params.city)
      : Promise.resolve(null),
  ]);

  const catName = category?.name;
  const cityName = city?.name;
  const countryName = country?.name;
  let title: string;
  let description: string;
  if (catName && cityName && countryName) {
    title = `${catName} in ${cityName}, ${countryName}`;
    description = `Find ${catName.toLowerCase()} in ${cityName}, ${countryName}. Browse verified listings with phone numbers, reviews and hours, and list your business free.`;
  } else if (catName && countryName) {
    title = `${catName} in ${countryName}`;
    description = `Find verified ${catName.toLowerCase()} in ${countryName}. Browse by city, compare listings, and list your business free.`;
  } else if (catName) {
    title = `${catName} in Pakistan, USA & UK`;
    description = `Find verified ${catName.toLowerCase()} in Pakistan, USA and UK. Browse by city, compare listings, and list your business free.`;
  } else if (cityName && countryName) {
    title = `Businesses in ${cityName}, ${countryName} - Find Local Businesses`;
    description = `Find local businesses in ${cityName}, ${countryName}. Browse by category, compare listings, and list your business free.`;
  } else if (countryName) {
    title = `${countryName} Business Directory - Find Local Businesses`;
    description = `Find verified businesses in ${countryName}. Browse by city and category, compare listings, and list your business free.`;
  } else if (params.q) {
    title = `Search Businesses "${params.q}"`;
    description = `Search and find verified businesses for "${params.q}" on Global Bizz Hub Directory.`;
  } else {
    title = 'Search Businesses';
    description = 'Search and find verified businesses, clinics, legal experts, and services on Global Bizz Hub Directory.';
  }

  return {
    title,
    description,
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
