import React from 'react';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { AddBusinessForm } from '@/components/business/AddBusinessForm';
import { PlusCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'List Your Business Free | Free Business Listing | Global Bizz Hub',
  description: 'Get a free business listing on Global Bizz Hub. List your business free in Pakistan, USA or UK, reach customers searching for local businesses, and get found online.'
};

export default async function AddBusinessPage() {
  const [countries, regions, cities, categories, subcategories] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getRegions(),
    DirectoryRepository.getCities(),
    DirectoryRepository.getCategories(),
    DirectoryRepository.getSubcategories(),
  ]);

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Add Business' }]} />

        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#065F46] text-xs font-bold mb-3 border border-emerald-200">
            <PlusCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Standard Submission is 100% Free</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
            List Your Business Free
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Get a free business listing in minutes. Fill out the verified company details below, and our editorial team will review your listing before publishing it on the Global Bizz Hub directory.
          </p>
        </div>

        {/* Wizard Component */}
        <AddBusinessForm
          countries={countries}
          regions={regions}
          cities={cities}
          categories={categories}
          subcategories={subcategories}
        />

      </div>
    </div>
  );
}
