import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import SplashScreen from '@/components/layout/SplashScreen';
import BizzAssistant from '@/components/assistant/BizzAssistant';
import WhatsAppButton from '@/components/layout/WhatsAppButton';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Global Bizz Hub',
    default: 'Global Bizz Hub | Free Business Directory for Pakistan, USA & UK',
  },
  description: 'Global Bizz Hub — the global business directory and online directory for Pakistan, USA and UK. Find local businesses by city and category, compare listings, and list your business free.',
  // Canonical domain, hardcoded: the Vercel NEXT_PUBLIC_SITE_URL variable
  // still points at the old vercel.app host.
  metadataBase: new URL('https://www.globalbizzhub.com'),
  keywords: [
    'business directory',
    'pakistan businesses',
    'usa business listings',
    'uk business directory',
    'free business directory pakistan',
    'pakistan business directory',
    'find local businesses near me',
    'list your business free',
    'lahore software houses',
    'karachi hospitals',
    'london lawyers',
    'new york doctors',
  ],
  authors: [{ name: 'Global Bizz Hub' }],
  verification: {
    google: 'F35rqbBVg6ENbyYrUl2NkJEeMcFJ85l4w1VI4RaCMEo',
    other: {
      'msvalidate.01': '293080E4132E85D0051BC2DF7F78BDD2',
    },
  },
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
    url: 'https://www.globalbizzhub.com',
    siteName: 'Global Bizz Hub',
    title: 'Global Bizz Hub | Free Business Directory for Pakistan, USA & UK',
    description: 'The global business directory and online directory for Pakistan, USA and UK — find local businesses and list yours free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Bizz Hub | Free Business Directory for Pakistan, USA & UK',
    description: 'The global business directory and online directory for Pakistan, USA and UK.',
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
        <SplashScreen />
        <BizzAssistant />
        <WhatsAppButton />
      </body>
    </html>
  );
}
