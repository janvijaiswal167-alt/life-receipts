import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { LifeMoment } from '../../types/moments';
import { ReceiptConnection } from '../../types/graph';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  GitMerge,
  ArrowUpRight,
  Layers,
  Sparkles,
  Milestone,
  Music,
} from 'lucide-react';

interface GraphInspectorPanelProps {
  selectedReceipt: LifeReceipt | null;
  selectedMoment: LifeMoment | null;
  incidentConnections: ReceiptConnection[];
  onClearSelection: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
  onSelectMoment?: (m: LifeMoment) => void;
}

export const GraphInspectorPanel: React.FC<GraphInspectorPanelProps> = ({
  selectedReceipt,
  selectedMoment,
  incidentConnections,
  onClearSelection,
  onSelectReceipt,
  onSelectMoment,
}) => {
  if (!selectedReceipt && !selectedMoment) return null;

  return (
    <div className="border border-white/20 bg-[#0F1117]/95 backdrop-blur-md p-5 font-mono text-xs text-museum-muted shadow-2xl space-y-4 max-h-[580px] overflow-y-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[9px] uppercase tracking-widest text-archival-amber font-bold">
            {selectedReceipt ? `SELECTED RECORD // ${selectedReceipt.source.toUpperCase()}` : 'SELECTED EPISODE // MOMENT'}
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5 leading-snug">
            {selectedReceipt ? selectedReceipt.title : selectedMoment?.title}
          </h3>
        </div>

        <button
          onClick={onClearSelection}
          className="border border-white/10 p-1 text-museum-muted hover:text-white hover:border-white/30 transition-colors"
          title="Clear Selection & Reset Graph"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Case 1: Receipt Node Selected */}
      {selectedReceipt && (
        <div className="space-y-4">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 bg-[#151821] border border-white/[0.06] p-3 text-[11px]">
            <div>
              <span className="text-[9px] text-museum-faint uppercase block">DATE & TIME</span>
              <span className="text-white font-bold">{selectedReceipt.dateStr} {selectedReceipt.timeStr}</span>
            </div>

            <div>
              <span className="text-[9px] text-museum-faint uppercase block">CATEGORY</span>
              <span className="text-white font-bold">{selectedReceipt.category}</span>
            </div>

            <div>
              <span className="text-[9px] text-museum-faint uppercase block">DATASET SOURCE</span>
              <span className="text-archival-amber font-bold uppercase">{selectedReceipt.source}</span>
            </div>

            <div>
              <span className="text-[9px] text-museum-faint uppercase block">VALUE / METRIC</span>
              <span className="text-white font-bold">
                {selectedReceipt.amount != null ? `₹${selectedReceipt.amount.toLocaleString('en-IN')}` : selectedReceipt.metadata?.durationFormatted || 'Played'}
              </span>
            </div>
          </div>

          {/* Location Context */}
          {selectedReceipt.location?.context && (
            <div className="flex items-center space-x-1.5 text-[10px] text-museum-muted">
              <MapPin className="h-3 w-3 text-archival-amber flex-shrink-0" />
              <span>
                {selectedReceipt.location.city ? `${selectedReceipt.location.city} • ` : ''}
                {selectedReceipt.location.context}
              </span>
            </div>
          )}

          {/* Action Trigger */}
          <button
            onClick={() => onSelectReceipt(selectedReceipt)}
            className="w-full flex items-center justify-center space-x-1.5 border border-archival-amber/60 bg-archival-amber/15 py-2 text-xs font-bold text-archival-amber hover:bg-archival-amber/25 transition-colors uppercase tracking-wider"
          >
            <span>Inspect Physical Thermal Receipt</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          {/* Explainable Incident Relationships */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-white font-bold uppercase tracking-wider flex items-center space-x-1">
                <GitMerge className="h-3 w-3 text-archival-amber" />
                <span>EXPLAINABLE GRAPH BRIDGES ({incidentConnections.length})</span>
              </span>
            </div>

            {incidentConnections.length === 0 ? (
              <p className="text-[10px] text-museum-faint italic font-serif">
                This record serves as an anchor node connected structurally within its thematic cluster.
              </p>
            ) : (
              <div className="space-y-2">
                {incidentConnections.map(conn => {
                  const partner = conn.sourceReceipt.id === selectedReceipt.id ? conn.targetReceipt : conn.sourceReceipt;
                  return (
                    <div
                      key={conn.id}
                      className="border border-white/[0.06] bg-[#141720] p-3 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-archival-amber font-bold uppercase">
                          {conn.relationshipType} ({conn.score}/100)
                        </span>
                        <span className="text-museum-faint uppercase">
                          ↔ {partner.source}
                        </span>
                      </div>

                      <h5 className="text-xs font-bold text-white truncate">
                        {partner.title}
                      </h5>

                      <div className="space-y-1 pt-1 border-t border-white/[0.04]">
                        {conn.reasons.slice(0, 2).map((r, i) => (
                          <div key={i} className="flex items-start space-x-1.5 text-[10px] text-museum-muted">
                            <CheckCircle2 className="h-3 w-3 text-archival-amber flex-shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => onSelectReceipt(partner)}
                          className="text-[9px] text-archival-amber hover:underline flex items-center"
                        >
                          <span>Examine Partner</span>
                          <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Case 2: Moment Node Selected */}
      {selectedMoment && (
        <div className="space-y-4">
          <div className="bg-[#151821] border border-white/[0.06] p-3 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[9px] text-museum-faint uppercase">EPISODE TYPE</span>
              <span className="text-archival-amber font-bold uppercase">{selectedMoment.badge}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[9px] text-museum-faint uppercase">CHRONOLOGICAL SPAN</span>
              <span className="text-white font-bold">{selectedMoment.timeRange.formattedSpan}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[9px] text-museum-faint uppercase">TOTAL CAPITAL / DURATION</span>
              <span className="text-white font-bold">
                {selectedMoment.stats.totalAmountInr ? `₹${selectedMoment.stats.totalAmountInr.toLocaleString('en-IN')}` : selectedMoment.stats.totalDurationFormatted || 'Episode'}
              </span>
            </div>
          </div>

          {/* Grouping Signals Explanation */}
          <div className="space-y-1.5 border border-white/[0.06] bg-[#141720] p-3">
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              WHY WERE THEY GROUPED:
            </span>
            {selectedMoment.explanation.groupingSignals.map((sig, idx) => (
              <div key={idx} className="flex items-start space-x-1.5 text-[10px] text-museum-text">
                <CheckCircle2 className="h-3 w-3 text-archival-amber flex-shrink-0 mt-0.5" />
                <span>{sig}</span>
              </div>
            ))}
          </div>

          {/* Grouped Receipts */}
          <div className="space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
              CONSTITUENT RECORDS ({selectedMoment.receipts.length}):
            </span>
            <div className="space-y-1.5">
              {selectedMoment.receipts.map((r, idx) => (
                <div
                  key={r.id}
                  onClick={() => onSelectReceipt(r)}
                  className="flex items-center justify-between border border-white/10 bg-[#0F1117] p-2 text-[10px] hover:border-archival-amber cursor-pointer transition-colors"
                >
                  <div className="truncate pr-2">
                    <span className="text-archival-amber font-bold mr-1.5">0{idx + 1}</span>
                    <span className="text-white font-bold truncate">{r.title}</span>
                  </div>
                  <span className="text-museum-faint whitespace-nowrap">
                    {r.amount != null ? `₹${r.amount}` : r.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
