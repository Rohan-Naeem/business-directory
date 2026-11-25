import { Review } from '../types';

// No seeded reviews. The original 7 sample reviews (all 5-star, example.com
// emails, written at seed time) were fabricated demo data and have been
// removed. Ratings on the site are only ever computed from real reviews
// submitted through the site and approved in admin. Until such reviews
// exist, listings show "No reviews yet" and no star rating.
export const INITIAL_REVIEWS: Review[] = [];
