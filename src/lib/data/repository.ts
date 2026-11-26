import { 
  Country, 
  Region, 
  City, 
  Category, 
  Subcategory, 
  Business, 
  Review, 
  Report, 
  DuplicateAttempt,
  ModerationLog,
  ClaimRequest,
  SearchQueryFilters, 
  SearchResult 
} from '../types';
import {
  isStrongDuplicate,
  countryKeyFromId,
  type ComparableBusiness,
} from '../validation/normalize';
import { 
  INITIAL_COUNTRIES, 
  INITIAL_REGIONS, 
  INITIAL_CITIES, 
  INITIAL_CATEGORIES, 
  INITIAL_SUBCATEGORIES, 
  INITIAL_BUSINESSES 
} from './initial-data';
import { INITIAL_REVIEWS } from './reviews-data';
import { TOP_BUSINESSES } from './top-businesses';
import { INITIAL_REPORTS } from './reports-data';
import { getSupabaseServerClient, isSupabaseConfigured } from '../supabase/server';
import { isCityActive, isCountryActive } from '../config/active-places';

// In-memory data store for local/fallback execution
interface DataStore {
  countries: Country[];
  regions: Region[];
  cities: City[];
  categories: Category[];
  subcategories: Subcategory[];
  businesses: Business[];
  reviews: Review[];
  reports: Report[];
  duplicate_attempts: DuplicateAttempt[];
  moderation_logs: ModerationLog[];
  claims: ClaimRequest[];
}

const globalForStore = globalThis as unknown as { __directory_store?: DataStore };

function getStore(): DataStore {
  if (!globalForStore.__directory_store) {
    globalForStore.__directory_store = {
      countries: [...INITIAL_COUNTRIES],
      regions: [...INITIAL_REGIONS],
      cities: [...INITIAL_CITIES],
      categories: [...INITIAL_CATEGORIES],
      subcategories: [...INITIAL_SUBCATEGORIES],
      businesses: [...INITIAL_BUSINESSES, ...TOP_BUSINESSES],
      reviews: [...INITIAL_REVIEWS],
      reports: [...INITIAL_REPORTS],
      duplicate_attempts: [],
      moderation_logs: [],
      claims: [],
    };
  }
  return globalForStore.__directory_store;
}

// Helper to populate relations on a business object
function populateBusinessRelations(biz: Business, store: DataStore): Business {
  const category = store.categories.find(c => c.id === biz.category_id);
  const subcategory = store.subcategories.find(s => s.id === biz.subcategory_id);
  const country = store.countries.find(c => c.id === biz.country_id);
  const region = store.regions.find(r => r.id === biz.region_id);
  const city = store.cities.find(c => c.id === biz.city_id);
  const reviews = store.reviews.filter(r => r.business_id === biz.id && r.status === 'approved');

  return {
    ...biz,
    // Keep Supabase-populated relations when the in-memory store has no
    // matching UUID row (Supabase IDs differ from seed IDs).
    category: category || biz.category,
    subcategory: subcategory || biz.subcategory,
    country: country || biz.country,
    region: region || biz.region,
    city: city || biz.city,
    reviews: biz.reviews ?? reviews,
  };
}


// --- Supabase persistence for businesses (admin moderation) ---
// The site historically kept businesses only in memory, so a submission made
// on one serverless instance never reached /admin on another. When Supabase
// is configured, submissions are also written to the public.businesses table
// (status pending) and admin/public reads merge Supabase rows with the
// in-memory seed store. In-memory IDs (cnt-pk, cat-it, ...) do not match
// Supabase UUIDs, so they are resolved by slug, creating a missing
// region/city/category/subcategory row when needed.
function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function fetchSupabaseLookups(client: any) {
  const [countries, regions, cities, categories, subcategories] = await Promise.all([
    client.from('countries').select('*'),
    client.from('regions').select('*'),
    client.from('cities').select('*'),
    client.from('categories').select('*'),
    client.from('subcategories').select('*'),
  ]);
  const byId = (rows: any[]) => new Map<string, any>((rows || []).map((r: any) => [r.id, r]));
  return {
    countries: byId(countries.data || []),
    regions: byId(regions.data || []),
    cities: byId(cities.data || []),
    categories: byId(categories.data || []),
    subcategories: byId(subcategories.data || []),
  };
}

function mapSupabaseBusiness(row: any, lookups: any): Business {
  return {
    id: row.id,
    user_id: row.user_id || undefined,
    name: row.name,
    slug: row.slug,
    description: row.description,
    short_description: row.short_description,
    category_id: row.category_id,
    subcategory_id: row.subcategory_id || undefined,
    country_id: row.country_id,
    region_id: row.region_id,
    city_id: row.city_id,
    address: row.address,
    postal_code: row.postal_code || undefined,
    phone: row.phone,
    email: row.email,
    website: row.website || undefined,
    whatsapp: row.whatsapp || undefined,
    logo_url: row.logo_url || undefined,
    cover_image_url: row.cover_image_url || undefined,
    status: row.status,
    is_featured: !!row.is_featured,
    is_verified: !!row.is_verified,
    moderation_reason: row.moderation_reason || null,
    moderation_meta: row.moderation_meta || null,
    rating: Number(row.rating || 0),
    review_count: Number(row.review_count || 0),
    created_at: row.created_at,
    updated_at: row.updated_at,
    category: lookups.categories.get(row.category_id),
    subcategory: row.subcategory_id ? lookups.subcategories.get(row.subcategory_id) : undefined,
    country: lookups.countries.get(row.country_id),
    region: lookups.regions.get(row.region_id),
    city: lookups.cities.get(row.city_id),
    reviews: [],
  } as Business;
}

async function fetchSupabaseBusinesses(statusFilter?: string): Promise<Business[]> {
  try {
    const client = getSupabaseServerClient();
    if (!client) return [];
    let query = client.from('businesses').select('*').order('created_at', { ascending: false });
    if (statusFilter && statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (error || !data) { console.error('Supabase businesses fetch failed:', error?.message); return []; }
    const lookups = await fetchSupabaseLookups(client);
    return (data as any[]).map((row) => mapSupabaseBusiness(row, lookups));
  } catch (err) {
    console.error('Supabase businesses fetch failed:', err);
    return [];
  }
}

async function resolveSupabaseLookupId(client: any, table: string, slug: string, insertRow?: Record<string, any>): Promise<string | null> {
  const { data } = await client.from(table).select('id').eq('slug', slug).maybeSingle();
  if (data?.id) return data.id;
  if (!insertRow) return null;
  const { data: created, error } = await client.from(table).insert(insertRow).select('id').single();
  if (error || !created?.id) { console.error(`Supabase ${table} create failed:`, error?.message); return null; }
  return created.id;
}

async function persistBusinessToSupabase(
  data: any,
  slug: string,
  options?: { status?: Business['status']; moderation_reason?: string | null; moderation_meta?: Record<string, unknown> | null },
): Promise<string | null> {
  try {
    const client = getSupabaseServerClient();
    if (!client) return null;
    const store = getStore();
    const countryRec = store.countries.find((c) => c.id === data.country_id || c.slug === data.country_id);
    const regionRec = store.regions.find((r) => r.id === data.region_id || r.slug === data.region_id);
    const cityRec = store.cities.find((c) => c.id === data.city_id || c.slug === data.city_id);
    const categoryRec = store.categories.find((c) => c.id === data.category_id || c.slug === data.category_id);
    const subcategoryRec = data.subcategory_id ? store.subcategories.find((s) => s.id === data.subcategory_id || s.slug === data.subcategory_id) : undefined;
    if (!countryRec || !regionRec || !cityRec || !categoryRec) return null;

    const countryId = isUuid(countryRec.id) ? countryRec.id : await resolveSupabaseLookupId(client, 'countries', countryRec.slug, { name: countryRec.name, slug: countryRec.slug, code: countryRec.code, flag_emoji: countryRec.flag_emoji, phone_prefix: countryRec.phone_prefix, currency: countryRec.currency, is_active: true });
    if (!countryId) return null;
    const regionId = isUuid(regionRec.id) ? regionRec.id : await resolveSupabaseLookupId(client, 'regions', regionRec.slug, { country_id: countryId, name: regionRec.name, slug: regionRec.slug, code: regionRec.code || regionRec.slug.toUpperCase().slice(0, 3) });
    if (!regionId) return null;
    const cityId = isUuid(cityRec.id) ? cityRec.id : await resolveSupabaseLookupId(client, 'cities', cityRec.slug, { country_id: countryId, region_id: regionId, name: cityRec.name, slug: cityRec.slug, postal_code: cityRec.postal_code || null, is_popular: !!cityRec.is_popular });
    if (!cityId) return null;
    const categoryId = isUuid(categoryRec.id) ? categoryRec.id : await resolveSupabaseLookupId(client, 'categories', categoryRec.slug, { name: categoryRec.name, slug: categoryRec.slug, icon: categoryRec.icon, description: categoryRec.description, display_order: categoryRec.display_order || 0 });
    if (!categoryId) return null;
    let subcategoryId: string | null = null;
    if (subcategoryRec) {
      subcategoryId = isUuid(subcategoryRec.id) ? subcategoryRec.id : await resolveSupabaseLookupId(client, 'subcategories', subcategoryRec.slug, { category_id: categoryId, name: subcategoryRec.name, slug: subcategoryRec.slug });
    }

    // Slug must be unique in Supabase too, not just in this instance's memory.
    // A repeat test on another serverless instance reuses the same slug and
    // would otherwise fail silently while the form still shows success.
    let finalSlug = slug;
    let created: any = null;
    const baseRow = {
      name: data.name, slug, description: data.description, short_description: data.short_description,
      category_id: categoryId, subcategory_id: subcategoryId, country_id: countryId, region_id: regionId, city_id: cityId,
      address: data.address, postal_code: data.postal_code || null, phone: data.phone, email: data.email,
      website: data.website || null, whatsapp: data.whatsapp || null, logo_url: data.logo_url || null, cover_image_url: data.cover_image_url || null,
      user_id: (data as any).user_id || null,
      status: options?.status || 'pending',
      moderation_reason: options?.moderation_reason || null,
      moderation_meta: options?.moderation_meta || null,
      is_featured: false, is_verified: false, rating: 0, review_count: 0,
    };
    for (let attempt = 0; attempt < 5; attempt++) {
      const trySlug = attempt === 0 ? slug : `${slug}-${attempt + 1}`;
      let row: Record<string, any> = { ...baseRow, slug: trySlug };
      let { data: inserted, error } = await client.from('businesses').insert(row).select('id').single();
      // Migration 002 (moderation statuses/columns) may not have run yet in
      // Supabase. Fall back to the legacy columns so the submission still
      // lands in the database; the in-memory record keeps the true status.
      if (error && (error.code === '42703' || error.code === '23514')) {
        console.warn('Supabase moderation columns/status not yet migrated; saving as legacy pending row.');
        const { moderation_reason: _mr, moderation_meta: _mm, ...legacyRow } = row;
        legacyRow.status = 'pending';
        ({ data: inserted, error } = await client.from('businesses').insert(legacyRow).select('id').single());
      }
      if (!error && inserted?.id) { created = inserted; finalSlug = trySlug; break; }
      if (error?.code !== '23505') { console.error('Supabase business insert failed:', error?.message); return null; }
    }
    if (!created?.id) { console.error('Supabase business insert failed: slug already exists after retries'); return null; }
    // Return the final slug so the in-memory copy matches the database row.
    (persistBusinessToSupabase as any)._lastSlug = finalSlug;
    if (Array.isArray(data.hours) && data.hours.length > 0) {
      await client.from('business_hours').insert(data.hours.map((h: any) => ({ business_id: created.id, day_of_week: h.day_of_week, opens_at: h.opens_at, closes_at: h.closes_at, is_closed: !!h.is_closed })));
    }
    return created.id;
  } catch (err) {
    console.error('Supabase business insert failed:', err);
    return null;
  }
}

function mergeBusinesses(primary: Business[], secondary: Business[]): Business[] {
  const seen = new Set<string>();
  const out: Business[] = [];
  for (const b of [...primary, ...secondary]) {
    const key = b.slug.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(b);
  }
  return out;
}

export class DirectoryRepository {
  // --- COUNTRIES ---
  static async getCountries(): Promise<Country[]> {
    const store = getStore();
    return store.countries.filter(c => c.is_active).map(c => {
      const count = store.businesses.filter(b => b.country_id === c.id && b.status === 'approved' && !b.is_demo).length;
      // Day 11: is_active from the active-places config (all 3 are active).
      return { ...c, business_count: count, is_active: isCountryActive(c.slug) };
    });
  }

  static async getCountryBySlug(slug: string): Promise<Country | null> {
    const store = getStore();
    const country = store.countries.find(c => c.slug === slug.toLowerCase());
    if (!country) return null;
    const count = store.businesses.filter(b => b.country_id === country.id && b.status === 'approved' && !b.is_demo).length;
    // Day 11: is_active from the active-places config.
    return { ...country, business_count: count, is_active: isCountryActive(country.slug) };
  }

  // --- REGIONS ---
  static async getRegions(countryId?: string): Promise<Region[]> {
    const store = getStore();
    let regions = store.regions;
    if (countryId) {
      regions = regions.filter(r => r.country_id === countryId);
    }
    return regions.map(r => {
      const count = store.businesses.filter(b => b.region_id === r.id && b.status === 'approved' && !b.is_demo).length;
      return { ...r, business_count: count };
    });
  }

  static async getRegionBySlug(countrySlug: string, regionSlug: string): Promise<Region | null> {
    const country = await this.getCountryBySlug(countrySlug);
    if (!country) return null;
    const store = getStore();
    const region = store.regions.find(r => r.country_id === country.id && r.slug === regionSlug.toLowerCase());
    if (!region) return null;
    const count = store.businesses.filter(b => b.region_id === region.id && b.status === 'approved' && !b.is_demo).length;
    return { ...region, business_count: count };
  }

  // --- CITIES ---
  static async getCities(options?: { countryId?: string; regionId?: string; popularOnly?: boolean }): Promise<City[]> {
    const store = getStore();
    let cities = store.cities;
    if (options?.countryId) {
      cities = cities.filter(c => c.country_id === options.countryId);
    }
    if (options?.regionId) {
      cities = cities.filter(c => c.region_id === options.regionId);
    }
    if (options?.popularOnly) {
      cities = cities.filter(c => c.is_popular);
    }
    return cities.map(city => {
      const count = store.businesses.filter(b => b.city_id === city.id && b.status === 'approved' && !b.is_demo).length;
      // Day 11: a city is active at 20+ real listings (config).
      return { ...city, business_count: count, is_active: isCityActive(city.slug, count) };
    });
  }

  static async getCityBySlug(countrySlug: string, citySlug: string): Promise<City | null> {
    const country = await this.getCountryBySlug(countrySlug);
    if (!country) return null;
    const store = getStore();
    const city = store.cities.find(c => c.country_id === country.id && c.slug === citySlug.toLowerCase());
    if (!city) return null;
    const count = store.businesses.filter(b => b.city_id === city.id && b.status === 'approved' && !b.is_demo).length;
    // Day 11: a city is active at 20+ real listings (config).
    return { ...city, business_count: count, is_active: isCityActive(city.slug, count) };
  }

  // --- CATEGORIES ---
  static async getCategories(): Promise<Category[]> {
    const store = getStore();
    return store.categories
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => {
        const count = store.businesses.filter(b => b.category_id === cat.id && b.status === 'approved' && !b.is_demo).length;
        return { ...cat, business_count: count };
      });
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const store = getStore();
    const cat = store.categories.find(c => c.slug === slug.toLowerCase());
    if (!cat) return null;
    const count = store.businesses.filter(b => b.category_id === cat.id && b.status === 'approved' && !b.is_demo).length;
    return { ...cat, business_count: count };
  }

  static async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    const store = getStore();
    let subs = store.subcategories;
    if (categoryId) {
      subs = subs.filter(s => s.category_id === categoryId);
    }
    return subs.map(sub => {
      const count = store.businesses.filter(b => b.subcategory_id === sub.id && b.status === 'approved' && !b.is_demo).length;
      return { ...sub, business_count: count };
    });
  }

  // --- DIRECTORY STATS (Day 4: real data only — approved, non-demo) ---
  // Counts are derived from searchBusinesses so they match the sitemap and
  // city/category pages exactly (demo listings excluded, Supabase merged).
  // populated = cities with >=1 listing; major = cities with >=20 listings.
  static async getDirectoryStats(): Promise<{
    totalListings: number;
    activeCountries: number;
    populatedCities: number;
    coveredCategories: number;
    majorCities: number;
  }> {
    const { businesses, total } = await this.searchBusinesses({ limit: 10000 });
    const countryIds = new Set(businesses.map(b => b.country_id));
    const categoryIds = new Set(businesses.map(b => b.category_id));
    const cityCounts = new Map<string, number>();
    for (const b of businesses) {
      cityCounts.set(b.city_id, (cityCounts.get(b.city_id) || 0) + 1);
    }
    let majorCities = 0;
    for (const count of cityCounts.values()) {
      if (count >= 20) majorCities++;
    }
    return {
      totalListings: total,
      activeCountries: countryIds.size,
      populatedCities: cityCounts.size,
      coveredCategories: categoryIds.size,
      majorCities,
    };
  }

  // --- BUSINESSES SEARCH & RETRIEVAL ---
  static async searchBusinesses(filters: SearchQueryFilters = {}): Promise<SearchResult> {
    const store = getStore();
    let allApproved = store.businesses.filter(b => b.status === 'approved' && !b.is_demo);
    if (isSupabaseConfigured()) {
      const fromDb = await fetchSupabaseBusinesses('approved');
      allApproved = mergeBusinesses(fromDb, allApproved);
    }
    let results = allApproved;

    // 1. Text Search (Name, short_description, description, address)
    if (filters.q && filters.q.trim()) {
      const query = filters.q.toLowerCase().trim();
      results = results.filter(b => 
        b.name.toLowerCase().includes(query) ||
        b.short_description.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.address.toLowerCase().includes(query)
      );
    }

    // 2. Category Filter (by slug or ID)
    if (filters.category && filters.category !== 'all') {
      const cat = store.categories.find(c => c.slug === filters.category || c.id === filters.category);
      if (cat) {
        results = results.filter(b => b.category_id === cat.id || b.category?.slug === cat.slug);
      }
    }

    // 3. Country Filter (by slug or ID)
    if (filters.country && filters.country !== 'all') {
      const country = store.countries.find(c => c.slug === filters.country || c.id === filters.country || c.code.toLowerCase() === filters.country?.toLowerCase());
      if (country) {
        results = results.filter(b => b.country_id === country.id || b.country?.slug === country.slug);
      }
    }

    // 4. City Filter (by slug or ID)
    if (filters.city && filters.city !== 'all') {
      const city = store.cities.find(c => c.slug === filters.city || c.id === filters.city);
      if (city) {
        results = results.filter(b => b.city_id === city.id || b.city?.slug === city.slug);
      }
    }

    // 4b. Region Filter (by slug or ID) — Day 6: region pages list their businesses
    if (filters.region && filters.region !== 'all') {
      const region = store.regions.find(r => r.slug === filters.region || r.id === filters.region);
      if (region) {
        results = results.filter(b => b.region_id === region.id);
      }
    }

    // 5. Sorting
    const sort = filters.sort || 'featured';
    results = results.sort((a, b) => {
      if (sort === 'featured') {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return b.rating - a.rating;
      }
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'reviews') return b.review_count - a.review_count;
      if (sort === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

    const total = results.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 9);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = results.slice((page - 1) * limit, page * limit);

    const populated = paginated.map(b => populateBusinessRelations(b, store));

    return {
      businesses: populated,
      total,
      page,
      totalPages,
      filters,
    };
  }

  static async getBusinessBySlug(slug: string): Promise<Business | null> {
    const store = getStore();
    const business = store.businesses.find(b => b.slug === slug.toLowerCase());
    if (business) return populateBusinessRelations(business, store);
    if (isSupabaseConfigured()) {
      const fromDb = await fetchSupabaseBusinesses('all');
      const found = fromDb.find(b => b.slug === slug.toLowerCase());
      if (found) return found;
    }
    return null;
  }

  // Day 10: lookup by id (used by the claims API, which receives an id).
  static async getBusinessById(id: string): Promise<Business | null> {
    const store = getStore();
    const business = store.businesses.find(b => b.id === id);
    if (business) return populateBusinessRelations(business, store);
    if (isSupabaseConfigured()) {
      const fromDb = await fetchSupabaseBusinesses('all');
      const found = fromDb.find(b => b.id === id);
      if (found) return found;
    }
    return null;
  }

  static async getFeaturedBusinesses(limit: number = 6): Promise<Business[]> {
    const store = getStore();
    const featured = store.businesses
      .filter(b => b.status === 'approved' && b.is_featured && !b.is_demo);
    // Fallback: no real business is currently marked featured (the old
    // featured set was all demo data), so fill with the newest real
    // approved listings instead of showing an empty homepage section.
    const filled = [...featured];
    if (filled.length < limit) {
      const newest = store.businesses
        .filter(b => b.status === 'approved' && !b.is_demo && !filled.some(f => f.id === b.id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      filled.push(...newest.slice(0, limit - filled.length));
    }
    return filled.slice(0, limit).map(b => populateBusinessRelations(b, store));
  }

  static async getRelatedBusinesses(businessId: string, categoryId: string, limit: number = 3): Promise<Business[]> {
    const store = getStore();
    const related = store.businesses
      .filter(b => b.id !== businessId && b.category_id === categoryId && b.status === 'approved' && !b.is_demo)
      .slice(0, limit);
    return related.map(b => populateBusinessRelations(b, store));
  }

  // --- SUBMISSIONS & ADMIN OPERATIONS ---
  static async createBusiness(
    data: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'status' | 'rating' | 'review_count' | 'is_featured' | 'is_verified'>,
    options?: { status?: Business['status']; moderation_reason?: string | null; moderation_meta?: Business['moderation_meta'] },
  ): Promise<Business> {
    const store = getStore();
    const now = new Date().toISOString();
    
    // Generate clean unique slug
    let baseSlug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const city = store.cities.find(c => c.id === data.city_id);
    if (city) {
      baseSlug += `-${city.slug}`;
    }
    let slug = baseSlug;
    let counter = 1;
    // Also avoid slugs already in Supabase (other serverless instances
    // do not share this in-memory store).
    let dbSlugs = new Set<string>();
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        const { data } = await client!.from('businesses').select('slug');
        dbSlugs = new Set((data || []).map((r: any) => r.slug));
      } catch { /* pre-check is best effort; persist retries on conflict */ }
    }
    while (store.businesses.some(b => b.slug === slug) || dbSlugs.has(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newBusiness: Business = {
      ...data,
      id: `biz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug,
      status: options?.status || 'pending', // pending by default; validation may set pending_review / rejected
      is_featured: false,
      is_verified: false,
      moderation_reason: options?.moderation_reason || null,
      moderation_meta: options?.moderation_meta || null,
      rating: 0,
      review_count: 0,
      created_at: now,
      updated_at: now,
    };

    // Race guard: re-check duplicates synchronously right before the insert,
    // so two simultaneous identical submissions cannot both land. No await
    // sits between this check and the unshift below.
    const comparable: ComparableBusiness = {
      name: data.name, email: data.email, phone: data.phone, address: data.address,
      city_id: data.city_id, country_id: data.country_id,
      country_slug: countryKeyFromId(data.country_id),
    };
    const raceHit = store.businesses.find((b) => {
      if (b.is_demo || b.status === 'rejected') return false;
      const other: ComparableBusiness = {
        name: b.name, email: b.email, phone: b.phone, address: b.address,
        city_id: b.city_id, country_id: b.country_id,
        country_slug: countryKeyFromId(b.country_id),
      };
      return isStrongDuplicate(comparable, other);
    });
    if (raceHit) {
      const err = new Error('This business may already be registered in our directory. Please check your information or contact our support team.') as Error & { code?: string; duplicateOf?: string };
      err.code = 'DUPLICATE_BUSINESS';
      err.duplicateOf = raceHit.slug;
      throw err;
    }

    store.businesses.unshift(newBusiness);
    // Persist to Supabase when configured, so /admin sees it on any instance.
    // If Supabase save fails, flag it so the form does NOT claim success
    // in the database - an in-memory-only submission will not appear in
    // /admin on another instance and is lost on redeploy.
    let savedToDatabase = false;
    if (isSupabaseConfigured()) {
      try {
        const persistedId = await persistBusinessToSupabase(data, slug, options);
        if (persistedId) {
          savedToDatabase = true;
          const finalSlug = (persistBusinessToSupabase as any)._lastSlug;
          if (finalSlug && finalSlug !== slug) { newBusiness.slug = finalSlug; }
        }
      } catch { /* logged inside */ }
    }
    (newBusiness as any).savedToDatabase = savedToDatabase;
    return populateBusinessRelations(newBusiness, store);
  }

  static async getAllBusinessesForAdmin(statusFilter?: string): Promise<Business[]> {
    const store = getStore();
    let list = store.businesses;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(b => b.status === statusFilter);
    }
    const inMemory = list.map(b => populateBusinessRelations(b, store));
    if (isSupabaseConfigured()) {
      const fromDb = await fetchSupabaseBusinesses(statusFilter);
      // Supabase rows first: they are the durable source of truth.
      return mergeBusinesses(fromDb, inMemory);
    }
    return inMemory;
  }

  static async updateBusinessStatus(id: string, status: Business['status'], slug?: string): Promise<boolean> {
    const store = getStore();
    const biz = store.businesses.find(b => b.id === id);
    if (biz) { biz.status = status; biz.updated_at = new Date().toISOString(); }
    // In-memory-only business on another instance: find its Supabase row by slug.
    if (!biz && slug && isSupabaseConfigured()) {
      const client = getSupabaseServerClient();
      if (client) {
        const { data } = await client.from('businesses').select('id').eq('slug', slug).maybeSingle();
        if (data?.id) return DirectoryRepository.updateBusinessStatus(data.id, status);
      }
    }
    if (isSupabaseConfigured() && isUuid(id)) {
      const client = getSupabaseServerClient();
      if (client) {
        const { data, error } = await client.from('businesses').update({ status }).eq('id', id).select('id').maybeSingle();
        if (error) { console.error('Supabase status update failed:', error.message); return false; }
        if (!data?.id) { console.error('Supabase status update failed: no row updated - check SUPABASE_SERVICE_ROLE_KEY, anon key cannot update pending rows due to RLS'); return false; }
        return true;
      }
    }
    return !!biz;
  }

  // --- MODERATION LOGS & DUPLICATE ATTEMPTS ---
  // Stored in memory (per instance) and, when migration 002 has run,
  // also in Supabase (durable). A failed Supabase insert never blocks the
  // memory log: the admin on this instance still sees the decision.
  static async logDuplicateAttempt(attempt: Omit<DuplicateAttempt, 'id' | 'created_at' | 'status'>): Promise<DuplicateAttempt> {
    const store = getStore();
    const entry: DuplicateAttempt = {
      ...attempt,
      id: `dup-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'duplicate_blocked',
      created_at: new Date().toISOString(),
    };
    store.duplicate_attempts.unshift(entry);
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        await client?.from('duplicate_attempts').insert({ ...entry });
      } catch { /* table may not exist until migration 002 runs */ }
    }
    return entry;
  }

  static async getDuplicateAttempts(): Promise<DuplicateAttempt[]> {
    const store = getStore();
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        const { data } = await client!.from('duplicate_attempts').select('*').order('created_at', { ascending: false }).limit(100);
        if (data?.length) {
          const seen = new Set(store.duplicate_attempts.map(a => a.id));
          return [...(data as DuplicateAttempt[]), ...store.duplicate_attempts.filter(a => !seen.has(a.id))];
        }
      } catch { /* fall through to memory */ }
    }
    return [...store.duplicate_attempts];
  }

  static async logModerationDecision(entry: Omit<ModerationLog, 'id' | 'created_at'>): Promise<ModerationLog> {
    const store = getStore();
    const log: ModerationLog = {
      ...entry,
      id: `mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
    };
    store.moderation_logs.unshift(log);
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        await client?.from('moderation_logs').insert({ ...log });
      } catch { /* table may not exist until migration 002 runs */ }
    }
    return log;
  }

  static async getModerationLogs(): Promise<ModerationLog[]> {
    const store = getStore();
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        const { data } = await client!.from('moderation_logs').select('*').order('created_at', { ascending: false }).limit(100);
        if (data?.length) {
          const seen = new Set(store.moderation_logs.map(l => l.id));
          return [...(data as ModerationLog[]), ...store.moderation_logs.filter(l => !seen.has(l.id))];
        }
      } catch { /* fall through to memory */ }
    }
    return [...store.moderation_logs];
  }

  // ---- Listing claims (Day 10) ----
  // A business owner claims a listing; admin approves (sets is_verified)
  // or rejects. Stored in memory + Supabase (migration 003); until the
  // table exists, the Supabase insert is best-effort and ignored.
  static async submitClaim(data: Omit<ClaimRequest, 'id' | 'status' | 'created_at' | 'reviewed_at' | 'reviewed_by'>): Promise<ClaimRequest> {
    const store = getStore();
    const entry: ClaimRequest = {
      ...data,
      id: `clm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
    };
    store.claims.unshift(entry);
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        await client?.from('claims').insert({ ...entry });
      } catch { /* table may not exist until migration 003 runs */ }
    }
    return entry;
  }

  static async getClaims(status?: ClaimRequest['status']): Promise<ClaimRequest[]> {
    const store = getStore();
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        const { data } = await client!.from('claims').select('*').order('created_at', { ascending: false }).limit(100);
        if (data?.length) {
          const seen = new Set(store.claims.map(c => c.id));
          const merged = [...(data as ClaimRequest[]), ...store.claims.filter(c => !seen.has(c.id))];
          return status ? merged.filter(c => c.status === status) : merged;
        }
      } catch { /* fall through to memory */ }
    }
    const all = [...store.claims];
    return status ? all.filter(c => c.status === status) : all;
  }

  static async updateClaimStatus(id: string, status: 'approved' | 'rejected'): Promise<ClaimRequest | null> {
    const store = getStore();
    const claim = store.claims.find(c => c.id === id);
    if (claim) {
      claim.status = status;
      claim.reviewed_at = new Date().toISOString();
      claim.reviewed_by = 'admin';
      // Approving a claim verifies the listing (the Verified badge renders
      // only when is_verified is true).
      if (status === 'approved') {
        await DirectoryRepository.setBusinessVerified(claim.business_id, true);
      }
    }
    if (isSupabaseConfigured()) {
      try {
        const client = getSupabaseServerClient();
        await client?.from('claims').update({ status, reviewed_at: new Date().toISOString(), reviewed_by: 'admin' }).eq('id', id);
      } catch { /* table may not exist until migration 003 runs */ }
    }
    return claim || null;
  }

  static async setBusinessVerified(id: string, verified: boolean): Promise<boolean> {
    const store = getStore();
    const biz = store.businesses.find(b => b.id === id);
    if (biz) { biz.is_verified = verified; biz.updated_at = new Date().toISOString(); }
    if (isSupabaseConfigured() && isUuid(id)) {
      const client = getSupabaseServerClient();
      if (client) {
        const { error } = await client.from('businesses').update({ is_verified: verified }).eq('id', id);
        if (error) { console.error('Supabase verified update failed:', error.message); return false; }
        return true;
      }
    }
    return !!biz;
  }

  static async toggleBusinessFeatured(id: string): Promise<boolean> {
    const store = getStore();
    const biz = store.businesses.find(b => b.id === id);
    if (biz) { biz.is_featured = !biz.is_featured; biz.updated_at = new Date().toISOString(); }
    if (isSupabaseConfigured() && isUuid(id)) {
      const client = getSupabaseServerClient();
      if (client) { const { data } = await client.from('businesses').select('is_featured').eq('id', id).maybeSingle(); const { error } = await client.from('businesses').update({ is_featured: !(data?.is_featured ?? false) }).eq('id', id); if (error) { console.error('Supabase featured update failed:', error.message); return !!biz; } return true; }
    }
    return !!biz;
  }

  static async deleteBusiness(id: string): Promise<boolean> {
    const store = getStore();
    const initialLen = store.businesses.length;
    store.businesses = store.businesses.filter(b => b.id !== id);
    const removedInMemory = store.businesses.length < initialLen;
    if (isSupabaseConfigured() && isUuid(id)) {
      const client = getSupabaseServerClient();
      if (client) { const { error } = await client.from('businesses').delete().eq('id', id); if (error) { console.error('Supabase delete failed:', error.message); return removedInMemory; } return true; }
    }
    return removedInMemory;
  }

  // --- REVIEWS ---
  static async getReviews(businessId?: string, status: 'approved' | 'pending' | 'rejected' | 'all' = 'approved'): Promise<Review[]> {
    const store = getStore();
    let list = store.reviews;
    if (businessId) {
      list = list.filter(r => r.business_id === businessId);
    }
    if (status !== 'all') {
      list = list.filter(r => r.status === status);
    }
    return list.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async createReview(data: Omit<Review, 'id' | 'created_at' | 'status'>): Promise<Review> {
    const store = getStore();
    const newReview: Review = {
      ...data,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending', // Moderation required
      created_at: new Date().toISOString(),
    };
    store.reviews.unshift(newReview);
    return newReview;
  }

  static async updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
    const store = getStore();
    const rev = store.reviews.find(r => r.id === id);
    if (!rev) return false;
    rev.status = status;

    // Recalculate business rating if approved
    if (status === 'approved') {
      const approvedReviews = store.reviews.filter(r => r.business_id === rev.business_id && r.status === 'approved');
      const biz = store.businesses.find(b => b.id === rev.business_id);
      if (biz) {
        const totalRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
        biz.rating = Number((totalRating / approvedReviews.length).toFixed(1));
        biz.review_count = approvedReviews.length;
      }
    }
    return true;
  }

  // --- REPORTS ---
  static async getReports(): Promise<Report[]> {
    const store = getStore();
    return store.reports.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static async createReport(data: Omit<Report, 'id' | 'created_at' | 'status'>): Promise<Report> {
    const store = getStore();
    const newReport: Report = {
      ...data,
      id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'open',
      created_at: new Date().toISOString(),
    };
    store.reports.unshift(newReport);
    return newReport;
  }

  static async updateReportStatus(id: string, status: 'resolved' | 'dismissed'): Promise<boolean> {
    const store = getStore();
    const report = store.reports.find(r => r.id === id);
    if (!report) return false;
    report.status = status;
    return true;
  }

  // --- GEOGRAPHIC DATA IMPORT ---
  static async importCities(countryId: string, regionId: string, newCities: Array<{ name: string; slug: string; postal_code?: string; is_popular?: boolean }>): Promise<{ added: number; skipped: number }> {
    const store = getStore();
    let added = 0;
    let skipped = 0;

    for (const item of newCities) {
      const exists = store.cities.some(c => c.country_id === countryId && c.slug === item.slug.toLowerCase());
      if (exists) {
        skipped++;
      } else {
        store.cities.push({
          id: `cty-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          country_id: countryId,
          region_id: regionId,
          name: item.name,
          slug: item.slug.toLowerCase(),
          postal_code: item.postal_code,
          is_popular: Boolean(item.is_popular),
        });
        added++;
      }
    }
    return { added, skipped };
  }

  // --- STATS FOR ADMIN DASHBOARD ---
  static async getAdminStats() {
    const store = getStore();
    if (isSupabaseConfigured()) {
      const dbBusinesses = await fetchSupabaseBusinesses('all');
      const merged = mergeBusinesses(dbBusinesses, store.businesses.map(b => populateBusinessRelations(b, store)));
      return {
        totalListings: merged.length,
        approvedListings: merged.filter(b => b.status === 'approved').length,
        pendingListings: merged.filter(b => b.status === 'pending').length,
        featuredListings: merged.filter(b => b.is_featured).length,
        totalCountries: store.countries.length,
        totalRegions: store.regions.length,
        totalCities: store.cities.length,
        totalCategories: store.categories.length,
        totalReviews: store.reviews.length,
        pendingReviews: store.reviews.filter(r => r.status === 'pending').length,
        openReports: store.reports.filter(r => r.status === 'open').length,
      };
    }
    return {
      totalListings: store.businesses.length,
      approvedListings: store.businesses.filter(b => b.status === 'approved').length,
      pendingListings: store.businesses.filter(b => b.status === 'pending').length,
      featuredListings: store.businesses.filter(b => b.is_featured).length,
      totalCountries: store.countries.length,
      totalRegions: store.regions.length,
      totalCities: store.cities.length,
      totalCategories: store.categories.length,
      totalReviews: store.reviews.length,
      pendingReviews: store.reviews.filter(r => r.status === 'pending').length,
      openReports: store.reports.filter(r => r.status === 'open').length,
    };
  }
}
