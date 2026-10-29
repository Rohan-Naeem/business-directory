import React from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { CategoryIcon } from '../ui/CategoryIcon';
import { ArrowUpRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/categories/${cat.slug}`}
          className="group bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Subtle hover accent light */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#10B981] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />

          {/* Icon Box */}
          <div className="w-14 h-14 rounded-2xl bg-emerald-50/70 text-[#065F46] flex items-center justify-center mb-3 group-hover:bg-[#10B981] group-hover:text-white transition-colors duration-200 shadow-xs">
            <CategoryIcon name={cat.icon} className="w-7 h-7" />
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#172B45] group-hover:text-[#065F46] transition-colors leading-tight mb-1">
            {cat.name}
          </h3>

          {/* Business count */}
          <span className="text-[11px] font-semibold text-slate-400 group-hover:text-emerald-600 transition-colors">
            {cat.business_count ?? 0} {cat.business_count === 1 ? 'Listing' : 'Listings'}
          </span>

          {/* Subtle icon corner indicator */}
          <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </div>
        </Link>
      ))}
    </div>
  );
};
