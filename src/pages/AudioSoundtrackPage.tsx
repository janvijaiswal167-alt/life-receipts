import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import { Music2, Radio, Disc, Smartphone } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface AudioSoundtrackPageProps {
  receipts: LifeReceipt[];
  onSelectReceipt: (r: LifeReceipt) => void;
}

export const AudioSoundtrackPage: React.FC<AudioSoundtrackPageProps> = ({
  receipts,
  onSelectReceipt,
}) => {
  const spotReceipts = receipts.filter(r => r.source === 'spotify');

  const totalMs = spotReceipts.reduce((sum, r) => sum + (r.metadata?.durationMs || 0), 0);
  const totalHours = Math.round((totalMs / (1000 * 3600)) * 10) / 10;

  // Compute top artists
  const artistCounts: Record<string, number> = {};
  for (let i = 0; i < spotReceipts.length; i++) {
    const r = spotReceipts[i];
    const artist = r.subtitle;
    if (artist) artistCounts[artist] = (artistCounts[artist] || 0) + 1;
  }

  const topArtistsData = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, plays]) => ({ name, plays }));

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
          EXHIBIT 04 // THE ACOUSTIC ARCHIVE (2013–2024)
        </span>
        <h2 className="mt-2 text-3xl font-serif text-[#FAF8F5]">
          A Decade of Sonic Telemetry
        </h2>
        <p className="mt-1 text-xs font-serif italic text-museum-muted">
          149,860 listening logs charting personal moods, artist eras, all-night focus sessions, and physical hardware transitions.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <VitrineMetric
          catalogNo="AUDIO #01"
          title="Playback Duration"
          value={`${totalHours}h`}
          annotation="5,341 total hours across 11.4 years"
          icon={Music2}
          accent
        />
        <VitrineMetric
          catalogNo="AUDIO #02"
          title="#1 Top Artist"
          value={topArtistsData[0]?.name || 'The Beatles'}
          annotation={`${topArtistsData[0]?.plays.toLocaleString()} plays recorded`}
          icon={Disc}
        />
        <VitrineMetric
          catalogNo="AUDIO #03"
          title="#2 Top Artist"
          value={topArtistsData[1]?.name || 'The Killers'}
          annotation={`${topArtistsData[1]?.plays.toLocaleString()} plays recorded`}
          icon={Radio}
        />
        <VitrineMetric
          catalogNo="AUDIO #04"
          title="Primary Medium"
          value="Mobile Stream"
          annotation="93.3% on Android & iOS transit"
          icon={Smartphone}
        />
      </div>

      {/* Top 10 Artists Chart */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8">
        <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
          CHART 4.1 // DISCOGRAPHY REPETITION INDEX
        </span>
        <h3 className="text-sm font-mono font-bold text-white tracking-wide mt-1 border-b border-white/[0.06] pb-3">
          MOST STREAMED ARTISTS (TOTAL PLAYS)
        </h3>

        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topArtistsData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} angle={-25} textAnchor="end" />
              <YAxis stroke="#333844" tick={{ fill: '#8A909E', fontSize: 10, fontFamily: 'monospace' }} />
              <Tooltip
                formatter={(val: any) => [`${val.toLocaleString()} streams`, 'Plays']}
                contentStyle={{
                  backgroundColor: '#0F1117',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '0px',
                  color: '#EDE8DF',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                }}
              />
              <Bar dataKey="plays" fill="#D4A373" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <CuratorNote headline="The Beatles Obsession Era">
        "Over 13,600 plays were dedicated to The Beatles—most notably during late evening study hours between 2016 and 2018. Over 74% of tracks were played on shuffle, yet completion rates remained above 94%, signaling deep intentional listening."
      </CuratorNote>

      {/* Feed */}
      <div className="space-y-4">
        <h3 className="text-base font-mono font-bold text-white tracking-wide border-b border-white/[0.08] pb-2">
          AUTHENTIC STREAMING LOGS
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spotReceipts.slice(0, 18).map(receipt => (
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
