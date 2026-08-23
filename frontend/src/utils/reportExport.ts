import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface StyleSnapshot {
  el: HTMLElement;
  overflow: string;
  overflowX: string;
  overflowY: string;
  height: string;
  maxHeight: string;
}

/**
 * html2canvas clips content inside overflow:auto/hidden parents.
 * Temporarily expand the report and its ancestors so the full report is captured.
 */
async function withExpandedLayout<T>(
  element: HTMLElement,
  task: () => Promise<T>
): Promise<T> {
  const snapshots: StyleSnapshot[] = [];
  let current: HTMLElement | null = element;

  while (current) {
    snapshots.push({
      el: current,
      overflow: current.style.overflow,
      overflowX: current.style.overflowX,
      overflowY: current.style.overflowY,
      height: current.style.height,
      maxHeight: current.style.maxHeight,
    });
    current.style.overflow = 'visible';
    current.style.overflowX = 'visible';
    current.style.overflowY = 'visible';
    current.style.maxHeight = 'none';
    current = current.parentElement;
  }

  const previousHeight = element.style.height;
  element.style.height = `${element.scrollHeight}px`;

  try {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
    return await task();
  } finally {
    element.style.height = previousHeight;
    snapshots.forEach((snapshot) => {
      snapshot.el.style.overflow = snapshot.overflow;
      snapshot.el.style.overflowX = snapshot.overflowX;
      snapshot.el.style.overflowY = snapshot.overflowY;
      snapshot.el.style.height = snapshot.height;
      snapshot.el.style.maxHeight = snapshot.maxHeight;
    });
  }
}

async function captureReportCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
  return withExpandedLayout(element, () =>
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    })
  );
}

function copyStyles(sourceDoc: Document, targetDoc: Document) {
  sourceDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    targetDoc.head.appendChild(node.cloneNode(true));
  });
}

/**
 * Print only the selected report content, not the sidebar or full screen.
 */
export async function printReport(element: HTMLElement, title: string): Promise<void> {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('title', title);
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.opacity = '0';
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = iframe.contentDocument || frameWindow?.document;

  if (!frameWindow || !frameDoc) {
    iframe.remove();
    throw new Error('Unable to open print preview. Please allow pop-ups for this site.');
  }

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          @page { margin: 12mm; }
          html, body {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          body {
            padding: 8px;
          }
          .report-print-root {
            width: 100%;
          }
        </style>
      </head>
      <body></body>
    </html>
  `);
  frameDoc.close();

  copyStyles(document, frameDoc);

  const clone = element.cloneNode(true) as HTMLElement;
  clone.classList.add('report-print-root');
  clone.style.width = '100%';
  clone.style.maxWidth = '100%';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  frameDoc.body.appendChild(clone);

  await new Promise((resolve) => setTimeout(resolve, 250));

  const cleanup = () => {
    iframe.remove();
  };

  frameWindow.addEventListener('afterprint', cleanup);
  frameWindow.focus();
  frameWindow.print();
  setTimeout(cleanup, 1500);
}

/**
 * Download the selected report content as a multi-page A4 PDF.
 */
export async function downloadReportPDF(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const canvas = await captureReportCanvas(element);
  const imageData = canvas.toDataURL('image/png', 1.0);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;
  const imageHeight = (canvas.height * contentWidth) / canvas.width;

  let heightLeft = imageHeight;
  let position = margin;

  pdf.addImage(imageData, 'PNG', margin, position, contentWidth, imageHeight);
  heightLeft -= contentHeight;

  while (heightLeft > 0) {
    position = margin - (imageHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imageData, 'PNG', margin, position, contentWidth, imageHeight);
    heightLeft -= contentHeight;
  }

  pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
}

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
