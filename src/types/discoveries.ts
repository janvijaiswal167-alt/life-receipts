import type { LifeReceipt } from './receipt.ts';

export type DiscoveryType =
  | 'repeated_entity'
  | 'strong_connection'
  | 'recurring_place'
  | 'activity_shift'
  | 'unexpected_sequence'
  | 'dense_cluster'
  | 'micro_anomaly';

export interface LifeDiscovery {
  id: string;
  type: DiscoveryType;
  title: string;
  metric: string;
  evidence: string;
  explanation: string;
  supportingRecords: LifeReceipt[];
  context: string;
  surpriseScore?: number; // 0-100
  badge?: string;
  tags?: string[];
}
