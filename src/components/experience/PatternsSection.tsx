import React, { useState, useMemo } from 'react';
import { LifePattern, PatternType } from '../../types/patterns';
import { LifeReceipt } from '../../types/receipt';
import { PatternCard } from './PatternCard';
import { PatternEvidenceModal } from './PatternEvidenceModal';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  Repeat,
  TrendingUp,
  Disc,
  Coffee,
  MapPin,
  PieChart,
  Clock,
  ArrowRightLeft,
  Flame,
  Layers,
  ShieldCheck,
  BarChart3,
  Receipt,
  Maximize2,
  Filter,
} from 'lucide-react';

interface PatternsSectionProps {
  patterns: LifePattern[];
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateToTimeline?: () => void;
}

type FilterCategory = 'all' | PatternType;

export const PatternsSection: React.FC<PatternsSectionProps> = ({
  patterns,
  onSelectReceipt,
  onNavigateToTimeline,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [activePatternId, setActivePatternId] = useState<string>(patterns[0]?.id || '');
  const [evidenceModalPattern, setEvidenceModalPattern] = useState<LifePattern | null>(null);

  // Filtered patterns based on tab selection
  const filteredPatterns = useMemo(() => {
    if (selectedFilter === 'all') return patterns;
    return patterns.filter(p => p.patternType === selectedFilter);
  }, [patterns, selectedFilter]);

  // Currently active selected pattern for the inline vitrine
  const activePattern = useMemo(() => {
    return patterns.find(p => p.id === activePatternId) || filteredPatterns[0] || patterns[0];
  }, [patterns, activePatternId, filteredPatterns]);

  if (!patterns || patterns.length === 0) return null;

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Patterns', count: patterns.length },
    { id: 'peak_activity', label: 'Peak Activity', count: patterns.filter(p => p.patternType === 'peak_activity').length },
    { id: 'repeated_entity', label: 'Entities & Artists', count: patterns.filter(p => p.patternType === 'repeated_entity').length },
    { id: 'repeated_category', label: 'Daily Categories', count: patterns.filter(p => p.patternType === 'repeated_category').length },
    { id: 'recurring_location', label: 'Locations', count: patterns.filter(p => p.patternType === 'recurring_location').length },
    { id: 'spending_concentration', label: 'Concentration', count: patterns.filter(p => p.patternType === 'spending_concentration').length },
    { id: 'time_of_day', label: 'Time-of-Day', count: patterns.filter(p => p.patternType === 'time_of_day').length },
    { id: 'period_change', label: 'Period Shifts', count: patterns.filter(p => p.patternType === 'period_change').length },
    { id: 'dense_activity', label: 'Dense Bursts', count: patterns.filter(p => p.patternType === 'dense_activity').length },
    { id: 'repeated_sequence', label: 'Sequences', count: patterns.filter(p => p.patternType === 'repeated_sequence').length },
  ];

  return (
    <section id="patterns" className="space-y-8 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase bg-archival-amber/10 border border-archival-amber/20 px-2.5 py-0.5 rounded">
              SECTION 04 // EMPIRICAL BEHAVIORAL ARCHETYPES
            </span>
            <span className="text-[10px] font-mono text-museum-muted">
              {patterns.length} DETECTED PATTERNS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-2 flex items-center space-x-3">
            <Repeat className="h-6 w-6 text-archival-amber" />
            <span>4. PATTERNS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted max-w-lg leading-relaxed">
          Statistically proven habits, recurring loops, and cross-era inflections discovered deterministically across 11 years of living records.
        </p>
      </div>

      {/* Pattern Type Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-3.5 w-3.5 text-museum-muted shrink-0 mr-1" />
        {filterTabs.map(tab => {
          if (tab.id !== 'all' && tab.count === 0) return null;
          const isActive = selectedFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-archival-amber text-black font-bold shadow-glow-amber-subtle'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-white/70'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Pattern Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatterns.map(p => (
          <PatternCard
            key={p.id}
            pattern={p}
            isSelected={p.id === activePattern?.id}
            onSelect={(pattern) => setActivePatternId(pattern.id)}
            onViewEvidence={(pattern) => setEvidenceModalPattern(pattern)}
          />
        ))}
      </div>

      {/* Active Pattern Evidence Vitrine (Inline Detailed Drill-down) */}
      {activePattern && (
        <div className="border border-archival-amber/30 bg-[#0E1118] rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Ambient Watermark */}
          <div className="absolute top-3 right-4 font-mono text-[80px] font-black text-white/[0.015] select-none pointer-events-none uppercase">
            {activePattern.patternType.replace(/_/g, ' ')}
          </div>

          {/* Top Header of Vitrine */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/[0.08] pb-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className="px-2.5 py-1 rounded bg-archival-amber/15 text-archival-amber border border-archival-amber/30 uppercase font-semibold">
                  EVIDENCE VITRINE // {activePattern.patternType.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                  {activePattern.era || activePattern.timeSpan}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>{activePattern.confidence}</span>
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {activePattern.title}
              </h3>

              <p className="text-xs font-serif italic text-museum-muted leading-relaxed max-w-2xl">
                {activePattern.summary}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <button
                onClick={() => setEvidenceModalPattern(activePattern)}
                className="px-4 py-2.5 bg-archival-amber/15 hover:bg-archival-amber text-archival-amber hover:text-black border border-archival-amber/40 text-xs font-mono rounded transition-all flex items-center justify-center space-x-2 font-semibold shadow-sm"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Open Full Evidence Dossier</span>
              </button>
            </div>
          </div>

          {/* Empirical Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase">OCCURRENCES</span>
              <p className="text-base font-bold text-white mt-0.5">
                {activePattern.stats.count.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase">PEAK TIME / CADENCE</span>
              <p className="text-base font-bold text-archival-amber mt-0.5 truncate">
                {activePattern.stats.peakTime || activePattern.stats.frequency || 'Continuous'}
              </p>
            </div>
            <div className="p-3 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase">DOMINANT CATEGORY</span>
              <p className="text-base font-bold text-white mt-0.5 truncate">
                {activePattern.stats.dominantCategory || activePattern.category}
              </p>
            </div>
            <div className="p-3 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase">MEASURED VALUE</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5 truncate">
                {activePattern.stats.totalValue || activePattern.metricValue}
              </p>
            </div>
          </div>

          {/* Forensic Evidence Statement */}
          <div className="p-4 bg-black/40 border-l-3 border-archival-amber rounded-r text-xs font-serif italic text-[#E5E2D9] leading-relaxed space-y-1">
            <span className="font-mono text-[9px] text-archival-amber uppercase not-italic tracking-wider font-semibold block">
              FORENSIC EVIDENCE
            </span>
            <p>{activePattern.evidence}</p>
          </div>

          {/* Statistical Breakdown Chart (if present) */}
          {activePattern.breakdown && activePattern.breakdown.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-museum-muted">
                <BarChart3 className="h-4 w-4 text-archival-amber" />
                <span>DISTRIBUTION BREAKDOWN</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePattern.breakdown.map((item, i) => (
                  <div key={i} className="p-3 bg-[#131620] border border-white/10 rounded font-mono">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/80 font-medium">{item.label}</span>
                      <span className="text-archival-amber font-semibold">{item.formattedValue || item.value}</span>
                    </div>
                    {item.sublabel && (
                      <span className="text-[10px] text-museum-muted block mt-1">
                        {item.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Supporting Receipts Exhibits */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-archival-amber" />
                <span className="text-[10px] font-mono text-white uppercase tracking-widest font-semibold">
                  SUPPORTING RECEIPTS & EVIDENCE SAMPLES ({activePattern.supportingReceipts.length} EXHIBITS)
                </span>
              </div>
              <span className="text-[10px] font-mono text-museum-muted">
                Click any receipt to view full digital record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePattern.supportingReceipts.map(r => (
                <MuseumReceiptCard
                  key={r.id}
                  receipt={r}
                  onSelect={onSelectReceipt}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pattern Evidence Full Dossier Modal */}
      <PatternEvidenceModal
        pattern={evidenceModalPattern}
        onClose={() => setEvidenceModalPattern(null)}
        onSelectReceipt={onSelectReceipt}
      />
    </section>
  );
};
