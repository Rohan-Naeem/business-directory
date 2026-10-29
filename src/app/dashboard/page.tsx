import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { 
  Building2, 
  PlusCircle, 
  ExternalLink, 
  Star, 
  Clock, 
  MapPin, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'My Business Dashboard | NexusBiz',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {
  // Fetch sample listings for dashboard view
  const businesses = await DirectoryRepository.getAllBusinessesForAdmin('all');
  const userListings = businesses.slice(0, 3); // Demo user listings

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'User Dashboard' }]} />

        {/* Dashboard Welcome Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981] mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Owner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
              My Business Listings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your company information, check moderation approval status, and monitor client reviews.
            </p>
          </div>

          <Link
            href="/add-business"
            className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-5 py-3 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Another Business</span>
          </Link>
        </div>

        {/* Listings Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#172B45]">
            Registered Enterprises ({userListings.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((biz) => (
              <div
                key={biz.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      biz.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : biz.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {biz.status}
                    </span>

                    {biz.is_verified && (
                      <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-[#172B45] mb-1">
                    {biz.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                    {biz.short_description}
                  </p>

                  <div className="space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{biz.city?.name}, {biz.country?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{biz.rating.toFixed(1)} ({biz.review_count} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/business/${biz.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#065F46] hover:underline"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
