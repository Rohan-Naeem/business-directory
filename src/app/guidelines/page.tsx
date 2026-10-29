import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Listing Submission & Moderation Guidelines | NexusBiz',
  description: 'Guidelines and quality standards for submitting and verifying commercial listings on NexusBiz directory.',
};

export default function GuidelinesPage() {
  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Listing Guidelines' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981]">
            <FileText className="w-4 h-4" />
            <span>Editorial Standards</span>
          </div>

          <h1 className="text-3xl font-extrabold text-[#172B45] tracking-tight">
            Listing Submission Guidelines
          </h1>

          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              To maintain high organic search value and protect users from deceitful commercial practices, NexusBiz enforces clear editorial criteria for listing approval.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-3">
              1. Eligible Businesses
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Enterprises with a physical commercial address or established service area within Pakistan, the USA, or the UK.</li>
              <li>Legally registered clinics, software development studios, law chambers, retail outlets, and financial advisors.</li>
              <li>Operational businesses possessing direct telephone contact and active electronic mail.</li>
            </ul>

            <h2 className="text-lg font-bold text-[#172B45] pt-3">
              2. Prohibited Content & Submissions
            </h2>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>The following submissions are immediately rejected:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1">
                <li>Keyword-stuffed titles (e.g. "Best Top Cheap Lawyer Lahore Pakistan 24/7"). Use your actual registered trade name.</li>
                <li>P.O. Boxes or fabricated residential addresses claiming to be commercial headquarters.</li>
                <li>Misleading affiliations, unaccredited certifications, or copied third-party copyright assets.</li>
                <li>Duplicate listings for the same exact office location.</li>
              </ul>
            </div>

            <h2 className="text-lg font-bold text-[#172B45] pt-3">
              3. Review & Removal Policy
            </h2>
            <p className="text-xs">
              Listing owners may submit updates or correction requests at any time. If an establishment ceases operations or relocates permanently, users or owners may submit a removal notification via the "Report Listing" control on the business profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
