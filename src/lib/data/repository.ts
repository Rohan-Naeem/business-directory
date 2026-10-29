import { 
  Country, 
  Region, 
  City, 
  Category, 
  Subcategory, 
  Business, 
  Review, 
  Report, 
  SearchQueryFilters, 
  SearchResult 
} from '../types';
import { 
  INITIAL_COUNTRIES, 
  INITIAL_REGIONS, 
  INITIAL_CITIES, 
  INITIAL_CATEGORIES, 
  INITIAL_SUBCATEGORIES, 
  INITIAL_BUSINESSES 
} from './initial-data';
import { INITIAL_REVIEWS } from './reviews-data';
import { INITIAL_REPORTS } from './reports-data';
import { getSupabaseServerClient, isSupabaseConfigured } from '../supabase/server';

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
      businesses: [...INITIAL_BUSINESSES],
      reviews: [...INITIAL_REVIEWS],
      reports: [...INITIAL_REPORTS],
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
    category,
    subcategory,
    country,
    region,
    city,
    reviews,
  };
}

export class DirectoryRepository {
  // --- COUNTRIES ---
  static async getCountries(): Promise<Country[]> {
    const store = getStore();
    return store.countries.filter(c => c.is_active).map(c => {
      const count = store.businesses.filter(b => b.country_id === c.id && b.status === 'approved').length;
      return { ...c, business_count: count };
    });
  }

  static async getCountryBySlug(slug: string): Promise<Country | null> {
    const store = getStore();
    const country = store.countries.find(c => c.slug === slug.toLowerCase());
    if (!country) return null;
    const count = store.businesses.filter(b => b.country_id === country.id && b.status === 'approved').length;
    return { ...country, business_count: count };
  }

  // --- REGIONS ---
  static async getRegions(countryId?: string): Promise<Region[]> {
    const store = getStore();
    let regions = store.regions;
    if (countryId) {
      regions = regions.filter(r => r.country_id === countryId);
    }
    return regions.map(r => {
      const count = store.businesses.filter(b => b.region_id === r.id && b.status === 'approved').length;
      return { ...r, business_count: count };
    });
  }

  static async getRegionBySlug(countrySlug: string, regionSlug: string): Promise<Region | null> {
    const country = await this.getCountryBySlug(countrySlug);
    if (!country) return null;
    const store = getStore();
    const region = store.regions.find(r => r.country_id === country.id && r.slug === regionSlug.toLowerCase());
    if (!region) return null;
    const count = store.businesses.filter(b => b.region_id === region.id && b.status === 'approved').length;
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
      const count = store.businesses.filter(b => b.city_id === city.id && b.status === 'approved').length;
      return { ...city, business_count: count };
    });
  }

  static async getCityBySlug(countrySlug: string, citySlug: string): Promise<City | null> {
    const country = await this.getCountryBySlug(countrySlug);
    if (!country) return null;
    const store = getStore();
    const city = store.cities.find(c => c.country_id === country.id && c.slug === citySlug.toLowerCase());
    if (!city) return null;
    const count = store.businesses.filter(b => b.city_id === city.id && b.status === 'approved').length;
    return { ...city, business_count: count };
  }

  // --- CATEGORIES ---
  static async getCategories(): Promise<Category[]> {
    const store = getStore();
    return store.categories
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map(cat => {
        const count = store.businesses.filter(b => b.category_id === cat.id && b.status === 'approved').length;
        return { ...cat, business_count: count };
      });
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const store = getStore();
    const cat = store.categories.find(c => c.slug === slug.toLowerCase());
    if (!cat) return null;
    const count = store.businesses.filter(b => b.category_id === cat.id && b.status === 'approved').length;
    return { ...cat, business_count: count };
  }

  static async getSubcategories(categoryId?: string): Promise<Subcategory[]> {
    const store = getStore();
    let subs = store.subcategories;
    if (categoryId) {
      subs = subs.filter(s => s.category_id === categoryId);
    }
    return subs.map(sub => {
      const count = store.businesses.filter(b => b.subcategory_id === sub.id && b.status === 'approved').length;
      return { ...sub, business_count: count };
    });
  }

  // --- BUSINESSES SEARCH & RETRIEVAL ---
  static async searchBusinesses(filters: SearchQueryFilters = {}): Promise<SearchResult> {
    const store = getStore();
    let results = store.businesses.filter(b => b.status === 'approved');

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
        results = results.filter(b => b.category_id === cat.id);
      }
    }

    // 3. Country Filter (by slug or ID)
    if (filters.country && filters.country !== 'all') {
      const country = store.countries.find(c => c.slug === filters.country || c.id === filters.country || c.code.toLowerCase() === filters.country?.toLowerCase());
      if (country) {
        results = results.filter(b => b.country_id === country.id);
      }
    }

    // 4. City Filter (by slug or ID)
    if (filters.city && filters.city !== 'all') {
      const city = store.cities.find(c => c.slug === filters.city || c.id === filters.city);
      if (city) {
        results = results.filter(b => b.city_id === city.id);
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
    if (!business) return null;
    return populateBusinessRelations(business, store);
  }

  static async getFeaturedBusinesses(limit: number = 6): Promise<Business[]> {
    const store = getStore();
    const featured = store.businesses
      .filter(b => b.status === 'approved' && b.is_featured)
      .slice(0, limit);
    return featured.map(b => populateBusinessRelations(b, store));
  }

  static async getRelatedBusinesses(businessId: string, categoryId: string, limit: number = 3): Promise<Business[]> {
    const store = getStore();
    const related = store.businesses
      .filter(b => b.id !== businessId && b.category_id === categoryId && b.status === 'approved')
      .slice(0, limit);
    return related.map(b => populateBusinessRelations(b, store));
  }

  // --- SUBMISSIONS & ADMIN OPERATIONS ---
  static async createBusiness(data: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'status' | 'rating' | 'review_count' | 'is_featured' | 'is_verified'>): Promise<Business> {
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
    while (store.businesses.some(b => b.slug === slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const newBusiness: Business = {
      ...data,
      id: `biz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      slug,
      status: 'pending', // Always pending initially for admin moderation
      is_featured: false,
      is_verified: false,
      rating: 0,
      review_count: 0,
      created_at: now,
      updated_at: now,
    };

    store.businesses.unshift(newBusiness);
    return populateBusinessRelations(newBusiness, store);
  }

  static async getAllBusinessesForAdmin(statusFilter?: string): Promise<Business[]> {
    const store = getStore();
    let list = store.businesses;
    if (statusFilter && statusFilter !== 'all') {
      list = list.filter(b => b.status === statusFilter);
    }
    return list.map(b => populateBusinessRelations(b, store));
  }

  static async updateBusinessStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<boolean> {
    const store = getStore();
    const biz = store.businesses.find(b => b.id === id);
    if (!biz) return false;
    biz.status = status;
    biz.updated_at = new Date().toISOString();
    return true;
  }

  static async toggleBusinessFeatured(id: string): Promise<boolean> {
    const store = getStore();
    const biz = store.businesses.find(b => b.id === id);
    if (!biz) return false;
    biz.is_featured = !biz.is_featured;
    biz.updated_at = new Date().toISOString();
    return true;
  }

  static async deleteBusiness(id: string): Promise<boolean> {
    const store = getStore();
    const initialLen = store.businesses.length;
    store.businesses = store.businesses.filter(b => b.id !== id);
    return store.businesses.length < initialLen;
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
