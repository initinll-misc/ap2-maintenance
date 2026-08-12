/**
 * Hybrid maintenance calculator — pure functions, no DOM dependencies.
 */

function roundTo(value, step) {
  if (!step || step <= 0) return value;
  return Math.round(value / step) * step;
}

function parseMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function formatMonth(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function isMonthInRange(billingMonth, startMonth, endMonth) {
  const current = parseMonth(billingMonth);
  const start = parseMonth(startMonth);
  const end = parseMonth(endMonth);
  return current >= start && current <= end;
}

function monthsBetweenInclusive(startMonth, endMonth) {
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

function calcFixed(config) {
  const active = config.fixedCosts.filter((c) => c.active);
  const totalMonthly = active.reduce((sum, c) => sum + c.monthly, 0);
  const totalAnnual = totalMonthly * 12;
  const perFlat = totalMonthly / config.society.flatCount;
  const bufferAmount = perFlat * (config.society.bufferPercent / 100);
  const withBuffer = perFlat + bufferAmount;
  const rounded = roundTo(withBuffer, config.rounding.fixedPerFlat);

  const items = active
    .map((item) => ({
      id: item.id,
      label: item.label,
      societyMonthly: item.monthly,
      societyAnnual: item.monthly * 12,
      perFlatMonthly: item.monthly / config.society.flatCount,
      perFlatAnnual: (item.monthly * 12) / config.society.flatCount,
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
    flatCount: config.society.flatCount,
    bufferPercent: config.society.bufferPercent,
  };
}

function calcVariable(config, carpet, balcony) {
  const area = (carpet || 0) + (balcony || 0);
  const rate = config.variable.constructionCostPerSqFt;

  const funds = config.variable.funds.map((fund) => {
    const monthly = (area * rate * fund.annualPercent) / 100 / 12;
    return {
      id: fund.id,
      label: fund.label,
      annualPercent: fund.annualPercent,
      formulaNote: fund.formulaNote || '',
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

function calcTemporary(config, billingMonth) {
  const charges = (config.temporaryCharges || [])
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

function calcAnnualProjection(fixed, variable, temporary) {
  const recurringAnnual =
    fixed.rounded * 12 + variable.totalAnnual;
  const temporaryAnnual = temporary.charges.reduce(
    (sum, c) => sum + c.annualAmount,
    0
  );
  return {
    recurringAnnual,
    temporaryAnnual,
    grandAnnual: recurringAnnual + temporaryAnnual,
  };
}

function calculateMaintenance(config, carpet, balcony, billingMonth) {
  const fixed = calcFixed(config);
  const variable = calcVariable(config, carpet, balcony);
  const temporary = calcTemporary(config, billingMonth);

  const subtotalMonthly = fixed.rounded + variable.total;
  const exactMonthly = subtotalMonthly + temporary.total;
  const annual = calcAnnualProjection(fixed, variable, temporary);
  const grandMonthly = roundTo(exactMonthly, config.rounding.finalMonthly);
  const grandAnnual = roundTo(annual.grandAnnual, config.rounding.finalMonthly);

  return {
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    calculateMaintenance,
    calcFixed,
    calcVariable,
    calcTemporary,
    roundTo,
  };
}
