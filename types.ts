export interface ExpenseRecord {
  id: string;
  date: string;
  banks: { [key: string]: number };
  total: number;
  family: number;
  rent: number;
  periodic: number;
  extra: number;
  note: string;
}

export interface BankTotals {
  [key: string]: number;
}

export interface Stats {
  totalSpent: number;
  avgSpent: number;
  bankTotals: BankTotals;
  maxMonth: ExpenseRecord | null;
}

export interface ProcessedData {
  data: ExpenseRecord[];
  bankNames: string[];
}
