'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton';

export const AccountActions: React.FC = () => {
  const router = useRouter();
  async function logout() {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
    router.push('/'); router.refresh();
  }
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
      <span className="text-sm font-bold text-[#172B45] mr-2">Account:</span>
      <button type="button" onClick={logout} className="px-4 py-2 rounded-xl bg-[#065F46] text-white text-xs font-bold">Logout</button>
      <div className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-xs font-bold"><DeleteAccountButton className="text-xs font-bold text-rose-600" /></div>
      <span className="text-xs text-slate-500">Delete removes your account and all your listed businesses permanently.</span>
    </div>
  );
};
