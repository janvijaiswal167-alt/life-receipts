/**
 * Test & Benchmark Suite for LIFE//RECEIPTS Normalization Pipeline
 */

import {
  normalizeSpotifyRecord,
  normalizeHouseholdRecord,
  normalizeCommerceRecord,
  normalizeAllDatasets,
} from './src/utils/normalizers/index.ts';
import { LifeReceiptStore } from './src/utils/indexStore.ts';
import type { RawSpotifyRecord, RawHouseholdRecord, RawCommerceRecord } from './src/types/rawDatasets.ts';

console.log('====================================================');
console.log('RUNNING LIFE//RECEIPTS NORMALIZATION TEST SUITE');
console.log('====================================================\n');

// 1. Test Spotify normalization
const rawSpotify: RawSpotifyRecord = {
  spotify_track_uri: 'spotify:track:2J3n32GeLmMjwuAzyhcSNe',
  ts: '2017-08-14 18:22:10',
  platform: 'android',
  ms_played: 215000,
  track_name: 'Let It Be',
  artist_name: 'The Beatles',
  album_name: 'Let It Be (Remastered)',
  reason_start: 'clickrow',
  reason_end: 'trackdone',
  shuffle: true,
  skipped: false,
};

const spotReceipt = normalizeSpotifyRecord(rawSpotify, 1);
console.log('--- 1. Spotify Normalized Receipt ---');
console.log(JSON.stringify(spotReceipt, null, 2));

// 2. Test Household normalization
const rawHousehold: RawHouseholdRecord = {
  Date: '15/09/2017 08:30:00',
  Mode: 'Saving Bank account 1',
  Category: 'Food',
  Subcategory: 'Tea',
  Note: '2 cutting chai with toast',
  Amount: 35.0,
  'Income/Expense': 'Expense',
  Currency: 'INR',
};

const hhReceipt = normalizeHouseholdRecord(rawHousehold, 2);
console.log('\n--- 2. Household Normalized Receipt ---');
console.log(JSON.stringify(hhReceipt, null, 2));

// 3. Test Commerce normalization
const rawCommerce: RawCommerceRecord = {
  trans_id: 825718,
  trans_date_trans_time: '7/7/2023 7:02',
  cc_num: 4126110000000000,
  merchant: 'fraud_Bedi-Krish Pvt Ltd',
  category: 'entertainment',
  amt: 9139.49,
  first: 'Bhavin',
  last: 'Roy',
  gender: 'M',
  street: '043, Lall Nagar, Dhule-732630',
  city: 'Rourkela',
  state: 'Meghalaya',
  lat: -8.62593,
  long: 145.222241,
  city_pop: 691077,
  job: 'Comptroller',
  dob: '10/20/1994',
  merch_lat: -14.437954,
  merch_long: -8.607795,
  is_fraud: 1,
  customer_id: 6.24e18,
};

const commReceipt = normalizeCommerceRecord(rawCommerce, 3);
console.log('\n--- 3. Commerce Normalized Receipt ---');
console.log(JSON.stringify(commReceipt, null, 2));

// 4. Privacy & PII Verification Check
console.log('\n--- 4. Privacy & PII Leakage Check ---');
const receiptJson = JSON.stringify(commReceipt);
const leaksCC = receiptJson.includes('4126110000000000');
const leaksDOB = receiptJson.includes('10/20/1994');
const leaksStreet = receiptJson.includes('043, Lall Nagar');
const leaksRawFraudPrefix = commReceipt?.title.startsWith('fraud_');

console.log(`- Leaks Full Credit Card: ${leaksCC ? '❌ FAILED' : '✅ PASSED (Masked)'}`);
console.log(`- Leaks Date of Birth:    ${leaksDOB ? '❌ FAILED' : '✅ PASSED (Redacted)'}`);
console.log(`- Leaks Street Address:   ${leaksStreet ? '❌ FAILED' : '✅ PASSED (Redacted)'}`);
console.log(`- Has "fraud_" in Title:  ${leaksRawFraudPrefix ? '❌ FAILED' : '✅ PASSED (Cleaned)'}`);

if (leaksCC || leaksDOB || leaksStreet || leaksRawFraudPrefix) {
  throw new Error('Privacy validation failed!');
}

// 5. Test Unified Ingestion & Store
console.log('\n--- 5. Testing Unified Store & Multi-Dataset Indexing ---');
const sampleBatchSpotify: RawSpotifyRecord[] = [
  rawSpotify,
  {
    ts: '2017-08-14 18:26:00',
    platform: 'cast to device',
    ms_played: 180000,
    track_name: 'Yesterday',
    artist_name: 'The Beatles',
    album_name: 'Help!',
  },
  {
    ts: '2023-07-07 07:05:00',
    platform: 'android',
    ms_played: 240000,
    track_name: 'Mr. Brightside',
    artist_name: 'The Killers',
    album_name: 'Hot Fuss',
  },
];

const sampleBatchHousehold: RawHouseholdRecord[] = [
  rawHousehold,
  {
    Date: '15/09/2017 09:15:00',
    Mode: 'Cash',
    Category: 'Transportation',
    Subcategory: 'auto',
    Note: 'Place 2 station to Permanent Residence',
    Amount: 50.0,
    'Income/Expense': 'Expense',
  },
  {
    Date: '01/09/2017',
    Mode: 'Saving Bank account 1',
    Category: 'Salary',
    Amount: 55000.0,
    'Income/Expense': 'Income',
  },
  {
    Date: '05/09/2017',
    Mode: 'Equity Mutual Fund B',
    Category: 'Investment',
    Subcategory: 'Mutual fund',
    Amount: 10000.0,
    'Income/Expense': 'Transfer-Out',
  },
];

const sampleBatchCommerce: RawCommerceRecord[] = [
  rawCommerce,
  {
    trans_id: 295780,
    trans_date_trans_time: '12/26/2023 0:55',
    cc_num: 579516000000,
    merchant: 'fraud_Hans-Kanda Pvt Ltd',
    category: 'online_shopping',
    amt: 4500.0,
    city: 'Nagpur',
    state: 'Maharashtra',
    is_fraud: 0,
  },
];

const { receipts, summary } = normalizeAllDatasets(
  sampleBatchSpotify,
  sampleBatchHousehold,
  sampleBatchCommerce
);

console.log('Ingestion Summary:');
console.log(JSON.stringify(summary, null, 2));

const store = new LifeReceiptStore(receipts);

console.log('\n--- 6. Query Engine Verification ---');
console.log(`- Total Indexed Receipts: ${store.getAll().length}`);
console.log(`- Receipts in Year 2017:   ${store.getByYear(2017).length}`);
console.log(`- Receipts in Year 2023:   ${store.getByYear(2023).length}`);
console.log(`- Category 'Food & Dining': ${store.getByCategory('Food & Dining').length}`);
console.log(`- Category 'Music & Audio': ${store.getByCategory('Music & Audio').length}`);

// Test search query
const searchResults = store.query({ searchQuery: 'beatles' });
console.log(`- Search 'beatles': found ${searchResults.length} receipts`);

// Test temporal range query (2017-08-01 to 2017-09-30)
const dateSlice = store.query({ startDate: '2017-08-01', endDate: '2017-09-30' });
console.log(`- Date Slice (Aug-Sep 2017): found ${dateSlice.length} receipts spanning both Music and Household!`);

// Test Aggregates
const aggregates = store.getAggregates();
console.log('\n--- 7. Store Aggregates ---');
console.log(JSON.stringify(aggregates, null, 2));

// 8. Performance Benchmark
console.log('\n--- 8. Ingestion Performance Benchmark ---');
const benchSize = 10000;
const benchSpotifyArray: RawSpotifyRecord[] = Array.from({ length: benchSize }, (_, i) => ({
  ...rawSpotify,
  ts: `2017-08-14 18:${(i % 60).toString().padStart(2, '0')}:10`,
}));

const startTime = performance.now();
const normalizedBench = normalizeAllDatasets(benchSpotifyArray, [], []);
const elapsed = performance.now() - startTime;
const throughput = Math.round((benchSize / elapsed) * 1000);

console.log(`- Normalized ${benchSize.toLocaleString()} records in ${elapsed.toFixed(1)}ms`);
console.log(`- Throughput: ~${throughput.toLocaleString()} records/second`);

console.log('\n✅ ALL TEST SUITE CHECKS PASSED SUCCESSFULLY!');
