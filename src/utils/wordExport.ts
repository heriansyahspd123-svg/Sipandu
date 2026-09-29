/**
 * SIPANDU SEKOLAH - Word (.doc) Document Generator
 * Generates an official Microsoft Word compatible document with Kop Surat,
 * tables, identity info, and formal signature blocks.
 */

export interface WordReportData {
  reportTitle: string;
  schoolName: string;
  npsn: string;
  level: string;
  status: string;
  principalName: string;
  principalNip?: string;
  supervisorName: string;
  kabupaten: string;
  tableHeaders: string[];
  tableRows: (string | number)[][];
  summaryNotes?: string;
  metrics?: { label: string; value: string | number }[];
}

export function generateAndDownloadWordReport(data: WordReportData) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const metricsHtml = data.metrics && data.metrics.length > 0 
    ? `
      <table style="width: 100%; margin-bottom: 14pt; border: 1px solid #94a3b8; background-color: #f8fafc;">
        <tr>
          ${data.metrics.map(m => `
            <td style="text-align: center; padding: 8pt; border: 1px solid #cbd5e1;">
              <div style="font-size: 9pt; color: #64748b; text-transform: uppercase; font-weight: bold;">${m.label}</div>
              <div style="font-size: 14pt; font-weight: bold; color: #0d9488; margin-top: 2pt;">${m.value}</div>
            </td>
          `).join('')}
        </tr>
      </table>
    `
    : '';

  const tableHeaderHtml = `
    <thead>
      <tr style="background-color: #0f172a; color: #ffffff;">
        ${data.tableHeaders.map(h => `
          <th style="padding: 7pt; border: 1px solid #334155; font-size: 9.5pt; font-weight: bold; text-align: left; background-color: #0f172a; color: #ffffff;">
            ${h}
          </th>
        `).join('')}
      </tr>
    </thead>
  `;

  const tableBodyHtml = `
    <tbody>
      ${data.tableRows.map((row, idx) => `
        <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
          ${row.map(cell => `
            <td style="padding: 6pt; border: 1px solid #cbd5e1; font-size: 9pt; vertical-align: top;">
              ${cell}
            </td>
          `).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${data.reportTitle} - ${data.schoolName}</title>
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: A4 portrait;
          margin: 20mm 20mm 20mm 20mm;
          mso-page-orientation: portrait;
        }
        body {
          font-family: 'Calibri', 'Times New Roman', Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.35;
          color: #1e293b;
        }
        .kop-table {
          width: 100%;
          border-bottom: 3px double #0f172a;
          padding-bottom: 8pt;
          margin-bottom: 16pt;
          border-collapse: collapse;
        }
        .kop-table td {
          border: none;
          text-align: center;
          padding: 2pt;
        }
        .kop-kabupaten {
          font-size: 11pt;
          font-weight: bold;
          text-transform: uppercase;
          color: #334155;
          letter-spacing: 1px;
        }
        .kop-dinas {
          font-size: 14pt;
          font-weight: 900;
          text-transform: uppercase;
          color: #0f172a;
          margin: 2pt 0;
        }
        .kop-sipandu {
          font-size: 10pt;
          font-weight: bold;
          text-transform: uppercase;
          color: #0d9488;
        }
        .kop-alamat {
          font-size: 8.5pt;
          color: #64748b;
          font-style: italic;
        }
        .doc-title {
          font-size: 13pt;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
          text-decoration: underline;
          margin: 12pt 0 4pt 0;
          color: #0f172a;
        }
        .doc-subtitle {
          font-size: 9.5pt;
          text-align: center;
          color: #64748b;
          margin-bottom: 14pt;
        }
        .identity-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 14pt;
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
        }
        .identity-table td {
          padding: 5pt 8pt;
          border: 1px solid #e2e8f0;
          font-size: 9.5pt;
        }
        .identity-label {
          color: #64748b;
          font-size: 8.5pt;
          text-transform: uppercase;
          font-weight: bold;
          display: block;
        }
        .identity-val {
          color: #0f172a;
          font-weight: bold;
        }
        .section-title {
          font-size: 10.5pt;
          font-weight: bold;
          text-transform: uppercase;
          color: #0f172a;
          margin: 14pt 0 6pt 0;
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6pt;
          margin-bottom: 14pt;
        }
        .summary-box {
          border: 1px solid #cbd5e1;
          background-color: #f8fafc;
          padding: 8pt 10pt;
          margin: 10pt 0;
          border-radius: 4pt;
        }
        .signature-table {
          width: 100%;
          margin-top: 24pt;
          border-collapse: collapse;
        }
        .signature-table td {
          border: none;
          text-align: center;
          width: 50%;
          font-size: 10pt;
          vertical-align: top;
        }
        .signature-name {
          font-weight: bold;
          text-decoration: underline;
          color: #0f172a;
          font-size: 10.5pt;
        }
        .footer-note {
          margin-top: 24pt;
          border-top: 1px solid #e2e8f0;
          padding-top: 6pt;
          font-size: 8pt;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      
      <!-- Kop Surat -->
      <table class="kop-table">
        <tr>
          <td>
            <div class="kop-kabupaten">Pemerintah Kabupaten Sidenreng Rappang</div>
            <div class="kop-dinas">Dinas Pendidikan dan Kebudayaan</div>
            <div class="kop-sipandu">Sistem Pendampingan Mutu Sekolah (SIPANDU SEKOLAH)</div>
            <div class="kop-alamat">Sekretariat Pengawas Sekolah Pembina • Kompleks SKPD Sidrap, Jl. Harapan Baru No. 1</div>
          </td>
        </tr>
      </table>

      <!-- Judul Dokumen -->
      <div class="doc-title">${data.reportTitle}</div>
      <div class="doc-subtitle">Tahun Ajaran 2026/2027 • Dokumen Resmi SIPANDU SEKOLAH</div>

      <!-- Tabel Identitas Sekolah -->
      <table class="identity-table">
        <tr>
          <td style="width: 50%;">
            <span class="identity-label">Nama Satuan Pendidikan</span>
            <span class="identity-val">${data.schoolName}</span>
          </td>
          <td style="width: 50%;">
            <span class="identity-label">NPSN / Jenjang</span>
            <span class="identity-val">${data.npsn} / ${data.level} (${data.status})</span>
          </td>
        </tr>
        <tr>
          <td>
            <span class="identity-label">Kepala Satuan Pendidikan</span>
            <span class="identity-val">${data.principalName}</span>
          </td>
          <td>
            <span class="identity-label">Pengawas Sekolah Pembina</span>
            <span class="identity-val">${data.supervisorName}</span>
          </td>
        </tr>
      </table>

      ${metricsHtml}

      <!-- Bagian Tabel Data -->
      <div class="section-title">Hasil Penilaian & Matriks Pelaporan</div>
      <table class="data-table">
        ${tableHeaderHtml}
        ${tableBodyHtml}
      </table>

      ${data.summaryNotes ? `
        <div class="summary-box">
          <strong style="font-size: 9.5pt; color: #0f172a;">Catatan & Rekomendasi Pengawas Pembina:</strong>
          <p style="font-size: 9pt; color: #475569; font-style: italic; margin-top: 4pt;">
            ${data.summaryNotes}
          </p>
        </div>
      ` : ''}

      <!-- Lembar Tanda Tangan Resmi -->
      <table class="signature-table">
        <tr>
          <td>
            <p style="margin: 0; color: #64748b;">Mengetahui,</p>
            <p style="margin: 2pt 0 0 0; font-weight: bold;">Kepala Satuan Pendidikan,</p>
            <br><br><br>
            <p class="signature-name">${data.principalName}</p>
            <p style="margin: 2pt 0 0 0; font-size: 9pt; color: #64748b;">NIP. ${data.principalNip || '-'}</p>
          </td>
          <td>
            <p style="margin: 0; color: #64748b;">Sidenreng Rappang, ${currentDate}</p>
            <p style="margin: 2pt 0 0 0; font-weight: bold;">Pengawas Sekolah Pembina,</p>
            <br><br><br>
            <p class="signature-name">${data.supervisorName}</p>
            <p style="margin: 2pt 0 0 0; font-size: 9pt; color: #64748b;">Pengawas Pembina Disdikbud Sidrap</p>
          </td>
        </tr>
      </table>

      <!-- Watermark & Pengembang -->
      <div class="footer-note">
        <table style="width: 100%; border: none;">
          <tr>
            <td style="border: none; padding: 0; font-size: 8pt; color: #94a3b8;">
              Dicetak melalui SIPANDU SEKOLAH Kab. Sidenreng Rappang pada ${currentDate}
            </td>
            <td style="border: none; padding: 0; font-size: 8pt; color: #64748b; text-align: right; font-weight: bold;">
              Pengembang Sistem: Heriansyah, S.Si., S.Pd., M.Pd
            </td>
          </tr>
        </table>
      </div>

    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const sanitizedSchool = data.schoolName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Laporan_SIPANDU_${sanitizedSchool}_${new Date().toISOString().split('T')[0]}.doc`;

  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
