import React from 'react';
import { PeriodChangeItem } from '../../types/comparisons';
import { LifeReceipt } from '../../types/receipt';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  X,
  TrendingUp,
  ArrowRight,
  Receipt,
  Layers,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

interface ChangeEvidenceModalProps {
  change: PeriodChangeItem | null;
  onClose: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const ChangeEvidenceModal: React.FC<ChangeEvidenceModalProps> = ({
  change,
  onClose,
  onSelectReceipt,
}) => {
  if (!change) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D0F15] border border-white/15 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#12151E]">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-archival-amber/15 text-archival-amber border border-archival-amber/30 rounded font-semibold">
              PERIOD CHANGE EVIDENCE // {change.categoryTag || change.domain}
            </span>
            <span className="text-xs font-mono text-museum-muted">
              ID: {change.id}
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          {/* Header Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-archival-amber rounded uppercase font-semibold">
                {change.domain}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded font-semibold">
                {change.delta.directionText}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {change.title}
            </h2>

            <p className="text-sm font-serif italic text-museum-muted leading-relaxed">
              {change.factualStatement}
            </p>
          </div>

          {/* Visual Before vs After Card Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-black/40 border border-white/10 rounded-lg">
            {/* Before Period Box */}
            <div className="p-4 bg-[#141722] border border-white/10 rounded space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs text-museum-muted">
                <span className="uppercase tracking-widest font-semibold">BEFORE PERIOD</span>
                <span>{change.beforePeriod.timeSpan}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{change.beforePeriod.label}</h4>
              <p className="text-lg font-bold text-white/90">{change.beforePeriod.metricValue}</p>
              {change.beforePeriod.sublabel && (
                <p className="text-xs text-museum-muted">{change.beforePeriod.sublabel}</p>
              )}
            </div>

            {/* After Period Box */}
            <div className="p-4 bg-[#161B26] border border-archival-amber/30 rounded space-y-2 font-mono">
              <div className="flex items-center justify-between text-xs text-archival-amber">
                <span className="uppercase tracking-widest font-semibold">AFTER PERIOD</span>
                <span>{change.afterPeriod.timeSpan}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{change.afterPeriod.label}</h4>
              <p className="text-lg font-bold text-archival-amber">{change.afterPeriod.metricValue}</p>
              {change.afterPeriod.sublabel && (
                <p className="text-xs text-museum-muted">{change.afterPeriod.sublabel}</p>
              )}
            </div>
          </div>

          {/* Forensic Description */}
          <div className="p-4 bg-[#12151E] border-l-3 border-archival-amber rounded-r text-xs font-serif italic text-[#E5E2D9] leading-relaxed">
            <span className="font-mono text-[9px] text-archival-amber uppercase not-italic tracking-wider font-semibold block mb-1">
              OBSERVATIONAL AUDIT
            </span>
            {change.details}
          </div>

          {/* Supporting Receipts Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-archival-amber" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                  UNDERLYING RECEIPTS ({change.underlyingReceipts.length} EXHIBITS)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-museum-muted">
                Click any receipt to open full archival record
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {change.underlyingReceipts.map((r) => (
                <MuseumReceiptCard
                  key={r.id}
                  receipt={r}
                  onSelect={onSelectReceipt}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#12151E] flex items-center justify-between">
          <span className="text-xs font-mono text-museum-muted">
            Computed deterministically without psychological speculation.
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
