import React from 'react';
import { QueryFilters, SortOption } from '../../utils/indexStore';
import { ArrowUpDown, LayoutGrid, ScrollText, Table, X, Filter } from 'lucide-react';

export type ViewMode = 'grid' | 'thermal' | 'table';

interface ReceiptSortBarProps {
  totalCount: number;
  filteredCount: number;
  filters: QueryFilters;
  onUpdateFilter: <K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => void;
  onResetFilters: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleMobileFilter?: () => void;
  isMobileFilterOpen?: boolean;
}

export const ReceiptSortBar: React.FC<ReceiptSortBarProps> = ({
  totalCount,
  filteredCount,
  filters,
  onUpdateFilter,
  onResetFilters,
  viewMode,
  onViewModeChange,
  onToggleMobileFilter,
  isMobileFilterOpen,
}) => {
  const sortOptions: Array<{ id: SortOption; label: string }> = [
    { id: 'date_desc', label: 'Date: Newest First' },
    { id: 'date_asc', label: 'Date: Oldest First' },
    { id: 'relevance', label: 'Relevance (Best Match)' },
    { id: 'amount_desc', label: 'Amount: Highest First' },
    { id: 'amount_asc', label: 'Amount: Lowest First' },
    { id: 'duration_desc', label: 'Audio Duration: Longest' },
  ];

  // Check active filter tags for ribbon
  const hasActiveFilters =
    (filters.sources && filters.sources.length > 0) ||
    (filters.categories && filters.categories.length > 0) ||
    (filters.years && filters.years.length > 0) ||
    (filters.types && filters.types.length > 0) ||
    Boolean(filters.searchQuery) ||
    Boolean(filters.isFraudOnly) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.minAmount != null ||
    filters.maxAmount != null;

  return (
    <div className="space-y-3 font-mono text-xs">
      {/* Top Sort & Layout Strip */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Mobile Filter Toggle + Results Counter */}
        <div className="flex items-center space-x-3">
          {onToggleMobileFilter && (
            <button
              onClick={onToggleMobileFilter}
              className={`lg:hidden flex items-center space-x-1.5 border px-3 py-2 text-xs transition-colors min-h-[40px] cursor-pointer ${
                isMobileFilterOpen
                  ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold'
                  : 'border-white/10 bg-[#151821] text-museum-muted hover:text-white'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
          )}

          <div className="flex items-center space-x-2">
            <span className="text-white font-bold tracking-wide text-sm">
              {filteredCount.toLocaleString()}
            </span>
            <span className="text-museum-muted text-[11px]">
              of {totalCount.toLocaleString()} UNIFIED ARTIFACTS
            </span>
          </div>
        </div>

        {/* Right Controls: Sort Select + View Mode Toggle */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 border border-white/10 bg-[#151821] px-3 py-2 min-h-[40px]">
            <ArrowUpDown className="h-3.5 w-3.5 text-archival-amber shrink-0" />
            <select
              value={filters.sortBy || 'date_desc'}
              onChange={e => onUpdateFilter('sortBy', e.target.value as SortOption)}
              className="bg-transparent text-[11px] text-white focus:outline-none cursor-pointer"
            >
              {sortOptions.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-[#0F1117] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center border border-white/10 bg-[#151821] p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center space-x-1 px-3 py-2 min-h-[38px] transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-archival-amber/20 text-archival-amber font-bold border border-archival-amber/40'
                  : 'text-museum-muted hover:text-white border border-transparent'
              }`}
              title="Vitrine Card Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">Cards</span>
            </button>

            <button
              onClick={() => onViewModeChange('thermal')}
              className={`flex items-center space-x-1 px-3 py-2 min-h-[38px] transition-colors cursor-pointer ${
                viewMode === 'thermal'
                  ? 'bg-archival-amber/20 text-archival-amber font-bold border border-archival-amber/40'
                  : 'text-museum-muted hover:text-white border border-transparent'
              }`}
              title="Physical Thermal Receipt View"
            >
              <ScrollText className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">Receipts</span>
            </button>

            <button
              onClick={() => onViewModeChange('table')}
              className={`flex items-center space-x-1 px-3 py-2 min-h-[38px] transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-archival-amber/20 text-archival-amber font-bold border border-archival-amber/40'
                  : 'text-museum-muted hover:text-white border border-transparent'
              }`}
              title="High-Density Forensic Table"
            >
              <Table className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Tags Ribbon */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase text-museum-faint mr-1">ACTIVE:</span>

          {filters.searchQuery && (
            <span className="flex items-center space-x-1 border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 text-[10px] text-archival-amber">
              <span>Query: "{filters.searchQuery}"</span>
              <button onClick={() => onUpdateFilter('searchQuery', '')} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.sources?.map(s => (
            <span key={s} className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span className="uppercase">{s}</span>
              <button
                onClick={() =>
                  onUpdateFilter(
                    'sources',
                    filters.sources?.filter(x => x !== s)
                  )
                }
                className="hover:text-white"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}

          {filters.categories?.map(c => (
            <span key={c} className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>{c}</span>
              <button
                onClick={() =>
                  onUpdateFilter(
                    'categories',
                    filters.categories?.filter(x => x !== c)
                  )
                }
                className="hover:text-white"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}

          {filters.years?.map(y => (
            <span key={y} className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>Year: {y}</span>
              <button
                onClick={() =>
                  onUpdateFilter(
                    'years',
                    filters.years?.filter(x => x !== y)
                  )
                }
                className="hover:text-white"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}

          {filters.startDate && (
            <span className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>From: {filters.startDate}</span>
              <button onClick={() => onUpdateFilter('startDate', '')} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.endDate && (
            <span className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>To: {filters.endDate}</span>
              <button onClick={() => onUpdateFilter('endDate', '')} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.minAmount != null && (
            <span className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>Min: ₹{filters.minAmount}</span>
              <button onClick={() => onUpdateFilter('minAmount', undefined)} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.maxAmount != null && (
            <span className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2 py-0.5 text-[10px] text-museum-text">
              <span>Max: ₹{filters.maxAmount}</span>
              <button onClick={() => onUpdateFilter('maxAmount', undefined)} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.isFraudOnly && (
            <span className="flex items-center space-x-1 border border-red-800 bg-red-950/40 px-2 py-0.5 text-[10px] text-red-300">
              <span>Security Flags Only</span>
              <button onClick={() => onUpdateFilter('isFraudOnly', false)} className="hover:text-white">
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="text-[10px] text-museum-muted hover:text-archival-amber underline ml-2 cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};
