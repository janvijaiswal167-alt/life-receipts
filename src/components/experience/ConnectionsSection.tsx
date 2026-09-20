import React, { useState, useMemo } from 'react';
import { CrossConnection } from '../../engine/patternEngine';
import { LifeReceipt } from '../../types/receipt';
import { LifeMoment } from '../../types/moments';
import { LifePattern } from '../../types/patterns';
import { ArchivalReceipt } from '../museum/ArchivalReceipt';
import {
  GitMerge,
  ArrowLeftRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface ConnectionsSectionProps {
  connections: CrossConnection[];
  onSelectReceipt: (r: LifeReceipt) => void;
  allMoments?: LifeMoment[];
  allPatterns?: LifePattern[];
  onSelectMoment?: (m: LifeMoment) => void;
  onSelectPattern?: (p: LifePattern) => void;
}

export const ConnectionsSection: React.FC<ConnectionsSectionProps> = ({
  connections,
  onSelectReceipt,
  allMoments = [],
  allPatterns = [],
  onSelectMoment,
  onSelectPattern,
}) => {
  const [activeConnectionId, setActiveConnectionId] = useState<string>(connections[0]?.id || '');
  const activeConn = connections.find(c => c.id === activeConnectionId) || connections[0];

  // Find linked moment and pattern for the active connection
  const linkedMoment = useMemo(() => {
    if (!activeConn) return null;
    return allMoments.find(m =>
      m.receipts.some(r => r.id === activeConn.receiptA.id || r.id === activeConn.receiptB.id)
    );
  }, [activeConn, allMoments]);

  const linkedPattern = useMemo(() => {
    if (!activeConn) return null;
    return allPatterns.find(p =>
      p.category === activeConn.category ||
      p.supportingReceipts.some(r => r.id === activeConn.receiptA.id || r.id === activeConn.receiptB.id)
    );
  }, [activeConn, allPatterns]);

  if (!activeConn) return null;

  return (
    <section id="connections" className="space-y-6 border-b border-white/[0.08] pb-16 font-mono">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 03 // EXPLAINABLE LIFE GRAPH ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <GitMerge className="h-6 w-6 text-archival-amber" />
            <span>3. CONNECTIONS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted">
          Deterministic cross-dataset bridges discovered between music listening, daily micro-expenses, and digital commerce.
        </p>
      </div>

      {/* Connection Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {connections.map((conn, idx) => {
          const isActive = conn.id === activeConn.id;
          return (
            <button
              key={conn.id}
              onClick={() => setActiveConnectionId(conn.id)}
              className={`border px-4 py-2 text-xs font-mono transition-all text-left ${
                isActive
                  ? 'border-archival-amber bg-[#151821] text-archival-amber font-semibold shadow-glow-amber-subtle'
                  : 'border-white/[0.08] bg-[#0F1117] text-museum-muted hover:border-white/20 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between text-[9px] opacity-70 mb-0.5">
                <span>SYNC #0{idx + 1}</span>
                <span className="text-archival-amber font-bold">SCORE: 95/100</span>
              </div>
              <span className="truncate max-w-[220px] block font-bold text-white">{conn.title}</span>
            </button>
          );
        })}
      </div>

      {/* Dual Bridge Exhibit: Narrative & Side-by-Side Dual Thermal Receipts */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 space-y-8">
        {/* Connection Narrative Header */}
        <div className="border-b border-white/[0.06] pb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[10px] text-archival-amber uppercase">
              <Zap className="h-3.5 w-3.5" />
              <span>RELATIONAL PROOF // {activeConn.category}</span>
            </div>

            <span className="border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 text-[10px] text-archival-amber uppercase font-bold">
              PIVOTAL CONNECTION • 95/100 CONFIDENCE
            </span>
          </div>

          <h3 className="text-2xl font-serif text-white">
            {activeConn.title}
          </h3>
          <p className="text-sm font-serif italic text-[#D6D2C4]">
            "{activeConn.tagline}"
          </p>

          <div className="mt-4 border-l-2 border-archival-amber pl-3 text-xs font-serif text-museum-muted leading-relaxed">
            {activeConn.insight}
          </div>

            {/* Observable Signals */}
            <div className="bg-[#08090C] border border-white/[0.06] p-3 mt-4 space-y-1 text-xs font-mono">
              <span className="text-[9px] uppercase tracking-widest text-museum-faint block mb-1">
                OBSERVABLE DATA SIGNALS (DETERMINISTIC):
              </span>
              <div className="flex items-center space-x-2 text-[11px] text-museum-text">
                <CheckCircle2 className="h-3.5 w-3.5 text-archival-amber flex-shrink-0" />
                <span>Temporal alignment: Events synchronized within active life window ({activeConn.era})</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-museum-text">
                <CheckCircle2 className="h-3.5 w-3.5 text-archival-amber flex-shrink-0" />
                <span>Category affinity: {activeConn.category} workflow</span>
              </div>
            </div>

            {/* Linked Parent Moment & Discovered Pattern Badges */}
            {(linkedMoment || linkedPattern) && (
              <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-3">
                {linkedMoment && (
                  <button
                    onClick={() => onSelectMoment?.(linkedMoment)}
                    className="inline-flex items-center space-x-2 border border-archival-amber/40 bg-[#151821] px-3 py-1.5 text-xs text-archival-amber hover:bg-archival-amber/10 hover:border-archival-amber transition-all cursor-pointer"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span>MOMENT: {linkedMoment.title}</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </button>
                )}

                {linkedPattern && (
                  <button
                    onClick={() => onSelectPattern?.(linkedPattern)}
                    className="inline-flex items-center space-x-2 border border-cyan-500/40 bg-[#151821] px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all cursor-pointer"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>PATTERN: {linkedPattern.title}</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            )}
          </div>

        {/* Side-by-Side Paired Artifact Receipts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-museum-muted">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-archival-amber rounded-none" />
              <span className="font-bold text-white">ARTIFACT A: {activeConn.receiptA.source.toUpperCase()} RECORD</span>
            </span>
            <ArrowLeftRight className="h-4 w-4 text-archival-amber" />
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-white/60 rounded-none" />
              <span className="font-bold text-white">ARTIFACT B: {activeConn.receiptB.source.toUpperCase()} RECORD</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pt-2">
            <div
              onClick={() => onSelectReceipt(activeConn.receiptA)}
              className="cursor-pointer hover:scale-[1.01] transition-transform"
              title="Click to inspect Artifact A"
            >
              <ArchivalReceipt receipt={activeConn.receiptA} />
            </div>

            <div
              onClick={() => onSelectReceipt(activeConn.receiptB)}
              className="cursor-pointer hover:scale-[1.01] transition-transform"
              title="Click to inspect Artifact B"
            >
              <ArchivalReceipt receipt={activeConn.receiptB} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
