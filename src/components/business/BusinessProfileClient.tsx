'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Globe, 
  MessageSquare, 
  Star, 
  Clock, 
  MapPin, 
  Share2, 
  Flag, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { Business, Review } from '@/lib/types';
import { checkBusinessOpenStatus, formatTime, formatDate } from '@/lib/utils';
import { ReviewModal } from './ReviewModal';
import { ReportModal } from './ReportModal';
import { CategoryIcon } from '../ui/CategoryIcon';

interface BusinessProfileClientProps {
  business: Business;
  reviews: Review[];
}

export const BusinessProfileClient: React.FC<BusinessProfileClientProps> = ({
  business,
  reviews: initialReviews,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const openStatus = checkBusinessOpenStatus(business.hours);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-80 w-full bg-slate-100 overflow-hidden">
          {business.cover_image_url ? (
            <img
              src={business.cover_image_url}
              alt={`${business.name} storefront`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#065F46] to-[#10B981] flex items-center justify-center text-white/30">
              <CategoryIcon name={business.category?.icon || 'Building2'} className="w-20 h-20" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badges Over Cover */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            {business.is_featured && (
              <span className="inline-flex items-center gap-1 bg-[#FBBF24] text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <Star className="w-3.5 h-3.5 fill-slate-900" />
                Featured Partner
              </span>
            )}
            {business.is_verified && (
              <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Listing
              </span>
            )}
          </div>

          {/* Share & Report Quick Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title="Share Listing"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
              title="Report Listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>

          {/* Category Pill */}
          {business.category && (
            <div className="absolute bottom-4 left-6">
              <Link
                href={`/categories/${business.category.slug}`}
                className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#065F46] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors"
              >
                <CategoryIcon name={business.category.icon} className="w-4 h-4 text-[#10B981]" />
                <span>{business.category.name}</span>
                {business.subcategory && (
                  <span className="text-slate-400 font-normal">/ {business.subcategory.name}</span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Profile Info Main Bar */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mb-2">
                {business.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>
                    {business.address}, {business.city?.name}, {business.region?.name}, {business.country?.name} {business.country?.flag_emoji}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900 text-sm">
                    {business.rating > 0 ? business.rating.toFixed(1) : 'New'}
                  </span>
                  <span className="text-slate-400">
                    ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                  </span>
                </div>

                {/* Open Status */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className={`font-bold ${openStatus.isOpen ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {openStatus.message}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4 text-[#10B981]" />
                  <span>Call Now</span>
                </a>
              )}

              {business.whatsapp && (
                <a
                  href={`https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}

              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-3 rounded-xl transition-colors"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Website</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          {/* Short description quote */}
          {business.short_description && (
            <p className="mt-4 text-sm font-medium text-slate-700 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
              "{business.short_description}"
            </p>
          )}
        </div>
      </div>

      {/* Main Grid: Description & Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Detailed Description & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Company */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#10B981]" />
              About {business.name}
            </h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-3">
              {business.description}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  Customer Reviews ({reviews.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Genuine verified ratings from clients and customers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* Review Cards List */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#065F46] font-bold text-xs flex items-center justify-center">
                          {rev.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-slate-800 block">
                            {rev.user_name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Verified Reviewer • {formatDate(rev.created_at)}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h4 className="text-xs font-bold text-slate-900 pt-1">
                        {rev.title}
                      </h4>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-500">
                  No public reviews have been submitted for {business.name} yet.
                </p>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="text-xs font-bold text-[#10B981] hover:underline"
                >
                  Be the first to share your experience &rarr;
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Contact Details, Hours & Address */}
        <div className="space-y-6">
          
          {/* Operating Hours Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#172B45] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#10B981]" />
              Business Hours
            </h3>

            <div className="space-y-2 text-xs">
              {daysOfWeek.map((dayName, index) => {
                const daySchedule = business.hours?.find(h => h.day_of_week === index);
                const isToday = new Date().getDay() === index;

                return (
                  <div
                    key={dayName}
                    className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg ${
                      isToday ? 'bg-emerald-50 text-[#065F46] font-bold' : 'text-slate-600'
                    }`}
                  >
                    <span>{dayName} {isToday && '(Today)'}</span>
                    <span>
                      {daySchedule && !daySchedule.is_closed
                        ? `${formatTime(daySchedule.opens_at)} - ${formatTime(daySchedule.closes_at)}`
                        : 'Closed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact & Location Details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-[#172B45] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#10B981]" />
              Contact & Location
            </h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                  Address
                </span>
                <p className="text-slate-800 font-medium mt-0.5">
                  {business.address}
                </p>
                <p className="text-slate-500">
                  {business.city?.name}, {business.region?.name} {business.postal_code || ''}
                </p>
                <p className="text-slate-500">
                  {business.country?.name} {business.country?.flag_emoji}
                </p>
              </div>

              {business.phone && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Phone
                  </span>
                  <a href={`tel:${business.phone}`} className="text-[#065F46] font-bold hover:underline">
                    {business.phone}
                  </a>
                </div>
              )}

              {business.email && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Official Email
                  </span>
                  <a href={`mailto:${business.email}`} className="text-slate-700 hover:text-[#065F46] font-medium">
                    {business.email}
                  </a>
                </div>
              )}

              {business.website && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
                    Website
                  </span>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10B981] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Visit Official Site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Listing Verification Notice */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 text-xs text-slate-500 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Listing Integrity Guarantee</span>
            </div>
            <p className="leading-relaxed">
              Global Bizz Hub requires verified phone numbers and addresses for commercial publication. Notice an outdated field or relocated office?
            </p>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="text-[#065F46] font-bold hover:underline"
            >
              Request correction / report listing &rarr;
            </button>
          </div>

        </div>

      </div>

      {/* Review & Report Modals */}
      <ReviewModal
        businessId={business.id}
        businessName={business.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewSubmitted={async () => {
          // Re-fetch reviews
          const updated = await fetch(`/api/reviews?business_id=${business.id}`).then(r => r.json());
          if (Array.isArray(updated)) setReviews(updated);
        }}
      />

      <ReportModal
        businessId={business.id}
        businessName={business.name}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
