/**
 * Augmented India Commercial Transactions & Fraud Normalizer
 * Transforms commercial card transactions into canonical LifeReceipts with privacy protection.
 */

import type { LifeReceipt, CanonicalCategory, ReceiptLocation, ReceiptEntity } from '../../types/receipt.ts';
import type { RawCommerceRecord } from '../../types/rawDatasets.ts';
import { parseCommerceDate } from '../dateParser.ts';
import { calculateHaversine, sanitizeCoord, normalizeCityName, normalizeStateName } from '../geoUtils.ts';
import { maskCreditCard, cleanMerchantName, cleanCategoryString } from '../privacySanitizer.ts';

const COMMERCE_CATEGORY_MAP: Record<string, CanonicalCategory> = {
  online_shopping: 'Shopping & Retail',
  travel: 'Transportation & Commute',
  entertainment: 'Entertainment & Leisure',
  fitness_and_medical: 'Health & Wellness',
};

export function normalizeCommerceRecord(
  raw: RawCommerceRecord,
  index: number
): LifeReceipt | null {
  if (!raw) return null;

  const parsedDate = parseCommerceDate(raw.trans_date_trans_time);
  if (!parsedDate) return null;

  const transId = raw.trans_id != null ? String(Math.floor(Number(raw.trans_id))) : String(index);
  const merchantClean = cleanMerchantName(raw.merchant);
  const rawCat = (raw.category && String(raw.category).trim()) || 'general_retail';
  const categoryClean = cleanCategoryString(rawCat);

  const canonicalCategory: CanonicalCategory =
    COMMERCE_CATEGORY_MAP[rawCat.toLowerCase()] || 'Shopping & Retail';

  const amountNum = typeof raw.amt === 'number' ? raw.amt : parseFloat(String(raw.amt || '0'));
  const validAmount = isNaN(amountNum) ? 0 : Math.round(Math.abs(amountNum) * 100) / 100;

  const isFraud = Number(raw.is_fraud) === 1;

  const city = normalizeCityName(raw.city);
  const state = normalizeStateName(raw.state);

  const customerLat = sanitizeCoord(raw.lat, true);
  const customerLong = sanitizeCoord(raw.long, false);
  const merchLat = sanitizeCoord(raw.merch_lat, true);
  const merchLong = sanitizeCoord(raw.merch_long, false);

  const distanceKm = calculateHaversine(customerLat, customerLong, merchLat, merchLong);

  const location: ReceiptLocation = {
    city: city || null,
    state: state || null,
    country: 'India',
    lat: customerLat,
    long: customerLong,
    merchLat: merchLat,
    merchLong: merchLong,
    distanceKm: distanceKm,
    context: 'Commercial Merchant',
  };

  // Build semantic graph entities
  const entities: ReceiptEntity[] = [
    { name: merchantClean, type: 'merchant' },
    { name: categoryClean, type: 'category' },
  ];

  if (city) {
    entities.push({ name: city, type: 'location' });
  }
  if (state && state !== city) {
    entities.push({ name: state, type: 'location' });
  }
  if (raw.job && typeof raw.job === 'string' && raw.job.trim().toLowerCase() !== 'nan') {
    entities.push({ name: raw.job.trim(), type: 'profession' });
  }

  const maskedCard = maskCreditCard(raw.cc_num);
  const locDisplay = city ? (state ? `${city}, ${state}` : city) : (state || 'India');

  const title = merchantClean;
  const subtitle = `${categoryClean} • ${locDisplay}${isFraud ? ' [Fraud Alert]' : ''}`;
  const description = `₹${validAmount.toLocaleString('en-IN')} paid to ${merchantClean} in ${locDisplay} (${categoryClean})`;

  // PRIVACY MIGRATION: Never include raw cc_num, dob, street, or customer_id in metadata
  const metadata = {
    merchant: merchantClean,
    isFraud: isFraud,
    fraudStatus: isFraud ? 'Fraudulent Alert' : 'Verified Legitimate',
    maskedCard: maskedCard,
    cityPopulation: raw.city_pop ? Number(raw.city_pop) : null,
    distanceKm: distanceKm,
    profession: raw.job ? String(raw.job).trim() : null,
    gender: raw.gender ? String(raw.gender).trim() : null,
    rawCategory: rawCat,
    currency: 'INR',
  };

  const tags: string[] = [
    'commerce',
    'transaction',
    canonicalCategory.toLowerCase(),
    isFraud ? 'fraud-alert' : 'verified',
  ];
  if (city) tags.push(city.toLowerCase());
  if (state) tags.push(state.toLowerCase());

  return {
    id: `comm_${transId}`,
    source: 'commerce',
    type: 'commercial_transaction',

    timestamp: parsedDate.timestamp,
    isoDate: parsedDate.isoDate,
    dateStr: parsedDate.dateStr,
    timeStr: parsedDate.timeStr,
    year: parsedDate.year,
    month: parsedDate.month,
    dayOfMonth: parsedDate.dayOfMonth,
    dayOfWeek: parsedDate.dayOfWeek,
    hour: parsedDate.hour,

    title,
    subtitle,
    description,

    category: canonicalCategory,
    subcategory: categoryClean,
    rawCategory: rawCat,

    amount: validAmount,
    currency: 'INR',

    location,
    entities,
    metadata,
    tags,
  };
}

/**
 * Batch normalizer for array of raw Commerce rows
 */
export function normalizeCommerceBatch(records: RawCommerceRecord[], startIndex = 0): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];
  const len = records.length;
  for (let i = 0; i < len; i++) {
    const item = normalizeCommerceRecord(records[i], startIndex + i);
    if (item) {
      receipts.push(item);
    }
  }
  return receipts;
}
