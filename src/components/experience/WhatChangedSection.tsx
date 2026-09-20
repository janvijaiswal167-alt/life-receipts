import React, { useState, useMemo } from 'react';
import { LifeReceipt } from '../../types/receipt';
import { EraComparison } from '../../engine/patternEngine';
import {
  PeriodComparison,
  PeriodChangeItem,
  ChangeDomain,
} from '../../types/comparisons';
import { generateEraComparisons, comparePeriods } from '../../engine/comparisonEngine';
import { ChangeCard } from './ChangeCard';
import { ChangeEvidenceModal } from './ChangeEvidenceModal';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Music,
  CreditCard,
  Filter,
  BarChart3,
  Calendar,
  Receipt,
  Sparkles,
} from 'lucide-react';

interface WhatChangedSectionProps {
  receipts?: LifeReceipt[];
  eras?: EraComparison[];
  onSelectReceipt?: (r: LifeReceipt) => void;
}

type DomainFilter = 'all' | ChangeDomain;

export const WhatChangedSection: React.FC<WhatChangedSectionProps> = ({
  receipts = [],
  eras = [],
  onSelectReceipt = () => {},
}) => {
  // Generate real period comparisons dynamically from receipts
  const comparisons: PeriodComparison[] = useMemo(() => {
    if (receipts && receipts.length > 0) {
      return generateEraComparisons(receipts);
    }
    return [];
  }, [receipts]);

  const [activeComparisonIndex, setActiveComparisonIndex] = useState<number>(0);
  const [selectedDomain, setSelectedDomain] = useState<DomainFilter>('all');
  const [activeEvidenceChange, setActiveEvidenceChange] = useState<PeriodChangeItem | null>(null);

  const activeComparison = comparisons[activeComparisonIndex] || comparisons[0];

  // Filtered changes by domain tab
  const filteredChanges = useMemo(() => {
    if (!activeComparison) return [];
    if (selectedDomain === 'all') return activeComparison.changes;
    return activeComparison.changes.filter(c => c.domain === selectedDomain);
  }, [activeComparison, selectedDomain]);

  if (!activeComparison) return null;

  const domainTabs: { id: DomainFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Detected Changes', count: activeComparison.changes.length },
    { id: 'music', label: 'Music Activity', count: activeComparison.changes.filter(c => c.domain === 'music').length },
    { id: 'spending', label: 'Spending & Outflow', count: activeComparison.changes.filter(c => c.domain === 'spending').length },
    { id: 'travel', label: 'Travel & Mobility', count: activeComparison.changes.filter(c => c.domain === 'travel').length },
    { id: 'entertainment', label: 'Entertainment & Subs', count: activeComparison.changes.filter(c => c.domain === 'entertainment').length },
    { id: 'technology', label: 'Hardware & Platforms', count: activeComparison.changes.filter(c => c.domain === 'technology').length },
    { id: 'security', label: 'Security Telemetry', count: activeComparison.changes.filter(c => c.domain === 'security').length },
  ];

  return (
    <section id="what-changed" className="space-y-8 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase bg-archival-amber/10 border border-archival-amber/20 px-2.5 py-0.5 rounded">
              SECTION 05 // ERA-OVER-ERA INFLECTION ANALYSIS
            </span>
            <span className="text-[10px] font-mono text-museum-muted">
              {activeComparison.changes.length} DETECTED INFLECTION VECTORS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-2 flex items-center space-x-3">
            <Compass className="h-6 w-6 text-archival-amber" />
            <span>5. WHAT CHANGED?</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted max-w-lg leading-relaxed">
          Visual comparative metrics tracking the empirical transformation of audio environments, spending velocity, and mobility networks across distinct eras.
        </p>
      </div>

      {/* Comparative Period Selector Tabs */}
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-museum-muted uppercase tracking-widest block">
          SELECT PERIOD-OVER-PERIOD COMPARATIVE PROFILE
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {comparisons.map((comp, idx) => {
            const isActive = idx === activeComparisonIndex;
            return (
              <button
                key={comp.id}
                onClick={() => {
                  setActiveComparisonIndex(idx);
                  setSelectedDomain('all');
                }}
                className={`border p-4 text-left font-mono rounded-lg transition-all ${
                  isActive
                    ? 'border-archival-amber bg-[#151821] text-archival-amber shadow-glow-amber-subtle'
                    : 'border-white/[0.08] bg-[#0F1117] text-museum-muted hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex justify-between items-center text-[9px] text-museum-faint mb-1.5">
                  <span className="uppercase tracking-wider">COMPARISON 0{idx + 1}</span>
                  <span className="text-white/60">{comp.periodA.timeSpan} → {comp.periodB.timeSpan}</span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{comp.title}</h4>
                <p className="text-[10px] text-museum-muted mt-2 truncate">
                  {comp.changes.length} Verified Changes
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparative Overview Vitrine */}
      <div className="border border-white/[0.08] bg-[#0E1118] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1.5">
            <span className="text-[9px] font-mono text-archival-amber uppercase tracking-widest font-semibold">
              COMPARATIVE SUMMARY SCORECARD
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {activeComparison.title}
            </h3>
            <p className="text-xs font-serif italic text-museum-muted">
              {activeComparison.periodA.name} ({activeComparison.periodA.timeSpan}) compared directly against {activeComparison.periodB.name} ({activeComparison.periodB.timeSpan}).
            </p>
          </div>
        </div>

        {/* Visual Side-by-Side Before vs After Profile Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Period A Card */}
          <div className="p-5 bg-[#12151E] border border-white/10 rounded-lg space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.06] pb-2">
              <span className="text-museum-muted uppercase tracking-wider font-semibold">BASELINE PERIOD (BEFORE)</span>
              <span className="text-white/80">{activeComparison.periodA.timeSpan}</span>
            </div>
            <h4 className="text-base font-serif font-bold text-white">{activeComparison.periodA.name}</h4>
            
            <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">ARTIFACTS</span>
                <p className="text-sm font-bold text-white mt-0.5">{activeComparison.periodA.receiptCount.toLocaleString()}</p>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">AUDIO HOURS</span>
                <p className="text-sm font-bold text-white mt-0.5">{activeComparison.periodA.audioHours}h</p>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">OUTFLOW</span>
                <p className="text-sm font-bold text-white mt-0.5">₹{activeComparison.periodA.totalSpend.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {activeComparison.periodA.topCategories && (
              <div className="text-[10px] font-mono text-museum-muted">
                <span className="uppercase text-white/50 block mb-1">Top Categories:</span>
                <span>{activeComparison.periodA.topCategories.join(' • ')}</span>
              </div>
            )}
          </div>

          {/* Period B Card */}
          <div className="p-5 bg-[#141824] border border-archival-amber/30 rounded-lg space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.06] pb-2">
              <span className="text-archival-amber uppercase tracking-wider font-semibold">COMPARATIVE PERIOD (AFTER)</span>
              <span className="text-archival-amber">{activeComparison.periodB.timeSpan}</span>
            </div>
            <h4 className="text-base font-serif font-bold text-white">{activeComparison.periodB.name}</h4>
            
            <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">ARTIFACTS</span>
                <p className="text-sm font-bold text-archival-amber mt-0.5">{activeComparison.periodB.receiptCount.toLocaleString()}</p>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">AUDIO HOURS</span>
                <p className="text-sm font-bold text-archival-amber mt-0.5">{activeComparison.periodB.audioHours}h</p>
              </div>
              <div className="p-2.5 bg-black/40 border border-white/[0.06] rounded">
                <span className="text-[9px] text-museum-muted uppercase block">OUTFLOW</span>
                <p className="text-sm font-bold text-archival-amber mt-0.5">₹{activeComparison.periodB.totalSpend.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {activeComparison.periodB.topCategories && (
              <div className="text-[10px] font-mono text-museum-muted">
                <span className="uppercase text-archival-amber/70 block mb-1">Top Categories:</span>
                <span className="text-white/80">{activeComparison.periodB.topCategories.join(' • ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="pt-2">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="h-3.5 w-3.5 text-museum-muted shrink-0 mr-1" />
            {domainTabs.map(tab => {
              if (tab.id !== 'all' && tab.count === 0) return null;
              const isActive = selectedDomain === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDomain(tab.id)}
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
        </div>

        {/* Visual Change Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChanges.map(change => (
            <ChangeCard
              key={change.id}
              change={change}
              onViewReceipts={(c) => setActiveEvidenceChange(c)}
            />
          ))}
        </div>

        {/* Category-by-Category Shift Breakdown */}
        {activeComparison.categoryDeltas && activeComparison.categoryDeltas.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-white/[0.08]">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-archival-amber" />
              <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                CATEGORY FREQUENCY & OUTFLOW TRANSFORMATION
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeComparison.categoryDeltas.slice(0, 6).map((catDelta, i) => (
                <div key={i} className="p-3 bg-[#131620] border border-white/10 rounded font-mono text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold truncate">{catDelta.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      catDelta.direction === 'increased' || catDelta.direction === 'emerged'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : catDelta.direction === 'decreased'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-white/70'
                    }`}>
                      {catDelta.changeText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-museum-muted pt-1 border-t border-white/[0.04]">
                    <div>
                      <span className="block text-white/40">BEFORE:</span>
                      <span>{catDelta.beforeCount} receipts (₹{catDelta.beforeSpend.toLocaleString('en-IN')})</span>
                    </div>
                    <div>
                      <span className="block text-archival-amber/70">AFTER:</span>
                      <span className="text-white/90">{catDelta.afterCount} receipts (₹{catDelta.afterSpend.toLocaleString('en-IN')})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Change Evidence Modal */}
      <ChangeEvidenceModal
        change={activeEvidenceChange}
        onClose={() => setActiveEvidenceChange(null)}
        onSelectReceipt={onSelectReceipt}
      />
    </section>
  );
};
