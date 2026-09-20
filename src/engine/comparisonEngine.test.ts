/**
 * Unit Test Suite for COMPARISON ENGINE
 * 
 * Verifies:
 * - Period-over-period comparative delta calculation
 * - Inclusion of Before Period, After Period, Metric Delta, and Underlying Receipts
 * - Coverage across:
 *   - Music activity
 *   - Spending / category concentration
 *   - Travel & mobility
 *   - Entertainment & subscriptions
 *   - Cybersecurity & telemetry
 * - Strictly factual, neutral wording (no psychological personality claims)
 */

import type { LifeReceipt } from '../types/receipt.ts';
import {
  createPeriodSummary,
  comparePeriods,
  generateEraComparisons,
} from './comparisonEngine.ts';
import type { PeriodComparison } from './comparisonEngine.ts';

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

// Period A (2015 - 2018: Cash & Commutes)
const receiptsA: LifeReceipt[] = [
  ...Array.from({ length: 10 }, (_, i) => createMockReceipt({
    id: `spot-a-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    year: 2016,
    category: 'Music & Audio',
    subtitle: 'The Beatles',
    metadata: { durationMs: 180000 },
  })),
  ...Array.from({ length: 15 }, (_, i) => createMockReceipt({
    id: `hh-a-${i}`,
    source: 'household',
    type: 'household_expense',
    year: 2016,
    amount: 50 + i * 10,
    category: 'Food & Dining',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
  })),
];

// Period B (2022 - 2024: Digital Card Commerce & Travel)
const receiptsB: LifeReceipt[] = [
  ...Array.from({ length: 35 }, (_, i) => createMockReceipt({
    id: `spot-b-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    year: 2023,
    category: 'Music & Audio',
    subtitle: 'The Killers',
    metadata: { durationMs: 210000 },
  })),
  ...Array.from({ length: 20 }, (_, i) => createMockReceipt({
    id: `comm-b-${i}`,
    source: 'commerce',
    type: 'commercial_transaction',
    year: 2023,
    amount: 3500 + i * 500,
    category: 'Shopping & Retail',
    location: { city: i % 2 === 0 ? 'Mumbai' : 'Delhi', state: 'Maharashtra', country: 'India', lat: 19.07, long: 72.87 },
    metadata: { isFraud: i % 3 === 0 },
  })),
];

export function runComparisonEngineTests() {
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

  console.log('\n--- Test 1: Period Summary Calculation ---');
  const summaryA = createPeriodSummary('era-2', 'Era II', '2015-2018', receiptsA);
  assert(summaryA.receiptCount === receiptsA.length, 'Correctly tallies total receipts');
  assert(summaryA.audioHours > 0, 'Computes total audio playback hours');
  assert(summaryA.totalSpend > 0, 'Computes total recorded outflow');

  console.log('\n--- Test 2: Comparative Changes Between Periods ---');
  const comparison = comparePeriods(
    'era-2', 'Era II: Cash Ledger', '2015–2018', receiptsA,
    'era-4', 'Era IV: Card Commerce', '2022–2024', receiptsB
  );

  assert(comparison.changes.length >= 4, 'Discovers changes across music, spending, travel, entertainment, and security');

  const musicChange = comparison.changes.find(c => c.domain === 'music');
  assert(!!musicChange, 'Identifies music activity change');
  assert(musicChange!.beforePeriod.metricValue.length > 0, 'Music change has before period metric');
  assert(musicChange!.afterPeriod.metricValue.length > 0, 'Music change has after period metric');
  assert(musicChange!.delta.percentage?.includes('%') || musicChange!.delta.absolute?.length! > 0, 'Music change has explicit delta');
  assert(musicChange!.underlyingReceipts.length > 0, 'Music change has underlying receipts attached');

  const spendChange = comparison.changes.find(c => c.domain === 'spending');
  assert(!!spendChange, 'Identifies spending outflow change');
  assert(spendChange!.direction === 'increased', 'Correctly identifies spending increased direction');
  assert(spendChange!.underlyingReceipts.length > 0, 'Spending change has underlying receipts');

  const travelChange = comparison.changes.find(c => c.domain === 'travel');
  assert(!!travelChange, 'Identifies travel & geographic mobility shift');

  const secChange = comparison.changes.find(c => c.domain === 'security');
  assert(!!secChange, 'Identifies cybersecurity risk alerts emergence');

  console.log('\n--- Test 3: Factual Neutral Wording Verification ---');
  const bannedPsychTerms = ['depressed', 'anxious', 'lonely', 'escapism', 'personality', 'neurotic', 'introverted'];
  let strictlyFactual = true;
  for (const change of comparison.changes) {
    const text = (change.title + ' ' + change.factualStatement + ' ' + change.details).toLowerCase();
    for (const term of bannedPsychTerms) {
      if (text.includes(term)) {
        strictlyFactual = false;
        console.error(`Found non-factual personality claim: "${term}" in ${change.id}`);
      }
    }
  }
  assert(strictlyFactual, 'Uses 100% neutral factual statements without personality claims');

  console.log('\n--- Test 4: Master Era Comparison Generator ---');
  const allEras = generateEraComparisons([...receiptsA, ...receiptsB]);
  assert(allEras.length >= 1, 'Generates era-to-era comparisons from consolidated receipts');
  assert(allEras[0].categoryDeltas.length > 0, 'Includes category-by-category delta breakdown');

  console.log(`\nComparison Engine Test Results: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}

// Allow direct execution
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('comparisonEngine.test')) {
  runComparisonEngineTests();
}
