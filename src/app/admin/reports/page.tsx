import React from 'react';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { AdminReportsClient } from './AdminReportsClient';

export const metadata: Metadata = {
  title: 'Reported Listings | NexusBiz Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  const [reports, businesses] = await Promise.all([
    DirectoryRepository.getReports(),
    DirectoryRepository.getAllBusinessesForAdmin('all'),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#172B45] tracking-tight">
          Reported Listings & Correction Requests
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review community-submitted reports regarding relocated companies, outdated phone numbers, or policy concerns.
        </p>
      </div>

      <AdminReportsClient
        initialReports={reports}
        businesses={businesses}
      />
    </div>
  );
}
