/**
 * SLIDE 4: CONNECTIONS SLIDE
 * Visualizes explainable cross-dataset links and temporal-spatial synchronies.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { GitMerge, ArrowRight, Zap, ShieldCheck, Link2 } from 'lucide-react';

interface ConnectionsSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
}

export const ConnectionsSlide: React.FC<ConnectionsSlideProps> = ({
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
          <GitMerge className="h-3 w-3" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        <p className="text-base sm:text-lg font-serif italic text-archival-amber">
          {step.leadQuote}
        </p>
      </div>

      {/* 3 Featured Cross-Dataset Synchrony Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Connection 1: Commute & Audio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-archival-amber/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono border border-archival-amber/30 bg-archival-amber/10 px-2 py-0.5 text-archival-amber">
              TEMPORAL & TRANSIT
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Score: 94/100
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Auto Commute & Headphones
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Household Cash ↔ Spotify Telemetry
            </p>
          </div>

          <div className="text-xs font-serif text-[#D6D2C4] space-y-2 pt-2 border-t border-white/[0.06]">
            <p>
              Auto-rickshaw payment timestamp occurred within the same 2-hour morning window as active mobile audio listening.
            </p>
            <div className="text-[10px] font-mono text-museum-muted bg-[#0A0C10] p-2 border border-white/[0.04]">
              Reason: Shared time window + complimentary transit/audio categories
            </div>
          </div>
        </motion.div>

        {/* Connection 2: Salary & SIP */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 text-emerald-400">
              SEQUENTIAL CAUSALITY
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              Score: 98/100
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Salary Credit → Mutual Fund SIP
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Income ↔ Systematic Investment
            </p>
          </div>

          <div className="text-xs font-serif text-[#D6D2C4] space-y-2 pt-2 border-t border-white/[0.06]">
            <p>
              Monthly salary credit immediately preceded structured debits to 5 Equity Mutual Fund folios within 24 to 48 hours.
            </p>
            <div className="text-[10px] font-mono text-museum-muted bg-[#0A0C10] p-2 border border-white/[0.04]">
              Reason: Direct sequential causal chain + shared banking account
            </div>
          </div>
        </motion.div>

        {/* Connection 3: Subscription & Audio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5 text-cyan-400">
              DIGITAL INFRASTRUCTURE
            </span>
            <span className="text-xs font-mono font-bold text-cyan-400">
              Score: 90/100
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold font-mono text-white">
              Subscription Fee → Streaming
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              Monthly Invoices ↔ Multi-Device Audio
            </p>
          </div>

          <div className="text-xs font-serif text-[#D6D2C4] space-y-2 pt-2 border-t border-white/[0.06]">
            <p>
              Recurring ₹199/₹169 service bills directly enabled continuous study and workstation playback across Cast & Desktop.
            </p>
            <div className="text-[10px] font-mono text-museum-muted bg-[#0A0C10] p-2 border border-white/[0.04]">
              Reason: Recurring subscription invoice powering heavy media usage
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence Banner */}
      <div className="border border-white/[0.08] bg-[#0A0C10] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs font-serif text-[#D6D2C4] leading-relaxed">
          <span className="font-mono text-white font-bold text-[10px] uppercase block">
            Explainable Linkage Rule
          </span>
          {step.evidenceHeadline}
        </div>

        <button
          onClick={onInspectEvidence}
          className="inline-flex items-center space-x-1.5 border border-white/20 bg-[#0F1117] px-3.5 py-1.5 text-[11px] font-mono text-museum-text hover:text-white hover:border-archival-amber transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>INSPECT CONNECTION PAIRS ({step.supportingReceipts.length})</span>
        </button>
      </div>
    </div>
  );
};
