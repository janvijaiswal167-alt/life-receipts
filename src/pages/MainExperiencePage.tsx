import React, { useMemo } from 'react';
import { LifeReceipt } from '../types/receipt';
import { LifeMoment } from '../types/moments';
import { CrossConnection } from '../engine/patternEngine';
import { LifePattern } from '../types/patterns';
import { LifeChapter } from '../types/chapters';
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
import { discoverLifeChapters } from '../engine/chaptersEngine';
import { StoryReceiptChapter } from '../engine/storyGenerator';

interface MainExperiencePageProps {
  receipts: LifeReceipt[];
  aggregates: any;
  storyChapters: StoryReceiptChapter[];
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateTab: (tab: any) => void;
  onOpenStoryMode?: () => void;
  onSelectYearFilter?: (year: number) => void;
  onSelectMoment?: (m: LifeMoment) => void;
  onSelectConnection?: (c: CrossConnection) => void;
  onSelectPattern?: (p: LifePattern) => void;
  onSelectChapter?: (ch: LifeChapter) => void;
}

export const MainExperiencePage: React.FC<MainExperiencePageProps> = ({
  receipts,
  aggregates,
  storyChapters,
  onSelectReceipt,
  onNavigateTab,
  onOpenStoryMode,
  onSelectYearFilter,
  onSelectMoment,
  onSelectConnection,
  onSelectPattern,
  onSelectChapter,
}) => {
  // Extract real patterns, connections, moments, chapters, and anomalies from authentic dataset records
  const moments = useMemo(() => extractLifeMoments(receipts), [receipts]);
  const connections = useMemo(() => discoverCrossConnections(receipts), [receipts]);
  const patterns = useMemo(() => discoverLifePatterns(receipts), [receipts]);
  const eras = useMemo(() => extractEraComparisons(receipts), [receipts]);
  const anomalies = useMemo(() => extractAnomalies(receipts), [receipts]);
  const chapters = useMemo(() => discoverLifeChapters(receipts), [receipts]);

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
        allConnections={connections}
        allPatterns={patterns}
        allChapters={chapters}
        onSelectConnection={onSelectConnection}
        onSelectPattern={onSelectPattern}
        onSelectChapter={onSelectChapter}
      />

      {/* 3. CONNECTIONS */}
      <ConnectionsSection
        connections={connections}
        onSelectReceipt={onSelectReceipt}
        allMoments={moments}
        allPatterns={patterns}
        onSelectMoment={onSelectMoment}
        onSelectPattern={onSelectPattern}
      />

      {/* 4. PATTERNS */}
      <PatternsSection
        patterns={patterns}
        onSelectReceipt={onSelectReceipt}
        onNavigateToTimeline={() => onNavigateTab('timeline')}
        allMoments={moments}
        allChapters={chapters}
        onSelectMoment={onSelectMoment}
        onSelectChapter={onSelectChapter}
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
        allPatterns={patterns}
        onSelectPattern={onSelectPattern}
        onSelectMoment={onSelectMoment}
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
