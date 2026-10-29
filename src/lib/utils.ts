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

export function checkBusinessOpenStatus(hours?: BusinessHour[]): BusinessOpenStatus {
  if (!hours || hours.length === 0) {
    return { isOpen: false, message: 'Hours not specified' };
  }

  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeMinutes = currentHours * 60 + currentMinutes;

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
