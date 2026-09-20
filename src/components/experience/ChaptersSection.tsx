import React, { useState, useMemo } from 'react';
import { LifeReceipt } from '../../types/receipt';
import { LifeChapter } from '../../types/chapters';
import { discoverLifeChapters } from '../../engine/chaptersEngine';
import { ChapterCard } from './ChapterCard';
import { ChapterDetailModal } from './ChapterDetailModal';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import {
  BookOpen,
  Calendar,
  Activity,
  CheckCircle2,
  Sparkles,
  Link2,
  Receipt,
  Maximize2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ChaptersSectionProps {
  receipts?: LifeReceipt[];
  chapters?: any[];
  onSelectReceipt?: (r: LifeReceipt) => void;
  onSelectStoryView?: (chapter: any) => void;
}

type InlineChapterTab = 'activity' | 'evidence' | 'moments' | 'connections' | 'receipts';

export const ChaptersSection: React.FC<ChaptersSectionProps> = ({
  receipts = [],
  onSelectReceipt = () => {},
  onSelectStoryView,
}) => {
  // Generate authentic serialized chapters from normalized receipts
  const dynamicChapters: LifeChapter[] = useMemo(() => {
    if (receipts && receipts.length > 0) {
      return discoverLifeChapters(receipts);
    }
    return [];
  }, [receipts]);

  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [activeInlineTab, setActiveInlineTab] = useState<InlineChapterTab>('activity');
  const [detailModalChapter, setDetailModalChapter] = useState<LifeChapter | null>(null);

  const activeChapter = dynamicChapters[selectedChapterIndex] || dynamicChapters[0];

  if (!activeChapter) return null;

  return (
    <section id="chapters" className="space-y-8 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase bg-archival-amber/10 border border-archival-amber/20 px-2.5 py-0.5 rounded">
              SECTION 06 // SERIALIZED LIFE CHAPTERS
            </span>
            <span className="text-[10px] font-mono text-museum-muted">
              {dynamicChapters.length} HISTORICAL REGIMES
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-2 flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-archival-amber" />
            <span>6. CHAPTERS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted max-w-lg leading-relaxed">
          Meaningful chronological periods identified automatically by empirical inflection points and activity pattern changes.
        </p>
      </div>

      {/* Chapter Cards Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {dynamicChapters.map((chap, idx) => (
          <ChapterCard
            key={chap.id}
            chapter={chap}
            isSelected={idx === selectedChapterIndex}
            onSelect={() => {
              setSelectedChapterIndex(idx);
              setActiveInlineTab('activity');
            }}
            onOpenDetails={(c) => setDetailModalChapter(c)}
          />
        ))}
      </div>

      {/* Active Chapter Inline Vitrine */}
      <div className="border border-white/[0.08] bg-[#0E1118] rounded-lg p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
              <span className="px-2.5 py-1 rounded bg-archival-amber/15 text-archival-amber border border-archival-amber/30 uppercase font-semibold">
                CHAPTER 0{activeChapter.number} // {activeChapter.badge || 'LIFECYCLE PERIOD'}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/80">
                {activeChapter.dateRange.formatted}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {activeChapter.title}
            </h3>

            <p className="text-xs font-serif italic text-museum-muted max-w-2xl leading-relaxed">
              {activeChapter.subtitle}
            </p>

            <p className="text-xs font-serif leading-relaxed text-[#D6D2C4] pt-2 max-w-3xl">
              {activeChapter.narrativeOverview}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setDetailModalChapter(activeChapter)}
              className="px-4 py-2.5 bg-archival-amber/15 hover:bg-archival-amber text-archival-amber hover:text-black border border-archival-amber/40 text-xs font-mono rounded transition-all flex items-center justify-center space-x-2 font-semibold shadow-sm"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Explore Full Chapter Dossier</span>
            </button>
          </div>
        </div>

        {/* Inline Sub-Tabs (Activity, Evidence Statements, Moments, Connections, Receipts) */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveInlineTab('activity')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeInlineTab === 'activity'
                ? 'bg-archival-amber text-black font-bold'
                : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Activity & Metrics</span>
          </button>

          <button
            onClick={() => setActiveInlineTab('evidence')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeInlineTab === 'evidence'
                ? 'bg-archival-amber text-black font-bold'
                : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Evidence Statements ({activeChapter.evidenceStatements.length})</span>
          </button>

          <button
            onClick={() => setActiveInlineTab('moments')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeInlineTab === 'moments'
                ? 'bg-archival-amber text-black font-bold'
                : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Moments ({activeChapter.importantMoments.length})</span>
          </button>

          <button
            onClick={() => setActiveInlineTab('connections')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeInlineTab === 'connections'
                ? 'bg-archival-amber text-black font-bold'
                : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Connections ({activeChapter.importantConnections.length})</span>
          </button>

          <button
            onClick={() => setActiveInlineTab('receipts')}
            className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
              activeInlineTab === 'receipts'
                ? 'bg-archival-amber text-black font-bold'
                : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:text-white'
            }`}
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Evidence Receipts ({activeChapter.evidenceReceipts.length})</span>
          </button>
        </div>

        {/* INLINE TAB CONTENT */}
        {activeInlineTab === 'activity' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              {activeChapter.supportingMetrics.map((metric, i) => (
                <div key={i} className="p-3 bg-[#141722] border border-white/10 rounded">
                  <span className="text-[9px] text-museum-muted uppercase block">{metric.label}</span>
                  <p className="text-base font-bold text-archival-amber mt-0.5 truncate">{metric.value}</p>
                  {metric.sublabel && (
                    <span className="text-[10px] text-museum-muted block mt-0.5 truncate">{metric.sublabel}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Dominant Category Activity Distribution */}
            {activeChapter.activityBreakdown && activeChapter.activityBreakdown.length > 0 && (
              <div className="p-4 bg-[#12151E] border border-white/10 rounded-lg space-y-3">
                <span className="text-xs font-mono uppercase tracking-widest text-museum-muted block">
                  DOMINANT CATEGORY CONCENTRATION
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeChapter.activityBreakdown.slice(0, 4).map((act, idx) => (
                    <div key={idx} className="p-3 bg-[#161925] border border-white/[0.06] rounded font-mono text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold">{act.category}</span>
                        <span className="text-archival-amber font-bold">{act.count} ({act.percentage})</span>
                      </div>
                      {act.formattedSpend && (
                        <span className="text-[10px] text-emerald-400 block">{act.formattedSpend} spend</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeInlineTab === 'evidence' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 bg-black/40 border-l-3 border-archival-amber rounded-r space-y-2">
              <span className="font-mono text-[10px] text-archival-amber uppercase not-italic tracking-wider font-semibold block">
                EMPIRICAL EVIDENCE OBSERVATIONS
              </span>
              <ul className="space-y-2 text-xs font-serif text-[#E5E2D9] list-disc list-inside leading-relaxed">
                {activeChapter.evidenceStatements.map((stmt, idx) => (
                  <li key={idx} className="pl-1">
                    {stmt}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeInlineTab === 'moments' && (
          <div className="space-y-3 animate-fadeIn">
            {activeChapter.importantMoments.length === 0 ? (
              <p className="text-xs font-mono text-museum-muted italic">No isolated pivotal moments in this slice.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeChapter.importantMoments.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => onSelectReceipt(m.receipt)}
                    className="p-4 bg-[#141722] border border-white/10 hover:border-archival-amber rounded-lg space-y-1.5 cursor-pointer transition-colors font-mono"
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

        {activeInlineTab === 'connections' && (
          <div className="space-y-3 animate-fadeIn">
            {activeChapter.importantConnections.length === 0 ? (
              <p className="text-xs font-mono text-museum-muted italic">No cross-dataset connections within this single era.</p>
            ) : (
              <div className="space-y-3">
                {activeChapter.importantConnections.map((c) => (
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

        {activeInlineTab === 'receipts' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[10px] font-mono text-white uppercase tracking-widest font-semibold">
                CHAPTER EXHIBITS ({activeChapter.evidenceReceipts.length} RECEIPTS)
              </span>
              <span className="text-[10px] font-mono text-museum-muted">
                Click any receipt to open full record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChapter.evidenceReceipts.map(r => (
                <MuseumReceiptCard
                  key={r.id}
                  receipt={r}
                  onSelect={onSelectReceipt}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chapter Detail Full Modal */}
      <ChapterDetailModal
        chapter={detailModalChapter}
        onClose={() => setDetailModalChapter(null)}
        onSelectReceipt={onSelectReceipt}
      />
    </section>
  );
};
