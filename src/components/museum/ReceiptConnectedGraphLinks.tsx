/**
 * RECEIPT CONNECTED GRAPH LINKS
 * Renders the bidirectional relationships for any selected receipt:
 * - Related Moments
 * - Cross-Dataset Connections
 * - Discovered Patterns
 * - Chapter Era
 */

import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { LifeMoment } from '../../types/moments';
import { CrossConnection } from '../../engine/patternEngine';
import { LifePattern } from '../../types/patterns';
import { LifeChapter } from '../../types/chapters';
import {
  Layers,
  GitMerge,
  Sparkles,
  BookOpen,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ReceiptConnectedGraphLinksProps {
  receipt: LifeReceipt;
  contextualLinks: {
    moments: LifeMoment[];
    connections: CrossConnection[];
    patterns: LifePattern[];
    chapter?: LifeChapter;
  };
  onSelectMoment?: (m: LifeMoment) => void;
  onSelectConnection?: (c: CrossConnection) => void;
  onSelectPattern?: (p: LifePattern) => void;
  onSelectChapter?: (ch: LifeChapter) => void;
}

export const ReceiptConnectedGraphLinks: React.FC<ReceiptConnectedGraphLinksProps> = ({
  receipt,
  contextualLinks,
  onSelectMoment,
  onSelectConnection,
  onSelectPattern,
  onSelectChapter,
}) => {
  const { moments, connections, patterns, chapter } = contextualLinks;
  const hasAny = moments.length > 0 || connections.length > 0 || patterns.length > 0 || chapter;

  if (!hasAny) return null;

  return (
    <div className="mt-6 pt-5 border-t border-dashed border-[#A8A395] space-y-4 font-mono text-left">
      <div className="flex items-center space-x-2 text-[10px] text-archival-amber uppercase tracking-widest font-bold">
        <GitMerge className="h-3.5 w-3.5 text-archival-amber" />
        <span>CONNECTED LIFE GRAPH CONTEXT</span>
      </div>

      <div className="space-y-3">
        {/* 1. Related Moments */}
        {moments.length > 0 && (
          <div className="border border-white/10 bg-[#0F1117] p-3 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-museum-muted flex items-center space-x-1.5">
              <Layers className="h-3 w-3 text-archival-amber" />
              <span>CONNECTED MOMENTS ({moments.length})</span>
            </span>
            <div className="space-y-1.5">
              {moments.map(m => (
                <div
                  key={m.id}
                  onClick={() => onSelectMoment?.(m)}
                  className="flex items-center justify-between p-2 bg-[#151821] border border-white/5 hover:border-archival-amber/50 hover:bg-[#1A1E29] transition-all cursor-pointer group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-archival-amber transition-colors truncate block">
                      {m.title}
                    </span>
                    <span className="text-[10px] text-museum-muted italic font-serif">
                      Score: {m.connectionScore}/100 • {m.timeRange.formattedSpan}
                    </span>
                  </div>
                  <span className="text-[10px] text-archival-amber flex items-center flex-shrink-0">
                    <span>Explore</span>
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Cross-Dataset Connections */}
        {connections.length > 0 && (
          <div className="border border-white/10 bg-[#0F1117] p-3 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-museum-muted flex items-center space-x-1.5">
              <GitMerge className="h-3 w-3 text-emerald-400" />
              <span>CROSS-DATASET SYNCS ({connections.length})</span>
            </span>
            <div className="space-y-1.5">
              {connections.map(c => (
                <div
                  key={c.id}
                  onClick={() => onSelectConnection?.(c)}
                  className="flex items-center justify-between p-2 bg-[#151821] border border-white/5 hover:border-emerald-500/50 hover:bg-[#1A1E29] transition-all cursor-pointer group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate block">
                      {c.title}
                    </span>
                    <span className="text-[10px] text-museum-muted italic font-serif">
                      {c.category} • {c.era}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center flex-shrink-0">
                    <span>Inspect Pair</span>
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Discovered Patterns */}
        {patterns.length > 0 && (
          <div className="border border-white/10 bg-[#0F1117] p-3 space-y-2">
            <span className="text-[9px] uppercase tracking-widest text-museum-muted flex items-center space-x-1.5">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>SUPPORTING EVIDENCE FOR PATTERNS ({patterns.length})</span>
            </span>
            <div className="space-y-1.5">
              {patterns.map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectPattern?.(p)}
                  className="flex items-center justify-between p-2 bg-[#151821] border border-white/5 hover:border-cyan-500/50 hover:bg-[#1A1E29] transition-all cursor-pointer group"
                >
                  <div className="truncate pr-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate block">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-museum-muted italic font-serif">
                      {p.stats.count} occurrences • {p.confidence}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 flex items-center flex-shrink-0">
                    <span>View Dossier</span>
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Life Chapter */}
        {chapter && (
          <div
            onClick={() => onSelectChapter?.(chapter)}
            className="border border-archival-amber/30 bg-[#0F1117] p-3 flex items-center justify-between hover:border-archival-amber hover:bg-[#151821] transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-2.5">
              <BookOpen className="h-4 w-4 text-archival-amber flex-shrink-0" />
              <div>
                <span className="text-[9px] text-museum-muted uppercase tracking-widest block">
                  CHRONOLOGICAL ERA // CHAPTER 0{chapter.number}
                </span>
                <span className="text-xs font-bold text-white group-hover:text-archival-amber transition-colors">
                  {chapter.title} ({chapter.dateRange.formatted})
                </span>
              </div>
            </div>

            <span className="text-[10px] text-archival-amber flex items-center flex-shrink-0">
              <span>Chapter</span>
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
