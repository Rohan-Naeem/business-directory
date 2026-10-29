import React from 'react';
import type { Metadata } from 'next';
import { DirectoryRepository } from '@/lib/data/repository';
import { AdminGeoImporterClient } from './AdminGeoImporterClient';

export const metadata: Metadata = {
  title: 'Geographic Locations & Importer | Global Bizz Hub Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function AdminLocationsPage() {
  const [countries, regions, cities] = await Promise.all([
    DirectoryRepository.getCountries(),
    DirectoryRepository.getRegions(),
    DirectoryRepository.getCities(),
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#172B45] tracking-tight">
          Geographic Datasets & City Management
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ingest, verify, and manage countries, regions, and cities across Pakistan, the USA, and the UK.
        </p>
      </div>

      <AdminGeoImporterClient
        countries={countries}
        regions={regions}
        cities={cities}
      />
    </div>
  );
}
