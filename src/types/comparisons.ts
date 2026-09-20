import type { LifeReceipt } from './receipt.ts';

export type ChangeDomain =
  | 'music'
  | 'spending'
  | 'travel'
  | 'entertainment'
  | 'technology'
  | 'security'
  | 'general';

export type ChangeDirection =
  | 'increased'
  | 'decreased'
  | 'emerged'
  | 'shifted'
  | 'stable';

export interface PeriodSnapshot {
  label: string;
  timeSpan: string;
  metricValue: string;
  numericValue?: number;
  sublabel?: string;
  receiptCount?: number;
}

export interface MetricDelta {
  percentage?: string;
  absolute?: string;
  directionText: string;
  isPositive?: boolean;
}

export interface PeriodChangeItem {
  id: string;
  domain: ChangeDomain;
  title: string;
  direction: ChangeDirection;
  factualStatement: string;
  beforePeriod: PeriodSnapshot;
  afterPeriod: PeriodSnapshot;
  delta: MetricDelta;
  underlyingReceipts: LifeReceipt[];
  details: string;
  categoryTag?: string;
}

export interface PeriodSummary {
  id: string;
  name: string;
  timeSpan: string;
  summary: string;
  receiptCount: number;
  totalSpend: number;
  audioHours: number;
  primaryDevice?: string;
  topCategories?: string[];
  topEntities?: string[];
}

export interface PeriodComparison {
  id: string;
  title: string;
  periodA: PeriodSummary;
  periodB: PeriodSummary;
  changes: PeriodChangeItem[];
  categoryDeltas: {
    category: string;
    beforeCount: number;
    afterCount: number;
    beforeSpend: number;
    afterSpend: number;
    changeText: string;
    direction: ChangeDirection;
  }[];
}
