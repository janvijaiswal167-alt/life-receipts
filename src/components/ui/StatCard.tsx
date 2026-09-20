import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  accentColor?: 'emerald' | 'cyan' | 'amber' | 'violet' | 'crimson';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'emerald',
}) => {
  const colorStyles = {
    emerald: {
      bg: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
      text: 'text-emerald-400',
    },
    cyan: {
      bg: 'from-cyan-500/10 to-transparent',
      border: 'border-cyan-500/30',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/40',
      text: 'text-cyan-400',
    },
    amber: {
      bg: 'from-amber-500/10 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
      text: 'text-amber-400',
    },
    violet: {
      bg: 'from-violet-500/10 to-transparent',
      border: 'border-violet-500/30',
      iconBg: 'bg-violet-500/15 text-violet-400 border-violet-500/40',
      text: 'text-violet-400',
    },
    crimson: {
      bg: 'from-rose-500/10 to-transparent',
      border: 'border-rose-500/30',
      iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/40',
      text: 'text-rose-400',
    },
  }[accentColor];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-b ${colorStyles.bg} ${colorStyles.border} bg-[#131B2E]/90 p-5 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.01] hover:border-opacity-60`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400 font-mono">
            {title}
          </p>
          <h3 className="mt-1.5 text-2xl font-bold tracking-tight text-white font-mono">
            {value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <span className={`mt-2 inline-flex items-center text-[10px] font-mono font-medium ${colorStyles.text}`}>
              {trend}
            </span>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colorStyles.iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
