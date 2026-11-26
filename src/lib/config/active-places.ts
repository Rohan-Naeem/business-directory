// Day 11: which countries and cities are active on the directory.
//
// A country is active when its slug is listed in ACTIVE_COUNTRY_SLUGS.
// A city is active when it is NOT listed in INACTIVE_CITY_SLUGS and it
// has at least MIN_LISTINGS_FOR_ACTIVE_CITY real (approved, non-demo)
// listings. Inactive places are hidden from navigation and the sitemap,
// and their pages are noindexed until they reach the threshold.
//
// Current state (checked 25 Nov 2026): all 3 countries are active, and
// all 30 cities have 29+ real listings — the smallest are Sukkur and
// Islamabad at 29 — so nothing is hidden today. When a new city is added
// with fewer than 20 listings, it stays hidden automatically until it
// reaches 20; to hide a city by hand, add its slug to INACTIVE_CITY_SLUGS.
export const MIN_LISTINGS_FOR_ACTIVE_CITY = 20;

export const ACTIVE_COUNTRY_SLUGS = ['pakistan', 'usa', 'uk'];

export const INACTIVE_CITY_SLUGS: string[] = [];

export function isCountryActive(countrySlug: string): boolean {
  return ACTIVE_COUNTRY_SLUGS.includes(countrySlug.toLowerCase());
}

export function isCityActive(citySlug: string, realListingCount: number): boolean {
  if (INACTIVE_CITY_SLUGS.includes(citySlug.toLowerCase())) return false;
  return realListingCount >= MIN_LISTINGS_FOR_ACTIVE_CITY;
}
