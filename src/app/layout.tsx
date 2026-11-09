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
  description: 'Find local businesses in Pakistan, USA and UK on Global Bizz Hub, a free business directory. Search by city and category, compare listings, and list your business free.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://globalbizzhub.vercel.app'),
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
    url: 'https://globalbizzhub.vercel.app',
    siteName: 'Global Bizz Hub',
    title: 'Global Bizz Hub | Free Business Directory for Pakistan, USA & UK',
    description: 'Find local businesses across Pakistan, USA, and UK, and list your business free.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Bizz Hub | Free Business Directory for Pakistan, USA & UK',
    description: 'Find local businesses across Pakistan, USA, and UK.',
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
