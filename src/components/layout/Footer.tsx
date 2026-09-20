import React from 'react';
import { Fingerprint, ShieldCheck, Database } from 'lucide-react';

interface FooterProps {
  totalCount: number;
  useSampleMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ totalCount, useSampleMode }) => {
  return (
    <footer className="mt-16 border-t border-white/[0.08] bg-[#050608] py-8 px-4 text-xs font-mono text-museum-muted">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="flex h-6 w-6 items-center justify-center border border-archival-amber/40 bg-archival-amber/5 text-archival-amber text-[10px] font-bold">
            LR
          </div>
          <span className="tracking-widest uppercase text-white/90">
            LIFE//RECEIPTS <span className="text-museum-faint">• DIGITAL LIFE MUSEUM</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
          <span className="flex items-center space-x-1.5 text-museum-muted">
            <Fingerprint className="h-3.5 w-3.5 text-archival-amber" />
            <span>Zero Server / Client Memory</span>
          </span>

          <span className="flex items-center space-x-1.5 text-museum-muted">
            <Database className="h-3.5 w-3.5 text-archival-amber" />
            <span>{totalCount.toLocaleString()} {useSampleMode ? 'Sampled Artifacts' : 'Full Archive Artifacts'}</span>
          </span>

          <span className="flex items-center space-x-1.5 text-museum-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-archival-amber" />
            <span>PCI-Masked & PII-Redacted</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
