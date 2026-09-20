import React from 'react';
import { AnomalyDiscovery } from '../../engine/patternEngine';
import { LifeReceipt } from '../../types/receipt';
import { Eye, ArrowUpRight, Sparkles, HelpCircle } from 'lucide-react';

interface MissedThisSectionProps {
  anomalies: AnomalyDiscovery[];
  onSelectReceipt?: (r: LifeReceipt) => void;
}

export const MissedThisSection: React.FC<MissedThisSectionProps> = ({
  anomalies,
  onSelectReceipt,
}) => {
  return (
    <section id="missed-this" className="space-y-6 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 07 // STATISTICAL ANOMALIES & HIDDEN FOOTNOTES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <Eye className="h-6 w-6 text-archival-amber" />
            <span>7. YOU MIGHT HAVE MISSED THIS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted">
          Curious outliers, micro-anomalies, and quiet correlations uncovered deep in the data.
        </p>
      </div>

      {/* Anomalies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {anomalies.map(anom => (
          <div
            key={anom.id}
            onClick={() => anom.receipt && onSelectReceipt?.(anom.receipt)}
            className={`border border-white/[0.08] bg-[#0F1117] p-6 flex flex-col justify-between transition-all hover:border-archival-amber/50 hover:bg-[#151821] ${
              anom.receipt ? 'cursor-pointer' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                <span className="text-archival-amber uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="h-3 w-3" />
                  <span>ANOMALY DISCOVERY</span>
                </span>
                <span className="border border-white/10 bg-[#151821] px-2 py-0.5 text-white font-bold">
                  {anom.metric}
                </span>
              </div>

              <h3 className="text-base font-bold font-mono text-white mt-3">
                {anom.title}
              </h3>
              <p className="mt-2 text-xs font-serif leading-relaxed text-[#D6D2C4]">
                {anom.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-museum-muted">
              <span className="italic font-serif">{anom.context}</span>
              {anom.receipt && (
                <span className="flex items-center text-archival-amber hover:underline whitespace-nowrap ml-2">
                  <span>INSPECT RECEIPT</span>
                  <ArrowUpRight className="h-3 w-3 ml-0.5" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
