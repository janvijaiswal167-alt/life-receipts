/**
 * REVEAL MY STORY — INTERACTIVE PRESENTATION MODAL
 * 
 * Presentation-grade interactive visual narrative transforming 11.4 years of detected evidence
 * into a 7-step presentation story using Framer Motion:
 * 1. Intro
 * 2. Dataset scale
 * 3. Important patterns
 * 4. Important connections
 * 5. Moments
 * 6. Chapters
 * 7. Final summary
 * 
 * Controls:
 * - Continue / Next (ArrowRight, Space, Button)
 * - Go Back (ArrowLeft, Button)
 * - Skip (Skip to Summary, Exit)
 * - Inspect Evidence (opens slide-out Evidence Drawer with verified receipts)
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeReceipt } from '../../types/receipt';
import { LifeReceiptStore } from '../../utils/indexStore';
import { buildStoryModeNarrative } from '../../engine/storyModeEngine';
import { StoryEvidenceDrawer } from './StoryEvidenceDrawer';

// Slide components
import { IntroSlide } from './slides/IntroSlide';
import { DatasetScaleSlide } from './slides/DatasetScaleSlide';
import { PatternsSlide } from './slides/PatternsSlide';
import { ConnectionsSlide } from './slides/ConnectionsSlide';
import { MomentsSlide } from './slides/MomentsSlide';
import { ChaptersSlide } from './slides/ChaptersSlide';
import { SummarySlide } from './slides/SummarySlide';

import {
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  FastForward,
  Sparkles,
  ScrollText,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface RevealStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: LifeReceipt[];
  store?: LifeReceiptStore | null;
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateTab: (tab: any) => void;
}

export const RevealStoryModal: React.FC<RevealStoryModalProps> = ({
  isOpen,
  onClose,
  receipts,
  store,
  onSelectReceipt,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState<boolean>(false);

  // Generate the 7-step empirical story narrative
  const narrative = useMemo(() => {
    return buildStoryModeNarrative(receipts, store);
  }, [receipts, store]);

  const currentStep = narrative.steps[currentStepIndex] || narrative.steps[0];
  const totalSteps = narrative.totalSteps || 7;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  // Reset to step 0 whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setDirection(1);
      setIsEvidenceDrawerOpen(false);
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onClose();
      onNavigateTab('timeline');
    }
  }, [currentStepIndex, totalSteps, onClose, onNavigateTab]);

  const handlePrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const handleJumpToStep = (index: number) => {
    setDirection(index > currentStepIndex ? 1 : -1);
    setCurrentStepIndex(index);
  };

  const handleSkipToEnd = () => {
    setDirection(1);
    setCurrentStepIndex(totalSteps - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEvidenceDrawerOpen) {
          setIsEvidenceDrawerOpen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isEvidenceDrawerOpen, handleNext, handlePrev, onClose]);

  if (!isOpen) return null;

  // Slide transition animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 350 : -350,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -350 : 350,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07080B] text-[#EDE8DF] overflow-hidden select-none">
      {/* Background Ambience & Scanline Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-full max-w-5xl bg-archival-amber/[0.04] blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* ==================================================================== */}
      {/* 1. TOP PRESENTATION HEADER */}
      {/* ==================================================================== */}
      <header className="relative z-20 flex items-center justify-between px-3 sm:px-8 py-3 sm:py-4 border-b border-white/[0.08] bg-[#08090C]/90 backdrop-blur-md">
        {/* Left: Title & Stage Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="h-2 w-2 rounded-full bg-archival-amber animate-pulse flex-shrink-0" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider sm:tracking-widest text-white uppercase truncate">
            STORY<span className="text-archival-amber">//</span>REVEAL
          </span>
          <span className="text-museum-faint font-mono">•</span>
          <span className="text-[10px] sm:text-[11px] font-mono text-archival-amber font-semibold whitespace-nowrap">
            0{currentStepIndex + 1} / 0{totalSteps}
          </span>
        </div>

        {/* Center: Stepper Progress Dots (Desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          {narrative.steps.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => handleJumpToStep(idx)}
              className={`group flex items-center space-x-1 py-1 px-2 text-[10px] font-mono transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'border-b-2 border-archival-amber text-archival-amber font-bold'
                  : idx < currentStepIndex
                  ? 'text-museum-muted hover:text-white'
                  : 'text-museum-faint hover:text-museum-muted'
              }`}
            >
              <span>0{idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isLastStep && (
            <button
              onClick={handleSkipToEnd}
              className="inline-flex items-center space-x-1 border border-white/10 px-2 sm:px-2.5 py-1 text-[9px] sm:text-[10px] font-mono text-museum-muted hover:text-white hover:border-archival-amber/40 transition-all cursor-pointer"
            >
              <FastForward className="h-3 w-3" />
              <span className="hidden xs:inline">SKIP</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 text-museum-muted hover:text-white border border-white/10 hover:border-archival-amber/40 transition-all cursor-pointer"
            title="Exit Story Mode (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Stepper Progress Line */}
      <div className="relative h-1 w-full bg-white/[0.04]">
        <motion.div
          className="h-full bg-gradient-to-r from-archival-amber/80 to-archival-amber-bright"
          initial={{ width: 0 }}
          animate={{
            width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN PRESENTATION STAGE (Framer Motion Slides) */}
      {/* ==================================================================== */}
      <main className="relative z-10 flex-1 overflow-y-auto px-3 sm:px-8 py-4 sm:py-8 flex items-center justify-center">
        <div className="w-full max-w-5xl">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {currentStep.type === 'intro' && (
                <IntroSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                  onNext={handleNext}
                />
              )}

              {currentStep.type === 'scale' && (
                <DatasetScaleSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}

              {currentStep.type === 'patterns' && (
                <PatternsSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}

              {currentStep.type === 'connections' && (
                <ConnectionsSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}

              {currentStep.type === 'moments' && (
                <MomentsSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}

              {currentStep.type === 'chapters' && (
                <ChaptersSlide
                  step={currentStep}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}

              {currentStep.type === 'summary' && (
                <SummarySlide
                  step={currentStep}
                  onExploreReceipts={() => {
                    onClose();
                    onNavigateTab('timeline');
                  }}
                  onExploreGraph={() => {
                    onClose();
                    onNavigateTab('graph');
                  }}
                  onPrintMasterReceipt={() => window.print()}
                  onReplayStory={() => handleJumpToStep(0)}
                  onInspectEvidence={() => setIsEvidenceDrawerOpen(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* 3. BOTTOM INTERACTIVE CONTROL BAR */}
      {/* ==================================================================== */}
      <footer className="relative z-20 border-t border-white/[0.08] bg-[#08090C]/95 px-3 sm:px-8 py-3 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Go Back Button */}
          <button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`inline-flex items-center space-x-1 min-h-[42px] px-3 sm:px-4 py-2 text-xs font-mono border transition-all cursor-pointer ${
              isFirstStep
                ? 'opacity-30 cursor-not-allowed border-white/10 text-museum-muted'
                : 'border-white/20 text-museum-text hover:text-white hover:border-archival-amber'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden xs:inline">BACK</span>
          </button>

          {/* Center: Inspect Evidence Action on Every Slide */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEvidenceDrawerOpen(true)}
              className="inline-flex items-center space-x-1 sm:space-x-1.5 min-h-[42px] border border-archival-amber/40 bg-archival-amber/10 px-2.5 sm:px-3.5 py-2 text-xs font-mono text-archival-amber hover:bg-archival-amber/20 hover:border-archival-amber transition-all cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">INSPECT EVIDENCE</span>
              <span className="sm:hidden">EVIDENCE</span>
              <span className="text-[10px] opacity-70">
                ({currentStep.supportingReceipts.length})
              </span>
            </button>
          </div>

          {/* Right: Continue / Finish Button */}
          <button
            onClick={handleNext}
            className="inline-flex items-center space-x-1 sm:space-x-1.5 min-h-[42px] border border-archival-amber bg-archival-amber px-3.5 sm:px-5 py-2 text-xs font-mono font-bold text-[#08090C] hover:bg-archival-amber-bright transition-all shadow-glow-amber-subtle cursor-pointer"
          >
            <span>{isLastStep ? 'EXPLORE' : 'CONTINUE'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>

      {/* ==================================================================== */}
      {/* 4. SLIDE-OUT EVIDENCE INSPECTOR DRAWER */}
      {/* ==================================================================== */}
      <StoryEvidenceDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        step={currentStep}
        onSelectReceipt={onSelectReceipt}
        onExploreTimeline={() => {
          onClose();
          onNavigateTab('timeline');
        }}
      />
    </div>
  );
};
