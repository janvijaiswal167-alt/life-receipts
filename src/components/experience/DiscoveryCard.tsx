import React from 'react';
import { LifeDiscovery, DiscoveryType } from '../../types/discoveries';
import {
  Sparkles,
  ShieldAlert,
  Disc,
  Wifi,
  Layers,
  Flame,
  Receipt,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface DiscoveryCardProps {
  discovery: LifeDiscovery;
  onExplore: (discovery: LifeDiscovery) => void;
  isSelected?: boolean;
}

const getDiscoveryTypeLabel = (type: DiscoveryType): string => {
  switch (type) {
    case 'micro_anomaly':
      return 'Micro-Anomaly';
    case 'recurring_place':
      return 'Recurring Place';
    case 'repeated_entity':
      return 'Repeated Entity';
    case 'dense_cluster':
      return 'Activity Cluster';
    case 'unexpected_sequence':
      return 'Unexpected Sequence';
    case 'strong_connection':
      return 'Strong Connection';
    default:
      return 'Discovery';
  }
};

const getDiscoveryIcon = (type: DiscoveryType) => {
  switch (type) {
    case 'micro_anomaly':
      return <Sparkles className="h-4 w-4 text-amber-300" />;
    case 'recurring_place':
      return <ShieldAlert className="h-4 w-4 text-rose-400" />;
    case 'repeated_entity':
      return <Disc className="h-4 w-4 text-emerald-400" />;
    case 'dense_cluster':
      return <Wifi className="h-4 w-4 text-cyan-400" />;
    case 'unexpected_sequence':
      return <Layers className="h-4 w-4 text-purple-400" />;
    case 'strong_connection':
      return <TrendingUp className="h-4 w-4 text-blue-400" />;
    default:
      return <Sparkles className="h-4 w-4 text-archival-amber" />;
  }
};

const DiscoveryCardComponent: React.FC<DiscoveryCardProps> = ({
  discovery,
  onExplore,
  isSelected = false,
}) => {
  return (
    <div
      onClick={() => onExplore(discovery)}
      className={`group relative flex flex-col justify-between p-5 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-archival-amber/[0.08] border-archival-amber shadow-[0_0_25px_rgba(212,163,115,0.15)]'
          : 'bg-[#0F1117] border-white/[0.08] hover:border-white/20 hover:bg-[#151821]'
      }`}
    >
      {/* Top Accent Strip */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-300 ${
          isSelected ? 'bg-archival-amber' : 'bg-transparent group-hover:bg-white/20'
        }`}
      />

      <div>
        {/* Header Metadata */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono mb-2.5">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            {getDiscoveryIcon(discovery.type)}
            <span className="text-white/80 uppercase tracking-wider font-semibold">
              {discovery.badge || getDiscoveryTypeLabel(discovery.type)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono font-bold text-archival-amber border border-archival-amber/30 px-1.5 py-0.5 rounded bg-archival-amber/10">
              SURPRISE {discovery.surpriseScore}/100
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-white group-hover:text-archival-amber transition-colors line-clamp-2 leading-snug">
          {discovery.title}
        </h3>

        {/* Metric Value */}
        <div className="mt-3 p-2.5 bg-black/40 border border-white/[0.06] rounded font-mono">
          <span className="text-[9px] text-museum-muted uppercase tracking-widest block mb-0.5">
            MEASURED ANOMALY / DISCOVERY
          </span>
          <span className="text-xs font-bold text-archival-amber tracking-tight line-clamp-1">
            {discovery.metric}
          </span>
        </div>

        {/* Explanation */}
        <p className="text-xs font-serif italic text-museum-muted mt-3 line-clamp-3 leading-relaxed">
          {discovery.explanation}
        </p>
      </div>

      {/* Footer Info & Explore Action */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-museum-muted">
        <span className="text-museum-muted truncate max-w-[160px]">
          {discovery.context}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onExplore(discovery);
          }}
          className="flex items-center space-x-1 text-[11px] font-mono text-archival-amber group-hover:text-white transition-colors font-semibold group-hover:translate-x-0.5 transform duration-200"
        >
          <span>Explore ({discovery.supportingRecords.length} Records)</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export const DiscoveryCard = React.memo(DiscoveryCardComponent);
