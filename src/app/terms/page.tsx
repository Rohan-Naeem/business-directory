import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Global Bizz Hub Directory',
  description: 'Terms and conditions governing the use of the Global Bizz Hub multi-country business directory.',
};

export default function TermsPage() {
  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <h1 className="text-3xl font-extrabold text-[#172B45] tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">
            Last Updated: March 2025
          </p>

          <div className="text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              By accessing or submitting commercial profiles to Global Bizz Hub, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              1. Directory Representation & Accuracy
            </h2>
            <p className="text-xs">
              Users submitting business listings warrant that the submitted company is active and legally authorized to conduct commercial operations under applicable laws in Pakistan, the United States, or the United Kingdom.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              2. Editorial Moderation & Discretion
            </h2>
            <p className="text-xs">
              Global Bizz Hub reserves the full right to reject, modify, suspend, or permanently remove any listing, review, or image that violates our editorial policies, infringes third-party intellectual property, or promotes deceptive practices.
            </p>

            <h2 className="text-lg font-bold text-[#172B45] pt-2">
              3. Limitation of Liability
            </h2>
            <p className="text-xs">
              Global Bizz Hub acts solely as an informational directory and search platform. Global Bizz Hub does not endorse, guarantee, or assume liability for the direct commercial products, services, advice, or transactions provided by listed third-party businesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
