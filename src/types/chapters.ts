import type { LifeReceipt } from './receipt.ts';
import type { CrossConnection, LifeMoment } from '../engine/patternEngine.ts';

export interface ChapterMetric {
  label: string;
  value: string;
  sublabel?: string;
  isHighlight?: boolean;
}

export interface ChapterActivityBreakdown {
  category: string;
  count: number;
  percentage: string;
  spendAmount?: number;
  formattedSpend?: string;
}

export interface LifeChapter {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  badge?: string;
  dateRange: {
    startDate: string;
    endDate: string;
    formatted: string;
    yearStart: number;
    yearEnd: number;
  };
  dominantCategories: string[];
  supportingMetrics: ChapterMetric[];
  activityBreakdown: ChapterActivityBreakdown[];
  evidenceStatements: string[];
  importantMoments: LifeMoment[];
  importantConnections: CrossConnection[];
  evidenceReceipts: LifeReceipt[];
  narrativeOverview: string;
  tags: string[];
}
