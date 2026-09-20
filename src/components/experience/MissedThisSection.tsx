import React, { useState, useMemo } from 'react';
import { LifeReceipt } from '../../types/receipt';
import { LifeDiscovery, DiscoveryType } from '../../types/discoveries';
import { AnomalyDiscovery } from '../../engine/patternEngine';
import { discoverHighValueFindings } from '../../engine/discoveriesEngine';
import { DiscoveryCard } from './DiscoveryCard';
import { DiscoveryDetailModal } from './DiscoveryDetailModal';
import { Eye, Sparkles, Filter } from 'lucide-react';

interface MissedThisSectionProps {
  receipts?: LifeReceipt[];
  anomalies?: AnomalyDiscovery[];
  onSelectReceipt?: (r: LifeReceipt) => void;
}

type DiscoveryFilter = 'all' | DiscoveryType;

export const MissedThisSection: React.FC<MissedThisSectionProps> = ({
  receipts = [],
  anomalies = [],
  onSelectReceipt = () => {},
}) => {
  // Generate authentic high-value discoveries from normalized receipts
  const dynamicDiscoveries: LifeDiscovery[] = useMemo(() => {
    if (receipts && receipts.length > 0) {
      return discoverHighValueFindings(receipts);
    }
    return [];
  }, [receipts]);

  const [selectedType, setSelectedType] = useState<DiscoveryFilter>('all');
  const [activeModalDiscovery, setActiveModalDiscovery] = useState<LifeDiscovery | null>(null);

  // Filtered discoveries based on selected type tab
  const filteredDiscoveries = useMemo(() => {
    if (selectedType === 'all') return dynamicDiscoveries;
    return dynamicDiscoveries.filter(d => d.type === selectedType);
  }, [dynamicDiscoveries, selectedType]);

  if (dynamicDiscoveries.length === 0) return null;

  const filterTabs: { id: DiscoveryFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All Discoveries', count: dynamicDiscoveries.length },
    { id: 'micro_anomaly', label: 'Micro-Anomalies', count: dynamicDiscoveries.filter(d => d.type === 'micro_anomaly').length },
    { id: 'recurring_place', label: 'Geospatial Disparities', count: dynamicDiscoveries.filter(d => d.type === 'recurring_place').length },
    { id: 'repeated_entity', label: 'Super-Loyalty Entities', count: dynamicDiscoveries.filter(d => d.type === 'repeated_entity').length },
    { id: 'dense_cluster', label: 'Dense Clusters', count: dynamicDiscoveries.filter(d => d.type === 'dense_cluster').length },
    { id: 'unexpected_sequence', label: 'Causal Pipelines', count: dynamicDiscoveries.filter(d => d.type === 'unexpected_sequence').length },
    { id: 'strong_connection', label: 'Transit Sanctuary', count: dynamicDiscoveries.filter(d => d.type === 'strong_connection').length },
  ];

  return (
    <section id="missed-this" className="space-y-8 border-b border-white/[0.08] pb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-5 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase bg-archival-amber/10 border border-archival-amber/20 px-2.5 py-0.5 rounded">
              SECTION 07 // HIGH-VALUE EMPIRICAL DISCOVERIES
            </span>
            <span className="text-[10px] font-mono text-museum-muted">
              {dynamicDiscoveries.length} CURATED FINDINGS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-2 flex items-center space-x-3">
            <Eye className="h-6 w-6 text-archival-amber" />
            <span>7. YOU MIGHT HAVE MISSED THIS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted max-w-lg leading-relaxed">
          Surprising, defensible anomalies, hidden clusters, and quiet correlations uncovered deep across 11 years of normalized records.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <Filter className="h-3.5 w-3.5 text-museum-muted shrink-0 mr-1" />
        {filterTabs.map(tab => {
          if (tab.id !== 'all' && tab.count === 0) return null;
          const isActive = selectedType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono rounded whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-archival-amber text-black font-bold shadow-glow-amber-subtle'
                  : 'bg-[#12151E] text-museum-muted border border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-black/30 text-black' : 'bg-white/10 text-white/70'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Discoveries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDiscoveries.map(discovery => (
          <DiscoveryCard
            key={discovery.id}
            discovery={discovery}
            onExplore={(d) => setActiveModalDiscovery(d)}
          />
        ))}
      </div>

      {/* Discovery Detail Full Modal */}
      <DiscoveryDetailModal
        discovery={activeModalDiscovery}
        onClose={() => setActiveModalDiscovery(null)}
        onSelectReceipt={onSelectReceipt}
      />
    </section>
  );
};
