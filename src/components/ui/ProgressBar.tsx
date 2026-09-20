import React from 'react';
import { LoadingProgress } from '../../data/datasetLoader';
import { Receipt, HardDrive, Sparkles } from 'lucide-react';

interface ProgressBarProps {
  progress: LoadingProgress;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#24334A] bg-[#111827]/90 p-8 shadow-2xl backdrop-blur-md">
        {/* Animated Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-glow-emerald animate-pulse-subtle">
          <Receipt className="h-8 w-8 text-emerald-400" />
        </div>

        <h2 className="mt-6 text-center text-xl font-bold font-mono text-white tracking-wider">
          LIFE<span className="text-emerald-400">//</span>RECEIPTS
        </h2>
        <p className="mt-1 text-center text-xs text-gray-400 font-mono">
          Transforming Raw Records → Story
        </p>

        {/* Progress Track */}
        <div className="mt-8">
          <div className="flex justify-between text-xs font-mono text-gray-400 mb-2">
            <span>{progress.message}</span>
            <span className="text-emerald-400 font-bold">{progress.percent}%</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-[#182234] border border-[#24334A]">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>

        {/* Counts Breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#24334A] pt-4 text-center">
          <div className="rounded-lg bg-[#182234]/60 p-2 border border-[#24334A]/50">
            <p className="text-[10px] text-gray-400 font-mono">Spotify</p>
            <p className="mt-0.5 text-xs font-bold font-mono text-emerald-400">
              {progress.counts.spotify.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-[#182234]/60 p-2 border border-[#24334A]/50">
            <p className="text-[10px] text-gray-400 font-mono">Household</p>
            <p className="mt-0.5 text-xs font-bold font-mono text-amber-400">
              {progress.counts.household.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-[#182234]/60 p-2 border border-[#24334A]/50">
            <p className="text-[10px] text-gray-400 font-mono">Commerce</p>
            <p className="mt-0.5 text-xs font-bold font-mono text-cyan-400">
              {progress.counts.commerce.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-2 text-[11px] text-gray-400">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span>Parsing client-side with PapaParse & In-Memory Indices</span>
        </div>
      </div>
    </div>
  );
};
