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

const ChapterCardComponent: React.FC<ChapterCardProps> = ({
  chapter,
  onSelect,
  isSelected = false,
  onOpenDetails,
}) => {
  return (
    <div
      onClick={() => onSelect(chapter)}
      className={`group relative flex flex-col justify-between p-5 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-archival-amber/[0.08] border-archival-amber shadow-[0_0_25px_rgba(212,163,115,0.15)]'
          : 'bg-[#0F1117] border-white/[0.08] hover:border-white/20 hover:bg-[#151821]'
      }`}
    >
      {/* Top Chapter Number Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
          isSelected ? 'bg-archival-amber' : 'bg-transparent group-hover:bg-white/20'
        }`}
      />

      {/* Header Metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2.5">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            <BookOpen className="h-3 w-3 text-archival-amber" />
            <span className="text-white/80 uppercase tracking-wider font-semibold">
              CHAPTER 0{chapter.number}
            </span>
          </div>
          <span className="text-archival-amber font-mono font-medium text-[10px]">
            {chapter.dateRange.formatted}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-white group-hover:text-archival-amber transition-colors line-clamp-2 leading-snug">
          {chapter.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs font-serif italic text-museum-muted mt-1.5 line-clamp-2 leading-relaxed">
          {chapter.subtitle}
        </p>

        {/* Primary Metric Badge */}
        {chapter.supportingMetrics && chapter.supportingMetrics.length > 0 && (
          <div className="mt-3.5 p-2.5 bg-black/40 border border-white/[0.06] rounded font-mono">
            <span className="text-[9px] text-museum-muted uppercase tracking-widest block mb-0.5">
              {chapter.supportingMetrics[0].label}
            </span>
            <span className="text-xs font-bold text-archival-amber tracking-tight line-clamp-1">
              {chapter.supportingMetrics[0].value}
            </span>
          </div>
        )}

        {/* Dominant Categories Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {chapter.dominantCategories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 text-[9px] font-mono bg-white/[0.03] border border-white/[0.05] rounded text-museum-muted"
            >
              {cat}
            </span>
          ))}
        </div>
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

export const ChapterCard = React.memo(ChapterCardComponent);
