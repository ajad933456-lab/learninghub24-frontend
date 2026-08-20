import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (isNaN(seconds) || seconds < 0) return 'just now';
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

/** GST rate — 18% */
export const GST_RATE = 0.18;

/**
 * Returns the GST amount in paise for a given base amount in paise.
 * e.g. gstAmount(10000) → 1800  (₹100 base → ₹18 GST)
 */
export function gstAmount(baseInPaise: number): number {
  return Math.round(baseInPaise * GST_RATE);
}

/**
 * Converts paise to a formatted ₹ string.
 * e.g. formatINR(10000) → "₹100"
 */
export function formatINR(paise: number): string {
  return `₹${Math.round(paise / 100).toLocaleString('en-IN')}`;
}
