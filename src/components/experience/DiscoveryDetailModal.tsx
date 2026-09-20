import React from 'react';
import { LifeDiscovery } from '../../types/discoveries';
import { LifeReceipt } from '../../types/receipt';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  X,
  Sparkles,
  Receipt,
  TrendingUp,
  Tag,
  ShieldCheck,
} from 'lucide-react';

interface DiscoveryDetailModalProps {
  discovery: LifeDiscovery | null;
  onClose: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const DiscoveryDetailModal: React.FC<DiscoveryDetailModalProps> = ({
  discovery,
  onClose,
  onSelectReceipt,
}) => {
  if (!discovery) return null;

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
              DISCOVERY DOSSIER // {discovery.badge || 'SURPRISING ANOMALY'}
            </span>
            <span className="text-xs font-mono text-museum-muted">
              ID: {discovery.id}
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          {/* Header Title & Metric */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2 py-0.5 bg-archival-amber/10 border border-archival-amber/30 text-archival-amber font-bold rounded">
                {discovery.metric}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/80 rounded">
                {discovery.context}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {discovery.title}
            </h2>

            <p className="text-sm font-serif italic text-museum-muted leading-relaxed">
              {discovery.explanation}
            </p>
          </div>

          {/* Evidence Callout */}
          <div className="p-5 bg-black/40 border-l-4 border-archival-amber rounded-r space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono text-archival-amber uppercase tracking-widest font-semibold">
              <TrendingUp className="h-4 w-4" />
              <span>FORENSIC EVIDENCE</span>
            </div>
            <p className="text-sm font-serif text-[#E5E2D9] leading-relaxed">
              {discovery.evidence}
            </p>
          </div>

          {/* Supporting Records Gallery */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-archival-amber" />
                <h4 className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                  SUPPORTING ARCHIVAL RECORDS ({discovery.supportingRecords.length} EXHIBITS)
                </h4>
              </div>
              <span className="text-[10px] font-mono text-museum-muted">
                Click any receipt to open full record view
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {discovery.supportingRecords.map((r) => (
                <MuseumReceiptCard
                  key={r.id}
                  receipt={r}
                  onSelect={onSelectReceipt}
                />
              ))}
            </div>
          </div>

          {/* Tags */}
          {discovery.tags && discovery.tags.length > 0 && (
            <div className="flex items-center space-x-2 pt-2 text-[10px] font-mono text-museum-muted">
              <Tag className="h-3.5 w-3.5 text-archival-amber" />
              <span>INDEX LABELS:</span>
              <div className="flex flex-wrap gap-1.5">
                {discovery.tags.map((tag, i) => (
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
            Discovered deterministically across real heterogeneous datasets.
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
