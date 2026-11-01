'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type BusinessResult = {
  name: string;
  slug: string;
  short_description: string;
  city?: { name: string };
  country?: { name: string };
  phone?: string;
};

type Message = {
  role: 'assistant' | 'user';
  text: string;
  results?: BusinessResult[];
  total?: number;
  searchUrl?: string;
};

const CITIES: Array<[string, string]> = [
  ['lahore', 'lahore'], ['rawalpindi', 'rawalpindi'], ['faisalabad', 'faisalabad'],
  ['multan', 'multan'], ['sialkot', 'sialkot'], ['gujranwala', 'gujranwala'],
  ['karachi', 'karachi'], ['hyderabad', 'hyderabad'], ['sukkur', 'sukkur'],
  ['islamabad', 'islamabad'], ['peshawar', 'peshawar'],
  ['los angeles', 'los-angeles'], ['san francisco', 'san-francisco'], ['san diego', 'san-diego'],
  ['new york', 'new-york-city'], ['buffalo', 'buffalo'], ['houston', 'houston'],
  ['austin', 'austin'], ['dallas', 'dallas'], ['chicago', 'chicago'], ['seattle', 'seattle'],
  ['london', 'london'], ['manchester', 'manchester'], ['birmingham', 'birmingham'],
  ['leeds', 'leeds'], ['bristol', 'bristol'], ['edinburgh', 'edinburgh'],
  ['glasgow', 'glasgow'], ['cardiff', 'cardiff'], ['belfast', 'belfast'],
];

const CATEGORIES: Array<[string, string]> = [
  ['hospital', 'healthcare'], ['doctor', 'healthcare'], ['dentist', 'healthcare'], ['clinic', 'healthcare'],
  ['restaurant', 'restaurants-food'], ['food', 'restaurants-food'], ['cafe', 'restaurants-food'],
  ['hotel', 'hotels-travel'], ['software', 'it-software'], ['it company', 'it-software'],
  ['bank', 'banking-finance'], ['lawyer', 'legal-services'], ['law firm', 'legal-services'],
  ['university', 'education'], ['school', 'education'], ['college', 'education'],
  ['shop', 'shopping-retail'], ['mall', 'shopping-retail'], ['store', 'shopping-retail'],
  ['car', 'automotive'], ['plumber', 'home-services'], ['electrician', 'home-services'],
  ['construction', 'construction-real-estate'], ['real estate', 'construction-real-estate'],
  ['factory', 'manufacturing'],
];

const SUGGESTIONS = ['Hospital in Karachi', 'Restaurant in London', 'Software company in Lahore'];

// Rule-based finder only. It never invents a business: every result comes
// from GET /api/businesses, which returns approved listings from the
// directory database. No external AI API is used.
export default function BizzAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hi, I am Bizz, your helper. Tell me what you need and which city, for example "hospital in Karachi", and I will show you real listings from Global Bizz Hub only.',
    },
  ]);

  async function ask(raw: string) {
    const text = raw.trim();
    if (!text || loading) return;
    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const lower = text.toLowerCase();
      const city = CITIES.find(([name]) => lower.includes(name))?.[1];
      const category = CATEGORIES.find(([word]) => lower.includes(word))?.[1];
      const params = new URLSearchParams({ limit: '5' });
      if (city) params.set('city', city);
      if (category) params.set('category', category);
      // Fallback keyword search when no city/category was recognised.
      if (!city && !category) {
        const q = lower.replace(/[^a-z ]/g, '').split(' ').filter((w) => w.length > 2 && !['need', 'want', 'find', 'show', 'best', 'near', 'the', 'for', 'and'].includes(w)).join(' ');
        if (q) params.set('q', q);
      }
      const res = await fetch(`/api/businesses?${params.toString()}`);
      const data = await res.json();
      const results: BusinessResult[] = data.businesses || [];
      const searchUrl = `/search?${params.toString()}`;
      if (results.length === 0) {
        setMessages((m) => [...m, {
          role: 'assistant',
          text: 'Sorry, I could not find that in our listings yet. I will not guess a business that is not here. Try another city or category, or see the full search below.',
          searchUrl,
        }]);
      } else {
        const where = city ? ` in ${city.replace(/-/g, ' ')}` : '';
        setMessages((m) => [...m, {
          role: 'assistant',
          text: `Here are real listings${where} from Global Bizz Hub:`,
          results,
          total: data.total || results.length,
          searchUrl,
        }]);
      }
    } catch {
      setMessages((m) => [...m, {
        role: 'assistant',
        text: 'Sorry, I could not search just now. Please try again, or use the search page directly.',
        searchUrl: '/search',
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[480px] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[#065F46] px-4 py-3 text-white">
            <Image src="/logo.svg" alt="Bizz assistant avatar" width={40} height={40} className="h-10 w-10 rounded-full bg-white p-1" />
            <div className="flex-1">
              <p className="font-semibold leading-tight">Bizz, your finder</p>
              <p className="text-xs text-emerald-100">I only show real listings from this site</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="text-xl leading-none">×</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-[#065F46] text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <p>{msg.text}</p>
                  {msg.results?.map((b) => (
                    <Link key={b.slug} href={`/business/${b.slug}`} className="mt-2 block rounded-xl bg-white p-2 text-slate-800 shadow-sm hover:shadow">
                      <span className="font-semibold text-[#065F46]">{b.name}</span>
                      <span className="block text-xs text-slate-500">
                        {[b.city?.name, b.country?.name].filter(Boolean).join(', ')}
                        {b.phone ? ` • ${b.phone}` : ''}
                      </span>
                      <span className="block text-xs">{b.short_description}</span>
                    </Link>
                  ))}
                  {msg.searchUrl && (
                    <Link href={msg.searchUrl} className="mt-2 inline-block text-xs font-semibold text-[#065F46] underline">
                      {msg.total ? `See all ${msg.total} results` : 'Open full search'}
                    </Link>
                  )}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm text-slate-500">Searching real listings…</p>}
          </div>
          <div className="flex flex-wrap gap-2 border-t border-slate-100 px-3 py-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => ask(s)} className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-[#065F46] hover:bg-emerald-100">{s}</button>
            ))}
          </div>
          <form
            className="flex gap-2 border-t border-slate-200 p-3"
            onSubmit={(e) => { e.preventDefault(); ask(input); }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask, e.g. hospital in Karachi"
              className="flex-1 rounded-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#065F46]"
            />
            <button type="submit" className="rounded-full bg-[#065F46] px-4 py-2 text-sm font-semibold text-white">Ask</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Bizz assistant"
        className="flex items-center gap-2 rounded-full bg-[#065F46] py-2 pl-2 pr-4 text-white shadow-xl hover:bg-[#044E39]"
      >
        <Image src="/logo.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-full bg-white p-0.5" />
        <span className="text-sm font-semibold">Ask Bizz</span>
      </button>
    </div>
  );
}
