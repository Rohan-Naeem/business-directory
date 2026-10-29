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
  status: 'pending' | 'approved' | 'rejected';
  is_featured: boolean;
  is_verified: boolean;
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
