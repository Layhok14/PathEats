import * as XLSX from "xlsx";

export interface SheetDef {
  name: string;
  headers: string[];
  rows: unknown[][];
}

export function exportXlsx(sheets: SheetDef[], filename: string) {
  const wb = XLSX.utils.book_new();
  for (const s of sheets) {
    const ws = XLSX.utils.aoa_to_sheet([s.headers, ...s.rows]);
    XLSX.utils.book_append_sheet(wb, ws, s.name);
  }
  XLSX.writeFile(wb, filename);
}
