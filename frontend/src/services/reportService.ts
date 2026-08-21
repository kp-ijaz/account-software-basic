import api from './api';
import { MonthlyReportData, YearlyReportData, BalanceSheetData } from '../types/reports';

class ReportService {
  async getMonthlyReport(month: number, year: number): Promise<MonthlyReportData> {
    try {
      const response = await api.get<MonthlyReportData>(
        `/reports/monthly?month=${month}&year=${year}`
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch monthly report';
      throw new Error(message);
    }
  }

  async getYearlyReport(year: number): Promise<YearlyReportData> {
    try {
      const response = await api.get<YearlyReportData>(`/reports/yearly?year=${year}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch yearly report';
      throw new Error(message);
    }
  }

  async getBalanceSheet(): Promise<BalanceSheetData> {
    try {
      const response = await api.get<BalanceSheetData>('/reports/balance-sheet');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch balance sheet';
      throw new Error(message);
    }
  }

  generatePDF(html: string, filename: string) {
    // This will be implemented using html2pdf or similar
    // For now, we'll create a simple PDF download
    const element = document.createElement('div');
    element.innerHTML = html;

    // Using native browser print
    const printWindow = window.open('', '', 'width=900,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  }

  downloadAsPDF(reportName: string) {
    // Placeholder for actual PDF generation
    // Will be implemented with html2pdf library
    console.log(`Downloading ${reportName} as PDF`);
  }
}

export default new ReportService();
