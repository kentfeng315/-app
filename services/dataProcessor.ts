import { ExpenseRecord } from '../types';

const parseMoney = (str: string | undefined): number => {
  if (!str) return 0;
  // Remove "$", ",", " " and quotes
  const cleanStr = str.replace(/[$,\s"]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
};

export const processCSV = (csvText: string): ExpenseRecord[] => {
  const lines = csvText.split('\n');
  const newData: ExpenseRecord[] = [];

  // Skip first two lines (Header rows based on user provided structure)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Regex split to handle commas inside quotes
    const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
    
    // Based on user specification:
    // Col 0: Date
    // Col 1: CT Amount
    // Col 6: Cathay Amount
    // Col 11: Taishin Amount
    // Col 16: Mega Amount
    // Col 21: Total
    // Col 25: Family
    // Col 26: Rent
    // Col 27: Periodic
    // Col 28: Extra
    // Last Col: Note

    if (cols.length < 20) continue; // Basic validation

    const row: ExpenseRecord = {
      date: cols[0]?.replace(/"/g, '') || '',
      ct_amount: parseMoney(cols[1]),
      cathay_amount: parseMoney(cols[6]),
      taishin_amount: parseMoney(cols[11]),
      mega_amount: parseMoney(cols[16]),
      total: parseMoney(cols[21]),
      family: parseMoney(cols[25]),
      rent: parseMoney(cols[26]),
      periodic: parseMoney(cols[27]),
      extra: parseMoney(cols[28]),
      note: cols[cols.length - 1]?.replace(/"/g, '').replace(/\r/, '') || ''
    };

    if (row.date) {
      newData.push(row);
    }
  }
  
  return newData;
};

export const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val);
};
