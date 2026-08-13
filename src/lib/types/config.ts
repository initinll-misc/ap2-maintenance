export interface UnitType {
  id: string;
  label: string;
  units: number;
}

export interface FixedCost {
  id: string;
  label: string;
  monthly: number;
  active: boolean;
}

export interface VariableFund {
  id: string;
  label: string;
  annualPercent: number;
  formulaNote?: string;
}

export interface TemporaryCharge {
  id: string;
  label: string;
  monthlyAmount: number;
  startMonth: string;
  endMonth: string;
  totalTarget?: number;
  active: boolean;
  note?: string;
}

export interface MaintenanceConfig {
  defaults: {
    carpetArea: number;
    balconyArea: number;
  };
  expenses: {
    fixed: {
      bufferPercent: number;
      unitTypes: UnitType[];
      costs: FixedCost[];
    };
    variable: {
      constructionCostPerSqFt: number;
      funds: VariableFund[];
    };
    temporary: TemporaryCharge[];
  };
  rounding: {
    fixedPerFlat: number;
    finalMonthly: number;
  };
  display: {
    currency: string;
    locale: string;
  };
}
