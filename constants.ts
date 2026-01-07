import { ExpenseRecord } from './types';

// Visual color palette
export const COLORS = {
  total: '#e76f51', // 總計 (Red)
  rent: '#8338ec',
  family: '#3a86ff',
  bg: '#f8f9fa',
  cardBg: '#ffffff',
  // Dynamic bank colors pool
  bankPalette: [
    '#006d77', // Teal
    '#2a9d8f', // Green
    '#e9c46a', // Yellow
    '#f4a261', // Orange
    '#264653', // Dark Blue
    '#d62828', // Red
    '#8ecae6', // Light Blue
    '#9d4edd', // Purple
  ]
};

export const getBankColor = (index: number) => {
  return COLORS.bankPalette[index % COLORS.bankPalette.length];
};

// Default dataset to show when app loads
export const INITIAL_CSV_DATA: ExpenseRecord[] = [];
export const INITIAL_BANK_NAMES: string[] = ['中信', '國泰', '台新', '兆豐'];

// Helper to create initial data if needed (currently empty as requested)
export const createEmptyRecord = (): ExpenseRecord => ({
  id: '',
  date: '',
  banks: {},
  total: 0,
  family: 0,
  rent: 0,
  periodic: 0,
  extra: 0,
  note: ''
});
