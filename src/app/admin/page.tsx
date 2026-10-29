import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Metadata } from 'next';
import Link from 'next/link';
import { DirectoryRepository } from '@/lib/data/repository';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Flag, 
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';
import { AdminPendingListingsClient } from './AdminPendingListingsClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard Overview | Global Bizz Hub',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [stats, pendingBusinesses, openReports, pendingReviews] = await Promise.all([
    DirectoryRepository.getAdminStats(),
    DirectoryRepository.getAllBusinessesForAdmin('pending'),
    DirectoryRepository.getReports(),
    DirectoryRepository.getReviews(undefined, 'pending'),
  ]);

  return (
    <AdminShell returnTo="/admin">
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] tracking-tight">
          Directory Management & Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review pending submissions, manage geographic datasets, and moderate customer feedback.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Listings
            </span>
            <div className="text-2xl font-black text-[#172B45]">
              {stats.totalListings}
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">
              {stats.approvedListings} approved & public
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#065F46] flex items-center justify-center">
            <Building2 className="w-6 h-6 text-[#10B981]" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Pending Submissions
            </span>
            <div className="text-2xl font-black text-amber-600">
              {stats.pendingListings}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Requires editorial review
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Locations Coverage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cities Covered
            </span>
            <div className="text-2xl font-black text-[#172B45]">
              {stats.totalCities}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Across 3 Countries
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Reviews & Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Moderation Queue
            </span>
            <div className="text-2xl font-black text-rose-600">
              {stats.pendingReviews + stats.openReports}
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              {stats.pendingReviews} reviews, {stats.openReports} reports
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flag className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Pending Listings Moderation Table Component */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-[#172B45] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Pending Business Submissions Queue ({pendingBusinesses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Businesses submitted by owners awaiting verification before public publishing.
            </p>
          </div>

          <Link
            href="/admin/listings"
            className="text-xs font-bold text-[#065F46] hover:underline"
          >
            Manage all listings &rarr;
          </Link>
        </div>

        <AdminPendingListingsClient initialPending={pendingBusinesses} />
      </div>

      {/* Quick Links & Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Geo Importer Tool Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#065F46] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5 text-[#10B981]" />
            </div>
            <h3 className="font-bold text-base text-[#172B45] mb-1">
              Geographic Cities Importer
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Import and expand hundreds of city records across Pakistan, the United States, and the United Kingdom in a single click with automated deduplication.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/admin/locations"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:underline"
            >
              <span>Launch Geo Importer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Customer Reviews Queue Widget */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#172B45] mb-1">
              Customer Reviews Moderation ({pendingReviews.length} Pending)
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Approve or reject customer-submitted ratings to protect directory trust and prevent spam.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/admin/reviews"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] hover:underline"
            >
              <span>Review Customer Ratings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
    </AdminShell>
  );
}
