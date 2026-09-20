import React from 'react';
import { ActiveTab } from '../../hooks/useLifeReceipts';

interface MuseumNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const EXHIBIT_TABS: Array<{ id: ActiveTab; num: string; label: string; shortLabel?: string; highlight?: boolean }> = [
  { id: 'overview', num: '00', label: 'MAIN EXPERIENCE', shortLabel: 'EXPERIENCE', highlight: true },
  { id: 'timeline', num: '01', label: 'RECEIPTS EXPLORER', shortLabel: 'EXPLORER' },
  { id: 'spending', num: '02', label: 'DAILY RITUALS', shortLabel: 'RITUALS' },
  { id: 'audio', num: '03', label: 'AUDIO ARCHIVE', shortLabel: 'AUDIO' },
  { id: 'commerce', num: '04', label: 'COMMERCE & SECURITY', shortLabel: 'SECURITY' },
  { id: 'stories', num: '05', label: 'PRINTABLE RECEIPTS', shortLabel: 'PRINT' },
  { id: 'graph', num: '06', label: 'TOPOLOGY GRAPH', shortLabel: 'GRAPH' },
];

export const MuseumNav: React.FC<MuseumNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="w-full border-b border-white/[0.06] bg-[#0A0C10] px-2 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl space-x-1.5 overflow-x-auto py-1.5 sm:py-2 scrollbar-none items-center">
        {EXHIBIT_TABS.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center space-x-1.5 sm:space-x-2 whitespace-nowrap min-h-[42px] px-3 sm:px-4 py-2 text-xs font-mono tracking-wider transition-all border flex-shrink-0 cursor-pointer ${
                isActive
                  ? 'border-archival-amber/60 bg-[#151821] text-archival-amber font-semibold shadow-glow-amber-subtle'
                  : 'border-transparent text-museum-muted hover:border-white/10 hover:text-museum-text hover:bg-[#0F1117]'
              }`}
            >
              <span
                className={`text-[9px] sm:text-[10px] ${
                  isActive ? 'text-archival-amber font-bold' : 'text-museum-faint group-hover:text-museum-muted'
                }`}
              >
                {tab.num}
              </span>
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.shortLabel || tab.label}</span>
              {tab.highlight && !isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-archival-amber animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
