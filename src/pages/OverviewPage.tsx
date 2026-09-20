import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import {
  Clock,
  Wallet,
  Music2,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface OverviewPageProps {
  receipts: LifeReceipt[];
  aggregates: any;
  onSelectReceipt: (r: LifeReceipt) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  receipts,
  aggregates,
  onSelectReceipt,
  onNavigateTab,
}) => {
  if (!aggregates) return null;

  // Yearly timeline data for chart
  const yearlyCounts: Record<number, { year: number; total: number; music: number; finance: number }> = {};
  for (let y = 2013; y <= 2024; y++) {
    yearlyCounts[y] = { year: y, total: 0, music: 0, finance: 0 };
  }

  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i];
    if (yearlyCounts[r.year]) {
      yearlyCounts[r.year].total++;
      if (r.source === 'spotify') yearlyCounts[r.year].music++;
      else yearlyCounts[r.year].finance++;
    }
  }

  const timelineChartData = Object.values(yearlyCounts);
  const spotlightReceipts = receipts.slice(0, 6);

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Museum Exhibition Title & Monograph */}
      <div className="border-b border-white/[0.08] pb-8 pt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
              EXHIBITION MONOGRAPH // DECADE RETROSPECTIVE (2013–2024)
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-serif text-[#FAF8F5] tracking-tight">
              The Architecture of a Human Lifetime
            </h2>
          </div>

          <p className="max-w-md text-xs font-serif italic text-museum-muted leading-relaxed">
            Examining eleven years of lived reality through 162,000 digital footsteps: from early-morning chai counters and railway berths to 5,300 hours of headphone audio and multi-city digital transactions.
          </p>
        </div>
      </div>

      {/* 4 Museum Vitrine Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VitrineMetric
          catalogNo="CATALOG #LR-01"
          title="Total Unified Artifacts"
          value={aggregates.totalReceipts.toLocaleString()}
          annotation="Harmonized across 3 primary records"
          icon={Layers}
          accent
        />
        <VitrineMetric
          catalogNo="CATALOG #LR-02"
          title="Acoustic Playback"
          value={`${aggregates.totalMusicHours}h`}
          annotation={`Top artist: ${aggregates.topArtists[0]?.[0] || 'The Beatles'}`}
          icon={Music2}
        />
        <VitrineMetric
          catalogNo="CATALOG #LR-03"
          title="Tracked Outflow"
          value={`₹${(aggregates.totalExpenseInr / 100000).toFixed(2)}L`}
          annotation="Living expenses, commutes & commerce"
          icon={Wallet}
        />
        <VitrineMetric
          catalogNo="CATALOG #LR-04"
          title="Security Interceptions"
          value={aggregates.totalFraudAlerts.toLocaleString()}
          annotation="Proactive card anomaly defenses"
          icon={ShieldAlert}
        />
      </div>

      {/* Main Archival Activity Chart */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-4 gap-2">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
              FIG 1.0 // TEMPORAL CHRONOLOGY (2013–2024)
            </span>
            <h3 className="text-base font-mono font-bold text-white tracking-wide mt-0.5">
              SYNCHRONIZED LIFE CHRONOLOGY
            </h3>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono text-museum-muted">
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-archival-amber rounded-none" />
              <span>Audio Streams</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="h-2 w-2 bg-white/40 rounded-none" />
              <span>Financial Records</span>
            </span>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-archival-amber hover:underline text-xs font-mono ml-2 flex items-center"
            >
              <span>Explore Timeline</span>
              <ArrowUpRight className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMusicArchival" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4A373" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D4A373" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorFinanceArchival" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} />
              <YAxis stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1117',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0px',
                  color: '#EDE8DF',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Area type="monotone" dataKey="music" name="Audio Streams" stroke="#D4A373" strokeWidth={1.5} fillOpacity={1} fill="url(#colorMusicArchival)" />
              <Area type="monotone" dataKey="finance" name="Financial Records" stroke="#9CA3AF" strokeWidth={1} fillOpacity={1} fill="url(#colorFinanceArchival)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Curator Annotation Note */}
      <CuratorNote headline="The Multi-Lens Synthesis">
        "A traditional expense tracker registers ₹35 as a simple debit. The LIFE//RECEIPTS museum reconstructs it as two cups of morning cutting chai at a local stall outside Pune station, accompanied by Abbey Road playing on Android headphones at 08:30 AM before boarding the Sevagram Express. Data becomes lived experience."
      </CuratorNote>

      {/* Spotlight Curated Receipts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
              GALLERY PREVIEW // EXHIBIT SELECTION
            </span>
            <h3 className="text-base font-mono font-bold text-white tracking-wide mt-0.5">
              FEATURED ARTIFACT RECEIPTS
            </h3>
          </div>

          <button
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-mono text-archival-amber hover:underline flex items-center space-x-1"
          >
            <span>View All Records ({receipts.length.toLocaleString()})</span>
            <ArrowUpRight className="h-3 w-3 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spotlightReceipts.map(receipt => (
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
