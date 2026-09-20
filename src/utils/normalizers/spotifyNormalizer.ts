/**
 * Spotify Streaming History Normalizer
 * Transforms raw Spotify records into canonical LifeReceipts with high performance.
 */

import type { LifeReceipt, ReceiptLocation, ReceiptEntity } from '../../types/receipt.ts';
import type { RawSpotifyRecord } from '../../types/rawDatasets.ts';
import { parseSpotifyDate, formatDurationMs } from '../dateParser.ts';

export function normalizeSpotifyRecord(
  raw: RawSpotifyRecord,
  index: number
): LifeReceipt | null {
  if (!raw) return null;

  const parsedDate = parseSpotifyDate(raw.ts);
  if (!parsedDate) return null;

  const trackName = (raw.track_name && String(raw.track_name).trim()) || 'Untitled Track';
  const artistName = (raw.artist_name && String(raw.artist_name).trim()) || 'Unknown Artist';
  const albumName = (raw.album_name && String(raw.album_name).trim()) || 'Unknown Album';
  const platform = (raw.platform && String(raw.platform).trim().toLowerCase()) || 'other';

  const msPlayed = typeof raw.ms_played === 'number' ? raw.ms_played : parseInt(String(raw.ms_played || '0'), 10);
  const validMs = isNaN(msPlayed) || msPlayed < 0 ? 0 : msPlayed;

  const shuffle = raw.shuffle === true || raw.shuffle === 'True' || raw.shuffle === 'true' || raw.shuffle === '1';
  const skipped = raw.skipped === true || raw.skipped === 'True' || raw.skipped === 'true' || raw.skipped === '1';

  // Derive physical environment context from platform
  let contextLabel = 'Audio Playback';
  if (platform.includes('cast')) {
    contextLabel = 'Home Smart Speaker / Living Room';
  } else if (platform.includes('android') || platform.includes('ios')) {
    contextLabel = 'Mobile / On-the-Move';
  } else if (platform.includes('windows') || platform.includes('mac')) {
    contextLabel = 'Workstation / Study Desk';
  } else if (platform.includes('web')) {
    contextLabel = 'Web Browser Session';
  }

  const location: ReceiptLocation = {
    city: null,
    state: null,
    country: null,
    lat: null,
    long: null,
    context: contextLabel,
  };

  // Build semantic graph entities
  const entities: ReceiptEntity[] = [
    { name: artistName, type: 'artist' },
    { name: trackName, type: 'track' },
  ];

  if (albumName && albumName !== 'Unknown Album') {
    entities.push({ name: albumName, type: 'album' });
  }
  if (platform) {
    entities.push({ name: platform, type: 'device' });
  }

  const formattedDuration = formatDurationMs(validMs);

  const metadata = {
    durationMs: validMs,
    durationFormatted: formattedDuration,
    platform: platform,
    reasonStart: raw.reason_start ? String(raw.reason_start).trim() : 'standard',
    reasonEnd: raw.reason_end ? String(raw.reason_end).trim() : 'standard',
    shuffle: shuffle,
    skipped: skipped,
    trackUri: raw.spotify_track_uri ? String(raw.spotify_track_uri).trim() : null,
  };

  const tags: string[] = [
    'music',
    'streaming',
    platform,
    skipped ? 'skipped' : 'listened',
    shuffle ? 'shuffle' : 'sequential',
  ];

  return {
    id: `spot_${index}`,
    source: 'spotify',
    type: 'audio_stream',

    timestamp: parsedDate.timestamp,
    isoDate: parsedDate.isoDate,
    dateStr: parsedDate.dateStr,
    timeStr: parsedDate.timeStr,
    year: parsedDate.year,
    month: parsedDate.month,
    dayOfMonth: parsedDate.dayOfMonth,
    dayOfWeek: parsedDate.dayOfWeek,
    hour: parsedDate.hour,

    title: trackName,
    subtitle: artistName,
    description: `${trackName} by ${artistName} on ${albumName} (${formattedDuration})`,

    category: 'Music & Audio',
    subcategory: albumName !== 'Unknown Album' ? albumName : 'Single Track',
    rawCategory: 'Music Streaming',

    amount: null,
    currency: null,

    location,
    entities,
    metadata,
    tags,
  };
}

/**
 * Batch normalizer for array of raw Spotify rows
 */
export function normalizeSpotifyBatch(records: RawSpotifyRecord[], startIndex = 0): LifeReceipt[] {
  const receipts: LifeReceipt[] = [];
  const len = records.length;
  for (let i = 0; i < len; i++) {
    const item = normalizeSpotifyRecord(records[i], startIndex + i);
    if (item) {
      receipts.push(item);
    }
  }
  return receipts;
}
