import React from 'react';
import { StoryReceiptChapter } from '../../engine/storyGenerator';
import { ArchivalReceipt } from '../museum/ArchivalReceipt';
import { CuratorNote } from '../museum/CuratorNote';
import { ScrollText, Printer, CheckCircle, Sparkles } from 'lucide-react';

interface StorySectionProps {
  decadeChapter?: StoryReceiptChapter;
  onPrintStory?: () => void;
  onOpenStoryMode?: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({
  decadeChapter,
  onPrintStory,
  onOpenStoryMode,
}) => {
  const handlePrint = () => {
    if (onPrintStory) onPrintStory();
    else window.print();
  };

  if (!decadeChapter) return null;

  return (
    <section id="story" className="space-y-8 pb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.08] pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 08 // THE MASTER RECEIPT (2013–2024)
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <ScrollText className="h-7 w-7 text-archival-amber" />
            <span>8. THE STORY IN RECEIPTS</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenStoryMode && (
            <button
              onClick={onOpenStoryMode}
              className="inline-flex items-center space-x-2 border border-archival-amber bg-archival-amber px-5 py-2.5 text-xs font-mono font-bold text-[#08090C] uppercase hover:bg-archival-amber-bright transition-all shadow-glow-amber-subtle cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>REVEAL MY STORY</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 border border-white/20 bg-[#0F1117] px-4 py-2.5 text-xs font-mono text-museum-text uppercase hover:border-white/40 hover:text-white transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>PRINT RECEIPT</span>
          </button>
        </div>
      </div>

      {/* Dual Layout: Curatorial Synthesis & Master Thermal Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Left: Curatorial Synthesis */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.06] pb-4">
            <span className="text-[10px] font-mono text-archival-amber uppercase tracking-widest">
              SYNTHESIS MONOGRAPH // ELEVEN YEARS OF LIVING
            </span>
            <h3 className="mt-1 text-2xl font-serif text-white tracking-tight">
              The Receipt of a Lifetime
            </h3>
            <p className="text-xs font-serif italic text-museum-muted mt-1">
              Final consolidation across 162,000 digital records.
            </p>
          </div>

          <div className="text-sm font-serif leading-relaxed text-[#D6D2C4] space-y-4">
            <p>
              Your life has a pattern. It began with mobile audio tracks in 2013, grew into the disciplined daily rituals of cutting chai, local train rides, and systematic mutual fund investments between 2015 and 2018, and expanded into high-velocity digital commerce across 311 Indian cities.
            </p>
            <p className="text-xs text-museum-muted italic">
              Every row on this final receipt was earned, lived, and recorded.
            </p>
          </div>

          <CuratorNote headline="The Meaning of the Receipt">
            "Receipts are usually thrown away. But when collected and harmonized across a decade, they reveal our most enduring commitments: the music that calmed our stress, the morning tea that started our days, and the financial discipline that built our future."
          </CuratorNote>
        </div>

        {/* Right: Master Thermal Paper Receipt Artifact */}
        <div className="flex justify-center p-2 sm:p-4">
          <ArchivalReceipt chapter={decadeChapter} />
        </div>
      </div>
    </section>
  );
};
