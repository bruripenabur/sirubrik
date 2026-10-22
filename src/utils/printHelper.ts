/**
 * Utility for smooth, high-fidelity printing and PDF export for Universitas Pattimura
 * Uses robust popup window printing and native browser Save as PDF dialog.
 */

export const triggerPrintElement = (element: HTMLElement, documentTitle: string) => {
  try {
    const win = window.open('', '_blank');
    if (!win) {
      window.print();
      return;
    }

    const clone = element.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('button, select, input, .no-print').forEach((el) => el.remove());

    win.document.open();
    win.document.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="utf-8" />
          <title>${documentTitle}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Calibri', 'Segoe UI', Arial, sans-serif;
              color: #0f172a;
              background-color: #ffffff;
              margin: 0;
              padding: 0;
              font-size: 10pt;
              line-height: 1.45;
            }
            h1, h2, h3, h4 {
              color: #0f2d59;
              margin-top: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8pt;
              margin-bottom: 12pt;
              font-size: 9.5pt;
              page-break-inside: auto;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 6pt 8pt;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #f1f5f9 !important;
              color: #0f2d59 !important;
              font-weight: 700;
            }
            img {
              width: 2cm !important;
              height: 2cm !important;
              max-width: 2cm !important;
              max-height: 2cm !important;
              object-fit: contain;
            }
            .kop-surat {
              text-align: center;
              border-bottom: 2.5px solid #0f2d59;
              padding-bottom: 10pt;
              margin-bottom: 14pt;
            }
            .box-info {
              background-color: #f8fafc !important;
              border: 1px solid #cbd5e1;
              padding: 10pt;
              border-radius: 6pt;
              margin-bottom: 12pt;
            }
            .box-case {
              background-color: #eff6ff !important;
              border-left: 4px solid #1d4ed8;
              border: 1px solid #bfdbfe;
              padding: 10pt 12pt;
              border-radius: 4px;
              margin-bottom: 12pt;
            }
            .box-formula {
              background-color: #faf5ff !important;
              border: 1px solid #e9d5ff;
              font-family: Consolas, monospace;
              padding: 8pt 10pt;
              border-radius: 4px;
              margin-bottom: 10pt;
              font-size: 9pt;
            }
            .badge-pasal47 {
              background-color: #ecfdf5 !important;
              color: #065f46 !important;
              border: 1px solid #a7f3d0;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 4px;
            }
            .badge-pip {
              background-color: #e0f2fe !important;
              color: #0369a1 !important;
              border: 1px solid #bae6fd;
              font-weight: bold;
              padding: 2px 6px;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          ${clone.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  } catch (err) {
    console.warn('triggerPrintElement fallback', err);
    window.print();
  }
};

export const downloadPrintableHtml = (element: HTMLElement, filename: string, title: string) => {
  // Directly trigger print / PDF save dialog for pristine output
  triggerPrintElement(element, title);
};
