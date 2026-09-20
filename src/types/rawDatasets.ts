/**
 * Raw input interfaces for each of the three datasets as parsed from CSV / JSON.
 */

export interface RawSpotifyRecord {
  spotify_track_uri?: string;
  ts?: string;
  platform?: string;
  ms_played?: number | string;
  track_name?: string;
  artist_name?: string;
  album_name?: string;
  reason_start?: string;
  reason_end?: string;
  shuffle?: boolean | string;
  skipped?: boolean | string;
}

export interface RawHouseholdRecord {
  Date?: string;
  Mode?: string;
  Category?: string;
  Subcategory?: string;
  Note?: string;
  Amount?: number | string;
  'Income/Expense'?: string;
  Currency?: string;
}

export interface RawCommerceRecord {
  trans_id?: number | string;
  trans_date_trans_time?: string;
  cc_num?: number | string;
  merchant?: string;
  category?: string;
  amt?: number | string;
  first?: string;
  last?: string;
  gender?: string;
  street?: string;
  city?: string;
  state?: string;
  lat?: number | string;
  long?: number | string;
  city_pop?: number | string;
  job?: string;
  dob?: string;
  merch_lat?: number | string;
  merch_long?: number | string;
  is_fraud?: number | string;
  customer_id?: number | string;
}
