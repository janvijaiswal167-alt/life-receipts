/**
 * Unified Normalizers Index & Ingestion Pipeline
 * Exports individual and batch normalizers for all 3 datasets.
 */

import type { LifeReceipt, ReceiptSource, NormalizationSummary } from '../../types/receipt.ts';
import type { RawSpotifyRecord, RawHouseholdRecord, RawCommerceRecord } from '../../types/rawDatasets.ts';
import { normalizeSpotifyRecord, normalizeSpotifyBatch } from './spotifyNormalizer.ts';
import { normalizeHouseholdRecord, normalizeHouseholdBatch } from './householdNormalizer.ts';
import { normalizeCommerceRecord, normalizeCommerceBatch } from './commerceNormalizer.ts';

export * from './spotifyNormalizer.ts';
export * from './householdNormalizer.ts';
export * from './commerceNormalizer.ts';

export interface IngestOptions {
  sortChronological?: boolean;
}

/**
 * Normalizes a single raw record from any known source
 */
export function normalizeSingleRecord(
  source: ReceiptSource,
  rawRecord: any,
  index: number
): LifeReceipt | null {
  switch (source) {
    case 'spotify':
      return normalizeSpotifyRecord(rawRecord as RawSpotifyRecord, index);
    case 'household':
      return normalizeHouseholdRecord(rawRecord as RawHouseholdRecord, index);
    case 'commerce':
      return normalizeCommerceRecord(rawRecord as RawCommerceRecord, index);
    default:
      return null;
  }
}

/**
 * Merges and normalizes all 3 dataset batches into a single unified array of LifeReceipts
 */
export function normalizeAllDatasets(
  spotifyRecords: RawSpotifyRecord[] = [],
  householdRecords: RawHouseholdRecord[] = [],
  commerceRecords: RawCommerceRecord[] = [],
  options: IngestOptions = { sortChronological: true }
): { receipts: LifeReceipt[]; summary: NormalizationSummary } {
  const spotReceipts = normalizeSpotifyBatch(spotifyRecords, 0);
  const hhReceipts = normalizeHouseholdBatch(householdRecords, 0);
  const commReceipts = normalizeCommerceBatch(commerceRecords, 0);

  let combined: LifeReceipt[] = [...spotReceipts, ...hhReceipts, ...commReceipts];

  if (options.sortChronological) {
    combined.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Generate metadata summary
  const summary: NormalizationSummary = {
    totalProcessed: spotifyRecords.length + householdRecords.length + commerceRecords.length,
    validCount: combined.length,
    skippedCount:
      spotifyRecords.length +
      householdRecords.length +
      commerceRecords.length -
      combined.length,
    sourceCounts: {
      spotify: spotReceipts.length,
      household: hhReceipts.length,
      commerce: commReceipts.length,
    },
    categoryCounts: {},
    timeRange: {
      minTimestamp: combined.length > 0 ? combined[0].timestamp : 0,
      maxTimestamp: combined.length > 0 ? combined[combined.length - 1].timestamp : 0,
      minDateStr: combined.length > 0 ? combined[0].dateStr : '',
      maxDateStr: combined.length > 0 ? combined[combined.length - 1].dateStr : '',
    },
  };

  for (let i = 0; i < combined.length; i++) {
    const cat = combined[i].category;
    summary.categoryCounts[cat] = (summary.categoryCounts[cat] || 0) + 1;
  }

  return { receipts: combined, summary };
}
