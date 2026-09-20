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
}

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

export const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery, onExplore }) => {
  return (
    <div
      onClick={() => onExplore(discovery)}
      className="group relative flex flex-col justify-between border border-white/[0.08] bg-[#0F1117] hover:border-archival-amber/50 hover:bg-[#131622] rounded-lg p-6 transition-all duration-300 cursor-pointer overflow-hidden space-y-4"
    >
      {/* Top Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-archival-amber transition-all duration-300" />

      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono">
          <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
            {getDiscoveryIcon(discovery.type)}
            <span className="text-white/80 uppercase tracking-wider font-semibold">
              {discovery.badge || 'SURPRISING DISCOVERY'}
            </span>
          </div>

          <span className="border border-white/10 bg-[#161925] px-2 py-0.5 text-archival-amber font-bold rounded">
            {discovery.metric}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-serif font-bold text-white group-hover:text-archival-amber transition-colors leading-snug">
          {discovery.title}
        </h3>

        {/* Evidence Box */}
        <div className="p-3 bg-black/40 border-l-2 border-archival-amber rounded-r font-serif text-xs text-[#E5E2D9] leading-relaxed">
          <span className="text-[9px] font-mono text-archival-amber uppercase not-italic tracking-wider font-semibold block mb-0.5">
            VERIFIED EVIDENCE
          </span>
          {discovery.evidence}
        </div>

        {/* Explanation */}
        <p className="text-xs font-serif italic text-museum-muted leading-relaxed">
          {discovery.explanation}
        </p>
      </div>

      {/* Footer Info & Explore Action */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-museum-muted">
        <span className="truncate max-w-[200px]">{discovery.context}</span>

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
