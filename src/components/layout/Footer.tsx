import React from 'react';
import Link from 'next/link';
import { Building2, Globe2, ShieldCheck, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Nexus<span className="text-[#10B981]">Biz</span>
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm">
              NexusBiz is an authoritative, multi-country business directory platform connecting customers with verified services, healthcare providers, legal advisors, IT firms, and local enterprises across Pakistan, the United States, and the United Kingdom.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#10B981]" />
                <span>Operating across PK, US, and UK territories</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Strict editorial verification and spam moderation</span>
              </div>
            </div>
          </div>

          {/* Supported Country Directories */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Country Directories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/directories/pakistan" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇵🇰</span> Pakistan Directory
                </Link>
              </li>
              <li>
                <Link href="/directories/pakistan/lahore" className="hover:text-white transition-colors pl-6 text-xs text-slate-500 hover:text-slate-300">
                  • Lahore Businesses
                </Link>
              </li>
              <li>
                <Link href="/directories/pakistan/karachi" className="hover:text-white transition-colors pl-6 text-xs text-slate-500 hover:text-slate-300">
                  • Karachi Businesses
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/directories/usa" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇺🇸</span> United States Directory
                </Link>
              </li>
              <li>
                <Link href="/directories/usa/new-york-city" className="hover:text-white transition-colors pl-6 text-xs text-slate-500 hover:text-slate-300">
                  • NYC Businesses
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/directories/uk" className="hover:text-white transition-colors flex items-center gap-2">
                  <span>🇬🇧</span> United Kingdom Directory
                </Link>
              </li>
              <li>
                <Link href="/directories/uk/london" className="hover:text-white transition-colors pl-6 text-xs text-slate-500 hover:text-slate-300">
                  • London Businesses
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/directories" className="text-xs text-[#10B981] font-semibold hover:underline">
                  Browse All Locations &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Industry Categories */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Explore Industries
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/categories/it-software" className="hover:text-white transition-colors">
                  IT & Software
                </Link>
              </li>
              <li>
                <Link href="/categories/healthcare" className="hover:text-white transition-colors">
                  Healthcare & Clinics
                </Link>
              </li>
              <li>
                <Link href="/categories/banking-finance" className="hover:text-white transition-colors">
                  Banking & Financial
                </Link>
              </li>
              <li>
                <Link href="/categories/construction-real-estate" className="hover:text-white transition-colors">
                  Construction & Property
                </Link>
              </li>
              <li>
                <Link href="/categories/legal-services" className="hover:text-white transition-colors">
                  Legal Advocates & Counsel
                </Link>
              </li>
              <li>
                <Link href="/categories/restaurants-food" className="hover:text-white transition-colors">
                  Restaurants & Dining
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/categories" className="text-xs text-[#10B981] font-semibold hover:underline">
                  View All 12 Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Legal Information */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Directory & Trust
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/add-business" className="text-[#10B981] font-semibold hover:underline">
                  + Add Your Business
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About NexusBiz
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-white transition-colors">
                  Listing Guidelines
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} NexusBiz International Directory. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/guidelines" className="hover:text-slate-300">Listing Policy</Link>
            <Link href="/admin" className="text-slate-600 hover:text-slate-400">Staff Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
