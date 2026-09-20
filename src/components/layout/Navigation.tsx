import React from 'react';
import {
  LayoutDashboard,
  Clock,
  Wallet,
  Music2,
  CreditCard,
  ScrollText,
  Network,
} from 'lucide-react';
import { ActiveTab } from '../../hooks/useLifeReceipts';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const TABS = [
  {
    id: 'overview' as ActiveTab,
    label: 'Overview',
    icon: LayoutDashboard,
    badge: 'Pulse',
  },
  {
    id: 'timeline' as ActiveTab,
    label: 'Life Timeline',
    icon: Clock,
    badge: '11 Years',
  },
  {
    id: 'spending' as ActiveTab,
    label: 'Household & Habits',
    icon: Wallet,
    badge: 'Micro',
  },
  {
    id: 'audio' as ActiveTab,
    label: 'Spotify Soundtrack',
    icon: Music2,
    badge: 'Audio',
  },
  {
    id: 'commerce' as ActiveTab,
    label: 'Commerce & Security',
    icon: CreditCard,
    badge: 'Shield',
  },
  {
    id: 'stories' as ActiveTab,
    label: 'Story Receipts',
    icon: ScrollText,
    badge: 'Capsules',
  },
  {
    id: 'graph' as ActiveTab,
    label: 'Entity Connections',
    icon: Network,
    badge: 'Graph',
  },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="w-full border-b border-[#24334A] bg-[#0E1424]/60 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl space-x-2 overflow-x-auto py-2.5 scrollbar-none">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center space-x-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald/30'
                  : 'text-gray-400 hover:bg-[#182234] hover:text-gray-200 border border-transparent'
              }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-300'
                }`}
              />
              <span>{tab.label}</span>
              <span
                className={`rounded px-1.5 py-0.5 text-[9px] font-mono ${
                  isActive
                    ? 'bg-emerald-400/20 text-emerald-300'
                    : 'bg-[#24334A]/50 text-gray-400 group-hover:text-gray-300'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
