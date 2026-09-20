/**
 * STORY MODE TYPES
 * Interfaces for the 7-step interactive presentation narrative:
 * 1. Intro
 * 2. Dataset scale
 * 3. Important patterns
 * 4. Important connections
 * 5. Moments
 * 6. Chapters
 * 7. Final summary
 */

import type { LifeReceipt, ReceiptSource, CanonicalCategory } from './receipt.ts';
import type { LifeMoment } from './moments.ts';
import type { LifePattern } from './patterns.ts';
import type { CrossConnection } from '../engine/patternEngine.ts';
import type { LifeChapter } from './chapters.ts';
import type { StoryReceiptChapter } from '../engine/storyGenerator.ts';

export type StoryStepType =
  | 'intro'
  | 'scale'
  | 'patterns'
  | 'connections'
  | 'moments'
  | 'chapters'
  | 'summary';

export interface StorySlideStep {
  id: string;
  stepNumber: number;
  totalSteps: number;
  type: StoryStepType;
  badge: string;
  title: string;
  leadQuote: string;
  subtitle: string;
  evidenceHeadline: string;
  evidenceStatements: string[];
  supportingReceipts: LifeReceipt[];
  metrics?: Array<{
    label: string;
    value: string;
    sublabel?: string;
    isHighlight?: boolean;
  }>;
  payload?: {
    scaleData?: {
      totalReceipts: number;
      audioCount: number;
      householdCount: number;
      commerceCount: number;
      dateSpanFormatted: string;
      totalSpendFormatted: string;
      totalAudioHoursFormatted: string;
      citiesCount: number;
    };
    patterns?: LifePattern[];
    connections?: CrossConnection[];
    moments?: LifeMoment[];
    chapters?: LifeChapter[];
    decadeChapter?: StoryReceiptChapter;
  };
}

export interface StoryModeNarrative {
  title: string;
  subtitle: string;
  totalSteps: number;
  steps: StorySlideStep[];
  endingStatement: string;
}
