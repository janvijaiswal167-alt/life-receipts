import React, { useState, useMemo } from 'react';
import { useLifeReceipts } from './hooks/useLifeReceipts';
import { MuseumHeader } from './components/museum/MuseumHeader';
import { MuseumNav } from './components/museum/MuseumNav';
import { ProgressBar } from './components/ui/ProgressBar';
import { Modal } from './components/ui/Modal';
import { ArchivalReceipt } from './components/museum/ArchivalReceipt';
import { Footer } from './components/layout/Footer';
import { RevealStoryModal } from './components/story/RevealStoryModal';

import { MainExperiencePage } from './pages/MainExperiencePage';
import { TimelinePage } from './pages/TimelinePage';
import { HouseholdFinancePage } from './pages/HouseholdFinancePage';
import { AudioSoundtrackPage } from './pages/AudioSoundtrackPage';
import { CommerceSecurityPage } from './pages/CommerceSecurityPage';
import { StoryCapsulePage } from './pages/StoryCapsulePage';
import { EntityGraphPage } from './pages/EntityGraphPage';

import { extractLifeMoments } from './engine/momentsEngine';
import { discoverCrossConnections, discoverLifePatterns, CrossConnection } from './engine/patternEngine';
import { discoverLifeChapters } from './engine/chaptersEngine';
import { findContextualLinksForReceipt } from './engine/crossIntegration';
import { LifeMoment } from './types/moments';
import { LifePattern } from './types/patterns';
import { LifeChapter } from './types/chapters';
import { MomentDetailModal } from './components/experience/MomentDetailModal';
import { PatternEvidenceModal } from './components/experience/PatternEvidenceModal';
import { ChapterDetailModal } from './components/experience/ChapterDetailModal';

export function App() {
  const {
    isLoading,
    progress,
    store,
    filteredReceipts,
    aggregates,
    storyChapters,
    graphConnections,
    filters,
    updateFilter,
    resetFilters,
    useSampleMode,
    setUseSampleMode,
    activeTab,
    setActiveTab,
    selectedReceipt,
    setSelectedReceipt,
  } = useLifeReceipts();

  const [isStoryModeOpen, setIsStoryModeOpen] = useState<boolean>(false);
  const [selectedMoment, setSelectedMoment] = useState<LifeMoment | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<LifePattern | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<LifeChapter | null>(null);

  // Compute unified cross-feature analytical objects from the active receipts
  const allMoments = useMemo(() => extractLifeMoments(filteredReceipts), [filteredReceipts]);
  const allConnections = useMemo(() => discoverCrossConnections(filteredReceipts), [filteredReceipts]);
  const allPatterns = useMemo(() => discoverLifePatterns(filteredReceipts), [filteredReceipts]);
  const allChapters = useMemo(() => discoverLifeChapters(filteredReceipts), [filteredReceipts]);

  // Compute bidirectional contextual graph links for the currently inspected receipt
  const receiptContextualLinks = useMemo(() => {
    return findContextualLinksForReceipt(selectedReceipt, allMoments, allConnections, allPatterns, allChapters);
  }, [selectedReceipt, allMoments, allConnections, allPatterns, allChapters]);

  const handleSelectConnection = (c: CrossConnection) => {
    // Find parent moment embedding this connection or open receipt
    const linkedMoment = allMoments.find(m =>
      m.receipts.some(r => r.id === c.receiptA.id || r.id === c.receiptB.id)
    );
    if (linkedMoment) {
      setSelectedReceipt(null);
      setSelectedMoment(linkedMoment);
    } else {
      setSelectedReceipt(c.receiptA);
    }
  };

  if (isLoading) {
    return <ProgressBar progress={progress} />;
  }

  return (
    <div className="min-h-screen bg-[#08090C] text-[#EDE8DF] flex flex-col font-sans selection:bg-archival-amber/25 selection:text-[#F4F1EA]">
      {/* Museum Archival Header */}
      <MuseumHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={filters.searchQuery || ''}
        onSearchChange={q => updateFilter('searchQuery', q)}
        useSampleMode={useSampleMode}
        onToggleSampleMode={val => setUseSampleMode(val)}
        totalReceipts={aggregates?.totalReceipts || filteredReceipts.length}
      />

      {/* Exhibit Numbered Tab Navigation */}
      <MuseumNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Experience & Exhibit Stages */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {activeTab === 'overview' && (
          <MainExperiencePage
            receipts={filteredReceipts}
            aggregates={aggregates}
            storyChapters={storyChapters}
            onSelectReceipt={r => setSelectedReceipt(r)}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenStoryMode={() => setIsStoryModeOpen(true)}
            onSelectYearFilter={yr => updateFilter('years', [yr])}
            onSelectMoment={m => setSelectedMoment(m)}
            onSelectConnection={handleSelectConnection}
            onSelectPattern={p => setSelectedPattern(p)}
            onSelectChapter={ch => setSelectedChapter(ch)}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelinePage
            receipts={filteredReceipts}
            filters={filters}
            onUpdateFilter={updateFilter}
            onResetFilters={resetFilters}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}

        {activeTab === 'spending' && (
          <HouseholdFinancePage
            receipts={filteredReceipts}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}

        {activeTab === 'audio' && (
          <AudioSoundtrackPage
            receipts={filteredReceipts}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}

        {activeTab === 'commerce' && (
          <CommerceSecurityPage
            receipts={filteredReceipts}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}

        {activeTab === 'stories' && (
          <StoryCapsulePage
            chapters={storyChapters}
            onOpenStoryMode={() => setIsStoryModeOpen(true)}
          />
        )}

        {activeTab === 'graph' && (
          <EntityGraphPage
            receipts={filteredReceipts}
            connections={graphConnections}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}
      </main>

      {/* Archival Receipt Detail Modal with Contextual Graph Links */}
      <Modal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        title="EXHIBIT ARTIFACT // PHYSICAL RECEIPT INSPECTOR"
      >
        <div className="py-2">
          <ArchivalReceipt
            receipt={selectedReceipt}
            contextualLinks={receiptContextualLinks}
            onSelectMoment={m => {
              setSelectedReceipt(null);
              setSelectedMoment(m);
            }}
            onSelectConnection={c => {
              setSelectedReceipt(null);
              handleSelectConnection(c);
            }}
            onSelectPattern={p => {
              setSelectedReceipt(null);
              setSelectedPattern(p);
            }}
            onSelectChapter={ch => {
              setSelectedReceipt(null);
              setSelectedChapter(ch);
            }}
          />
        </div>
      </Modal>

      {/* Interactive Moment Inspection Modal */}
      <MomentDetailModal
        moment={selectedMoment}
        onClose={() => setSelectedMoment(null)}
        onSelectReceipt={r => {
          setSelectedMoment(null);
          setSelectedReceipt(r);
        }}
        allConnections={allConnections}
        allPatterns={allPatterns}
        allChapters={allChapters}
        onSelectConnection={c => {
          setSelectedMoment(null);
          handleSelectConnection(c);
        }}
        onSelectPattern={p => {
          setSelectedMoment(null);
          setSelectedPattern(p);
        }}
        onSelectChapter={ch => {
          setSelectedMoment(null);
          setSelectedChapter(ch);
        }}
      />

      {/* Interactive Pattern Evidence Modal */}
      <PatternEvidenceModal
        pattern={selectedPattern}
        onClose={() => setSelectedPattern(null)}
        onSelectReceipt={r => {
          setSelectedPattern(null);
          setSelectedReceipt(r);
        }}
        allMoments={allMoments}
        allChapters={allChapters}
        onSelectMoment={m => {
          setSelectedPattern(null);
          setSelectedMoment(m);
        }}
        onSelectChapter={ch => {
          setSelectedPattern(null);
          setSelectedChapter(ch);
        }}
        onNavigateToReceipts={() => {
          setSelectedPattern(null);
          setActiveTab('timeline');
        }}
      />

      {/* Interactive Chapter Detail Modal */}
      <ChapterDetailModal
        chapter={selectedChapter}
        onClose={() => setSelectedChapter(null)}
        onSelectReceipt={r => {
          setSelectedChapter(null);
          setSelectedReceipt(r);
        }}
        allPatterns={allPatterns}
        onSelectPattern={p => {
          setSelectedChapter(null);
          setSelectedPattern(p);
        }}
        onSelectMoment={m => {
          setSelectedChapter(null);
          setSelectedReceipt(m.receipt);
        }}
      />

      {/* REVEAL MY STORY — Interactive Presentation Modal */}
      <RevealStoryModal
        isOpen={isStoryModeOpen}
        onClose={() => setIsStoryModeOpen(false)}
        receipts={filteredReceipts}
        store={store}
        onSelectReceipt={r => setSelectedReceipt(r)}
        onNavigateTab={tab => setActiveTab(tab)}
      />

      {/* Museum Archival Footer */}
      <Footer
        totalCount={aggregates?.totalReceipts || filteredReceipts.length}
        useSampleMode={useSampleMode}
      />
    </div>
  );
}

export default App;
