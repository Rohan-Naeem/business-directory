import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const GUIDE_URL = 'https://www.globalbizzhub.com/guides/software-companies-in-lahore';

export const metadata: Metadata = {
  title: 'Software Companies in Lahore | Top 10 Software Houses',
  description:
    'The top 10 software companies in Lahore — Systems Limited, NetSol Technologies, Arbisoft, Techlogix, 10Pearls, Folio3, Tkxel, VentureDive, CureMD and Confiz — with official websites and contact details where listed. Free directory.',
  alternates: {
    canonical: GUIDE_URL,
  },
  openGraph: {
    title: 'Software Companies in Lahore | Top 10 Software Houses | Global Bizz Hub',
    description:
      'The top 10 software companies in Lahore with official websites and contact details where listed. Free directory.',
    url: GUIDE_URL,
  },
};

const COMPANIES = [
  {
    name: 'Systems Limited',
    slug: 'systems-limited-lahore',
    description:
      'Founded in Lahore in 1977, Systems Limited is Pakistan\u2019s first software house and its largest publicly listed IT exporter, working on digital transformation, cloud, AI and enterprise solutions for banks, telecoms and government.',
    website: 'https://www.systemsltd.com',
    phone: '+92 42 111 797 836',
    email: 'info@systemsltd.com',
  },
  {
    name: 'NetSol Technologies',
    slug: 'netsol-technologies-lahore',
    description:
      'NetSol Technologies is a Lahore-based technology company providing IT consultancy and software for the global finance and leasing industry.',
    website: 'https://netsoltech.com',
    phone: '',
    email: '',
  },
  {
    name: 'Arbisoft',
    slug: 'arbisoft-lahore',
    description:
      'Arbisoft is a custom software and mobile app company with its roots in Lahore, working on AI, data science and web and mobile development for education, travel and healthcare.',
    website: 'https://arbisoft.com',
    phone: '+92 42 37498533',
    email: 'contact@arbisoft.com',
  },
  {
    name: 'Techlogix',
    slug: 'techlogix-lahore',
    description:
      'Techlogix is a Lahore-based IT services and consulting firm focused on enterprise applications, business intelligence and digital banking.',
    website: 'https://techlogix.com',
    phone: '',
    email: '',
  },
  {
    name: '10Pearls',
    slug: '10pearls-lahore',
    description:
      '10Pearls is a digital engineering company with a Lahore office, focused on product development, AI and digital solutions for healthcare, fintech and retail.',
    website: 'https://10pearls.com',
    phone: '',
    email: '',
  },
  {
    name: 'Folio3',
    slug: 'folio3-lahore',
    description:
      'Folio3 is a digital transformation and software development company with an office in Lahore, working on e-commerce, ERP integrations and AI.',
    website: 'https://folio3.com',
    phone: '',
    email: '',
  },
  {
    name: 'Tkxel',
    slug: 'tkxel-lahore',
    description:
      'Tkxel is a custom software development and digital transformation consultancy with a Lahore presence, serving fintech, healthcare and education.',
    website: 'https://tkxel.com',
    phone: '',
    email: '',
  },
  {
    name: 'VentureDive',
    slug: 'venturedive-lahore',
    description:
      'VentureDive is a technology studio with an office in Lahore, building mobile and web software with product design and testing.',
    website: 'https://venturedive.com',
    phone: '',
    email: '',
  },
  {
    name: 'CureMD',
    slug: 'curemd-lahore',
    description:
      'CureMD is a healthcare technology company with a Lahore office, providing cloud-based EHR, medical billing and practice management software.',
    website: 'https://curemd.com',
    phone: '',
    email: '',
  },
  {
    name: 'Confiz',
    slug: 'confiz-lahore',
    description:
      'Confiz is a Lahore software house focused on retail and enterprise solutions, cloud, data and AI, and Microsoft Dynamics 365.',
    website: 'https://confiz.com',
    phone: '+92 42 35233063',
    email: '',
  },
];

const FAQS = [
  {
    q: 'Which is the largest software company in Lahore?',
    a: 'Systems Limited. Founded in Lahore in 1977, it is Pakistan\u2019s first software house and its largest publicly listed IT exporter, working on digital transformation, cloud and enterprise solutions.',
  },
  {
    q: 'How do I find a software company in Lahore?',
    a: 'Browse the ten companies listed on this page and compare what each one does, then open its profile for its official website and contact details. You can also search all IT and software companies by city on Global Bizz Hub.',
  },
  {
    q: 'Are the listings on this page verified?',
    a: 'Contact details are shown only where they could be confirmed from the company\u2019s own website or public profiles. Where a phone number or email is not shown, it has not been confirmed \u2014 it is never guessed.',
  },
  {
    q: 'Can I list my software company in Lahore for free?',
    a: 'Yes. Use the List Your Business Free page on Global Bizz Hub to add your company at no cost.',
  },
];

export default function SoftwareCompaniesInLahoreGuide() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Software Companies in Lahore',
    itemListElement: COMPANIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      url: `https://www.globalbizzhub.com/business/${c.slug}`,
    })),
  };

  return (
    <div className="bg-[#F7F9FC] min-h-screen py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides/software-companies-in-lahore' },
            { label: 'Software Companies in Lahore' },
          ]}
        />

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            Guide &middot; Lahore &middot; IT &amp; Software
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#172B45] tracking-tight mt-2 mb-3">
            Software Companies in Lahore
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Lahore is home to some of Pakistan&rsquo;s best-known software companies, known
            locally as software houses, including Systems Limited, NetSol Technologies,
            Arbisoft, Techlogix, 10Pearls, Folio3, Tkxel, VentureDive, CureMD and Confiz. They offer custom software development, AI, cloud,
            enterprise and healthcare software. This guide lists all ten with their official
            websites and contact details where listed.
          </p>
          <p className="text-xs text-slate-400 mt-4">Last updated: 16 November 2026</p>
        </div>

        <div className="space-y-6 mb-8">
          {COMPANIES.map((c, i) => (
            <article
              key={c.slug}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs"
            >
              <h2 className="text-lg sm:text-xl font-bold text-[#172B45] mb-2">
                <span className="text-[#10B981] mr-2">{i + 1}.</span>
                <Link
                  href={`/business/${c.slug}`}
                  className="hover:text-[#065F46] hover:underline"
                >
                  {c.name}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{c.description}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                {c.website && (
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#065F46] hover:underline"
                  >
                    {c.website.replace('https://', '')}
                  </a>
                )}
                {c.phone && <span>Phone: {c.phone}</span>}
                {c.email && <span>Email: {c.email}</span>}
                <Link
                  href={`/business/${c.slug}`}
                  className="font-semibold text-[#065F46] hover:underline"
                >
                  View full listing &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B45] tracking-tight mb-3">
            How to choose a software company in Lahore
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 leading-relaxed">
            <li>
              Match the company&rsquo;s focus to your project &mdash; enterprise systems, product
              development, AI, or healthcare software are very different jobs.
            </li>
            <li>
              Check the company&rsquo;s official website and contact it directly before deciding.
            </li>
            <li>
              Compare Lahore offices and delivery experience, and ask for examples of similar
              work.
            </li>
          </ul>
          <p className="text-sm text-slate-600 leading-relaxed mt-4">
            Looking for more? Browse all{' '}
            <Link
              href="/categories/it-software"
              className="font-semibold text-[#065F46] hover:underline"
            >
              IT &amp; Software companies
            </Link>{' '}
            or all{' '}
            <Link
              href="/pakistan/lahore"
              className="font-semibold text-[#065F46] hover:underline"
            >
              businesses in Lahore
            </Link>
            .
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xs mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#172B45] tracking-tight mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((f) => (
              <div key={f.q}>
                <h3 className="text-sm sm:text-base font-bold text-[#172B45] mb-1">{f.q}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#065F46] rounded-3xl p-8 sm:p-10 shadow-xs text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
            Run a software company in Lahore?
          </h2>
          <p className="text-sm text-emerald-100 mb-5">
            List it on Global Bizz Hub for free and get found by customers searching for software
            companies in Lahore.
          </p>
          <Link
            href="/add-business"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#065F46] text-sm font-bold hover:bg-emerald-50 transition-colors"
          >
            List your business free &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
