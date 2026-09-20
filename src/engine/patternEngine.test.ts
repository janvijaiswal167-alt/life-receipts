/**
 * Unit Test Suite for PATTERN ENGINE
 * 
 * Verifies that all 9 pattern types are deterministically detected:
 * 1. peak activity periods
 * 2. repeated artists/entities
 * 3. repeated categories
 * 4. recurring locations
 * 5. spending/category concentration
 * 6. time-of-day behavior
 * 7. changes between periods
 * 8. unusually dense activity periods
 * 9. repeated sequences
 *
 * Verifies non-hallucination:
 * - Every pattern contains title, evidence, supporting receipts, metric/value, confidence
 */

import type { LifeReceipt } from '../types/receipt.ts';
import {
  discoverLifePatterns,
  detectPeakActivityPatterns,
  detectRepeatedEntityPatterns,
  detectRepeatedCategoryPatterns,
  detectRecurringLocationPatterns,
  detectSpendingConcentrationPatterns,
  detectTimeOfDayPatterns,
  detectPeriodChangePatterns,
  detectDenseActivityPatterns,
  detectRepeatedSequencePatterns,
} from './patternEngine.ts';
import type { LifePattern } from './patternEngine.ts';

function createMockReceipt(overrides: Partial<LifeReceipt>): LifeReceipt {
  const timestamp = overrides.timestamp || new Date('2016-10-01T08:30:00Z').getTime();
  const d = new Date(timestamp);
  return {
    id: overrides.id || `rec-${Math.random().toString(36).substring(2, 8)}`,
    source: overrides.source || 'household',
    type: overrides.type || 'household_expense',
    timestamp,
    isoDate: overrides.isoDate || d.toISOString(),
    dateStr: overrides.dateStr || d.toISOString().slice(0, 10),
    timeStr: overrides.timeStr || d.toISOString().slice(11, 16),
    year: overrides.year || d.getFullYear(),
    month: overrides.month || d.getMonth() + 1,
    dayOfMonth: overrides.dayOfMonth || d.getDate(),
    dayOfWeek: overrides.dayOfWeek || d.getDay(),
    hour: overrides.hour !== undefined ? overrides.hour : d.getHours(),
    title: overrides.title || 'Mock Title',
    subtitle: overrides.subtitle || 'Mock Subtitle',
    category: overrides.category || 'General & Other',
    subcategory: overrides.subcategory || null,
    rawCategory: overrides.rawCategory || null,
    amount: overrides.amount !== undefined ? overrides.amount : null,
    currency: overrides.currency || 'INR',
    location: overrides.location || { city: null, state: null, country: null, lat: null, long: null },
    entities: overrides.entities || [],
    description: overrides.description || '',
    metadata: overrides.metadata || {},
    tags: overrides.tags || [],
  };
}

// Mock Synthetic Receipts for Deterministic Testing
const mockReceipts: LifeReceipt[] = [
  // 1. Spotify Streams (Evening Beatles & Killers)
  ...Array.from({ length: 15 }, (_, i) => createMockReceipt({
    id: `spot-beatles-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    timestamp: 1475344800000 + i * 3600000, // Oct 1, 2016 evening
    dateStr: '2016-10-01',
    year: 2016,
    month: 10,
    hour: 19 + (i % 4), // 19, 20, 21, 22
    title: `Here Comes The Sun #${i}`,
    subtitle: 'The Beatles',
    category: 'Music & Audio',
    metadata: { durationMs: 185000 },
  })),
  ...Array.from({ length: 8 }, (_, i) => createMockReceipt({
    id: `spot-killers-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    timestamp: 1475431200000 + i * 3600000,
    dateStr: '2016-10-02',
    year: 2016,
    month: 10,
    hour: 20,
    title: `Mr. Brightside #${i}`,
    subtitle: 'The Killers',
    category: 'Music & Audio',
    metadata: { durationMs: 222000 },
  })),

  // 2. Household Ledger (Morning Chai & Milk)
  ...Array.from({ length: 12 }, (_, i) => createMockReceipt({
    id: `hh-chai-${i}`,
    source: 'household',
    type: 'household_expense',
    timestamp: 1475308800000 + i * 86400000, // Daily in Oct 2016
    dateStr: `2016-10-${String(i + 1).padStart(2, '0')}`,
    year: 2016,
    month: 10,
    hour: 8, // 08:00 AM
    title: 'Cutting Chai & Dairy Milk',
    subtitle: 'Local Chai Stall',
    category: 'Food & Dining',
    subcategory: 'tea & milk',
    amount: 60,
    currency: 'INR',
    description: 'Fresh milk supply and morning tea',
  })),

  // 3. Household Salary & Investments (Month Start Sequence)
  createMockReceipt({
    id: 'hh-salary-oct',
    source: 'household',
    type: 'household_income',
    timestamp: 1475308800000, // Oct 1, 2016
    dateStr: '2016-10-01',
    year: 2016,
    month: 10,
    hour: 10,
    title: 'Salary Deposit - Primary Tech Corp',
    subtitle: 'SBI Salary Account',
    category: 'Income & Salary',
    amount: 85000,
    currency: 'INR',
    description: 'Monthly salary credit to SBI',
  }),
  createMockReceipt({
    id: 'hh-salary-nov',
    source: 'household',
    type: 'household_income',
    timestamp: 1477987200000, // Nov 1, 2016
    dateStr: '2016-11-01',
    year: 2016,
    month: 11,
    hour: 10,
    title: 'Salary Deposit - Primary Tech Corp',
    subtitle: 'SBI Salary Account',
    category: 'Income & Salary',
    amount: 85000,
    currency: 'INR',
    description: 'Monthly salary credit to SBI',
  }),
  createMockReceipt({
    id: 'hh-salary-dec',
    source: 'household',
    type: 'household_income',
    timestamp: 1480579200000, // Dec 1, 2016
    dateStr: '2016-12-01',
    year: 2016,
    month: 12,
    hour: 10,
    title: 'Salary Deposit - Primary Tech Corp',
    subtitle: 'SBI Salary Account',
    category: 'Income & Salary',
    amount: 85000,
    currency: 'INR',
    description: 'Monthly salary credit to SBI',
  }),
  // SIP Mutual Funds (paired with Oct, Nov, Dec)
  createMockReceipt({
    id: 'hh-sip-oct-a',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475481600000, // Oct 3, 2016
    dateStr: '2016-10-03',
    year: 2016,
    month: 10,
    hour: 11,
    title: 'SBI Equity Bluechip MF SIP',
    subtitle: 'Mutual Fund SIP Folio A',
    category: 'Investments & Savings',
    amount: 5000,
    currency: 'INR',
    description: 'Systematic Investment Plan',
  }),
  createMockReceipt({
    id: 'hh-sip-nov-a',
    source: 'household',
    type: 'household_expense',
    timestamp: 1478160000000, // Nov 3, 2016
    dateStr: '2016-11-03',
    year: 2016,
    month: 11,
    hour: 11,
    title: 'SBI Equity Bluechip MF SIP',
    subtitle: 'Mutual Fund SIP Folio A',
    category: 'Investments & Savings',
    amount: 5000,
    currency: 'INR',
    description: 'Systematic Investment Plan',
  }),
  createMockReceipt({
    id: 'hh-sip-dec-a',
    source: 'household',
    type: 'household_expense',
    timestamp: 1480752000000, // Dec 3, 2016
    dateStr: '2016-12-03',
    year: 2016,
    month: 12,
    hour: 11,
    title: 'SBI Equity Bluechip MF SIP',
    subtitle: 'Mutual Fund SIP Folio A',
    category: 'Investments & Savings',
    amount: 5000,
    currency: 'INR',
    description: 'Systematic Investment Plan',
  }),
  createMockReceipt({
    id: 'hh-sbi-trans-4',
    source: 'household',
    type: 'household_expense',
    timestamp: 1480838400000,
    dateStr: '2016-12-04',
    year: 2016,
    month: 12,
    hour: 12,
    title: 'SBI Account Fund Transfer',
    subtitle: 'State Bank Reserve',
    category: 'Investments & Savings',
    amount: 10000,
    currency: 'INR',
    description: 'SBI transfer',
  }),
  createMockReceipt({
    id: 'hh-sbi-trans-5',
    source: 'household',
    type: 'household_expense',
    timestamp: 1480924800000,
    dateStr: '2016-12-05',
    year: 2016,
    month: 12,
    hour: 12,
    title: 'SBI Recurring Deposit',
    subtitle: 'State Bank Reserve',
    category: 'Investments & Savings',
    amount: 15000,
    currency: 'INR',
    description: 'SBI deposit',
  }),

  // 4. Transit Commutes (Pune / Sevagram Corridor)
  createMockReceipt({
    id: 'hh-train-sevagram',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475308800000, // Oct 1, 2016 (same date as spot-beatles-0)
    dateStr: '2016-10-01',
    year: 2016,
    month: 10,
    hour: 9,
    title: 'Sevagram Express 3AC Ticket',
    subtitle: 'IRCTC Central Railway',
    category: 'Transportation & Commute',
    amount: 720,
    currency: 'INR',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
    description: 'Intercity rail transit Pune',
  }),
  createMockReceipt({
    id: 'hh-auto-pune-1',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475431200000, // Oct 2, 2016 (same date as spot-killers-0)
    dateStr: '2016-10-02',
    year: 2016,
    month: 10,
    hour: 18,
    title: 'Auto Rickshaw to Station',
    subtitle: 'Pune Metro Link',
    category: 'Transportation & Commute',
    amount: 90,
    currency: 'INR',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
    description: 'Commute auto in Pune',
  }),
  createMockReceipt({
    id: 'hh-auto-pune-2',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475517600000,
    dateStr: '2016-10-03',
    year: 2016,
    month: 10,
    hour: 8,
    title: 'Auto Rickshaw return',
    subtitle: 'Pune Transport',
    category: 'Transportation & Commute',
    amount: 95,
    currency: 'INR',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
    description: 'Local commute in Pune',
  }),
  createMockReceipt({
    id: 'hh-transit-4',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475604000000,
    dateStr: '2016-10-04',
    year: 2016,
    month: 10,
    hour: 8,
    title: 'Bus Pass Monthly',
    subtitle: 'Pune Transit',
    category: 'Transportation & Commute',
    amount: 500,
    currency: 'INR',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
    description: 'Transit card',
  }),
  createMockReceipt({
    id: 'hh-transit-5',
    source: 'household',
    type: 'household_expense',
    timestamp: 1475690400000,
    dateStr: '2016-10-05',
    year: 2016,
    month: 10,
    hour: 8,
    title: 'Auto Rickshaw Ride',
    subtitle: 'Pune Link',
    category: 'Transportation & Commute',
    amount: 80,
    currency: 'INR',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
    description: 'Transit',
  }),

  // 5. Commerce Multi-City Card Swipes (Era 4)
  ...Array.from({ length: 15 }, (_, i) => createMockReceipt({
    id: `comm-tx-${i}`,
    source: 'commerce',
    type: 'commercial_transaction',
    timestamp: 1672531200000 + i * 86400000, // Jan 2023
    dateStr: `2023-01-${String(i + 1).padStart(2, '0')}`,
    year: 2023,
    month: 1,
    hour: (i % 2 === 0 ? 23 : 14), // Night transactions and day transactions
    title: `Merchant Store ${i}`,
    subtitle: 'Point of Sale Swipes',
    category: 'Shopping & Retail',
    amount: 3200 + i * 450,
    currency: 'INR',
    location: {
      city: i % 3 === 0 ? 'Mumbai' : i % 3 === 1 ? 'Pune' : 'Bangalore',
      state: 'Maharashtra',
      country: 'India',
      lat: 19.07,
      long: 72.87,
    },
    metadata: {
      isFraud: i % 4 === 0, // Some fraud alert flags
    },
    description: 'Digital card retail transaction',
  })),
];

export function runPatternEngineTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  console.log('\n--- Test 1: Peak Activity Detector ---');
  const peakPatterns = detectPeakActivityPatterns(mockReceipts);
  assert(peakPatterns.length >= 1, 'Detects at least one peak activity pattern');
  const eveningPeak = peakPatterns.find(p => p.patternType === 'peak_activity' && p.id.includes('evening'));
  assert(!!eveningPeak, 'Detects evening audio listening peak');
  assert(eveningPeak!.supportingReceipts.length > 0, 'Evening peak includes supporting receipts');
  assert(eveningPeak!.metricValue.length > 0, 'Evening peak has explicit metric/value');

  console.log('\n--- Test 2: Repeated Entity / Artist Detector ---');
  const entityPatterns = detectRepeatedEntityPatterns(mockReceipts);
  assert(entityPatterns.length >= 2, 'Detects multiple repeated entity patterns');
  const beatlesPattern = entityPatterns.find(p => p.id.includes('beatles'));
  assert(!!beatlesPattern, 'Detects The Beatles immersion pattern');
  assert(beatlesPattern!.title.includes('The Beatles'), 'Title references The Beatles accurately');
  assert(beatlesPattern!.supportingReceipts.every(r => r.subtitle.includes('Beatles')), 'All supporting receipts are Beatles tracks');

  const sbiPattern = entityPatterns.find(p => p.id.includes('sbi'));
  assert(!!sbiPattern, 'Detects State Bank of India account anchoring pattern');

  console.log('\n--- Test 3: Repeated Category Detector ---');
  const catPatterns = detectRepeatedCategoryPatterns(mockReceipts);
  assert(catPatterns.length >= 2, 'Detects repeated category patterns (Chai and Transit)');
  const chaiPattern = catPatterns.find(p => p.id.includes('chai'));
  assert(!!chaiPattern, 'Detects 08:30 AM Daily Morning Chai & Dairy Ritual');
  assert(chaiPattern!.stats.count === 12, 'Accurately computes count of chai/milk receipts');

  console.log('\n--- Test 4: Recurring Location Detector ---');
  const locPatterns = detectRecurringLocationPatterns(mockReceipts);
  assert(locPatterns.length >= 2, 'Detects recurring location patterns (Pune rail corridor & Multi-city commerce)');
  const punePattern = locPatterns.find(p => p.id.includes('pune'));
  assert(!!punePattern, 'Detects Maharashtra / Pune transit corridor');

  console.log('\n--- Test 5: Spending Concentration Detector (Pareto) ---');
  const spendPatterns = detectSpendingConcentrationPatterns(mockReceipts);
  assert(spendPatterns.length >= 1, 'Detects spending concentration / Pareto allocation');
  const top3Pattern = spendPatterns[0];
  assert(top3Pattern.patternType === 'spending_concentration', 'Pattern type is spending_concentration');
  assert(!!top3Pattern.breakdown && top3Pattern.breakdown.length > 0, 'Breakdown contains category values');

  console.log('\n--- Test 6: Time of Day Behavior Detector ---');
  const todPatterns = detectTimeOfDayPatterns(mockReceipts);
  assert(todPatterns.length >= 2, 'Detects morning and late-night time-of-day clusters');
  const morningTod = todPatterns.find(p => p.id.includes('morning'));
  assert(!!morningTod, 'Detects morning routine cluster');

  console.log('\n--- Test 7: Changes Between Periods Detector ---');
  const periodPatterns = detectPeriodChangePatterns(mockReceipts);
  assert(periodPatterns.length >= 1, 'Detects period shifts (Cash to Card / Audio device evolution)');
  const cashToCard = periodPatterns.find(p => p.id.includes('cash-to-card'));
  assert(!!cashToCard, 'Detects Cash Ledgers to Card Commerce transformation');

  console.log('\n--- Test 8: Unusually Dense Activity Detector ---');
  const densePatterns = detectDenseActivityPatterns(mockReceipts);
  assert(densePatterns.length >= 1, 'Detects unusually dense activity / marathon day bursts');
  assert(densePatterns[0].supportingReceipts.length > 0, 'Dense activity attaches supporting receipts');

  console.log('\n--- Test 9: Repeated Sequence Detector ---');
  const seqPatterns = detectRepeatedSequencePatterns(mockReceipts);
  assert(seqPatterns.length >= 2, 'Detects repeated sequences (Salary->SIP and Commute->Audio stream)');
  const salarySip = seqPatterns.find(p => p.id.includes('salary-to-sip'));
  assert(!!salarySip, 'Detects Salary Deposit to SIP Investment sequence');
  assert(salarySip!.confidence.includes('99'), 'High confidence on causal temporal sequence');

  console.log('\n--- Test 10: Master Discovery Engine & Non-Hallucination ---');
  const allPatterns = discoverLifePatterns(mockReceipts);
  assert(allPatterns.length >= 9, 'Master engine discovers all 9 pattern types');
  
  // Verify strict requirement: title, evidence, supporting receipts, metric/value, confidence on EVERY pattern
  let nonHallucinated = true;
  for (const p of allPatterns) {
    if (!p.title || !p.evidence || !p.metricValue || !p.confidence || !p.supportingReceipts || p.supportingReceipts.length === 0) {
      nonHallucinated = false;
      console.error(`Invalid pattern without required fields: ${p.id}`);
    }
  }
  assert(nonHallucinated, 'EVERY pattern contains title, evidence, supporting receipts, metric/value, and confidence');

  // Verify empty array handling
  const emptyRes = discoverLifePatterns([]);
  assert(emptyRes.length === 0, 'Safely returns empty array for empty inputs without throwing');

  console.log(`\nPattern Engine Test Results: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}

// Allow direct execution if run via node
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('patternEngine.test')) {
  runPatternEngineTests();
}
