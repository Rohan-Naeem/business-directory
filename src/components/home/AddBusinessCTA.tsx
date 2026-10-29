import React from 'react';
import Link from 'next/link';
import { PlusCircle, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export const AddBusinessCTA: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-[#065F46] via-[#054E3A] to-[#172B45] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
      {/* Background ambient pattern */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-[#A7F3D0] text-xs font-bold tracking-wider uppercase mb-4 border border-emerald-400/20">
          <TrendingUp className="w-3.5 h-3.5" />
          Grow Your Market Reach
        </span>

        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          List Your Business on the Global Bizz Hub
        </h2>

        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6">
          Reach thousands of customers searching for trusted local businesses in Pakistan, the United States, and the United Kingdom. Standard listing submissions are 100% free and undergo editorial review to maintain high directory trust.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs text-emerald-100 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Free standard submission with no hidden fees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Search-engine optimized public profile page</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Direct WhatsApp, phone, and website links</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <span>Genuine customer reviews and rating management</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/add-business"
            className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 hover:shadow-xl transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Business Free</span>
          </Link>
          <Link
            href="/guidelines"
            className="inline-flex items-center text-sm font-semibold text-emerald-200 hover:text-white transition-colors"
          >
            Review submission guidelines &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};
