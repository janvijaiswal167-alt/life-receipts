/**
 * SLIDE 7: FINAL SUMMARY SLIDE
 * Displays the final Master Grand Life Receipt, concluding with the exact ending statement:
 * "Your receipts tell a story. Explore the evidence."
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { ArchivalReceipt } from '../../museum/ArchivalReceipt';
import { ScrollText, Layers, GitMerge, Printer, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

interface SummarySlideProps {
  step: StorySlideStep;
  onExploreReceipts: () => void;
  onExploreGraph: () => void;
  onPrintMasterReceipt: () => void;
  onReplayStory: () => void;
  onInspectEvidence: () => void;
}

export const SummarySlide: React.FC<SummarySlideProps> = ({
  step,
  onExploreReceipts,
  onExploreGraph,
  onPrintMasterReceipt,
  onReplayStory,
  onInspectEvidence,
}) => {
  const decadeChapter = step.payload?.decadeChapter;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center space-x-2 border border-archival-amber/40 bg-archival-amber/10 px-3.5 py-0.5 text-[10px] font-mono text-archival-amber"
        >
          <ScrollText className="h-3.5 w-3.5" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        {/* Prominent Ending Quote Required by Prompt */}
        <p className="text-xl sm:text-2xl font-serif italic text-archival-amber tracking-tight font-medium">
          "Your receipts tell a story. Explore the evidence."
        </p>
      </div>

      {/* Main Dual Grid: Curatorial Synthesis & Master Life Thermal Receipt */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        {/* Left Column: Curatorial Synthesis & Telemetry (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-4"
        >
          {/* Synthesis Card */}
          <div className="border border-white/[0.08] bg-[#0F1117] p-5 sm:p-6 space-y-4">
            <div className="border-b border-white/[0.06] pb-3">
              <span className="text-[10px] font-mono text-archival-amber uppercase tracking-widest">
                FINAL SYNTHESIS MONOGRAPH
              </span>
              <h3 className="mt-1 text-xl font-serif text-white tracking-tight">
                Eleven Years of Living Grounded in Evidence
              </h3>
            </div>

            <div className="text-xs sm:text-sm font-serif leading-relaxed text-[#D6D2C4] space-y-3">
              <p>
                From Android mobile audio streams in 2013 to disciplined morning chai routines, Sevagram Express train berths, and first-week mutual fund investments, every row in this life ledger is grounded in real empirical evidence.
              </p>
              <p className="text-xs text-museum-muted italic">
                Zero synthetic placeholders. 100% explainable, deterministic provenance across 162,000+ records.
              </p>
            </div>

            {/* Metrics 4-Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {step.metrics?.map((m, idx) => (
                <div key={idx} className="border border-white/[0.06] bg-[#0A0C10] p-3">
                  <span className="text-[9px] font-mono text-museum-muted uppercase block">
                    {m.label}
                  </span>
                  <p className="text-base font-bold font-mono text-white mt-0.5">
                    {m.value}
                  </p>
                  {m.sublabel && (
                    <p className="text-[10px] font-serif italic text-museum-muted mt-0.5">
                      {m.sublabel}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={onExploreReceipts}
                className="inline-flex items-center justify-center space-x-2 border border-archival-amber bg-archival-amber p-3 text-xs font-mono font-bold text-[#08090C] hover:bg-archival-amber-bright transition-all shadow-glow-amber-subtle cursor-pointer"
              >
                <Layers className="h-4 w-4" />
                <span>EXPLORE RECEIPTS TIMELINE</span>
              </button>

              <button
                onClick={onExploreGraph}
                className="inline-flex items-center justify-center space-x-2 border border-white/20 bg-[#0F1117] p-3 text-xs font-mono text-museum-text hover:text-white hover:border-archival-amber transition-all cursor-pointer"
              >
                <GitMerge className="h-4 w-4 text-archival-amber" />
                <span>EXPLORE LIFE GRAPH</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                onClick={onPrintMasterReceipt}
                className="inline-flex items-center space-x-1.5 border border-white/10 bg-[#0F1117] px-3 py-2 text-[11px] font-mono text-museum-muted hover:text-white hover:border-white/30 transition-all cursor-pointer"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>PRINT MASTER LIFE RECEIPT</span>
              </button>

              <button
                onClick={onReplayStory}
                className="inline-flex items-center space-x-1.5 border border-white/10 bg-[#0F1117] px-3 py-2 text-[11px] font-mono text-museum-muted hover:text-white hover:border-white/30 transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>REPLAY STORY</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Physical Master Thermal Receipt Artifact (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-5 flex justify-center"
        >
          {decadeChapter && (
            <div className="w-full max-w-sm">
              <ArchivalReceipt chapter={decadeChapter} />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
