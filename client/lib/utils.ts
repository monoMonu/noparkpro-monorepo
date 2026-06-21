import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  headers?: Array<{ key: keyof T; label: string }>
) {
  if (!data || !data.length) return;

  const cols = headers || Object.keys(data[0]).map(key => ({ key: key as keyof T, label: String(key) }));
  
  // Create CSV header line
  const csvHeaders = cols.map(col => `"${String(col.label).replace(/"/g, '""')}"`).join(",");
  
  // Create CSV row lines
  const csvRows = data.map(row => {
    return cols.map(col => {
      const val = row[col.key];
      const strVal = val === null || val === undefined ? "" : String(val);
      return `"${strVal.replace(/"/g, '""')}"`;
    }).join(",");
  });

  const csvContent = [csvHeaders, ...csvRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}