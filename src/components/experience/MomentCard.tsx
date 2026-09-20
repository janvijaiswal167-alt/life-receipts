import React from 'react';
import { LifeMoment } from '../../types/moments';
import { LifeReceipt } from '../../types/receipt';
import { Clock, MapPin, ArrowUpRight, Sparkles, Layers, CheckCircle2 } from 'lucide-react';

interface MomentCardProps {
  moment: LifeMoment;
  onOpenMoment: (m: LifeMoment) => void;
  onSelectReceipt?: (r: LifeReceipt) => void;
}

export const MomentCard: React.FC<MomentCardProps> = ({
  moment,
  onOpenMoment,
}) => {
  return (
    <div
      onClick={() => onOpenMoment(moment)}
      className="group relative border border-white/[0.08] bg-[#0F1117] p-5 sm:p-6 transition-all duration-200 hover:border-archival-amber/50 hover:bg-[#151821] cursor-pointer flex flex-col justify-between font-mono"
    >
      {/* Corner crosshairs */}
      <span className="absolute top-1.5 left-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute top-1.5 right-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>

      <div>
        {/* Top Header: Badge, Time & Score */}
        <div className="flex items-center justify-between gap-2 text-[10px] mb-3">
          <span className="border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 text-archival-amber font-semibold uppercase">
            {moment.badge}
          </span>

          <div className="flex items-center space-x-2">
            <span className="border border-emerald-800/40 bg-emerald-950/30 px-1.5 py-0.5 text-emerald-300 font-bold text-[9px]">
              SCORE {moment.connectionScore}/100
            </span>
            <span className="text-museum-faint flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{moment.timeRange.formattedSpan.split('•')[0]}</span>
            </span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base font-bold text-white group-hover:text-archival-amber transition-colors line-clamp-2 leading-snug">
          {moment.title}
        </h3>
        <p className="mt-1.5 text-xs font-serif italic text-museum-muted leading-relaxed line-clamp-2">
          {moment.subtitle}
        </p>

        {/* Location tag if available */}
        {moment.locations.length > 0 && (
          <div className="flex items-center space-x-1.5 text-[10px] text-museum-muted mt-2.5">
            <MapPin className="h-3 w-3 text-archival-amber/70 flex-shrink-0" />
            <span className="truncate">{moment.locations[0]}</span>
          </div>
        )}

        {/* Receipt Mini Thumbnail Stack Preview */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-1.5">
          <div className="flex items-center justify-between text-[9px] text-museum-faint uppercase tracking-wider">
            <span className="flex items-center space-x-1">
              <Layers className="h-2.5 w-2.5 text-archival-amber" />
              <span>EPISODE RECEIPTS ({moment.receipts.length})</span>
            </span>
            <span>{moment.stats.sources.join(' + ').toUpperCase()}</span>
          </div>

          <div className="space-y-1">
            {moment.receipts.slice(0, 3).map((r, idx) => (
              <div
                key={r.id}
                className="flex items-center justify-between bg-[#12141C] border border-white/[0.04] px-2 py-1 text-[10px] text-museum-muted"
              >
                <div className="flex items-center space-x-1.5 truncate pr-2">
                  <span className="text-archival-amber font-bold text-[9px]">0{idx + 1}</span>
                  <span className="truncate text-white text-[10px]">{r.title}</span>
                </div>
                <span className="text-[9px] text-museum-faint whitespace-nowrap">
                  {r.amount != null ? `₹${r.amount}` : r.metadata?.durationFormatted || r.source}
                </span>
              </div>
            ))}
            {moment.receipts.length > 3 && (
              <p className="text-[9px] text-museum-faint text-right">
                +{moment.receipts.length - 3} more receipts in this episode
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Strip */}
      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-museum-muted">
        <span className="text-museum-faint">
          {moment.dominantCategories.slice(0, 2).join(' • ')}
        </span>

        <span className="flex items-center text-archival-amber font-semibold group-hover:underline">
          <span>REVEAL MOMENT</span>
          <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
