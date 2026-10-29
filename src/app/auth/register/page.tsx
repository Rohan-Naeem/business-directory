'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Lock, Mail, User, Phone, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<'business_owner' | 'customer'>('business_owner');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [country, setCountry] = useState('Pakistan');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (accountType === 'business_owner' && !businessName.trim()) {
        setError('Business name is required for business owners.');
        setLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      if (supabase) {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              account_type: accountType,
              phone: phone.trim() || undefined,
              business_name: businessName.trim() || undefined,
              country,
            },
          },
        });
        if (authError) throw authError;
      }

      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#172B45]">
            Global<span className="text-[#10B981]">Bizz Hub</span>
          </span>
        </Link>
        <h1 className="text-2xl font-extrabold text-[#172B45] tracking-tight">
          Create an Account
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          List and manage your enterprise profiles on the directory.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Asad Khan"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                I am signing up as
              </label>
              <select
                required
                value={accountType}
                onChange={(e) => setAccountType(e.target.value as 'business_owner' | 'customer')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="business_owner">Business Owner</option>
                <option value="customer">Customer / Visitor</option>
              </select>
            </div>

            {accountType === 'business_owner' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Name
                </label>
                <div className="relative flex items-center">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Systems Limited"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 300 1234567"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country
              </label>
              <select
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-[#065F46] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
