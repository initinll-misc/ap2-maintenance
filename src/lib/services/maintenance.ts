import type { MaintenanceConfig } from '$lib/types/config';
import type {
  AnnualProjection,
  FixedResult,
  MaintenanceResult,
  TemporaryResult,
  VariableResult,
} from '$lib/types/maintenance';

function roundTo(value: number, step: number): number {
  if (!step || step <= 0) return value;
  return Math.round(value / step) * step;
}

function parseMonth(monthStr: string): Date {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function isMonthInRange(billingMonth: string, startMonth: string, endMonth: string): boolean {
  const current = parseMonth(billingMonth);
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);
  return current >= start && current <= end;
}

function monthsBetweenInclusive(startMonth: string, endMonth: string): number {
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);
  let count = 0;
  const cursor = new Date(start);
  while (cursor <= end) {
    count++;
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return count;
}

export function getFlatCount(config: MaintenanceConfig): number {
  const count = (config.expenses.fixed.unitTypes ?? []).reduce((sum, type) => sum + type.units, 0);
  return count > 0 ? count : 1;
}

export function calcFixed(config: MaintenanceConfig, flatCount: number): FixedResult {
  const { fixed } = config.expenses;
  const active = fixed.costs.filter((c) => c.active);
  const totalMonthly = active.reduce((sum, c) => sum + c.monthly, 0);
  const totalAnnual = totalMonthly * 12;
  const perFlat = totalMonthly / flatCount;
  const bufferAmount = perFlat * (fixed.bufferPercent / 100);
  const withBuffer = perFlat + bufferAmount;
  const rounded = roundTo(withBuffer, config.rounding.fixedPerFlat);

  const items = active
    .map((item) => ({
      id: item.id,
      label: item.label,
      societyMonthly: item.monthly,
      societyAnnual: item.monthly * 12,
      perFlatMonthly: item.monthly / flatCount,
      perFlatAnnual: (item.monthly * 12) / flatCount,
    }))
    .sort((a, b) => b.societyMonthly - a.societyMonthly);

  return {
    items,
    totalMonthly,
    totalAnnual,
    perFlat,
    bufferAmount,
    withBuffer,
    rounded,
    bufferPercent: fixed.bufferPercent,
  };
}

export function calcVariable(
  config: MaintenanceConfig,
  carpet: number,
  balcony: number
): VariableResult {
  const { variable } = config.expenses;
  const area = (carpet || 0) + (balcony || 0);
  const rate = variable.constructionCostPerSqFt;

  const funds = variable.funds.map((fund) => {
    const monthly = (area * rate * fund.annualPercent) / 100 / 12;
    return {
      id: fund.id,
      label: fund.label,
      annualPercent: fund.annualPercent,
      monthly,
      annual: monthly * 12,
    };
  });

  const total = funds.reduce((sum, f) => sum + f.monthly, 0);

  return {
    carpet: carpet || 0,
    balcony: balcony || 0,
    area,
    constructionCostPerSqFt: rate,
    funds,
    total,
    totalAnnual: total * 12,
  };
}

export function calcTemporary(config: MaintenanceConfig, billingMonth: string): TemporaryResult {
  const charges = (config.expenses.temporary ?? [])
    .filter((c) => c.active)
    .filter((c) => isMonthInRange(billingMonth, c.startMonth, c.endMonth))
    .map((c) => {
      const activeMonths = monthsBetweenInclusive(c.startMonth, c.endMonth);
      const projectedTotal = c.monthlyAmount * activeMonths;
      const effectiveTotal = c.totalTarget
        ? Math.min(projectedTotal, c.totalTarget)
        : projectedTotal;

      return {
        id: c.id,
        label: c.label,
        monthlyAmount: c.monthlyAmount,
        note: c.note || '',
        startMonth: c.startMonth,
        endMonth: c.endMonth,
        activeMonths,
        annualAmount: effectiveTotal,
      };
    });

  const total = charges.reduce((sum, c) => sum + c.monthlyAmount, 0);

  return { charges, total };
}

export function calcAnnualProjection(
  fixed: FixedResult,
  variable: VariableResult,
  temporary: TemporaryResult
): AnnualProjection {
  const recurringAnnual = fixed.rounded * 12 + variable.totalAnnual;
  const temporaryAnnual = temporary.charges.reduce((sum, c) => sum + c.annualAmount, 0);
  return {
    recurringAnnual,
    temporaryAnnual,
    grandAnnual: recurringAnnual + temporaryAnnual,
  };
}

export function calculateMaintenance(
  config: MaintenanceConfig,
  carpet: number,
  balcony: number,
  billingMonth: string
): MaintenanceResult {
  const flatCount = getFlatCount(config);
  const fixed = calcFixed(config, flatCount);
  const variable = calcVariable(config, carpet, balcony);
  const temporary = calcTemporary(config, billingMonth);

  const subtotalMonthly = fixed.rounded + variable.total;
  const exactMonthly = subtotalMonthly + temporary.total;
  const annual = calcAnnualProjection(fixed, variable, temporary);
  const grandMonthly = roundTo(exactMonthly, config.rounding.finalMonthly);
  const grandAnnual = roundTo(annual.grandAnnual, config.rounding.finalMonthly);

  return {
    flatCount,
    fixed,
    variable,
    temporary,
    subtotalMonthly,
    exactMonthly,
    grandMonthly,
    grandAnnual,
    annual,
    billingMonth,
  };
}

export { roundTo };
