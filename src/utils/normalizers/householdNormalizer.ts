/**
 * Daily Household Transactions Normalizer
 * Transforms household financial records into canonical LifeReceipts.
 */

import type { LifeReceipt, CanonicalCategory, ReceiptType, ReceiptLocation, ReceiptEntity } from '../../types/receipt.ts';
import type { RawHouseholdRecord } from '../../types/rawDatasets.ts';
import { parseHouseholdDate } from '../dateParser.ts';
import { sanitizePaymentMode, sanitizeNote } from '../privacySanitizer.ts';

const CATEGORY_MAP: Record<string, CanonicalCategory> = {
  food: 'Food & Dining',
  transportation: 'Transportation & Commute',
  household: 'Shopping & Retail',
  subscription: 'Subscriptions & Digital',
  investment: 'Investments & Savings',
  'recurring deposit': 'Investments & Savings',
  'public provident fund': 'Investments & Savings',
  'fixed deposit': 'Investments & Savings',
  health: 'Health & Wellness',
  family: 'Family & Remittances',
  'money transfer': 'Family & Remittances',
  salary: 'Income & Salary',
  apparel: 'Shopping & Retail',
  gift: 'Shopping & Retail',
  entertainment: 'Entertainment & Leisure',
  other: 'General & Other',
};

export function normalizeHouseholdRecord(
  raw: RawHouseholdRecord,
  index: number
): LifeReceipt | null {
  if (!raw) return null;

  const parsedDate = parseHouseholdDate(raw.Date);
  if (!parsedDate) return null;

  const rawType = (raw['Income/Expense'] && String(raw['Income/Expense']).trim()) || 'Expense';
  let type: ReceiptType = 'household_expense';
  if (rawType.toLowerCase() === 'income') {
    type = 'household_income';
  } else if (rawType.toLowerCase().includes('transfer')) {
    type = 'household_transfer';
  }

  const rawCat = (raw.Category && String(raw.Category).trim()) || 'Other';
  const rawSubcat = raw.Subcategory && String(raw.Subcategory).trim();
  const rawNote = sanitizeNote(raw.Note);

  // Map to unified CanonicalCategory
  let canonicalCategory: CanonicalCategory = 'General & Other';
  const catKey = rawCat.toLowerCase();
  if (CATEGORY_MAP[catKey]) {
    canonicalCategory = CATEGORY_MAP[catKey];
  } else if (catKey.includes('mutual fund') || catKey.includes('deposit') || catKey.includes('share')) {
    canonicalCategory = 'Investments & Savings';
  } else if (catKey.includes('salary') || catKey.includes('interest')) {
    canonicalCategory = 'Income & Salary';
  }

  // Determine Title & Subtitle
  let title = rawNote || rawSubcat || rawCat;
  // Capitalize nicely if title is short
  if (title.length < 30) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }
  const subtitle = `${rawCat}${rawSubcat ? ' • ' + rawSubcat : ''}`;

  const amountNum = typeof raw.Amount === 'number' ? raw.Amount : parseFloat(String(raw.Amount || '0'));
  const validAmount = isNaN(amountNum) ? 0 : Math.abs(amountNum);

  const paymentMode = sanitizePaymentMode(raw.Mode);

  // Extract Route / Location context from Note if available
  let locationContext = 'Domestic Household';
  let isTransit = false;
  const noteLower = (rawNote + ' ' + (rawSubcat || '')).toLowerCase();
  if (
    noteLower.includes('station') ||
    noteLower.includes('express') ||
    noteLower.includes('train') ||
    noteLower.includes('auto') ||
    noteLower.includes('residence') ||
    noteLower.includes('cab') ||
    noteLower.includes('ola')
  ) {
    locationContext = 'Transit & Commute Route';
    isTransit = true;
  }

  const location: ReceiptLocation = {
    city: isTransit ? 'Mumbai/Pune Transit Corridor' : null,
    state: 'Maharashtra',
    country: 'India',
    lat: null,
    long: null,
    context: locationContext,
  };

  // Build semantic graph entities
  const entities: ReceiptEntity[] = [
    { name: paymentMode, type: 'payment_mode' },
    { name: rawCat, type: 'category' },
  ];

  if (rawSubcat) {
    entities.push({ name: rawSubcat, type: 'category' });
  }

  // Detect specific known digital brands / vendors
  const knownVendors = [
    'Netflix',
    'Amazon Prime',
    'Audible',
    'Kindle',
    'Hotstar',
    'Spotify',
    'Ola',
    'Decathlon',
    'Sevagram express',
    'Amritsar express',
  ];

  for (const vendor of knownVendors) {
    if (noteLower.includes(vendor.toLowerCase())) {
      entities.push({
        name: vendor,
        type: vendor.includes('express') ? 'transit_route' : (vendor.includes('Netflix') || vendor.includes('Audible') || vendor.includes('Kindle') || vendor.includes('Prime') ? 'subscription_service' : 'merchant'),
      });
    }
  }

  const description = `${rawType}: ₹${validAmount.toLocaleString('en-IN')} for ${rawCat} (${title}) via ${paymentMode}`;

  const metadata = {
    paymentMode,
    rawMode: raw.Mode || 'Unknown',
    transactionType: rawType,
    rawCategory: rawCat,
    rawSubcategory: rawSubcat || null,
    rawNote: rawNote || null,
    currency: 'INR',
  };

  const tags: string[] = [
    'household',
    type,
    canonicalCategory.toLowerCase(),
    paymentMode.toLowerCase(),
  ];
  if (rawSubcat) tags.push(rawSubcat.toLowerCase());

  return {
    id: `hh_${index}`,
    source: 'household',
    type,

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
    subcategory: rawSubcat || rawCat,
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
 * Batch normalizer for array of raw Household rows
 */
export function normalizeHouseholdBatch(records: RawHouseholdRecord[], startIndex = 0): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];
  const len = records.length;
  for (let i = 0; i < len; i++) {
    const item = normalizeHouseholdRecord(records[i], startIndex + i);
    if (item) {
      receipts.push(item);
    }
  }
  return receipts;
}
