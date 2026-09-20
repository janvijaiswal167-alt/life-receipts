import React, { useState } from 'react';
import { StoryReceiptChapter } from '../engine/storyGenerator';
import { ArchivalReceipt } from '../components/museum/ArchivalReceipt';
import { CuratorNote } from '../components/museum/CuratorNote';
import { Printer, Bookmark, Check } from 'lucide-react';

interface StoryCapsulePageProps {
  chapters: StoryReceiptChapter[];
}

export const StoryCapsulePage: React.FC<StoryCapsulePageProps> = ({ chapters }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const activeChapter = chapters[activeChapterIndex] || chapters[0];

  const handlePrint = () => {
    window.print();
  };

  if (!activeChapter) return null;

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
              EXHIBIT 06 // PHYSICAL RECEIPTS AS DIGITAL ARTIFACTS
            </span>
            <h2 className="mt-2 text-3xl font-serif text-[#FAF8F5]">
              The Story In Receipts
            </h2>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-2 border border-archival-amber/60 bg-archival-amber/15 px-4 py-2 text-xs font-mono font-bold text-archival-amber hover:bg-archival-amber/25 transition-all cursor-pointer shadow-glow-amber-subtle"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>PRINT RECEIPT ARTIFACT</span>
          </button>
        </div>
      </div>

      {/* Chapter Exhibit Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {chapters.map((chap, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={chap.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`flex items-center space-x-2 border px-4 py-2 text-xs font-mono transition-all ${
                isActive
                  ? 'border-archival-amber/60 bg-[#151821] text-archival-amber font-semibold shadow-glow-amber-subtle'
                  : 'border-white/[0.08] bg-[#0F1117] text-museum-muted hover:border-white/20 hover:text-white'
              }`}
            >
              <span className="text-[10px] opacity-60">EXHIBIT 0{idx + 1}.</span>
              <span>{chap.title}</span>
              {isActive && <Check className="h-3 w-3 text-archival-amber" />}
            </button>
          );
        })}
      </div>

      {/* Main Dual Pane: Narrative Monograph on Left, Physical Off-White Receipt on Right */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 items-start">
        {/* Left Side: Editorial Context & Synthesis */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 space-y-6">
          <div className="border-b border-white/[0.06] pb-4">
            <span className="text-[10px] font-mono text-archival-amber uppercase tracking-widest">
              {activeChapter.era} • {activeChapter.badge}
            </span>
            <h3 className="mt-1 text-2xl font-serif text-white tracking-tight">
              {activeChapter.title}
            </h3>
            <p className="text-xs font-serif italic text-museum-muted mt-1">
              {activeChapter.subtitle}
            </p>
          </div>

          <div className="text-xs font-serif leading-relaxed text-[#D6D2C4] space-y-4">
            <p className="text-sm leading-relaxed">{activeChapter.narrative}</p>
            <p className="text-[11px] text-museum-muted italic">
              {activeChapter.footnote}
            </p>
          </div>

          <CuratorNote headline="Curatorial Synthesis">
            "Transforming transactional telemetry into a physical receipt format honors the micro-moments of life. Every item on this receipt represents a tangible human decision—a morning drink, a train seat booked, a song looped during a difficult week."
          </CuratorNote>
        </div>

        {/* Right Side: Physical Off-White Thermal Receipt Artifact */}
        <div className="flex justify-center p-2 sm:p-4">
          <ArchivalReceipt chapter={activeChapter} />
        </div>
      </div>
    </div>
  );
};
