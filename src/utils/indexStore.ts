/**
 * High-performance In-Memory Index & Query Store for LifeReceipts
 * Optimized for large-scale datasets (150,000+ records) with multi-level inverted indexes,
 * precomputed aggregations, token-based inverted search index, and cached derived statistics.
 */

import type { LifeReceipt, ReceiptSource, CanonicalCategory, ReceiptType } from '../types/receipt.ts';

export type SortOption =
  | 'date_desc'
  | 'date_asc'
  | 'amount_desc'
  | 'amount_asc'
  | 'duration_desc'
  | 'relevance';

export interface QueryFilters {
  sources?: ReceiptSource[];
  categories?: CanonicalCategory[];
  types?: ReceiptType[];
  years?: number[];
  searchQuery?: string;
  minAmount?: number;
  maxAmount?: number;
  isFraudOnly?: boolean;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  entityName?: string;
  sortBy?: SortOption;
}

export interface StoreAggregates {
  totalReceipts: number;
  totalExpenseInr: number;
  totalIncomeInr: number;
  totalMusicHours: number;
  totalFraudAlerts: number;
  categoryDistribution: Record<string, { count: number; totalAmount: number }>;
  topArtists: Array<[string, number]>;
  topMerchants: Array<[string, number]>;
}

export class LifeReceiptStore {
  private receipts: LifeReceipt[] = [];
  private byId = new Map<string, LifeReceipt>();
  private byYear = new Map<number, LifeReceipt[]>();
  private byDate = new Map<string, LifeReceipt[]>();
  private byCategory = new Map<string, LifeReceipt[]>();
  private bySource = new Map<ReceiptSource, LifeReceipt[]>();
  private entityIndex = new Map<string, Set<string>>(); // Lowercase entity name -> Set of Receipt IDs
  private tokenIndex = new Map<string, Set<string>>();  // Lowercase word token -> Set of Receipt IDs

  // Precomputed full dataset aggregates
  private cachedFullAggregates: StoreAggregates | null = null;

  constructor(receipts: LifeReceipt[] = []) {
    if (receipts.length > 0) {
      this.loadReceipts(receipts);
    }
  }

  /**
   * Loads receipts and constructs high-speed multi-level inverted indexes in a single O(N) pass
   */
  public loadReceipts(receipts: LifeReceipt[]): void {
    this.receipts = receipts;
    this.byId.clear();
    this.byYear.clear();
    this.byDate.clear();
    this.byCategory.clear();
    this.bySource.clear();
    this.entityIndex.clear();
    this.tokenIndex.clear();

    const len = receipts.length;
    for (let i = 0; i < len; i++) {
      const r = receipts[i];

      // 1. ID Map
      this.byId.set(r.id, r);

      // 2. Year Bucket
      let yearArr = this.byYear.get(r.year);
      if (!yearArr) {
        yearArr = [];
        this.byYear.set(r.year, yearArr);
      }
      yearArr.push(r);

      // 3. Date Bucket (YYYY-MM-DD)
      let dateArr = this.byDate.get(r.dateStr);
      if (!dateArr) {
        dateArr = [];
        this.byDate.set(r.dateStr, dateArr);
      }
      dateArr.push(r);

      // 4. Category Bucket
      let catArr = this.byCategory.get(r.category);
      if (!catArr) {
        catArr = [];
        this.byCategory.set(r.category, catArr);
      }
      catArr.push(r);

      // 5. Source Bucket
      let srcArr = this.bySource.get(r.source);
      if (!srcArr) {
        srcArr = [];
        this.bySource.set(r.source, srcArr);
      }
      srcArr.push(r);

      // 6. Entity Inverted Index
      const entLen = r.entities ? r.entities.length : 0;
      for (let j = 0; j < entLen; j++) {
        const entKey = r.entities[j].name.toLowerCase().trim();
        if (entKey) {
          let idSet = this.entityIndex.get(entKey);
          if (!idSet) {
            idSet = new Set<string>();
            this.entityIndex.set(entKey, idSet);
          }
          idSet.add(r.id);
        }
      }

      // 7. Search Word Token Inverted Index
      this.indexSearchTokens(r);
    }

    // Precompute whole-dataset aggregates once
    this.cachedFullAggregates = this.calculateAggregates(this.receipts);
  }

  /**
   * Tokenizes text fields and builds inverted index for O(1) keyword lookup
   */
  private indexSearchTokens(r: LifeReceipt): void {
    const textCorpus = `${r.title} ${r.subtitle || ''} ${r.category} ${r.location?.city || ''} ${r.location?.state || ''}`;
    const words = textCorpus.toLowerCase().split(/[\s,.\-_/()]+/);

    for (let k = 0; k < words.length; k++) {
      const w = words[k].trim();
      if (w.length >= 2) {
        let idSet = this.tokenIndex.get(w);
        if (!idSet) {
          idSet = new Set<string>();
          this.tokenIndex.set(w, idSet);
        }
        idSet.add(r.id);
      }
    }
  }

  public getAll(): LifeReceipt[] {
    return this.receipts;
  }

  public getById(id: string): LifeReceipt | undefined {
    return this.byId.get(id);
  }

  public getBySource(source: ReceiptSource): LifeReceipt[] {
    return this.bySource.get(source) || [];
  }

  public getByYear(year: number): LifeReceipt[] {
    return this.byYear.get(year) || [];
  }

  public getByDate(dateStr: string): LifeReceipt[] {
    return this.byDate.get(dateStr) || [];
  }

  public getByCategory(category: string): LifeReceipt[] {
    return this.byCategory.get(category) || [];
  }

  /**
   * Fast multi-faceted query engine with inverted index pruning and relevance ranking
   */
  public query(filters: QueryFilters): LifeReceipt[] {
    let result = this.receipts;

    // Filter by Source (use pre-indexed buckets when querying a single source)
    if (filters.sources && filters.sources.length > 0) {
      if (filters.sources.length === 1) {
        result = this.bySource.get(filters.sources[0]) || [];
      } else {
        const srcSet = new Set(filters.sources);
        result = result.filter(r => srcSet.has(r.source));
      }
    }

    // Filter by Type
    if (filters.types && filters.types.length > 0) {
      const typeSet = new Set(filters.types);
      result = result.filter(r => typeSet.has(r.type));
    }

    // Filter by Category
    if (filters.categories && filters.categories.length > 0) {
      if (filters.categories.length === 1 && result === this.receipts) {
        result = this.byCategory.get(filters.categories[0]) || [];
      } else {
        const catSet = new Set(filters.categories);
        result = result.filter(r => catSet.has(r.category));
      }
    }

    // Filter by Year
    if (filters.years && filters.years.length > 0) {
      if (filters.years.length === 1 && result === this.receipts) {
        result = this.byYear.get(filters.years[0]) || [];
      } else {
        const yrSet = new Set(filters.years);
        result = result.filter(r => yrSet.has(r.year));
      }
    }

    // Filter by Date Range (fast string comparisons)
    if (filters.startDate) {
      result = result.filter(r => r.dateStr >= filters.startDate!);
    }
    if (filters.endDate) {
      result = result.filter(r => r.dateStr <= filters.endDate!);
    }

    // Filter by Fraud Flag
    if (filters.isFraudOnly) {
      result = result.filter(r => r.metadata?.isFraud === true);
    }

    // Filter by Amount Range
    if (filters.minAmount != null) {
      result = result.filter(r => r.amount != null && r.amount >= filters.minAmount!);
    }
    if (filters.maxAmount != null) {
      result = result.filter(r => r.amount != null && r.amount <= filters.maxAmount!);
    }

    // Filter by Entity (using inverted entity index)
    if (filters.entityName) {
      const targetEntity = filters.entityName.toLowerCase().trim();
      const matchedIds = this.entityIndex.get(targetEntity);
      if (!matchedIds || matchedIds.size === 0) return [];
      result = result.filter(r => matchedIds.has(r.id));
    }

    // Search Query (Indexed keyword search + relevance scoring)
    const q = filters.searchQuery ? filters.searchQuery.toLowerCase().trim() : '';

    if (q) {
      const queryTokens = q.split(/[\s,.\-_/()]+/).filter(t => t.length >= 2);
      
      // If we have distinct tokens, find candidate IDs using inverted token index
      let candidateIds: Set<string> | null = null;
      if (queryTokens.length > 0) {
        for (const token of queryTokens) {
          // Direct token match or prefix match
          let tokenMatches: Set<string> | null = null;
          const directMatch = this.tokenIndex.get(token);
          if (directMatch) {
            tokenMatches = directMatch;
          } else {
            // Find prefix matches in index
            const matched = new Set<string>();
            for (const [idxToken, idSet] of this.tokenIndex.entries()) {
              if (idxToken.includes(token)) {
                for (const id of idSet) matched.add(id);
              }
            }
            if (matched.size > 0) tokenMatches = matched;
          }

          if (tokenMatches) {
            if (!candidateIds) {
              candidateIds = new Set(tokenMatches);
            } else {
              // Intersection
              const nextSet = new Set<string>();
              for (const id of tokenMatches) {
                if (candidateIds.has(id)) nextSet.add(id);
              }
              candidateIds = nextSet;
            }
          }
        }
      }

      // If candidateIds found, prune the search universe
      const searchPool = candidateIds && candidateIds.size > 0
        ? result.filter(r => candidateIds!.has(r.id))
        : result;

      const scoredItems: Array<{ receipt: LifeReceipt; score: number }> = [];

      for (let i = 0; i < searchPool.length; i++) {
        const r = searchPool[i];
        let score = 0;

        const titleLower = r.title.toLowerCase();
        const subtitleLower = r.subtitle ? r.subtitle.toLowerCase() : '';

        if (titleLower.includes(q)) score += titleLower.startsWith(q) ? 25 : 12;
        if (subtitleLower.includes(q)) score += 10;
        if (r.category.toLowerCase().includes(q)) score += 6;
        if (r.location?.city && r.location.city.toLowerCase().includes(q)) score += 8;

        if (score === 0) {
          // Fallback description check
          if (r.description.toLowerCase().includes(q)) score += 4;
        }

        if (score > 0) {
          scoredItems.push({ receipt: r, score });
        }
      }

      if (!filters.sortBy || filters.sortBy === 'relevance') {
        scoredItems.sort((a, b) => b.score - a.score || b.receipt.timestamp - a.receipt.timestamp);
        return scoredItems.map(item => item.receipt);
      } else {
        result = scoredItems.map(item => item.receipt);
      }
    }

    // Sort order handling (always copy array to avoid mutating internal store)
    const sortBy = filters.sortBy || 'date_desc';
    const sorted = result.slice();

    switch (sortBy) {
      case 'date_desc':
        sorted.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'date_asc':
        sorted.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'amount_desc':
        sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case 'amount_asc':
        sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      case 'duration_desc':
        sorted.sort(
          (a, b) => (b.metadata?.durationMs || 0) - (a.metadata?.durationMs || 0)
        );
        break;
      case 'relevance':
        sorted.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return sorted;
  }

  /**
   * Computes aggregate analytics across the entire store or a filtered subset.
   * Returns cached aggregates in O(1) when querying the full dataset.
   */
  public getAggregates(subset?: LifeReceipt[]): StoreAggregates {
    if (!subset || subset === this.receipts) {
      if (this.cachedFullAggregates) {
        return this.cachedFullAggregates;
      }
      this.cachedFullAggregates = this.calculateAggregates(this.receipts);
      return this.cachedFullAggregates;
    }

    return this.calculateAggregates(subset);
  }

  private calculateAggregates(list: LifeReceipt[]): StoreAggregates {
    let totalExpense = 0;
    let totalIncome = 0;
    let totalMusicMs = 0;
    let totalFraudAlerts = 0;

    const categoryDistribution: Record<string, { count: number; totalAmount: number }> = {};
    const topArtists: Record<string, number> = {};
    const topMerchants: Record<string, number> = {};

    const len = list.length;
    for (let i = 0; i < len; i++) {
      const r = list[i];

      // Financial Outflow / Inflow
      if (r.type === 'household_expense' || r.type === 'commercial_transaction') {
        if (r.amount) totalExpense += r.amount;
      } else if (r.type === 'household_income') {
        if (r.amount) totalIncome += r.amount;
      }

      // Audio Duration & Top Artists
      if (r.source === 'spotify' && r.metadata?.durationMs) {
        totalMusicMs += r.metadata.durationMs;
        const artist = r.subtitle;
        if (artist) {
          topArtists[artist] = (topArtists[artist] || 0) + 1;
        }
      }

      // Security Alerts
      if (r.metadata?.isFraud) {
        totalFraudAlerts++;
      }

      // Commercial Merchants
      if (r.source === 'commerce' && r.title) {
        topMerchants[r.title] = (topMerchants[r.title] || 0) + 1;
      }

      // Domain Category Breakdown
      let catEntry = categoryDistribution[r.category];
      if (!catEntry) {
        catEntry = { count: 0, totalAmount: 0 };
        categoryDistribution[r.category] = catEntry;
      }
      catEntry.count++;
      if (r.amount) {
        catEntry.totalAmount += r.amount;
      }
    }

    return {
      totalReceipts: len,
      totalExpenseInr: Math.round(totalExpense),
      totalIncomeInr: Math.round(totalIncome),
      totalMusicHours: Math.round((totalMusicMs / (1000 * 3600)) * 10) / 10,
      totalFraudAlerts,
      categoryDistribution,
      topArtists: Object.entries(topArtists)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      topMerchants: Object.entries(topMerchants)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    };
  }
}
