import { ExpenseRecord, ProcessedData } from '../types';

const parseMoney = (str: string | undefined): number => {
  if (!str) return 0;
  // Remove "$", ",", " " and quotes
  const cleanStr = str.replace(/[$,\s"]/g, '');
  const num = parseFloat(cleanStr);
  return isNaN(num) ? 0 : num;
};

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export const isValidDate = (dateStr: string): boolean => {
  // Accepts YY/MM, YYYY/MM, YY/M, YYYY/M
  // e.g., 22/01, 2022/1
  const regex = /^\d{2,4}\/\d{1,2}$/;
  return regex.test(dateStr);
};

export const getDateValue = (dateStr: string): number => {
  if (!dateStr) return 0;
  const parts = dateStr.split('/');
  if (parts.length !== 2) return 0;
  
  let year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  
  // Handle 2-digit years (assume 20xx)
  if (year < 100) year += 2000;
  
  return year * 100 + month;
};

export const processCSV = (csvText: string): ProcessedData => {
  const lines = csvText.split('\n');
  const newData: ExpenseRecord[] = [];
  let bankNames: string[] = [];

  // Try to find header row to identify columns
  // Assuming the structure from the snippet: Date, Bank1, ..., Date, Bank2, ..., Total
  // We look for the row containing "總" or "Total" to determine structure.
  
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    if (lines[i].includes('總') || lines[i].toLowerCase().includes('total')) {
      headerRowIndex = i;
      break;
    }
  }

  // Fallback to index 1 if not found (standard based on previous code skipping 2 lines)
  if (headerRowIndex === -1 && lines.length > 1) headerRowIndex = 1;

  if (headerRowIndex !== -1 && lines.length > headerRowIndex) {
    const headerLine = lines[headerRowIndex].trim();
    // Split headers handling quotes
    const headers = headerLine.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.replace(/"/g, '').trim());
    
    // Find key column indices
    const totalIndex = headers.findIndex(h => h.includes('總') || h.toLowerCase().includes('total') || h.includes('月消費'));
    
    // Identify banks
    // Strategy: Look for columns before Total that look like banks.
    // Based on provided pattern, banks are at indices 1, 6, 11... (Step 5)
    // Or we scan for any column that ends in "金額" or isn't a Date/Total.
    
    // Let's use the interval strategy if we found a Total column
    if (totalIndex > 1) {
      // Assuming pattern: [Date, BankAmount, x, x, x] repeating
      for (let i = 1; i < totalIndex; i += 5) {
        let name = headers[i];
        // Clean name (e.g., "中信金額" -> "中信")
        name = name.replace('金額', '').replace('Amount', '').trim();
        if (name) {
          bankNames.push(name);
        } else {
           bankNames.push(`Bank ${bankNames.length + 1}`);
        }
      }
    } else {
      // Fallback defaults if structure is unrecognized
      bankNames = ['中信', '國泰', '台新', '兆豐'];
    }

    // Indices for known columns based on Total position (assuming standard tail structure)
    // Total (21) -> Family (25) -> Rent (26) -> Periodic (27) -> Extra (28) -> Note (Last)
    // Diff: Family = Total + 4, Rent = Total + 5, etc.
    const familyOffset = 4;
    const rentOffset = 5;
    const periodicOffset = 6;
    const extraOffset = 7;
    // Note is usually last

    // Process Data Rows
    for (let i = headerRowIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); 
      
      // Basic validation: must have enough columns to reach Total
      if (cols.length < totalIndex) continue;

      const dateStr = cols[0]?.replace(/"/g, '') || '';
      // We keep the row even if date is invalid, but maybe flag it? 
      // For now, only filter out completely empty dates.
      
      // Extract bank values dynamically
      const banks: { [key: string]: number } = {};
      bankNames.forEach((name, idx) => {
        const colIndex = 1 + (idx * 5); // 1, 6, 11...
        banks[name] = parseMoney(cols[colIndex]);
      });

      const row: ExpenseRecord = {
        id: generateId(),
        date: dateStr,
        banks: banks,
        total: parseMoney(cols[totalIndex]),
        // If dynamic, rely on offsets from Total, otherwise fallback to hardcoded indices from previous version (25, 26...) if total is at 21
        family: parseMoney(cols[totalIndex + familyOffset]), 
        rent: parseMoney(cols[totalIndex + rentOffset]),
        periodic: parseMoney(cols[totalIndex + periodicOffset]),
        extra: parseMoney(cols[totalIndex + extraOffset]),
        note: cols[cols.length - 1]?.replace(/"/g, '').replace(/\r/, '') || ''
      };

      if (row.date) {
        newData.push(row);
      }
    }
  }

  return { data: newData, bankNames };
};

export const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return '-';
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val);
};