import React from 'react';
import { PeriodChangeItem, ChangeDomain, ChangeDirection } from '../../types/comparisons';
import { LifeReceipt } from '../../types/receipt';
import {
  Music,
  CreditCard,
  Compass,
  Film,
  Cpu,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Receipt,
  Layers,
} from 'lucide-react';

interface ChangeCardProps {
  change: PeriodChangeItem;
  onViewReceipts: (change: PeriodChangeItem) => void;
}

const getDomainIcon = (domain: ChangeDomain) => {
  switch (domain) {
    case 'music':
      return <Music className="h-4 w-4 text-emerald-400" />;
    case 'spending':
      return <CreditCard className="h-4 w-4 text-purple-400" />;
    case 'travel':
      return <Compass className="h-4 w-4 text-blue-400" />;
    case 'entertainment':
      return <Film className="h-4 w-4 text-amber-400" />;
    case 'technology':
      return <Cpu className="h-4 w-4 text-cyan-400" />;
    case 'security':
      return <ShieldAlert className="h-4 w-4 text-rose-400" />;
    default:
      return <Layers className="h-4 w-4 text-archival-amber" />;
  }
};

const getDirectionBadge = (direction: ChangeDirection, deltaText?: string) => {
  switch (direction) {
    case 'increased':
      return (
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          <span>{deltaText || 'INCREASED'}</span>
        </span>
      );
    case 'decreased':
      return (
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <TrendingDown className="h-3 w-3" />
          <span>{deltaText || 'DECREASED'}</span>
        </span>
      );
    case 'emerged':
      return (
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300">
          <Sparkles className="h-3 w-3" />
          <span>{deltaText || 'EMERGED'}</span>
        </span>
      );
    default:
      return (
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 border border-white/20 text-white/90">
          <span>{deltaText || 'SHIFTED'}</span>
        </span>
      );
  }
};

export const ChangeCard: React.FC<ChangeCardProps> = ({ change, onViewReceipts }) => {
  return (
    <div className="border border-white/[0.08] bg-[#0F1117] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all duration-200">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono">
            {getDomainIcon(change.domain)}
            <span className="text-white/80 uppercase tracking-wider font-semibold">
              {change.categoryTag || change.domain}
            </span>
          </div>

          {getDirectionBadge(change.direction, change.delta.percentage || change.delta.directionText)}
        </div>

        <h3 className="text-base font-serif font-bold text-white tracking-tight leading-snug">
          {change.title}
        </h3>

        <p className="text-xs font-serif italic text-museum-muted leading-relaxed">
          {change.factualStatement}
        </p>
      </div>

      {/* Visual Before vs After Comparison Box */}
      <div className="p-3.5 bg-black/40 border border-white/[0.06] rounded-md grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs relative">
        {/* Before Period */}
        <div className="p-2.5 bg-[#141722] border border-white/[0.06] rounded space-y-1">
          <div className="flex items-center justify-between text-[9px] text-museum-muted uppercase tracking-wider">
            <span>BEFORE // {change.beforePeriod.timeSpan}</span>
          </div>
          <p className="text-xs font-bold text-white/90 truncate">
            {change.beforePeriod.metricValue}
          </p>
          {change.beforePeriod.sublabel && (
            <p className="text-[10px] text-museum-muted truncate">
              {change.beforePeriod.sublabel}
            </p>
          )}
        </div>

        {/* After Period */}
        <div className="p-2.5 bg-[#161B26] border border-archival-amber/20 rounded space-y-1">
          <div className="flex items-center justify-between text-[9px] text-archival-amber uppercase tracking-wider font-semibold">
            <span>AFTER // {change.afterPeriod.timeSpan}</span>
            {change.delta.percentage && (
              <span className="text-emerald-400 font-bold">{change.delta.percentage}</span>
            )}
          </div>
          <p className="text-xs font-bold text-archival-amber truncate">
            {change.afterPeriod.metricValue}
          </p>
          {change.afterPeriod.sublabel && (
            <p className="text-[10px] text-museum-muted truncate">
              {change.afterPeriod.sublabel}
            </p>
          )}
        </div>
      </div>

      {/* Footer Link to Underlying Receipts */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-museum-muted">
          <Receipt className="h-3 w-3 text-museum-muted" />
          <span>{change.underlyingReceipts.length} Supporting Receipts</span>
        </div>

        <button
          onClick={() => onViewReceipts(change)}
          className="flex items-center space-x-1 text-[11px] font-mono text-archival-amber hover:text-white transition-colors group font-semibold"
        >
          <span>Examine Receipts</span>
          <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
