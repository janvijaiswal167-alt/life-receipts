/**
 * Unit Tests for MOMENTS ENGINE
 * Validates episodic grouping, signal explainability, structure integrity, and performance.
 */

import { LifeMomentsEngine, extractLifeMoments } from './momentsEngine.ts';
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
    title: overrides.title || 'Auto to Pune Station',
    subtitle: overrides.subtitle || 'Auto Rickshaw',
    description: overrides.description || 'Commute to railway station',
    category: overrides.category || 'Transportation & Commute',
    subcategory: overrides.subcategory || 'Transit',
    rawCategory: overrides.rawCategory || 'Travel',
    amount: overrides.amount !== undefined ? overrides.amount : 45,
    currency: 'INR',
    location: overrides.location !== undefined ? overrides.location : {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      lat: 18.5204,
      long: 73.8567,
      context: 'Pune Transit Station',
    },
    entities: overrides.entities || [{ name: 'Auto Rickshaw', type: 'transit_route' }],
    tags: overrides.tags || ['auto', 'transit', 'pune'],
    metadata: overrides.metadata || {},
  };
}

export function runMomentsEngineTests(): { passed: number; failed: number; errors: string[] } {
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

  console.log('=== RUNNING MOMENTS ENGINE TEST SUITE ===\n');

  // Test 1: Commute & Audio Episode Clustering
  {
    const r1 = createMockReceipt({
      id: 'hh-transit-1',
      source: 'household',
      dateStr: '2016-04-15',
      timeStr: '08:15',
      hour: 8,
      timestamp: new Date('2016-04-15T08:15:00Z').getTime(),
      title: 'Auto Rickshaw to Station',
      category: 'Transportation & Commute',
    });

    const r2 = createMockReceipt({
      id: 'spot-track-1',
      source: 'spotify',
      dateStr: '2016-04-15',
      timeStr: '08:20',
      hour: 8,
      timestamp: new Date('2016-04-15T08:20:00Z').getTime(),
      title: 'Come Together',
      subtitle: 'The Beatles',
      category: 'Music & Audio',
      metadata: { durationFormatted: '4:19', durationMs: 259000 },
    });

    const engine = new LifeMomentsEngine([r1, r2]);
    const moments = engine.extractMoments();

    assert(moments.length >= 1, 'Commute episode extracted');
    const commuteMoment = moments.find(m => m.episodeType === 'commute_transit');
    assert(commuteMoment !== undefined, 'Commute transit episode type verified');
    assert(commuteMoment?.receipts.length === 2, 'Moment contains both transit and audio receipts');
    assert(commuteMoment?.connectionScore >= 90, 'Moment has high connection score (>= 90)');
    assert(commuteMoment?.explanation.groupingSignals.length >= 3, 'Contains at least 3 factual grouping signals');
  }

  // Test 2: Salary & Systematic Investment Allocation Episode
  {
    const sal = createMockReceipt({
      id: 'hh-sal',
      source: 'household',
      type: 'household_income',
      category: 'Income & Salary',
      dateStr: '2017-03-01',
      timeStr: '10:00',
      timestamp: new Date('2017-03-01T10:00:00Z').getTime(),
      title: 'Monthly Salary Credit',
      amount: 75000,
    });

    const sip1 = createMockReceipt({
      id: 'hh-sip-1',
      source: 'household',
      type: 'household_transfer',
      category: 'Investments & Savings',
      dateStr: '2017-03-03',
      timeStr: '11:00',
      timestamp: new Date('2017-03-03T11:00:00Z').getTime(),
      title: 'Equity Mutual Fund Folio A',
      amount: 10000,
    });

    const sip2 = createMockReceipt({
      id: 'hh-sip-2',
      source: 'household',
      type: 'household_transfer',
      category: 'Investments & Savings',
      dateStr: '2017-03-04',
      timeStr: '11:30',
      timestamp: new Date('2017-03-04T11:30:00Z').getTime(),
      title: 'Equity Mutual Fund Folio B',
      amount: 10000,
    });

    const moments = extractLifeMoments([sal, sip1, sip2]);
    const finMoment = moments.find(m => m.episodeType === 'salary_investment');

    assert(finMoment !== undefined, 'Salary-to-investment allocation moment identified');
    assert(finMoment?.receipts.length === 3, 'Groups salary credit with all subsequent SIP transfers');
    assert(finMoment?.explanation.groupingSignals.some(s => s.includes('Sequential financial chain')) ?? false, 'Explains sequential financial workflow');
    assert(finMoment?.stats.totalAmountInr === 95000, 'Computes total capital managed in episode');
  }

  // Test 3: Moment Data Contract Integrity (All required fields)
  {
    const r1 = createMockReceipt({ id: 'hh-chai-1', title: 'Cutting Chai', category: 'Food & Dining', dateStr: '2016-05-10', hour: 8 });
    const r2 = createMockReceipt({ id: 'hh-milk-1', title: 'Milk Packet', category: 'Food & Dining', dateStr: '2016-05-10', hour: 8 });
    const r3 = createMockReceipt({ id: 'spot-morn-1', source: 'spotify', category: 'Music & Audio', dateStr: '2016-05-10', hour: 8 });

    const moments = extractLifeMoments([r1, r2, r3]);
    assert(moments.length > 0, 'Moments extracted');

    const m = moments[0];
    assert(typeof m.id === 'string' && m.id.length > 0, 'Has valid string id');
    assert(Array.isArray(m.receipts) && m.receipts.length >= 2, 'Has receipts array with >= 2 items');
    assert(Array.isArray(m.dominantCategories) && m.dominantCategories.length > 0, 'Has dominantCategories');
    assert(typeof m.timeRange.formattedSpan === 'string', 'Has formatted time range');
    assert(Array.isArray(m.locations), 'Has locations array');
    assert(typeof m.connectionScore === 'number' && m.connectionScore >= 0 && m.connectionScore <= 100, 'Has valid connectionScore (0-100)');
    assert(typeof m.explanation.summary === 'string' && m.explanation.summary.length > 0, 'Has explanation summary');
    assert(Array.isArray(m.explanation.groupingSignals) && m.explanation.groupingSignals.length > 0, 'Has groupingSignals array');
  }

  // Test 4: Epistemological Honesty (No psychological speculation)
  {
    const r1 = createMockReceipt({ id: 'ep-1', title: 'Night Chai' });
    const r2 = createMockReceipt({ id: 'ep-2', source: 'spotify', title: 'Slow Blues' });

    const moments = extractLifeMoments([r1, r2]);
    for (const m of moments) {
      const fullText = (m.explanation.summary + ' ' + m.explanation.groupingSignals.join(' ')).toLowerCase();
      assert(!fullText.includes('lonely'), 'Does not speculate loneliness');
      assert(!fullText.includes('anxiety'), 'Does not diagnose anxiety');
      assert(!fullText.includes('escapism'), 'Does not speculate escapism');
    }
  }

  // Test 5: Performance with 1,000+ Receipts
  {
    const bulkReceipts: LifeReceipt[] = [];
    for (let i = 0; i < 1000; i++) {
      bulkReceipts.push(
        createMockReceipt({
          id: `bulk-${i}`,
          source: i % 3 === 0 ? 'spotify' : i % 3 === 1 ? 'household' : 'commerce',
          category: i % 2 === 0 ? 'Music & Audio' : 'Food & Dining',
          dateStr: `2016-04-${(i % 28) + 1}`,
          hour: (i % 14) + 7,
        })
      );
    }

    const t0 = performance.now();
    const moments = extractLifeMoments(bulkReceipts);
    const duration = performance.now() - t0;

    assert(moments.length > 0, `Extracted ${moments.length} moments from 1,000 receipts`);
    assert(duration < 100, `Moments clustering completed in ${Math.round(duration)}ms (< 100ms threshold)`);
  }

  console.log(`\n=== MOMENTS TEST SUMMARY: ${passed} PASSED, ${failed} FAILED ===`);
  return { passed, failed, errors };
}
