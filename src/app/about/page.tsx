import React from 'react';
import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ShieldCheck, Globe2, Building2, Users, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Global Bizz Hub - Our Mission & Verification Standards',
  description: 'Learn about the mission, geographic scope, and strict editorial verification policies behind the Global Bizz Hub multi-country directory.',
};

export default function AboutPage() {
  return (
    <div className="bg-[#F7F9FC] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#10B981]">
            <Building2 className="w-4 h-4" />
            <span>Company Background</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight">
            About Global Bizz Hub Directory
          </h1>

          <div className="prose prose-slate text-sm text-slate-600 leading-relaxed space-y-4">
            <p>
              Global Bizz Hub is an authoritative, multi-country business discovery platform created to provide honest, structured, and verified commercial listings across <strong>Pakistan</strong>, the <strong>United States</strong>, and the <strong>United Kingdom</strong>.
            </p>

            <h2 className="text-xl font-bold text-[#172B45] pt-4">
              Our Core Principles
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>No Fabricated Data</span>
                </div>
                <p className="text-xs text-slate-500">
                  Every business profile lists authentic phone numbers, real operational schedules, and verified addresses. We reject fake listings.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Globe2 className="w-4 h-4 text-[#10B981]" />
                  <span>Geographic Integrity</span>
                </div>
                <p className="text-xs text-slate-500">
                  Organized by verified administrative divisions, provinces, and populated places rather than arbitrary text tags.
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#172B45] pt-4">
              Editorial Verification Process
            </h2>
            <p>
              When a company submits a new profile through our submission system, it enters our administrative review queue. Our moderators inspect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>Direct telephone reachability and working business hours</li>
              <li>Official corporate website or active commercial social presence</li>
              <li>Physical street address corroboration within the stated municipality</li>
            </ul>

            <h2 className="text-xl font-bold text-[#172B45] pt-4">
              Monetization Transparency
            </h2>
            <p>
              Standard directory listings are free of charge. In the future, sponsored or featured placements will always be clearly labelled as such so consumers can distinguish organic search relevance from commercial advertising.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
