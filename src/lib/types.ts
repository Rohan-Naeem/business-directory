export interface Country {
  id: string;
  name: string;
  slug: string;
  code: string; // ISO 2-letter: PK, US, GB
  flag_emoji: string;
  phone_prefix: string;
  currency: string;
  is_active: boolean;
  business_count?: number;
}

export interface Region {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  code?: string;
  business_count?: number;
}

export interface City {
  id: string;
  region_id: string;
  country_id: string;
  name: string;
  slug: string;
  postal_code?: string;
  is_popular: boolean;
  latitude?: number;
  longitude?: number;
  business_count?: number;
  // Day 11: a city is active when it has enough real listings (see
  // src/lib/config/active-places.ts). Inactive cities are hidden from
  // navigation and the sitemap, and their pages are noindexed until
  // they reach the threshold.
  is_active?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // Lucide icon name
  description: string;
  display_order: number;
  business_count?: number;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  business_count?: number;
}

export interface BusinessHour {
  id?: string;
  business_id?: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  opens_at: string; // e.g., "09:00"
  closes_at: string; // e.g., "18:00"
  is_closed: boolean;
}

export interface BusinessImage {
  id: string;
  business_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}

export interface Review {
  id: string;
  business_id: string;
  user_name: string;
  user_email: string;
  rating: number; // 1 to 5
  title?: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface Report {
  id: string;
  business_id: string;
  reporter_email: string;
  reason: string;
  details?: string;
  status: 'open' | 'resolved' | 'dismissed';
  created_at: string;
}

export interface DuplicateAttempt {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city_id?: string;
  country_id?: string;
  matched_business_slug?: string;
  matched_business_name?: string;
  matched_fields?: string[];
  status: 'duplicate_blocked';
  created_at: string;
}

export interface ModerationLog {
  id: string;
  business_id?: string;
  business_slug?: string;
  business_name?: string;
  action: 'auto_rejected' | 'flagged' | 'duplicate_blocked' | 'approved' | 'rejected' | 'status_changed';
  reason: string;
  details?: Record<string, unknown>;
  actor: 'system' | 'admin';
  created_at: string;
}

// Day 10: a business owner's request to claim (and verify) a listing.
// Approving a claim sets the business's is_verified to true; the Verified
// badge only ever renders when is_verified is true (BusinessCard,
// BusinessProfileClient). Stored in memory + Supabase (migration 003).
export interface ClaimRequest {
  id: string;
  business_id: string;
  business_name: string;
  claimant_name: string;
  claimant_email: string;
  claimant_phone?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface Business {
  id: string;
  user_id?: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  subcategory_id?: string;
  country_id: string;
  region_id: string;
  city_id: string;
  address: string;
  postal_code?: string;
  phone: string;
  email: string;
  website?: string;
  whatsapp?: string;
  logo_url?: string;
  cover_image_url?: string;
  status: 'pending' | 'pending_review' | 'approved' | 'rejected' | 'duplicate_blocked';
  is_featured: boolean;
  is_verified: boolean;
  // Moderation (set by the submission validation system, 25 Nov 2026).
  // moderation_reason is a human-readable reason for admin review;
  // moderation_meta holds machine details (keywords, matched fields,
  // duplicate_of slug). Both are NULL for ordinary listings.
  moderation_reason?: string | null;
  moderation_meta?: {
    keywords?: string[];
    matched_fields?: string[];
    duplicate_of?: string;
    duplicate_name?: string;
    level?: string;
  } | null;
  // True for the original seeded/demo listings. Demo listings are excluded
  // from the homepage, search, category and city pages and from the sitemap.
  // They stay reachable by direct URL until reviewed. Never invent data to
  // un-flag one: only set false when the business and its contact details
  // have been confirmed real.
  is_demo?: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;

  // Joined relations
  category?: Category;
  subcategory?: Subcategory;
  country?: Country;
  region?: Region;
  city?: City;
  hours?: BusinessHour[];
  images?: BusinessImage[];
  reviews?: Review[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface SearchQueryFilters {
  q?: string;
  category?: string; // slug or id
  country?: string; // slug or id
  city?: string; // slug or id
  region?: string; // slug or id
  sort?: 'featured' | 'rating' | 'reviews' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  businesses: Business[];
  total: number;
  page: number;
  totalPages: number;
  filters: SearchQueryFilters;
}
