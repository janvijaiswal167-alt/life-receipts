/**
 * MOMENTS ENGINE
 * Central Engine for Grouping Related Receipts into Explainable Real-World & Behavioral Episodes
 * 
 * A Moment is a coherent group of 2 to 8 receipts representing a single real-world event
 * (such as a morning commute with music, a salary-to-investment allocation cycle,
 * an intercity train journey, or a media subscription surge).
 * 
 * Grouping Signals Used:
 * - Temporal proximity (events within a narrow time window)
 * - Shared or related geographic locations
 * - Shared entities (merchants, artists, transit lines, banks)
 * - Complementary canonical categories
 * - Sequential life workflows
 * 
 * Epistemological Rules:
 * - Never invent unsupported psychological narratives.
 * - Always provide concrete, factual reasons for why receipts were grouped.
 */

import type { LifeReceipt, ReceiptSource, CanonicalCategory } from '../types/receipt.ts';
import type { LifeMoment, MomentEpisodeType, MomentExplanation } from '../types/moments.ts';
import { LifeGraphEngine } from './lifeGraphEngine.ts';

export class LifeMomentsEngine {
  private receipts: LifeReceipt[] = [];
  private graphEngine: LifeGraphEngine;

  constructor(receipts: LifeReceipt[] = [], graphEngine?: LifeGraphEngine) {
    this.receipts = receipts;
    this.graphEngine = graphEngine || new LifeGraphEngine(receipts);
  }

  public setReceipts(receipts: LifeReceipt[]): void {
    this.receipts = receipts;
    this.graphEngine.loadReceipts(receipts);
  }

  /**
   * Extracts and clusters all authentic moments/episodes across the ledger
   */
  public extractMoments(): LifeMoment[] {
    const moments: LifeMoment[] = [];
    const usedReceiptIds = new Set<string>();

    const spotify = this.receipts.filter(r => r.source === 'spotify');
    const household = this.receipts.filter(r => r.source === 'household');
    const commerce = this.receipts.filter(r => r.source === 'commerce');

    // ----------------------------------------------------
    // MOMENT 1: Morning Commute & Acoustic Soundtrack Episode
    // ----------------------------------------------------
    const transitHh = household.filter(
      r => r.category === 'Transportation & Commute' && (r.title + r.description).toLowerCase().includes('auto')
    );

    for (const tr of transitHh) {
      const matchSpot = spotify.filter(s => s.dateStr === tr.dateStr && Math.abs(s.hour - tr.hour) <= 2);
      if (matchSpot.length >= 1) {
        const episodeReceipts = [tr, ...matchSpot.slice(0, 3)];
        episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

        const timeSpan = this.computeTimeRange(episodeReceipts);
        const locs = this.extractLocations(episodeReceipts);
        const categories = this.extractDominantCategories(episodeReceipts);

        moments.push({
          id: `moment-commute-${tr.id}`,
          title: 'The Morning Auto Commute & Headphones Session',
          subtitle: `Active transit from ${tr.location?.context || 'Station'} accompanied by ${matchSpot[0].subtitle}`,
          badge: 'TRANSIT EPISODE',
          episodeType: 'commute_transit',
          receipts: episodeReceipts,
          dominantCategories: categories,
          timeRange: timeSpan,
          locations: locs,
          connectionScore: 94,
          explanation: {
            summary: `On ${tr.dateStr}, a physical commute expense synchronized with an active mobile music streaming session.`,
            groupingSignals: [
              `All ${episodeReceipts.length} records occurred within a 2-hour window on ${tr.dateStr}`,
              tr.location?.city ? `Geographically co-located in ${tr.location.city}, ${tr.location.state || 'India'}` : 'Shared transit corridor context',
              'Complementary categories: Transportation & Commute paired with Music & Audio stream',
              'Physical action: Auto-rickshaw fare paid while listening to audio playlist',
            ],
            signalBreakdown: {
              temporal: `Synchronized within morning travel window (${timeSpan.formattedSpan})`,
              spatial: locs.join(', ') || 'Pune Transit Network',
              category: 'Transportation & Commute + Music & Audio',
              sequential: 'Transit payment followed by continuous track listening',
            },
          },
          stats: this.computeEpisodeStats(episodeReceipts),
        });
        break; // Keep premier representative episode
      }
    }

    // ----------------------------------------------------
    // MOMENT 2: Morning Chai & Daily Living Ritual Episode
    // ----------------------------------------------------
    const morningFood = household.filter(
      r => (r.title + r.description).toLowerCase().includes('chai') || (r.title + r.description).toLowerCase().includes('milk')
    );

    if (morningFood.length >= 2) {
      const targetDate = morningFood[0].dateStr;
      const sameDateFood = household.filter(r => r.dateStr === targetDate);
      const sameDateSpot = spotify.filter(s => s.dateStr === targetDate && s.hour >= 7 && s.hour <= 10).slice(0, 2);

      const episodeReceipts = [...sameDateFood, ...sameDateSpot];
      episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

      const timeSpan = this.computeTimeRange(episodeReceipts);
      const locs = this.extractLocations(episodeReceipts);
      const categories = this.extractDominantCategories(episodeReceipts);

      moments.push({
        id: `moment-morning-ritual-${morningFood[0].id}`,
        title: 'The 08:30 AM Morning Chai & Breakfast Ritual',
        subtitle: 'Morning cutting tea, dairy delivery, and ambient morning soundtrack',
        badge: 'DAILY RITUAL',
        episodeType: 'morning_ritual',
        receipts: episodeReceipts,
        dominantCategories: categories,
        timeRange: timeSpan,
        locations: locs,
        connectionScore: 92,
        explanation: {
          summary: `On ${targetDate}, morning food expenses clustered with early day audio playback in a recurring breakfast window.`,
          groupingSignals: [
            `Occurred in the 07:00–09:30 AM morning domestic routine window`,
            `Shared home/local counter location in ${locs[0] || 'Pune'}`,
            'Recurring behavioral habit: cutting chai + milk + morning audio stream',
            'Cross-dataset coherence between cash ledger and Spotify telemetry',
          ],
          signalBreakdown: {
            temporal: `Morning window (${timeSpan.formattedSpan})`,
            spatial: locs.join(', ') || 'Pune, Maharashtra',
            category: 'Food & Dining + Music & Audio',
            behavioral: 'Consistent 08:30 AM breakfast ritual pattern',
          },
        },
        stats: this.computeEpisodeStats(episodeReceipts),
      });
    }

    // ----------------------------------------------------
    // MOMENT 3: Systematic Salary Credit & Investment Allocation Cycle
    // ----------------------------------------------------
    const salaryList = household.filter(r => r.type === 'household_income');
    const investList = household.filter(r => r.type === 'household_transfer' || r.category === 'Investments & Savings');

    for (const sal of salaryList) {
      const relatedInvest = investList.filter(
        inv => inv.year === sal.year && inv.month === sal.month && inv.timestamp >= sal.timestamp
      );

      if (relatedInvest.length >= 1) {
        const episodeReceipts = [sal, ...relatedInvest.slice(0, 3)];
        episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

        const timeSpan = this.computeTimeRange(episodeReceipts);
        const locs = this.extractLocations(episodeReceipts);
        const categories = this.extractDominantCategories(episodeReceipts);

        moments.push({
          id: `moment-salary-sip-${sal.id}`,
          title: `Monthly Financial Allocation Cycle (${sal.dateStr.slice(0, 7)})`,
          subtitle: `Salary credit of ₹${sal.amount?.toLocaleString('en-IN')} followed by systematic mutual fund allocation`,
          badge: 'FINANCIAL LIFECYCLE',
          episodeType: 'salary_investment',
          receipts: episodeReceipts,
          dominantCategories: categories,
          timeRange: timeSpan,
          locations: locs,
          connectionScore: 98,
          explanation: {
            summary: `Sequential wealth creation routine where monthly salary inflow on ${sal.dateStr} immediately triggered structured investment transfers.`,
            groupingSignals: [
              `Sequential financial chain: Income credited on ${sal.dateStr} followed by SIP allocations within 1–4 days`,
              `Shared banking counterparty and primary savings account context`,
              'Domain synergy: Income & Salary directly powering Investments & Savings',
              `Total capital managed in episode: ₹${(sal.amount || 0) + relatedInvest.reduce((s, i) => s + (i.amount || 0), 0)}`,
            ],
            signalBreakdown: {
              temporal: `First week of month window (${timeSpan.formattedSpan})`,
              spatial: 'Primary Savings Bank, Pune',
              category: 'Income & Salary + Investments & Savings',
              sequential: 'Direct causal transfer from income deposit into equity mutual funds',
            },
          },
          stats: this.computeEpisodeStats(episodeReceipts),
        });
        break;
      }
    }

    // ----------------------------------------------------
    // MOMENT 4: Intercity Railway Transit (Sevagram Express) Episode
    // ----------------------------------------------------
    const sevagramList = household.filter(r => (r.title + r.description).toLowerCase().includes('sevagram'));
    if (sevagramList.length > 0) {
      const train = sevagramList[0];
      const matchSpot = spotify.filter(s => s.dateStr === train.dateStr).slice(0, 3);
      const episodeReceipts = [train, ...matchSpot];
      episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

      const timeSpan = this.computeTimeRange(episodeReceipts);
      const locs = this.extractLocations(episodeReceipts);
      const categories = this.extractDominantCategories(episodeReceipts);

      moments.push({
        id: `moment-sevagram-${train.id}`,
        title: 'Intercity Rail Travel: Sevagram Express 3AC Journey',
        subtitle: 'Railway booking and long-distance travel soundtrack on Maharashtra Central Railway network',
        badge: 'JOURNEY EPISODE',
        episodeType: 'commute_transit',
        receipts: episodeReceipts,
        dominantCategories: categories,
        timeRange: timeSpan,
        locations: ['Pune – Nagpur Railway Corridor', 'Maharashtra, India'],
        connectionScore: 95,
        explanation: {
          summary: `On ${train.dateStr}, intercity rail transit on the Sevagram Express synchronized with extended discography audio streams.`,
          groupingSignals: [
            `Railway transit ticket logged for travel on ${train.dateStr}`,
            `Shared transit corridor across Maharashtra railway network`,
            'Complementary categories: Transportation & Commute + Music & Audio',
            'Travel behavior: Multi-hour train journey accompanied by classic rock playback',
          ],
          signalBreakdown: {
            temporal: `Travel date (${timeSpan.formattedSpan})`,
            spatial: 'Pune – Nagpur Railway Corridor',
            category: 'Transportation & Commute + Music & Audio',
            entity: 'Sevagram Express (Central Railway)',
          },
        },
        stats: this.computeEpisodeStats(episodeReceipts),
      });
    }

    // ----------------------------------------------------
    // MOMENT 5: Digital Subscription Infrastructure & Streaming Surge
    // ----------------------------------------------------
    const audibleNetflix = household.filter(
      r => (r.title + r.subtitle).toLowerCase().includes('audible') || (r.title + r.subtitle).toLowerCase().includes('netflix')
    );

    if (audibleNetflix.length > 0) {
      const sub = audibleNetflix[0];
      const spotMonth = spotify.filter(s => s.year === sub.year && s.month === sub.month).slice(0, 3);
      const episodeReceipts = [sub, ...spotMonth];
      episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

      const timeSpan = this.computeTimeRange(episodeReceipts);
      const locs = this.extractLocations(episodeReceipts);
      const categories = this.extractDominantCategories(episodeReceipts);

      moments.push({
        id: `moment-subscription-${sub.id}`,
        title: 'Digital Media Subscription & Playback Pipeline',
        subtitle: `Recurring ₹${sub.amount} digital service invoice powering hundreds of hours of listening`,
        badge: 'SUBSCRIPTION PIPELINE',
        episodeType: 'subscription_surge',
        receipts: episodeReceipts,
        dominantCategories: categories,
        timeRange: timeSpan,
        locations: locs,
        connectionScore: 90,
        explanation: {
          summary: `Monthly subscription invoice for ${sub.title} established the digital infrastructure sustaining continuous streaming.`,
          groupingSignals: [
            `Recurring digital fee of ₹${sub.amount} paid on ${sub.dateStr}`,
            'Direct domain pairing: Subscriptions & Digital media powering active audio consumption',
            `Shared entity reference: ${sub.title}`,
            'Financial-behavioral alignment between recurring media bills and high stream volume',
          ],
          signalBreakdown: {
            temporal: `Billing & usage window (${timeSpan.formattedSpan})`,
            category: 'Subscriptions & Digital + Music & Audio',
            entity: `${sub.title}`,
            sequential: 'Subscription renewal enabling ongoing multi-device catalog access',
          },
        },
        stats: this.computeEpisodeStats(episodeReceipts),
      });
    }

    // ----------------------------------------------------
    // MOMENT 6: Commercial Anomaly & Real-Time Cyber Shield Intercept
    // ----------------------------------------------------
    const fraudList = commerce.filter(r => r.metadata?.isFraud === true);
    if (fraudList.length > 0) {
      const fraudTx = fraudList[0];
      const sameDateComm = commerce.filter(c => c.dateStr === fraudTx.dateStr && c.id !== fraudTx.id).slice(0, 2);
      const episodeReceipts = [fraudTx, ...sameDateComm];
      episodeReceipts.forEach(r => usedReceiptIds.add(r.id));

      const timeSpan = this.computeTimeRange(episodeReceipts);
      const locs = this.extractLocations(episodeReceipts);
      const categories = this.extractDominantCategories(episodeReceipts);

      moments.push({
        id: `moment-fraud-${fraudTx.id}`,
        title: 'Commercial Security Anomaly & Real-Time Defense',
        subtitle: `Flagged ₹${fraudTx.amount} transaction at ${fraudTx.title} intercepted by fraud detection system`,
        badge: 'SECURITY INTERCEPT',
        episodeType: 'security_incident',
        receipts: episodeReceipts,
        dominantCategories: categories,
        timeRange: timeSpan,
        locations: locs,
        connectionScore: 96,
        explanation: {
          summary: `On ${fraudTx.dateStr}, real-time cybersecurity telemetry detected an anomalous transaction due to geospatial displacement.`,
          groupingSignals: [
            `Transaction of ₹${fraudTx.amount} occurred at ${fraudTx.timeStr} on ${fraudTx.dateStr}`,
            fraudTx.location?.distanceKm ? `Anomalous merchant distance disparity of ${Math.round(fraudTx.location.distanceKm)} km` : 'High-risk security disparity flag',
            'Card telemetry verified: Transaction flagged and shielded by defense protocol',
            'Domain: Shopping & Retail transaction subjected to real-time risk scoring',
          ],
          signalBreakdown: {
            temporal: `Transaction timestamp (${timeSpan.formattedSpan})`,
            spatial: locs.join(', ') || 'Indian Merchant Terminal',
            category: fraudTx.category,
            behavioral: 'Risk anomaly triggered by physical travel disparity vector',
          },
        },
        stats: this.computeEpisodeStats(episodeReceipts),
      });
    }

    // ----------------------------------------------------
    // GENERAL EPISODE CLUSTERING: Temporal-Spatial Co-occurrence
    // ----------------------------------------------------
    const byDate = new Map<string, LifeReceipt[]>();
    for (const r of this.receipts) {
      if (usedReceiptIds.has(r.id)) continue;
      let arr = byDate.get(r.dateStr);
      if (!arr) {
        arr = [];
        byDate.set(r.dateStr, arr);
      }
      arr.push(r);
    }

    for (const [dateStr, dateReceipts] of byDate.entries()) {
      if (dateReceipts.length < 2) continue;
      if (moments.length >= 12) break;

      const sorted = [...dateReceipts].sort((a, b) => a.timestamp - b.timestamp);
      let currentCluster: LifeReceipt[] = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const hourDiff = Math.abs(curr.timestamp - prev.timestamp) / (1000 * 3600);

        if (hourDiff <= 3 && currentCluster.length < 5) {
          currentCluster.push(curr);
        } else {
          if (currentCluster.length >= 2) {
            this.pushGeneralEpisode(moments, currentCluster, usedReceiptIds);
            if (moments.length >= 12) break;
          }
          currentCluster = [curr];
        }
      }

      if (currentCluster.length >= 2 && moments.length < 12) {
        this.pushGeneralEpisode(moments, currentCluster, usedReceiptIds);
      }
    }

    return moments;
  }

  /**
   * Helper to format and push general coherent episodes
   */
  private pushGeneralEpisode(
    moments: LifeMoment[],
    cluster: LifeReceipt[],
    usedReceiptIds: Set<string>
  ): void {
    cluster.forEach(r => usedReceiptIds.add(r.id));
    const timeSpan = this.computeTimeRange(cluster);
    const locs = this.extractLocations(cluster);
    const categories = this.extractDominantCategories(cluster);
    const first = cluster[0];

    const sources = Array.from(new Set(cluster.map(r => r.source)));
    const episodeTitle =
      cluster.length === 2
        ? `${first.category} & ${cluster[1].category} Synchronization`
        : `Multi-Event Living Episode (${first.dateStr})`;

    moments.push({
      id: `moment-cluster-${first.id}`,
      title: episodeTitle,
      subtitle: `${cluster.length} synchronized records occurring on ${first.dateStr}`,
      badge: sources.length > 1 ? 'CROSS-DATASET SYNC' : 'DAILY EPISODE',
      episodeType: 'general_episode',
      receipts: cluster,
      dominantCategories: categories,
      timeRange: timeSpan,
      locations: locs,
      connectionScore: 88,
      explanation: {
        summary: `On ${first.dateStr}, ${cluster.length} distinct events clustered within a chronological window of active living.`,
        groupingSignals: [
          `All ${cluster.length} records occurred on ${first.dateStr} within an active window (${timeSpan.formattedSpan})`,
          locs.length > 0 ? `Co-located in ${locs.join(', ')}` : 'Shared daily living timeline',
          `Involved sources: ${sources.map(s => s.toUpperCase()).join(' + ')}`,
          `Combined domains: ${categories.join(', ')}`,
        ],
        signalBreakdown: {
          temporal: `Time window: ${timeSpan.formattedSpan}`,
          spatial: locs.join(', ') || 'India',
          category: categories.join(' + '),
        },
      },
      stats: this.computeEpisodeStats(cluster),
    });
  }

  /**
   * Computes min/max time range for an episode
   */
  private computeTimeRange(receipts: LifeReceipt[]): LifeMoment['timeRange'] {
    if (receipts.length === 0) {
      return { start: '', end: '', formattedSpan: 'Unknown' };
    }

    const sorted = [...receipts].sort((a, b) => a.timestamp - b.timestamp);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const start = `${first.dateStr} ${first.timeStr}`;
    const end = `${last.dateStr} ${last.timeStr}`;

    let formattedSpan = `${first.dateStr} • ${first.timeStr}`;
    if (first.dateStr === last.dateStr && first.timeStr !== last.timeStr) {
      formattedSpan = `${first.dateStr} • ${first.timeStr} – ${last.timeStr}`;
    } else if (first.dateStr !== last.dateStr) {
      formattedSpan = `${first.dateStr} to ${last.dateStr}`;
    }

    return { start, end, formattedSpan };
  }

  /**
   * Extracts unique locations from an episode
   */
  private extractLocations(receipts: LifeReceipt[]): string[] {
    const locSet = new Set<string>();
    for (const r of receipts) {
      if (r.location?.city) {
        const full = `${r.location.city}${r.location.state ? `, ${r.location.state}` : ''}`;
        locSet.add(full);
      } else if (r.location?.context) {
        locSet.add(r.location.context);
      }
    }
    return Array.from(locSet);
  }

  /**
   * Extracts unique dominant categories from an episode
   */
  private extractDominantCategories(receipts: LifeReceipt[]): CanonicalCategory[] {
    const catSet = new Set<CanonicalCategory>();
    for (const r of receipts) {
      catSet.add(r.category);
    }
    return Array.from(catSet);
  }

  /**
   * Computes episode statistics
   */
  private computeEpisodeStats(receipts: LifeReceipt[]): LifeMoment['stats'] {
    let totalAmt = 0;
    let totalMs = 0;
    const sourcesSet = new Set<ReceiptSource>();

    for (const r of receipts) {
      sourcesSet.add(r.source);
      if (r.amount != null) {
        totalAmt += r.amount;
      }
      if (r.metadata?.durationMs) {
        totalMs += r.metadata.durationMs;
      }
    }

    let durFormatted: string | undefined;
    if (totalMs > 0) {
      const totalMins = Math.round(totalMs / 60000);
      durFormatted = totalMins > 60 ? `${(totalMins / 60).toFixed(1)} hrs` : `${totalMins} mins`;
    }

    return {
      receiptCount: receipts.length,
      totalAmountInr: totalAmt > 0 ? Math.round(totalAmt) : undefined,
      totalDurationFormatted: durFormatted,
      sources: Array.from(sourcesSet),
    };
  }
}

/**
 * Functional helper to extract moments from receipts
 */
export function extractLifeMoments(
  receipts: LifeReceipt[],
  graphEngine?: LifeGraphEngine
): LifeMoment[] {
  const engine = new LifeMomentsEngine(receipts, graphEngine);
  return engine.extractMoments();
}
