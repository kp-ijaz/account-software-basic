export {
  downloadMonthlyReportPDF,
  downloadYearlyReportPDF,
  downloadBalanceSheetPDF,
  printReportHtml,
  monthlyReportPrintHtml,
  yearlyReportPrintHtml,
  balanceSheetPrintHtml,
} from './reportPdfTemplate';

export function getMonthlyReportFilename(month: number, year: number): string {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  return `Monthly_Report_${monthName}_${year}.pdf`;
}

export function getYearlyReportFilename(year: number): string {
  return `Yearly_Report_${year}.pdf`;
}

export function getBalanceSheetFilename(asOf?: string): string {
  const date = asOf ? asOf.replace(/\//g, '-') : new Date().toISOString().slice(0, 10);
  return `Balance_Sheet_${date}.pdf`;
}

export function getMonthlyReportTitle(month: number, year: number): string {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  return `Monthly Report - ${monthName} ${year}`;
}

export function getYearlyReportTitle(year: number): string {
  return `Yearly Report - ${year}`;
}

export function getBalanceSheetTitle(asOf?: string): string {
  return asOf ? `Balance Sheet - ${asOf}` : 'Balance Sheet';
}
