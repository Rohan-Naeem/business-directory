import React from 'react';
import AdminShell from '@/components/admin/AdminShell';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { AdminReviewsClient } from './AdminReviewsClient';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

export const metadata: Metadata = {
  title: 'Moderate Customer Reviews | Global Bizz Hub Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const adminToken = (await cookies()).get(ADMIN_COOKIE)?.value;
  const [reviews, businesses] = await Promise.all([
    DirectoryRepository.getReviews(undefined, 'all'),
    DirectoryRepository.getAllBusinessesForAdmin('all'),
  ]);

  return (
    <AdminShell returnTo="/admin/reviews">
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#172B45] tracking-tight">
          Customer Reviews Moderation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review, approve, or reject user feedback to maintain high directory accuracy and prevent review spam.
        </p>
      </div>

      <AdminReviewsClient
        initialReviews={reviews}
        businesses={businesses}
        adminToken={adminToken}
      />
    </div>
    </AdminShell>
  );
}
