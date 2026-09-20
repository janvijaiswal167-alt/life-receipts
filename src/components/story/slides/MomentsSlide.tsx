/**
 * SLIDE 5: MOMENTS SLIDE
 * Displays episodic moments where multiple receipts formed a single real-world event.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { Layers, Train, Car, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

interface MomentsSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
}

export const MomentsSlide: React.FC<MomentsSlideProps> = ({
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
          <Layers className="h-3 w-3" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        <p className="text-base sm:text-lg font-serif italic text-archival-amber">
          {step.leadQuote}
        </p>
      </div>

      {/* 3 Featured Moment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Moment 1: Sevagram Express Rail Journey */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-archival-amber/40 transition-colors"
        >
          <div className="flex items-center justify-between text-archival-amber">
            <Train className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-archival-amber/30 bg-archival-amber/10 px-2 py-0.5">
              INTERCITY TRANSIT
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Sevagram Express 3AC Rail Journey
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Central Railway • Long-distance audio
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            Intercity 3AC train booking on Central Railway paired with multi-hour classic rock discography streams.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-archival-amber">
            <span>Score: 95/100</span>
            <span>4 Receipts</span>
          </div>
        </motion.div>

        {/* Moment 2: Morning Auto Commute */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <Car className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5">
              DAILY COMMUTE
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Morning Auto Commute & Headphones
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Place 2 Station corridor • Sunrise music
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            Auto-rickshaw transit fee accompanied by acoustic track streaming in the 08:30 AM morning window.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-emerald-400">
            <span>Score: 94/100</span>
            <span>4 Receipts</span>
          </div>
        </motion.div>

        {/* Moment 3: Cybersecurity Intercept */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-red-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-red-400">
            <ShieldAlert className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-red-900/50 bg-red-950/30 px-2 py-0.5">
              SECURITY SHIELD
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Commercial Security Intercept
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Real-time fraud defense flag
            </p>
          </div>
          <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed pt-2 border-t border-white/[0.06]">
            Anomalous long-distance card transaction flagged by geolocation disparity algorithms and intercepted.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-red-400">
            <span>Score: 96/100</span>
            <span>3 Receipts</span>
          </div>
        </motion.div>
      </div>

      {/* Evidence Banner */}
      <div className="border border-white/[0.08] bg-[#0A0C10] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-serif text-[#D6D2C4] leading-relaxed">
          <span className="font-mono text-white font-bold text-[10px] uppercase block">
            Episode Grouping Provenance
          </span>
          {step.evidenceHeadline}
        </div>

        <button
          onClick={onInspectEvidence}
          className="inline-flex items-center space-x-1.5 border border-white/20 bg-[#0F1117] px-3.5 py-1.5 text-[11px] font-mono text-museum-text hover:text-white hover:border-archival-amber transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>INSPECT MOMENT RECEIPTS ({step.supportingReceipts.length})</span>
        </button>
      </div>
    </div>
  );
};
