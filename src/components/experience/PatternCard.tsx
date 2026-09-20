import React from 'react';
import { LifePattern, PatternType } from '../../types/patterns';
import {
  TrendingUp,
  Disc,
  Coffee,
  MapPin,
  PieChart,
  Clock,
  ArrowRightLeft,
  Flame,
  Layers,
  ChevronRight,
  ShieldCheck,
  Receipt,
} from 'lucide-react';

interface PatternCardProps {
  pattern: LifePattern;
  isSelected?: boolean;
  onSelect: (pattern: LifePattern) => void;
  onViewEvidence?: (pattern: LifePattern) => void;
}

const getPatternIcon = (type: PatternType) => {
  switch (type) {
    case 'peak_activity':
      return <TrendingUp className="h-4 w-4 text-amber-400" />;
    case 'repeated_entity':
      return <Disc className="h-4 w-4 text-emerald-400" />;
    case 'repeated_category':
      return <Coffee className="h-4 w-4 text-amber-300" />;
    case 'recurring_location':
      return <MapPin className="h-4 w-4 text-blue-400" />;
    case 'spending_concentration':
      return <PieChart className="h-4 w-4 text-purple-400" />;
    case 'time_of_day':
      return <Clock className="h-4 w-4 text-yellow-400" />;
    case 'period_change':
      return <ArrowRightLeft className="h-4 w-4 text-cyan-400" />;
    case 'dense_activity':
      return <Flame className="h-4 w-4 text-rose-400" />;
    case 'repeated_sequence':
      return <Layers className="h-4 w-4 text-indigo-400" />;
    default:
      return <TrendingUp className="h-4 w-4 text-archival-amber" />;
  }
};

const getPatternTypeLabel = (type: PatternType) => {
  switch (type) {
    case 'peak_activity':
      return 'Peak Activity Period';
    case 'repeated_entity':
      return 'Repeated Entity';
    case 'repeated_category':
      return 'Repeated Category';
    case 'recurring_location':
      return 'Recurring Location';
    case 'spending_concentration':
      return 'Spending Concentration';
    case 'time_of_day':
      return 'Time-of-Day Behavior';
    case 'period_change':
      return 'Period Shift';
    case 'dense_activity':
      return 'Dense Burst Activity';
    case 'repeated_sequence':
      return 'Repeated Sequence';
    default:
      return 'Behavioral Pattern';
  }
};

export const PatternCard: React.FC<PatternCardProps> = ({
  pattern,
  isSelected = false,
  onSelect,
  onViewEvidence,
}) => {
  return (
    <div
      onClick={() => onSelect(pattern)}
      className={`group relative flex flex-col justify-between border transition-all duration-300 cursor-pointer overflow-hidden p-5 ${
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

      {/* Header Metadata */}
      <div>
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2.5">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            {getPatternIcon(pattern.patternType)}
            <span className="text-white/80 uppercase tracking-wider font-semibold">
              {getPatternTypeLabel(pattern.patternType)}
            </span>
          </div>
          <span className="text-archival-amber font-mono font-medium text-[10px]">
            {pattern.era || pattern.timeSpan || 'Historical'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-white group-hover:text-archival-amber transition-colors line-clamp-2 leading-snug">
          {pattern.title}
        </h3>

        {/* Summary */}
        <p className="text-xs font-serif italic text-museum-muted mt-2 line-clamp-2 leading-relaxed">
          {pattern.summary}
        </p>

        {/* Primary Metric Badge */}
        <div className="mt-3.5 p-2.5 bg-black/40 border border-white/[0.06] rounded font-mono">
          <span className="text-[9px] text-museum-muted uppercase tracking-widest block mb-0.5">
            MEASURED VALUE / METRIC
          </span>
          <span className="text-xs font-bold text-archival-amber tracking-tight line-clamp-1">
            {pattern.metricValue}
          </span>
        </div>
      </div>

      {/* Footer Info & Evidence CTA */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[10px] font-mono text-museum-muted">
          <span className="flex items-center space-x-1 text-emerald-400/90 font-semibold">
            <ShieldCheck className="h-3 w-3" />
            <span>{pattern.confidence}</span>
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Receipt className="h-3 w-3 text-museum-muted" />
            <span>{pattern.supportingReceipts.length} Exhibits</span>
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onViewEvidence) {
              onViewEvidence(pattern);
            } else {
              onSelect(pattern);
            }
          }}
          className="flex items-center space-x-1 text-[11px] font-mono text-archival-amber hover:text-white transition-colors group-hover:translate-x-0.5 transform duration-200"
        >
          <span>Examine Evidence</span>
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
