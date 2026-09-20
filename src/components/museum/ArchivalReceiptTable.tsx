import React from 'react';
import { LifeReceipt } from '../../types/receipt';
import { ArrowUpRight, Music, AlertOctagon, ShieldCheck } from 'lucide-react';

interface ArchivalReceiptTableProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const ArchivalReceiptTable: React.FC<ArchivalReceiptTableProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-white/[0.08] bg-[#0F1117]">
      <table className="w-full text-left font-mono text-xs border-collapse">
        <thead>
          <tr className="border-b border-white/[0.08] bg-[#141720] text-museum-faint text-[10px] uppercase tracking-wider">
            <th className="py-3 px-3.5 font-bold">REG ID</th>
            <th className="py-3 px-3.5 font-bold">TIMESTAMP</th>
            <th className="py-3 px-3.5 font-bold">PROVENANCE</th>
            <th className="py-3 px-3.5 font-bold">CATEGORY</th>
            <th className="py-3 px-3.5 font-bold">RECORD / HEADLINE</th>
            <th className="py-3 px-3.5 font-bold">LOCATION / CONTEXT</th>
            <th className="py-3 px-3.5 font-bold text-right">VALUE / METRIC</th>
            <th className="py-3 px-3.5 font-bold text-center">STATUS</th>
            <th className="py-3 px-3.5 font-bold text-center">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {receipts.map(r => {
            const isFraud = r.metadata?.isFraud === true;
            const isAudio = r.source === 'spotify';

            const sourceBadge = {
              spotify: 'bg-emerald-950/30 text-emerald-300 border-emerald-800/40',
              household: 'bg-amber-950/30 text-amber-300 border-amber-800/40',
              commerce: 'bg-blue-950/30 text-blue-300 border-blue-800/40',
            }[r.source];

            return (
              <tr
                key={r.id}
                onClick={() => onSelectReceipt(r)}
                className="group hover:bg-[#181B26] cursor-pointer transition-colors"
              >
                {/* ID */}
                <td className="py-2.5 px-3.5 text-museum-muted text-[11px]">
                  #{r.id}
                </td>

                {/* Date / Time */}
                <td className="py-2.5 px-3.5 text-museum-text text-[11px] whitespace-nowrap">
                  <div>{r.dateStr}</div>
                  <div className="text-[10px] text-museum-faint">{r.timeStr}</div>
                </td>

                {/* Provenance */}
                <td className="py-2.5 px-3.5 whitespace-nowrap">
                  <span className={`inline-block border px-2 py-0.5 text-[9px] uppercase font-semibold ${sourceBadge}`}>
                    {r.source}
                  </span>
                </td>

                {/* Category */}
                <td className="py-2.5 px-3.5 text-museum-muted text-[11px] whitespace-nowrap">
                  {r.category}
                </td>

                {/* Title & Subtitle */}
                <td className="py-2.5 px-3.5 max-w-xs sm:max-w-sm">
                  <div className="text-white font-semibold group-hover:text-archival-amber transition-colors line-clamp-1">
                    {r.title}
                  </div>
                  {r.subtitle && (
                    <div className="text-museum-muted text-[10px] font-serif italic line-clamp-1">
                      {r.subtitle}
                    </div>
                  )}
                </td>

                {/* Location / Context */}
                <td className="py-2.5 px-3.5 max-w-xs text-museum-muted text-[10px] truncate">
                  {r.location?.context ? (
                    <span>
                      {r.location.city ? `${r.location.city} • ` : ''}
                      {r.location.context}
                    </span>
                  ) : (
                    <span className="text-museum-faint">—</span>
                  )}
                </td>

                {/* Amount / Metric */}
                <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                  {r.amount != null ? (
                    <span className="font-bold text-white group-hover:text-archival-amber transition-colors text-xs">
                      ₹{r.amount.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span className="text-museum-muted text-[11px] flex items-center justify-end space-x-1">
                      <Music className="h-3 w-3 text-archival-amber/70" />
                      <span>{r.metadata?.durationFormatted || 'Played'}</span>
                    </span>
                  )}
                </td>

                {/* Status */}
                <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                  {isFraud ? (
                    <span className="inline-flex items-center space-x-1 border border-red-800 bg-red-950/40 px-1.5 py-0.5 text-[9px] text-red-300">
                      <AlertOctagon className="h-2.5 w-2.5" />
                      <span>FLAG</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 border border-emerald-900/50 bg-emerald-950/20 px-1.5 py-0.5 text-[9px] text-emerald-400">
                      <ShieldCheck className="h-2.5 w-2.5" />
                      <span>VERIFIED</span>
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                  <span className="inline-flex items-center text-museum-muted group-hover:text-archival-amber transition-colors text-[10px]">
                    <span>Inspect</span>
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
