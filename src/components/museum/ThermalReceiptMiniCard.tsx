import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { Music } from 'lucide-react';

interface ThermalReceiptMiniCardProps {
  receipt: LifeReceipt;
  onSelect?: (r: LifeReceipt) => void;
}

export const ThermalReceiptMiniCard: React.FC<ThermalReceiptMiniCardProps> = ({
  receipt,
  onSelect,
}) => {
  const isFraud = receipt.metadata?.isFraud === true;

  const sourceName = {
    spotify: 'SPOTIFY AUDIO',
    household: 'HOUSEHOLD LEDGER',
    commerce: 'CARD COMMERCE',
  }[receipt.source];

  return (
    <div
      onClick={() => onSelect?.(receipt)}
      className="relative flex flex-col justify-between bg-[#F4F0E6] text-[#141519] font-mono p-4 sm:p-5 shadow-receipt-physical border-t border-b border-[#D6D1C4] cursor-pointer transition-transform duration-150 hover:-translate-y-1 hover:shadow-lg selection:bg-amber-900/10 group"
    >
      {/* Top Perforation Edge */}
      <div className="absolute -top-1.5 left-0 right-0 flex justify-between overflow-hidden opacity-50 select-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="text-[#C8C3B4] text-[7px]">▲</span>
        ))}
      </div>

      {/* Header Stamp */}
      <div className="border-b border-dashed border-[#A8A395] pb-2 text-[9px] text-[#555861]">
        <div className="flex justify-between items-center font-bold">
          <span>REG: #{receipt.id}</span>
          <span>{receipt.dateStr}</span>
        </div>
        <div className="flex justify-between items-center mt-0.5">
          <span className="uppercase font-bold tracking-wider text-[#141519]">
            {sourceName}
          </span>
          <span className="text-[#6B6E77]">{receipt.timeStr}</span>
        </div>
      </div>

      {/* Body */}
      <div className="py-3 space-y-1.5 flex-1">
        <span className="text-[8px] uppercase tracking-widest text-[#7C808A] block">
          {receipt.category}
        </span>
        <h4 className="text-xs font-bold text-[#141519] leading-snug line-clamp-2">
          {receipt.title}
        </h4>
        {receipt.subtitle && (
          <p className="text-[11px] text-[#4E515B] italic font-serif line-clamp-1">
            {receipt.subtitle}
          </p>
        )}

        {receipt.location?.context && (
          <p className="text-[9px] text-[#636670] truncate pt-1">
            📍 {receipt.location.city ? `${receipt.location.city} • ` : ''}
            {receipt.location.context}
          </p>
        )}
      </div>

      {/* Amount / Metric Bar */}
      <div className="border-t border-dashed border-[#A8A395] pt-2 mt-auto">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[9px] text-[#555861] uppercase">VALUE</span>
          {receipt.amount != null ? (
            <span className="font-mono text-sm font-extrabold text-[#141519]">
              ₹{receipt.amount.toLocaleString('en-IN')}
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-[10px] text-[#22242B]">
              <Music className="h-3 w-3 inline mr-0.5" />
              <span>{receipt.metadata?.durationFormatted || 'Played'}</span>
            </span>
          )}
        </div>

        {/* Rubber Stamp Status */}
        <div className="mt-2 text-center">
          {isFraud ? (
            <span className="inline-block border border-red-700 bg-red-100 px-2 py-0.5 text-[8px] font-bold tracking-widest text-red-700 uppercase -rotate-1">
              SECURITY ALERT
            </span>
          ) : (
            <span className="inline-block border border-[#5A6E48] bg-[#EEF4E8] px-2 py-0.5 text-[8px] font-bold tracking-widest text-[#3E522C] uppercase rotate-1">
              VERIFIED RECORD
            </span>
          )}
        </div>
      </div>

      {/* Bottom Perforation Edge */}
      <div className="absolute -bottom-1.5 left-0 right-0 flex justify-between overflow-hidden opacity-50 select-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <span key={i} className="text-[#C8C3B4] text-[7px]">▼</span>
        ))}
      </div>
    </div>
  );
};
