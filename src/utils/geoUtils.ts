/**
 * Geospatial and location utilities for LIFE//RECEIPTS
 */

export function isValidCoordinate(val: any, isLatitude: boolean): boolean {
  if (val === null || val === undefined || val === '') return false;
  const num = typeof val === 'number' ? val : parseFloat(val);
  if (isNaN(num)) return false;
  if (isLatitude) {
    return num >= -90 && num <= 90;
  } else {
    return num >= -180 && num <= 180;
  }
}

export function sanitizeCoord(val: any, isLatitude: boolean): number | null {
  if (!isValidCoordinate(val, isLatitude)) return null;
  const num = typeof val === 'number' ? val : parseFloat(val);
  return Math.round(num * 1000000) / 1000000;
}

/**
 * Calculates great-circle distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers (rounded to 2 decimal places)
 */
export function calculateHaversine(
  lat1: number | null | undefined,
  lon1: number | null | undefined,
  lat2: number | null | undefined,
  lon2: number | null | undefined
): number | null {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null ||
    !isValidCoordinate(lat1, true) ||
    !isValidCoordinate(lon1, false) ||
    !isValidCoordinate(lat2, true) ||
    !isValidCoordinate(lon2, false)
  ) {
    return null;
  }

  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const radLat1 = toRad(lat1);
  const radLat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 100) / 100;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Normalizes Indian state names
 */
export function normalizeStateName(stateStr?: string | null): string | null {
  if (!stateStr || typeof stateStr !== 'string') return null;
  const trimmed = stateStr.trim();
  if (!trimmed || trimmed.toLowerCase() === 'nan' || trimmed.toLowerCase() === 'null') return null;
  return trimmed;
}

/**
 * Normalizes Indian city names
 */
export function normalizeCityName(cityStr?: string | null): string | null {
  if (!cityStr || typeof cityStr !== 'string') return null;
  const trimmed = cityStr.trim();
  if (!trimmed || trimmed.toLowerCase() === 'nan' || trimmed.toLowerCase() === 'null') return null;
  return trimmed;
}
