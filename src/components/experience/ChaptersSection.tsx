import React, { useState } from 'react';
import { StoryReceiptChapter } from '../../engine/storyGenerator';
import { BookOpen, Check, ArrowRight } from 'lucide-react';

interface ChaptersSectionProps {
  chapters: StoryReceiptChapter[];
  onSelectStoryView?: (chapter: StoryReceiptChapter) => void;
}

export const ChaptersSection: React.FC<ChaptersSectionProps> = ({
  chapters,
  onSelectStoryView,
}) => {
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const activeChapter = chapters[selectedChapterIndex] || chapters[0];

  if (!activeChapter) return null;

  return (
    <section id="chapters" className="space-y-6 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 06 // SERIALIZED LIFE CHAPTERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-archival-amber" />
            <span>6. CHAPTERS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted">
          5 serialized life chapters converting raw telemetry into authentic historical narratives.
        </p>
      </div>

      {/* Chapters Grid Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {chapters.map((chap, idx) => {
          const isActive = idx === selectedChapterIndex;
          return (
            <button
              key={chap.id}
              onClick={() => setSelectedChapterIndex(idx)}
              className={`border p-4 text-left font-mono transition-all ${
                isActive
                  ? 'border-archival-amber bg-[#151821] text-archival-amber shadow-glow-amber-subtle'
                  : 'border-white/[0.08] bg-[#0F1117] text-museum-muted hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex justify-between items-center text-[9px] text-museum-faint mb-1">
                <span>CHAPTER 0{idx + 1}</span>
                {isActive && <Check className="h-3 w-3 text-archival-amber" />}
              </div>
              <h4 className="text-xs font-bold text-white truncate">{chap.title}</h4>
              <p className="text-[10px] text-museum-muted mt-1 truncate">{chap.era}</p>
            </button>
          );
        })}
      </div>

      {/* Active Chapter Presentation */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/[0.06] pb-6">
          <span className="text-[9px] font-mono text-archival-amber uppercase tracking-widest">
            {activeChapter.era} • {activeChapter.badge}
          </span>
          <h3 className="text-2xl font-serif text-white mt-1">
            {activeChapter.title}
          </h3>
          <p className="text-xs font-serif italic text-museum-muted mt-1">
            {activeChapter.subtitle}
          </p>

          <p className="mt-4 text-sm font-serif leading-relaxed text-[#D6D2C4]">
            {activeChapter.narrative}
          </p>
        </div>

        {/* Chapter Itemized Breakdown */}
        <div className="space-y-3 font-mono text-xs">
          <span className="text-[9px] text-museum-muted uppercase tracking-widest block">
            KEY CHAPTER EVIDENCE & TRANSCRIPTS
          </span>

          <div className="border border-white/10 bg-[#151821] p-4 divide-y divide-white/[0.06]">
            {activeChapter.receiptItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-white font-semibold">{item.name}</p>
                  {item.detail && <p className="text-[10px] text-museum-muted">{item.detail}</p>}
                </div>
                <div className="text-right">
                  {item.qty && <span className="text-[10px] text-museum-muted mr-2">{item.qty}</span>}
                  <span className="text-archival-amber font-bold">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => onSelectStoryView?.(activeChapter)}
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-archival-amber hover:underline cursor-pointer"
            >
              <span>Examine Printable Thermal Receipt Artifact</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
