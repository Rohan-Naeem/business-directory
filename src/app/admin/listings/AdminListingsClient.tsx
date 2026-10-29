'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Check, 
  X, 
  Star, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';
import { Business } from '@/lib/types';

interface AdminListingsClientProps {
  initialBusinesses: Business[];
}

export const AdminListingsClient: React.FC<AdminListingsClientProps> = ({
  initialBusinesses,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filtered = businesses.filter(biz => {
    const matchesSearch = !searchTerm.trim() || 
      biz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.city?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      biz.country?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || biz.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending', slug?: string) => {
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'update_status', status, slug }),
      });
      if (!res.ok) { const body = await res.json().catch(() => ({})); throw new Error(body.error || 'Status update failed'); }

      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      setFeedback(`Listing status updated to ${status}.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const res = await fetch('/api/admin/listings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle_featured' }),
      });
      if (!res.ok) throw new Error('Failed to toggle featured status');

      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, is_featured: !b.is_featured } : b));
      setFeedback('Featured status updated.');
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating featured status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/listings?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Delete failed');

      setBusinesses(prev => prev.filter(b => b.id !== id));
      setFeedback(`"${name}" was deleted.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting business');
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

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full sm:w-80 relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search listings by title or city..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto text-xs font-semibold overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'all' ? 'bg-[#065F46] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({businesses.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({businesses.filter(b => b.status === 'pending').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'approved' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Approved ({businesses.filter(b => b.status === 'approved').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              statusFilter === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rejected ({businesses.filter(b => b.status === 'rejected').length})
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((biz) => (
                <tr key={biz.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{biz.name}</span>
                      <Link href={`/business/${biz.slug}`} target="_blank" className="text-slate-400 hover:text-emerald-600">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                    <div className="text-[11px] text-slate-400">{biz.phone}</div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{biz.city?.name}, {biz.country?.name}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{biz.address}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {biz.category?.name || 'General'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      biz.status === 'approved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : biz.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {biz.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(biz.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                        biz.is_featured
                          ? 'bg-amber-400 text-slate-900 shadow-xs'
                          : 'bg-slate-100 text-slate-400 hover:text-amber-500'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${biz.is_featured ? 'fill-slate-900' : ''}`} />
                      <span>{biz.is_featured ? 'Featured' : 'Standard'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {biz.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(biz.id, 'approved', biz.slug)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      {biz.status !== 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(biz.id, 'rejected', biz.slug)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(biz.id, biz.name)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-1"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
