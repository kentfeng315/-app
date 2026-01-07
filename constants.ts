import { ExpenseRecord } from './types';

// Visual color palette
export const COLORS = {
  ct: '#006d77',    // 中信 (Teal)
  cathay: '#2a9d8f',// 國泰 (Green)
  taishin: '#e9c46a', // 台新 (Yellow)
  mega: '#f4a261',  // 兆豐 (Orange)
  total: '#e76f51', // 總計 (Red)
  rent: '#8338ec',
  family: '#3a86ff',
  bg: '#f8f9fa',
  cardBg: '#ffffff'
};

// Default dataset to show when app loads
export const INITIAL_CSV_DATA: ExpenseRecord[] = [
  { date: '22/01', ct_amount: 12736, cathay_amount: 2642, taishin_amount: 0, mega_amount: 0, total: 15378, family: 0, rent: 0, periodic: 0, extra: 0, note: '' },
  { date: '22/02', ct_amount: 12931, cathay_amount: 8328, taishin_amount: 0, mega_amount: 0, total: 21259, family: 0, rent: 0, periodic: 0, extra: 0, note: '' },
  { date: '22/03', ct_amount: 15000, cathay_amount: 5000, taishin_amount: 2000, mega_amount: 0, total: 22000, family: 3000, rent: 3000, periodic: 0, extra: 0, note: '預估數據(填補)' },
  { date: '25/07', ct_amount: 0, cathay_amount: 16192, taishin_amount: 128928, mega_amount: 0, total: 145120, family: 3000, rent: 4200, periodic: 4000, extra: 0, note: '' },
  { date: '25/08', ct_amount: 2829, cathay_amount: 1856, taishin_amount: 35938, mega_amount: 0, total: 40623, family: 3000, rent: 3000, periodic: 4000, extra: 36333, note: '濟州花費+學費分期' },
  { date: '25/09', ct_amount: 2909, cathay_amount: 1856, taishin_amount: 26034, mega_amount: 0, total: 30799, family: 3000, rent: 3000, periodic: 4000, extra: 0, note: '' },
];
