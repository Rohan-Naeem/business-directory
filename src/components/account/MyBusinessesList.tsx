'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';

export const MyBusinessesList: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsLogin, setNeedsLogin] = useState(false);
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) { setNeedsLogin(true); setLoading(false); return; }
      const res = await fetch('/api/my-businesses', { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { setNeedsLogin(true); setLoading(false); return; }
      const body = await res.json();
      setItems(body.businesses || []); setLoading(false);
    });
  }, []);
  if (loading) return <p className="text-sm text-slate-500">Loading your businesses...</p>;
  if (needsLogin) return <p className="text-sm text-slate-500">Please <Link href="/auth/login" className="font-bold text-[#065F46]">login</Link> to see your businesses.</p>;
  if (!items.length) return <p className="text-sm text-slate-500">You have not listed any business yet. <Link href="/add-business" className="font-bold text-[#065F46]">Add your first business</Link>.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((biz: any) => (
        <div key={biz.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${biz.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : biz.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{biz.status}</span>
            <h3 className="font-bold text-base text-[#172B45] mt-2 mb-1">{biz.name}</h3>
            <p className="text-xs text-slate-500 line-clamp-2">{biz.short_description}</p>
            <p className="text-xs text-slate-600 mt-2">{biz.city?.name}, {biz.country?.name}</p>
          </div>
          <Link href={`/business/${biz.slug}`} className="text-xs font-bold text-[#065F46] hover:underline">View Public Page</Link>
        </div>
      ))}
    </div>
  );
};
