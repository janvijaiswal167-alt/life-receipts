import React, { useState } from 'react';
import { Search, Database, Fingerprint, Menu, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { ActiveTab } from '../../hooks/useLifeReceipts';

interface MuseumHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  useSampleMode: boolean;
  onToggleSampleMode: (val: boolean) => void;
  totalReceipts: number;
}

export const MuseumHeader: React.FC<MuseumHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  onSearchChange,
  useSampleMode,
  onToggleSampleMode,
  totalReceipts,
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090C]/95 backdrop-blur-md font-mono">
      {/* Top Archival Telemetry Strip */}
      <div className="border-b border-white/[0.04] bg-[#050608] px-3 sm:px-4 py-1 text-[9px] sm:text-[10px] text-museum-muted">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 truncate">
            <span className="text-archival-amber flex items-center space-x-1 flex-shrink-0">
              <Fingerprint className="h-3 w-3" />
              <span>ARCHIVE: 2013–2024</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden md:inline truncate">PROVENANCE: SPOTIFY • HOUSEHOLD • COMMERCE</span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            <span className="text-white/40 hidden xs:inline">100% CLIENT-SIDE</span>
            <span className="hidden xs:inline text-white/20">|</span>
            <span className="text-archival-amber font-semibold">PCI-MASKED</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 gap-2">
        {/* Brand Title */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center border border-archival-amber/40 bg-archival-amber/5 text-archival-amber flex-shrink-0">
            <span className="text-xs sm:text-sm font-bold">LR</span>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-xs sm:text-base font-bold tracking-wider sm:tracking-widest uppercase text-white truncate">
                LIFE<span className="text-archival-amber">//</span>RECEIPTS
              </h1>
              <span className="text-[9px] sm:text-[10px] text-museum-muted tracking-widest border border-white/10 px-1 py-0.2 hidden xs:inline-block">
                EXHIBIT
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-serif italic text-museum-muted hidden lg:block">
              A digital museum transforming life records into physical receipt artifacts
            </p>
          </div>
        </div>

        {/* Investigative Search (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-4 lg:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-museum-muted" />
            <input
              type="text"
              placeholder="Search artist, chai, auto, train, city..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full border border-white/10 bg-[#0F1117] py-1.5 pl-9 pr-8 text-xs text-museum-text placeholder:text-museum-faint focus:border-archival-amber/60 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-museum-muted hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dataset Archive Mode Switch & Mobile Search Toggle */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className={`md:hidden p-2 border transition-colors ${
              isMobileSearchOpen || searchQuery
                ? 'border-archival-amber bg-archival-amber/15 text-archival-amber'
                : 'border-white/10 bg-[#0F1117] text-museum-muted hover:text-white'
            }`}
            title="Search records"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Dataset Switch */}
          <div className="flex items-center border border-white/10 bg-[#0F1117] p-0.5 text-xs">
            <button
              onClick={() => onToggleSampleMode(true)}
              className={`px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] transition-all ${
                useSampleMode
                  ? 'bg-archival-amber/15 text-archival-amber font-semibold border border-archival-amber/30'
                  : 'text-museum-muted hover:text-museum-text border border-transparent'
              }`}
            >
              <span className="sm:hidden">Sample</span>
              <span className="hidden sm:inline">Exhibition Sample</span>
            </button>
            <button
              onClick={() => onToggleSampleMode(false)}
              className={`px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] transition-all ${
                !useSampleMode
                  ? 'bg-archival-amber/15 text-archival-amber font-semibold border border-archival-amber/30'
                  : 'text-museum-muted hover:text-museum-text border border-transparent'
              }`}
            >
              <span className="sm:hidden">Full (162k)</span>
              <span className="hidden sm:inline">Full Archive (162k)</span>
            </button>
          </div>

          {/* Record Count Badge */}
          <div className="hidden xl:flex items-center space-x-2 border border-white/10 bg-[#0F1117] px-3 py-1.5 text-xs text-museum-muted">
            <Database className="h-3.5 w-3.5 text-archival-amber" />
            <span className="text-white font-bold">{totalReceipts.toLocaleString()}</span>
            <span className="text-[10px] text-museum-faint">RECORDS</span>
          </div>
        </div>
      </div>

      {/* Expandable Mobile Search Dropdown Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0A0C10] p-3 px-4 animate-fadeIn">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-museum-muted" />
            <input
              type="text"
              autoFocus
              placeholder="Search artist, chai, auto, train, city..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full border border-archival-amber/50 bg-[#12151E] py-2 pl-9 pr-8 text-xs text-white placeholder:text-museum-faint focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-museum-muted hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
