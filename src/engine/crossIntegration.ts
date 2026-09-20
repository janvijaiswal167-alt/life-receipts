/**
 * CROSS-FEATURE INTEGRATION ENGINE
 * 
 * Provides unified, bidirectional connective queries tying together:
 * Receipts ↔ Moments ↔ Connections ↔ Patterns ↔ What Changed ↔ Chapters ↔ Story Mode
 * 
 * Guarantees ONE coherent data experience across the entire museum application.
 */

import type { LifeReceipt } from '../types/receipt.ts';
import type { LifeMoment } from '../types/moments.ts';
import type { LifePattern } from '../types/patterns.ts';
import type { CrossConnection } from './patternEngine.ts';
import type { LifeChapter } from '../types/chapters.ts';

export interface ReceiptContextualLinks {
  moments: LifeMoment[];
  connections: CrossConnection[];
  patterns: LifePattern[];
  chapter?: LifeChapter;
}

/**
 * Finds all related moments, connections, patterns, and chapter for a given receipt
 */
export function findContextualLinksForReceipt(
  receipt: LifeReceipt | null | undefined,
  allMoments: LifeMoment[],
  allConnections: CrossConnection[],
  allPatterns: LifePattern[],
  allChapters: LifeChapter[]
): ReceiptContextualLinks {
  if (!receipt) {
    return { moments: [], connections: [], patterns: [] };
  }

  // 1. Find Moments containing this receipt or on the exact same date & time window
  const matchingMoments = allMoments.filter(m => {
    const hasDirectReceipt = m.receipts.some(r => r.id === receipt.id);
    if (hasDirectReceipt) return true;
    // Also match if same date and category
    return m.receipts.some(r => r.dateStr === receipt.dateStr && r.category === receipt.category);
  });

  // 2. Find Connections that include this receipt (as receiptA or receiptB)
  const matchingConnections = allConnections.filter(c => {
    if (c.receiptA?.id === receipt.id || c.receiptB?.id === receipt.id) return true;
    if (c.receiptA?.dateStr === receipt.dateStr || c.receiptB?.dateStr === receipt.dateStr) {
      return c.category === receipt.category || receipt.source !== 'spotify';
    }
    return false;
  });

  // 3. Find Patterns for which this receipt is supporting evidence or domain match
  const matchingPatterns = allPatterns.filter(p => {
    const hasDirect = p.supportingReceipts.some(r => r.id === receipt.id);
    if (hasDirect) return true;
    // Match based on category/entity keywords
    if (p.category === receipt.category) return true;
    const lowerText = `${receipt.title} ${receipt.subtitle || ''} ${receipt.description || ''}`.toLowerCase();
    if (p.id.includes('chai') && (lowerText.includes('chai') || lowerText.includes('tea') || lowerText.includes('milk'))) return true;
    if (p.id.includes('beatles') && lowerText.includes('beatles')) return true;
    if (p.id.includes('salary') && (receipt.category === 'Income & Salary' || receipt.category === 'Investments & Savings')) return true;
    return false;
  });

  // 4. Find Chapter era corresponding to this receipt's year
  const matchingChapter = allChapters.find(ch => {
    return receipt.year >= ch.dateRange.yearStart && receipt.year <= ch.dateRange.yearEnd;
  });

  return {
    moments: matchingMoments.slice(0, 3),
    connections: matchingConnections.slice(0, 3),
    patterns: matchingPatterns.slice(0, 3),
    chapter: matchingChapter,
  };
}

/**
 * Finds all cross-connections and patterns associated with a specific Life Moment
 */
export function findLinksForMoment(
  moment: LifeMoment | null | undefined,
  allConnections: CrossConnection[],
  allPatterns: LifePattern[],
  allChapters: LifeChapter[]
): {
  connections: CrossConnection[];
  patterns: LifePattern[];
  chapter?: LifeChapter;
} {
  if (!moment) return { connections: [], patterns: [] };

  const receiptIds = new Set(moment.receipts.map(r => r.id));
  const dates = new Set(moment.receipts.map(r => r.dateStr));

  const connections = allConnections.filter(c => {
    return (
      (c.receiptA && receiptIds.has(c.receiptA.id)) ||
      (c.receiptB && receiptIds.has(c.receiptB.id)) ||
      (c.receiptA && dates.has(c.receiptA.dateStr)) ||
      (c.receiptB && dates.has(c.receiptB.dateStr))
    );
  });

  const patterns = allPatterns.filter(p => {
    return (
      moment.dominantCategories.includes(p.category as any) ||
      p.supportingReceipts.some(r => receiptIds.has(r.id))
    );
  });

  const firstReceipt = moment.receipts[0];
  const chapter = firstReceipt
    ? allChapters.find(ch => firstReceipt.year >= ch.dateRange.yearStart && firstReceipt.year <= ch.dateRange.yearEnd)
    : undefined;

  return {
    connections: connections.slice(0, 4),
    patterns: patterns.slice(0, 4),
    chapter,
  };
}

/**
 * Finds all moments and chapter associated with a specific Pattern
 */
export function findLinksForPattern(
  pattern: LifePattern | null | undefined,
  allMoments: LifeMoment[],
  allChapters: LifeChapter[]
): {
  moments: LifeMoment[];
  chapter?: LifeChapter;
} {
  if (!pattern) return { moments: [] };

  const receiptIds = new Set(pattern.supportingReceipts.map(r => r.id));

  const moments = allMoments.filter(m => {
    return (
      m.dominantCategories.includes(pattern.category as any) ||
      m.receipts.some(r => receiptIds.has(r.id))
    );
  });

  const firstReceipt = pattern.supportingReceipts[0];
  const chapter = firstReceipt
    ? allChapters.find(ch => firstReceipt.year >= ch.dateRange.yearStart && firstReceipt.year <= ch.dateRange.yearEnd)
    : undefined;

  return {
    moments: moments.slice(0, 3),
    chapter,
  };
}
