import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import { Coffee, Car, PiggyBank, HeartPulse } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface HouseholdFinancePageProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const HouseholdFinancePage: React.FC<HouseholdFinancePageProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const hhReceipts = receipts.filter(r => r.source === 'household');

  // Compute specific habit stats
  const chaiReceipts = hhReceipts.filter(r => (r.title + r.subtitle).toLowerCase().includes('chai') || (r.title + r.subtitle).toLowerCase().includes('tea'));
  const milkReceipts = hhReceipts.filter(r => (r.title + r.subtitle).toLowerCase().includes('milk'));
  const transitReceipts = hhReceipts.filter(r => r.category === 'Transportation & Commute');
  const investmentReceipts = hhReceipts.filter(r => r.category === 'Investments & Savings');

  const totalChaiSpend = chaiReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalMilkSpend = milkReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalTransitSpend = transitReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);
  const totalInvestments = investmentReceipts.reduce((sum, r) => sum + (r.amount || 0), 0);

  // Subcategory Breakdown for Chart
  const subcatTotals: Record<string, number> = {};
  for (let i = 0; i < hhReceipts.length; i++) {
    const s = hhReceipts[i].subcategory || hhReceipts[i].category;
    if (hhReceipts[i].amount) {
      subcatTotals[s] = (subcatTotals[s] || 0) + (hhReceipts[i].amount || 0);
    }
  }

  const chartData = Object.entries(subcatTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, amount]) => ({ name, amount: Math.round(amount) }));

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
          EXHIBIT 03 // THE MICRO-HABITS ARCHIVE (2015–2018)
        </span>
        <h2 className="mt-2 text-3xl font-serif text-[#FAF8F5]">
          The Texture of Everyday Living
        </h2>
        <p className="mt-1 text-xs font-serif italic text-museum-muted">
          2,461 authenticated entries detailing the daily cadence of morning chai, dairy logistics, local auto commutes, and wealth creation.
        </p>
      </div>

      {/* Vitrine Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VitrineMetric
          catalogNo="HABIT #01"
          title="Cutting Chai & Tea"
          value={`₹${totalChaiSpend.toLocaleString('en-IN')}`}
          annotation={`${chaiReceipts.length} recorded tea breaks`}
          icon={Coffee}
          accent
        />
        <VitrineMetric
          catalogNo="HABIT #02"
          title="Morning Milk Supply"
          value={`₹${totalMilkSpend.toLocaleString('en-IN')}`}
          annotation={`${milkReceipts.length} daily morning deliveries`}
          icon={HeartPulse}
        />
        <VitrineMetric
          catalogNo="HABIT #03"
          title="Transit & Railway"
          value={`₹${totalTransitSpend.toLocaleString('en-IN')}`}
          annotation={`${transitReceipts.length} auto & train journeys`}
          icon={Car}
        />
        <VitrineMetric
          catalogNo="HABIT #04"
          title="Wealth Investments"
          value={`₹${(totalInvestments / 100000).toFixed(2)}L`}
          annotation="MF Folios A-E & PPF transfers"
          icon={PiggyBank}
        />
      </div>

      {/* Subcategories Chart */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8">
        <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
          CHART 3.1 // DOMESTIC EXPENDITURE ALLOCATION
        </span>
        <h3 className="text-sm font-mono font-bold text-white tracking-wide mt-1 border-b border-white/[0.06] pb-3">
          PRIMARY HOUSEHOLD EXPENSE DOMAINS (INR)
        </h3>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} angle={-25} textAnchor="end" />
              <YAxis stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                formatter={(val: any) => [`₹${val.toLocaleString('en-IN')}`, 'Expenditure']}
                contentStyle={{
                  backgroundColor: '#0F1117',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0px',
                  color: '#EDE8DF',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="amount" fill="#D4A373" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CuratorNote headline="The Disciplined Morning Protocol">
        "Between 07:00 and 08:30 each morning, the ledger records a repeated sequence: milk vendor settlement (₹30-₹60), cutting chai with two Parle-G biscuits (₹15), followed by an auto-rickshaw to Place 2 Station (₹50). Meticulous micro-accounting reveals the rhythmic heartbeat of urban Indian life."
      </CuratorNote>

      {/* Household Artifacts List */}
      <div className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white tracking-wide border-b border-white/[0.08] pb-2">
          HOUSEHOLD LEDGER ARTIFACTS
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hhReceipts.slice(0, 18).map(receipt => (
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
