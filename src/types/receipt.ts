/**
 * LIFE//RECEIPTS — Unified Frontend Data Model Types
 *
 * Single source of truth for normalized receipts across all 3 datasets:
 * - Dataset 1: Spotify Streaming History
 * - Dataset 2: Daily Household Transactions
 * - Dataset 3: Augmented India Commercial Transactions & Fraud
 */

export type ReceiptSource = 'spotify' | 'household' | 'commerce';

export type ReceiptType =
  | 'audio_stream'
  | 'household_expense'
  | 'household_income'
  | 'household_transfer'
  | 'commercial_transaction';

export type CanonicalCategory =
  | 'Music & Audio'
  | 'Food & Dining'
  | 'Transportation & Commute'
  | 'Subscriptions & Digital'
  | 'Shopping & Retail'
  | 'Health & Wellness'
  | 'Entertainment & Leisure'
  | 'Investments & Savings'
  | 'Income & Salary'
  | 'Family & Remittances'
  | 'General & Other';

export type EntityType =
  | 'artist'
  | 'album'
  | 'track'
  | 'merchant'
  | 'payment_mode'
  | 'financial_asset'
  | 'subscription_service'
  | 'transit_route'
  | 'location'
  | 'category'
  | 'profession'
  | 'device';

export interface ReceiptLocation {
  city: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  long: number | null;
  merchLat?: number | null;
  merchLong?: number | null;
  distanceKm?: number | null;
  context?: string | null; // e.g. 'Home Smart Speaker', 'Mobile On-the-Move', 'Workstation'
}

export interface ReceiptEntity {
  name: string;
  type: EntityType;
}

export interface LifeReceipt {
  // 1. Identity & Provenance
  id: string;                      // Globally unique ID (e.g. "spot_1042", "hh_319", "comm_295780")
  source: ReceiptSource;           // 'spotify' | 'household' | 'commerce'
  type: ReceiptType;               // Granular event type

  // 2. Standardized Temporal Dimensions (UTC-normalized)
  timestamp: number;               // Epoch timestamp in milliseconds (for fast sorting/filtering)
  isoDate: string;                 // ISO 8601 UTC string (e.g. "2023-12-26T00:55:00.000Z")
  dateStr: string;                 // YYYY-MM-DD formatted string
  timeStr: string;                 // HH:mm formatted string
  year: number;                    // 2013 - 2024
  month: number;                   // 1 - 12
  dayOfMonth: number;              // 1 - 31
  dayOfWeek: number;               // 0 - 6 (0 = Sunday, 6 = Saturday)
  hour: number;                    // 0 - 23

  // 3. Display & Editorial Information
  title: string;                   // Primary receipt headline (Track title, Merchant, Expense Note)
  subtitle: string;                // Secondary context (Artist, Category, Payment instrument)
  description: string;             // Human-readable narrative description

  // 4. Taxonomy & Categorization
  category: CanonicalCategory;     // Unified canonical category
  subcategory: string | null;      // Granular domain-specific tag
  rawCategory: string | null;      // Original raw category from source

  // 5. Financial Value
  amount: number | null;           // Numerical amount in INR (null for non-financial events)
  currency: string | null;         // 'INR' or null

  // 6. Geospatial & Contextual Location
  location: ReceiptLocation | null;

  // 7. Graph & Semantic Entities
  entities: ReceiptEntity[];

  // 8. Sanitized Source-Specific Metadata (Safe, No PII)
  metadata: Record<string, any>;

  // 9. Fast Filter & Search Tags
  tags: string[];
}

export interface NormalizationSummary {
  totalProcessed: number;
  validCount: number;
  skippedCount: number;
  sourceCounts: Record<ReceiptSource, number>;
  categoryCounts: Record<string, number>;
  timeRange: {
    minTimestamp: number;
    maxTimestamp: number;
    minDateStr: string;
    maxDateStr: string;
  };
}
