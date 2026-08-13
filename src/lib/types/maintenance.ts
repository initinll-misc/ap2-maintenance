export interface FixedCostItem {
  id: string;
  label: string;
  societyMonthly: number;
  societyAnnual: number;
  perFlatMonthly: number;
  perFlatAnnual: number;
}

export interface FixedResult {
  items: FixedCostItem[];
  totalMonthly: number;
  totalAnnual: number;
  perFlat: number;
  bufferAmount: number;
  withBuffer: number;
  rounded: number;
  bufferPercent: number;
}

export interface VariableFundResult {
  id: string;
  label: string;
  annualPercent: number;
  monthly: number;
  annual: number;
}

export interface VariableResult {
  carpet: number;
  balcony: number;
  area: number;
  constructionCostPerSqFt: number;
  funds: VariableFundResult[];
  total: number;
  totalAnnual: number;
}

export interface TemporaryChargeResult {
  id: string;
  label: string;
  monthlyAmount: number;
  note: string;
  startMonth: string;
  endMonth: string;
  activeMonths: number;
  annualAmount: number;
}

export interface TemporaryResult {
  charges: TemporaryChargeResult[];
  total: number;
}

export interface AnnualProjection {
  recurringAnnual: number;
  temporaryAnnual: number;
  grandAnnual: number;
}

export interface MaintenanceResult {
  flatCount: number;
  fixed: FixedResult;
  variable: VariableResult;
  temporary: TemporaryResult;
  subtotalMonthly: number;
  exactMonthly: number;
  grandMonthly: number;
  grandAnnual: number;
  annual: AnnualProjection;
  billingMonth: string;
}
