import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MyBusinessesList } from '@/components/account/MyBusinessesList';
import { AccountActions } from '@/components/account/AccountActions';
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
  title: 'My Business Dashboard | Global Bizz Hub',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function UserDashboardPage() {

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

        <AccountActions />
        <div className="space-y-4">
          <h2 className="text-base font-bold text-[#172B45]">
            My Businesses (from this account)
          </h2>
          <MyBusinessesList />
        </div>

      </div>
    </div>
  );
}
