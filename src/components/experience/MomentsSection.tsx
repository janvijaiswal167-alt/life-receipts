import React, { useState } from 'react';
import { LifeMoment } from '../../types/moments';
import { LifeReceipt } from '../../types/receipt';
import { CrossConnection } from '../../engine/patternEngine';
import { LifePattern } from '../../types/patterns';
import { LifeChapter } from '../../types/chapters';
import { MomentCard } from './MomentCard';
import { MomentDetailModal } from './MomentDetailModal';
import { Milestone, Sparkles } from 'lucide-react';

interface MomentsSectionProps {
  moments: LifeMoment[];
  onSelectReceipt: (r: LifeReceipt) => void;
  allConnections?: CrossConnection[];
  allPatterns?: LifePattern[];
  allChapters?: LifeChapter[];
  onSelectConnection?: (c: CrossConnection) => void;
  onSelectPattern?: (p: LifePattern) => void;
  onSelectChapter?: (ch: LifeChapter) => void;
}

export const MomentsSection: React.FC<MomentsSectionProps> = ({
  moments,
  onSelectReceipt,
  allConnections = [],
  allPatterns = [],
  allChapters = [],
  onSelectConnection,
  onSelectPattern,
  onSelectChapter,
}) => {
  const [selectedMoment, setSelectedMoment] = useState<LifeMoment | null>(null);

  return (
    <section id="moments" className="space-y-6 border-b border-white/[0.08] pb-16 font-mono">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/[0.06] pb-4 gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
            SECTION 02 // BEHAVIORAL & EPISODIC MOMENTS ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#FAF8F5] tracking-tight mt-1 flex items-center space-x-2">
            <Milestone className="h-6 w-6 text-archival-amber" />
            <span>2. MOMENTS</span>
          </h2>
        </div>
        <p className="text-xs font-serif italic text-museum-muted max-w-xl">
          Coherent episodes of daily life grouped through explainable temporal, spatial, entity, and category signals. Click any moment to inspect the underlying multi-dataset records.
        </p>
      </div>

      {/* Moments Vitrine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moments.map(m => (
          <MomentCard
            key={m.id}
            moment={m}
            onOpenMoment={moment => setSelectedMoment(moment)}
            onSelectReceipt={onSelectReceipt}
          />
        ))}
      </div>

      {/* Interactive Moment Inspection Modal */}
      <MomentDetailModal
        moment={selectedMoment}
        onClose={() => setSelectedMoment(null)}
        onSelectReceipt={onSelectReceipt}
        allConnections={allConnections}
        allPatterns={allPatterns}
        allChapters={allChapters}
        onSelectConnection={onSelectConnection}
        onSelectPattern={onSelectPattern}
        onSelectChapter={onSelectChapter}
      />
    </section>
  );
};
