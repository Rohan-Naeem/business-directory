'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Invalid admin username or password');
      }
      // Full reload (not client navigation) so the new admin cookie is
      // definitely sent to /admin and the middleware sees it. Client
      // navigation could re-show the login page from cache.
      window.location.href = '/admin';
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#065F46] text-white flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-extrabold text-[#172B45]">Admin Login</h1>
        </div>
        <p className="text-sm text-slate-500 mb-6">This page is not linked from the public site. Only use it if you know the admin login.</p>
        <p className="text-xs text-slate-400 mb-6">If login keeps asking again, set ADMIN_USERNAME and ADMIN_PASSWORD in Vercel, then Redeploy — adding them alone does not update the running site. Use the same domain for login and for /admin.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#065F46]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#065F46]" />
          </div>
          {error && <p className="text-sm text-rose-600 font-semibold">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#065F46] hover:bg-[#044E39] text-white font-bold text-sm py-2.5 rounded-xl disabled:opacity-50">
            {loading ? 'Checking...' : 'Login to Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}
