/**
 * Central Data Hook for LIFE//RECEIPTS
 * Manages dataset loading, reactive state, multi-facet filtering, global store access,
 * and the central LifeGraphEngine.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { LifeReceipt, NormalizationSummary, ReceiptSource, CanonicalCategory } from '../types/receipt';
import { LifeReceiptStore, QueryFilters } from '../utils/indexStore';
import { LifeGraphEngine } from '../engine/lifeGraphEngine';
import { ReceiptConnection } from '../types/graph';
import { loadAllLifeDatasets, LoadingProgress } from '../data/datasetLoader';
import { StoryReceiptChapter, generateLifeStories } from '../engine/storyGenerator';

export type ActiveTab =
  | 'overview'
  | 'timeline'
  | 'spending'
  | 'audio'
  | 'commerce'
  | 'stories'
  | 'graph';

export interface UseLifeReceiptsReturn {
  isLoading: boolean;
  progress: LoadingProgress;
  summary: NormalizationSummary | null;
  store: LifeReceiptStore | null;
  graphEngine: LifeGraphEngine | null;
  graphConnections: ReceiptConnection[];
  filteredReceipts: LifeReceipt[];
  aggregates: ReturnType<LifeReceiptStore['getAggregates']> | null;
  storyChapters: StoryReceiptChapter[];

  // Filter state & setters
  filters: QueryFilters;
  setFilters: React.Dispatch<React.SetStateAction<QueryFilters>>;
  updateFilter: <K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => void;
  resetFilters: () => void;

  // Mode toggles
  useSampleMode: boolean;
  setUseSampleMode: (val: boolean) => void;
  reloadDatasets: (sampleMode?: boolean) => Promise<void>;

  // Selection & UI State
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedReceipt: LifeReceipt | null;
  setSelectedReceipt: (r: LifeReceipt | null) => void;
}

export function useLifeReceipts(): UseLifeReceiptsReturn {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useSampleMode, setUseSampleMode] = useState<boolean>(true);
  const [progress, setProgress] = useState<LoadingProgress>({
    stage: 'idle',
    percent: 0,
    message: 'Initializing...',
    counts: { spotify: 0, household: 0, commerce: 0, total: 0 },
  });

  const [receipts, setReceipts] = useState<LifeReceipt[]>([]);
  const [summary, setSummary] = useState<NormalizationSummary | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedReceipt, setSelectedReceipt] = useState<LifeReceipt | null>(null);

  const [filters, setFilters] = useState<QueryFilters>({
    sources: [],
    categories: [],
    years: [],
    searchQuery: '',
    isFraudOnly: false,
  });

  // Debounce search query to prevent heavy analytical recalculation on every keystroke
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(filters.searchQuery || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery || '');
    }, 200);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.searchQuery]);

  const effectiveFilters = useMemo<QueryFilters>(() => {
    return {
      ...filters,
      searchQuery: debouncedSearchQuery,
    };
  }, [filters, debouncedSearchQuery]);

  // Load datasets
  const loadData = useCallback(async (sample = useSampleMode) => {
    try {
      setIsLoading(true);
      const result = await loadAllLifeDatasets(sample, p => setProgress(p));
      setReceipts(result.receipts);
      setSummary(result.summary);
    } catch (err) {
      console.error('Error loading life datasets:', err);
      setProgress(prev => ({
        ...prev,
        stage: 'ready',
        message: 'Failed to load some local files. Using fallback records.',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [useSampleMode]);

  useEffect(() => {
    loadData(useSampleMode);
  }, [useSampleMode, loadData]);

  // Create store instance
  const store = useMemo(() => {
    return new LifeReceiptStore(receipts);
  }, [receipts]);

  // Create LifeGraphEngine instance
  const graphEngine = useMemo(() => {
    return new LifeGraphEngine(receipts);
  }, [receipts]);

  // Compute graph connections reactively
  const graphConnections = useMemo(() => {
    if (!graphEngine || receipts.length === 0) return [];
    return graphEngine.discoverConnections({ minScore: 40, limit: 100 });
  }, [graphEngine, receipts]);

  // Compute filtered receipts reactive to debounced filters
  const filteredReceipts = useMemo(() => {
    if (!store) return [];
    return store.query(effectiveFilters);
  }, [store, effectiveFilters]);

  // Compute aggregates (returns precomputed cached aggregates in O(1) if full dataset)
  const aggregates = useMemo(() => {
    if (!store) return null;
    if (filteredReceipts.length === receipts.length) {
      return store.getAggregates();
    }
    return store.getAggregates(filteredReceipts);
  }, [store, filteredReceipts, receipts.length]);

  // Generate stories
  const storyChapters = useMemo(() => {
    if (!store || receipts.length === 0) return [];
    return generateLifeStories(store);
  }, [store, receipts]);

  const updateFilter = useCallback(<K extends keyof QueryFilters>(key: K, value: QueryFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      sources: [],
      categories: [],
      years: [],
      searchQuery: '',
      isFraudOnly: false,
    });
  }, []);

  return {
    isLoading,
    progress,
    summary,
    store,
    graphEngine,
    graphConnections,
    filteredReceipts,
    aggregates,
    storyChapters,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    useSampleMode,
    setUseSampleMode,
    reloadDatasets: loadData,
    activeTab,
    setActiveTab,
    selectedReceipt,
    setSelectedReceipt,
  };
}
