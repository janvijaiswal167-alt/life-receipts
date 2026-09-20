import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { CategoryBadge, SourceBadge } from '../ui/Badge';
import { Music, AlertTriangle, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';

interface ReceiptCardProps {
  receipt: LifeReceipt;
  onSelect?: (r: LifeReceipt) => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, onSelect }) => {
  const isAudio = receipt.source === 'spotify';
  const isCommerce = receipt.source === 'commerce';
  const isHousehold = receipt.source === 'household';
  const isFraud = receipt.metadata?.isFraud === true;

  return (
    <div
      onClick={() => onSelect?.(receipt)}
      className={`group relative flex flex-col justify-between rounded-xl border bg-[#131B2E]/90 p-4 transition-all hover:bg-[#182234] hover:border-emerald-500/50 hover:shadow-glow-emerald/20 cursor-pointer ${
        isFraud ? 'border-rose-500/40 bg-rose-950/10' : 'border-[#24334A]'
      }`}
    >
      {/* Top Meta Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <SourceBadge source={receipt.source} size="sm" />
          <CategoryBadge category={receipt.category} size="sm" />
          {isFraud && (
            <span className="flex items-center space-x-1 rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-mono font-bold text-rose-400 border border-rose-500/40">
              <AlertTriangle className="h-2.5 w-2.5" />
              <span>FRAUD ALERT</span>
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 text-[11px] font-mono text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{receipt.dateStr}</span>
          <span className="text-gray-400">{receipt.timeStr}</span>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="my-2.5">
        <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
          {receipt.title}
        </h4>
        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
          {receipt.subtitle}
        </p>
      </div>

      {/* Context & Tags */}
      {receipt.location?.context && (
        <div className="flex items-center space-x-1 text-[11px] text-gray-400 mb-2">
          <MapPin className="h-3 w-3 text-cyan-400 flex-shrink-0" />
          <span className="truncate">
            {receipt.location.city ? `${receipt.location.city} • ` : ''}
            {receipt.location.context}
          </span>
        </div>
      )}

      {/* Bottom Value & Action Row */}
      <div className="flex items-center justify-between border-t border-[#24334A]/60 pt-2.5 mt-1">
        {receipt.amount != null ? (
          <span className="font-mono text-sm font-bold text-emerald-400">
            ₹{receipt.amount.toLocaleString('en-IN')}
          </span>
        ) : (
          <span className="flex items-center space-x-1 font-mono text-xs text-cyan-400">
            <Music className="h-3 w-3" />
            <span>{receipt.metadata?.durationFormatted || 'Played'}</span>
          </span>
        )}

        <span className="flex items-center text-[10px] font-mono text-gray-400 group-hover:text-emerald-400 transition-colors">
          <span>Inspect</span>
          <ArrowRight className="h-3 w-3 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
