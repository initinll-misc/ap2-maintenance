import type { MaintenanceConfig } from '$lib/types/config';

export function formatMonth(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export function formatMonthLabel(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

export function formatCurrency(
  amount: number,
  locale = 'en-IN',
  currency = 'INR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type CurrencyFormatter = (amount: number) => string;

export function createFormatter(config: MaintenanceConfig): CurrencyFormatter {
  return (amount: number) =>
    formatCurrency(amount, config.display.locale, config.display.currency);
}

export interface BillingMonthOption {
  value: string;
  label: string;
}

const BILLING_MONTH_START = new Date(2026, 0, 1);
const BILLING_FUTURE_YEARS = 5;

function billingMonthEnd(): Date {
  const now = new Date();
  return new Date(now.getFullYear() + BILLING_FUTURE_YEARS, 11, 1);
}

export function buildBillingMonthOptions(): BillingMonthOption[] {
  const options: BillingMonthOption[] = [];
  const end = billingMonthEnd();
  const cursor = new Date(BILLING_MONTH_START);

  while (cursor <= end) {
    options.push({
      value: formatMonth(cursor),
      label: cursor.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return options;
}

export function currentBillingMonth(): string {
  const now = new Date();
  const end = billingMonthEnd();
  let month = new Date(now.getFullYear(), now.getMonth(), 1);

  if (month < BILLING_MONTH_START) month = new Date(BILLING_MONTH_START);
  if (month > end) month = end;

  return formatMonth(month);
}
