import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';

interface CuratorNoteProps {
  catalogId?: string;
  headline?: string;
  children: React.ReactNode;
}

export const CuratorNote: React.FC<CuratorNoteProps> = ({
  catalogId = 'CURATOR NOTE // LR-EXHIBIT',
  headline,
  children,
}) => {
  return (
    <div className="relative border-l-2 border-archival-amber bg-[#0F1117] p-5 sm:p-6 border-y border-r border-white/[0.06]">
      <div className="flex items-center space-x-2 text-[10px] font-mono text-archival-amber uppercase tracking-widest mb-1.5">
        <Bookmark className="h-3 w-3" />
        <span>{catalogId}</span>
      </div>

      {headline && (
        <h4 className="text-sm font-bold font-mono text-white tracking-wide mb-1">
          {headline}
        </h4>
      )}

      <div className="text-xs font-serif italic text-museum-muted leading-relaxed">
        {children}
      </div>
    </div>
  );
};
