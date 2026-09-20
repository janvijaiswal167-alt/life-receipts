import React from 'react';
import { Search, Database, Fingerprint, SlidersHorizontal } from 'lucide-react';
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
  searchQuery,
  onSearchChange,
  useSampleMode,
  onToggleSampleMode,
  totalReceipts,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08090C]/95 backdrop-blur-md">
      {/* Top Archival Telemetry Strip */}
      <div className="border-b border-white/[0.04] bg-[#050608] px-4 py-1 text-[10px] font-mono text-museum-muted">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-archival-amber flex items-center space-x-1">
              <Fingerprint className="h-3 w-3" />
              <span>ARCHIVE ID: LR-2013-2024</span>
            </span>
            <span className="hidden sm:inline text-white/20">|</span>
            <span className="hidden sm:inline">PROVENANCE: SPOTIFY • HOUSEHOLD • COMMERCE TELEMETRY</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-white/40">100% CLIENT-SIDE VERIFIED</span>
            <span className="text-white/20">|</span>
            <span className="text-archival-amber font-semibold">PCI-MASKED</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Title */}
        <div className="flex items-center space-x-4">
          <div className="flex h-9 w-9 items-center justify-center border border-archival-amber/40 bg-archival-amber/5 text-archival-amber">
            <span className="font-mono text-sm font-bold">LR</span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold tracking-widest uppercase font-mono text-white">
                LIFE<span className="text-archival-amber">//</span>RECEIPTS
              </h1>
              <span className="text-[10px] font-mono text-museum-muted tracking-widest border border-white/10 px-1.5 py-0.2">
                EXHIBITION
              </span>
            </div>
            <p className="text-[11px] font-serif italic text-museum-muted hidden sm:block">
              A digital museum transforming life records into physical receipt artifacts
            </p>
          </div>
        </div>

        {/* Investigative Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-museum-muted" />
            <input
              type="text"
              placeholder="Search by artist, chai, auto, train, city, or merchant..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full border border-white/10 bg-[#0F1117] py-1.5 pl-9 pr-8 text-xs font-mono text-museum-text placeholder:text-museum-faint focus:border-archival-amber/60 focus:outline-none focus:ring-0 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-museum-muted hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dataset Archive Mode Switch */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-white/10 bg-[#0F1117] p-0.5 text-xs font-mono">
            <button
              onClick={() => onToggleSampleMode(true)}
              className={`px-3 py-1 text-[11px] transition-all ${
                useSampleMode
                  ? 'bg-archival-amber/15 text-archival-amber font-semibold border border-archival-amber/30'
                  : 'text-museum-muted hover:text-museum-text border border-transparent'
              }`}
            >
              Exhibition Sample
            </button>
            <button
              onClick={() => onToggleSampleMode(false)}
              className={`px-3 py-1 text-[11px] transition-all ${
                !useSampleMode
                  ? 'bg-archival-amber/15 text-archival-amber font-semibold border border-archival-amber/30'
                  : 'text-museum-muted hover:text-museum-text border border-transparent'
              }`}
            >
              Full Archive (162k)
            </button>
          </div>

          <div className="hidden lg:flex items-center space-x-2 border border-white/10 bg-[#0F1117] px-3 py-1.5 text-xs font-mono text-museum-muted">
            <Database className="h-3.5 w-3.5 text-archival-amber" />
            <span className="text-white font-bold">{totalReceipts.toLocaleString()}</span>
            <span className="text-[10px] text-museum-faint">RECORDS</span>
          </div>
        </div>
      </div>
    </header>
  );
};
