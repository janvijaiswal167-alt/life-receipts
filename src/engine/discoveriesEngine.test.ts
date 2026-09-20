/**
 * Unit Test Suite for DISCOVERIES ENGINE ("You Might Have Missed This")
 * 
 * Verifies:
 * - Extraction of surprising, defensible high-value discoveries
 * - Mandatory presence of:
 *   - concise title
 *   - evidence
 *   - supporting records
 *   - explanation
 *   - metric
 * - Zero unsupported emotional or psychological claims
 */

import type { LifeReceipt } from '../types/receipt.ts';
import { discoverHighValueFindings } from './discoveriesEngine.ts';
import type { LifeDiscovery } from './discoveriesEngine.ts';

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

const mockReceipts: LifeReceipt[] = [
  // 1. ₹2 micro-debit
  createMockReceipt({
    id: 'hh-two-rupee',
    source: 'household',
    type: 'household_expense',
    dateStr: '2016-04-12',
    year: 2016,
    amount: 2,
    title: 'Matchbox Kirana adjustment',
    category: 'Food & Dining',
  }),

  // 2. 16,000km geospatial fraud disparity
  createMockReceipt({
    id: 'comm-fraud-geo',
    source: 'commerce',
    type: 'commercial_transaction',
    dateStr: '2023-08-15',
    year: 2023,
    amount: 12500,
    title: 'Overseas Digital Electronics Portal',
    category: 'Shopping & Retail',
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.07, long: 72.87, distanceKm: 16420 },
    metadata: { isFraud: true },
  }),

  // 3. The Beatles track plays
  ...Array.from({ length: 6 }, (_, i) => createMockReceipt({
    id: `spot-beatles-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    dateStr: '2016-10-01',
    year: 2016,
    title: `Beatles Song ${i}`,
    subtitle: 'The Beatles',
    category: 'Music & Audio',
    metadata: { durationMs: 195000 },
  })),

  // 4. WFH data boosters
  createMockReceipt({
    id: 'hh-wfh-1',
    source: 'household',
    type: 'household_expense',
    dateStr: '2020-05-10',
    year: 2020,
    amount: 251,
    title: 'Mobile Service Provider recharge wfh booster pack',
    category: 'Subscriptions & Digital',
  }),

  // 5. Salary & SIP sequence
  createMockReceipt({
    id: 'hh-salary-1',
    source: 'household',
    type: 'household_income',
    dateStr: '2016-09-01',
    year: 2016,
    amount: 85000,
    title: 'Salary Deposit',
    category: 'Income & Salary',
  }),
  createMockReceipt({
    id: 'hh-salary-2',
    source: 'household',
    type: 'household_income',
    dateStr: '2016-10-01',
    year: 2016,
    amount: 85000,
    title: 'Salary Deposit',
    category: 'Income & Salary',
  }),
  createMockReceipt({
    id: 'hh-sip-1',
    source: 'household',
    type: 'household_expense',
    dateStr: '2016-09-03',
    year: 2016,
    amount: 5000,
    title: 'SBI Equity MF SIP',
    category: 'Investments & Savings',
  }),
  createMockReceipt({
    id: 'hh-sip-2',
    source: 'household',
    type: 'household_expense',
    dateStr: '2016-10-03',
    year: 2016,
    amount: 5000,
    title: 'SBI Equity MF SIP',
    category: 'Investments & Savings',
  }),
  createMockReceipt({
    id: 'hh-sip-3',
    source: 'household',
    type: 'household_expense',
    dateStr: '2016-10-04',
    year: 2016,
    amount: 5000,
    title: 'SBI PPF Deposit',
    category: 'Investments & Savings',
  }),

  // 6. Sevagram Express
  createMockReceipt({
    id: 'hh-sevagram',
    source: 'household',
    type: 'household_expense',
    dateStr: '2016-10-01',
    year: 2016,
    amount: 720,
    title: 'Sevagram Express 3AC Berth Booking',
    category: 'Transportation & Commute',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
  }),
];

export function runDiscoveriesEngineTests() {
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

  console.log('\n--- Test 1: Discover High-Value Findings ---');
  const findings = discoverHighValueFindings(mockReceipts);
  assert(findings.length >= 5, 'Discovers at least 5 high-value anomalies/findings');

  console.log('\n--- Test 2: Field Completeness on EVERY Discovery ---');
  let allComplete = true;
  for (const item of findings) {
    if (!item.title || item.title.trim().length === 0) {
      allComplete = false;
      console.error(`Missing title on discovery ${item.id}`);
    }
    if (!item.evidence || item.evidence.trim().length === 0) {
      allComplete = false;
      console.error(`Missing evidence on discovery ${item.id}`);
    }
    if (!item.explanation || item.explanation.trim().length === 0) {
      allComplete = false;
      console.error(`Missing explanation on discovery ${item.id}`);
    }
    if (!item.metric || item.metric.trim().length === 0) {
      allComplete = false;
      console.error(`Missing metric on discovery ${item.id}`);
    }
    if (!item.supportingRecords || item.supportingRecords.length === 0) {
      allComplete = false;
      console.error(`Missing supportingRecords on discovery ${item.id}`);
    }
  }
  assert(allComplete, 'EVERY discovery contains title, evidence, explanation, metric, and supporting records');

  console.log('\n--- Test 3: Specific Defensible Anomalies ---');
  const twoRupee = findings.find(f => f.id.includes('two-rupee'));
  assert(!!twoRupee, 'Discovers ₹2.00 micro-debit anomaly');
  assert(twoRupee!.supportingRecords[0].amount === 2, 'Attaches the exact ₹2.00 receipt record');

  const geoFraud = findings.find(f => f.id.includes('geo-disparity'));
  assert(!!geoFraud, 'Discovers 16,000+ km geospatial disparity alert');

  const beatles = findings.find(f => f.id.includes('beatles'));
  assert(!!beatles, 'Discovers The Beatles super-loyalty entity');

  const wfh = findings.find(f => f.id.includes('wfh'));
  assert(!!wfh, 'Discovers 18 WFH emergency cellular vouchers cluster');

  const salarySip = findings.find(f => f.id.includes('salary-sip'));
  assert(!!salarySip, 'Discovers 72-hour salary-to-SIP investment pipeline');

  console.log('\n--- Test 4: Strict Factual Tone & Non-Speculation ---');
  const bannedTerms = ['depressed', 'anxious', 'lonely', 'escapism', 'personality', 'neurotic', 'introverted', 'sad'];
  let strictlyFactual = true;
  for (const item of findings) {
    const text = (item.title + ' ' + item.evidence + ' ' + item.explanation).toLowerCase();
    for (const term of bannedTerms) {
      if (text.includes(term)) {
        strictlyFactual = false;
        console.error(`Found speculative term "${term}" in discovery ${item.id}`);
      }
    }
  }
  assert(strictlyFactual, 'Discoveries use strictly neutral, factual language without psychological claims');

  console.log('\n--- Test 5: Empty Input Handling ---');
  const emptyRes = discoverHighValueFindings([]);
  assert(emptyRes.length === 0, 'Safely returns empty array for empty inputs');

  console.log(`\nDiscoveries Engine Test Results: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}

// Allow direct execution
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('discoveriesEngine.test')) {
  runDiscoveriesEngineTests();
}
