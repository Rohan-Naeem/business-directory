'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How do I search for businesses in my city?',
    answer: 'You can use the interactive search bar at the top of the homepage or the dedicated Search page. Select your country (Pakistan, USA, or UK), pick your target city from the dynamically updated dropdown, and type the service or company name you are looking for.',
  },
  {
    question: 'Is listing my business on NexusBiz free?',
    answer: 'Yes! Standard business listing submissions on NexusBiz are 100% free. Once you submit your details through our multi-step form, our editorial moderation team reviews the information before publishing it live on the directory.',
  },
  {
    question: 'How does business verification work?',
    answer: 'A listing is designated with the green "Verified" badge only after our team confirms the physical address, official phone number, and legitimate operational status. We never assign automated or fabricated verification badges.',
  },
  {
    question: 'Can business owners update or edit their listing information?',
    answer: 'Yes. Business owners can sign in to their account to edit operating hours, upload updated cover photos, update phone and WhatsApp numbers, and manage listing details. Updates undergo administrative review to prevent unauthorized changes.',
  },
  {
    question: 'How are customer reviews and ratings moderated?',
    answer: 'To protect businesses and consumers from review fraud, all reviews submitted by customers undergo automated spam filtration and administrative moderation before appearing publicly on a business profile.',
  },
  {
    question: 'Can more countries and cities be added to the directory?',
    answer: 'NexusBiz is architected as an expandable multi-country platform. We currently support Pakistan, the United States, and the United Kingdom, and our geographic management system enables seamless expansion to new territories and cities.',
  },
];

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-3">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-[#065F46] transition-colors cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base">{faq.question}</span>
              <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-emerald-50 text-emerald-700' : 'text-slate-500'}`}>
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
