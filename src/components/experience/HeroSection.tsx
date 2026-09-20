import React from 'react';
import { ArrowDown, Sparkles, ScrollText, Layers, GitMerge, Fingerprint } from 'lucide-react';

interface HeroSectionProps {
  totalReceipts: number;
  datasetCount: number;
  connectionCount: number;
  patternCount: number;
  onRevealStory: () => void;
  onExploreReceipts: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalReceipts,
  datasetCount,
  connectionCount,
  patternCount,
  onRevealStory,
  onExploreReceipts,
}) => {
  return (
    <section className="relative pt-6 pb-16 sm:pt-10 sm:pb-20 border-b border-white/[0.08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-archival-amber/[0.03] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        {/* Curatorial Header Stamp */}
        <div className="inline-flex items-center space-x-2 border border-archival-amber/30 bg-archival-amber/5 px-3 py-1 text-[11px] font-mono text-archival-amber">
          <Fingerprint className="h-3.5 w-3.5" />
          <span>DIGITAL MUSEUM & LIFE LEDGER (2013–2024)</span>
        </div>

        {/* Hero Title & Hook */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono font-bold tracking-widest text-white uppercase">
            LIFE<span className="text-archival-amber">//</span>RECEIPTS
          </h1>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-serif italic text-[#FAF8F5] tracking-tight">
            "Your life has a pattern."
          </p>
        </div>

        <p className="max-w-2xl mx-auto text-xs sm:text-sm font-serif text-museum-muted leading-relaxed">
          Transforming eleven years of disconnected digital footprints—audio streams, morning cutting chai bills, train tickets, systematic investments, and card transactions—into an authenticated story of who you were and who you became.
        </p>

        {/* 4 Core Hero Telemetry Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-6 text-left">
          <div className="border border-white/[0.08] bg-[#0F1117] p-4">
            <span className="text-[9px] font-mono text-museum-muted uppercase tracking-widest">
              UNIFIED RECEIPTS
            </span>
            <p className="mt-1 text-2xl font-bold font-mono text-white">
              {totalReceipts.toLocaleString()}
            </p>
            <p className="text-[10px] font-serif italic text-museum-muted">100% normalized</p>
          </div>

          <div className="border border-white/[0.08] bg-[#0F1117] p-4">
            <span className="text-[9px] font-mono text-museum-muted uppercase tracking-widest">
              SOURCE DATASETS
            </span>
            <p className="mt-1 text-2xl font-bold font-mono text-archival-amber">
              {datasetCount} Datasets
            </p>
            <p className="text-[10px] font-serif italic text-museum-muted">Audio, Micro, Macro</p>
          </div>

          <div className="border border-white/[0.08] bg-[#0F1117] p-4">
            <span className="text-[9px] font-mono text-museum-muted uppercase tracking-widest">
              CROSS-DATASET SYNCS
            </span>
            <p className="mt-1 text-2xl font-bold font-mono text-white">
              {connectionCount.toLocaleString()}+
            </p>
            <p className="text-[10px] font-serif italic text-museum-muted">Temporal & transit pairs</p>
          </div>

          <div className="border border-white/[0.08] bg-[#0F1117] p-4">
            <span className="text-[9px] font-mono text-museum-muted uppercase tracking-widest">
              DISCOVERED PATTERNS
            </span>
            <p className="mt-1 text-2xl font-bold font-mono text-archival-amber">
              {patternCount} Archetypes
            </p>
            <p className="text-[10px] font-serif italic text-museum-muted">Habits & rituals</p>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={onRevealStory}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-archival-amber bg-archival-amber px-6 py-3 text-xs font-mono font-bold tracking-widest text-[#08090C] uppercase hover:bg-archival-amber-bright transition-all shadow-glow-amber-subtle cursor-pointer"
          >
            <ScrollText className="h-4 w-4" />
            <span>REVEAL MY STORY</span>
          </button>

          <button
            onClick={onExploreReceipts}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-white/20 bg-[#0F1117] px-6 py-3 text-xs font-mono tracking-widest text-museum-text uppercase hover:border-archival-amber/60 hover:text-white transition-all cursor-pointer"
          >
            <Layers className="h-4 w-4 text-archival-amber" />
            <span>EXPLORE RECEIPTS</span>
          </button>
        </div>
      </div>
    </section>
  );
};
