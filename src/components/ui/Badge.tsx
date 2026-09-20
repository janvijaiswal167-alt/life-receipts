import React from 'react';
import { CanonicalCategory, ReceiptSource } from '../../types/receipt';

interface CategoryBadgeProps {
  category: CanonicalCategory | string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'md' }) => {
  const styles: Record<string, string> = {
    'Music & Audio': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'Food & Dining': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    'Transportation & Commute': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    'Subscriptions & Digital': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    'Shopping & Retail': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    'Health & Wellness': 'bg-teal-500/15 text-teal-400 border-teal-500/30',
    'Entertainment & Leisure': 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30',
    'Investments & Savings': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    'Income & Salary': 'bg-lime-500/15 text-lime-400 border-lime-500/30',
    'Family & Remittances': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  };

  const currentStyle =
    styles[category] || 'bg-gray-500/15 text-gray-300 border-gray-500/30';

  const sizeStyle =
    size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono font-medium ${sizeStyle} ${currentStyle}`}
    >
      {category}
    </span>
  );
};

export const SourceBadge: React.FC<{ source: ReceiptSource; size?: 'sm' | 'md' }> = ({
  source,
  size = 'md',
}) => {
  const styles = {
    spotify: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40',
    household: 'bg-amber-950/60 text-amber-300 border-amber-500/40',
    commerce: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40',
  }[source];

  const labels = {
    spotify: 'Spotify Audio',
    household: 'Household Ledger',
    commerce: 'Card Commerce',
  }[source];

  const sizeStyle =
    size === 'sm' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[11px]';

  return (
    <span className={`inline-flex items-center rounded border font-mono ${sizeStyle} ${styles}`}>
      {labels}
    </span>
  );
};
