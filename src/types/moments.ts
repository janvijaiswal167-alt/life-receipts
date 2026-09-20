/**
 * Moments Model Types for LIFE//RECEIPTS
 * Defines structure for multi-receipt real-world and behavioral episodes.
 */

import type { LifeReceipt, ReceiptSource, CanonicalCategory } from './receipt.ts';

export type MomentEpisodeType =
  | 'commute_transit'
  | 'morning_ritual'
  | 'salary_investment'
  | 'subscription_surge'
  | 'travel_commerce'
  | 'evening_relaxation'
  | 'security_incident'
  | 'general_episode';

export interface MomentExplanation {
  summary: string;
  groupingSignals: string[];
  signalBreakdown: {
    temporal?: string;
    spatial?: string;
    entity?: string;
    category?: string;
    sequential?: string;
    behavioral?: string;
  };
}

export interface LifeMoment {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  episodeType: MomentEpisodeType;
  receipts: LifeReceipt[];
  dominantCategories: CanonicalCategory[];
  timeRange: {
    start: string;
    end: string;
    formattedSpan: string;
  };
  locations: string[];
  connectionScore: number; // 0 - 100
  explanation: MomentExplanation;
  stats: {
    receiptCount: number;
    totalAmountInr?: number;
    totalDurationFormatted?: string;
    sources: ReceiptSource[];
  };
}
