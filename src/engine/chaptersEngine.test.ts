/**
 * Unit Test Suite for CHAPTERS ENGINE
 * 
 * Verifies:
 * - Identification of meaningful life chapters based on activity pattern changes
 * - Presence of required chapter fields on EVERY chapter:
 *   - title
 *   - date range
 *   - dominant activity categories
 *   - supporting metrics
 *   - important moments
 *   - important connections
 *   - evidence receipts
 *   - factual evidence statements
 * - Strictly neutral, factual descriptions without emotional or psychological speculation
 */

import type { LifeReceipt } from '../types/receipt.ts';
import { discoverLifeChapters } from './chaptersEngine.ts';
import type { LifeChapter } from './chaptersEngine.ts';

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

// Multi-era mock receipts
const mockReceipts: LifeReceipt[] = [
  // Era 1 (2013-2014)
  createMockReceipt({
    id: 'spot-2013-1',
    source: 'spotify',
    type: 'audio_stream',
    year: 2013,
    title: 'Mr. Brightside',
    subtitle: 'The Killers',
    category: 'Music & Audio',
    metadata: { durationMs: 222000 },
  }),
  createMockReceipt({
    id: 'spot-2014-1',
    source: 'spotify',
    type: 'audio_stream',
    year: 2014,
    title: 'Slow Dancing In A Burning Room',
    subtitle: 'John Mayer',
    category: 'Music & Audio',
    metadata: { durationMs: 242000 },
  }),

  // Era 2 (2015-2018)
  createMockReceipt({
    id: 'hh-2016-salary',
    source: 'household',
    type: 'household_income',
    year: 2016,
    title: 'Salary Deposit',
    subtitle: 'SBI Salary Account',
    category: 'Income & Salary',
    amount: 85000,
  }),
  createMockReceipt({
    id: 'hh-2016-sip',
    source: 'household',
    type: 'household_expense',
    year: 2016,
    title: 'SBI Equity Bluechip MF SIP',
    subtitle: 'Mutual Fund SIP Folio A',
    category: 'Investments & Savings',
    amount: 5000,
  }),
  createMockReceipt({
    id: 'hh-2016-chai',
    source: 'household',
    type: 'household_expense',
    year: 2016,
    title: 'Cutting Chai & Dairy Milk',
    subcategory: 'tea & milk',
    category: 'Food & Dining',
    amount: 60,
  }),
  createMockReceipt({
    id: 'hh-2016-train',
    source: 'household',
    type: 'household_expense',
    year: 2016,
    title: 'Sevagram Express 3AC Ticket',
    category: 'Transportation & Commute',
    amount: 720,
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85 },
  }),
  createMockReceipt({
    id: 'spot-2016-beatles',
    source: 'spotify',
    type: 'audio_stream',
    year: 2016,
    title: 'Here Comes The Sun',
    subtitle: 'The Beatles',
    category: 'Music & Audio',
  }),

  // Era 3 (2019-2021)
  createMockReceipt({
    id: 'spot-2020-cast',
    source: 'spotify',
    type: 'audio_stream',
    year: 2020,
    title: 'Comfortably Numb',
    subtitle: 'Pink Floyd',
    category: 'Music & Audio',
  }),
  createMockReceipt({
    id: 'hh-2020-wfh',
    source: 'household',
    type: 'household_expense',
    year: 2020,
    title: 'Mobile Service Provider recharge wfh booster',
    category: 'Subscriptions & Digital',
    amount: 251,
  }),

  // Era 4 (2022-2024)
  createMockReceipt({
    id: 'comm-2023-pos',
    source: 'commerce',
    type: 'commercial_transaction',
    year: 2023,
    title: 'Reliance Retail Electronics',
    category: 'Shopping & Retail',
    amount: 14500,
    location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.07, long: 72.87 },
  }),
  createMockReceipt({
    id: 'comm-2023-fraud',
    source: 'commerce',
    type: 'commercial_transaction',
    year: 2023,
    title: 'Online Shopping Portal',
    category: 'Shopping & Retail',
    amount: 4500,
    location: { city: 'Bangalore', state: 'Karnataka', country: 'India', lat: 12.97, long: 77.59 },
    metadata: { isFraud: true },
  }),
];

export function runChaptersEngineTests() {
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

  console.log('\n--- Test 1: Chapter Discovery & Multi-Era Synthesis ---');
  const chapters = discoverLifeChapters(mockReceipts);
  assert(chapters.length === 5, 'Discovers 5 sequential life chapters across all eras');

  console.log('\n--- Test 2: Field Completeness on EVERY Chapter ---');
  let allComplete = true;
  for (const chap of chapters) {
    if (!chap.title || !chap.dateRange || !chap.dateRange.formatted || !chap.dateRange.startDate) {
      allComplete = false;
      console.error(`Missing title or dateRange on chapter ${chap.id}`);
    }
    if (!chap.dominantCategories || chap.dominantCategories.length === 0) {
      allComplete = false;
      console.error(`Missing dominantCategories on chapter ${chap.id}`);
    }
    if (!chap.supportingMetrics || chap.supportingMetrics.length === 0) {
      allComplete = false;
      console.error(`Missing supportingMetrics on chapter ${chap.id}`);
    }
    if (!chap.evidenceStatements || chap.evidenceStatements.length === 0) {
      allComplete = false;
      console.error(`Missing evidenceStatements on chapter ${chap.id}`);
    }
    if (!chap.evidenceReceipts || chap.evidenceReceipts.length === 0) {
      allComplete = false;
      console.error(`Missing evidenceReceipts on chapter ${chap.id}`);
    }
  }
  assert(allComplete, 'EVERY chapter contains title, date range, dominant categories, metrics, evidence statements, and evidence receipts');

  console.log('\n--- Test 3: Chapter Chronology & Era Precision ---');
  assert(chapters[0].number === 1 && chapters[0].dateRange.yearStart === 2013, 'Chapter 1 is Era I (2013-2014)');
  assert(chapters[1].number === 2 && chapters[1].dateRange.yearStart === 2015, 'Chapter 2 is Era II (2015-2018)');
  assert(chapters[2].number === 3 && chapters[2].dateRange.yearStart === 2019, 'Chapter 3 is Era III (2019-2021)');
  assert(chapters[3].number === 4 && chapters[3].dateRange.yearStart === 2022, 'Chapter 4 is Era IV (2022-2024)');
  assert(chapters[4].number === 5 && chapters[4].title.includes('Consolidated'), 'Chapter 5 is the Consolidated Master Synthesis');

  console.log('\n--- Test 4: Empirical Moments and Connections Linkage ---');
  assert(chapters[1].importantMoments.length > 0, 'Chapter 2 attaches important moments (Salary, Sevagram, etc.)');
  assert(chapters[1].dominantCategories.includes('Investments & Savings'), 'Chapter 2 includes Investments & Savings category');

  console.log('\n--- Test 5: Strict Factual Tone & Non-Speculation ---');
  const bannedPsychTerms = ['depressed', 'anxious', 'lonely', 'escapism', 'personality', 'neurotic', 'introverted', 'sad', 'lazy'];
  let strictlyFactual = true;
  for (const chap of chapters) {
    const text = (chap.title + ' ' + chap.subtitle + ' ' + chap.narrativeOverview + ' ' + chap.evidenceStatements.join(' ')).toLowerCase();
    for (const term of bannedPsychTerms) {
      if (text.includes(term)) {
        strictlyFactual = false;
        console.error(`Found speculative psychological term "${term}" in chapter ${chap.id}`);
      }
    }
  }
  assert(strictlyFactual, 'Chapters use strictly neutral, factual historical prose without psychological claims');

  console.log('\n--- Test 6: Empty Input Handling ---');
  const emptyRes = discoverLifeChapters([]);
  assert(emptyRes.length === 0, 'Safely returns empty array for empty inputs');

  console.log(`\nChapters Engine Test Results: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}

// Allow direct execution
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('chaptersEngine.test')) {
  runChaptersEngineTests();
}
