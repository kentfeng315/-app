export interface ExpenseRecord {
  date: string;
  ct_amount: number;
  cathay_amount: number;
  taishin_amount: number;
  mega_amount: number;
  total: number;
  family: number;
  rent: number;
  periodic: number;
  extra: number;
  note: string;
}

export interface BankTotals {
  ct: number;
  cathay: number;
  taishin: number;
  mega: number;
}

export interface Stats {
  totalSpent: number;
  avgSpent: number;
  bankTotals: BankTotals;
  maxMonth: ExpenseRecord | null;
}
