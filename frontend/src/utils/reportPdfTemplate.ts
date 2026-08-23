import jsPDF from 'jspdf';
import {
  BalanceSheetData,
  MonthlyReportData,
  YearlyReportData,
} from '../types/reports';

const GREEN: [number, number, number] = [46, 125, 50];
const LIGHT_GREEN: [number, number, number] = [232, 245, 233];
const LIGHT_GRAY: [number, number, number] = [245, 245, 245];
const LINE: [number, number, number] = [200, 200, 200];
const TEXT: [number, number, number] = [33, 33, 33];

type Align = 'left' | 'right' | 'center';

interface Column {
  header: string;
  width: number;
  align?: Align;
}

function money(amount: number | undefined | null): string {
  const value = Number(amount || 0);
  return `Rs. ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`;
}

function dashMoney(amount: number | undefined | null): string {
  if (!amount) return '-';
  return money(amount);
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

class ReportPdf {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin = 14;
  y = 18;
  generatedAt = new Date().toLocaleString('en-IN');

  constructor(private title: string, private subtitle: string) {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.drawHeader();
  }

  contentWidth() {
    return this.pageWidth - this.margin * 2;
  }

  ensureSpace(height: number) {
    if (this.y + height > this.pageHeight - 16) {
      this.doc.addPage();
      this.y = 18;
      this.drawHeader(true);
    }
  }

  drawHeader(continued = false) {
    this.doc.setFillColor(...GREEN);
    this.doc.rect(0, 0, this.pageWidth, 12, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.text('Madrasa Accounting', this.margin, 8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.text(
      continued ? `${this.title} (continued)` : this.title,
      this.pageWidth - this.margin,
      8,
      { align: 'right' }
    );
    this.doc.setTextColor(...TEXT);

    if (!continued) {
      this.y = 20;
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(16);
      this.doc.text(this.title, this.margin, this.y);
      this.y += 7;
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.setTextColor(90, 90, 90);
      this.doc.text(this.subtitle, this.margin, this.y);
      this.y += 5;
      this.doc.setFontSize(8);
      this.doc.text(`Generated: ${this.generatedAt}`, this.margin, this.y);
      this.y += 8;
      this.doc.setTextColor(...TEXT);
    } else {
      this.y = 20;
    }
  }

  drawFooter() {
    const pages = this.doc.getNumberOfPages();
    for (let i = 1; i <= pages; i += 1) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.setTextColor(120, 120, 120);
      this.doc.text(
        'This report is generated from recorded transactions and cannot be edited.',
        this.margin,
        this.pageHeight - 8
      );
      this.doc.text(
        `Page ${i} of ${pages}`,
        this.pageWidth - this.margin,
        this.pageHeight - 8,
        { align: 'right' }
      );
    }
  }

  section(title: string) {
    this.ensureSpace(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.setTextColor(...GREEN);
    this.doc.text(title, this.margin, this.y);
    this.doc.setTextColor(...TEXT);
    this.y += 5;
  }

  summaryBoxes(items: { label: string; value: string }[]) {
    const gap = 3;
    const boxWidth = (this.contentWidth() - gap * (items.length - 1)) / items.length;
    const boxHeight = 16;
    this.ensureSpace(boxHeight + 4);

    items.forEach((item, index) => {
      const x = this.margin + index * (boxWidth + gap);
      this.doc.setFillColor(...LIGHT_GREEN);
      this.doc.setDrawColor(...LINE);
      this.doc.roundedRect(x, this.y, boxWidth, boxHeight, 1, 1, 'FD');
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(7);
      this.doc.setTextColor(90, 90, 90);
      this.doc.text(item.label, x + 2.5, this.y + 5);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...TEXT);
      this.doc.text(item.value, x + 2.5, this.y + 12);
    });

    this.y += boxHeight + 8;
  }

  table(columns: Column[], rows: string[][]) {
    const minRowHeight = 7;
    const headerHeight = 8;

    const drawHeaderRow = () => {
      this.ensureSpace(headerHeight + minRowHeight);
      let x = this.margin;
      this.doc.setFillColor(...GREEN);
      this.doc.rect(x, this.y, this.contentWidth(), headerHeight, 'F');
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(8);
      this.doc.setTextColor(255, 255, 255);
      columns.forEach((col) => {
        this.alignedText(col.header, x, this.y + 5.2, col.width, col.align || 'left');
        x += col.width;
      });
      this.y += headerHeight;
      this.doc.setTextColor(...TEXT);
    };

    drawHeaderRow();

    rows.forEach((row, rowIndex) => {
      const wrapped = columns.map((col, i) =>
        this.doc.splitTextToSize(String(row[i] || ''), Math.max(col.width - 2.4, 8))
      );
      const lineCount = Math.max(1, ...wrapped.map((parts) => parts.length));
      const height = Math.max(minRowHeight, lineCount * 4 + 3);

      if (this.y + height > this.pageHeight - 16) {
        this.doc.addPage();
        this.y = 18;
        this.drawHeader(true);
        drawHeaderRow();
      }

      if (rowIndex % 2 === 1) {
        this.doc.setFillColor(...LIGHT_GRAY);
        this.doc.rect(this.margin, this.y, this.contentWidth(), height, 'F');
      }

      this.doc.setDrawColor(...LINE);
      this.doc.line(
        this.margin,
        this.y + height,
        this.margin + this.contentWidth(),
        this.y + height
      );

      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(...TEXT);

      let x = this.margin;
      columns.forEach((col, i) => {
        this.alignedText(wrapped[i], x, this.y + 4.6, col.width, col.align || 'left');
        x += col.width;
      });

      this.y += height;
    });

    this.y += 6;
  }

  alignedText(text: string | string[], x: number, y: number, width: number, align: Align) {
    if (align === 'right') {
      this.doc.text(text, x + width - 1.2, y, { align: 'right' });
    } else if (align === 'center') {
      this.doc.text(text, x + width / 2, y, { align: 'center' });
    } else {
      this.doc.text(text, x + 1.2, y);
    }
  }

  keyValueTable(rows: { label: string; value: string; bold?: boolean }[]) {
    const height = 7;

    rows.forEach((row) => {
      this.ensureSpace(height);
      if (row.bold) {
        this.doc.setFillColor(...LIGHT_GREEN);
        this.doc.rect(this.margin, this.y, this.contentWidth(), height, 'F');
        this.doc.setFont('helvetica', 'bold');
      } else {
        this.doc.setFont('helvetica', 'normal');
      }
      this.doc.setFontSize(9);
      this.doc.setTextColor(...TEXT);
      this.doc.text(row.label, this.margin + 2, this.y + 4.8);
      this.doc.text(row.value, this.margin + this.contentWidth() - 2, this.y + 4.8, {
        align: 'right',
      });
      this.doc.setDrawColor(...LINE);
      this.doc.line(
        this.margin,
        this.y + height,
        this.margin + this.contentWidth(),
        this.y + height
      );
      this.y += height;
    });

    this.y += 6;
  }

  save(filename: string) {
    this.drawFooter();
    this.doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  }
}

function monthlyCategories(report: MonthlyReportData['data']) {
  const extra = report as {
    incomeByCategory?: { category: string; amount: number }[];
    expenseByCategory?: { category: string; amount: number }[];
  };
  return {
    income: report.incomeByCategory || extra.incomeByCategory || [],
    expense: report.expenseByCategory || extra.expenseByCategory || [],
  };
}

function balanceValues(report: BalanceSheetData['data']) {
  const assets = report.assets as Record<string, number>;
  const liabilities = report.liabilities as Record<string, number>;
  const equity = report.equity as Record<string, number>;
  const extra = report as { totalLiabilitiesAndEquity?: number };

  const cash = assets.cash ?? assets.cash ?? 0;
  const bank = assets.bankBalance ?? assets.bankBalance ?? 0;
  const totalAssets = assets.totalAssets ?? cash + bank;
  const payables = liabilities.pendingPayables ?? liabilities.pendingPayables ?? 0;
  const totalLiabilities = liabilities.totalLiabilities ?? payables;
  const opening = equity.openingBalance ?? 0;
  const currentIncome = equity.currentIncome ?? equity.currentIncome ?? 0;
  const currentExpense = equity.currentExpense ?? equity.currentExpense ?? 0;
  const netProfit = equity.netProfit ?? equity.netProfit ?? currentIncome - currentExpense;
  const totalEquity = equity.totalEquity ?? opening + netProfit;
  const totalLiabilitiesAndEquity =
    report.totalLiabilitiesAndEquity ?? extra.totalLiabilitiesAndEquity ?? totalLiabilities + totalEquity;

  return {
    cash,
    bank,
    totalAssets,
    payables,
    totalLiabilities,
    opening,
    currentIncome,
    currentExpense,
    netProfit,
    totalEquity,
    totalLiabilitiesAndEquity,
  };
}

export function downloadMonthlyReportPDF(
  report: MonthlyReportData['data'],
  filename: string
): void {
  const summary = report.summary;
  const pdf = new ReportPdf('Monthly Financial Report', `${summary.month} ${summary.year}`);
  const { income, expense } = monthlyCategories(report);
  const width = pdf.contentWidth();

  const extraSummary = summary as {
    openingBalance?: number;
    closingBalance?: number;
  };
  const opening = summary.openingBalance ?? extraSummary.openingBalance ?? 0;
  const closing = summary.closingBalance ?? extraSummary.closingBalance ?? 0;

  pdf.summaryBoxes([
    { label: 'Opening Balance', value: money(opening) },
    { label: 'Total Income', value: money(summary.totalIncome) },
    { label: 'Total Expense', value: money(summary.totalExpense) },
    { label: 'Closing Balance', value: money(closing) },
  ]);

  pdf.section('Income by Category');
  pdf.table(
    [
      { header: 'Category', width: width * 0.7 },
      { header: 'Amount', width: width * 0.3, align: 'right' },
    ],
    income.length
      ? income.map((item) => [item.category, money(item.amount)])
      : [['No income recorded', '-']]
  );

  pdf.section('Expense by Category');
  pdf.table(
    [
      { header: 'Category', width: width * 0.7 },
      { header: 'Amount', width: width * 0.3, align: 'right' },
    ],
    expense.length
      ? expense.map((item) => [item.category, money(item.amount)])
      : [['No expense recorded', '-']]
  );

  pdf.section('Detailed Transactions');
  pdf.table(
    [
      { header: 'Date', width: width * 0.14 },
      { header: 'Description', width: width * 0.28 },
      { header: 'Category', width: width * 0.16 },
      { header: 'Income', width: width * 0.14, align: 'right' },
      { header: 'Expense', width: width * 0.14, align: 'right' },
      { header: 'Balance', width: width * 0.14, align: 'right' },
    ],
    (report.transactions || []).length
      ? report.transactions.map((tx) => [
          tx.date,
          tx.description || '-',
          tx.category || '-',
          dashMoney(tx.income),
          dashMoney(tx.expense),
          money(tx.balance),
        ])
      : [['-', 'No transactions in this period', '-', '-', '-', '-']]
  );

  pdf.save(filename);
}

export function downloadYearlyReportPDF(
  report: YearlyReportData['data'],
  filename: string
): void {
  const pdf = new ReportPdf('Yearly Financial Report', `Year ${report.year}`);
  const width = pdf.contentWidth();

  const extra = report as { netBalance?: number };
  const net = report.netBalance ?? extra.netBalance ?? 0;

  pdf.summaryBoxes([
    { label: 'Total Annual Income', value: money(report.totalIncome) },
    { label: 'Total Annual Expense', value: money(report.totalExpense) },
    { label: 'Annual Net Balance', value: money(net) },
  ]);

  pdf.section('Monthly Breakdown');
  pdf.table(
    [
      { header: 'Month', width: width * 0.31 },
      { header: 'Income', width: width * 0.23, align: 'right' },
      { header: 'Expense', width: width * 0.23, align: 'right' },
      { header: 'Balance', width: width * 0.23, align: 'right' },
    ],
    (report.months || []).map((month) => [
      month.month,
      money(month.income),
      money(month.expense),
      money(month.balance),
    ])
  );

  pdf.save(filename);
}

export function downloadBalanceSheetPDF(
  report: BalanceSheetData['data'],
  filename: string
): void {
  const pdf = new ReportPdf('Balance Sheet', `As of ${report.asOf}`);
  const values = balanceValues(report);

  pdf.section('Assets');
  pdf.keyValueTable([
    { label: 'Cash', value: money(values.cash) },
    { label: 'Bank Balance', value: money(values.bank) },
    { label: 'Total Assets', value: money(values.totalAssets), bold: true },
  ]);

  pdf.section('Liabilities');
  pdf.keyValueTable([
    { label: 'Pending Payables', value: money(values.payables) },
    { label: 'Total Liabilities', value: money(values.totalLiabilities), bold: true },
  ]);

  pdf.section('Equity');
  pdf.keyValueTable([
    { label: 'Opening Balance', value: money(values.opening) },
    { label: 'Current Income', value: money(values.currentIncome) },
    { label: 'Current Expense', value: money(values.currentExpense) },
    { label: 'Net Profit', value: money(values.netProfit) },
    { label: 'Total Equity', value: money(values.totalEquity), bold: true },
  ]);

  pdf.section('Verification');
  pdf.keyValueTable([
    { label: 'Total Assets', value: money(values.totalAssets) },
    {
      label: 'Total Liabilities & Equity',
      value: money(values.totalLiabilitiesAndEquity),
      bold: true,
    },
  ]);

  pdf.save(filename);
}

export function printReportHtml(html: string, title: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('title', title);
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const frameWindow = iframe.contentWindow;
    const frameDoc = iframe.contentDocument || frameWindow?.document;
    if (!frameWindow || !frameDoc) {
      iframe.remove();
      reject(new Error('Unable to open print preview. Please allow pop-ups for this site.'));
      return;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const cleanup = () => iframe.remove();
    frameWindow.addEventListener('afterprint', () => {
      cleanup();
      resolve();
    });

    setTimeout(() => {
      frameWindow.focus();
      frameWindow.print();
      setTimeout(() => {
        cleanup();
        resolve();
      }, 1200);
    }, 300);
  });
}

function printShell(title: string, subtitle: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>${htmlEscape(title)}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    body { font-family: Arial, Helvetica, sans-serif; color: #212121; font-size: 12px; margin: 0; }
    h1 { font-size: 20px; margin: 0 0 4px; color: #2e7d32; }
    .sub { color: #666; margin-bottom: 16px; }
    h2 { font-size: 14px; color: #2e7d32; margin: 18px 0 8px; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid #cfcfcf; padding: 6px 8px; word-wrap: break-word; }
    th { background: #2e7d32; color: #fff; text-align: left; font-size: 11px; }
    td.num, th.num { text-align: right; }
    .boxes { display: flex; gap: 8px; margin-bottom: 12px; }
    .box { flex: 1; background: #e8f5e9; border: 1px solid #c8e6c9; padding: 8px; }
    .box span { display: block; color: #666; font-size: 10px; }
    .box strong { font-size: 12px; }
    .total td { font-weight: bold; background: #e8f5e9; }
  </style>
</head>
<body>
  <h1>${htmlEscape(title)}</h1>
  <div class="sub">${htmlEscape(subtitle)} | Generated ${htmlEscape(new Date().toLocaleString('en-IN'))}</div>
  ${body}
</body>
</html>`;
}

export function monthlyReportPrintHtml(report: MonthlyReportData['data']): string {
  const { income, expense } = monthlyCategories(report);
  const summary = report.summary;
  const extraSummary = summary as { openingBalance?: number; closingBalance?: number };
  const opening = summary.openingBalance ?? extraSummary.openingBalance ?? 0;
  const closing = summary.closingBalance ?? extraSummary.closingBalance ?? 0;
  const rows = (report.transactions || [])
    .map(
      (tx) => `<tr>
        <td>${htmlEscape(tx.date)}</td>
        <td>${htmlEscape(tx.description || '-')}</td>
        <td>${htmlEscape(tx.category || '-')}</td>
        <td class="num">${htmlEscape(dashMoney(tx.income))}</td>
        <td class="num">${htmlEscape(dashMoney(tx.expense))}</td>
        <td class="num">${htmlEscape(money(tx.balance))}</td>
      </tr>`
    )
    .join('');

  return printShell(
    'Monthly Financial Report',
    `${summary.month} ${summary.year}`,
    `
    <div class="boxes">
      <div class="box"><span>Opening Balance</span><strong>${htmlEscape(money(opening))}</strong></div>
      <div class="box"><span>Total Income</span><strong>${htmlEscape(money(summary.totalIncome))}</strong></div>
      <div class="box"><span>Total Expense</span><strong>${htmlEscape(money(summary.totalExpense))}</strong></div>
      <div class="box"><span>Closing Balance</span><strong>${htmlEscape(money(closing))}</strong></div>
    </div>
    <h2>Income by Category</h2>
    <table><thead><tr><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${
      income
        .map((item) => `<tr><td>${htmlEscape(item.category)}</td><td class="num">${htmlEscape(money(item.amount))}</td></tr>`)
        .join('') || '<tr><td colspan="2">No income recorded</td></tr>'
    }</tbody></table>
    <h2>Expense by Category</h2>
    <table><thead><tr><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${
      expense
        .map((item) => `<tr><td>${htmlEscape(item.category)}</td><td class="num">${htmlEscape(money(item.amount))}</td></tr>`)
        .join('') || '<tr><td colspan="2">No expense recorded</td></tr>'
    }</tbody></table>
    <h2>Detailed Transactions</h2>
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Income</th><th class="num">Expense</th><th class="num">Balance</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="6">No transactions in this period</td></tr>'}</tbody>
    </table>`
  );
}

export function yearlyReportPrintHtml(report: YearlyReportData['data']): string {
  const rows = (report.months || [])
    .map(
      (month) => `<tr>
        <td>${htmlEscape(month.month)}</td>
        <td class="num">${htmlEscape(money(month.income))}</td>
        <td class="num">${htmlEscape(money(month.expense))}</td>
        <td class="num">${htmlEscape(money(month.balance))}</td>
      </tr>`
    )
    .join('');

  return printShell(
    'Yearly Financial Report',
    `Year ${report.year}`,
    `
    <div class="boxes">
      <div class="box"><span>Total Annual Income</span><strong>${htmlEscape(money(report.totalIncome))}</strong></div>
      <div class="box"><span>Total Annual Expense</span><strong>${htmlEscape(money(report.totalExpense))}</strong></div>
      <div class="box"><span>Annual Net Balance</span><strong>${htmlEscape(money(report.netBalance))}</strong></div>
    </div>
    <h2>Monthly Breakdown</h2>
    <table>
      <thead><tr><th>Month</th><th class="num">Income</th><th class="num">Expense</th><th class="num">Balance</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`
  );
}

export function balanceSheetPrintHtml(report: BalanceSheetData['data']): string {
  const values = balanceValues(report);
  const row = (label: string, value: number, total = false) =>
    `<tr class="${total ? 'total' : ''}"><td>${htmlEscape(label)}</td><td class="num">${htmlEscape(money(value))}</td></tr>`;

  return printShell(
    'Balance Sheet',
    `As of ${report.asOf}`,
    `
    <h2>Assets</h2>
    <table><tbody>${row('Cash', values.cash)}${row('Bank Balance', values.bank)}${row('Total Assets', values.totalAssets, true)}</tbody></table>
    <h2>Liabilities</h2>
    <table><tbody>${row('Pending Payables', values.payables)}${row('Total Liabilities', values.totalLiabilities, true)}</tbody></table>
    <h2>Equity</h2>
    <table><tbody>${row('Opening Balance', values.opening)}${row('Current Income', values.currentIncome)}${row('Current Expense', values.currentExpense)}${row('Net Profit', values.netProfit)}${row('Total Equity', values.totalEquity, true)}</tbody></table>
    <h2>Verification</h2>
    <table><tbody>${row('Total Assets', values.totalAssets)}${row('Total Liabilities & Equity', values.totalLiabilitiesAndEquity, true)}</tbody></table>`
  );
}
