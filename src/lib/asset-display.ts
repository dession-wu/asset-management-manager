export const categoryLabels: Record<string, string> = {
  CASH: '现金', FIXED: '固收', EQUITY: '权益', ALTERNATIVE: '另类', REAL_ESTATE: '房产', DEBT: '债务',
}

// Protect CSV column boundaries and prevent names from becoming spreadsheet formulas.
export function csvCell(value: string | number): string {
  const text = String(value)
  const safe = typeof value === 'string' && /^\s*[=+\-@\t\r\n]/.test(text) ? `'${text}` : text
  return `"${safe.replaceAll('"', '""')}"`
}
