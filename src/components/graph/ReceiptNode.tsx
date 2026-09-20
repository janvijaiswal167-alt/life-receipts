import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { LifeReceipt } from '../../types/receipt';
import { Music, MapPin, AlertOctagon, IndianRupee, Clock, ArrowUpRight } from 'lucide-react';

export interface ReceiptNodeData {
  receipt: LifeReceipt;
  isSelected?: boolean;
  isConnected?: boolean;
  isDimmed?: boolean;
  onSelectReceipt?: (r: LifeReceipt) => void;
}

export const ReceiptNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as ReceiptNodeData;
  const { receipt, isSelected, isConnected, isDimmed, onSelectReceipt } = nodeData;

  if (!receipt) return null;

  const isAudio = receipt.source === 'spotify';
  const isHousehold = receipt.source === 'household';
  const isCommerce = receipt.source === 'commerce';
  const isFraud = receipt.metadata?.isFraud === true;

  const sourceBadge = {
    spotify: 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300',
    household: 'border-amber-800/60 bg-amber-950/40 text-amber-300',
    commerce: 'border-blue-800/60 bg-blue-950/40 text-blue-300',
  }[receipt.source];

  let borderStyle = 'border-white/[0.12] bg-[#0F1117]';
  if (isSelected || selected) {
    borderStyle = 'border-archival-amber bg-[#151821] shadow-glow-amber-subtle ring-1 ring-archival-amber';
  } else if (isConnected) {
    borderStyle = 'border-archival-amber/70 bg-[#12151E] shadow-sm';
  }

  const opacityClass = isDimmed ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100';

  return (
    <div
      className={`w-60 border p-3 font-mono text-xs transition-all duration-200 cursor-pointer ${borderStyle} ${opacityClass}`}
    >
      {/* Handles for Flow connections */}
      <Handle type="target" position={Position.Top} className="!bg-archival-amber !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-archival-amber !w-2 !h-2 !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-archival-amber !w-2 !h-2 !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-archival-amber !w-2 !h-2 !border-0" />

      {/* Header Tag */}
      <div className="flex items-center justify-between text-[9px] mb-1.5">
        <span className={`border px-1.5 py-0.2 uppercase font-bold ${sourceBadge}`}>
          {receipt.source}
        </span>
        <span className="text-museum-muted flex items-center space-x-1 text-[9px]">
          <Clock className="h-2.5 w-2.5" />
          <span>{receipt.dateStr}</span>
        </span>
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-0.5 my-1">
        <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
          {receipt.title}
        </h4>
        {receipt.subtitle && (
          <p className="text-[10px] text-museum-muted italic font-serif line-clamp-1">
            {receipt.subtitle}
          </p>
        )}
      </div>

      {/* Metric / Category Line */}
      <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[10px]">
        {receipt.amount != null ? (
          <span className="font-bold text-white flex items-center space-x-0.5">
            <span>₹{receipt.amount.toLocaleString('en-IN')}</span>
          </span>
        ) : (
          <span className="text-emerald-300 flex items-center space-x-1 text-[9px]">
            <Music className="h-2.5 w-2.5" />
            <span>{receipt.metadata?.durationFormatted || 'Played'}</span>
          </span>
        )}

        {isFraud && (
          <span className="flex items-center space-x-1 border border-red-800 bg-red-950/50 px-1 text-[8px] text-red-300 font-bold">
            <AlertOctagon className="h-2 w-2" />
            <span>FLAG</span>
          </span>
        )}

        <span className="text-[9px] text-museum-faint truncate max-w-[90px]">
          {receipt.category}
        </span>
      </div>
    </div>
  );
};
