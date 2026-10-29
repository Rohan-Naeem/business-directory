import React from 'react';
import { Search, Compass, ShieldCheck, PhoneCall } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Search for Businesses',
      desc: 'Quickly find companies by commercial name, specialized service, or keyword across Pakistan, USA, and UK.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Browse Locations & Sectors',
      desc: 'Filter by country, province, or populated cities, and drill down into niche business subcategories.',
      icon: Compass,
    },
    {
      step: '03',
      title: 'Compare Verified Details',
      desc: 'Check genuine customer reviews, operating hours, physical street addresses, and verified credentials.',
      icon: ShieldCheck,
    },
    {
      step: '04',
      title: 'Connect Directly',
      desc: 'Make a direct phone call, send a WhatsApp inquiry, visit their official website, or submit your own company listing.',
      icon: PhoneCall,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.step}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative flex flex-col justify-between hover:border-emerald-200 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#065F46] flex items-center justify-center shadow-xs">
                  <Icon className="w-6 h-6 text-[#10B981]" />
                </div>
                <span className="text-2xl font-black text-slate-200">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#172B45] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
