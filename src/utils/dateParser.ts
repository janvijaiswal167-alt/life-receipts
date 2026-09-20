/**
 * High-performance date and time parsing utilities for LIFE//RECEIPTS
 * Handles diverse date formats safely across all 3 source datasets without external dependencies.
 */

export interface ParsedDateResult {
  timestamp: number;
  isoDate: string;
  dateStr: string;
  timeStr: string;
  year: number;
  month: number;
  dayOfMonth: number;
  dayOfWeek: number;
  hour: number;
}

/**
 * Parses a Spotify UTC timestamp string (e.g. "2013-07-08 02:44:34" or "2024-12-15T23:06:25Z")
 */
export function parseSpotifyDate(dateStr?: string | null): ParsedDateResult | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Format: "YYYY-MM-DD HH:mm:ss" -> convert to ISO UTC "YYYY-MM-DDTHH:mm:ssZ"
  let iso = trimmed;
  if (trimmed.length === 19 && trimmed[10] === ' ') {
    iso = trimmed.substring(0, 10) + 'T' + trimmed.substring(11) + 'Z';
  } else if (!trimmed.endsWith('Z') && !trimmed.includes('+')) {
    iso = trimmed + 'Z';
  }

  const ms = Date.parse(iso);
  if (isNaN(ms)) return null;

  return extractDateComponents(new Date(ms));
}

/**
 * Parses Indian Household dates (e.g., "20/09/2018 12:04:08", "19/09/2018", "8/11/2016 09:27:45")
 * Format is Day/Month/Year [Hour:Minute:Second]
 */
export function parseHouseholdDate(dateStr?: string | null): ParsedDateResult | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/[\sT]+/);
  const datePart = parts[0];
  const timePart = parts[1] || '00:00:00';

  const dParts = datePart.split('/');
  if (dParts.length !== 3) return null;

  const day = parseInt(dParts[0], 10);
  const month = parseInt(dParts[1], 10) - 1; // 0-indexed month
  let year = parseInt(dParts[2], 10);
  if (year < 100) year += 2000;

  const tParts = timePart.split(':');
  const hour = parseInt(tParts[0] || '0', 10);
  const minute = parseInt(tParts[1] || '0', 10);
  const second = parseInt(tParts[2] || '0', 10);

  // Use UTC to prevent local timezone shifts
  const d = new Date(Date.UTC(year, month, day, hour, minute, second));
  if (isNaN(d.getTime())) return null;

  return extractDateComponents(d);
}

/**
 * Parses Commerce timestamps (e.g., "12/26/2023 0:55", "7/7/2023 7:02", "4/25/2023 11:53")
 * Format is Month/Day/Year Hour:Minute
 */
export function parseCommerceDate(dateStr?: string | null): ParsedDateResult | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/[\sT]+/);
  const datePart = parts[0];
  const timePart = parts[1] || '00:00';

  const dParts = datePart.split('/');
  if (dParts.length !== 3) return null;

  const month = parseInt(dParts[0], 10) - 1; // 0-indexed month
  const day = parseInt(dParts[1], 10);
  let year = parseInt(dParts[2], 10);
  if (year < 100) year += 2000;

  const tParts = timePart.split(':');
  const hour = parseInt(tParts[0] || '0', 10);
  const minute = parseInt(tParts[1] || '0', 10);
  const second = parseInt(tParts[2] || '0', 10);

  const d = new Date(Date.UTC(year, month, day, hour, minute, second));
  if (isNaN(d.getTime())) return null;

  return extractDateComponents(d);
}

/**
 * Extracts standardized fields from a Date object
 */
export function extractDateComponents(d: Date): ParsedDateResult {
  const timestamp = d.getTime();
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth() + 1;
  const dayOfMonth = d.getUTCDate();
  const dayOfWeek = d.getUTCDay();
  const hour = d.getUTCHours();
  const minute = d.getUTCMinutes();

  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);

  const dateStr = `${year}-${pad(month)}-${pad(dayOfMonth)}`;
  const timeStr = `${pad(hour)}:${pad(minute)}`;
  const isoDate = d.toISOString();

  return {
    timestamp,
    isoDate,
    dateStr,
    timeStr,
    year,
    month,
    dayOfMonth,
    dayOfWeek,
    hour,
  };
}

/**
 * Formats duration in milliseconds into a clean readable string (e.g. "3m 45s", "1h 12m")
 */
export function formatDurationMs(ms: number): string {
  if (!ms || ms <= 0) return '0s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}
