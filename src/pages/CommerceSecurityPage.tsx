import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import { CreditCard, ShieldAlert, ShieldCheck, Building, MapPin, Lock } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

interface CommerceSecurityPageProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const CommerceSecurityPage: React.FC<CommerceSecurityPageProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const commReceipts = receipts.filter(r => r.source === 'commerce');
  const fraudCount = commReceipts.filter(r => r.metadata?.isFraud === true).length;
  const verifiedCount = commReceipts.length - fraudCount;

  const totalSpend = commReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const citySet = new Set(commReceipts.map(r => r.location?.city).filter(Boolean));

  const fraudPieData = [
    { name: 'Fraud Flagged', value: fraudCount, color: '#991B1B' },
    { name: 'Verified Legitimate', value: verifiedCount, color: '#D4A373' },
  ];

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 18;
  const totalItems = commReceipts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedReceipts = React.useMemo(() => {
    const start = (validPage - 1) * itemsPerPage;
    return commReceipts.slice(start, start + itemsPerPage);
  }, [commReceipts, validPage, itemsPerPage]);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
          EXHIBIT 05 // FORENSIC COMMERCE & SECURITY (2022–2024)
        </span>
        <h2 className="mt-2 text-3xl font-serif text-[#FAF8F5]">
          Commerce in the Connected Era
        </h2>
        <p className="mt-1 text-xs font-serif italic text-museum-muted">
          10,267 digital transactions across 311 Indian cities with real-time cybersecurity fraud alerts and PCI-masked tokenization.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VitrineMetric
          catalogNo="SEC #01"
          title="Commerce Outflow"
          value={`₹${(totalSpend / 100000).toFixed(1)}L`}
          annotation={`${commReceipts.length.toLocaleString()} card operations`}
          icon={CreditCard}
        />
        <VitrineMetric
          catalogNo="SEC #02"
          title="Security Intercepts"
          value={fraudCount.toLocaleString()}
          annotation="Distance disparity flags"
          icon={ShieldAlert}
          accent
        />
        <VitrineMetric
          catalogNo="SEC #03"
          title="National Footprint"
          value={`${citySet.size} Cities`}
          annotation="Pan-India point-of-sale radius"
          icon={MapPin}
        />
        <VitrineMetric
          catalogNo="SEC #04"
          title="Card Tokenization"
          value="100% Masked"
          annotation="PCI-DSS standard sanitized"
          icon={Lock}
        />
      </div>

      {/* Security Forensic Ratio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
            CHART 5.1 // RISK TELEMETRY COMPOSITION
          </span>
          <h3 className="text-sm font-mono font-bold text-white tracking-wide mt-1 border-b border-white/[0.06] pb-3">
            SECURITY FLAG DISTRIBUTION
          </h3>

          <div className="h-52 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fraudPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {fraudPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val.toLocaleString()} transactions`, name]}
                  contentStyle={{
                    backgroundColor: '#0F1117',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0px',
                    color: '#EDE8DF',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center space-x-6 text-xs font-mono">
            <span className="flex items-center space-x-2 text-red-400">
              <span className="h-2.5 w-2.5 bg-[#991B1B]" />
              <span>Fraud Flagged ({fraudCount.toLocaleString()})</span>
            </span>
            <span className="flex items-center space-x-2 text-archival-amber">
              <span className="h-2.5 w-2.5 bg-archival-amber" />
              <span>Verified ({verifiedCount.toLocaleString()})</span>
            </span>
          </div>
        </div>

        <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 space-y-4">
          <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
            DIRECTIVES // PRIVACY & SHIELDING
          </span>
          <h3 className="text-sm font-mono font-bold text-white tracking-wide mt-1 border-b border-white/[0.06] pb-3">
            FORENSIC SANITIZATION RULES
          </h3>

          <div className="space-y-3 text-xs font-mono text-museum-muted">
            <div className="border border-white/[0.06] bg-[#151821] p-3.5">
              <span className="text-archival-amber font-bold">1. Card Tokenization:</span>
              <p className="mt-1 text-white font-mono">•••• •••• •••• 1234</p>
              <p className="text-[10px] text-museum-faint mt-0.5">Strict PCI-DSS masking rule applied prior to frontend ingestion.</p>
            </div>

            <div className="border border-white/[0.06] bg-[#151821] p-3.5">
              <span className="text-archival-amber font-bold">2. Geospatial Anomaly Vector:</span>
              <p className="text-[10px] text-museum-muted mt-1 font-serif italic">
                Haversine distance between customer coordinates and merchant point-of-sale terminals identifies cross-regional anomalies.
              </p>
            </div>

            <div className="border border-white/[0.06] bg-[#151821] p-3.5">
              <span className="text-archival-amber font-bold">3. PII Redaction:</span>
              <p className="text-[10px] text-museum-faint mt-1">
                Date of birth and specific residential door numbers permanently scrubbed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CuratorNote headline="The Modern Risk Shift">
        "Between 2015 and 2018, financial risk was bounded by physical cash in hand. By 2022–2024, digital card commerce spanned 311 Indian cities, with 52.4% of high-velocity charges encountering automated fraud defense checks."
      </CuratorNote>

      {/* Commercial Telemetry List with Pagination */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-3 gap-2">
          <h3 className="text-base font-mono font-bold text-white tracking-wide">
            COMMERCIAL TELEMETRY RECORDS
          </h3>
          <span className="text-xs font-mono text-museum-muted">
            Showing {((validPage - 1) * itemsPerPage) + 1}–{Math.min(validPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} transactions
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedReceipts.map(receipt => (
            <MuseumReceiptCard
              key={receipt.id}
              receipt={receipt}
              onSelect={onSelectReceipt}
            />
          ))}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-mono text-museum-muted">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={validPage === 1}
              className="border border-white/10 bg-[#0F1117] px-3 py-1.5 hover:border-archival-amber/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              ← Previous
            </button>

            <span className="text-white">
              Page <span className="text-archival-amber font-bold">{validPage}</span> of {totalPages.toLocaleString()}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={validPage === totalPages}
              className="border border-white/10 bg-[#0F1117] px-3 py-1.5 hover:border-archival-amber/60 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
