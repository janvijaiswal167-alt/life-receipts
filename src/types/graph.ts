/**
 * Graph & Connection Model Types for LIFE//RECEIPTS
 * Defines schema for explainable relational links, signal contributions, and topological nodes.
 */

import { LifeReceipt, ReceiptSource, CanonicalCategory, ReceiptType } from './receipt';

export type ConnectionStrength = 'pivotal' | 'strong' | 'moderate' | 'low';

export type SignalType =
  | 'temporal'
  | 'spatial'
  | 'entity'
  | 'category'
  | 'behavioral'
  | 'sequential'
  | 'semantic';

export interface SignalContribution {
  type: SignalType;
  score: number; // 0 to 100 contribution
  weight: number;
  description: string;
}

export interface ReceiptConnection {
  id: string;
  sourceReceipt: LifeReceipt;
  targetReceipt: LifeReceipt;
  score: number; // Overall composite score (0 - 100)
  strength: ConnectionStrength;
  relationshipType: string;
  reasons: string[];
  signals: {
    temporal?: SignalContribution;
    spatial?: SignalContribution;
    entity?: SignalContribution;
    category?: SignalContribution;
    behavioral?: SignalContribution;
    sequential?: SignalContribution;
    semantic?: SignalContribution;
  };
  crossDataset: boolean; // True if connecting two different source datasets
  timestampDeltaHours: number;
}

export interface GraphCluster {
  id: string;
  label: string;
  theme: string;
  centerReceiptId?: string;
  receiptCount: number;
  dominantCategory: CanonicalCategory;
  sources: ReceiptSource[];
  dateRange: { start: string; end: string };
}

export interface LifeGraphQueryOptions {
  minScore?: number;
  limit?: number;
  crossDatasetOnly?: boolean;
  targetReceiptId?: string;
  categoryFilter?: CanonicalCategory[];
  sourceFilter?: ReceiptSource[];
  maxTemporalGapDays?: number;
}
