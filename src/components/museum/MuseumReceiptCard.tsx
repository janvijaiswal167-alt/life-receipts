import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { Clock, MapPin, ArrowUpRight, AlertOctagon, Music } from 'lucide-react';

interface MuseumReceiptCardProps {
  receipt: LifeReceipt;
  onSelect?: (r: LifeReceipt) => void;
}

const MuseumReceiptCardComponent: React.FC<MuseumReceiptCardProps> = ({
  receipt,
  onSelect,
}) => {
  const isAudio = receipt.source === 'spotify';
  const isFraud = receipt.metadata?.isFraud === true;

  const sourceLabels = {
    spotify: 'SPOTIFY AUDIO',
    household: 'HOUSEHOLD LEDGER',
    commerce: 'CARD COMMERCE',
  }[receipt.source];

  return (
    <div
      onClick={() => onSelect?.(receipt)}
      className={`group relative flex flex-col justify-between border bg-[#0F1117] p-4 transition-all duration-200 cursor-pointer hover:bg-[#151821] ${
        isFraud
          ? 'border-red-900/40 hover:border-red-600/50'
          : 'border-white/[0.08] hover:border-archival-amber/40'
      }`}
    >
      {/* Corner crosshairs on hover */}
      <span className="absolute top-1.5 left-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute top-1.5 right-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute bottom-1.5 left-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>
      <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono text-white/10 group-hover:text-archival-amber/40 select-none">+</span>

      {/* Top Metadata Row */}
      <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
        <div className="flex items-center space-x-2">
          <span className="border border-white/10 px-1.5 py-0.5 text-museum-muted group-hover:text-archival-amber group-hover:border-archival-amber/30 transition-colors">
            {sourceLabels}
          </span>
          <span className="text-museum-faint">•</span>
          <span className="text-museum-muted">{receipt.category}</span>
        </div>

        <div className="flex items-center space-x-1 text-museum-faint">
          <Clock className="h-3 w-3" />
          <span>{receipt.dateStr}</span>
        </div>
      </div>

      {/* Title & Secondary Context */}
      <div className="my-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-[#FAF8F5] group-hover:text-archival-amber transition-colors line-clamp-1 font-mono">
            {receipt.title}
          </h4>
          {isFraud && (
            <span className="flex items-center space-x-1 border border-red-900/50 bg-red-950/40 px-1.5 py-0.5 text-[9px] font-mono font-bold text-red-400">
              <AlertOctagon className="h-2.5 w-2.5" />
              <span>ALERT</span>
            </span>
          )}
        </div>

        {receipt.subtitle && (
          <p className="mt-0.5 text-xs text-museum-muted line-clamp-1 font-serif italic">
            {receipt.subtitle}
          </p>
        )}
      </div>

      {/* Location / Context Vector */}
      {receipt.location?.city && (
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-museum-faint mb-3">
          <MapPin className="h-3 w-3 text-archival-amber/70" />
          <span className="truncate">
            {receipt.location.city}
            {receipt.location.state ? `, ${receipt.location.state}` : ''}
          </span>
        </div>
      )}

      {/* Bottom Ledger Line */}
      <div className="flex items-center justify-between border-t border-white/[0.06] pt-2.5 mt-auto">
        {receipt.amount != null ? (
          <span className="font-mono text-sm font-bold text-white group-hover:text-archival-amber transition-colors">
            ₹{receipt.amount.toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="flex items-center space-x-1.5 font-mono text-xs text-museum-muted">
            <Music className="h-3 w-3 text-archival-amber/70" />
            <span>{receipt.metadata?.durationFormatted || 'Played'}</span>
          </span>
        )}

        <span className="flex items-center text-[10px] font-mono text-museum-muted group-hover:text-archival-amber transition-colors">
          <span>EXAMINE</span>
          <ArrowUpRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};

export const MuseumReceiptCard = React.memo(MuseumReceiptCardComponent);
