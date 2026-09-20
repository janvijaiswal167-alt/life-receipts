import React from 'react';
import { ActiveTab } from '../../hooks/useLifeReceipts';
import { Sparkles } from 'lucide-react';

interface MuseumNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const EXHIBIT_TABS: Array<{ id: ActiveTab; num: string; label: string; highlight?: boolean }> = [
  { id: 'overview', num: '00', label: 'MAIN EXPERIENCE', highlight: true },
  { id: 'timeline', num: '01', label: 'RECEIPTS EXPLORER' },
  { id: 'spending', num: '02', label: 'DAILY RITUALS' },
  { id: 'audio', num: '03', label: 'AUDIO ARCHIVE' },
  { id: 'commerce', num: '04', label: 'COMMERCE & SECURITY' },
  { id: 'stories', num: '05', label: 'PRINTABLE RECEIPTS' },
  { id: 'graph', num: '06', label: 'TOPOLOGY GRAPH' },
];

export const MuseumNav: React.FC<MuseumNavProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="w-full border-b border-white/[0.06] bg-[#0A0C10] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl space-x-1 overflow-x-auto py-2 scrollbar-none">
        {EXHIBIT_TABS.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center space-x-2 whitespace-nowrap px-4 py-2 text-xs font-mono tracking-wider transition-all border ${
                isActive
                  ? 'border-archival-amber/60 bg-[#151821] text-archival-amber font-semibold shadow-glow-amber-subtle'
                  : 'border-transparent text-museum-muted hover:border-white/10 hover:text-museum-text hover:bg-[#0F1117]'
              }`}
            >
              <span
                className={`text-[10px] ${
                  isActive ? 'text-archival-amber font-bold' : 'text-museum-faint group-hover:text-museum-muted'
                }`}
              >
                {tab.num}
              </span>
              <span>{tab.label}</span>
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
