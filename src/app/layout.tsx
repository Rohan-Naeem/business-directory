import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Global Bizz Hub',
    default: 'Global Bizz Hub - Trusted Multi-Country Business Directory (Pakistan, USA, UK)',
  },
  description: 'Discover verified companies, hospitals, law firms, software houses, and local services across Pakistan, the United States, and the United Kingdom on Global Bizz Hub.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nexusbiz.directory'),
  keywords: [
    'business directory',
    'pakistan businesses',
    'usa business listings',
    'uk business directory',
    'lahore software houses',
    'karachi hospitals',
    'london lawyers',
    'new york doctors',
  ],
  authors: [{ name: 'Global Bizz Hub' }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexusbiz.directory',
    siteName: 'Global Bizz Hub',
    title: 'Global Bizz Hub - Trusted Multi-Country Business Directory',
    description: 'Find verified businesses, commercial agencies, and certified local services across Pakistan, USA, and UK.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Bizz Hub - Trusted Multi-Country Business Directory',
    description: 'Find verified businesses across Pakistan, USA, and UK.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
