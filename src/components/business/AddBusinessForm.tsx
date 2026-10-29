'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Country, Region, City, Category, Subcategory } from '@/lib/types';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';

interface AddBusinessFormProps {
  countries: Country[];
  regions: Region[];
  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];
}

export const AddBusinessForm: React.FC<AddBusinessFormProps> = ({
  countries,
  regions,
  cities,
  categories,
  subcategories,
}) => {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);

  // Add Business requires login: send guests to the login page, which
  // already shows "Don't have an account? Create an account" below it.
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase || !isSupabaseConfigured()) { setAuthChecking(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/auth/login?next=/add-business');
      } else {
        setAuthChecking(false);
      }
    });
  }, [router]);

  // Wizard Step: 1 = Basic Info, 2 = Location, 3 = Schedule & Media, 4 = Review & Submit
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<any>(null);
  const [formError, setFormError] = useState('');

  // Form Fields State
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  // Location State
  const [countryId, setCountryId] = useState(countries[0]?.id || '');
  const [regionId, setRegionId] = useState('');
  const [cityId, setCityId] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Filtered Regions and Cities
  const [filteredRegions, setFilteredRegions] = useState<Region[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Subcategory[]>([]);

  // Media
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Working Hours (Monday through Sunday)
  const defaultHours = [
    { day_of_week: 1, name: 'Monday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
    { day_of_week: 2, name: 'Tuesday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
    { day_of_week: 3, name: 'Wednesday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
    { day_of_week: 4, name: 'Thursday', opens_at: '09:00', closes_at: '18:00', is_closed: false },
    { day_of_week: 5, name: 'Friday', opens_at: '09:00', closes_at: '17:00', is_closed: false },
    { day_of_week: 6, name: 'Saturday', opens_at: '10:00', closes_at: '14:00', is_closed: false },
    { day_of_week: 0, name: 'Sunday', opens_at: '00:00', closes_at: '00:00', is_closed: true },
  ];
  const [hours, setHours] = useState(defaultHours);

  // Update regions & cities when countryId changes
  useEffect(() => {
    const regs = regions.filter(r => r.country_id === countryId);
    setFilteredRegions(regs);
    const initialRegId = regs[0]?.id || '';
    setRegionId(initialRegId);

    const cits = cities.filter(c => c.country_id === countryId);
    setFilteredCities(cits);
    setCityId(cits[0]?.id || '');
  }, [countryId, regions, cities]);

  // Update cities when regionId changes
  useEffect(() => {
    if (regionId) {
      const cits = cities.filter(c => c.region_id === regionId);
      setFilteredCities(cits.length > 0 ? cits : cities.filter(c => c.country_id === countryId));
      if (cits.length > 0) {
        setCityId(cits[0].id);
      }
    }
  }, [regionId, cities, countryId]);

  // Update subcategories when category changes
  useEffect(() => {
    const subs = subcategories.filter(s => s.category_id === categoryId);
    setFilteredSubs(subs);
    setSubcategoryId(subs[0]?.id || '');
  }, [categoryId, subcategories]);

  const updateDaySchedule = (dayIndex: number, field: string, value: any) => {
    setHours(prev => prev.map((h, i) => i === dayIndex ? { ...h, [field]: value } : h));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!name.trim()) return 'Business name is required.';
    if (!phone.trim()) return 'Official phone number is required.';
    if (!email.trim() || !email.includes('@')) return 'Valid business email is required.';
    if (!shortDesc.trim()) return 'A brief summary of your business is required.';
    if (!description.trim() || description.length < 30) return 'Detailed description must be at least 30 characters.';
    return '';
  };

  // Step 2 Validation
  const validateStep2 = () => {
    if (!countryId) return 'Please select a country.';
    if (!cityId) return 'Please select a city.';
    if (!address.trim()) return 'Street address is required.';
    return '';
  };

  const handleNext = () => {
    setFormError('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setFormError(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setFormError(err); return; }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { data: sessionData } = supabase ? await supabase.auth.getSession() : { data: null };
      const payload = {
        name: name.trim(),
        category_id: categoryId,
        subcategory_id: subcategoryId || undefined,
        country_id: countryId,
        region_id: regionId,
        city_id: cityId,
        address: address.trim(),
        postal_code: postalCode.trim() || undefined,
        phone: phone.trim(),
        email: email.trim(),
        user_id: sessionData?.session?.user?.id,
        website: website.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        short_description: shortDesc.trim(),
        description: description.trim(),
        cover_image_url: coverImageUrl.trim() || undefined,
        logo_url: logoUrl.trim() || undefined,
        hours: hours.map(h => ({
          day_of_week: h.day_of_week,
          opens_at: h.opens_at,
          closes_at: h.closes_at,
          is_closed: h.is_closed,
        })),
      };

      const res = await fetch('/api/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmissionSuccess(data.business);
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
            Application Received
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172B45] mt-1 mb-2">
            Listing Submitted for Review!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            Your listing for <strong>{submissionSuccess.name}</strong> has been saved. To ensure directory accuracy and prevent spam, our moderation team will review and approve your submission within 24 hours.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 space-y-1 text-left max-w-sm mx-auto">
          <div><span className="font-bold text-slate-700">Submission ID:</span> {submissionSuccess.id}</div>
          <div><span className="font-bold text-slate-700">Status:</span> <span className="text-amber-600 font-bold uppercase">Pending Moderation</span></div>
          <div><span className="font-bold text-slate-700">Target URL:</span> /business/{submissionSuccess.slug}</div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-[#065F46] text-white text-xs font-bold hover:bg-[#044E39] transition-colors"
          >
            Return to Homepage
          </Link>
          <Link
            href="/search"
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Browse Other Listings
          </Link>
        </div>
      </div>
    );
  }

  if (authChecking) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center max-w-3xl mx-auto text-sm text-slate-500">
        Checking login...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden max-w-3xl mx-auto">
      
      {/* Wizard Progress Header */}
      <div className="bg-slate-50 px-6 py-5 border-b border-slate-200/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className={step >= 1 ? 'text-[#065F46] font-extrabold' : ''}>1. Company Info</span>
          <span>&rarr;</span>
          <span className={step >= 2 ? 'text-[#065F46] font-extrabold' : ''}>2. Location</span>
          <span>&rarr;</span>
          <span className={step >= 3 ? 'text-[#065F46] font-extrabold' : ''}>3. Hours & Media</span>
          <span>&rarr;</span>
          <span className={step >= 4 ? 'text-[#065F46] font-extrabold' : ''}>4. Review</span>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
          <div 
            className="bg-[#10B981] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6">
        
        {/* Error Notification */}
        {formError && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* STEP 1: COMPANY BASIC INFO */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#10B981]" />
                Step 1: Business Details & Contact
              </h2>
              <p className="text-xs text-slate-500">
                Provide accurate company details so customers can reach you directly.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Systems Limited, Shaukat Khanum, Apex Cloud..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-emerald-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specialized Subcategory
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-emerald-500"
                >
                  <option value="">General / None</option>
                  {filteredSubs.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +92 42 111 797 836"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@yourcompany.com"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Website (Optional)
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://www.yourcompany.com"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Contact (Optional)
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +923001234567"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Tagline / Summary <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="One sentence summary of your services (max 140 chars)..."
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Business Overview <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description of your business history, specialized products, certifications, and customer offerings..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 2: PHYSICAL LOCATION */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#10B981]" />
                Step 2: Operating Location & Address
              </h2>
              <p className="text-xs text-slate-500">
                Choose your country and city to ensure users in your region discover your listing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-emerald-500"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.flag_emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Region / Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={regionId}
                  onChange={(e) => setRegionId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-emerald-500"
                >
                  {filteredRegions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-emerald-500"
                >
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Physical Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Suite 400, 10 Colmore Row or Phase 1 DHA Commercial"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Postal Code (Optional)
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 54000, 10001, B3 2QD"
                className="w-full sm:w-1/2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE & MEDIA */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#10B981]" />
                Step 3: Operating Schedule & Media
              </h2>
              <p className="text-xs text-slate-500">
                Specify your weekly working hours and link your verified brand imagery.
              </p>
            </div>

            {/* Operating Schedule */}
            <div className="space-y-2 border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Weekly Operating Hours
              </span>
              {hours.map((h, index) => (
                <div key={h.name} className="flex flex-wrap items-center gap-3 text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="w-24 font-bold text-slate-700">{h.name}</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h.is_closed}
                      onChange={(e) => updateDaySchedule(index, 'is_closed', e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-500">Closed</span>
                  </label>
                  {!h.is_closed && (
                    <div className="flex items-center gap-2 ml-auto">
                      <input
                        type="time"
                        value={h.opens_at}
                        onChange={(e) => updateDaySchedule(index, 'opens_at', e.target.value)}
                        className="px-2 py-1 rounded border border-slate-200 text-xs"
                      />
                      <span className="text-slate-400">to</span>
                      <input
                        type="time"
                        value={h.closes_at}
                        onChange={(e) => updateDaySchedule(index, 'closes_at', e.target.value)}
                        className="px-2 py-1 rounded border border-slate-200 text-xs"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Media URLs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Square Logo Image URL
                </label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & SUBMIT */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-xl font-bold text-[#172B45] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                Step 4: Review Your Business Profile
              </h2>
              <p className="text-xs text-slate-500">
                Please verify your details before submitting for moderation.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Business Name:</span>
                <span className="font-bold text-slate-900">{name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Contact:</span>
                <span className="text-slate-800">{phone} • {email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Location:</span>
                <span className="text-slate-800">{address}, {filteredCities.find(c => c.id === cityId)?.name}, {countries.find(c => c.id === countryId)?.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-500">Category:</span>
                <span className="text-slate-800">{categories.find(c => c.id === categoryId)?.name}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-1">Tagline:</span>
                <p className="italic text-slate-700">"{shortDesc}"</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
              <span className="font-bold block mb-1">Standard Listing Submission: 100% Free</span>
              By clicking "Submit for Review", you affirm that you represent this commercial enterprise or have legal authority to request its publication. Our editorial team validates telephone and address credentials before public listing.
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => { setFormError(''); setStep(step - 1); }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#044E39] text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting Application...' : 'Submit for Review'}</span>
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
