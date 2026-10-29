import React from 'react';

// Passthrough only. The sidebar + guard live in AdminShell, used by
// protected pages only, so /admin/login never shows the admin sidebar.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-100">{children}</div>;
}
