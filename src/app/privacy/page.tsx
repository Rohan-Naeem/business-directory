import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy | NexusBiz Directory',
  description: 'NexusBiz privacy policy outlining information collection, usage, and consumer rights.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <h1 className="text-3xl font-extrabold text-[#172B45] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: March 2025
          </p>

          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              NexusBiz values user privacy. This policy outlines how commercial business information, customer reviews, and visitor interactions are collected and managed.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              1. Commercial Data vs. Personal Data
            </h2>
            <p className="text-xs">
              Commercial details provided during business submissions (business name, official business telephone, corporate address, operating hours, and website) are intended for public indexing on the directory. Private contact details submitted for administrative correspondence (such as account passwords or personal billing records) are strictly safeguarded and never made public.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              2. Cookies & Analytics
            </h2>
            <p className="text-xs">
              NexusBiz uses essential session cookies to maintain user authentication and anonymous aggregated analytics to evaluate search performance and website responsiveness.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              3. Data Subject Inquiries
            </h2>
            <p className="text-xs">
              If you wish to correct or delete information associated with your business listing or user account, please contact our administrative team at privacy@nexusbiz.directory.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
