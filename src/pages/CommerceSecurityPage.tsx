import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import { CreditCard, ShieldAlert, ShieldCheck, Building } from 'lucide-react';
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
          title="Fraud Interceptions"
          value={fraudCount.toLocaleString()}
          annotation={`${((fraudCount / (commReceipts.length || 1)) * 100).toFixed(1)}% alert rate`}
          icon={ShieldAlert}
          accent
        />
        <VitrineMetric
          catalogNo="SEC #03"
          title="Geographic Breadth"
          value={citySet.size.toLocaleString()}
          annotation="311 cities across 28 states"
          icon={Building}
        />
        <VitrineMetric
          catalogNo="SEC #04"
          title="Data Sanitization"
          value="PCI Compliant"
          annotation="100% tokenized & PII redacted"
          icon={ShieldCheck}
        />
      </div>

      {/* Security Forensic Ratio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8 flex flex-col justify-between">
          <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
            FORENSIC RATIO // RISK VS LEGITIMACY
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

      {/* Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white tracking-wide border-b border-white/[0.08] pb-2">
          COMMERCIAL TELEMETRY RECORDS
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commReceipts.slice(0, 18).map(receipt => (
            <MuseumReceiptCard
              key={receipt.id}
              receipt={receipt}
              onSelect={onSelectReceipt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
