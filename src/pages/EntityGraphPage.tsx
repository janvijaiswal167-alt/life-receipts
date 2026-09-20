import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  Network,
  Sparkles,
  GitMerge,
  Filter,
  RotateCcw,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { ReceiptConnection } from '../types/graph';
import { LifeReceipt } from '../types/receipt';
import { LifeMoment } from '../types/moments';
import { extractLifeMoments } from '../engine/momentsEngine';
import { ReceiptNode } from '../components/graph/ReceiptNode';
import { MomentNode } from '../components/graph/MomentNode';
import { GraphInspectorPanel } from '../components/graph/GraphInspectorPanel';
import { CuratorNote } from '../components/museum/CuratorNote';

interface EntityGraphPageProps {
  receipts?: LifeReceipt[];
  connections?: ReceiptConnection[];
  onSelectReceipt?: (r: LifeReceipt) => void;
}

const nodeTypes = {
  receiptNode: ReceiptNode,
  momentNode: MomentNode,
};

export const EntityGraphPage: React.FC<EntityGraphPageProps> = ({
  receipts = [],
  connections = [],
  onSelectReceipt = () => {},
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [showStrongestOnly, setShowStrongestOnly] = useState<boolean>(false);

  // Extract structured moments from receipts
  const moments = useMemo(() => {
    return extractLifeMoments(receipts);
  }, [receipts]);

  // Map of all receipts by ID
  const receiptMap = useMemo(() => {
    const map = new Map<string, LifeReceipt>();
    receipts.forEach(r => map.set(r.id, r));
    return map;
  }, [receipts]);

  // Selected node entity (Receipt or Moment)
  const selectedReceipt = useMemo(() => {
    if (!selectedNodeId) return null;
    if (selectedNodeId.startsWith('rec-')) {
      const id = selectedNodeId.replace('rec-', '');
      return receiptMap.get(id) || null;
    }
    return null;
  }, [selectedNodeId, receiptMap]);

  const selectedMoment = useMemo(() => {
    if (!selectedNodeId) return null;
    if (selectedNodeId.startsWith('moment-')) {
      return moments.find(m => m.id === selectedNodeId) || null;
    }
    return null;
  }, [selectedNodeId, moments]);

  // Incident connections for the selected node
  const incidentConnections = useMemo(() => {
    if (!selectedReceipt) return [];
    return connections.filter(
      c => c.sourceReceipt.id === selectedReceipt.id || c.targetReceipt.id === selectedReceipt.id
    );
  }, [selectedReceipt, connections]);

  // Set of connected neighbor node IDs for highlighting
  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    if (!selectedNodeId) return set;
    set.add(selectedNodeId);

    if (selectedReceipt) {
      incidentConnections.forEach(c => {
        set.add(`rec-${c.sourceReceipt.id}`);
        set.add(`rec-${c.targetReceipt.id}`);
      });
      // Also add moments containing this receipt
      moments.forEach(m => {
        if (m.receipts.some(r => r.id === selectedReceipt.id)) {
          set.add(m.id);
        }
      });
    }

    if (selectedMoment) {
      selectedMoment.receipts.forEach(r => set.add(`rec-${r.id}`));
    }

    return set;
  }, [selectedNodeId, selectedReceipt, selectedMoment, incidentConnections, moments]);

  // Build ReactFlow Nodes & Edges dynamically from real connections & moments
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const seenNodeIds = new Set<string>();

    // 1. Add Moment Nodes (Central Episode Anchors)
    const displayMoments = moments.slice(0, 4);
    displayMoments.forEach((m, idx) => {
      const posX = 360 + (idx % 2 === 0 ? -260 : 260);
      const posY = 100 + Math.floor(idx / 2) * 380;

      nodes.push({
        id: m.id,
        type: 'momentNode',
        position: { x: posX, y: posY },
        data: {
          moment: m,
          isSelected: selectedNodeId === m.id,
          isConnected: connectedNodeIds.has(m.id),
          isDimmed: Boolean(selectedNodeId && !connectedNodeIds.has(m.id)),
        },
      });
      seenNodeIds.add(m.id);

      // Add constituent receipt nodes around the moment
      m.receipts.slice(0, 3).forEach((r, rIdx) => {
        const rNodeId = `rec-${r.id}`;
        if (!seenNodeIds.has(rNodeId)) {
          const offsetX = (rIdx - 1) * 280;
          const offsetY = idx % 2 === 0 ? -140 : 160;

          nodes.push({
            id: rNodeId,
            type: 'receiptNode',
            position: { x: posX + offsetX, y: posY + offsetY },
            data: {
              receipt: r,
              isSelected: selectedNodeId === rNodeId,
              isConnected: connectedNodeIds.has(rNodeId),
              isDimmed: Boolean(selectedNodeId && !connectedNodeIds.has(rNodeId)),
              onSelectReceipt,
            },
          });
          seenNodeIds.add(rNodeId);
        }

        // Structural Moment -> Receipt Edge
        const edgeId = `edge-m-${m.id}-${r.id}`;
        const isIncident = selectedNodeId === m.id || selectedNodeId === rNodeId;
        const isDimmed = Boolean(selectedNodeId && !isIncident);

        edges.push({
          id: edgeId,
          source: m.id,
          target: rNodeId,
          type: 'smoothstep',
          style: {
            stroke: isIncident ? '#D4A373' : 'rgba(255, 255, 255, 0.2)',
            strokeWidth: isIncident ? 2.5 : 1.5,
            strokeDasharray: '4,4',
            opacity: isDimmed ? 0.15 : 1,
          },
          animated: isIncident,
        });
      });
    });

    // 2. Add Pairwise Explainable Relationship Edges from LifeGraphEngine
    const displayConns = connections
      .filter(c => {
        if (showStrongestOnly && c.score < 70) return false;
        if (sourceFilter === 'cross' && !c.crossDataset) return false;
        if (sourceFilter === 'spotify' && c.sourceReceipt.source !== 'spotify' && c.targetReceipt.source !== 'spotify') return false;
        if (sourceFilter === 'household' && c.sourceReceipt.source !== 'household' && c.targetReceipt.source !== 'household') return false;
        if (sourceFilter === 'commerce' && c.sourceReceipt.source !== 'commerce' && c.targetReceipt.source !== 'commerce') return false;
        return true;
      })
      .slice(0, 15);

    displayConns.forEach(conn => {
      const sourceNodeId = `rec-${conn.sourceReceipt.id}`;
      const targetNodeId = `rec-${conn.targetReceipt.id}`;

      // Ensure both nodes exist in the graph
      if (!seenNodeIds.has(sourceNodeId)) {
        nodes.push({
          id: sourceNodeId,
          type: 'receiptNode',
          position: { x: 80, y: 320 + nodes.length * 40 },
          data: {
            receipt: conn.sourceReceipt,
            isSelected: selectedNodeId === sourceNodeId,
            isConnected: connectedNodeIds.has(sourceNodeId),
            isDimmed: Boolean(selectedNodeId && !connectedNodeIds.has(sourceNodeId)),
            onSelectReceipt,
          },
        });
        seenNodeIds.add(sourceNodeId);
      }

      if (!seenNodeIds.has(targetNodeId)) {
        nodes.push({
          id: targetNodeId,
          type: 'receiptNode',
          position: { x: 620, y: 320 + nodes.length * 40 },
          data: {
            receipt: conn.targetReceipt,
            isSelected: selectedNodeId === targetNodeId,
            isConnected: connectedNodeIds.has(targetNodeId),
            isDimmed: Boolean(selectedNodeId && !connectedNodeIds.has(targetNodeId)),
            onSelectReceipt,
          },
        });
        seenNodeIds.add(targetNodeId);
      }

      // Relationship Edge with visual strength communication
      const edgeId = `edge-${conn.id}`;
      const isIncident = selectedNodeId === sourceNodeId || selectedNodeId === targetNodeId;
      const isDimmed = Boolean(selectedNodeId && !isIncident);

      let strokeColor = '#38BDF8';
      let strokeWidth = 1.5;
      if (conn.strength === 'pivotal') {
        strokeColor = '#D4A373';
        strokeWidth = 3;
      } else if (conn.strength === 'strong') {
        strokeColor = '#10B981';
        strokeWidth = 2.5;
      }

      edges.push({
        id: edgeId,
        source: sourceNodeId,
        target: targetNodeId,
        type: 'default',
        label: isIncident || conn.strength === 'pivotal' ? `${conn.relationshipType} (${conn.score})` : undefined,
        labelStyle: {
          fill: strokeColor,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '9px',
          fontWeight: 700,
        },
        labelBgStyle: {
          fill: '#0F1117',
          fillOpacity: 0.9,
          stroke: strokeColor,
          strokeWidth: 0.5,
        },
        style: {
          stroke: strokeColor,
          strokeWidth: isIncident ? strokeWidth + 1.5 : strokeWidth,
          opacity: isDimmed ? 0.12 : 1,
        },
        animated: isIncident || conn.strength === 'pivotal',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 12,
          height: 12,
        },
      });
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [
    moments,
    connections,
    selectedNodeId,
    connectedNodeIds,
    sourceFilter,
    showStrongestOnly,
    onSelectReceipt,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state when selection or filters change
  React.useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const handleNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(prev => (prev === node.id ? null : node.id));
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');

  // Filtered connections list for mobile-friendly view
  const filteredConnectionsList = useMemo(() => {
    return connections.filter(c => {
      if (showStrongestOnly && c.score < 70) return false;
      if (sourceFilter === 'cross' && !c.crossDataset) return false;
      if (sourceFilter === 'spotify' && c.sourceReceipt.source !== 'spotify' && c.targetReceipt.source !== 'spotify') return false;
      if (sourceFilter === 'household' && c.sourceReceipt.source !== 'household' && c.targetReceipt.source !== 'household') return false;
      if (sourceFilter === 'commerce' && c.sourceReceipt.source !== 'commerce' && c.targetReceipt.source !== 'commerce') return false;
      return true;
    });
  }, [connections, showStrongestOnly, sourceFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn font-mono">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-5 sm:pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
              EXHIBIT 06 // TOPOLOGY GRAPH & INTERACTIVE CONNECTIONS
            </span>
            <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-serif text-[#FAF8F5]">
              The Relational Web of Living
            </h2>
            <p className="mt-1 text-xs font-serif italic text-museum-muted">
              Interactive graph mapping the explainable bridges between audio playback, daily household routines, and digital commerce.
            </p>
          </div>

          {/* View Mode Toggle: Canvas vs Mobile-Friendly Relational List */}
          <div className="flex items-center space-x-1 border border-white/10 bg-[#0F1117] p-1 self-start md:self-auto">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs transition-all cursor-pointer ${
                viewMode === 'canvas'
                  ? 'border border-archival-amber/50 bg-archival-amber/15 text-archival-amber font-bold shadow-glow-amber-subtle'
                  : 'text-museum-muted hover:text-white border border-transparent'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Graph Canvas</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'border border-archival-amber/50 bg-archival-amber/15 text-archival-amber font-bold shadow-glow-amber-subtle'
                  : 'text-museum-muted hover:text-white border border-transparent'
              }`}
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Relational Dossier (Mobile View)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Controller Bar */}
      <div className="border border-white/[0.08] bg-[#0F1117] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2.5 py-1.5">
            <Filter className="h-3.5 w-3.5 text-archival-amber" />
            <select
              value={sourceFilter}
              onChange={e => setSourceFilter(e.target.value)}
              className="bg-transparent text-white text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0F1117]">All Connections</option>
              <option value="cross" className="bg-[#0F1117]">Cross-Dataset Only</option>
              <option value="spotify" className="bg-[#0F1117]">Spotify Streams</option>
              <option value="household" className="bg-[#0F1117]">Household Ledger</option>
              <option value="commerce" className="bg-[#0F1117]">Commerce & Risk</option>
            </select>
          </div>

          <button
            onClick={() => setShowStrongestOnly(!showStrongestOnly)}
            className={`border px-3 py-1.5 text-[11px] transition-all cursor-pointer ${
              showStrongestOnly
                ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold'
                : 'border-white/10 bg-[#151821] text-museum-muted hover:text-white'
            }`}
          >
            <Zap className="h-3 w-3 inline mr-1" />
            <span>Score ≥ 70</span>
          </button>

          {selectedNodeId && (
            <button
              onClick={() => setSelectedNodeId(null)}
              className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2.5 py-1.5 text-[11px] text-museum-muted hover:text-archival-amber transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 text-[10px] text-museum-muted">
          <span>{nodes.length} NODES</span>
          <span>•</span>
          <span>{filteredConnectionsList.length} EXPLAINABLE EDGES</span>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE REACTFLOW CANVAS */}
      {viewMode === 'canvas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className={selectedNodeId ? 'lg:col-span-8' : 'lg:col-span-12'}>
            <div className="h-[420px] sm:h-[620px] w-full border border-white/[0.08] bg-[#07080B] relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                fitView
                minZoom={0.2}
                maxZoom={1.8}
              >
                <Background color="#141722" gap={24} size={1} />
                <Controls className="bg-[#0F1117] border border-white/10 text-white rounded-none shadow-lg" />
              </ReactFlow>

              <div className="absolute bottom-3 left-3 border border-white/10 bg-[#0F1117]/90 px-3 py-1.5 text-[9px] sm:text-[10px] text-museum-muted pointer-events-none">
                <span>Tap any node to isolate connections and reveal explainable proof</span>
              </div>
            </div>
          </div>

          {selectedNodeId && (
            <div className="lg:col-span-4 sticky top-24">
              <GraphInspectorPanel
                selectedReceipt={selectedReceipt}
                selectedMoment={selectedMoment}
                incidentConnections={incidentConnections}
                onClearSelection={() => setSelectedNodeId(null)}
                onSelectReceipt={onSelectReceipt}
              />
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: RELATIONAL DOSSIER LIST (MOBILE-FRIENDLY FALLBACK) */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Section A: Multi-Receipt Central Moments */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-archival-amber uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>CENTRAL EPISODIC MOMENTS ({moments.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {moments.slice(0, 4).map(m => (
                <div
                  key={m.id}
                  className="border border-white/10 bg-[#0F1117] p-4 space-y-3 hover:border-archival-amber/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="border border-archival-amber/40 bg-archival-amber/10 px-2 py-0.5 text-archival-amber font-bold uppercase">
                      {m.badge}
                    </span>
                    <span className="text-museum-muted">{m.timeRange.formattedSpan}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white font-serif">{m.title}</h4>
                    <p className="text-xs font-serif italic text-museum-muted mt-0.5">{m.subtitle}</p>
                  </div>

                  <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed border-t border-white/[0.04] pt-2">
                    {m.explanation.summary}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] uppercase tracking-widest text-museum-faint block">
                      CONSTITUENT ARTIFACTS ({m.receipts.length}):
                    </span>
                    {m.receipts.map(r => (
                      <div
                        key={r.id}
                        onClick={() => onSelectReceipt(r)}
                        className="flex items-center justify-between p-2 bg-[#151821] border border-white/5 hover:border-archival-amber/40 transition-colors cursor-pointer text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="text-white font-bold block truncate">{r.title}</span>
                          <span className="text-[10px] text-museum-muted">{r.source.toUpperCase()} • {r.dateStr}</span>
                        </div>
                        <span className="text-[10px] text-archival-amber whitespace-nowrap flex items-center">
                          <span>Inspect</span>
                          <Maximize2 className="h-2.5 w-2.5 ml-1" />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Pairwise Cross-Dataset Connections */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <GitMerge className="h-4 w-4" />
              <span>VERIFIED RELATIONSHIP PAIRS ({filteredConnectionsList.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnectionsList.map(conn => (
                <div
                  key={conn.id}
                  className="border border-white/10 bg-[#0F1117] p-4 space-y-3 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className={`px-2 py-0.5 font-bold uppercase ${
                      conn.strength === 'pivotal'
                        ? 'border border-archival-amber/40 bg-archival-amber/10 text-archival-amber'
                        : 'border border-emerald-900/50 bg-emerald-950/30 text-emerald-400'
                    }`}>
                      {conn.strength.toUpperCase()} LINK
                    </span>
                    <span className="text-white font-bold font-mono">Score: {conn.score}/100</span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">{conn.relationshipType}</h4>
                    <p className="text-[11px] font-mono text-archival-amber mt-0.5">{conn.sourceReceipt.title} ↔ {conn.targetReceipt.title}</p>
                  </div>

                  <p className="text-xs font-serif text-[#D6D2C4] leading-relaxed border-t border-white/[0.04] pt-2">
                    {conn.reasons.join(' • ')}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.04] text-[10px]">
                    <button
                      onClick={() => onSelectReceipt(conn.sourceReceipt)}
                      className="p-2 bg-[#151821] border border-white/10 text-left hover:border-archival-amber transition-colors cursor-pointer"
                    >
                      <span className="text-museum-faint block uppercase">EXHIBIT A:</span>
                      <span className="text-white font-bold truncate block">{conn.sourceReceipt.title}</span>
                      <span className="text-archival-amber">{conn.sourceReceipt.source}</span>
                    </button>

                    <button
                      onClick={() => onSelectReceipt(conn.targetReceipt)}
                      className="p-2 bg-[#151821] border border-white/10 text-left hover:border-archival-amber transition-colors cursor-pointer"
                    >
                      <span className="text-museum-faint block uppercase">EXHIBIT B:</span>
                      <span className="text-white font-bold truncate block">{conn.targetReceipt.title}</span>
                      <span className="text-archival-amber">{conn.targetReceipt.source}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CuratorNote headline="Topological Grounding Standard">
        "Every visible edge on this graph represents a verified, explainable relationship discovered through temporal synchrony, geographic co-location, shared merchant entities, or sequential financial life workflows. No decorative or synthetic connections are rendered."
      </CuratorNote>
    </div>
  );
};
