/**
 * Unit Tests for STORY MODE ENGINE
 * Verifies that the 7-step presentation narrative is constructed correctly,
 * all steps have valid empirical evidence and supporting receipts,
 * and wording strictly satisfies neutrality requirements.
 */

import { buildStoryModeNarrative } from './storyModeEngine.ts';
import type { LifeReceipt } from '../types/receipt.ts';

function createMockReceipt(overrides: Partial<LifeReceipt>): LifeReceipt {
  const timestamp = overrides.timestamp || new Date('2016-04-12T08:30:00Z').getTime();
  const d = new Date(timestamp);

  return {
    id: overrides.id || `rec-${Math.random().toString(36).substring(2, 8)}`,
    source: overrides.source || 'household',
    type: overrides.type || 'household_expense',
    timestamp,
    dateStr: overrides.dateStr || d.toISOString().slice(0, 10),
    timeStr: overrides.timeStr || d.toISOString().slice(11, 16),
    isoDate: overrides.isoDate || d.toISOString(),
    year: overrides.year || d.getFullYear(),
    month: overrides.month || d.getMonth() + 1,
    dayOfMonth: overrides.dayOfMonth || d.getDate(),
    dayOfWeek: overrides.dayOfWeek || d.getDay(),
    hour: overrides.hour != null ? overrides.hour : d.getHours(),
    title: overrides.title || 'Cutting Chai & Biscuits',
    subtitle: overrides.subtitle || 'Chaiwallah',
    description: overrides.description || 'Morning cutting chai with biscuits',
    category: overrides.category || 'Food & Dining',
    subcategory: overrides.subcategory || 'Tea & Snacks',
    rawCategory: overrides.rawCategory || 'Food',
    amount: overrides.amount,
    currency: 'INR',
    location: overrides.location !== undefined ? overrides.location : {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      lat: 18.5204,
      long: 73.8567,
      context: 'Local Stall',
    },
    entities: overrides.entities || [{ name: 'Chaiwallah', type: 'merchant' }],
    tags: overrides.tags || ['chai', 'breakfast', 'pune'],
    metadata: overrides.metadata || {},
  };
}

function createMockReceipts(): LifeReceipt[] {
  return [
    createMockReceipt({
      id: 'spot-1',
      source: 'spotify',
      type: 'audio_stream',
      title: 'Let It Be',
      subtitle: 'The Beatles',
      category: 'Music & Audio',
      subcategory: 'Rock & Classic Pop',
      timestamp: new Date('2013-08-11T10:00:00Z').getTime(),
      dateStr: '2013-08-11',
      timeStr: '10:00:00',
      year: 2013,
      month: 8,
      hour: 10,
      description: 'Streamed Let It Be by The Beatles',
      metadata: { durationMs: 240000, platform: 'Android' },
    }),
    createMockReceipt({
      id: 'spot-2',
      source: 'spotify',
      type: 'audio_stream',
      title: 'Hey Jude',
      subtitle: 'The Beatles',
      category: 'Music & Audio',
      subcategory: 'Rock & Classic Pop',
      timestamp: new Date('2016-04-12T08:30:00Z').getTime(),
      dateStr: '2016-04-12',
      timeStr: '08:30:00',
      year: 2016,
      month: 4,
      hour: 8,
      description: 'Streamed Hey Jude by The Beatles',
      metadata: { durationMs: 420000, platform: 'Android' },
    }),
    createMockReceipt({
      id: 'hh-1',
      source: 'household',
      type: 'household_expense',
      title: 'Cutting Chai & Biscuits',
      subtitle: 'Chaiwallah',
      category: 'Food & Dining',
      subcategory: 'Tea & Snacks',
      amount: 15,
      timestamp: new Date('2016-04-12T08:35:00Z').getTime(),
      dateStr: '2016-04-12',
      timeStr: '08:35:00',
      year: 2016,
      month: 4,
      hour: 8,
      description: 'Morning cutting chai with biscuits',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85, context: 'Local Stall' },
    }),
    createMockReceipt({
      id: 'hh-2',
      source: 'household',
      type: 'household_expense',
      title: 'Auto Fare to Station',
      subtitle: 'Pune Transit',
      category: 'Transportation & Commute',
      subcategory: 'Auto-Rickshaw',
      amount: 50,
      timestamp: new Date('2016-04-12T08:45:00Z').getTime(),
      dateStr: '2016-04-12',
      timeStr: '08:45:00',
      year: 2016,
      month: 4,
      hour: 8,
      description: 'Auto ride to station',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.52, long: 73.85, context: 'Transit Corridor' },
    }),
    createMockReceipt({
      id: 'hh-3',
      source: 'household',
      type: 'household_income',
      title: 'Monthly Salary Credit',
      subtitle: 'Employer Direct Deposit',
      category: 'Income & Salary',
      amount: 45000,
      timestamp: new Date('2017-05-01T09:00:00Z').getTime(),
      dateStr: '2017-05-01',
      timeStr: '09:00:00',
      year: 2017,
      month: 5,
      hour: 9,
      description: 'Monthly salary credited',
    }),
    createMockReceipt({
      id: 'hh-4',
      source: 'household',
      type: 'household_transfer',
      title: 'SIP Mutual Fund Investment (Folio A)',
      subtitle: 'Equity Growth Fund',
      category: 'Investments & Savings',
      amount: 5000,
      timestamp: new Date('2017-05-02T10:00:00Z').getTime(),
      dateStr: '2017-05-02',
      timeStr: '10:00:00',
      year: 2017,
      month: 5,
      hour: 10,
      description: 'Automated SIP installment debited',
    }),
    createMockReceipt({
      id: 'comm-1',
      source: 'commerce',
      type: 'commercial_transaction',
      title: 'Electronics & Retail Purchase',
      subtitle: 'Bangalore Flagship',
      category: 'Shopping & Retail',
      amount: 4200,
      timestamp: new Date('2023-01-15T15:30:00Z').getTime(),
      dateStr: '2023-01-15',
      timeStr: '15:30:00',
      year: 2023,
      month: 1,
      hour: 15,
      description: 'Retail electronic purchase at POS terminal',
      location: { city: 'Bangalore', state: 'Karnataka', country: 'India', lat: 12.97, long: 77.59 },
      metadata: { isFraud: false },
    }),
    createMockReceipt({
      id: 'comm-2',
      source: 'commerce',
      type: 'commercial_transaction',
      title: 'Anomalous Long-Distance Transaction',
      subtitle: 'Card Telemetry Alert',
      category: 'Shopping & Retail',
      amount: 18500,
      timestamp: new Date('2023-01-15T16:00:00Z').getTime(),
      dateStr: '2023-01-15',
      timeStr: '16:00:00',
      year: 2023,
      month: 1,
      hour: 16,
      description: 'Geospatial card swipe anomaly intercepted',
      location: { city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.07, long: 72.87, distanceKm: 840 },
      metadata: { isFraud: true },
    }),
  ];
}

export function runStoryModeEngineTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ ${testName}`);
      failed++;
    }
  }

  const receipts = createMockReceipts();
  const narrative = buildStoryModeNarrative(receipts);

  assert(narrative.title === 'REVEAL MY STORY', 'Narrative title is "REVEAL MY STORY"');
  assert(narrative.totalSteps === 7, 'Generates exactly 7 presentation steps');
  assert(narrative.steps.length === 7, 'Step array contains 7 slides');

  // Verify step types and ordering
  const expectedTypes = ['intro', 'scale', 'patterns', 'connections', 'moments', 'chapters', 'summary'];
  expectedTypes.forEach((type, idx) => {
    assert(narrative.steps[idx].type === type, `Step ${idx + 1} is of type "${type}"`);
    assert(narrative.steps[idx].stepNumber === idx + 1, `Step ${idx + 1} has stepNumber ${idx + 1}`);
    assert(narrative.steps[idx].supportingReceipts.length > 0, `Step ${idx + 1} has supporting evidence receipts`);
  });

  // Verify neutrality and specific ending wording
  assert(
    narrative.endingStatement === 'Your receipts tell a story. Explore the evidence.',
    'Narrative ends with exact required phrase: "Your receipts tell a story. Explore the evidence."'
  );

  const step3 = narrative.steps.find(s => s.type === 'patterns');
  assert(
    step3?.leadQuote.includes('We found repeated connections between these categories') ||
    step3?.evidenceHeadline.includes('We found a period with unusually high activity'),
    'Step 3 includes required evidence-based pattern wording'
  );

  const step4 = narrative.steps.find(s => s.type === 'connections');
  assert(
    step4?.payload?.connections !== undefined,
    'Step 4 includes connection payloads'
  );

  const step5 = narrative.steps.find(s => s.type === 'moments');
  assert(
    step5?.leadQuote.includes('These receipts formed a connected moment') ||
    step5?.evidenceHeadline.includes('These receipts formed a connected moment'),
    'Step 5 includes required connected moment wording'
  );

  const step7 = narrative.steps.find(s => s.type === 'summary');
  assert(
    step7?.payload?.decadeChapter !== undefined,
    'Step 7 includes decade wrap master receipt payload'
  );

  return { passed, failed };
}
