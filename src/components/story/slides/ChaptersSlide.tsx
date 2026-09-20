/**
 * SLIDE 6: CHAPTERS SLIDE
 * Displays the 5 serialized chronological chapters across the 11.4-year ledger.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { BookOpen, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ChaptersSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
}

export const ChaptersSlide: React.FC<ChaptersSlideProps> = ({
  step,
  onInspectEvidence,
}) => {
  const chapters = step.payload?.chapters || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center space-x-2 border border-archival-amber/30 bg-archival-amber/5 px-3 py-0.5 text-[10px] font-mono text-archival-amber"
        >
          <BookOpen className="h-3 w-3" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        <p className="text-base sm:text-lg font-serif italic text-archival-amber">
          {step.leadQuote}
        </p>
      </div>

      {/* Chronological Chapters Timeline Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
        {chapters.slice(0, 4).map((ch, idx) => (
          <motion.div
            key={ch.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (idx + 1) }}
            className="border border-white/[0.08] bg-[#0F1117] p-4 flex flex-col justify-between hover:border-archival-amber/40 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono border border-white/10 px-1.5 py-0.5 text-museum-muted">
                  ERA 0{ch.number}
                </span>
                <span className="text-[10px] font-mono text-archival-amber">
                  {ch.dateRange.formatted.split('–')[0]}
                </span>
              </div>

              <h4 className="text-xs font-bold font-mono text-white line-clamp-2">
                {ch.title}
              </h4>

              <p className="text-[11px] font-serif text-museum-muted italic line-clamp-2">
                {ch.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] space-y-1 text-[10px] font-mono">
              <div className="flex justify-between text-museum-muted">
                <span>Key Domain:</span>
                <span className="text-white truncate max-w-[110px]">
                  {ch.dominantCategories[0]}
                </span>
              </div>
              <div className="flex justify-between text-museum-muted">
                <span>Metric:</span>
                <span className="text-archival-amber truncate max-w-[110px]">
                  {ch.supportingMetrics[0]?.value || '100% Verified'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Master Synthesis Chapter Callout */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-archival-amber/40 bg-archival-amber/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 text-archival-amber font-bold">
              CHAPTER 05 // GRAND SYNTHESIS
            </span>
            <span className="text-xs font-mono text-museum-muted">2013 – 2024 (11.4 Years)</span>
          </div>
          <p className="text-xs font-serif text-[#FAF8F5]">
            162,000+ artifacts harmonized across all 4 operational regimes into a unified digital life ledger.
          </p>
        </div>

        <button
          onClick={onInspectEvidence}
          className="inline-flex items-center space-x-1.5 border border-archival-amber bg-archival-amber px-3.5 py-1.5 text-[11px] font-mono font-bold text-[#08090C] hover:bg-archival-amber-bright transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>INSPECT ERA EVIDENCE ({step.supportingReceipts.length})</span>
        </button>
      </motion.div>
    </div>
  );
};
