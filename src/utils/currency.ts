import { CurrencyRate } from '../types';

export const CURRENCY_RATES: Record<string, CurrencyRate> = {
  NGN: {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rateToUsd: 1580.0,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToUsd: 1.0,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateToUsd: 0.92,
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rateToUsd: 0.79,
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rateToUsd: 1.36,
  },
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rateToUsd: 3.67,
  },
  ZAR: {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rateToUsd: 18.25,
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'AU$',
    rateToUsd: 1.52,
  },
  CNY: {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rateToUsd: 7.23,
  },
};

/**
 * Converts an amount from baseCurrency to targetCurrency
 */
export function convertCurrency(
  amount: number,
  baseCurrencyCode: string,
  targetCurrencyCode: string
): number {
  if (baseCurrencyCode === targetCurrencyCode) return amount;
  
  const baseRate = CURRENCY_RATES[baseCurrencyCode]?.rateToUsd || 1.0;
  const targetRate = CURRENCY_RATES[targetCurrencyCode]?.rateToUsd || 1.0;

  // Convert to USD first, then to target currency
  const amountInUsd = amount / baseRate;
  const convertedAmount = amountInUsd * targetRate;
  
  return convertedAmount;
}

/**
 * Format currency with proper separators and symbols
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  compact = false
): string {
  const currency = CURRENCY_RATES[currencyCode] || CURRENCY_RATES.NGN;
  
  if (compact && amount >= 1_000_000_000) {
    return `${currency.symbol}${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (compact && amount >= 1_000_000) {
    return `${currency.symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (compact && amount >= 1_000) {
    return `${currency.symbol}${(amount / 1_000).toFixed(0)}k`;
  }

  // Round nicely
  const rounded = currencyCode === 'NGN' ? Math.round(amount) : Math.round(amount * 100) / 100;
  
  return `${currency.symbol}${rounded.toLocaleString('en-US', {
    maximumFractionDigits: currencyCode === 'NGN' ? 0 : 2,
    minimumFractionDigits: 0,
  })}`;
}
