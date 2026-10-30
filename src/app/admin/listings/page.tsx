import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { AdminListingsClient } from './AdminListingsClient';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from '@/lib/admin-auth';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Listings | Global Bizz Hub Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const businesses = await DirectoryRepository.getAllBusinessesForAdmin('all');

  return (
    <AdminShell returnTo="/admin/listings">
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#172B45] tracking-tight">
            Manage Business Listings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            View, filter, moderate, feature, or delete commercial directory records.
          </p>
        </div>

        <Link
          href="/add-business"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Business Submission</span>
        </Link>
      </div>

      <AdminListingsClient initialBusinesses={businesses} adminToken={adminToken} />
    </div>
    </AdminShell>
  );
}
