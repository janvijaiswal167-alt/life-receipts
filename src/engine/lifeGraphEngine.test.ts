/**
 * Unit Tests for LIFE GRAPH ENGINE
 * Validates relationship discovery, signal scoring, explainable rationale, and performance.
 */

import { LifeGraphEngine } from './lifeGraphEngine.ts';
import type { LifeReceipt } from '../types/receipt.ts';

// Mock receipt factory for precise unit testing
function createMockReceipt(overrides: Partial<LifeReceipt>): LifeReceipt {
  const timestamp = overrides.timestamp || new Date('2016-04-15T08:30:00Z').getTime();
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
    title: overrides.title || 'Morning Cutting Chai',
    subtitle: overrides.subtitle || 'Tea Stall',
    description: overrides.description || 'Morning tea and snacks',
    category: overrides.category || 'Food & Dining',
    subcategory: overrides.subcategory || 'Tea',
    rawCategory: overrides.rawCategory || 'Food',
    amount: overrides.amount !== undefined ? overrides.amount : 15,
    currency: 'INR',
    location: overrides.location !== undefined ? overrides.location : {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      lat: 18.5204,
      long: 73.8567,
      context: 'Pune Transit Station',
    },
    entities: overrides.entities || [{ name: 'Local Tea Stall', type: 'merchant' }],
    tags: overrides.tags || ['chai', 'breakfast', 'pune'],
    metadata: overrides.metadata || {},
  };
}

export function runLifeGraphEngineTests(): { passed: number; failed: number; errors: string[] } {
  let passed = 0;
  let failed = 0;
  const errors: string[] = [];

  function assert(condition: boolean, testName: string, errorDetail?: string) {
    if (condition) {
      passed++;
      console.log(`  [PASS] ${testName}`);
    } else {
      failed++;
      const msg = `  [FAIL] ${testName}: ${errorDetail || 'Assertion failed'}`;
      console.error(msg);
      errors.push(msg);
    }
  }

  console.log('=== RUNNING LIFE GRAPH ENGINE TEST SUITE ===\n');

  // Test 1: Temporal Proximity Scoring & Reason Generation
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({
      id: 'hh-1',
      source: 'household',
      dateStr: '2016-04-15',
      hour: 8,
      timestamp: new Date('2016-04-15T08:30:00Z').getTime(),
      title: 'Auto Rickshaw to Station',
      category: 'Transportation & Commute',
    });

    const r2 = createMockReceipt({
      id: 'spot-1',
      source: 'spotify',
      dateStr: '2016-04-15',
      hour: 8,
      timestamp: new Date('2016-04-15T08:45:00Z').getTime(),
      title: 'Here Comes The Sun',
      subtitle: 'The Beatles',
      category: 'Music & Audio',
    });

    const conn = engine.evaluatePair(r1, r2);
    assert(conn !== null, 'Temporal + Category Pair returns connection');
    assert(conn?.signals.temporal !== undefined, 'Temporal signal is detected');
    assert(conn?.signals.temporal?.score === 95, 'Same hour temporal score is 95');
    assert(conn?.reasons.some(r => r.includes('within') || r.includes('2016-04-15')) ?? false, 'Temporal reason explains date/time');
  }

  // Test 2: Spatial Proximity & Geographic Co-location
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({
      id: 'hh-pune',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5204, long: 73.8567, context: 'Pune Central' },
    });

    const r2 = createMockReceipt({
      id: 'comm-pune',
      source: 'commerce',
      location: { city: 'Pune', state: 'Maharashtra', country: 'India', lat: 18.5300, long: 73.8600, context: 'Pune Retail Hub' },
    });

    const conn = engine.evaluatePair(r1, r2);
    assert(conn !== null, 'Spatial co-location detected');
    assert(conn?.signals.spatial !== undefined, 'Spatial signal populated');
    assert(conn?.reasons.some(r => r.includes('Pune')) ?? false, 'Reason explicitly names Pune location');
  }

  // Test 3: Shared Entity Matching
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({
      id: 'rec-sub',
      source: 'household',
      title: 'Audible Monthly Membership',
      category: 'Subscriptions & Digital',
      entities: [{ name: 'Audible', type: 'subscription_service' }],
    });

    const r2 = createMockReceipt({
      id: 'rec-audio',
      source: 'spotify',
      title: 'Audiobook Track 01',
      category: 'Music & Audio',
      entities: [{ name: 'Audible', type: 'subscription_service' }],
    });

    const conn = engine.evaluatePair(r1, r2);
    assert(conn !== null, 'Entity match detected');
    assert(conn?.signals.entity?.score === 95, 'Exact entity match receives 95 score');
    assert(conn?.reasons.some(r => r.includes('Audible')) ?? false, 'Reason explicitly references entity Audible');
  }

  // Test 4: Category Affinity & Sequential Financial Workflow (Salary -> SIP)
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({
      id: 'rec-salary',
      source: 'household',
      type: 'household_income',
      category: 'Income & Salary',
      dateStr: '2017-03-01',
      timestamp: new Date('2017-03-01T10:00:00Z').getTime(),
      title: 'Monthly Salary Credit',
      amount: 65000,
    });

    const r2 = createMockReceipt({
      id: 'rec-sip',
      source: 'household',
      type: 'household_transfer',
      category: 'Investments & Savings',
      dateStr: '2017-03-03',
      timestamp: new Date('2017-03-03T11:00:00Z').getTime(),
      title: 'Equity Mutual Fund SIP Transfer',
      amount: 15000,
    });

    const conn = engine.evaluatePair(r1, r2);
    assert(conn !== null, 'Salary to Investment sequential workflow detected');
    assert(conn?.signals.sequential !== undefined, 'Sequential signal identified');
    assert(conn?.signals.category !== undefined, 'Category affinity identified');
    assert(conn?.strength === 'pivotal' || conn?.strength === 'strong', 'Sequential financial connection has strong/pivotal strength');
    assert(conn?.reasons.some(r => r.includes('Salary credited')) ?? false, 'Reason factually explains sequential salary-to-investment allocation');
  }

  // Test 5: Repeated Behavior Routine Window (Morning 07:30 AM)
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({
      id: 'rec-chai-morn',
      hour: 8,
      title: 'Morning Cutting Chai',
      category: 'Food & Dining',
    });

    const r2 = createMockReceipt({
      id: 'rec-milk-morn',
      hour: 7,
      title: 'Daily Milk Delivery',
      category: 'Food & Dining',
    });

    const conn = engine.evaluatePair(r1, r2);
    assert(conn !== null, 'Morning routine co-occurrence detected');
    assert(conn?.signals.behavioral !== undefined, 'Behavioral routine signal recognized');
    assert(conn?.reasons.some(r => r.includes('morning routine window')) ?? false, 'Reason explains morning window (07:00–09:30 AM)');
  }

  // Test 6: Inverted Index & Candidate Discovery with 1,000 Receipts
  {
    const mockReceipts: LifeReceipt[] = [];
    for (let i = 0; i < 1000; i++) {
      const isSpot = i % 2 === 0;
      mockReceipts.push(
        createMockReceipt({
          id: `bulk-${i}`,
          source: isSpot ? 'spotify' : 'household',
          category: isSpot ? 'Music & Audio' : 'Transportation & Commute',
          dateStr: `2016-0${(i % 9) + 1}-15`,
          title: isSpot ? `Track ${i}` : `Auto Ride ${i}`,
        })
      );
    }

    const startTime = performance.now();
    const engine = new LifeGraphEngine(mockReceipts);
    const connections = engine.discoverConnections({ minScore: 40, limit: 30 });
    const elapsed = performance.now() - startTime;

    assert(connections.length > 0, `Discovered ${connections.length} cross-dataset connections`);
    assert(elapsed < 100, `Graph discovery completed in ${Math.round(elapsed)}ms (< 100ms threshold)`);
  }

  // Test 7: Epistemological Honesty (Zero psychological speculation)
  {
    const engine = new LifeGraphEngine();
    const r1 = createMockReceipt({ id: 'epist-1', title: 'Late Night Track' });
    const r2 = createMockReceipt({ id: 'epist-2', title: 'Late Night Coffee' });

    const conn = engine.evaluatePair(r1, r2);
    if (conn) {
      const allReasons = conn.reasons.join(' ').toLowerCase();
      assert(!allReasons.includes('depressed'), 'Does not diagnose depression');
      assert(!allReasons.includes('personality trait'), 'Does not claim personality traits');
      assert(!allReasons.includes('subconscious'), 'Does not claim subconscious intent');
    }
  }

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  return { passed, failed, errors };
}
