/**
 * STORY EVIDENCE DRAWER
 * Interactive slide-out panel allowing the user to inspect the exact empirical
 * supporting receipts and data points backing any story slide.
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeReceipt } from '../../types/receipt';
import { StorySlideStep } from '../../types/storyMode';
import { MuseumReceiptCard } from '../museum/MuseumReceiptCard';
import { X, Search, ShieldCheck, Database, Layers, ArrowRight } from 'lucide-react';

interface StoryEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  step: StorySlideStep;
  onSelectReceipt: (r: LifeReceipt) => void;
  onExploreTimeline?: () => void;
}

export const StoryEvidenceDrawer: React.FC<StoryEvidenceDrawerProps> = ({
  isOpen,
  onClose,
  step,
  onSelectReceipt,
  onExploreTimeline,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#0B0D13] border-l border-archival-amber/30 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#08090C]">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-archival-amber animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
                  EVIDENCE INSPECTOR // STEP {step.stepNumber} OF {step.totalSteps}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-museum-muted hover:text-white border border-white/10 hover:border-archival-amber/40 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Evidence Title & Claim */}
              <div className="border border-white/[0.08] bg-[#0F1117] p-5 space-y-3">
                <div className="flex items-center space-x-2 text-archival-amber text-xs font-mono">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold uppercase tracking-wider">
                    VERIFIED EMPIRICAL CLAIM
                  </span>
                </div>
                <h3 className="text-base font-serif text-[#FAF8F5] leading-snug">
                  {step.evidenceHeadline}
                </h3>
                <p className="text-xs font-serif italic text-museum-muted">
                  {step.subtitle}
                </p>
              </div>

              {/* Supporting Rules & Statements */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-museum-muted uppercase tracking-widest flex items-center space-x-1.5">
                  <Database className="h-3 w-3 text-archival-amber" />
                  <span>FACTUAL PROVENANCE CRITERIA</span>
                </span>
                <div className="border border-white/[0.06] bg-[#0A0C10] p-4 space-y-2">
                  {step.evidenceStatements.map((stmt, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs font-serif text-[#D6D2C4]">
                      <span className="text-archival-amber font-mono text-[11px] select-none mt-0.5">
                        0{idx + 1}.
                      </span>
                      <span>{stmt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supporting Receipts Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-museum-muted uppercase tracking-widest flex items-center space-x-1.5">
                    <Layers className="h-3 w-3 text-archival-amber" />
                    <span>SUPPORTING EVIDENCE RECEIPTS ({step.supportingReceipts.length})</span>
                  </span>
                  <span className="text-[10px] font-mono text-museum-muted">
                    Click receipt to inspect
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {step.supportingReceipts.map(receipt => (
                    <MuseumReceiptCard
                      key={receipt.id}
                      receipt={receipt}
                      onSelect={onSelectReceipt}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-white/[0.08] bg-[#08090C] flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 text-xs font-mono border border-white/20 text-museum-muted hover:text-white hover:border-white/40 transition-all cursor-pointer text-center"
              >
                RETURN TO STORY
              </button>

              {onExploreTimeline && (
                <button
                  onClick={() => {
                    onClose();
                    onExploreTimeline();
                  }}
                  className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 text-xs font-mono font-bold border border-archival-amber bg-archival-amber text-[#08090C] hover:bg-archival-amber-bright transition-all cursor-pointer"
                >
                  <span>EXPLORE TIMELINE</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
