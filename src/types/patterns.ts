import type { LifeReceipt } from './receipt.ts';

export type PatternType =
  | 'peak_activity'
  | 'repeated_entity'
  | 'repeated_category'
  | 'recurring_location'
  | 'spending_concentration'
  | 'time_of_day'
  | 'period_change'
  | 'dense_activity'
  | 'repeated_sequence';

export interface PatternStats {
  count: number;
  totalValue?: string;
  dominantCategory?: string;
  peakTime?: string;
  percentage?: string;
  frequency?: string;
  strengthScore?: number; // 0.0 to 1.0
}

export interface PatternBreakdownItem {
  label: string;
  value: number;
  formattedValue?: string;
  sublabel?: string;
}

export interface LifePattern {
  id: string;
  patternType: PatternType;
  title: string;
  category: string;
  evidence: string;
  supportingReceipts: LifeReceipt[];
  metricValue: string;
  confidence: string; // e.g. "99.2% (High Support)"
  confidenceScore: number; // 0.0 to 1.0
  era?: string;
  timeSpan?: string;
  summary: string;
  stats: PatternStats;
  breakdown?: PatternBreakdownItem[];
  tags?: string[];
}

export interface PatternDetectionOptions {
  minOccurrences?: number;
  confidenceThreshold?: number;
  sampleLimit?: number;
}
