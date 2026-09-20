# LIFE//RECEIPTS — Unified Frontend Data Model Specification
> **Document**: DATA_MODEL.md  
> **Project**: LIFE//RECEIPTS ("Your Life, In Receipts")  
> **Purpose**: Formal specification of the unified `LifeReceipt` data model, schema transformation mapping from three heterogenous source datasets, privacy/PII redacting rules, and performance optimization architecture.

---

## 1. Unified Model Architecture

The `LifeReceipt` model serves as the single source of truth for the entire frontend application. It maps heterogeneous records from audio streaming (Spotify), daily household micro-expenses, and commercial credit card transactions into a harmonized, queryable, and visually renderable receipt structure.

### 1.1 Core TypeScript Schema

```typescript
export type ReceiptSource = 'spotify' | 'household' | 'commerce';

export type ReceiptType =
  | 'audio_stream'
  | 'household_expense'
  | 'household_income'
  | 'household_transfer'
  | 'commercial_transaction';

export interface ReceiptLocation {
  city: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  long: number | null;
  merchLat?: number | null;
  merchLong?: number | null;
  distanceKm?: number | null;
  context?: string | null; // e.g., 'Home Smart Speaker', 'Mobile On-the-Move', 'Workstation'
}

export interface ReceiptEntity {
  name: string;
  type:
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
}

export interface LifeReceipt {
  // 1. Identity & Provenance
  id: string;                      // Globally unique ID (e.g., "spot_1042", "hh_319", "comm_295780")
  source: ReceiptSource;           // 'spotify' | 'household' | 'commerce'
  type: ReceiptType;               // Granular event type

  // 2. Standardized Temporal Dimensions (UTC-normalized)
  timestamp: number;               // Epoch timestamp in milliseconds (for instant sorting & filtering)
  isoDate: string;                 // ISO 8601 UTC string (e.g., "2023-12-26T00:55:00.000Z")
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
  category: string;                // Unified canonical category
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
```

---

## 2. Canonical Category Taxonomy

To enable unified cross-dataset filtering, comparison, and timeline aggregation, all source-specific categories are mapped into **10 Unified Canonical Categories**:

| Unified Category | Source Mappings (Spotify / Household / Commerce) | Color Accent / Visual Theme |
| :--- | :--- | :--- |
| **`Music & Audio`** | Spotify streams (`all`), Household `Subcategory: Audible / Music` | Emerald / Neon Green (`#1DB954`) |
| **`Food & Dining`** | Household `Food`, `Subcategory: Milk, Snacks, Lunch, Dinner, Kirana, Tea` | Amber / Sunset Orange (`#F59E0B`) |
| **`Transportation & Commute`** | Household `Transportation`, `Subcategory: auto, train, petrol, taxi`, Commerce `category: travel` | Cyan / Sky Blue (`#06B6D4`) |
| **`Subscriptions & Digital`** | Household `subscription`, `Subcategory: Netflix, Prime, Kindle, Mobile Provider`, Commerce `online_shopping (streaming/digital)` | Violet / Purple (`#8B5CF6`) |
| **`Shopping & Retail`** | Commerce `category: online_shopping`, Household `Apparel, Gift, Household goods` | Pink / Rose (`#EC4899`) |
| **`Health & Wellness`** | Commerce `category: fitness_and_medical`, Household `Health, Subcategory: Medicine, Doctor` | Teal / Emerald (`#10B981`) |
| **`Entertainment & Leisure`** | Commerce `category: entertainment`, Household `Entertainment` | Fuchsia / Magenta (`#D946EF`) |
| **`Investments & Savings`** | Household `Investment, Mutual Funds A-E, PPF, Recurring Deposit, Fixed Deposit` | Indigo / Blue (`#3B82F6`) |
| **`Income & Salary`** | Household `Salary, Income/Expense: Income` | Lime / Goldenrod (`#84CC16`) |
| **`Family & Remittances`** | Household `Family, Money transfer to Home, Pocket money` | Orange / Coral (`#FB923C`) |

---

## 3. Dataset Mapping Specifications

### 3.1 Dataset 1: Spotify Listening History (`archive.zip`)

| `LifeReceipt` Field | Transformation / Source Expression | Handling Missing / Edge Cases |
| :--- | :--- | :--- |
| `id` | `` `spot_${index}` `` | Index-based sequential key |
| `source` | `'spotify'` | Fixed constant |
| `type` | `'audio_stream'` | Fixed constant |
| `timestamp` | `Date.parse(row.ts + "Z")` | Parsed as strict UTC timestamp |
| `title` | `row.track_name.trim()` | Fallback: `'Untitled Track'` |
| `subtitle` | `row.artist_name.trim()` | Fallback: `'Unknown Artist'` |
| `description` | `` `${row.track_name} by ${row.artist_name} (${formatDuration(row.ms_played)})` `` | Clean summary string |
| `category` | `'Music & Audio'` | Canonical taxonomy |
| `subcategory` | `row.album_name.trim()` | Fallback: `null` |
| `rawCategory` | `'Music Streaming'` | Descriptive label |
| `amount` | `null` | Non-financial record |
| `currency` | `null` | Non-financial record |
| `location` | Derived context object from `platform`: <br>• `cast to device` -> `context: 'Home Speaker / Living Room'`<br>• `android` / `iOS` -> `context: 'Mobile / Transit'`<br>• `windows` / `mac` -> `context: 'Workstation / Desk'`<br>• `web player` -> `context: 'Web Browser'` | `lat: null`, `long: null` |
| `entities` | Array of extracted entities:<br>• `{ name: row.artist_name, type: 'artist' }`<br>• `{ name: row.album_name, type: 'album' }`<br>• `{ name: row.track_name, type: 'track' }`<br>• `{ name: row.platform, type: 'device' }` | Sanitized strings |
| `metadata` | `{ durationMs: row.ms_played, durationFormatted: formatDuration(row.ms_played), platform: row.platform, reasonStart: row.reason_start || 'unknown', reasonEnd: row.reason_end || 'unknown', shuffle: Boolean(row.shuffle), skipped: Boolean(row.skipped), trackUri: row.spotify_track_uri }` | Null reasons defaulted to `'unknown'` |
| `tags` | `['music', 'audio', row.platform, row.skipped ? 'skipped' : 'completed', row.shuffle ? 'shuffle' : 'sequential']` | Normalized lowercase |

---

### 3.2 Dataset 2: Daily Household Transactions (`archive (1).zip`)

| `LifeReceipt` Field | Transformation / Source Expression | Handling Missing / Edge Cases |
| :--- | :--- | :--- |
| `id` | `` `hh_${index}` `` | Index-based sequential key |
| `source` | `'household'` | Fixed constant |
| `type` | `row['Income/Expense'] === 'Income' ? 'household_income' : (row['Income/Expense'] === 'Transfer-Out' ? 'household_transfer' : 'household_expense')` | Defaults to `'household_expense'` |
| `timestamp` | `parseIndianDateTime(row.Date)` | Handles both `DD/MM/YYYY HH:mm:ss` and `DD/MM/YYYY` |
| `title` | `cleanTitle(row.Note || row.Subcategory || row.Category)` | E.g. `"Cutting chai"`, `"Audible subscription"`, `"Milk"` |
| `subtitle` | `` `${row.Category}${row.Subcategory ? ' • ' + row.Subcategory : ''}` `` | Clean breadcrumb |
| `description` | `` `${row['Income/Expense']}: ₹${row.Amount} via ${sanitizePaymentMode(row.Mode)} for ${row.Note || row.Subcategory || row.Category}` `` | Plain English transaction narrative |
| `category` | Mapped via canonical dictionary (e.g. `Food` -> `'Food & Dining'`, `subscription` -> `'Subscriptions & Digital'`) | Unrecognized mapped to `'General & Other'` |
| `subcategory` | `row.Subcategory?.trim() || row.Category.trim()` | Fallback to Category |
| `rawCategory` | `row.Category.trim()` | Preserved raw category |
| `amount` | `parseFloat(row.Amount) || 0` | Validated positive float |
| `currency` | `'INR'` | Constant |
| `location` | Extracted from `Note` transit phrases (e.g., routes mentioning `"station"`, `"Sevagram"`, `"residence"`, `"CHS"`) -> `{ city: 'Mumbai/Pune Metro Area', state: 'Maharashtra', country: 'India', context: 'Transit/Commute Route' }` | Defaults to `{ city: null, state: 'Maharashtra', country: 'India', context: 'Domestic Household' }` |
| `entities` | Array of extracted entities:<br>• `{ name: sanitizePaymentMode(row.Mode), type: 'payment_mode' }`<br>• `{ name: row.Category, type: 'category' }`<br>• If vendor detected (e.g. `Netflix`, `Audible`, `Ola`, `Decathlon`, `Amazon Prime`), add `{ name: vendor, type: 'subscription_service' | 'merchant' }` | Filter out empty/null values |
| `metadata` | `{ paymentMode: sanitizePaymentMode(row.Mode), transactionType: row['Income/Expense'], rawNote: sanitizeNote(row.Note), originalCategory: row.Category, originalSubcategory: row.Subcategory || null }` | Sensitive medical keywords in note sanitized |
| `tags` | `['household', row['Income/Expense'].toLowerCase(), category.toLowerCase(), sanitizePaymentMode(row.Mode).toLowerCase()]` | Normalized lowercase |

---

### 3.3 Dataset 3: Augmented India Transactions & Fraud (`archive (2).zip`)

| `LifeReceipt` Field | Transformation / Source Expression | Handling Missing / Edge Cases |
| :--- | :--- | :--- |
| `id` | `` `comm_${row.trans_id || index}` `` | Uses transaction ID with index fallback |
| `source` | `'commerce'` | Fixed constant |
| `type` | `'commercial_transaction'` | Fixed constant |
| `timestamp` | `parseCommerceDateTime(row.trans_date_trans_time)` | Handles `M/D/YYYY H:mm` |
| `title` | `cleanMerchantName(row.merchant)` (strips internal prefix `"fraud_"`) | E.g. `"fraud_Bedi-Krish Pvt Ltd"` -> `"Bedi-Krish Pvt Ltd"` |
| `subtitle` | `` `${cleanCategory(row.category)} • ${row.city || 'India'}, ${row.state || ''}` `` | Descriptive subtitle |
| `description` | `` `₹${row.amt} paid to ${cleanMerchantName(row.merchant)} in ${row.city || 'India'} (${cleanCategory(row.category)})` `` | Human-readable receipt text |
| `category` | Mapped via taxonomy:<br>• `online_shopping` -> `'Shopping & Retail'`<br>• `travel` -> `'Transportation & Commute'`<br>• `entertainment` -> `'Entertainment & Leisure'`<br>• `fitness_and_medical` -> `'Health & Wellness'` | Fallback: `'Shopping & Retail'` |
| `subcategory` | `cleanCategory(row.category)` | Fallback: `'Commercial Payment'` |
| `rawCategory` | `row.category || 'uncategorized'` | Preserved string |
| `amount` | `parseFloat(row.amt) || 0` | Validated positive float |
| `currency` | `'INR'` | Constant |
| `location` | `{ city: row.city || null, state: row.state || null, country: 'India', lat: sanitizeCoord(row.lat), long: sanitizeCoord(row.long), merchLat: sanitizeCoord(row.merch_lat), merchLong: sanitizeCoord(row.merch_long), distanceKm: calculateHaversine(row.lat, row.long, row.merch_lat, row.merch_long), context: 'Commercial Merchant' }` | Coordinates validated within [-90,90] and [-180,180] |
| `entities` | Array of extracted entities:<br>• `{ name: cleanMerchantName(row.merchant), type: 'merchant' }`<br>• `{ name: row.city, type: 'location' }` (if present)<br>• `{ name: row.state, type: 'location' }` (if present)<br>• `{ name: row.job, type: 'profession' }` (if present) | Deduplicated non-null entities |
| `metadata` | `{ merchant: cleanMerchantName(row.merchant), rawMerchant: row.merchant, isFraud: row.is_fraud === 1.0, fraudLabel: row.is_fraud === 1.0 ? 'Fraud Alert' : 'Verified', maskedCard: maskCardNumber(row.cc_num), cityPopulation: row.city_pop || null, job: row.job || null, gender: row.gender || null }` | **NEVER** store raw `cc_num`, `dob`, or `street` in metadata |
| `tags` | `['commerce', cleanCategory(row.category).toLowerCase(), row.is_fraud === 1.0 ? 'fraud-alert' : 'verified', row.state?.toLowerCase()].filter(Boolean)` | Normalized lowercase tags |

---

## 4. Privacy & Data Sanitization Mandates

To ensure 100% security and privacy compliance in a client-side web application:

```
+-----------------------------------------------------------------------------------------------+
|                                      PRIVACY PROTECTION RULES                                  |
+----------------------+--------------------+---------------------------------------------------+
| Sensitive Raw Field  | Risk Profile       | Sanitization / Transformation Rule                 |
+----------------------+--------------------+---------------------------------------------------+
| `cc_num`             | PCI-DSS / High     | Mask as `•••• •••• •••• ${last4}` or omit entirely.|
| `dob`                | Identity Theft     | Never exposed. Do not include in `LifeReceipt`.   |
| `street`             | Physical Security  | Do not expose street address. Keep city/state only.|
| `customer_id`        | Internal Hash      | Omit raw internal database key.                   |
| `Note` (Medical)     | Health Privacy     | Redact specific medical drug names to "Medicine". |
| `Mode` (Bank Acct)   | Account Obfuscation| Rename `"Saving Bank account 1"` -> `"Primary Bank"`|
+----------------------+--------------------+---------------------------------------------------+
```

---

## 5. Performance & Scaling Architecture

The combined volume across all three datasets is **~162,588 records** (~150k Spotify + ~2.5k Household + ~10k Commerce).

### 5.1 In-Memory Representation Optimization
- **Compact Object Structure**: Standard plain JavaScript objects without deep cyclic references.
- **Direct Millisecond Timestamps**: Fast binary searches, range filtering, and chronological sorting using `receipt.timestamp` without re-instantiating `new Date()`.
- **Pre-computed Derived Dimensions**: `year`, `month`, `dayOfWeek`, `hour` computed once at ingest time for instant aggregations in charts and filters.

### 5.2 Chunked / Non-Blocking Ingestion
- For large CSV streams (Spotify 21MB), ingestion is processed in chunks using `requestAnimationFrame` or `setTimeout(..., 0)` to maintain a responsive 60fps UI without main-thread blocking.

### 5.3 Unified Store & Query Engine
- Unified array `LifeReceipt[]` with secondary indexed lookup maps:
  - **By Year**: `Map<number, LifeReceipt[]>`
  - **By Category**: `Map<string, LifeReceipt[]>`
  - **By Source**: `Map<ReceiptSource, LifeReceipt[]>`
  - **By Entity**: `Map<string, Set<string>>` (Entity Name -> Set of Receipt IDs)

---
*Specification approved. Proceeding to pure TypeScript / JavaScript normalization utility implementation.*
