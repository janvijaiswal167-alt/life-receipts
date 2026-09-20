import assert from 'node:assert';
import { extractLifeMoments } from './momentsEngine.ts';
import { discoverCrossConnections, discoverLifePatterns } from './patternEngine.ts';
import { discoverLifeChapters } from './chaptersEngine.ts';
import {
  findContextualLinksForReceipt,
  findLinksForMoment,
  findLinksForPattern,
} from './crossIntegration.ts';
import type { LifeReceipt } from '../types/receipt.ts';

// Construct sample receipts across 3 datasets
const sampleReceipts = [
  {
    id: 'rec-chai-1',
    source: 'household',
    type: 'household_expense',
    category: 'Food & Dining',
    timestamp: new Date('2017-08-15T08:30:00Z').getTime(),
    isoDate: '2017-08-15T08:30:00Z',
    dateStr: '2017-08-15',
    timeStr: '08:30',
    year: 2017,
    month: 8,
    dayOfMonth: 15,
    dayOfWeek: 2,
    hour: 8,
    amount: 15,
    currency: 'INR',
    title: 'Daily Morning Chai & Biscuit',
    subtitle: 'Tea Stall',
    description: 'Chai tapri near station',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, long: 73.8567, context: 'Station tea stall' },
    entities: [{ name: 'Chai Tapri', type: 'merchant' as const }],
    confidence: 0.95,
  },
  {
    id: 'rec-spotify-1',
    source: 'spotify',
    type: 'audio_stream',
    category: 'Music & Audio',
    timestamp: new Date('2017-08-15T08:35:00Z').getTime(),
    isoDate: '2017-08-15T08:35:00Z',
    dateStr: '2017-08-15',
    timeStr: '08:35',
    year: 2017,
    month: 8,
    dayOfMonth: 15,
    dayOfWeek: 2,
    hour: 8,
    title: 'Here Comes The Sun',
    subtitle: 'The Beatles',
    description: 'Abbey Road album track',
    entities: [{ name: 'The Beatles', type: 'artist' as const }],
    confidence: 0.98,
    metadata: { durationFormatted: '3:05' },
  },
  {
    id: 'rec-comm-1',
    source: 'commerce',
    type: 'commercial_transaction',
    category: 'Transportation & Commute',
    timestamp: new Date('2017-08-15T08:45:00Z').getTime(),
    isoDate: '2017-08-15T08:45:00Z',
    dateStr: '2017-08-15',
    timeStr: '08:45',
    year: 2017,
    month: 8,
    dayOfMonth: 15,
    dayOfWeek: 2,
    hour: 8,
    amount: 50,
    currency: 'INR',
    title: 'Auto Rickshaw Transit',
    subtitle: 'Transit Fare',
    description: 'Ride fare to office',
    location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, long: 73.8567 },
    entities: [{ name: 'Pune Auto', type: 'merchant' as const }],
    confidence: 0.9,
  },
  {
    id: 'rec-salary-1',
    source: 'household',
    type: 'household_income',
    category: 'Income & Salary',
    timestamp: new Date('2018-01-31T11:00:00Z').getTime(),
    isoDate: '2018-01-31T11:00:00Z',
    dateStr: '2018-01-31',
    timeStr: '11:00',
    year: 2018,
    month: 1,
    dayOfMonth: 31,
    dayOfWeek: 3,
    hour: 11,
    amount: 75000,
    currency: 'INR',
    title: 'Monthly Salary Credit',
    subtitle: 'State Bank of India',
    description: 'State Bank of India Salary',
    entities: [{ name: 'SBI', type: 'payment_mode' as const }],
    confidence: 0.99,
  },
] as unknown as LifeReceipt[];

export function runCrossIntegrationTests() {
  let passed = 0;
  let failed = 0;

  const moments = extractLifeMoments(sampleReceipts);
  const connections = discoverCrossConnections(sampleReceipts);
  const patterns = discoverLifePatterns(sampleReceipts);
  const chapters = discoverLifeChapters(sampleReceipts);

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ ${name}: ${err?.message}`);
      failed++;
    }
  }

  console.log('--- Test 1: findContextualLinksForReceipt ---');
  test('Returns relevant moments, connections, patterns, and chapter', () => {
    const receipt = sampleReceipts[0];
    const links = findContextualLinksForReceipt(receipt, moments, connections, patterns, chapters);
    assert.ok(links, 'Links object must exist');
    assert.ok(Array.isArray(links.moments), 'moments must be array');
    assert.ok(Array.isArray(links.connections), 'connections must be array');
    assert.ok(Array.isArray(links.patterns), 'patterns must be array');
    assert.ok(links.chapter, 'chapter must exist');
    assert.strictEqual(links.chapter?.number, 2, '2017 belongs to Chapter 2');
  });

  test('Safely handles null or undefined receipt input', () => {
    const links = findContextualLinksForReceipt(null, moments, connections, patterns, chapters);
    assert.strictEqual(links.moments.length, 0);
    assert.strictEqual(links.connections.length, 0);
    assert.strictEqual(links.patterns.length, 0);
  });

  console.log('\n--- Test 2: findLinksForMoment ---');
  test('Finds associated connections, patterns, and chapter for moment', () => {
    if (moments.length > 0) {
      const links = findLinksForMoment(moments[0], connections, patterns, chapters);
      assert.ok(Array.isArray(links.connections), 'connections must be array');
      assert.ok(Array.isArray(links.patterns), 'patterns must be array');
    }
  });

  console.log('\n--- Test 3: findLinksForPattern ---');
  test('Finds connected moments and chapter for pattern', () => {
    if (patterns.length > 0) {
      const links = findLinksForPattern(patterns[0], moments, chapters);
      assert.ok(Array.isArray(links.moments), 'moments must be array');
    }
  });

  console.log(`\nCross-Feature Integration Test Results: ${passed} Passed, ${failed} Failed`);
  return { passed, failed };
}
