import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadWordReport } from '../../utils/wordExport';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Layers, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const { 
    schools, 
    activeSchool, 
    indicators, 
    standards, 
    actionPlans, 
    visits, 
    raporItems,
    currentUser,
    getAccreditationReadiness,
    getSchoolMetrics
  } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<string>('rekap_8_snp');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(activeSchool.id);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const targetSchool = schools.find(s => s.id === selectedSchoolId) || activeSchool;
  const metrics = getSchoolMetrics(targetSchool.id);
  const readiness = getAccreditationReadiness(targetSchool.id);

  const reportTypes = [
    { id: 'rekap_8_snp', title: 'Laporan Asesmen 8 Standar Nasional Pendidikan (SNP)', icon: 'Layers' },
    { id: 'rapor_pbd', title: 'Laporan Analisis Rapor Pendidikan & PBD', icon: 'BarChart3' },
    { id: 'rtl_program', title: 'Laporan Rencana Tindak Lanjut (RTL) & Mutu', icon: 'CheckSquare' },
    { id: 'kesiapan_akreditasi', title: 'Laporan Hasil Simulasi Kesiapan Akreditasi', icon: 'Award' },
    { id: 'catatan_pembinaan', title: 'Laporan Riwayat Kunjungan & Supervisi Klinis', icon: 'Calendar' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    let tableHeaders: string[] = [];
    let tableRows: (string | number)[][] = [];
    let metricsData: { label: string; value: string | number }[] = [];
    let notes = '';

    const currentTitle = reportTypes.find(r => r.id === selectedReportType)?.title || 'Laporan Mutu Sekolah';

    if (selectedReportType === 'rekap_8_snp') {
      tableHeaders = ['No', 'Standar Nasional Pendidikan', 'Total Indikator', 'Capaian Baik', 'Persentase'];
      tableRows = standards.map(std => {
        const countAll = indicators.filter(i => i.standardId === std.id).length || 1;
        const countBaik = indicators.filter(i => i.standardId === std.id && i.status === 'baik').length;
        const pct = Math.round((countBaik / countAll) * 100);
        return [std.id, std.name, countAll, countBaik, `${pct}%`];
      });
      metricsData = [
        { label: 'Capaian Pemenuhan 8 SNP', value: `${metrics.baikPercent}%` },
        { label: 'Indikator Selesai Asesmen', value: `${metrics.assessedPercent}%` },
        { label: 'Total Indikator SNP', value: indicators.length }
      ];
      notes = `Berdasarkan pemantauan Pengawas Pembina Heriansyah, S.Si., S.Pd., M.Pd, satuan pendidikan ${targetSchool.name} telah mencapai rata-rata mutu ${metrics.baikPercent}%. Prioritas penguatan difokuskan pada standar yang belum berstatus Baik.`;
    } else if (selectedReportType === 'rtl_program') {
      tableHeaders = ['No', 'Program Tindak Lanjut', 'Aktivitas Utama', 'Penanggung Jawab (PIC)', 'Batas Waktu', 'Status'];
      const schoolPlans = actionPlans.filter(p => p.schoolId === targetSchool.id);
      tableRows = schoolPlans.map((p, idx) => [
        idx + 1,
        p.title,
        p.activity,
        p.picName,
        p.targetDate,
        p.status.toUpperCase()
      ]);
      metricsData = [
        { label: 'Total Program RTL', value: schoolPlans.length },
        { label: 'Persentase Selesai', value: `${metrics.rtlProgressPercent}%` },
        { label: 'RTL Melewati Target', value: metrics.overdueRtlCount }
      ];
      notes = `Rencana Tindak Lanjut (RTL) ini disusun secara partisipatif dan wajib dievaluasi secara berkala pada setiap siklus supervisi pembinaan.`;
    } else if (selectedReportType === 'kesiapan_akreditasi') {
      tableHeaders = ['Komponen Akreditasi', 'Hasil Evaluasi', 'Status Pemenuhan'];
      tableRows = [
        ['Skor Prediksi Kesiapan', `${readiness.score}%`, readiness.grade],
        ['Indikator Berstatus Siap', `${readiness.readyIndicatorsCount} dari ${readiness.totalIndicators}`, 'Memenuhi Standar Mutu'],
        ['Indikator Perlu Perbaikan', `${readiness.needImprovementCount} Indikator`, 'Perlu Penyesuaian Dokumen'],
        ['Indikator Belum Siap', `${readiness.notReadyCount} Indikator`, 'Prioritas Segera'],
        ['Bukti Digital Terverifikasi', `${readiness.verifiedEvidenceCount} Dokumen`, 'Tervalidasi Pengawas']
      ];
      metricsData = [
        { label: 'Skor Kesiapan Internal', value: `${readiness.score}%` },
        { label: 'Predikat Akreditasi', value: readiness.grade },
        { label: 'Kecukupan Bukti', value: `${readiness.verifiedEvidenceCount} Dokumen` }
      ];
      notes = `Simulasi kesiapan akreditasi menunjukkan bahwa satuan pendidikan berpotensi memperoleh predikat ${readiness.grade}. Pastikan dokumen bukti fisik dan digital sinkron sebelum visitasi asesmen resmi.`;
    } else if (selectedReportType === 'catatan_pembinaan') {
      tableHeaders = ['No', 'Tanggal Kunjungan', 'Fokus Supervisi', 'Temuan & Catatan', 'Rekomendasi Pembinaan'];
      const schoolVisits = visits.filter(v => v.schoolId === targetSchool.id);
      tableRows = schoolVisits.map((v, idx) => [
        idx + 1,
        v.date,
        v.purpose,
        v.findings.join('; ') || v.notes || '-',
        v.recommendations.join('; ') || '-'
      ]);
      metricsData = [
        { label: 'Total Kunjungan', value: schoolVisits.length },
        { label: 'Pengawas Pembina', value: targetSchool.supervisorName },
        { label: 'Wilayah Binaan', value: `Kec. ${targetSchool.kecamatan}` }
      ];
      notes = `Catatan kunjungan pembinaan resmi ini menjadi dasar verifikasi berkala peningkatan kinerja kepala sekolah dan guru.`;
    } else {
      tableHeaders = ['No', 'Domain Rapor Pendidikan', 'Skor', 'Kategori Capaian', 'Masalah Utama', 'Rekomendasi PBD'];
      const schoolRapor = raporItems.filter(r => r.schoolId === targetSchool.id);
      tableRows = schoolRapor.map((r, idx) => [
        idx + 1,
        r.domain,
        r.score,
        r.category.toUpperCase(),
        r.identifiedProblem,
        r.recommendedProgram
      ]);
      metricsData = [
        { label: 'Total Indikator Rapor', value: schoolRapor.length },
        { label: 'Kategori Mahir/Cakap', value: schoolRapor.filter(r => r.category === 'Mahir' || r.category === 'Cakap').length },
        { label: 'Perlu Peningkatan', value: schoolRapor.filter(r => r.category === 'Perlu Peningkatan').length }
      ];
      notes = `Hasil analisis Rapor Pendidikan menjadi rujukan perencanaan berbasis data (PBD) dalam penyusunan RKT dan RKAS sekolah.`;
    }

    generateAndDownloadWordReport({
      reportTitle: currentTitle,
      schoolName: targetSchool.name,
      npsn: targetSchool.npsn,
      level: targetSchool.level,
      status: targetSchool.status,
      principalName: targetSchool.principalName,
      principalNip: targetSchool.principalNip,
      supervisorName: targetSchool.supervisorName,
      kabupaten: 'Sidenreng Rappang',
      tableHeaders,
      tableRows,
      metrics: metricsData,
      summaryNotes: notes
    });

    setToastMsg(`Laporan format Word (.doc) berhasil diunduh untuk ${targetSchool.name}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportCSV = () => {
    // Generate simple CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SIPANDU SEKOLAH KABUPATEN SIDRAP\n";
    csvContent += `Nama Sekolah,${targetSchool.name}\n`;
    csvContent += `NPSN,${targetSchool.npsn}\n`;
    csvContent += `Kepala Sekolah,${targetSchool.principalName}\n`;
    csvContent += `Pengawas Pembina,${targetSchool.supervisorName}\n`;
    csvContent += `Tanggal Cetak,${new Date().toLocaleDateString('id-ID')}\n\n`;

    csvContent += "Kode Indikator,Judul,Status,PIC,Target Waktu\n";
    indicators.forEach(i => {
      csvContent += `"${i.code}","${i.title}","${i.status}","${i.assignedPicName || '-'}","${i.targetDeadline || '-'}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_SIPANDU_${targetSchool.npsn}_${selectedReportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Toast Alert Message */}
      {toastMsg && (
        <div className="print:hidden p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}
      
      {/* Top Banner (hidden on print) */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Pelaporan Otomatis Resmi
            </span>
            <span className="text-xs text-slate-400">
              Word • PDF • Cetak • Excel
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Generator Laporan Mutu Sekolah
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Menghasilkan dokumen resmi ber-kop surat dinas dan bertanda tangan Pengawas Pembina Heriansyah, S.Si., S.Pd., M.Pd untuk Dinas Pendidikan Sidrap, Asesor, dan Komite.
          </p>
        </div>

        {/* Action Buttons: Word, PDF, Print, Excel */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          {/* Tombol Simpan Word */}
          <button
            type="button"
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Unduh laporan lengkap dalam format Microsoft Word (.doc) yang dapat diedit"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Simpan Word (.doc)</span>
          </button>

          {/* Tombol Simpan PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Cetak atau simpan langsung sebagai file PDF resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan PDF</span>
          </button>

          {/* Tombol Cetak Dokumen */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Kirim ke printer untuk cetak dokumen fisik"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>

          {/* Tombol Ekspor CSV/Excel */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
            title="Ekspor tabel mentah ke spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Excel/CSV</span>
          </button>
        </div>
      </div>

      {/* Format Information Guide */}
      <div className="print:hidden bg-gradient-to-r from-teal-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-850 p-4 rounded-2xl border border-teal-200/60 dark:border-slate-800 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-extrabold text-teal-900 dark:text-teal-200">Panduan Format Penyimpanan:</span>
          <ul className="mt-1 list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
            <li><strong>Simpan Word (.doc):</strong> Menghasilkan file dokumen Microsoft Word ber-kop surat resmi yang dapat diedit langsung di komputer atau Google Docs.</li>
            <li><strong>Simpan PDF / Cetak Dokumen:</strong> Pada dialog pratinjau cetak browser, Anda dapat memilih tujuan <em>"Save as PDF / Simpan sebagai PDF"</em> untuk mengunduh PDF, atau pilih printer untuk mencetak langsung ke kertas.</li>
          </ul>
        </div>
      </div>

      {/* Filter and Chooser (hidden on print) */}
      <div className="print:hidden bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Pilih Jenis Laporan:
          </label>
          <select
            value={selectedReportType}
            onChange={e => setSelectedReportType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold text-slate-800 dark:text-white"
          >
            {reportTypes.map(r => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Satuan Pendidikan:
          </label>
          <select
            value={selectedSchoolId}
            onChange={e => setSelectedSchoolId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-semibold text-slate-800 dark:text-white"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Official Report Document Paper (Printable Layout) */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        
        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
            PEMERINTAH KABUPATEN SIDENRENG RAPPANG
          </p>
          <h2 className="text-base sm:text-lg font-black uppercase text-slate-900 tracking-wide mt-0.5">
            DINAS PENDIDIKAN DAN KEBUDAYAAN
          </h2>
          <p className="text-xs font-extrabold text-teal-800 mt-0.5 uppercase">
            SISTEM PENDAMPINGAN MUTU SEKOLAH (SIPANDU SEKOLAH)
          </p>
          <p className="text-[10px] text-slate-500 mt-1">
            Sekretariat Pengawas Sekolah • Kompleks Perkantoran Gabungan Dinas SKPD Sidrap, Jl. Harapan Baru No. 1
          </p>
        </div>

        {/* Document Title */}
        <div className="my-6 text-center">
          <h3 className="text-sm sm:text-base font-black uppercase underline decoration-2 underline-offset-4 text-slate-900">
            {reportTypes.find(r => r.id === selectedReportType)?.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Tahun Ajaran 2026/2027 • Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </p>
        </div>

        {/* Identity Table */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs mb-6">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Nama Satuan Pendidikan</span>
              <strong className="text-slate-900">{targetSchool.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">NPSN / Jenjang</span>
              <strong className="text-slate-900">{targetSchool.npsn} / {targetSchool.level} ({targetSchool.status})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Kepala Sekolah</span>
              <strong className="text-slate-900">{targetSchool.principalName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Pengawas Sekolah Pembina</span>
              <strong className="text-slate-900">{targetSchool.supervisorName}</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Content based on report type */}
        {selectedReportType === 'rekap_8_snp' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              A. Rekapitulasi Capaian Pemenuhan 8 Standar Nasional Pendidikan
            </h4>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300 w-12 text-center">No</th>
                  <th className="p-2 border-r border-slate-300">Standar Nasional Pendidikan</th>
                  <th className="p-2 border-r border-slate-300 text-center">Jumlah Indikator</th>
                  <th className="p-2 border-r border-slate-300 text-center">Status Baik</th>
                  <th className="p-2 text-center">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {standards.map(std => {
                  const countAll = indicators.filter(i => i.standardId === std.id).length || 1;
                  const countBaik = indicators.filter(i => i.standardId === std.id && i.status === 'baik').length;
                  const pct = Math.round((countBaik / countAll) * 100);

                  return (
                    <tr key={std.id} className="hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-center font-bold">{std.id}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">{std.name}</td>
                      <td className="p-2 border-r border-slate-200 text-center">{countAll}</td>
                      <td className="p-2 border-r border-slate-200 text-center text-emerald-700 font-bold">{countBaik}</td>
                      <td className="p-2 text-center font-bold">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold block mb-1">Kesimpulan Asesmen Pengawas:</span>
              <p className="text-slate-600 leading-relaxed italic">
                “Satuan pendidikan menunjukkan pemenuhan 8 Standar Nasional sebesar {metrics.baikPercent}%. Diperlukan percepatan penyempurnaan bukti pada Standar Sarana Prasarana dan Standar Penilaian sesuai rekomendasi tindak lanjut.”
              </p>
            </div>
          </div>
        )}

        {selectedReportType === 'rtl_program' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              A. Matriks Rencana Tindak Lanjut (RTL) Hasil Pendampingan
            </h4>
            
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">Program / RTL</th>
                  <th className="p-2 border-r border-slate-300">PIC</th>
                  <th className="p-2 border-r border-slate-300">Target</th>
                  <th className="p-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {actionPlans.filter(p => p.schoolId === targetSchool.id).map(plan => (
                  <tr key={plan.id}>
                    <td className="p-2 border-r border-slate-200 font-medium">
                      <p className="font-bold">{plan.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{plan.activity}</p>
                    </td>
                    <td className="p-2 border-r border-slate-200">{plan.picName}</td>
                    <td className="p-2 border-r border-slate-200">{plan.targetDate}</td>
                    <td className="p-2 text-center font-bold capitalize">{plan.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReportType === 'kesiapan_akreditasi' && (
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
              A. Hasil Simulasi Kesiapan Akreditasi Satuan Pendidikan
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Skor Kesiapan Internal</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{readiness.score}%</p>
                <p className="text-[11px] font-semibold text-emerald-700 mt-1">Predikat: {readiness.grade}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500">Kecukupan Bukti Digital</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{readiness.verifiedEvidenceCount} Dokumen</p>
                <p className="text-[11px] text-slate-500 mt-1">Telah divalidasi keabsahannya oleh pengawas</p>
              </div>
            </div>
          </div>
        )}

        {/* Tanda Tangan Pengesahan (Signature Box) */}
        <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold mt-0.5">Kepala Satuan Pendidikan,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[Tertanda Tangani Digital]</span>
            </div>
            <p className="font-bold underline text-slate-900">{targetSchool.principalName}</p>
            <p className="text-[10px] text-slate-500">NIP. {targetSchool.principalNip || '-'}</p>
          </div>

          <div>
            <p className="text-slate-500">Sidenreng Rappang, {new Date().toLocaleDateString('id-ID')}</p>
            <p className="font-bold mt-0.5">Pengawas Sekolah Pembina,</p>
            <div className="h-16 flex items-center justify-center">
              <span className="text-[10px] text-slate-300 italic">[Tervalidasi SIPANDU]</span>
            </div>
            <p className="font-bold underline text-slate-900">{targetSchool.supervisorName}</p>
            <p className="text-[10px] text-slate-500">Pengawas Pembina Disdikbud Sidrap</p>
          </div>
        </div>

        {/* Footer Credit & Verification Token */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>Dokumen Resmi SIPANDU SEKOLAH • Disdikbud Kabupaten Sidenreng Rappang</span>
          <span className="font-semibold text-slate-600">Pengembang Sistem: Heriansyah, S.Si., S.Pd., M.Pd</span>
        </div>

      </div>

    </div>
  );
};
