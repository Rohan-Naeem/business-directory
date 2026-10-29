'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flag, Check, X, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Report, Business } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface AdminReportsClientProps {
  initialReports: Report[];
  businesses: Business[];
}

export const AdminReportsClient: React.FC<AdminReportsClientProps> = ({
  initialReports,
  businesses,
}) => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, status: 'resolved' | 'dismissed') => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Status update failed');

      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      setFeedback(`Report marked as ${status}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating report status');
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

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Business</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Reporter Details</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((rep) => {
                  const biz = businesses.find(b => b.id === rep.business_id);
                  return (
                    <tr key={rep.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        {biz ? (
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{biz.name}</span>
                            <Link href={`/business/${biz.slug}`} target="_blank" className="text-slate-400 hover:text-emerald-600">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">{rep.business_id}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-rose-600">{rep.reason}</div>
                        {rep.details && <p className="text-slate-600 text-[11px] mt-0.5">{rep.details}</p>}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {rep.reporter_email}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {formatDate(rep.created_at)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          rep.status === 'open'
                            ? 'bg-rose-100 text-rose-800'
                            : rep.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {rep.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {rep.status === 'open' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(rep.id, 'resolved')}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Mark Resolved"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateStatus(rep.id, 'dismissed')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Dismiss"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Dismiss</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400">
            No active reports or complaints.
          </div>
        )}
      </div>
    </div>
  );
};
