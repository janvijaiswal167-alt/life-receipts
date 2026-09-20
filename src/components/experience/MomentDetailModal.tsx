import React, { useMemo } from 'react';
import { LifeMoment } from '../../types/moments';
import { LifeReceipt } from '../../types/receipt';
import { CrossConnection } from '../../engine/patternEngine';
import { LifePattern } from '../../types/patterns';
import { LifeChapter } from '../../types/chapters';
import { findLinksForMoment } from '../../engine/crossIntegration';
import { ArchivalReceipt } from '../museum/ArchivalReceipt';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  GitMerge,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

interface MomentDetailModalProps {
  moment: LifeMoment | null;
  onClose: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
  allConnections?: CrossConnection[];
  allPatterns?: LifePattern[];
  allChapters?: LifeChapter[];
  onSelectConnection?: (c: CrossConnection) => void;
  onSelectPattern?: (p: LifePattern) => void;
  onSelectChapter?: (ch: LifeChapter) => void;
}

export const MomentDetailModal: React.FC<MomentDetailModalProps> = ({
  moment,
  onClose,
  onSelectReceipt,
  allConnections = [],
  allPatterns = [],
  allChapters = [],
  onSelectConnection,
  onSelectPattern,
  onSelectChapter,
}) => {
  const links = useMemo(() => {
    return findLinksForMoment(moment, allConnections, allPatterns, allChapters);
  }, [moment, allConnections, allPatterns, allChapters]);
  if (!moment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn font-mono">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto border border-white/20 bg-[#0A0C10] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Header Bar */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] text-archival-amber uppercase tracking-wider mb-1">
              <span className="border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 font-bold">
                {moment.badge}
              </span>
              <span>EPISODE INSPECTION // SCORE: {moment.connectionScore}/100</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {moment.title}
            </h2>
            <p className="text-xs font-serif italic text-museum-muted mt-1">
              {moment.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="border border-white/10 p-1.5 text-museum-muted hover:text-white hover:border-white/30 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Spatiotemporal Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0F1117] border border-white/[0.06] p-4 text-xs">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              CHRONOLOGICAL SPAN
            </span>
            <div className="flex items-center space-x-1.5 text-white font-bold mt-1 text-[11px]">
              <Clock className="h-3.5 w-3.5 text-archival-amber" />
              <span>{moment.timeRange.formattedSpan}</span>
            </div>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              SPATIAL CONTEXT
            </span>
            <div className="flex items-center space-x-1.5 text-white font-bold mt-1 text-[11px]">
              <MapPin className="h-3.5 w-3.5 text-archival-amber" />
              <span className="truncate">{moment.locations.join(', ') || 'Pune, India'}</span>
            </div>
          </div>

          <div>
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              DOMAINS & SOURCES
            </span>
            <div className="text-white font-bold mt-1 text-[11px]">
              {moment.stats.sources.join(' + ').toUpperCase()} • {moment.dominantCategories.slice(0, 2).join(', ')}
            </div>
          </div>
        </div>

        {/* Section 2: Why Were They Grouped? (Factual Explainable Signals) */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-archival-amber">
            <Sparkles className="h-3.5 w-3.5" />
            <span>EXPLAINABLE GROUPING RATIONALE</span>
          </div>

          <p className="text-xs font-serif italic text-[#D6D2C4] leading-relaxed">
            {moment.explanation.summary}
          </p>

          <div className="pt-2 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              OBSERVABLE DATA SIGNALS:
            </span>
            {moment.explanation.groupingSignals.map((signal, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-museum-text">
                <CheckCircle2 className="h-4 w-4 text-archival-amber flex-shrink-0 mt-0.5" />
                <span>{signal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Visual Relational Flow between Receipts */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-museum-faint flex items-center space-x-1.5">
              <GitMerge className="h-3.5 w-3.5 text-archival-amber" />
              <span>VISUAL EPISODE TOPOLOGY</span>
            </span>
            <span className="text-[9px] text-museum-faint">
              {moment.receipts.length} INTERCONNECTED ARTIFACTS
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
            {moment.receipts.map((r, idx) => (
              <React.Fragment key={r.id}>
                <div
                  onClick={() => onSelectReceipt(r)}
                  className="flex-shrink-0 w-64 border border-white/10 bg-[#151821] p-3 cursor-pointer hover:border-archival-amber/60 hover:bg-[#1A1E29] transition-all group"
                >
                  <div className="flex items-center justify-between text-[9px] mb-1">
                    <span className="border border-white/10 px-1.5 py-0.2 uppercase text-museum-faint">
                      {r.source}
                    </span>
                    <span className="text-museum-muted">{r.timeStr}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-archival-amber transition-colors truncate">
                    {r.title}
                  </h4>
                  <p className="text-[10px] text-museum-muted italic font-serif truncate mt-0.5">
                    {r.subtitle || r.category}
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex items-center justify-between text-[9px]">
                    <span className="text-white font-mono font-bold">
                      {r.amount != null ? `₹${r.amount.toLocaleString('en-IN')}` : r.metadata?.durationFormatted || 'Audio Stream'}
                    </span>
                    <span className="text-archival-amber flex items-center">
                      <span>Examine</span>
                      <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>

                {idx < moment.receipts.length - 1 && (
                  <div className="flex-shrink-0 flex items-center text-archival-amber px-1">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Section 4: Itemized Source Receipt Ledger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-museum-muted">
            <span className="text-[10px] uppercase tracking-widest text-museum-faint">
              ITEMIZED SOURCE RECORDS
            </span>
            <span>Click any record to inspect physical thermal receipt</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {moment.receipts.map((r, idx) => (
              <div
                key={r.id}
                onClick={() => onSelectReceipt(r)}
                className="border border-white/10 bg-[#0F1117] p-4 cursor-pointer hover:border-archival-amber/50 hover:bg-[#151821] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] mb-2">
                  <span className="border border-archival-amber/30 bg-archival-amber/10 px-1.5 py-0.5 text-archival-amber text-[9px] font-bold">
                    RECORD 0{idx + 1} // {r.source.toUpperCase()}
                  </span>
                  <span className="text-museum-muted">{r.dateStr} • {r.timeStr}</span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{r.title}</h4>
                {r.subtitle && <p className="text-xs text-museum-muted italic font-serif mt-0.5">{r.subtitle}</p>}
                <p className="text-xs text-[#3E424E] mt-2 line-clamp-2">{r.description}</p>
                <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                  <span className="text-white font-bold">
                    {r.amount != null ? `₹${r.amount.toLocaleString('en-IN')}` : r.metadata?.durationFormatted || 'Stream'}
                  </span>
                  <span className="text-archival-amber text-[10px] flex items-center">
                    <span>Inspect Receipt</span>
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Connected Cross-Dataset Links & Discovered Patterns */}
        {(links.connections.length > 0 || links.patterns.length > 0 || links.chapter) && (
          <div className="border border-white/10 bg-[#0F1117] p-5 space-y-4">
            <div className="flex items-center space-x-2 text-[10px] text-archival-amber uppercase tracking-widest font-bold">
              <GitMerge className="h-3.5 w-3.5 text-archival-amber" />
              <span>CONNECTED RELATIONAL GRAPH & PATTERNS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Connections in this Moment */}
              {links.connections.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-museum-muted flex items-center space-x-1.5">
                    <GitMerge className="h-3 w-3 text-emerald-400" />
                    <span>CROSS-DATASET SYNCS ({links.connections.length})</span>
                  </span>
                  <div className="space-y-2">
                    {links.connections.map(c => (
                      <div
                        key={c.id}
                        onClick={() => onSelectConnection?.(c)}
                        className="p-2.5 bg-[#151821] border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer group space-y-1"
                      >
                        <div className="flex justify-between text-[9px]">
                          <span className="text-emerald-400 font-bold uppercase">{c.category}</span>
                          <span className="text-museum-muted">{c.era}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {c.title}
                        </h5>
                        <p className="text-[10px] text-museum-muted font-serif italic line-clamp-1">
                          {c.tagline}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Patterns */}
              {links.patterns.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-museum-muted flex items-center space-x-1.5">
                    <Sparkles className="h-3 w-3 text-cyan-400" />
                    <span>ASSOCIATED PATTERNS ({links.patterns.length})</span>
                  </span>
                  <div className="space-y-2">
                    {links.patterns.map(p => (
                      <div
                        key={p.id}
                        onClick={() => onSelectPattern?.(p)}
                        className="p-2.5 bg-[#151821] border border-white/5 hover:border-cyan-500/50 transition-all cursor-pointer group space-y-1"
                      >
                        <div className="flex justify-between text-[9px]">
                          <span className="text-cyan-400 font-bold uppercase">{p.patternType.replace(/_/g, ' ')}</span>
                          <span className="text-museum-muted">{p.confidence}</span>
                        </div>
                        <h5 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {p.title}
                        </h5>
                        <p className="text-[10px] text-museum-muted font-serif italic line-clamp-1">
                          {p.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Chapter Link */}
            {links.chapter && (
              <div
                onClick={() => onSelectChapter?.(links.chapter!)}
                className="mt-2 border border-archival-amber/30 bg-[#151821] p-3 flex items-center justify-between hover:border-archival-amber transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="h-4 w-4 text-archival-amber flex-shrink-0" />
                  <div>
                    <span className="text-[9px] text-museum-muted uppercase tracking-widest block">
                      ERA PROVENANCE // CHAPTER 0{links.chapter.number}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-archival-amber transition-colors">
                      {links.chapter.title} ({links.chapter.dateRange.formatted})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-archival-amber flex items-center flex-shrink-0">
                  <span>View Chapter</span>
                  <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="border border-white/20 bg-[#151821] px-5 py-2 text-xs font-mono text-white hover:bg-white/10 transition-colors uppercase tracking-wider"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
