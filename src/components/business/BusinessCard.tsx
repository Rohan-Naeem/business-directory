import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Star, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  ExternalLink 
} from 'lucide-react';
import { Business } from '@/lib/types';
import { checkBusinessOpenStatus, truncateText } from '@/lib/utils';
import { CategoryIcon } from '../ui/CategoryIcon';

interface BusinessCardProps {
  business: Business;
  priorityImage?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, priorityImage = false }) => {
  const openStatus = checkBusinessOpenStatus(business.hours);
  const countryFlag = business.country?.flag_emoji || '🌐';

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-emerald-200 transition-all duration-200 flex flex-col overflow-hidden">
      {/* Cover Image & Badges */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        {business.cover_image_url ? (
          <img
            src={business.cover_image_url}
            alt={`${business.name} preview`}
            loading={priorityImage ? 'eager' : 'lazy'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-slate-100 to-emerald-50/50 flex items-center justify-center text-slate-300">
            <CategoryIcon name={business.category?.icon || 'Building2'} className="w-12 h-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {business.is_featured ? (
            <span className="inline-flex items-center gap-1 bg-[#FBBF24] text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
              <Star className="w-3.5 h-3.5 fill-slate-900" />
              Featured
            </span>
          ) : (
            <div />
          )}

          {/* Real-time open/closed indicator */}
          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-md ${
            openStatus.isOpen 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-slate-900/80 text-slate-200'
          }`}>
            <Clock className="w-3 h-3" />
            {openStatus.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        {/* Category Pill Over Cover */}
        {business.category && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center gap-1.5 bg-white/95 text-[#065F46] text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs">
              <CategoryIcon name={business.category.icon} className="w-3.5 h-3.5 text-[#10B981]" />
              {business.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Verified Badge */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-bold text-lg text-[#172B45] group-hover:text-[#065F46] transition-colors line-clamp-1">
            <Link href={`/business/${business.slug}`}>
              {business.name}
            </Link>
          </h3>
          {business.is_verified && (
            <span className="shrink-0 text-emerald-600" title="Verified Business">
              <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="ml-1 text-xs font-bold text-slate-800">
              {business.rating > 0 ? business.rating.toFixed(1) : 'New'}
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs text-slate-500">
            {business.review_count > 0 ? `${business.review_count} reviews` : 'No reviews yet'}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 flex-1">
          {business.short_description || truncateText(business.description, 110)}
        </p>

        {/* Location & Contact Meta */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {countryFlag} {business.city ? `${business.city.name}, ` : ''}{business.country?.name}
            </span>
          </div>
          {business.phone && (
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{business.phone}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          href={`/business/${business.slug}`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-[#065F46] font-semibold text-xs border border-slate-200/80 hover:border-emerald-300 transition-all group-hover:bg-[#065F46] group-hover:text-white group-hover:border-[#065F46]"
        >
          <span>View Business Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
