import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { LifeMoment } from '../../types/moments';
import { Milestone, Sparkles, Layers, Clock } from 'lucide-react';

export interface MomentNodeData {
  moment: LifeMoment;
  isSelected?: boolean;
  isConnected?: boolean;
  isDimmed?: boolean;
}

export const MomentNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as MomentNodeData;
  const { moment, isSelected, isConnected, isDimmed } = nodeData;

  if (!moment) return null;

  let borderStyle = 'border-archival-amber/40 bg-[#12141D]';
  if (isSelected || selected) {
    borderStyle = 'border-archival-amber bg-[#181B26] shadow-glow-amber-subtle ring-2 ring-archival-amber';
  } else if (isConnected) {
    borderStyle = 'border-archival-amber/80 bg-[#151822] shadow-md';
  }

  const opacityClass = isDimmed ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100';

  return (
    <div
      className={`w-72 border-2 p-3.5 font-mono text-xs transition-all duration-200 cursor-pointer shadow-lg ${borderStyle} ${opacityClass}`}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-archival-amber !w-2.5 !h-2.5 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-archival-amber !w-2.5 !h-2.5 !border-0" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-archival-amber !w-2.5 !h-2.5 !border-0" />
      <Handle type="source" position={Position.Right} id="right" className="!bg-archival-amber !w-2.5 !h-2.5 !border-0" />

      {/* Header Tag */}
      <div className="flex items-center justify-between text-[9px] mb-1.5">
        <span className="flex items-center space-x-1 border border-archival-amber/60 bg-archival-amber/20 px-1.5 py-0.5 text-archival-amber font-bold uppercase">
          <Milestone className="h-2.5 w-2.5" />
          <span>{moment.badge}</span>
        </span>

        <span className="border border-emerald-800 bg-emerald-950/50 px-1.5 py-0.2 text-emerald-300 font-bold text-[9px]">
          {moment.connectionScore}/100
        </span>
      </div>

      {/* Episode Title */}
      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
        {moment.title}
      </h4>

      {/* Time & Count */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[9px] text-museum-muted">
        <span className="flex items-center space-x-1">
          <Clock className="h-2.5 w-2.5 text-archival-amber" />
          <span className="truncate max-w-[130px]">{moment.timeRange.formattedSpan.split('•')[0]}</span>
        </span>

        <span className="flex items-center space-x-1 border border-white/10 px-1 py-0.2 bg-[#1C1F2B] text-white">
          <Layers className="h-2.5 w-2.5 text-archival-amber" />
          <span>{moment.receipts.length} RECORDS</span>
        </span>
      </div>
    </div>
  );
};
