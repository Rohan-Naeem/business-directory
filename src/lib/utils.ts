import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BusinessHour } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatTime(timeStr?: string): string {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
}

export interface BusinessOpenStatus {
  isOpen: boolean;
  message: string;
  nextChange?: string;
}

// IANA timezones for the directory's 30 cities (Day 5: badge must use the
// business's own timezone, never the server's local time).
const US_CITY_TIMEZONES: Record<string, string> = {
  'cty-us-la': 'America/Los_Angeles',
  'cty-us-sf': 'America/Los_Angeles',
  'cty-us-sd': 'America/Los_Angeles',
  'cty-us-sea': 'America/Los_Angeles',
  'cty-us-nyc': 'America/New_York',
  'cty-us-buf': 'America/New_York',
  'cty-us-hou': 'America/Chicago',
  'cty-us-aus': 'America/Chicago',
  'cty-us-dal': 'America/Chicago',
  'cty-us-chi': 'America/Chicago',
};

export function getBusinessTimezone(business: { city_id?: string; country_id?: string }): string | undefined {
  if (business.city_id && US_CITY_TIMEZONES[business.city_id]) {
    return US_CITY_TIMEZONES[business.city_id];
  }
  if (business.city_id?.startsWith('cty-pk-')) return 'Asia/Karachi';
  if (business.city_id?.startsWith('cty-gb-')) return 'Europe/London';
  if (business.country_id === 'cnt-pk') return 'Asia/Karachi';
  if (business.country_id === 'cnt-gb') return 'Europe/London';
  if (business.country_id === 'cnt-us') return 'America/New_York';
  return undefined;
}

// Current day-of-week (0 = Sunday) and minutes since midnight, in the given
// IANA timezone. Falls back to the server's local time when no zone is given.
export function getNowInTimezone(timeZone?: string): { day: number; minutes: number } {
  const now = new Date();
  if (!timeZone) {
    return { day: now.getDay(), minutes: now.getHours() * 60 + now.getMinutes() };
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value;
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const weekday = get('weekday') || 'Sun';
  // hour12:false can return 24 for midnight — wrap it.
  const hour = parseInt(get('hour') || '0', 10) % 24;
  const minute = parseInt(get('minute') || '0', 10);
  return { day: dayMap[weekday] ?? now.getDay(), minutes: hour * 60 + minute };
}

export function checkBusinessOpenStatus(hours?: BusinessHour[], timeZone?: string): BusinessOpenStatus {
  if (!hours || hours.length === 0) {
    return { isOpen: false, message: 'Hours not specified' };
  }

  const { day: currentDay, minutes: currentTimeMinutes } = getNowInTimezone(timeZone);

  const todaySchedule = hours.find(h => h.day_of_week === currentDay);

  if (!todaySchedule || todaySchedule.is_closed) {
    return { isOpen: false, message: 'Closed Today' };
  }

  const [openH, openM] = todaySchedule.opens_at.split(':').map(Number);
  const [closeH, closeM] = todaySchedule.closes_at.split(':').map(Number);

  const openTimeMinutes = openH * 60 + openM;
  const closeTimeMinutes = closeH * 60 + closeM;

  if (currentTimeMinutes >= openTimeMinutes && currentTimeMinutes < closeTimeMinutes) {
    return {
      isOpen: true,
      message: `Open Now (until ${formatTime(todaySchedule.closes_at)})`,
    };
  } else if (currentTimeMinutes < openTimeMinutes) {
    return {
      isOpen: false,
      message: `Closed (Opens at ${formatTime(todaySchedule.opens_at)})`,
    };
  } else {
    return {
      isOpen: false,
      message: 'Closed for today',
    };
  }
}

export function getCategoryIconName(categorySlug: string): string {
  const map: Record<string, string> = {
    'it-software': 'Laptop',
    'healthcare': 'Stethoscope',
    'banking-finance': 'Building2',
    'construction-real-estate': 'HardHat',
    'restaurants-food': 'UtensilsCrossed',
    'legal-services': 'Scale',
    'education': 'GraduationCap',
    'hotels-travel': 'Hotel',
    'automotive': 'Car',
    'manufacturing': 'Factory',
    'shopping-retail': 'ShoppingBag',
    'home-services': 'Wrench',
  };
  return map[categorySlug] || 'Building2';
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
