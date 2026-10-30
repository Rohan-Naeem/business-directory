'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Check, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Review, Business } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { updateReviewStatusAction } from '../actions';

function getAdminToken(): string | undefined {
  try {
    const m = document.cookie.match(/(?:^|; )gbh_admin_token=([^;]*)/);
    return m ? decodeURIComponent(m[1]) : undefined;
  } catch { return undefined; }
}

interface AdminReviewsClientProps {
  initialReviews: Review[];
  businesses: Business[];
  adminToken?: string;
}

export const AdminReviewsClient: React.FC<AdminReviewsClientProps> = ({
  initialReviews,
  businesses,
  adminToken,
}) => {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const result = await updateReviewStatusAction(id, status, adminToken || getAdminToken());
      if (!result.success) throw new Error(result.error || 'Status update failed');

      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      setFeedback(`Review marked as ${status}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating review status');
    }
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'all' ? 'bg-[#065F46] text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'pending' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Pending Moderation ({reviews.filter(r => r.status === 'pending').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Approved ({reviews.filter(r => r.status === 'approved').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            filter === 'rejected' ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Rejected ({reviews.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Reviewer</th>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Rating & Feedback</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rev) => {
                  const biz = businesses.find(b => b.id === rev.business_id);
                  return (
                    <tr key={rev.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{rev.user_name}</div>
                        <div className="text-[11px] text-slate-400">{rev.user_email}</div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {biz ? (
                          <Link href={`/business/${biz.slug}`} target="_blank" className="hover:text-emerald-600 underline">
                            {biz.name}
                          </Link>
                        ) : rev.business_id}
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center gap-1 text-amber-500 mb-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="font-bold text-slate-800 ml-1">({rev.rating}/5)</span>
                        </div>
                        {rev.title && <div className="font-bold text-slate-800">{rev.title}</div>}
                        <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                          {rev.comment}
                        </p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(rev.created_at)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          rev.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rev.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rev.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {rev.status !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(rev.id, 'approved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Approve"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {rev.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400">
            No reviews match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
