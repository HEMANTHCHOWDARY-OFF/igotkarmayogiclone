import * as XLSX from "xlsx";

/**
 * Export data to a native Microsoft Excel (.xlsx) workbook.
 */
export function exportToExcel(
  filename: string,
  sheets: { sheetName: string; headers: string[]; rows: (string | number | boolean | null | undefined)[][] }[]
) {
  const workbook = XLSX.utils.book_new();

  sheets.forEach(({ sheetName, headers, rows }) => {
    const data = [headers, ...rows];
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Auto-fit column widths
    const colWidths = headers.map((header, colIdx) => {
      let maxLen = header.length;
      rows.forEach((row) => {
        const val = row[colIdx];
        if (val !== null && val !== undefined) {
          const strLen = String(val).length;
          if (strLen > maxLen) maxLen = strLen;
        }
      });
      return { wch: Math.min(Math.max(maxLen + 3, 10), 45) };
    });
    worksheet["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
  });

  const safeFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data to a standard CSV file with UTF-8 BOM encoding.
 */
export function exportToCSV(
  filename: string,
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
) {
  const data = [headers, ...rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const csvContent = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const safeFilename = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.setAttribute("download", safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
