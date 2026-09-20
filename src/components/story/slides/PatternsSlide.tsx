/**
 * SLIDE 3: PATTERNS SLIDE
 * Displays explainable behavioral patterns detected from the datasets.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { Sparkles, Clock, Music, PiggyBank, ArrowRight, ShieldCheck } from 'lucide-react';

interface PatternsSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
}

export const PatternsSlide: React.FC<PatternsSlideProps> = ({
  step,
  onInspectEvidence,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center space-x-2 border border-archival-amber/30 bg-archival-amber/5 px-3 py-0.5 text-[10px] font-mono text-archival-amber"
        >
          <Sparkles className="h-3 w-3" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        <p className="text-base sm:text-lg font-serif italic text-archival-amber">
          {step.leadQuote}
        </p>
      </div>

      {/* 3 Detected Pattern Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Pattern 1: Morning Chai Ritual */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-archival-amber/40 transition-colors"
        >
          <div className="flex items-center justify-between text-archival-amber">
            <Clock className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-archival-amber/30 bg-archival-amber/10 px-2 py-0.5">
              08:30 AM RITUAL
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Morning Chai & Dairy Routine
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Daily domestic sunrise cadence
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            205 morning records clustered consistently between 07:00 and 09:30 AM with fresh milk delivery and cutting tea.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-archival-amber">
            <span>Confidence: 94%</span>
            <span>205 Receipts</span>
          </div>
        </motion.div>

        {/* Pattern 2: Beatles Immersion */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <Music className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5">
              DISCOGRAPHY LOYALTY
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              The Beatles Immersion
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Sustained multi-year catalog loops
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            13,620 tracks played, representing 36.8% of all rock streams with continuous album loops on repeat.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>Dominant Artist</span>
            <span>13.6k Tracks</span>
          </div>
        </motion.div>

        {/* Pattern 3: SIP Wealth Discipline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-cyan-400">
            <PiggyBank className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5">
              FIRST-WEEK SIP
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Systematic Wealth Allocation
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Salary-triggered investment sequence
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            103 automated mutual fund and PPF transfers executed within 48 hours of monthly salary deposits.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>100% Monthly Cadence</span>
            <span>103 Transfers</span>
          </div>
        </motion.div>
      </div>

      {/* Evidence Banner */}
      <div className="border border-white/[0.08] bg-[#0A0C10] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-serif text-[#D6D2C4] leading-relaxed">
          <span className="font-mono text-white font-bold text-[10px] uppercase block">
            Evidence Validation
          </span>
          {step.evidenceHeadline}
        </div>

        <button
          onClick={onInspectEvidence}
          className="inline-flex items-center space-x-1.5 border border-white/20 bg-[#0F1117] px-3.5 py-1.5 text-[11px] font-mono text-museum-text hover:text-white hover:border-archival-amber transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>INSPECT SUPPORTING RECEIPTS ({step.supportingReceipts.length})</span>
        </button>
      </div>
    </div>
  );
};
