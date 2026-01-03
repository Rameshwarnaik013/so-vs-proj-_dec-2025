
import { InventoryRecord } from './types';

export const parseCSV = (csv: string): InventoryRecord[] => {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    
    // Helper to parse numeric values. Returns NaN for invalid strings or specific error markers.
    const parseNum = (val: string) => {
      if (!val || val.trim() === '' || val.includes('#DIV/0!') || val.toLowerCase().includes('nan')) return NaN;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? NaN : parsed;
    };

    return {
      month: values[0],
      year: parseInt(values[1]),
      itemCode: values[2],
      itemParent: values[3],
      itemName: values[4],
      itemType: values[5],
      itemGroup: values[6],
      projection: parseNum(values[7]),
      soQty: parseNum(values[8]),
      internalQty: parseNum(values[9]),
      dispatch: parseNum(values[10]),
      projMinusSo: parseNum(values[11]),
      fillRate: parseNum(values[12]),
      soVsProj: parseNum(values[13]),
      soVsProjPercentage: values[14]
    };
  });
};

export const downloadAsCSV = (data: InventoryRecord[], filename: string) => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(record => 
    Object.values(record).map(val => 
      typeof val === 'string' ? `"${val}"` : (val === null || isNaN(val as number) ? '' : val)
    ).join(',')
  ).join('\n');
  
  const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
