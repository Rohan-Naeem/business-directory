import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { BusinessCard } from '@/components/business/BusinessCard';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ArrowRight, Search, PlusCircle } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await DirectoryRepository.getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} Directory - Verified Businesses & Services`,
    description: `Discover verified ${category.name.toLowerCase()} companies, service providers, and top rated businesses across Pakistan, USA, and UK. ${category.description}`,
    alternates: {
      canonical: `https://nexusbiz.directory/categories/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Directory | NexusBiz`,
      description: category.description,
      url: `https://nexusbiz.directory/categories/${category.slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await DirectoryRepository.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [subcategories, searchResult] = await Promise.all([
    DirectoryRepository.getSubcategories(category.id),
    DirectoryRepository.searchBusinesses({ category: category.slug, limit: 12 }),
  ]);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Categories', href: '/categories' },
            { label: category.name },
          ]}
        />

        {/* Category Header Hero */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#065F46] flex items-center justify-center shrink-0 shadow-xs">
              <CategoryIcon name={category.icon} className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                Category Directory
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mt-1 mb-2">
                {category.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/search?category=${category.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search in {category.name}</span>
            </Link>

            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List Business Here</span>
            </Link>
          </div>
        </div>

        {/* Subcategories Filter Chips */}
        {subcategories.length > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">
              Specialties:
            </span>
            {subcategories.map((sub) => (
              <span
                key={sub.id}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
              >
                {sub.name}
              </span>
            ))}
          </div>
        )}

        {/* Listings Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#172B45]">
              Featured {category.name} Listings ({searchResult.total})
            </h2>
            <Link
              href={`/search?category=${category.slug}&sort=rating`}
              className="text-xs font-semibold text-[#065F46] hover:underline"
            >
              View highest rated &rarr;
            </Link>
          </div>

          {searchResult.businesses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResult.businesses.map((biz) => (
                <BusinessCard key={biz.id} business={biz} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">
                No published listings currently found in {category.name}.
              </p>
              <Link
                href="/add-business"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#10B981] hover:underline"
              >
                Be the first to add a listing in this category &rarr;
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
