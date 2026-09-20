import React from 'react';
import { LifeReceipt } from '../types/receipt';
import { VitrineMetric } from '../components/museum/VitrineMetric';
import { MuseumReceiptCard } from '../components/museum/MuseumReceiptCard';
import { CuratorNote } from '../components/museum/CuratorNote';
import { Music, Clock, Radio, Headphones } from 'lucide-react';
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

  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const itemsPerPage = 18;
  const totalItems = spotReceipts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedReceipts = React.useMemo(() => {
    const start = (validPage - 1) * itemsPerPage;
    return spotReceipts.slice(start, start + itemsPerPage);
  }, [spotReceipts, validPage, itemsPerPage]);

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
          title="Total Streams"
          value={spotReceipts.length.toLocaleString()}
          annotation="11 calendar years logged"
          icon={Music}
          accent
        />
        <VitrineMetric
          catalogNo="AUDIO #02"
          title="Playback Hours"
          value={`${totalHours.toLocaleString()}h`}
          annotation="Across desktop and mobile"
          icon={Clock}
        />
        <VitrineMetric
          catalogNo="AUDIO #03"
          title="Top Discography"
          value="The Beatles"
          annotation="13,621 total plays"
          icon={Radio}
        />
        <VitrineMetric
          catalogNo="AUDIO #04"
          title="Late Night Peak"
          value="23:00–02:00"
          annotation="Deep study and focus hours"
          icon={Headphones}
        />
      </div>

      {/* Top Artists Chart */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-6 sm:p-8">
        <span className="text-[9px] font-mono tracking-widest text-museum-muted uppercase">
          CHART 4.1 // ARTIST DISCOGRAPHY AFFINITY
        </span>
        <h3 className="text-sm font-mono font-bold text-white tracking-wide mt-1 border-b border-white/[0.06] pb-3">
          MOST FREQUENTED ARTISTS (TOTAL TRACK PLAYS)
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

      {/* Streaming Logs List with Pagination */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-3 gap-2">
          <h3 className="text-base font-mono font-bold text-white tracking-wide">
            AUTHENTIC STREAMING LOGS
          </h3>
          <span className="text-xs font-mono text-museum-muted">
            Showing {((validPage - 1) * itemsPerPage) + 1}–{Math.min(validPage * itemsPerPage, totalItems)} of {totalItems.toLocaleString()} streams
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
