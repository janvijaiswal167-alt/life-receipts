import React from 'react';
import { LifeChapter } from '../../types/chapters';
import {
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  Receipt,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

interface ChapterCardProps {
  chapter: LifeChapter;
  isSelected?: boolean;
  onSelect: (chapter: LifeChapter) => void;
  onOpenDetails?: (chapter: LifeChapter) => void;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  isSelected = false,
  onSelect,
  onOpenDetails,
}) => {
  return (
    <div
      onClick={() => onSelect(chapter)}
      className={`group relative flex flex-col justify-between border rounded-lg p-5 cursor-pointer transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-archival-amber bg-[#141722] shadow-glow-amber-subtle translate-y-[-2px]'
          : 'border-white/[0.08] bg-[#0F1117] hover:border-white/20 hover:bg-[#12151E]'
      }`}
    >
      {/* Top Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
          isSelected ? 'bg-archival-amber' : 'bg-transparent group-hover:bg-white/20'
        }`}
      />

      <div className="space-y-3">
        {/* Header Metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            <BookOpen className="h-3 w-3 text-archival-amber" />
            <span className="text-white/80 font-bold uppercase tracking-wider">
              CHAPTER 0{chapter.number}
            </span>
          </div>
          <span className="text-archival-amber font-mono font-medium">
            {chapter.dateRange.formatted}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div>
          <h3 className="text-base font-serif font-bold text-white group-hover:text-archival-amber transition-colors line-clamp-2 leading-snug">
            {chapter.title}
          </h3>
          <p className="text-xs font-serif italic text-museum-muted mt-1.5 line-clamp-2 leading-relaxed">
            {chapter.subtitle}
          </p>
        </div>

        {/* Dominant Categories Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {chapter.dominantCategories.slice(0, 3).map((cat, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[9px] font-mono bg-white/[0.04] border border-white/[0.06] text-white/70 rounded truncate max-w-[140px]"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Key Metrics Highlight Preview */}
        {chapter.supportingMetrics[0] && (
          <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded font-mono">
            <span className="text-[9px] text-museum-muted uppercase tracking-widest block mb-0.5">
              {chapter.supportingMetrics[0].label}
            </span>
            <span className="text-xs font-bold text-archival-amber tracking-tight line-clamp-1">
              {chapter.supportingMetrics[0].value}
            </span>
          </div>
        )}
      </div>

      {/* Footer Info & Details Action */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-museum-muted">
        <div className="flex items-center space-x-1.5">
          <Receipt className="h-3 w-3 text-museum-muted" />
          <span>{chapter.evidenceReceipts.length} Exhibits</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenDetails) {
              onOpenDetails(chapter);
            } else {
              onSelect(chapter);
            }
          }}
          className="flex items-center space-x-1 text-[11px] font-mono text-archival-amber hover:text-white transition-colors group-hover:translate-x-0.5 transform duration-200 font-semibold"
        >
          <span>Open Chapter</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
