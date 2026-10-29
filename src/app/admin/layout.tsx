import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, isAdminSession } from '@/lib/admin-auth';
import { 
  Building2, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Star, 
  Flag, 
  Home, 
  Settings, 
  FileText,
  LogOut
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The login page itself must not show the admin sidebar.
  const cookieStore = await cookies();
  const isAdmin = await isAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!isAdmin) {
    return <div className="min-h-screen bg-slate-100">{children}</div>;
  }
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#172B45] text-slate-300 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700/80">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-white tracking-tight block">
                Global Bizz Hub<span className="text-[#10B981]"> Admin</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block -mt-1">
                Moderation Panel
              </span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1 flex-1 text-xs font-semibold">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4 text-emerald-400" />
            <span>Dashboard Overview</span>
          </Link>

          <Link
            href="/admin/listings"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Building2 className="w-4 h-4 text-slate-400" />
            <span>Listings & Approvals</span>
          </Link>

          <Link
            href="/admin/locations"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>Geo Cities & Importer</span>
          </Link>

          <Link
            href="/admin/reviews"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Star className="w-4 h-4 text-slate-400" />
            <span>Customer Reviews</span>
          </Link>

          <Link
            href="/admin/reports"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Flag className="w-4 h-4 text-slate-400" />
            <span>Reported Issues</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700/80 space-y-2 text-xs">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Admin Mode Active
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span>Admin Staff User</span>
            <Link
              href="/api/admin/logout"
              className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </Link>
          </div>
        </header>

        <main className="p-6 sm:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
