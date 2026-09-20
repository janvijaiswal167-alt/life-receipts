import { LifeReceiptStore } from './src/utils/indexStore.ts';
import { LifeMomentsEngine, extractLifeMoments } from './src/engine/momentsEngine.ts';
import { discoverCrossConnections, discoverLifePatterns } from './src/engine/patternEngine.ts';
import { discoverLifeChapters } from './src/engine/chaptersEngine.ts';
import { discoverHighValueFindings } from './src/engine/discoveriesEngine.ts';
import { generateEraComparisons } from './src/engine/comparisonEngine.ts';
import type { LifeReceipt } from './src/types/receipt.ts';

// Generate 150,000 synthetic Spotify records + 2,400 Household records + 2,900 Commerce records for stress testing
console.log('Generating 155,300 benchmark life receipts...');
const tGenStart = performance.now();

const sampleReceipts: LifeReceipt[] = [];

// 1. Spotify 150,000 items
const artists = ['The Beatles', 'The Killers', 'John Mayer', 'A.R. Rahman', 'Coldplay', 'Pink Floyd', 'Queen', 'Radiohead'];
const albums = ['Abbey Road', 'Hot Fuss', 'Continuum', 'Rockstar', 'Parachutes', 'The Dark Side of the Moon', 'A Night at the Opera', 'OK Computer'];

for (let i = 0; i < 150000; i++) {
  const yr = 2013 + (i % 12);
  const mo = String(1 + (i % 12)).padStart(2, '0');
  const da = String(1 + (i % 28)).padStart(2, '0');
  const hr = i % 24;
  const artIdx = i % artists.length;
  
  sampleReceipts.push({
    id: `spot-bench-${i}`,
    source: 'spotify',
    type: 'audio_stream',
    title: `Track Title ${i % 500}`,
    subtitle: artists[artIdx],
    category: 'Music & Audio',
    timestamp: new Date(`${yr}-${mo}-${da}T${String(hr).padStart(2, '0')}:00:00Z`).getTime(),
    dateStr: `${yr}-${mo}-${da}`,
    timeStr: `${String(hr).padStart(2, '0')}:00`,
    year: yr,
    month: 1 + (i % 12),
    dayOfWeek: i % 7,
    hour: hr,
    entities: [{ name: artists[artIdx], type: 'artist' }],
    metadata: {
      albumName: albums[artIdx],
      durationMs: 180000 + (i % 60000),
      durationFormatted: '3m 15s',
      platform: i % 2 === 0 ? 'Android' : 'Desktop',
    },
  });
}

// 2. Household 2,460 items
for (let i = 0; i < 2460; i++) {
  const yr = 2015 + (i % 4);
  const mo = String(1 + (i % 12)).padStart(2, '0');
  const da = String(1 + (i % 28)).padStart(2, '0');
  const hr = 7 + (i % 14);
  const isChai = i % 3 === 0;
  const isIncome = i % 30 === 0;
  const isInvest = i % 30 === 2;

  sampleReceipts.push({
    id: `hh-bench-${i}`,
    source: 'household',
    type: isIncome ? 'household_income' : isInvest ? 'household_transfer' : 'household_expense',
    title: isChai ? 'Morning Cutting Chai & Biscuit' : isIncome ? 'Monthly Salary Credit' : isInvest ? 'Mutual Fund SIP Equity' : 'Auto Commute to Station',
    category: isIncome ? 'Income & Salary' : isInvest ? 'Investments & Savings' : isChai ? 'Food & Dining' : 'Transportation & Commute',
    amount: isIncome ? 85000 : isInvest ? 15000 : isChai ? 15 : 60,
    timestamp: new Date(`${yr}-${mo}-${da}T${String(hr).padStart(2, '0')}:00:00Z`).getTime(),
    dateStr: `${yr}-${mo}-${da}`,
    timeStr: `${String(hr).padStart(2, '0')}:00`,
    year: yr,
    month: 1 + (i % 12),
    dayOfWeek: i % 7,
    hour: hr,
    location: { city: 'Pune', state: 'Maharashtra', context: 'Pune Transit Corridor' },
    entities: [{ name: 'State Bank of India', type: 'bank' }],
  });
}

// 3. Commerce 2,900 items
for (let i = 0; i < 2900; i++) {
  const yr = 2022 + (i % 3);
  const mo = String(1 + (i % 12)).padStart(2, '0');
  const da = String(1 + (i % 28)).padStart(2, '0');
  const hr = 10 + (i % 12);
  const isFraud = i % 20 === 0;

  sampleReceipts.push({
    id: `comm-bench-${i}`,
    source: 'commerce',
    type: 'commercial_transaction',
    title: `Merchant POS Terminal ${i % 50}`,
    category: 'Shopping & Retail',
    amount: 150 + (i % 5000),
    timestamp: new Date(`${yr}-${mo}-${da}T${String(hr).padStart(2, '0')}:00:00Z`).getTime(),
    dateStr: `${yr}-${mo}-${da}`,
    timeStr: `${String(hr).padStart(2, '0')}:00`,
    year: yr,
    month: 1 + (i % 12),
    dayOfWeek: i % 7,
    hour: hr,
    location: { city: 'Mumbai', state: 'Maharashtra', distanceKm: isFraud ? 8500 : 12 },
    metadata: { isFraud },
    entities: [{ name: `Merchant POS ${i % 50}`, type: 'merchant' }],
  });
}

console.log(`Generated ${sampleReceipts.length.toLocaleString()} total receipts in ${(performance.now() - tGenStart).toFixed(1)}ms`);

// ----------------------------------------------------------------------------
// BENCHMARK 1: Index Building & Precomputed Aggregations
// ----------------------------------------------------------------------------
console.log('\n--- 1. Testing LifeReceiptStore Indexing (155k records) ---');
const tIndexStart = performance.now();
const store = new LifeReceiptStore(sampleReceipts);
const tIndexEnd = performance.now();
console.log(`✓ Store indexed in ${(tIndexEnd - tIndexStart).toFixed(2)}ms`);

const tAggStart = performance.now();
const aggregates = store.getAggregates();
const tAggEnd = performance.now();
console.log(`✓ O(1) Precomputed aggregates retrieved in ${(tAggEnd - tAggStart).toFixed(4)}ms`);
console.log(`  - Total Outflow: ₹${aggregates.totalExpenseInr.toLocaleString('en-IN')}`);
console.log(`  - Total Audio Hours: ${aggregates.totalMusicHours.toLocaleString()}h`);

// ----------------------------------------------------------------------------
// BENCHMARK 2: Inverted Search Query Speed (Token Index)
// ----------------------------------------------------------------------------
console.log('\n--- 2. Testing Inverted Search Index Queries ---');
const queries = ['Beatles', 'Chai', 'Pune', 'Salary', 'Station'];

for (const q of queries) {
  const tQStart = performance.now();
  const res = store.query({ searchQuery: q });
  const tQEnd = performance.now();
  console.log(`✓ Search "${q}": ${res.length.toLocaleString()} matches in ${(tQEnd - tQStart).toFixed(2)}ms`);
}

// ----------------------------------------------------------------------------
// BENCHMARK 3: Multi-facet Filter Query Speed
// ----------------------------------------------------------------------------
console.log('\n--- 3. Testing Multi-facet Filter Queries ---');
const tFilterStart = performance.now();
const filtered = store.query({
  sources: ['household', 'commerce'],
  years: [2016, 2023],
  categories: ['Transportation & Commute', 'Shopping & Retail'],
});
const tFilterEnd = performance.now();
console.log(`✓ Multi-facet query: ${filtered.length.toLocaleString()} matches in ${(tFilterEnd - tFilterStart).toFixed(2)}ms`);

// ----------------------------------------------------------------------------
// BENCHMARK 4: Moments Engine Clustering Speed
// ----------------------------------------------------------------------------
console.log('\n--- 4. Testing Moments Engine (155k scale) ---');
const tMomentsStart = performance.now();
const moments = extractLifeMoments(sampleReceipts);
const tMomentsEnd = performance.now();
console.log(`✓ Discovered ${moments.length} moments in ${(tMomentsEnd - tMomentsStart).toFixed(2)}ms`);

const tMomentsCacheStart = performance.now();
const cachedMoments = extractLifeMoments(sampleReceipts);
const tMomentsCacheEnd = performance.now();
console.log(`✓ Cached moments retrieved in ${(tMomentsCacheEnd - tMomentsCacheStart).toFixed(4)}ms`);

// ----------------------------------------------------------------------------
// BENCHMARK 5: Pattern Engine Discovery Speed
// ----------------------------------------------------------------------------
console.log('\n--- 5. Testing Pattern Engine (155k scale) ---');
const tPatternStart = performance.now();
const patterns = discoverLifePatterns(sampleReceipts);
const tPatternEnd = performance.now();
console.log(`✓ Discovered ${patterns.length} patterns in ${(tPatternEnd - tPatternStart).toFixed(2)}ms`);

// ----------------------------------------------------------------------------
// BENCHMARK 6: Chapters & Discoveries Engine Speed
// ----------------------------------------------------------------------------
console.log('\n--- 6. Testing Chapters & Discoveries Engines (155k scale) ---');
const tChapStart = performance.now();
const chapters = discoverLifeChapters(sampleReceipts);
const tChapEnd = performance.now();
console.log(`✓ Discovered ${chapters.length} chapters in ${(tChapEnd - tChapStart).toFixed(2)}ms`);

const tDiscStart = performance.now();
const discoveries = discoverHighValueFindings(sampleReceipts);
const tDiscEnd = performance.now();
console.log(`✓ Discovered ${discoveries.length} discoveries in ${(tDiscEnd - tDiscStart).toFixed(2)}ms`);

// ----------------------------------------------------------------------------
// BENCHMARK 7: Era Comparisons Engine Speed
// ----------------------------------------------------------------------------
console.log('\n--- 7. Testing Period Comparisons Engine (155k scale) ---');
const tCompStart = performance.now();
const comparisons = generateEraComparisons(sampleReceipts);
const tCompEnd = performance.now();
console.log(`✓ Generated ${comparisons.length} era comparisons in ${(tCompEnd - tCompStart).toFixed(2)}ms`);

console.log('\n======================================================');
console.log('ALL BENCHMARKS COMPLETED SUCCESSFULLY AT 155K SCALE!');
console.log('======================================================\n');
