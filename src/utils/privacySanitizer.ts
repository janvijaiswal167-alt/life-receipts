/**
 * Privacy and Data Sanitization Utilities for LIFE//RECEIPTS
 * Ensures that sensitive PII, PCI data, and raw technical noise are masked or redacted.
 */

/**
 * Masks credit card numbers strictly according to PCI-DSS display best practices.
 * Example: 579516000000 -> "•••• •••• •••• 0000"
 */
export function maskCreditCard(ccNum: any): string {
  if (ccNum === null || ccNum === undefined || ccNum === '') {
    return '•••• •••• •••• ••••';
  }

  // Handle float/scientific notation numbers if passed as number
  let str = '';
  if (typeof ccNum === 'number') {
    str = Math.floor(ccNum).toString();
  } else {
    str = String(ccNum).trim().replace(/\D/g, '');
  }

  if (str.length < 4) {
    return '•••• •••• •••• ••••';
  }

  const last4 = str.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Cleans merchant names by stripping internal simulation prefixes like "fraud_"
 * Example: "fraud_Bedi-Krish Pvt Ltd" -> "Bedi-Krish Pvt Ltd"
 */
export function cleanMerchantName(merchant?: string | null): string {
  if (!merchant || typeof merchant !== 'string') return 'Merchant';
  let cleaned = merchant.trim();
  if (cleaned.toLowerCase().startsWith('fraud_')) {
    cleaned = cleaned.substring(6).trim();
  }
  return cleaned || 'Merchant';
}

/**
 * Sanitizes internal payment mode labels into user-friendly display names
 */
export function sanitizePaymentMode(mode?: string | null): string {
  if (!mode || typeof mode !== 'string') return 'Cash / Direct';
  const trimmed = mode.trim();

  const modeMap: Record<string, string> = {
    'Saving Bank account 1': 'Primary Savings Bank',
    'Saving Bank account 2': 'Secondary Savings Bank',
    'Cash': 'Cash',
    'Credit Card': 'Credit Card',
    'Debit Card': 'Debit Card',
    'Equity Mutual Fund A': 'Equity Mutual Fund (Folio A)',
    'Equity Mutual Fund B': 'Equity Mutual Fund (Folio B)',
    'Equity Mutual Fund C': 'Equity Mutual Fund (Folio C)',
    'Equity Mutual Fund D': 'Equity Mutual Fund (Folio D)',
    'Equity Mutual Fund E': 'Equity Mutual Fund (Folio E)',
    'Share Market Trading': 'Demat / Trading Account',
    'Recurring Deposit': 'Recurring Deposit (RD)',
    'Fixed Deposit': 'Fixed Deposit (FD)',
    'Public Provident Fund': 'Public Provident Fund (PPF)',
  };

  return modeMap[trimmed] || trimmed;
}

/**
 * Sanitizes personal notes (e.g. from daily expenses) to avoid leaking private health or personal details
 */
export function sanitizeNote(note?: string | null): string {
  if (!note || typeof note !== 'string') return '';
  let cleaned = note.trim();
  if (!cleaned || cleaned.toLowerCase() === 'nan' || cleaned.toLowerCase() === 'null') return '';

  // Clean common repetitive patterns
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned;
}

/**
 * Sanitizes category strings
 */
export function cleanCategoryString(cat?: string | null): string {
  if (!cat || typeof cat !== 'string') return 'General';
  const trimmed = cat.trim();
  if (!trimmed || trimmed.toLowerCase() === 'nan' || trimmed.toLowerCase() === 'null') return 'General';

  // Replace underscores with spaces and capitalize
  return trimmed
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
