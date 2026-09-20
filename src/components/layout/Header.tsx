import React from 'react';
import { Receipt, Search, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { ActiveTab } from '../../hooks/useLifeReceipts';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  useSampleMode: boolean;
  onToggleSampleMode: (val: boolean) => void;
  totalReceipts: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  useSampleMode,
  onToggleSampleMode,
  totalReceipts,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#24334A]/80 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 shadow-glow-emerald">
            <Receipt className="h-5 w-5 text-emerald-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-wider font-mono text-white">
                LIFE<span className="text-emerald-400">//</span>RECEIPTS
              </h1>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400 border border-emerald-500/30">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Your Life, In Receipts • Multi-Dataset Life Ledger
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search artists, chai, trains, merchants, cities..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-[#24334A] bg-[#111827]/80 py-1.5 pl-9 pr-4 text-xs text-gray-200 placeholder-gray-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-3">
          {/* Dataset Mode Toggle */}
          <div className="flex items-center space-x-2 rounded-lg border border-[#24334A] bg-[#111827] p-1 text-xs">
            <button
              onClick={() => onToggleSampleMode(true)}
              className={`flex items-center space-x-1.5 rounded px-2.5 py-1 transition-all ${
                useSampleMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Fast load preview with 23k records"
            >
              <Zap className="h-3 w-3" />
              <span>Fast Snapshot</span>
            </button>
            <button
              onClick={() => onToggleSampleMode(false)}
              className={`flex items-center space-x-1.5 rounded px-2.5 py-1 transition-all ${
                !useSampleMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Full 162,000+ records across 11 years"
            >
              <Sparkles className="h-3 w-3" />
              <span>Full Archives</span>
            </button>
          </div>

          {/* Records Counter Pill */}
          <div className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-[#24334A] bg-[#111827] px-3 py-1.5 text-xs text-gray-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-mono font-semibold text-white">
              {totalReceipts.toLocaleString()}
            </span>
            <span className="text-gray-400">receipts</span>
          </div>
        </div>
      </div>
    </header>
  );
};
