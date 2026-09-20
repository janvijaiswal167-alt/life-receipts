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

  return (
    <div className="space-y-8 animate-fadeIn font-mono">
      {/* Editorial Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <span className="text-[10px] font-mono tracking-widest text-archival-amber uppercase">
          EXHIBIT 06 // TOPOLOGY GRAPH & INTERACTIVE CONNECTIONS VISUALIZATION
        </span>
        <h2 className="mt-2 text-3xl font-serif text-[#FAF8F5]">
          The Relational Web of Living
        </h2>
        <p className="mt-1 text-xs font-serif italic text-museum-muted">
          Interactive graph mapping the explainable bridges between audio playback, daily household routines, and digital commerce.
        </p>
      </div>

      {/* Main Canvas + Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Graph Canvas */}
        <div className={selectedNodeId ? 'lg:col-span-8' : 'lg:col-span-12'}>
          {/* Controls & Filter Bar */}
          <div className="border border-white/[0.08] bg-[#0F1117] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3">
            {/* Filter Dropdown & Strongest Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2.5 py-1">
                <Filter className="h-3 w-3 text-archival-amber" />
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
                className={`border px-3 py-1 text-[11px] transition-all ${
                  showStrongestOnly
                    ? 'border-archival-amber bg-archival-amber/20 text-archival-amber font-bold'
                    : 'border-white/10 bg-[#151821] text-museum-muted hover:text-white'
                }`}
              >
                <Zap className="h-3 w-3 inline mr-1" />
                <span>Strongest Only (Score ≥ 70)</span>
              </button>

              {selectedNodeId && (
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="flex items-center space-x-1 border border-white/10 bg-[#151821] px-2.5 py-1 text-[11px] text-museum-muted hover:text-archival-amber transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset Selection</span>
                </button>
              )}
            </div>

            {/* Counts & Instructions */}
            <div className="flex items-center space-x-3 text-[10px] text-museum-muted">
              <span>{nodes.length} NODES</span>
              <span>•</span>
              <span>{edges.length} EXPLAINABLE EDGES</span>
            </div>
          </div>

          {/* Interactive ReactFlow Container */}
          <div className="h-[620px] w-full border border-white/[0.08] bg-[#07080B] relative">
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

            {/* Floating Hint Overlay */}
            <div className="absolute bottom-3 left-3 border border-white/10 bg-[#0F1117]/90 px-3 py-1.5 text-[10px] text-museum-muted pointer-events-none">
              <span>Click any node to isolate connections and reveal explainable proof</span>
            </div>
          </div>
        </div>

        {/* Right Selected Node Inspector Panel */}
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

      <CuratorNote headline="Topological Grounding Standard">
        "Every visible edge on this graph represents a verified, explainable relationship discovered through temporal synchrony, geographic co-location, shared merchant entities, or sequential financial life workflows. No decorative or synthetic connections are rendered."
      </CuratorNote>
    </div>
  );
};
