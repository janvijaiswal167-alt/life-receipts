import React from 'react';
import { LifePattern } from '../../types/patterns';
import { LifeReceipt } from '../../types/receipt';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  X,
  ShieldCheck,
  Calendar,
  Layers,
  BarChart3,
  Receipt,
  ArrowUpRight,
  TrendingUp,
  Tag,
} from 'lucide-react';

interface PatternEvidenceModalProps {
  pattern: LifePattern | null;
  onClose: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateToReceipts?: (tag?: string) => void;
}

export const PatternEvidenceModal: React.FC<PatternEvidenceModalProps> = ({
  pattern,
  onClose,
  onSelectReceipt,
  onNavigateToReceipts,
}) => {
  if (!pattern) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D0F15] border border-white/15 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#12151E]">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-archival-amber/15 text-archival-amber border border-archival-amber/30 rounded">
              PATTERN EVIDENCE DOSSIER
            </span>
            <span className="text-xs font-mono text-museum-muted">
              ID: {pattern.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-museum-muted hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Main Title & Core Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/90 rounded uppercase">
                {pattern.patternType.replace(/_/g, ' ')}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{pattern.confidence}</span>
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-archival-amber rounded flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{pattern.era || pattern.timeSpan}</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-tight">
              {pattern.title}
            </h2>

            <p className="text-sm font-serif italic text-museum-muted leading-relaxed">
              {pattern.summary}
            </p>
          </div>

          {/* Key Empirical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase tracking-wider block">
                TOTAL OCCURRENCES
              </span>
              <span className="text-base font-bold text-white mt-1 block">
                {pattern.stats.count.toLocaleString()}
              </span>
            </div>

            <div className="p-3.5 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase tracking-wider block">
                PEAK WINDOW / CADENCE
              </span>
              <span className="text-base font-bold text-archival-amber mt-1 block truncate">
                {pattern.stats.peakTime || pattern.stats.frequency || 'Continuous'}
              </span>
            </div>

            <div className="p-3.5 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase tracking-wider block">
                DOMINANT DOMAIN
              </span>
              <span className="text-base font-bold text-white mt-1 block truncate">
                {pattern.stats.dominantCategory || pattern.category}
              </span>
            </div>

            <div className="p-3.5 bg-[#141722] border border-white/10 rounded">
              <span className="text-[9px] text-museum-muted uppercase tracking-wider block">
                MEASURED VOLUME / VALUE
              </span>
              <span className="text-base font-bold text-emerald-400 mt-1 block truncate">
                {pattern.stats.totalValue || pattern.metricValue}
              </span>
            </div>
          </div>

          {/* Forensic Evidence Statement */}
          <div className="p-5 bg-black/40 border-l-4 border-archival-amber border-y border-r border-white/10 rounded-r space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-mono text-archival-amber uppercase tracking-widest font-semibold">
              <TrendingUp className="h-4 w-4" />
              <span>FORENSIC EVIDENCE & VERIFICATION</span>
            </div>
            <p className="text-sm font-serif italic text-[#E5E2D9] leading-relaxed">
              {pattern.evidence}
            </p>
          </div>

          {/* Breakdown Distribution (if present) */}
          {pattern.breakdown && pattern.breakdown.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-museum-muted">
                <BarChart3 className="h-4 w-4 text-archival-amber" />
                <span>STATISTICAL DISTRIBUTION BREAKDOWN</span>
              </div>

              <div className="space-y-2.5 p-4 bg-[#12151E] border border-white/10 rounded">
                {pattern.breakdown.map((item, idx) => {
                  const maxVal = Math.max(...(pattern.breakdown?.map(b => b.value) || [1]));
                  const pct = maxVal > 0 ? Math.round((item.value / maxVal) * 100) : 0;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white/90 font-medium">{item.label}</span>
                        <span className="text-archival-amber font-semibold">
                          {item.formattedValue || item.value}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-black/50 rounded overflow-hidden border border-white/5">
                        <div
                          className="h-full bg-archival-amber/80 rounded"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {item.sublabel && (
                        <span className="text-[10px] text-museum-muted font-mono">
                          {item.sublabel}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Supporting Receipts Gallery */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-archival-amber" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                  SUPPORTING RECEIPTS & EXHIBITS ({pattern.supportingReceipts.length})
                </h4>
              </div>
              <span className="text-[10px] font-mono text-museum-muted">
                Click any receipt exhibit to inspect verified archival details
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pattern.supportingReceipts.map((r) => (
                <MuseumReceiptCard
                  key={r.id}
                  receipt={r}
                  onSelect={onSelectReceipt}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          {pattern.tags && pattern.tags.length > 0 && (
            <div className="flex items-center space-x-2 pt-2 text-[10px] font-mono text-museum-muted">
              <Tag className="h-3.5 w-3.5 text-archival-amber" />
              <span>ARCHIVAL INDEXES:</span>
              <div className="flex flex-wrap gap-1.5">
                {pattern.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-white/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#12151E] flex items-center justify-between">
          <span className="text-xs font-mono text-museum-muted">
            Verified across heterogeneous digital datasets without psychological speculation.
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono bg-white/10 hover:bg-white/20 text-white rounded border border-white/10 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
