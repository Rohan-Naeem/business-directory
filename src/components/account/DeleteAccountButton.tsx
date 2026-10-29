'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export const DeleteAccountButton: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function doDelete() {
    setError(''); setLoading(true);
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase?.auth.getSession() || { data: null };
      const token = data?.session?.access_token;
      if (!token) throw new Error('Please login again, then delete your account.');
      const res = await fetch('/api/account', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Delete failed');
      await supabase?.auth.signOut();
      router.push('/');
      router.refresh();
    } catch (e: any) { setError(e.message || 'Delete failed'); } finally { setLoading(false); }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || 'w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors'}>
        Delete Account
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-extrabold text-[#172B45] mb-2">Delete your account?</h3>
            <p className="text-sm text-slate-600 mb-4">This permanently deletes your account and <strong>all businesses you listed</strong> with this email. This cannot be undone.</p>
            {error && <p className="text-sm text-rose-600 font-semibold mb-3">{error}</p>}
            <div className="flex gap-3">
              <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-700">Cancel</button>
              <button type="button" disabled={loading} onClick={doDelete} className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold disabled:opacity-50">{loading ? 'Deleting...' : 'Yes, delete permanently'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
