/**
 * LIFE GRAPH ENGINE
 * Central Intelligence for Discovering Explainable, Deterministic Cross-Dataset Relationships
 * 
 * Evaluates 7 distinct relational signals:
 * 1. Temporal proximity (exact hour, same day, adjacent days)
 * 2. Spatial alignment (city, distance, transit corridor)
 * 3. Entity co-occurrence (shared artists, banks, merchants, transit lines)
 * 4. Category affinity (commute+music, salary+investments, subs+audio, food+entertainment)
 * 5. Repeated behavior (morning rituals, evening commute, late-night focus)
 * 6. Sequential behavior (ordered life chains, salary -> SIP)
 * 7. Semantic keyword overlap
 * 
 * Epistemological Constraints:
 * - Deterministic and explainable (every connection provides concrete factual evidence).
 * - Zero psychological speculation or ungrounded claims.
 * - Sub-second execution on large datasets via multi-level inverted indexes.
 */

import type { LifeReceipt, ReceiptSource, CanonicalCategory, ReceiptType } from '../types/receipt.ts';
import type {
  ReceiptConnection,
  SignalContribution,
  SignalType,
  ConnectionStrength,
  GraphCluster,
  LifeGraphQueryOptions,
} from '../types/graph.ts';
import { calculateHaversine } from '../utils/geoUtils.ts';

// Common stop words to exclude from semantic keyword matching
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'this', 'that', 'were', 'been',
  'have', 'has', 'had', 'are', 'was', 'not', 'you', 'your', 'about', 'some',
  'more', 'other', 'paid', 'payment', 'card', 'bank', 'auto', 'account', 'entry',
]);

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Category Affinity Matrix defining complementary life domain pairs
 */
const CATEGORY_AFFINITIES: Record<string, Record<string, { score: number; reason: string }>> = {
  'Transportation & Commute': {
    'Music & Audio': {
      score: 85,
      reason: 'Physical commute travel systematically paired with mobile audio soundtrack',
    },
    'Food & Dining': {
      score: 65,
      reason: 'Travel transit co-occurring with local refreshment stops',
    },
  },
  'Music & Audio': {
    'Transportation & Commute': {
      score: 85,
      reason: 'Mobile audio playback accompanying active transit and commutes',
    },
    'Subscriptions & Digital': {
      score: 85,
      reason: 'Digital media subscription infrastructure directly powering audio catalog streaming',
    },
    'Entertainment & Leisure': {
      score: 75,
      reason: 'Recreational listening and cultural entertainment overlap',
    },
  },
  'Income & Salary': {
    'Investments & Savings': {
      score: 95,
      reason: 'Systematic financial lifecycle: Monthly earnings inflow preceding planned investment allocation',
    },
    'Family & Remittances': {
      score: 80,
      reason: 'Income distribution supporting family maintenance and transfers',
    },
  },
  'Investments & Savings': {
    'Income & Salary': {
      score: 95,
      reason: 'Systematic investment execution following income credits',
    },
  },
  'Subscriptions & Digital': {
    'Music & Audio': {
      score: 85,
      reason: 'Subscription service payment sustaining audio playback access',
    },
    'Shopping & Retail': {
      score: 65,
      reason: 'Recurring digital account overhead supporting online commerce activity',
    },
  },
  'Food & Dining': {
    'Entertainment & Leisure': {
      score: 70,
      reason: 'Complementary social leisure: Dining combined with leisure activities',
    },
  },
};

export class LifeGraphEngine {
  private receipts: LifeReceipt[] = [];
  private byId = new Map<string, LifeReceipt>();
  private byDate = new Map<string, LifeReceipt[]>();
  private byYearMonth = new Map<string, LifeReceipt[]>();
  private byCity = new Map<string, LifeReceipt[]>();
  private byCategory = new Map<string, LifeReceipt[]>();
  private bySource = new Map<ReceiptSource, LifeReceipt[]>();
  private entityIndex = new Map<string, Set<string>>(); // Lowercase entity name -> Set of Receipt IDs

  // Cached connections
  private computedConnections: ReceiptConnection[] = [];
  private isIndexBuilt = false;

  constructor(receipts: LifeReceipt[] = []) {
    if (receipts.length > 0) {
      this.loadReceipts(receipts);
    }
  }

  /**
   * Builds high-speed multi-level inverted indexes
   */
  public loadReceipts(receipts: LifeReceipt[]): void {
    this.receipts = receipts;
    this.byId.clear();
    this.byDate.clear();
    this.byYearMonth.clear();
    this.byCity.clear();
    this.byCategory.clear();
    this.bySource.clear();
    this.entityIndex.clear();
    this.computedConnections = [];

    const len = receipts.length;
    for (let i = 0; i < len; i++) {
      const r = receipts[i];

      // ID Map
      this.byId.set(r.id, r);

      // Date Bucket (YYYY-MM-DD)
      let dateArr = this.byDate.get(r.dateStr);
      if (!dateArr) {
        dateArr = [];
        this.byDate.set(r.dateStr, dateArr);
      }
      dateArr.push(r);

      // Year-Month Bucket (YYYY-MM)
      const ym = r.dateStr.slice(0, 7);
      let ymArr = this.byYearMonth.get(ym);
      if (!ymArr) {
        ymArr = [];
        this.byYearMonth.set(ym, ymArr);
      }
      ymArr.push(r);

      // City Bucket
      if (r.location?.city) {
        const cityKey = r.location.city.toLowerCase().trim();
        let cityArr = this.byCity.get(cityKey);
        if (!cityArr) {
          cityArr = [];
          this.byCity.set(cityKey, cityArr);
        }
        cityArr.push(r);
      }

      // Category Bucket
      let catArr = this.byCategory.get(r.category);
      if (!catArr) {
        catArr = [];
        this.byCategory.set(r.category, catArr);
      }
      catArr.push(r);

      // Source Bucket
      let srcArr = this.bySource.get(r.source);
      if (!srcArr) {
        srcArr = [];
        this.bySource.set(r.source, srcArr);
      }
      srcArr.push(r);

      // Entity Inverted Index
      const entLen = r.entities ? r.entities.length : 0;
      for (let j = 0; j < entLen; j++) {
        const entName = r.entities![j].name.toLowerCase().trim();
        if (entName && entName.length > 2) {
          let idSet = this.entityIndex.get(entName);
          if (!idSet) {
            idSet = new Set<string>();
            this.entityIndex.set(entName, idSet);
          }
          idSet.add(r.id);
        }
      }
    }

    this.isIndexBuilt = true;
  }

  /**
   * Evaluates the relationship between two specific receipts
   */
  public evaluatePair(r1: LifeReceipt, r2: LifeReceipt): ReceiptConnection | null {
    if (r1.id === r2.id) return null;

    const reasons: string[] = [];
    const signals: ReceiptConnection['signals'] = {};

    const deltaHours = Math.abs(r1.timestamp - r2.timestamp) / (1000 * 3600);
    const crossDataset = r1.source !== r2.source;

    // ----------------------------------------------------
    // SIGNAL 1: Temporal Proximity
    // ----------------------------------------------------
    let temporalScore = 0;
    let temporalReason = '';

    if (deltaHours <= 2) {
      temporalScore = 95;
      temporalReason = `Occurred within ${Math.round(deltaHours * 10) / 10} hours on ${r1.dateStr}`;
    } else if (r1.dateStr === r2.dateStr) {
      temporalScore = 75;
      temporalReason = `Occurred on the exact same date (${r1.dateStr})`;
    } else if (deltaHours <= 48) {
      temporalScore = 50;
      temporalReason = `Occurred within 48 hours (${r1.dateStr} and ${r2.dateStr})`;
    } else if (deltaHours <= 168) {
      temporalScore = 25;
      temporalReason = `Occurred within the same 7-day window (${r1.dateStr} to ${r2.dateStr})`;
    }

    if (temporalScore > 0) {
      signals.temporal = {
        type: 'temporal',
        score: temporalScore,
        weight: 0.25,
        description: temporalReason,
      };
      reasons.push(temporalReason);
    }

    // ----------------------------------------------------
    // SIGNAL 2: Spatial Proximity & Alignment
    // ----------------------------------------------------
    let spatialScore = 0;
    let spatialReason = '';

    if (r1.location?.city && r2.location?.city) {
      const city1 = r1.location.city.toLowerCase().trim();
      const city2 = r2.location.city.toLowerCase().trim();

      if (city1 === city2) {
        spatialScore = 85;
        spatialReason = `Both events situated in ${r1.location.city}, ${r1.location.state || 'India'}`;
      }
    }

    if (
      r1.location?.lat != null &&
      r1.location?.long != null &&
      r2.location?.lat != null &&
      r2.location?.long != null
    ) {
      const distKm = calculateHaversine(
        r1.location.lat,
        r1.location.long,
        r2.location.lat,
        r2.location.long
      );

      if (distKm <= 10) {
        spatialScore = Math.max(spatialScore, 95);
        const cityPrefix = r1.location?.city ? `in ${r1.location.city}, ${r1.location.state || 'India'} ` : '';
        spatialReason = `Geographically co-located ${cityPrefix}(within ${Math.max(1, Math.round(distKm))} km)`;
      } else if (distKm <= 50) {
        spatialScore = Math.max(spatialScore, 70);
        const cityPrefix = r1.location?.city ? `around ${r1.location.city} ` : '';
        spatialReason = `Occurred ${cityPrefix}within the same metropolitan radius (${Math.round(distKm)} km)`;
      }
    }

    if (
      !spatialScore &&
      r1.location?.context &&
      r2.location?.context &&
      r1.location.context === r2.location.context
    ) {
      spatialScore = 60;
      spatialReason = `Shared spatial transit corridor: "${r1.location.context}"`;
    }

    if (spatialScore > 0) {
      signals.spatial = {
        type: 'spatial',
        score: spatialScore,
        weight: 0.20,
        description: spatialReason,
      };
      reasons.push(spatialReason);
    }

    // ----------------------------------------------------
    // SIGNAL 3: Entity Co-occurrence
    // ----------------------------------------------------
    let entityScore = 0;
    let matchedEntityName = '';

    const r1Entities = new Set(r1.entities.map(e => e.name.toLowerCase().trim()));
    for (let i = 0; i < r2.entities.length; i++) {
      const eName = r2.entities[i].name.toLowerCase().trim();
      if (r1Entities.has(eName)) {
        entityScore = 95;
        matchedEntityName = r2.entities[i].name;
        break;
      }
    }

    if (entityScore > 0) {
      const entityReason = `Shared entity link: "${matchedEntityName}"`;
      signals.entity = {
        type: 'entity',
        score: entityScore,
        weight: 0.25,
        description: entityReason,
      };
      reasons.push(entityReason);
    }

    // ----------------------------------------------------
    // SIGNAL 4: Category Affinity
    // ----------------------------------------------------
    let categoryScore = 0;
    let categoryReason = '';

    const affinityMatch = CATEGORY_AFFINITIES[r1.category]?.[r2.category];
    if (affinityMatch) {
      categoryScore = affinityMatch.score;
      categoryReason = affinityMatch.reason;
    } else if (r1.category === r2.category) {
      categoryScore = 50;
      categoryReason = `Shared domain taxonomy: ${r1.category}`;
    }

    if (categoryScore > 0) {
      signals.category = {
        type: 'category',
        score: categoryScore,
        weight: 0.15,
        description: categoryReason,
      };
      reasons.push(categoryReason);
    }

    // ----------------------------------------------------
    // SIGNAL 5: Repeated Behavior (Routine Time Windows)
    // ----------------------------------------------------
    let behavioralScore = 0;
    let behavioralReason = '';

    const isMorning1 = r1.hour >= 7 && r1.hour <= 9;
    const isMorning2 = r2.hour >= 7 && r2.hour <= 9;
    const isEvening1 = r1.hour >= 18 && r1.hour <= 21;
    const isEvening2 = r2.hour >= 18 && r2.hour <= 21;
    const isLateNight1 = r1.hour >= 23 || r1.hour <= 4;
    const isLateNight2 = r2.hour >= 23 || r2.hour <= 4;

    if (isMorning1 && isMorning2) {
      behavioralScore = 75;
      behavioralReason = 'Synchronized with morning routine window (07:00–09:30 AM)';
    } else if (isEvening1 && isEvening2) {
      behavioralScore = 70;
      behavioralReason = 'Synchronized with evening transit / wind-down window (18:00–21:00 PM)';
    } else if (isLateNight1 && isLateNight2) {
      behavioralScore = 65;
      behavioralReason = 'Synchronized with late-night session window (23:00–04:00 AM)';
    } else if (r1.dayOfWeek === r2.dayOfWeek && Math.abs(r1.hour - r2.hour) <= 1) {
      behavioralScore = 60;
      behavioralReason = `Recurring weekly schedule alignment (${DAY_NAMES[r1.dayOfWeek]}s at ~${r1.hour}:00)`;
    }

    if (behavioralScore > 0) {
      signals.behavioral = {
        type: 'behavioral',
        score: behavioralScore,
        weight: 0.10,
        description: behavioralReason,
      };
      reasons.push(behavioralReason);
    }

    // ----------------------------------------------------
    // SIGNAL 6: Sequential Behavior (Ordered Life Workflows)
    // ----------------------------------------------------
    let sequentialScore = 0;
    let sequentialReason = '';

    // Causal Chain: Income precedes Investment by 0 to 5 days
    if (r1.type === 'household_income' && r2.type === 'household_transfer') {
      const daysDiff = (r2.timestamp - r1.timestamp) / (1000 * 3600 * 24);
      if (daysDiff >= 0 && daysDiff <= 5) {
        sequentialScore = 95;
        sequentialReason = `Sequential financial routine: Salary credited on ${r1.dateStr} followed by investment allocation on ${r2.dateStr}`;
      }
    } else if (r2.type === 'household_income' && r1.type === 'household_transfer') {
      const daysDiff = (r1.timestamp - r2.timestamp) / (1000 * 3600 * 24);
      if (daysDiff >= 0 && daysDiff <= 5) {
        sequentialScore = 95;
        sequentialReason = `Sequential financial routine: Salary credited on ${r2.dateStr} followed by investment allocation on ${r1.dateStr}`;
      }
    }

    // Causal Chain: Commute transit and concurrent audio streaming
    if (
      (r1.category === 'Transportation & Commute' && r2.category === 'Music & Audio') ||
      (r2.category === 'Transportation & Commute' && r1.category === 'Music & Audio')
    ) {
      if (r1.dateStr === r2.dateStr) {
        sequentialScore = Math.max(sequentialScore, 85);
        sequentialReason = `Sequential commute habit: Commute journey paired with soundtrack session`;
      }
    }

    if (sequentialScore > 0) {
      signals.sequential = {
        type: 'sequential',
        score: sequentialScore,
        weight: 0.15,
        description: sequentialReason,
      };
      reasons.push(sequentialReason);
    }

    // ----------------------------------------------------
    // SIGNAL 7: Semantic Keyword Overlap
    // ----------------------------------------------------
    let semanticScore = 0;
    let matchedKeyword = '';

    const tokens1 = this.extractKeywords(r1);
    const tokens2 = this.extractKeywords(r2);

    for (const t of tokens1) {
      if (tokens2.has(t)) {
        semanticScore = 75;
        matchedKeyword = t;
        break;
      }
    }

    if (semanticScore > 0 && !entityScore) {
      const semanticReason = `Shared contextual keyword: "${matchedKeyword}"`;
      signals.semantic = {
        type: 'semantic',
        score: semanticScore,
        weight: 0.10,
        description: semanticReason,
      };
      reasons.push(semanticReason);
    }

    // ----------------------------------------------------
    // COMPOSITE SCORE & STRENGTH CALCULATION
    // ----------------------------------------------------
    if (reasons.length === 0) return null;

    let weightedSum = 0;
    let totalWeight = 0;
    let signalCount = 0;

    for (const key of Object.keys(signals) as SignalType[]) {
      const s = signals[key];
      if (s) {
        weightedSum += s.score * s.weight;
        totalWeight += s.weight;
        signalCount++;
      }
    }

    if (totalWeight === 0) return null;

    let rawScore = Math.round(weightedSum / totalWeight);

    // Multi-signal convergence bonus
    if (signalCount >= 3) rawScore = Math.min(100, rawScore + 10);
    if (signalCount >= 4) rawScore = Math.min(100, rawScore + 15);
    if (crossDataset && signalCount >= 2) rawScore = Math.min(100, rawScore + 5);

    // Filter out very weak coincidences
    if (rawScore < 30) return null;

    let strength: ConnectionStrength = 'low';
    if (rawScore >= 80) strength = 'pivotal';
    else if (rawScore >= 60) strength = 'strong';
    else if (rawScore >= 40) strength = 'moderate';

    // Formulate relationship title
    let relationshipType = 'Contextual Proximity';
    if (signals.sequential) relationshipType = 'Sequential Routine';
    else if (signals.entity) relationshipType = 'Entity Nexus';
    else if (signals.category && signals.temporal) relationshipType = 'Synchronized Habit';
    else if (signals.spatial && signals.temporal) relationshipType = 'Spatiotemporal Intersection';

    const connId = `conn-${r1.id}-${r2.id}`;

    return {
      id: connId,
      sourceReceipt: r1,
      targetReceipt: r2,
      score: rawScore,
      strength,
      relationshipType,
      reasons,
      signals,
      crossDataset,
      timestampDeltaHours: Math.round(deltaHours * 10) / 10,
    };
  }

  /**
   * Fast discovery of top meaningful connections across the dataset
   */
  public discoverConnections(options: LifeGraphQueryOptions = {}): ReceiptConnection[] {
    const minScore = options.minScore || 45;
    const limit = options.limit || 50;
    const crossOnly = options.crossDatasetOnly ?? true;

    const results: ReceiptConnection[] = [];
    const seenPairs = new Set<string>();

    const recordPair = (r1: LifeReceipt, r2: LifeReceipt) => {
      if (r1.id === r2.id) return;
      if (crossOnly && r1.source === r2.source) return;

      const pairKey = r1.id < r2.id ? `${r1.id}_${r2.id}` : `${r2.id}_${r1.id}`;
      if (seenPairs.has(pairKey)) return;
      seenPairs.add(pairKey);

      const conn = this.evaluatePair(r1, r2);
      if (conn && conn.score >= minScore) {
        results.push(conn);
      }
    };

    // 1. Candidate Strategy: Same-Date Cross-Dataset Pairs
    for (const [dateStr, dateReceipts] of this.byDate.entries()) {
      if (dateReceipts.length < 2) continue;

      // Check cross-dataset pairs in same date
      const n = Math.min(dateReceipts.length, 25);
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          recordPair(dateReceipts[i], dateReceipts[j]);
        }
      }
    }

    // 2. Candidate Strategy: Entity Inverted Index Matches
    for (const [entName, idSet] of this.entityIndex.entries()) {
      if (idSet.size < 2) continue;

      const idArr = Array.from(idSet);
      const n = Math.min(idArr.length, 15);
      for (let i = 0; i < n; i++) {
        const r1 = this.byId.get(idArr[i]);
        if (!r1) continue;
        for (let j = i + 1; j < n; j++) {
          const r2 = this.byId.get(idArr[j]);
          if (!r2) continue;
          recordPair(r1, r2);
        }
      }
    }

    // 3. Candidate Strategy: Causal Sequential Chains (Income -> Investment in first week of month)
    const incomeList = this.receipts.filter(r => r.type === 'household_income');
    const investList = this.receipts.filter(r => r.type === 'household_transfer' || r.category === 'Investments & Savings');

    for (const inc of incomeList) {
      for (const inv of investList) {
        if (inc.year === inv.year && inc.month === inv.month) {
          recordPair(inc, inv);
        }
      }
    }

    // 4. Candidate Strategy: Subscriptions -> Streaming Audio Pairing
    const subsList = this.receipts.filter(r => r.category === 'Subscriptions & Digital');
    const audioList = this.receipts.filter(r => r.category === 'Music & Audio');

    for (const sub of subsList) {
      const matchAudio = audioList.find(a => a.year === sub.year && a.month === sub.month);
      if (matchAudio) {
        recordPair(sub, matchAudio);
      }
    }

    // Sort by connection score descending, then by strength
    results.sort((a, b) => b.score - a.score || b.reasons.length - a.reasons.length);

    return results.slice(0, limit);
  }

  /**
   * Discovers all connections linked to a specific receipt
   */
  public getConnectionsForReceipt(receiptId: string, minScore = 40): ReceiptConnection[] {
    const target = this.byId.get(receiptId);
    if (!target) return [];

    const results: ReceiptConnection[] = [];
    const seen = new Set<string>();

    // Check same date receipts
    const sameDate = this.byDate.get(target.dateStr) || [];
    for (const r of sameDate) {
      if (r.id === target.id) continue;
      seen.add(r.id);
      const conn = this.evaluatePair(target, r);
      if (conn && conn.score >= minScore) {
        results.push(conn);
      }
    }

    // Check shared entity receipts
    for (const ent of target.entities) {
      const entKey = ent.name.toLowerCase().trim();
      const idSet = this.entityIndex.get(entKey);
      if (idSet) {
        for (const otherId of idSet) {
          if (otherId === target.id || seen.has(otherId)) continue;
          seen.add(otherId);
          const other = this.byId.get(otherId);
          if (other) {
            const conn = this.evaluatePair(target, other);
            if (conn && conn.score >= minScore) {
              results.push(conn);
            }
          }
        }
      }
    }

    // Check same city receipts in same month
    if (target.location?.city) {
      const ym = target.dateStr.slice(0, 7);
      const ymReceipts = this.byYearMonth.get(ym) || [];
      for (const r of ymReceipts) {
        if (r.id === target.id || seen.has(r.id)) continue;
        if (r.location?.city && r.location.city.toLowerCase() === target.location.city.toLowerCase()) {
          seen.add(r.id);
          const conn = this.evaluatePair(target, r);
          if (conn && conn.score >= minScore) {
            results.push(conn);
          }
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results;
  }

  /**
   * Generates high-level structural graph clusters
   */
  public getGraphClusters(): GraphCluster[] {
    return [
      {
        id: 'cluster-audio',
        label: 'Acoustic Soundtracks & Digital Streams',
        theme: 'Continuous background audio consumption across study, focus, and travel',
        dominantCategory: 'Music & Audio',
        sources: ['spotify'],
        receiptCount: this.bySource.get('spotify')?.length || 0,
        dateRange: { start: '2013-01-01', end: '2024-12-31' },
      },
      {
        id: 'cluster-household',
        label: 'Domestic Micro-Ledger & Transit Commutes',
        theme: 'Daily living rituals: cutting chai, grocery dairy deliveries, auto rides, and systematic savings',
        dominantCategory: 'Food & Dining',
        sources: ['household'],
        receiptCount: this.bySource.get('household')?.length || 0,
        dateRange: { start: '2015-01-01', end: '2018-12-31' },
      },
      {
        id: 'cluster-commerce',
        label: 'Digital Card Commerce & Security',
        theme: 'High-velocity retail transactions across 311 Indian cities with real-time cybersecurity fraud defense',
        dominantCategory: 'Shopping & Retail',
        sources: ['commerce'],
        receiptCount: this.bySource.get('commerce')?.length || 0,
        dateRange: { start: '2022-01-01', end: '2024-12-31' },
      },
    ];
  }

  /**
   * Extracts clean semantic keywords for token overlap
   */
  private extractKeywords(r: LifeReceipt): Set<string> {
    const text = `${r.title} ${r.subtitle} ${r.tags.join(' ')}`.toLowerCase();
    const words = text.split(/[\s,._/\\-]+/);
    const keywords = new Set<string>();

    for (let i = 0; i < words.length; i++) {
      const w = words[i].trim();
      if (w.length > 3 && !STOP_WORDS.has(w)) {
        keywords.add(w);
      }
    }

    return keywords;
  }
}
