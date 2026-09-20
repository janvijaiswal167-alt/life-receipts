import React from 'react';
import { useLifeReceipts } from './hooks/useLifeReceipts';
import { MuseumHeader } from './components/museum/MuseumHeader';
import { MuseumNav } from './components/museum/MuseumNav';
import { ProgressBar } from './components/ui/ProgressBar';
import { Modal } from './components/ui/Modal';
import { ArchivalReceipt } from './components/museum/ArchivalReceipt';
import { Footer } from './components/layout/Footer';

import { MainExperiencePage } from './pages/MainExperiencePage';
import { TimelinePage } from './pages/TimelinePage';
import { HouseholdFinancePage } from './pages/HouseholdFinancePage';
import { AudioSoundtrackPage } from './pages/AudioSoundtrackPage';
import { CommerceSecurityPage } from './pages/CommerceSecurityPage';
import { StoryCapsulePage } from './pages/StoryCapsulePage';
import { EntityGraphPage } from './pages/EntityGraphPage';

export function App() {
  const {
    isLoading,
    progress,
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
            onSelectYearFilter={yr => updateFilter('years', [yr])}
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
          <StoryCapsulePage chapters={storyChapters} />
        )}

        {activeTab === 'graph' && (
          <EntityGraphPage
            receipts={filteredReceipts}
            connections={graphConnections}
            onSelectReceipt={r => setSelectedReceipt(r)}
          />
        )}
      </main>

      {/* Archival Receipt Detail Modal */}
      <Modal
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        title="EXHIBIT ARTIFACT // PHYSICAL RECEIPT INSPECTOR"
      >
        <div className="py-2">
          <ArchivalReceipt receipt={selectedReceipt} />
        </div>
      </Modal>

      {/* Museum Archival Footer */}
      <Footer
        totalCount={aggregates?.totalReceipts || filteredReceipts.length}
        useSampleMode={useSampleMode}
      />
    </div>
  );
}

export default App;
