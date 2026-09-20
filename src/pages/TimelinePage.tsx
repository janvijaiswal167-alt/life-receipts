import React, { useState, useMemo } from 'react';
import { LifeReceipt } from '../types/receipt';
import { QueryFilters } from '../utils/indexStore';
import { ReceiptFilterSidebar } from '../components/explorer/ReceiptFilterSidebar';
import { ReceiptSortBar, ViewMode } from '../components/explorer/ReceiptSortBar';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { ThermalReceiptMiniCard } from '../components/museum/ThermalReceiptMiniCard';
import { ArchivalReceiptTable } from '../components/museum/ArchivalReceiptTable';
import { Filter, X, Search, Sparkles, SlidersHorizontal, Eye, RotateCcw } from 'lucide-react';

interface TimelinePageProps {
  receipts: LifeReceipt[];
  filters: QueryFilters;
  onUpdateFilter: <K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => void;
  onResetFilters: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  receipts,
  filters,
  onUpdateFilter,
  onResetFilters,
  onSelectReceipt,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Pagination calculation
  const totalItems = receipts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedReceipts = useMemo(() => {
    const startIdx = (validPage - 1) * itemsPerPage;
    return receipts.slice(startIdx, startIdx + itemsPerPage);
  }, [receipts, validPage, itemsPerPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.min(Math.max(1, newPage), totalPages));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Exhibit Overview Hero Banner */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-5 sm:p-7 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-6 opacity-5 pointer-events-none">
          <span className="font-mono text-9xl font-extrabold text-white">RECEIPTS</span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-archival-amber uppercase">
              <span className="border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5">
                EXHIBIT 01
              </span>
              <span>UNIFIED ARTIFACT EXPLORER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              LIFE<span className="text-archival-amber">//</span>RECEIPTS EXPLORER
            </h2>
            <p className="text-xs sm:text-sm font-serif italic text-museum-muted max-w-2xl">
              Inspect all 3 authenticated datasets through one synchronized lens. Search across artists, merchants, daily chai, auto rides, and travel ledgers.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="border border-white/10 bg-[#151821] px-3.5 py-2 text-right">
              <span className="text-[10px] text-museum-faint block uppercase">CURRENT VIEW</span>
              <span className="text-archival-amber font-bold text-sm">
                {receipts.length.toLocaleString()} ARTIFACTS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Sidebar Filter Controller (Desktop) */}
        <div className="hidden lg:block lg:sticky lg:top-24">
          <ReceiptFilterSidebar
            filters={filters}
            onUpdateFilter={(k, v) => {
              onUpdateFilter(k, v);
              setCurrentPage(1);
            }}
            onResetFilters={() => {
              onResetFilters();
              setCurrentPage(1);
            }}
            totalAvailableCount={totalItems}
            filteredCount={receipts.length}
          />
        </div>

        {/* Mobile Filter Drawer Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 lg:hidden">
            <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto border border-white/20 bg-[#0F1117] p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center space-x-2 font-mono text-sm font-bold text-white uppercase">
                  <Filter className="h-4 w-4 text-archival-amber" />
                  <span>FILTER CONTROLLER</span>
                </div>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="border border-white/10 p-1 text-museum-muted hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ReceiptFilterSidebar
                filters={filters}
                onUpdateFilter={(k, v) => {
                  onUpdateFilter(k, v);
                  setCurrentPage(1);
                }}
                onResetFilters={() => {
                  onResetFilters();
                  setCurrentPage(1);
                }}
                totalAvailableCount={totalItems}
                filteredCount={receipts.length}
              />

              <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="bg-archival-amber px-5 py-2 font-mono text-xs font-bold text-black uppercase tracking-wider hover:bg-[#E5B584]"
                >
                  Apply & Close ({receipts.length})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Artifact Canvas & Grid */}
        <div className="flex-1 w-full space-y-4">
          {/* Top Sort Bar & Active Filters Ribbon */}
          <ReceiptSortBar
            totalCount={totalItems}
            filteredCount={receipts.length}
            filters={filters}
            onUpdateFilter={(k, v) => {
              onUpdateFilter(k, v);
              setCurrentPage(1);
            }}
            onResetFilters={() => {
              onResetFilters();
              setCurrentPage(1);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onToggleMobileFilter={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            isMobileFilterOpen={isMobileFilterOpen}
          />

          {/* Empty Query State */}
          {paginatedReceipts.length === 0 ? (
            <div className="relative border border-white/[0.08] bg-[#0F1117] p-10 sm:p-14 text-center space-y-3 font-mono">
              <span className="absolute top-2 left-2 text-[8px] text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[8px] text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[8px] text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[8px] text-white/20 select-none">+</span>

              <span className="text-4xl text-museum-faint block">∅</span>
              <h3 className="text-base font-bold text-white tracking-wide uppercase">NO ARTIFACTS MATCH THIS QUERY</h3>
              <p className="text-xs font-serif italic text-museum-muted max-w-md mx-auto leading-relaxed">
                No life receipts match the current combination of sources, categories, date ranges, or search terms.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onResetFilters();
                    setCurrentPage(1);
                  }}
                  className="btn-museum-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  <span>Clear All Active Filters</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* View Mode 1: Vitrine Cards Grid */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {paginatedReceipts.map(receipt => (
                    <MuseumReceiptCard
                      key={receipt.id}
                      receipt={receipt}
                      onSelect={onSelectReceipt}
                    />
                  ))}
                </div>
              )}

              {/* View Mode 2: Thermal Physical Paper Receipts */}
              {viewMode === 'thermal' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {paginatedReceipts.map(receipt => (
                    <ThermalReceiptMiniCard
                      key={receipt.id}
                      receipt={receipt}
                      onSelect={onSelectReceipt}
                    />
                  ))}
                </div>
              )}

              {/* View Mode 3: High-Density Table */}
              {viewMode === 'table' && (
                <ArchivalReceiptTable
                  receipts={paginatedReceipts}
                  onSelectReceipt={onSelectReceipt}
                />
              )}
            </>
          )}

          {/* Archival Pagination Controls */}
          {totalPages > 1 && (
            <div className="border border-white/[0.08] bg-[#0F1117] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-museum-muted">
              <div className="flex items-center space-x-3">
                <span>
                  PAGE <strong className="text-white">{validPage}</strong> OF{' '}
                  <strong className="text-white">{totalPages}</strong>
                </span>
                <span className="text-museum-faint">•</span>
                <span>
                  SHOWING {(validPage - 1) * itemsPerPage + 1}–
                  {Math.min(validPage * itemsPerPage, receipts.length)} OF{' '}
                  {receipts.length.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Per Page Selector */}
                <div className="flex items-center space-x-1.5 text-[11px]">
                  <span className="text-museum-faint">PER PAGE:</span>
                  <select
                    value={itemsPerPage}
                    onChange={e => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-white/10 bg-[#151821] px-2 py-1 text-white focus:outline-none cursor-pointer"
                  >
                    <option value={24} className="bg-[#0F1117]">24</option>
                    <option value={48} className="bg-[#0F1117]">48</option>
                    <option value={96} className="bg-[#0F1117]">96</option>
                  </select>
                </div>

                {/* Page Buttons */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={validPage === 1}
                    className="border border-white/10 bg-[#151821] px-2.5 py-1 text-[11px] text-museum-text hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="First Page"
                  >
                    «
                  </button>
                  <button
                    onClick={() => handlePageChange(validPage - 1)}
                    disabled={validPage === 1}
                    className="border border-white/10 bg-[#151821] px-3 py-1 text-[11px] text-museum-text hover:bg-white/5 disabled:opacity-30 transition-colors"
                  >
                    PREV
                  </button>
                  <button
                    onClick={() => handlePageChange(validPage + 1)}
                    disabled={validPage === totalPages}
                    className="border border-white/10 bg-[#151821] px-3 py-1 text-[11px] text-museum-text hover:bg-white/5 disabled:opacity-30 transition-colors"
                  >
                    NEXT
                  </button>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={validPage === totalPages}
                    className="border border-white/10 bg-[#151821] px-2.5 py-1 text-[11px] text-museum-text hover:bg-white/5 disabled:opacity-30 transition-colors"
                    title="Last Page"
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
