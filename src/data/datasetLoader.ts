/**
 * Client-Side Dataset Loader for LIFE//RECEIPTS
 * Loads and parses local CSV/JSON datasets using PapaParse directly in the browser.
 */

import Papa from 'papaparse';
import { LifeReceipt, NormalizationSummary } from '../types/receipt';
import { RawSpotifyRecord, RawHouseholdRecord, RawCommerceRecord } from '../types/rawDatasets';
import { normalizeAllDatasets } from '../utils/normalizers';

export interface LoadingProgress {
  stage: 'idle' | 'fetching' | 'parsing_spotify' | 'parsing_household' | 'parsing_commerce' | 'normalizing' | 'indexing' | 'ready';
  percent: number;
  message: string;
  counts: {
    spotify: number;
    household: number;
    commerce: number;
    total: number;
  };
}

export type ProgressCallback = (progress: LoadingProgress) => void;

/**
 * Loads CSV text via fetch and parses into typed objects
 */
async function fetchAndParseCSV<T>(
  url: string,
  onRowChunk?: (count: number) => void
): Promise<T[]> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load dataset from ${url} (status: ${response.status})`);
  }
  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: results => {
        resolve(results.data as T[]);
      },
      error: (err: any) => {
        reject(err);
      },
    });
  });
}

/**
 * Loads all 3 datasets asynchronously and returns unified normalized LifeReceipts
 */
export async function loadAllLifeDatasets(
  useSampleSpotify = true,
  onProgress?: ProgressCallback
): Promise<{ receipts: LifeReceipt[]; summary: NormalizationSummary }> {
  const progress: LoadingProgress = {
    stage: 'fetching',
    percent: 5,
    message: 'Initializing local dataset loaders...',
    counts: { spotify: 0, household: 0, commerce: 0, total: 0 },
  };

  const update = (patch: Partial<LoadingProgress>) => {
    Object.assign(progress, patch);
    if (onProgress) onProgress({ ...progress });
  };

  update({ stage: 'fetching', percent: 10, message: 'Loading Household Transactions (2015-2018)...' });

  // 1. Load Household
  const householdData = await fetchAndParseCSV<RawHouseholdRecord>('/data/daily_household.csv');
  progress.counts.household = householdData.length;
  update({ stage: 'parsing_household', percent: 35, message: `Loaded ${householdData.length.toLocaleString()} household entries.` });

  // 2. Load Commerce
  update({ stage: 'fetching', percent: 45, message: 'Loading India Commerce & Security Transactions (2022-2024)...' });
  const commerceData = await fetchAndParseCSV<RawCommerceRecord>('/data/india_transactions.csv');
  progress.counts.commerce = commerceData.length;
  update({ stage: 'parsing_commerce', percent: 65, message: `Loaded ${commerceData.length.toLocaleString()} commerce entries.` });

  // 3. Load Spotify (Sample by default for instant sub-second boot, or full 150k on demand)
  const spotifyUrl = useSampleSpotify ? '/data/spotify_sample.csv' : '/data/spotify_history.csv';
  update({
    stage: 'fetching',
    percent: 75,
    message: `Loading ${useSampleSpotify ? 'Spotify Audio Snapshot' : 'Complete Spotify History (150k tracks)'}...`,
  });

  const spotifyData = await fetchAndParseCSV<RawSpotifyRecord>(spotifyUrl);
  progress.counts.spotify = spotifyData.length;
  progress.counts.total = progress.counts.household + progress.counts.commerce + progress.counts.spotify;

  update({ stage: 'normalizing', percent: 90, message: `Normalizing ${progress.counts.total.toLocaleString()} multi-dataset life records...` });

  // 4. Normalize all datasets
  // Give UI a moment to render progress
  await new Promise(r => setTimeout(r, 10));

  const result = normalizeAllDatasets(spotifyData, householdData, commerceData, {
    sortChronological: true,
  });

  update({
    stage: 'ready',
    percent: 100,
    message: `Successfully loaded ${result.receipts.length.toLocaleString()} life receipts!`,
  });

  return result;
}
