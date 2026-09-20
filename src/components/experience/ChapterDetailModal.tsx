import React, { useState, useMemo } from 'react';
import { LifeChapter } from '../../types/chapters';
import { LifeReceipt } from '../../types/receipt';
import { LifePattern } from '../../types/patterns';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  Activity,
  Sparkles,
  Link2,
  Receipt,
  CheckCircle2,
  TrendingUp,
  Zap,
  ArrowUpRight,
} from 'lucide-react';

interface ChapterDetailModalProps {
  chapter: LifeChapter | null;
  onClose: () => void;
  onSelectReceipt: (r: LifeReceipt) => void;
  allPatterns?: LifePattern[];
  onSelectPattern?: (p: LifePattern) => void;
  onSelectMoment?: (m: any) => void;
}

type ChapterTab = 'activity' | 'evidence' | 'moments' | 'patterns' | 'connections';

export const ChapterDetailModal: React.FC<ChapterDetailModalProps> = ({
  chapter,
  onClose,
  onSelectReceipt,
  allPatterns = [],
  onSelectPattern,
  onSelectMoment,
}) => {
  const [activeTab, setActiveTab] = useState<ChapterTab>('activity');

  // Filter patterns matching this chapter's era or dominant categories
  const chapterPatterns = useMemo(() => {
    if (!chapter) return [];
    return allPatterns.filter(p => {
      if (p.era && (p.era.includes(String(chapter.dateRange.yearStart)) || p.era.includes(String(chapter.dateRange.yearEnd)))) {
        return true;
      }
      return chapter.dominantCategories.includes(p.category as any);
    });
  }, [chapter, allPatterns]);

  if (!chapter) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0D0F15] border border-white/15 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#12151E]">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest bg-archival-amber/15 text-archival-amber border border-archival-amber/30 rounded font-semibold">
              CHAPTER 0{chapter.number} // {chapter.badge || 'HISTORICAL REGIME'}
            </span>
            <span className="text-xs font-mono text-museum-muted">
              {chapter.dateRange.formatted}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-museum-muted hover:text-white rounded hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          {/* Chapter Main Title */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-archival-amber rounded">
                {chapter.dateRange.formatted}
              </span>
              <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/80 rounded">
                {chapter.dominantCategories.join(' • ')}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              {chapter.title}
            </h2>

            <p className="text-sm font-serif italic text-museum-muted leading-relaxed">
              {chapter.subtitle}
            </p>

            <p className="text-xs font-serif leading-relaxed text-[#D6D2C4] pt-2 border-t border-white/[0.06]">
              {chapter.narrativeOverview}
            </p>
          </div>

          {/* Interactive Chapter Sub-Tabs */}
          <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'activity'
                  ? 'bg-archival-amber text-black font-bold'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>1. Activity & Metrics</span>
            </button>

            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'evidence'
                  ? 'bg-archival-amber text-black font-bold'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>2. Evidence Statements ({chapter.evidenceStatements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('moments')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'moments'
                  ? 'bg-archival-amber text-black font-bold'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>3. Moments ({chapter.importantMoments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'patterns'
                  ? 'bg-archival-amber text-black font-bold'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>4. Patterns ({chapterPatterns.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('connections')}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-all flex items-center space-x-1.5 ${
                activeTab === 'connections'
                  ? 'bg-archival-amber text-black font-bold'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
              }`}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>5. Connections ({chapter.importantConnections.length})</span>
            </button>
          </div>

          {/* TAB 1: ACTIVITY & METRICS */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Key Supporting Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                {chapter.supportingMetrics.map((metric, i) => (
                  <div key={i} className="p-3.5 bg-[#141722] border border-white/10 rounded">
                    <span className="text-[9px] text-museum-muted uppercase tracking-wider block">
                      {metric.label}
                    </span>
                    <span className="text-base font-bold text-archival-amber mt-1 block truncate">
                      {metric.value}
                    </span>
                    {metric.sublabel && (
                      <span className="text-[10px] text-museum-muted mt-0.5 block truncate">
                        {metric.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Activity Distribution Breakdown */}
              {chapter.activityBreakdown && chapter.activityBreakdown.length > 0 && (
                <div className="space-y-3 p-4 bg-[#12151E] border border-white/10 rounded-lg">
                  <span className="text-xs font-mono uppercase tracking-widest text-museum-muted block">
                    DOMINANT CATEGORY DISTRIBUTION
                  </span>
                  <div className="space-y-2">
                    {chapter.activityBreakdown.slice(0, 5).map((act, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-white/90 font-medium">{act.category}</span>
                          <span className="text-archival-amber font-semibold">
                            {act.count} receipts ({act.percentage})
                            {act.formattedSpend ? ` • ${act.formattedSpend}` : ''}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-black/50 rounded overflow-hidden">
                          <div
                            className="h-full bg-archival-amber/80 rounded"
                            style={{ width: act.percentage }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EVIDENCE STATEMENTS & SUPPORTING RECEIPTS */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Evidence Statements Bulleted Box */}
              <div className="p-5 bg-black/40 border-l-4 border-archival-amber rounded-r space-y-3">
                <div className="flex items-center space-x-2 text-xs font-mono text-archival-amber uppercase tracking-widest font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  <span>FACTUAL EVIDENCE STATEMENTS (NO PSYCHOLOGICAL CLAIMS)</span>
                </div>
                <ul className="space-y-2 text-xs font-serif text-[#E5E2D9] list-disc list-inside leading-relaxed">
                  {chapter.evidenceStatements.map((stmt, idx) => (
                    <li key={idx} className="pl-1">
                      {stmt}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Evidence Receipts Gallery */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-white font-semibold">
                    EVIDENCE RECEIPTS ({chapter.evidenceReceipts.length} EXHIBITS)
                  </span>
                  <span className="text-[10px] font-mono text-museum-muted">
                    Click any receipt to open full record
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {chapter.evidenceReceipts.map((r) => (
                    <MuseumReceiptCard
                      key={r.id}
                      receipt={r}
                      onSelect={onSelectReceipt}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORTANT MOMENTS */}
          {activeTab === 'moments' && (
            <div className="space-y-3 animate-fadeIn">
              {chapter.importantMoments.length === 0 ? (
                <p className="text-xs font-mono text-museum-muted italic">No isolated pivotal moments logged in this slice.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chapter.importantMoments.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onSelectReceipt(m.receipt)}
                      className="p-4 bg-[#141722] border border-white/10 hover:border-archival-amber rounded-lg space-y-2 cursor-pointer transition-colors font-mono"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-archival-amber/15 text-archival-amber font-semibold">
                          {m.badge}
                        </span>
                        <span className="text-museum-muted">{m.dateStr}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-serif">{m.title}</h4>
                      <p className="text-xs font-serif italic text-museum-muted">{m.significance}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOMINANT PATTERNS IN THIS ERA */}
          {activeTab === 'patterns' && (
            <div className="space-y-3 animate-fadeIn">
              {chapterPatterns.length === 0 ? (
                <p className="text-xs font-mono text-museum-muted italic">No isolated behavioral archetypes categorized for this slice.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chapterPatterns.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onSelectPattern?.(p)}
                      className="p-4 bg-[#141722] border border-white/10 hover:border-archival-amber rounded-lg space-y-2 cursor-pointer transition-colors font-mono group"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="px-2 py-0.5 rounded bg-archival-amber/15 text-archival-amber font-semibold uppercase">
                          {p.patternType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-emerald-400 font-bold">{p.confidence}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-serif group-hover:text-archival-amber transition-colors">
                        {p.title}
                      </h4>
                      <p className="text-xs font-serif italic text-museum-muted line-clamp-2">
                        {p.summary}
                      </p>
                      <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                        <span className="text-white font-bold">{p.stats.count} occurrences</span>
                        <span className="text-archival-amber flex items-center">
                          <span>Inspect Pattern</span>
                          <ArrowUpRight className="h-3 w-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: IMPORTANT CONNECTIONS */}
          {activeTab === 'connections' && (
            <div className="space-y-3 animate-fadeIn">
              {chapter.importantConnections.length === 0 ? (
                <p className="text-xs font-mono text-museum-muted italic">No cross-dataset connections within this single era.</p>
              ) : (
                <div className="space-y-3">
                  {chapter.importantConnections.map((c) => (
                    <div key={c.id} className="p-4 bg-[#141722] border border-white/10 rounded-lg space-y-2 font-mono">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-archival-amber uppercase font-semibold">{c.category}</span>
                        <span className="text-museum-muted">{c.era}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white font-serif">{c.title}</h4>
                      <p className="text-xs font-serif italic text-[#D6D2C4]">{c.insight}</p>
                      <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                        <button
                          onClick={() => onSelectReceipt(c.receiptA)}
                          className="text-[10px] text-archival-amber hover:underline"
                        >
                          Exhibit A: {c.receiptA.title}
                        </button>
                        <span className="text-museum-muted">•</span>
                        <button
                          onClick={() => onSelectReceipt(c.receiptB)}
                          className="text-[10px] text-archival-amber hover:underline"
                        >
                          Exhibit B: {c.receiptB.title}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#12151E] flex items-center justify-between">
          <span className="text-xs font-mono text-museum-muted">
            Ground truth historical archive without speculation.
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono bg-white/10 hover:bg-white/20 text-white rounded border border-white/10 transition-colors"
          >
            Close Chapter Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
