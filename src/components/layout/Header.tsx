'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  PlusCircle, 
  Globe2, 
  Layers, 
  User,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { CategoryIcon } from '../ui/CategoryIcon';
import { getSupabaseClient } from '@/lib/supabase/client';
import { DeleteAccountButton } from '@/components/account/DeleteAccountButton';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [directoriesOpen, setDirectoriesOpen] = useState(false);
  const router = useRouter();
  const [authUser, setAuthUser] = useState<{ name: string; email: string; avatarUrl?: string } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [myBusinesses, setMyBusinesses] = useState<any[]>([]);
  const [myBizLoading, setMyBizLoading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
    setAuthUser(null); setProfileOpen(false); setMyBusinesses([]);
    router.push('/'); router.refresh();
  }

  // Load this user's businesses when the profile menu opens.
  useEffect(() => {
    if (!profileOpen || !authUser) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    setMyBizLoading(true);
    supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) { setMyBizLoading(false); return; }
      const res = await fetch('/api/my-businesses', { headers: { Authorization: `Bearer ${token}` } });
      const body = await res.json().catch(() => ({}));
      setMyBusinesses(body.businesses || []); setMyBizLoading(false);
    });
  }, [profileOpen, authUser]);

  // Logged-in users see their profile avatar, not Login / Sign Up.
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) { setAuthUser(null); return; }
      const meta: any = user.user_metadata || {};
      setAuthUser({
        name: meta.full_name || meta.name || user.email || 'My Account',
        email: user.email || '',
        avatarUrl: meta.avatar_url || meta.picture || undefined,
      });
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) { setAuthUser(null); return; }
      const meta: any = user.user_metadata || {};
      setAuthUser({
        name: meta.full_name || meta.name || user.email || 'My Account',
        email: user.email || '',
        avatarUrl: meta.avatar_url || meta.picture || undefined,
      });
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const catDropdownRef = useRef<HTMLDivElement>(null);
  const dirDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click or route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCategoriesOpen(false);
    setDirectoriesOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
      if (dirDropdownRef.current && !dirDropdownRef.current.contains(event.target as Node)) {
        setDirectoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const featuredCategories = [
    { name: 'IT & Software', slug: 'it-software', icon: 'Laptop', desc: 'Custom software & cloud' },
    { name: 'Healthcare & Medical', slug: 'healthcare', icon: 'Stethoscope', desc: 'Clinics & hospitals' },
    { name: 'Banking & Finance', slug: 'banking-finance', icon: 'Building2', desc: 'Banks & accounting' },
    { name: 'Construction & Real Estate', slug: 'construction-real-estate', icon: 'HardHat', desc: 'Developers & agencies' },
    { name: 'Restaurants & Dining', slug: 'restaurants-food', icon: 'UtensilsCrossed', desc: 'Fine dining & cafes' },
    { name: 'Legal Services', slug: 'legal-services', icon: 'Scale', desc: 'Corporate & immigration' },
  ];

  const countries = [
    { 
      name: 'Pakistan', 
      slug: 'pakistan', 
      flag: '🇵🇰', 
      cities: ['Lahore', 'Karachi', 'Islamabad', 'Multan', 'Rawalpindi'] 
    },
    { 
      name: 'United States', 
      slug: 'usa', 
      flag: '🇺🇸', 
      cities: ['New York City', 'San Francisco', 'Los Angeles', 'Austin', 'Chicago'] 
    },
    { 
      name: 'United Kingdom', 
      slug: 'uk', 
      flag: '🇬🇧', 
      cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow'] 
    },
  ];

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image src="/logo.svg" alt="Global Bizz Hub logo" width={44} height={44} className="w-11 h-11 group-hover:scale-105 transition-transform" priority />
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-[#172B45] flex items-center gap-1.5">
                Global<span className="text-[#10B981]">Bizz Hub</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 -mt-1">
                Global Business Directory
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-700">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 ${pathname === '/' ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
            >
              Home
            </Link>

            {/* Categories Mega Dropdown */}
            <div className="relative" ref={catDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setCategoriesOpen(!categoriesOpen);
                  setDirectoriesOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 cursor-pointer ${categoriesOpen || pathname.startsWith('/categories') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
                aria-expanded={categoriesOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-[540px] mt-2 p-5 bg-white rounded-2xl shadow-xl border border-slate-200 grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-150">
                  <div className="col-span-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Popular Industries</span>
                    <Link href="/categories" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
                      View all categories <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {featuredCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#065F46] flex items-center justify-center shrink-0 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                        <CategoryIcon name={cat.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#172B45] group-hover:text-[#065F46] transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {cat.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Directories Dropdown */}
            <div className="relative" ref={dirDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setDirectoriesOpen(!directoriesOpen);
                  setCategoriesOpen(false);
                }}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 cursor-pointer ${directoriesOpen || pathname.startsWith('/directories') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
                aria-expanded={directoriesOpen}
              >
                <Globe2 className="w-4 h-4 text-[#10B981]" />
                <span>Directories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${directoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {directoriesOpen && (
                <div className="absolute top-full left-0 w-[420px] mt-2 p-5 bg-white rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
                  <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Supported Countries</span>
                    <Link href="/directories" className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1">
                      Browse all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  {countries.map((cnt) => (
                    <div key={cnt.slug} className="p-2 rounded-xl hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Link 
                          href={`/directories/${cnt.slug}`}
                          className="flex items-center gap-2 font-bold text-slate-900 hover:text-[#065F46]"
                        >
                          <span className="text-xl">{cnt.flag}</span>
                          <span>{cnt.name}</span>
                        </Link>
                        <Link 
                          href={`/directories/${cnt.slug}`} 
                          className="text-xs font-semibold text-[#065F46] hover:underline"
                        >
                          View Country
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cnt.cities.map(city => {
                          const citySlug = city.toLowerCase().replace(/\s+/g, '-');
                          return (
                            <Link
                              key={city}
                              href={`/directories/${cnt.slug}/${citySlug}`}
                              className="text-xs px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-600 transition-colors font-medium"
                            >
                              {city}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/search" 
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:text-[#065F46] hover:bg-slate-50 ${pathname.startsWith('/search') ? 'text-[#065F46] font-semibold bg-emerald-50/60' : ''}`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search</span>
            </Link>

          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {authUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  title={authUser.name}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#065F46] px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-expanded={profileOpen}
                >
                  {authUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={authUser.avatarUrl} alt={authUser.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  ) : (
                    <span className="w-10 h-10 rounded-full bg-[#065F46] text-white flex items-center justify-center text-base font-bold">
                      {authUser.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="max-w-[140px] truncate">{authUser.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="text-sm font-bold text-[#172B45] truncate">{authUser.name}</div>
                      <div className="text-xs text-slate-500 truncate">{authUser.email}</div>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">My Dashboard</Link>
                    <div className="px-4 pt-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">My Businesses</div>
                    <div className="max-h-56 overflow-y-auto">
                      {myBizLoading ? (
                        <div className="px-4 py-2 text-xs text-slate-500">Loading...</div>
                      ) : myBusinesses.length === 0 ? (
                        <div className="px-4 py-2 text-xs text-slate-500">No business listed yet.</div>
                      ) : myBusinesses.slice(0, 5).map((biz: any) => (
                        <Link key={biz.id} href={`/business/${biz.slug}`} className="flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                          <span className="truncate">{biz.name}</span>
                          <span className="ml-2 shrink-0 text-[10px] font-bold uppercase text-slate-500">{biz.status}</span>
                        </Link>
                      ))}
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-xs font-bold text-[#065F46] hover:bg-slate-50 border-t border-slate-100">View all my businesses</Link>
                    <div className="border-t border-slate-100">
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                      <DeleteAccountButton />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#065F46] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>

                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-2 bg-[#065F46] hover:bg-[#044E39] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-900/10 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <span>Login</span>
                </Link>
              </>
            )}

            <Link
              href="/add-business"
              className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-900/10 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Business</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/add-business"
              className="inline-flex items-center gap-1 bg-[#10B981] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200 max-h-[85vh] overflow-y-auto">
          <div className="space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${pathname === '/' ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-800'}`}
            >
              Home
            </Link>
            
            <Link
              href="/search"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold ${pathname.startsWith('/search') ? 'bg-emerald-50 text-[#065F46]' : 'text-slate-800'}`}
            >
              <Search className="w-5 h-5 text-slate-400" />
              Search Directory
            </Link>

            <Link
              href="/categories"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800"
            >
              <Layers className="w-5 h-5 text-slate-400" />
              All Categories
            </Link>

            <Link
              href="/directories"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800"
            >
              <Globe2 className="w-5 h-5 text-slate-400" />
              Country Directories
            </Link>

            {/* Mobile Country List */}
            <div className="pl-4 py-2 space-y-2 border-l-2 border-slate-100 ml-3">
              {countries.map((cnt) => (
                <div key={cnt.slug} className="space-y-1">
                  <Link
                    href={`/directories/${cnt.slug}`}
                    className="flex items-center gap-2 text-sm font-bold text-slate-900"
                  >
                    <span>{cnt.flag}</span>
                    <span>{cnt.name}</span>
                  </Link>
                  <div className="flex flex-wrap gap-1 pl-6">
                    {cnt.cities.slice(0, 3).map(city => (
                      <Link
                        key={city}
                        href={`/directories/${cnt.slug}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium"
                      >
                        {city}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col gap-3">
            {authUser ? (
              <>
              <Link href="/dashboard" className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors">My Businesses & Dashboard</Link>
              <button type="button" onClick={handleLogout} className="w-full text-center py-2.5 px-4 rounded-xl bg-[#065F46] text-white font-semibold text-sm">Logout</button>
              <div className="w-full text-center py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 font-semibold text-sm"><DeleteAccountButton className="w-full text-center text-sm font-semibold text-rose-600" /></div>
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                {authUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={authUser.avatarUrl} alt={authUser.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[#065F46] text-white flex items-center justify-center text-sm font-bold">
                    {authUser.name.charAt(0).toUpperCase()}
                  </span>
                )}
                {authUser.name}
              </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  className="w-full text-center py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Create Your Account
                </Link>
                <Link
                  href="/auth/login"
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-[#065F46] text-white font-semibold text-sm hover:bg-[#044E39] transition-colors shadow-xs"
                >
                  Login
                </Link>
              </>
            )}
            <Link
              href="/add-business"
              className="w-full text-center py-2.5 px-4 rounded-xl bg-[#10B981] text-white font-semibold text-sm hover:bg-[#059669] transition-colors shadow-xs"
            >
              Submit Your Business Listing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

