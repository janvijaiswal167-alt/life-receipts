/**
 * High-performance In-Memory Index & Query Store for LifeReceipts
 * Enables instant multi-facet querying, temporal slicing, relevance ranking, and entity graph traversal.
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

export class LifeReceiptStore {
  private receipts: LifeReceipt[] = [];
  private byId = new Map<string, LifeReceipt>();
  private byYear = new Map<number, LifeReceipt[]>();
  private byCategory = new Map<string, LifeReceipt[]>();
  private bySource = new Map<ReceiptSource, LifeReceipt[]>();
  private entityIndex = new Map<string, Set<string>>(); // Entity Name (lowercase) -> Set of Receipt IDs

  constructor(receipts: LifeReceipt[] = []) {
    if (receipts.length > 0) {
      this.loadReceipts(receipts);
    }
  }

  /**
   * Loads and builds indexes over receipts array
   */
  public loadReceipts(receipts: LifeReceipt[]): void {
    this.receipts = receipts;
    this.byId.clear();
    this.byYear.clear();
    this.byCategory.clear();
    this.bySource.clear();
    this.entityIndex.clear();

    const len = receipts.length;
    for (let i = 0; i < len; i++) {
      const r = receipts[i];

      // ID Map
      this.byId.set(r.id, r);

      // Year Index
      let yearArr = this.byYear.get(r.year);
      if (!yearArr) {
        yearArr = [];
        this.byYear.set(r.year, yearArr);
      }
      yearArr.push(r);

      // Category Index
      let catArr = this.byCategory.get(r.category);
      if (!catArr) {
        catArr = [];
        this.byCategory.set(r.category, catArr);
      }
      catArr.push(r);

      // Source Index
      let srcArr = this.bySource.get(r.source);
      if (!srcArr) {
        srcArr = [];
        this.bySource.set(r.source, srcArr);
      }
      srcArr.push(r);

      // Entity Index
      const entLen = r.entities ? r.entities.length : 0;
      for (let j = 0; j < entLen; j++) {
        const entKey = r.entities![j].name.toLowerCase().trim();
        if (entKey) {
          let idSet = this.entityIndex.get(entKey);
          if (!idSet) {
            idSet = new Set<string>();
            this.entityIndex.set(entKey, idSet);
          }
          idSet.add(r.id);
        }
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

  public getByCategory(category: string): LifeReceipt[] {
    return this.byCategory.get(category) || [];
  }

  /**
   * Fast multi-faceted query engine with relevance scoring and sorting
   */
  public query(filters: QueryFilters): LifeReceipt[] {
    let result = this.receipts;

    // Filter by Source
    if (filters.sources && filters.sources.length > 0) {
      const srcSet = new Set(filters.sources);
      result = result.filter(r => srcSet.has(r.source));
    }

    // Filter by Type
    if (filters.types && filters.types.length > 0) {
      const typeSet = new Set(filters.types);
      result = result.filter(r => typeSet.has(r.type));
    }

    // Filter by Category
    if (filters.categories && filters.categories.length > 0) {
      const catSet = new Set(filters.categories);
      result = result.filter(r => catSet.has(r.category));
    }

    // Filter by Year
    if (filters.years && filters.years.length > 0) {
      const yrSet = new Set(filters.years);
      result = result.filter(r => yrSet.has(r.year));
    }

    // Filter by Date Range (YYYY-MM-DD string comparisons)
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

    // Filter by Entity
    if (filters.entityName) {
      const targetEntity = filters.entityName.toLowerCase().trim();
      const matchedIds = this.entityIndex.get(targetEntity);
      if (!matchedIds) return [];
      result = result.filter(r => matchedIds.has(r.id));
    }

    // Search Query (Multi-field match with scoring)
    const q = filters.searchQuery ? filters.searchQuery.toLowerCase().trim() : '';
    let scoredItems: Array<{ receipt: LifeReceipt; score: number }> = [];

    if (q) {
      for (let i = 0; i < result.length; i++) {
        const r = result[i];
        let score = 0;

        const titleLower = r.title.toLowerCase();
        const subtitleLower = r.subtitle.toLowerCase();
        const descLower = r.description.toLowerCase();

        if (titleLower.includes(q)) score += titleLower.startsWith(q) ? 20 : 10;
        if (subtitleLower.includes(q)) score += 8;
        if (descLower.includes(q)) score += 4;
        if (r.category.toLowerCase().includes(q)) score += 5;
        if (r.location?.city && r.location.city.toLowerCase().includes(q)) score += 6;
        if (r.location?.state && r.location.state.toLowerCase().includes(q)) score += 5;

        // Check entities
        for (let j = 0; j < r.entities.length; j++) {
          if (r.entities[j].name.toLowerCase().includes(q)) {
            score += 7;
            break;
          }
        }

        // Check tags
        for (let j = 0; j < r.tags.length; j++) {
          if (r.tags[j].toLowerCase().includes(q)) {
            score += 3;
            break;
          }
        }

        if (score > 0) {
          scoredItems.push({ receipt: r, score });
        }
      }

      // If sorting by relevance or default with search query
      if (!filters.sortBy || filters.sortBy === 'relevance') {
        scoredItems.sort((a, b) => b.score - a.score || b.receipt.timestamp - a.receipt.timestamp);
        return scoredItems.map(item => item.receipt);
      } else {
        result = scoredItems.map(item => item.receipt);
      }
    }

    // Sort order handling
    const sortBy = filters.sortBy || 'date_desc';

    switch (sortBy) {
      case 'date_desc':
        result.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'date_asc':
        result.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'amount_desc':
        result.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        break;
      case 'amount_asc':
        result.sort((a, b) => (a.amount || 0) - (b.amount || 0));
        break;
      case 'duration_desc':
        result.sort(
          (a, b) => (b.metadata?.durationMs || 0) - (a.metadata?.durationMs || 0)
        );
        break;
      case 'relevance':
        // Default to date desc if no query
        result.sort((a, b) => b.timestamp - a.timestamp);
        break;
    }

    return result;
  }

  /**
   * Computes aggregate analytics across the entire store or a filtered subset
   */
  public getAggregates(subset?: LifeReceipt[]) {
    const list = subset || this.receipts;
    let totalExpense = 0;
    let totalIncome = 0;
    let totalMusicMs = 0;
    let totalFraudAlerts = 0;

    const categoryDistribution: Record<string, { count: number; totalAmount: number }> = {};
    const topArtists: Record<string, number> = {};
    const topMerchants: Record<string, number> = {};

    for (let i = 0; i < list.length; i++) {
      const r = list[i];

      // Amounts
      if (r.type === 'household_expense' || r.type === 'commercial_transaction') {
        if (r.amount) totalExpense += r.amount;
      } else if (r.type === 'household_income') {
        if (r.amount) totalIncome += r.amount;
      }

      // Music duration
      if (r.source === 'spotify' && r.metadata?.durationMs) {
        totalMusicMs += r.metadata.durationMs;
        const artist = r.subtitle;
        if (artist) {
          topArtists[artist] = (topArtists[artist] || 0) + 1;
        }
      }

      // Fraud alerts
      if (r.metadata?.isFraud) {
        totalFraudAlerts++;
      }

      // Top merchants
      if (r.source === 'commerce' && r.title) {
        topMerchants[r.title] = (topMerchants[r.title] || 0) + 1;
      }

      // Categories
      if (!categoryDistribution[r.category]) {
        categoryDistribution[r.category] = { count: 0, totalAmount: 0 };
      }
      categoryDistribution[r.category].count++;
      if (r.amount) {
        categoryDistribution[r.category].totalAmount += r.amount;
      }
    }

    return {
      totalReceipts: list.length,
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
