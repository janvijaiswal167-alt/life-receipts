import React, { useState } from 'react';
import { LifeReceipt } from '../../types/receipt';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Music2, Wallet, Calendar, ArrowRight } from 'lucide-react';

interface LifePulseSectionProps {
  receipts: LifeReceipt[];
  onSelectYearFilter?: (year: number) => void;
}

export const LifePulseSection: React.FC<LifePulseSectionProps> = ({
  receipts,
  onSelectYearFilter,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2017);

  // Group receipts by year and source
  const yearlyMetrics: Record<number, { year: number; total: number; music: number; household: number; commerce: number; spend: number; hours: number }> = {};
  for (let y = 2013; y <= 2024; y++) {
    yearlyMetrics[y] = { year: y, total: 0, music: 0, household: 0, commerce: 0, spend: 0, hours: 0 };
  }

  for (let i = 0; i < receipts.length; i++) {
    const r = receipts[i];
    if (yearlyMetrics[r.year]) {
      yearlyMetrics[r.year].total++;
      if (r.source === 'spotify') {
        yearlyMetrics[r.year].music++;
        yearlyMetrics[r.year].hours += (r.metadata?.durationMs || 0) / (1000 * 3600);
      } else if (r.source === 'household') {
        yearlyMetrics[r.year].household++;
        yearlyMetrics[r.year].spend += r.amount || 0;
      } else if (r.source === 'commerce') {
        yearlyMetrics[r.year].commerce++;
        yearlyMetrics[r.year].spend += r.amount || 0;
      }
    }
  }

  const chartData = Object.values(yearlyMetrics);
  const activeYearData = yearlyMetrics[selectedYear] || yearlyMetrics[2017];

  // Specific receipts for selected year
  const yearReceipts = receipts.filter(r => r.year === selectedYear);
  const yearTopArtist = yearReceipts.filter(r => r.source === 'spotify')[0]?.subtitle || 'The Beatles';

  return (
    <section id="life-pulse" className="space-y-6 border-b border-white/[0.08] pb-16">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 01 // VITALITY & DENSITY MONITOR
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <Activity className="h-6 w-6 text-archival-amber" />
            <span>1. LIFE PULSE</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted">
          Click any year in the timeline below to inspect life velocity and density.
        </p>
      </div>

      {/* Main Dual View: Chart on Left, Interactive Year Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Timeline Area Rhythm */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 text-xs font-mono">
            <span className="text-white font-bold">MULTI-DECADE RHYTHM (2013–2024)</span>
            <span className="text-archival-amber">ACTIVE INSPECT: {selectedYear}</span>
          </div>

          <div className="h-64 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e: any) => {
                  if (e && e.activePayload && e.activePayload[0]) {
                    const y = e.activePayload[0].payload.year;
                    setSelectedYear(y);
                  }
                }}
              >
                <defs>
                  <linearGradient id="pulseMusic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4A373" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4A373" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="pulseFinance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FAF8F5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FAF8F5" stopOpacity={0} />
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
                <Area type="monotone" dataKey="music" name="Audio Streams" stroke="#D4A373" strokeWidth={1.5} fillOpacity={1} fill="url(#pulseMusic)" />
                <Area type="monotone" dataKey="household" name="Household Records" stroke="#FAF8F5" strokeWidth={1} fillOpacity={1} fill="url(#pulseFinance)" />
                <Area type="monotone" dataKey="commerce" name="Commerce Records" stroke="#9CA3AF" strokeWidth={1} fillOpacity={1} fill="url(#pulseFinance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Year Pill Selector */}
          <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.06]">
            {Object.keys(yearlyMetrics).map(yrStr => {
              const yr = parseInt(yrStr, 10);
              const isActive = yr === selectedYear;
              return (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`border px-2.5 py-1 text-[10px] font-mono transition-all ${
                    isActive
                      ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold shadow-glow-amber-subtle'
                      : 'border-white/10 bg-[#151821] text-museum-muted hover:text-white'
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Year Inspector Card */}
        <div className="border border-white/[0.08] bg-[#0F1117] p-6 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
              YEAR AUDIT // ANNOTATION
            </span>
            <h3 className="text-3xl font-serif text-archival-amber mt-1">
              Year {selectedYear}
            </h3>
            <p className="text-xs font-serif italic text-museum-muted mt-1">
              {activeYearData.total.toLocaleString()} authenticated life events logged.
            </p>
          </div>

          <div className="my-6 space-y-3 font-mono text-xs border-y border-white/[0.06] py-4">
            <div className="flex justify-between items-center">
              <span className="text-museum-muted flex items-center space-x-1">
                <Music2 className="h-3 w-3 text-archival-amber" />
                <span>Audio Playback:</span>
              </span>
              <span className="text-white font-bold">{Math.round(activeYearData.hours)} hrs ({activeYearData.music.toLocaleString()} tracks)</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-museum-muted flex items-center space-x-1">
                <Wallet className="h-3 w-3 text-archival-amber" />
                <span>Financial Outflow:</span>
              </span>
              <span className="text-white font-bold">₹{activeYearData.spend.toLocaleString('en-IN')}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-museum-muted">Top Recorded Sound:</span>
              <span className="text-archival-amber truncate max-w-[140px]">{yearTopArtist}</span>
            </div>
          </div>

          <button
            onClick={() => onSelectYearFilter?.(selectedYear)}
            className="w-full inline-flex items-center justify-center space-x-1 border border-white/20 bg-[#151821] py-2 text-[11px] font-mono text-museum-text hover:border-archival-amber/60 hover:text-white transition-colors cursor-pointer"
          >
            <span>View All Year {selectedYear} Receipts</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </section>
  );
};
