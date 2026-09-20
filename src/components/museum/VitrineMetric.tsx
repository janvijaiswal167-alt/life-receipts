import React from 'react';
import { LucideIcon } from 'lucide-react';

interface VitrineMetricProps {
  catalogNo: string;
  title: string;
  value: string | number;
  annotation?: string;
  accent?: boolean;
  icon?: LucideIcon;
}

export const VitrineMetric: React.FC<VitrineMetricProps> = ({
  catalogNo,
  title,
  value,
  annotation,
  accent = false,
  icon: Icon,
}) => {
  return (
    <div className="relative border border-white/[0.08] bg-[#0F1117] p-6 transition-all hover:border-white/20">
      {/* Corner crosshairs */}
      <span className="absolute top-2 left-2 text-[8px] font-mono text-white/20 select-none">+</span>
      <span className="absolute top-2 right-2 text-[8px] font-mono text-white/20 select-none">+</span>
      <span className="absolute bottom-2 left-2 text-[8px] font-mono text-white/20 select-none">+</span>
      <span className="absolute bottom-2 right-2 text-[8px] font-mono text-white/20 select-none">+</span>

      <div className="flex items-start justify-between">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
            {catalogNo}
          </span>
          <h4 className="mt-1 text-xs font-mono tracking-wider text-museum-muted uppercase">
            {title}
          </h4>
        </div>

        {Icon && (
          <div className="text-archival-amber opacity-70">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div
          className={`text-3xl font-bold font-mono tracking-tight ${
            accent ? 'text-archival-amber' : 'text-[#FAF8F5]'
          }`}
        >
          {value}
        </div>
        {annotation && (
          <p className="mt-1 text-xs font-serif italic text-museum-muted">
            {annotation}
          </p>
        )}
      </div>
    </div>
  );
};
