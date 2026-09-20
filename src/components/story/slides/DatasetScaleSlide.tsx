/**
 * SLIDE 2: DATASET SCALE SLIDE
 * Visualizes the scope, volume, and provenance across the 3 unified archives.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { Database, Music, Receipt, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

interface DatasetScaleSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
}

export const DatasetScaleSlide: React.FC<DatasetScaleSlideProps> = ({
  step,
  onInspectEvidence,
}) => {
  const scale = step.payload?.scaleData;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="inline-flex items-center space-x-2 border border-archival-amber/30 bg-archival-amber/5 px-3 py-0.5 text-[10px] font-mono text-archival-amber"
        >
          <Database className="h-3 w-3" />
          <span>{step.badge}</span>
        </motion.div>
        <h2 className="text-2xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
          {step.title}
        </h2>
        <p className="text-xs sm:text-sm font-serif italic text-museum-muted max-w-xl mx-auto">
          {step.subtitle}
        </p>
      </div>

      {/* 3 Heterogeneous Source Archival Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Source 1: Spotify Audio */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-emerald-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <Music className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5">
              AUDIO STREAMING
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              Spotify Audio Logs
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              2013 – 2024 (Continuous)
            </p>
          </div>
          <div className="space-y-1 text-xs font-mono pt-2 border-t border-white/[0.06]">
            <div className="flex justify-between text-museum-muted">
              <span>Total Tracks:</span>
              <span className="text-white font-bold">{scale?.audioCount.toLocaleString() || '150,000+'}</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Duration:</span>
              <span className="text-emerald-400 font-bold">{scale?.totalAudioHoursFormatted || '5,300+ hrs'}</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Platforms:</span>
              <span className="text-white">Android, Cast, Web</span>
            </div>
          </div>
        </motion.div>

        {/* Source 2: Household Living Ledger */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-archival-amber/40 transition-colors"
        >
          <div className="flex items-center justify-between text-archival-amber">
            <Receipt className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-archival-amber/30 bg-archival-amber/10 px-2 py-0.5">
              MICRO-LIVING CASH
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              Daily Living Ledger
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              2015 – 2018 (High-Fidelity)
            </p>
          </div>
          <div className="space-y-1 text-xs font-mono pt-2 border-t border-white/[0.06]">
            <div className="flex justify-between text-museum-muted">
              <span>Living Logs:</span>
              <span className="text-white font-bold">{scale?.householdCount.toLocaleString() || '2,461'}</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Recorded Spend:</span>
              <span className="text-archival-amber font-bold">₹1,957,390</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Domains:</span>
              <span className="text-white">Chai, Autos, SIPs</span>
            </div>
          </div>
        </motion.div>

        {/* Source 3: India Commercial Card Commerce */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3 relative group hover:border-cyan-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-cyan-400">
            <CreditCard className="h-5 w-5" />
            <span className="text-[9px] font-mono border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5">
              MACRO-COMMERCE
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold font-mono text-white uppercase">
              India Card Telemetry
            </h3>
            <p className="text-xs font-serif text-museum-muted italic mt-0.5">
              2022 – 2024 (Modern)
            </p>
          </div>
          <div className="space-y-1 text-xs font-mono pt-2 border-t border-white/[0.06]">
            <div className="flex justify-between text-museum-muted">
              <span>Swipes Tracked:</span>
              <span className="text-white font-bold">{scale?.commerceCount.toLocaleString() || '10,267'}</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Cities Mapped:</span>
              <span className="text-cyan-400 font-bold">{scale?.citiesCount || 311} Indian Cities</span>
            </div>
            <div className="flex justify-between text-museum-muted">
              <span>Security Shield:</span>
              <span className="text-white">Active Fraud Defense</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence Summary Callout */}
      <div className="border border-white/[0.08] bg-[#0A0C10] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <CheckCircle2 className="h-5 w-5 text-archival-amber flex-shrink-0 mt-0.5" />
          <div className="text-xs font-serif text-[#D6D2C4] leading-relaxed">
            <span className="font-mono text-white font-bold text-[10px] uppercase block">
              100% Normalized Harmonization
            </span>
            {step.evidenceHeadline}
          </div>
        </div>

        <button
          onClick={onInspectEvidence}
          className="inline-flex items-center space-x-1.5 border border-white/20 bg-[#0F1117] px-3.5 py-1.5 text-[11px] font-mono text-museum-text hover:text-white hover:border-archival-amber transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <span>INSPECT SOURCE RECORDS ({step.supportingReceipts.length})</span>
        </button>
      </div>
    </div>
  );
};
