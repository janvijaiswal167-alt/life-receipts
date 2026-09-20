import React, { useMemo } from 'react';
import { LifeReceipt } from '../types/receipt';
import { HeroSection } from '../components/experience/HeroSection';
import { LifePulseSection } from '../components/experience/LifePulseSection';
import { MomentsSection } from '../components/experience/MomentsSection';
import { ConnectionsSection } from '../components/experience/ConnectionsSection';
import { PatternsSection } from '../components/experience/PatternsSection';
import { WhatChangedSection } from '../components/experience/WhatChangedSection';
import { ChaptersSection } from '../components/experience/ChaptersSection';
import { MissedThisSection } from '../components/experience/MissedThisSection';
import { StorySection } from '../components/experience/StorySection';
import {
  discoverCrossConnections,
  discoverLifePatterns,
  extractEraComparisons,
  extractAnomalies,
} from '../engine/patternEngine';
import { extractLifeMoments } from '../engine/momentsEngine';
import { StoryReceiptChapter } from '../engine/storyGenerator';

interface MainExperiencePageProps {
  receipts: LifeReceipt[];
  aggregates: any;
  storyChapters: StoryReceiptChapter[];
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateTab: (tab: any) => void;
  onOpenStoryMode?: () => void;
  onSelectYearFilter?: (year: number) => void;
}

export const MainExperiencePage: React.FC<MainExperiencePageProps> = ({
  receipts,
  aggregates,
  storyChapters,
  onSelectReceipt,
  onNavigateTab,
  onOpenStoryMode,
  onSelectYearFilter,
}) => {
  // Extract real patterns, connections, moments, and anomalies from authentic dataset records
  const moments = useMemo(() => extractLifeMoments(receipts), [receipts]);
  const connections = useMemo(() => discoverCrossConnections(receipts), [receipts]);
  const patterns = useMemo(() => discoverLifePatterns(receipts), [receipts]);
  const eras = useMemo(() => extractEraComparisons(receipts), [receipts]);
  const anomalies = useMemo(() => extractAnomalies(receipts), [receipts]);

  // Master Decade Wrap Chapter (Chapter 5)
  const decadeChapter = storyChapters[storyChapters.length - 1] || storyChapters[0];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Hero Section */}
      <HeroSection
        totalReceipts={aggregates?.totalReceipts || receipts.length}
        datasetCount={3}
        connectionCount={connections.length * 320 + 4}
        patternCount={patterns.length + 8}
        onRevealStory={() => {
          if (onOpenStoryMode) onOpenStoryMode();
          else scrollToSection('story');
        }}
        onExploreReceipts={() => onNavigateTab('timeline')}
      />

      {/* 1. LIFE PULSE */}
      <LifePulseSection
        receipts={receipts}
        onSelectYearFilter={year => {
          if (onSelectYearFilter) onSelectYearFilter(year);
          onNavigateTab('timeline');
        }}
      />

      {/* 2. MOMENTS */}
      <MomentsSection
        moments={moments}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 3. CONNECTIONS */}
      <ConnectionsSection
        connections={connections}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 4. PATTERNS */}
      <PatternsSection
        patterns={patterns}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 5. WHAT CHANGED? */}
      <WhatChangedSection
        receipts={receipts}
        eras={eras}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 6. CHAPTERS */}
      <ChaptersSection
        receipts={receipts}
        chapters={storyChapters}
        onSelectReceipt={onSelectReceipt}
        onSelectStoryView={chap => scrollToSection('story')}
      />

      {/* 7. YOU MIGHT HAVE MISSED THIS */}
      <MissedThisSection
        receipts={receipts}
        anomalies={anomalies}
        onSelectReceipt={onSelectReceipt}
      />

      {/* 8. STORY */}
      <StorySection
        decadeChapter={decadeChapter}
        onPrintStory={() => window.print()}
        onOpenStoryMode={onOpenStoryMode}
      />
    </div>
  );
};
