'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, X, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Business } from '@/lib/types';

interface AdminPendingListingsClientProps {
  initialPending: Business[];
}

export const AdminPendingListingsClient: React.FC<AdminPendingListingsClientProps> = ({
  initialPending,
}) => {
  const [pending, setPending] = useState<Business[]>(initialPending);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (id: string, status: 'approved' | 'rejected', slug?: string) => {
    setActionLoading(id);
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'update_status', status, slug }),
      });

      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || 'Action failed'); }

      setPending(prev => prev.filter(b => b.id !== id));
      setFeedback(`Listing successfully marked as ${status}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {pending.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Business Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Phone / Contact</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pending.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{biz.name}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{biz.short_description}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{biz.city?.name}, {biz.country?.name}</div>
                    <div className="text-[10px] text-slate-400">{biz.address}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {biz.category?.name || 'General'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{biz.phone}</div>
                    <div className="text-[10px] text-slate-400">{biz.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={actionLoading === biz.id}
                        onClick={() => handleAction(biz.id, 'approved', biz.slug)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition-colors cursor-pointer"
                        title="Approve and Publish"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading === biz.id}
                        onClick={() => handleAction(biz.id, 'rejected', biz.slug)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition-colors cursor-pointer"
                        title="Reject Listing"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-xs text-slate-400">
          No submissions are currently pending approval. All active businesses are up-to-date!
        </div>
      )}
    </div>
  );
};
