import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ArrowRight, Layers } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All Business Categories & Industry Sectors',
  description: 'Browse commercial directories by sector: IT, healthcare, banking, legal, construction, restaurants, and professional services across Pakistan, USA, and UK.',
};

export const revalidate = 60;

export default async function CategoriesOverviewPage() {
  const [categories, subcategories] = await Promise.all([
    DirectoryRepository.getCategories(),
    DirectoryRepository.getSubcategories(),
  ]);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Categories' }]} />

        {/* Header Title Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2">
            <Layers className="w-4 h-4" />
            <span>Directory Taxonomy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-3">
            Explore All Business Categories
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Discover verified companies, certified clinics, law chambers, and industrial manufacturers organized across {categories.length} industry sectors.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catSubs = subcategories.filter(s => s.category_id === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#065F46] flex items-center justify-center shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors shadow-xs">
                      <CategoryIcon name={cat.icon} className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {cat.business_count ?? 0} Listings
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#172B45] group-hover:text-[#065F46] transition-colors mb-2">
                    <Link href={`/categories/${cat.slug}`}>
                      {cat.name}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  {catSubs.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {catSubs.map((sub) => (
                          <span
                            key={sub.id}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 font-medium border border-slate-100"
                          >
                            {sub.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href={`/categories/${cat.slug}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#065F46] font-semibold text-xs border border-slate-200/80 hover:border-emerald-300 transition-all group-hover:bg-[#065F46] group-hover:text-white group-hover:border-[#065F46]"
                >
                  <span>Browse {cat.name} Directory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
