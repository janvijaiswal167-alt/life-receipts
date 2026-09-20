import React from 'react';
import { QueryFilters } from '../../utils/indexStore';
import { ReceiptSource, CanonicalCategory, ReceiptType } from '../../types/receipt';
import {
  RotateCcw,
  ShieldAlert,
  Search,
  Filter,
  IndianRupee,
  Layers,
} from 'lucide-react';

interface ReceiptFilterSidebarProps {
  filters: QueryFilters;
  onUpdateFilter: <K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => void;
  onResetFilters: () => void;
  totalAvailableCount: number;
  filteredCount: number;
}

const SOURCES: Array<{ id: ReceiptSource; label: string; sub: string }> = [
  { id: 'spotify', label: 'Spotify Audio', sub: '2013-2024' },
  { id: 'household', label: 'Household Ledger', sub: '2015-2018' },
  { id: 'commerce', label: 'Card Commerce', sub: '2022-2024' },
];

const CATEGORIES: CanonicalCategory[] = [
  'Music & Audio',
  'Food & Dining',
  'Transportation & Commute',
  'Subscriptions & Digital',
  'Shopping & Retail',
  'Health & Wellness',
  'Entertainment & Leisure',
  'Investments & Savings',
  'Income & Salary',
  'Family & Remittances',
];

const EVENT_TYPES: Array<{ id: ReceiptType; label: string }> = [
  { id: 'audio_stream', label: 'Audio Stream' },
  { id: 'household_expense', label: 'Household Expense' },
  { id: 'household_income', label: 'Income & Salary' },
  { id: 'household_transfer', label: 'Investment Transfer' },
  { id: 'commercial_transaction', label: 'Commercial Payment' },
];

const DATE_PRESETS = [
  { label: 'All Time (2013–2024)', start: '', end: '' },
  { label: 'Origins: Audio & Pune (2013–2014)', start: '2013-01-01', end: '2014-12-31' },
  { label: 'The Daily Grind (2015–2018)', start: '2015-01-01', end: '2018-12-31' },
  { label: 'Transition Era (2019–2021)', start: '2019-01-01', end: '2021-12-31' },
  { label: 'Digital Commerce (2022–2024)', start: '2022-01-01', end: '2024-12-31' },
];

const SEARCH_SUGGESTIONS = [
  'The Beatles',
  'Cutting Chai',
  'Sevagram Express',
  'Audible',
  'Netflix',
  'Milk',
  'Pune',
  'Nagpur',
  'Zomato',
  'Uber',
  'Mutual fund',
  'Salary',
];

export const ReceiptFilterSidebar: React.FC<ReceiptFilterSidebarProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  totalAvailableCount,
  filteredCount,
}) => {
  const toggleSource = (src: ReceiptSource) => {
    const current = filters.sources || [];
    const next = current.includes(src)
      ? current.filter(s => s !== src)
      : [...current, src];
    onUpdateFilter('sources', next);
  };

  const toggleCategory = (cat: CanonicalCategory) => {
    const current = filters.categories || [];
    const next = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onUpdateFilter('categories', next);
  };

  const toggleType = (t: ReceiptType) => {
    const current = filters.types || [];
    const next = current.includes(t)
      ? current.filter(item => item !== t)
      : [...current, t];
    onUpdateFilter('types', next);
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-5 font-mono text-xs text-museum-muted">
      {/* Header with Results Count & Reset */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-archival-amber" />
          <span className="font-bold text-white uppercase tracking-wider">FILTERS</span>
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center space-x-1 text-[11px] text-museum-muted hover:text-archival-amber transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Forensic Search Filter */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-2.5">
        <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
          SEARCH ARTIFACTS
        </span>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-museum-muted" />
          <input
            type="text"
            placeholder="Search tracks, merchants, chai..."
            value={filters.searchQuery || ''}
            onChange={e => onUpdateFilter('searchQuery', e.target.value)}
            className="w-full border border-white/10 bg-[#151821] py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-museum-faint focus:border-archival-amber focus:outline-none"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilter('searchQuery', '')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-museum-muted hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Search Prompts */}
        <div className="pt-1.5 space-y-1.5">
          <span className="text-[9px] uppercase text-museum-faint block">
            SUGGESTIONS:
          </span>
          <div className="flex flex-wrap gap-1">
            {SEARCH_SUGGESTIONS.map(sug => (
              <button
                key={sug}
                onClick={() => onUpdateFilter('searchQuery', sug)}
                className={`border px-1.5 py-0.5 text-[9px] transition-all ${
                  filters.searchQuery === sug
                    ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold'
                    : 'border-white/[0.08] bg-[#151821] text-museum-muted hover:border-white/20 hover:text-white'
                }`}
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Source Dataset Multi-Select */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
            DATASET PROVENANCE
          </span>
          <span className="text-[9px] text-museum-faint">3 SOURCES</span>
        </div>
        <div className="space-y-1.5">
          {SOURCES.map(src => {
            const isChecked = (filters.sources || []).includes(src.id);
            return (
              <label
                key={src.id}
                onClick={() => toggleSource(src.id)}
                className={`flex items-center justify-between p-2 border cursor-pointer transition-all ${
                  isChecked
                    ? 'border-archival-amber/50 bg-archival-amber/10 text-white'
                    : 'border-white/[0.06] bg-[#151821] text-museum-muted hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="accent-amber-500 rounded-none h-3.5 w-3.5"
                  />
                  <span className="text-[11px] font-semibold">{src.label}</span>
                </div>
                <span className="text-[9px] text-museum-faint">{src.sub}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Date Range Presets & Custom Pickers */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-3">
        <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
          TEMPORAL RANGE
        </span>

        <div className="space-y-1">
          {DATE_PRESETS.map((preset, idx) => {
            const isSelected =
              filters.startDate === preset.start && filters.endDate === preset.end;
            return (
              <button
                key={idx}
                onClick={() => {
                  onUpdateFilter('startDate', preset.start);
                  onUpdateFilter('endDate', preset.end);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-[10px] border transition-all ${
                  isSelected
                    ? 'border-archival-amber bg-archival-amber/15 text-archival-amber font-bold'
                    : 'border-white/[0.06] bg-[#151821] text-museum-muted hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Start / End Inputs */}
        <div className="pt-2 border-t border-white/[0.06] space-y-2">
          <span className="text-[9px] uppercase tracking-wider text-museum-faint block">
            CUSTOM RANGE (YYYY-MM-DD)
          </span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="From: 2015-01-01"
              value={filters.startDate || ''}
              onChange={e => onUpdateFilter('startDate', e.target.value)}
              className="w-full border border-white/10 bg-[#151821] p-1.5 text-[10px] text-white placeholder:text-museum-faint focus:border-archival-amber focus:outline-none"
            />
            <input
              type="text"
              placeholder="To: 2024-12-31"
              value={filters.endDate || ''}
              onChange={e => onUpdateFilter('endDate', e.target.value)}
              className="w-full border border-white/10 bg-[#151821] p-1.5 text-[10px] text-white placeholder:text-museum-faint focus:border-archival-amber focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Amount Range Filter */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-2.5">
        <div className="flex items-center space-x-1.5">
          <IndianRupee className="h-3.5 w-3.5 text-archival-amber" />
          <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
            AMOUNT RANGE (₹)
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={filters.minAmount ?? ''}
            onChange={e =>
              onUpdateFilter('minAmount', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-white/10 bg-[#151821] p-1.5 text-[10px] text-white placeholder:text-museum-faint focus:border-archival-amber focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max ₹"
            value={filters.maxAmount ?? ''}
            onChange={e =>
              onUpdateFilter('maxAmount', e.target.value ? Number(e.target.value) : undefined)
            }
            className="w-full border border-white/10 bg-[#151821] p-1.5 text-[10px] text-white placeholder:text-museum-faint focus:border-archival-amber focus:outline-none"
          />
        </div>
      </div>

      {/* Security Fraud Filter */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4">
        <label
          onClick={() => onUpdateFilter('isFraudOnly', !filters.isFraudOnly)}
          className={`flex items-center justify-between p-2.5 border cursor-pointer transition-all ${
            filters.isFraudOnly
              ? 'border-red-600 bg-red-950/40 text-red-300 font-bold'
              : 'border-white/[0.06] bg-[#151821] text-museum-muted hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span className="text-xs">Security Flags Only</span>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.isFraudOnly)}
            onChange={() => {}}
            className="accent-red-500 rounded-none h-3.5 w-3.5"
          />
        </label>
      </div>

      {/* Canonical Categories Filter */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-2.5">
        <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
          DOMAIN CATEGORIES
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => {
            const isChecked = (filters.categories || []).includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`border px-2 py-1 text-[10px] transition-all text-left ${
                  isChecked
                    ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold'
                    : 'border-white/[0.08] bg-[#151821] text-museum-muted hover:border-white/20 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Event Types Filter */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-4 space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-museum-faint block">
          EVENT RECORD TYPE
        </span>
        <div className="space-y-1">
          {EVENT_TYPES.map(t => {
            const isChecked = (filters.types || []).includes(t.id);
            return (
              <label
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={`flex items-center space-x-2 p-1.5 border text-[10px] cursor-pointer transition-all ${
                  isChecked
                    ? 'border-archival-amber/50 bg-archival-amber/10 text-white'
                    : 'border-white/[0.06] bg-[#151821] text-museum-muted hover:text-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}}
                  className="accent-amber-500 rounded-none h-3 w-3"
                />
                <span>{t.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
