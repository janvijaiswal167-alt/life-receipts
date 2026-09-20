/**
 * SLIDE 1: INTRO SLIDE
 * Atmospheric opening presentation slide introducing the digital life ledger.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { StorySlideStep } from '../../../types/storyMode';
import { Fingerprint, ScrollText, Sparkles, ShieldCheck, ChevronRight } from 'lucide-react';

interface IntroSlideProps {
  step: StorySlideStep;
  onInspectEvidence: () => void;
  onNext: () => void;
}

export const IntroSlide: React.FC<IntroSlideProps> = ({
  step,
  onInspectEvidence,
  onNext,
}) => {
  return (
    <div className="space-y-8 max-w-3xl mx-auto text-center py-4">
      {/* Stage Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="inline-flex items-center space-x-2 border border-archival-amber/40 bg-archival-amber/10 px-3.5 py-1 text-[11px] font-mono text-archival-amber"
      >
        <Fingerprint className="h-3.5 w-3.5" />
        <span>{step.badge}</span>
      </motion.div>

      {/* Main Title & Lead Hook */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h1 className="text-4xl sm:text-6xl font-mono font-bold tracking-widest text-white uppercase">
          REVEAL<span className="text-archival-amber">//</span>MY STORY
        </h1>
        <p className="text-2xl sm:text-3xl font-serif italic text-archival-amber tracking-tight">
          {step.leadQuote}
        </p>
      </motion.div>

      {/* Curatorial Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-sm sm:text-base font-serif text-[#D6D2C4] leading-relaxed max-w-2xl mx-auto"
      >
        {step.subtitle}
      </motion.p>

      {/* Core Provenance Criteria Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2"
      >
        {step.metrics?.map((m, idx) => (
          <div
            key={idx}
            className={`border p-4 bg-[#0F1117] ${
              m.isHighlight ? 'border-archival-amber/50 shadow-glow-amber-subtle' : 'border-white/[0.08]'
            }`}
          >
            <span className="text-[9px] font-mono text-museum-muted uppercase tracking-widest block">
              {m.label}
            </span>
            <p className="mt-1 text-xl font-bold font-mono text-white">
              {m.value}
            </p>
            {m.sublabel && (
              <p className="text-[10px] font-serif italic text-museum-muted mt-0.5">
                {m.sublabel}
              </p>
            )}
          </div>
        ))}
      </motion.div>

      {/* Epistemological Transparency Callout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border border-white/[0.06] bg-[#0A0C10] p-4 text-left flex items-start space-x-3 max-w-2xl mx-auto"
      >
        <ShieldCheck className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs font-serif text-museum-muted leading-relaxed">
          <span className="font-mono text-white font-bold text-[10px] uppercase block mb-1">
            Empirical Guarantee
          </span>
          Every assertion in this story is calculated directly from raw transaction records, audio streaming logs, and mobility receipts with zero psychological speculation.
        </div>
      </motion.div>
    </div>
  );
};
