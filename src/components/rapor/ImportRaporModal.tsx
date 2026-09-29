import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext';
import { RaporItem, RaporDomain } from '../../types';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  X, 
  ArrowRight,
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  FileCheck
} from 'lucide-react';

interface ImportRaporModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (count: number) => void;
}

interface ContextualSummary {
  totalIndicators: number;
  priorityCount: number;
  weakestDomain: string;
  strongestDomain: string;
  averageScore: number;
  recommendations: string[];
}

export const ImportRaporModal: React.FC<ImportRaporModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { activeSchool, importRaporItems, standards } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<RaporItem[]>([]);
  const [contextualSummary, setContextualSummary] = useState<ContextualSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Helper to link SNP Standards contextually
  const getLinkedStandards = (code: string, domain: string): number[] => {
    const c = code.toUpperCase();
    if (c.includes('A.1') || c.includes('LITERASI')) return [1, 2, 3];
    if (c.includes('A.2') || c.includes('NUMERASI')) return [1, 2, 3];
    if (c.includes('A.3') || c.includes('KARAKTER')) return [1, 3];
    if (c.includes('D.1') || c.includes('PEMBELAJARAN')) return [3, 4];
    if (c.includes('D.4') || c.includes('KEAMANAN')) return [5, 6];
    if (c.includes('D.8') || c.includes('KEBINEKAAN')) return [6];
    return [1, 3];
  };

  // Helper to normalize domain
  const normalizeDomain = (raw: string): RaporDomain => {
    const str = (raw || '').toLowerCase();
    if (str.includes('literasi')) return 'Kemampuan Literasi';
    if (str.includes('numerasi')) return 'Kemampuan Numerasi';
    if (str.includes('karakter')) return 'Karakter';
    if (str.includes('aman') || str.includes('keamanan')) return 'Iklim Keamanan';
    if (str.includes('kebinekaan') || str.includes('bhinneka')) return 'Iklim Kebinekaan';
    if (str.includes('ajar') || str.includes('pembelajaran') || str.includes('kualitas')) return 'Kualitas Pembelajaran';
    return 'Kualitas Pembelajaran';
  };

  // Helper to normalize category
  const normalizeCategory = (cat: string, score: number): 'Mahir' | 'Cakap' | 'Mencapai Minimum' | 'Perlu Peningkatan' => {
    const c = (cat || '').toLowerCase();
    if (c.includes('mahir') || c.includes('tinggi')) return 'Mahir';
    if (c.includes('cakap') || c.includes('baik')) return 'Cakap';
    if (c.includes('minimum') || c.includes('sedang')) return 'Mencapai Minimum';
    if (c.includes('perlu') || c.includes('kurang') || c.includes('merah')) return 'Perlu Peningkatan';
    
    // Fallback by score (0 - 100)
    if (score >= 80) return 'Mahir';
    if (score >= 65) return 'Cakap';
    if (score >= 50) return 'Mencapai Minimum';
    return 'Perlu Peningkatan';
  };

  // Parse Excel file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMessage(null);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('Berkas Excel kosong atau tidak valid.');
        }

        // Look for sheet with 'rapor', 'pbd', 'laporan', 'ringkasan' or pick first sheet
        let targetSheetName = workbook.SheetNames[0];
        const preferredSheet = workbook.SheetNames.find(s => 
          /rapor|pbd|ringkasan|laporan|nilai/i.test(s)
        );
        if (preferredSheet) targetSheetName = preferredSheet;

        const worksheet = workbook.Sheets[targetSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          throw new Error(`Lembar kerja "${targetSheetName}" tidak memiliki baris data.`);
        }

        // Map and extract rows
        const items: RaporItem[] = [];

        rawJson.forEach((row, index) => {
          // Fuzzy key finder
          const getVal = (patterns: RegExp[]): string => {
            for (const key of Object.keys(row)) {
              for (const pat of patterns) {
                if (pat.test(key.trim().toLowerCase())) {
                  return String(row[key]).trim();
                }
              }
            }
            return '';
          };

          const rawCode = getVal([/^kode/i, /^id/i, /^indikator_id/i, /^no_indikator/i]);
          const rawDomain = getVal([/^domain/i, /^nama_indikator/i, /^indikator/i, /^aspek/i, /^nama/i]);
          const rawScore = getVal([/^skor/i, /^nilai/i, /^capaian_skor/i, /^angka/i]);
          const rawCategory = getVal([/^kategori/i, /^capaian/i, /^status/i, /^predikat/i]);
          const rawDelta = getVal([/^delta/i, /^perubahan/i, /^selisih/i, /^pertumbuhan/i]);
          const rawProblem = getVal([/^masalah/i, /^identifikasi/i, /^kendala/i]);
          const rawRootCause = getVal([/^akar/i, /^penyebab/i, /^akar_masalah/i]);
          const rawProgram = getVal([/^rekomendasi/i, /^benahi/i, /^program/i, /^kegiatan/i, /^solusi/i]);

          // Skip empty or header-like rows
          if (!rawDomain && !rawCode) return;

          const scoreNum = parseFloat(rawScore.replace(',', '.')) || 65;
          const deltaNum = parseFloat(rawDelta.replace(',', '.')) || 0;
          const codeClean = rawCode || `A.${index + 1}`;
          const domainClean = normalizeDomain(rawDomain || rawCode);
          const categoryClean = normalizeCategory(rawCategory, scoreNum);
          const isPriority = categoryClean === 'Perlu Peningkatan' || categoryClean === 'Mencapai Minimum' || scoreNum < 65;

          const defaultProblem = isPriority
            ? `Capaian ${domainClean} masih perlu penguatan kompetensi berkelanjutan.`
            : `Capaian ${domainClean} telah memenuhi standar baik dan perlu dipertahankan.`;

          const defaultRoot = isPriority
            ? `Strategi pengajaran dan pemanfaatan perangkat ajar kontekstual belum maksimal.`
            : `Budaya refleksi pendidik telah berjalan konsisten.`;

          const defaultProg = isPriority
            ? `In-House Training (IHT) guru dan penyediaan media ajar berdiferensiasi.`
            : `Pengembangan praktik baik (best practice) dan desiminasi antarguru.`;

          items.push({
            id: `rapor-${Date.now()}-${index}`,
            schoolId: activeSchool.id,
            domain: domainClean,
            code: codeClean,
            score: Number(scoreNum.toFixed(1)),
            maxScore: 100,
            category: categoryClean,
            delta: Number(deltaNum.toFixed(1)),
            isPriority: isPriority,
            identifiedProblem: rawProblem || defaultProblem,
            rootCause: rawRootCause || defaultRoot,
            linkedStandardIds: getLinkedStandards(codeClean, domainClean),
            recommendedProgram: rawProgram || defaultProg,
            status: isPriority ? 'Perlu Rencana' : 'Sudah Terprogram'
          });
        });

        if (items.length === 0) {
          throw new Error('Tidak dapat menemukan data indikator yang cocok dari berkas Excel. Silakan gunakan format template yang disediakan.');
        }

        // Deduplicate by code if duplicates exist
        const uniqueMap = new Map<string, RaporItem>();
        items.forEach(it => {
          uniqueMap.set(it.code, it);
        });
        const finalItems = Array.from(uniqueMap.values());

        // Contextual analysis calculation
        const total = finalItems.length;
        const priorities = finalItems.filter(i => i.isPriority).length;
        const avg = finalItems.reduce((acc, curr) => acc + curr.score, 0) / total;

        const sorted = [...finalItems].sort((a, b) => a.score - b.score);
        const weakest = sorted[0];
        const strongest = sorted[sorted.length - 1];

        const recs: string[] = [];
        if (priorities > 0) {
          recs.push(`Prioritas intervensi utama tertuju pada ${weakest.domain} (${weakest.code} - Skor: ${weakest.score}) dengan fokus: ${weakest.rootCause}`);
        }
        recs.push(`Program ${weakest.recommendedProgram} direkomendasikan langsung masuk lembar kerja PBD & dialokasikan pada BOS/ARKAS.`);
        recs.push(`Selaraskan ${finalItems.length} indikator ini dengan pemenuhan bukti fisik Standar 1 (SKL), Standar 3 (Proses), dan Standar 4 (PTK) pada SIPANDU SEKOLAH.`);

        setParsedItems(finalItems);
        setContextualSummary({
          totalIndicators: total,
          priorityCount: priorities,
          weakestDomain: `${weakest.domain} (${weakest.score})`,
          strongestDomain: `${strongest.domain} (${strongest.score})`,
          averageScore: Number(avg.toFixed(1)),
          recommendations: recs
        });

      } catch (err: any) {
        setErrorMessage(err.message || 'Terjadi kesalahan saat membaca berkas Excel.');
        setParsedItems([]);
        setContextualSummary(null);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Download official sample Excel template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Kode Indikator': 'A.1',
        'Nama Indikator': 'Kemampuan Literasi',
        'Skor Sekolah': 74.5,
        'Kategori Capaian': 'Cakap',
        'Perubahan (Delta)': 12.4,
        'Identifikasi Masalah': 'Kompetensi membaca teks informasi masih perlu pengayaan',
        'Akar Masalah': 'Minat baca dan ragam buku fiksi-nonfiksi belum optimal di kelas',
        'Rekomendasi Program Benahi': 'Revitalisasi Pojok Baca Kelas & Pembiasaan 15 Menit Membaca'
      },
      {
        'Kode Indikator': 'A.2',
        'Nama Indikator': 'Kemampuan Numerasi',
        'Skor Sekolah': 54.2,
        'Kategori Capaian': 'Perlu Peningkatan',
        'Perubahan (Delta)': -3.1,
        'Identifikasi Masalah': 'Sebagian besar murid belum mencapai batas minimum kompetensi numerasi',
        'Akar Masalah': 'Metode pengajaran matematika guru masih abstrak tanpa media konkret',
        'Rekomendasi Program Benahi': 'Workshop Pembelajaran Matematika Kontekstual Berdiferensiasi & Pemanfaatan PMM'
      },
      {
        'Kode Indikator': 'A.3',
        'Nama Indikator': 'Karakter',
        'Skor Sekolah': 68.3,
        'Kategori Capaian': 'Cakap',
        'Perubahan (Delta)': 6.2,
        'Identifikasi Masalah': 'Kemandirian dan nalar kritis siswa perlu diasah lebih lanjut',
        'Akar Masalah': 'Kegiatan ekstrakurikuler kepemimpinan belum terstruktur',
        'Rekomendasi Program Benahi': 'Optimalisasi Projek Penguatan Profil Pelajar Pancasila (P5)'
      },
      {
        'Kode Indikator': 'D.1',
        'Nama Indikator': 'Kualitas Pembelajaran',
        'Skor Sekolah': 63.8,
        'Kategori Capaian': 'Mencapai Minimum',
        'Perubahan (Delta)': 4.5,
        'Identifikasi Masalah': 'Manajemen kelas dan asesmen formatif belum diterapkan merata',
        'Akar Masalah': 'Guru jarang melakukan asesmen awal diagnostik sebelum mengajar',
        'Rekomendasi Program Benahi': 'In-House Training (IHT) Asesmen Formatif & Manajemen Kelas Aktif'
      },
      {
        'Kode Indikator': 'D.4',
        'Nama Indikator': 'Iklim Keamanan Sekolah',
        'Skor Sekolah': 79.1,
        'Kategori Capaian': 'Cakap',
        'Perubahan (Delta)': 8.0,
        'Identifikasi Masalah': 'Potensi perundungan verbal sesama teman sebaya',
        'Akar Masalah': 'Sosialisasi SOP pencegahan kekerasan masih sporadis',
        'Rekomendasi Program Benahi': 'Penguatan Tim Pencegahan & Penanganan Kekerasan (TPPK) Sekolah'
      },
      {
        'Kode Indikator': 'D.8',
        'Nama Indikator': 'Iklim Kebinekaan',
        'Skor Sekolah': 82.0,
        'Kategori Capaian': 'Mahir',
        'Perubahan (Delta)': 5.5,
        'Identifikasi Masalah': 'Toleransi sosial dan budaya sudah berjalan sangat baik',
        'Akar Masalah': 'Keteladanan guru dan lingkungan sekolah inklusif',
        'Rekomendasi Program Benahi': 'Pentas Seni Kebinekaan & Festival Kuliner Nusantara'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rapor_PBD_Kemendikbud');
    XLSX.writeFile(workbook, `Template_Rapor_Pendidikan_PBD_${activeSchool.name.replace(/\s+/g, '_')}.xlsx`);
  };

  // Save imported items to AppContext
  const handleApplyImport = () => {
    if (parsedItems.length === 0) return;
    importRaporItems(parsedItems);
    onSuccess(parsedItems.length);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 uppercase tracking-wider">
                Integrasi Otomatis Rapor PBD
              </span>
              <h2 className="text-lg font-black text-white mt-0.5">
                Input Berkas Excel Rapor Pendidikan & Analisis Kontekstual
              </h2>
              <p className="text-xs text-indigo-200">
                {activeSchool.name} • Ekstraksi & Penyelarasan Otomatis ke 8 SNP
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-slate-800 dark:text-slate-200">

          {/* Action Box: Upload & Template */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-5 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700/60 bg-indigo-50/40 dark:bg-indigo-950/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/40 transition cursor-pointer flex flex-col items-center justify-center text-center group"
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange}
                className="hidden" 
              />
              <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-md group-hover:scale-105 transition mb-2">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {fileName ? fileName : 'Pilih / Tarik Berkas Excel Rapor'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Mendukung .xlsx, .xls, .csv dari unduhan resmi Rapor Pendidikan
              </p>
            </div>

            {/* Template Download */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Format Standar Kemendikbud
                </span>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  Belum punya format Excel?
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  Unduh template Excel dengan struktur kolom resmi indikator, akar masalah, dan rekomendasi benahi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="mt-3 w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Unduh Format Excel Rapor PBD (.xlsx)</span>
              </button>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading State */}
          {isProcessing && (
            <div className="p-6 text-center text-xs text-indigo-600 dark:text-indigo-400 animate-pulse font-medium">
              Sedang mengekstrak dan menganalisis kontekstual data Rapor Pendidikan...
            </div>
          )}

          {/* Contextual Analysis Result Card */}
          {contextualSummary && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-teal-50 dark:from-indigo-950/40 dark:to-teal-950/30 border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                      Hasil Analisis Kontekstual Otomatis (Perencanaan Berbasis Data)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-200">
                    {contextualSummary.totalIndicators} Indikator Terbaca
                  </span>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">Rata-rata Skor</p>
                    <p className="text-sm font-black text-slate-800 dark:text-white">{contextualSummary.averageScore}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">Prioritas Benahi</p>
                    <p className="text-sm font-black text-rose-600">{contextualSummary.priorityCount} Indikator</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">Titik Terlemah</p>
                    <p className="text-xs font-bold text-amber-600 truncate">{contextualSummary.weakestDomain}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400">Capaian Terbaik</p>
                    <p className="text-xs font-bold text-emerald-600 truncate">{contextualSummary.strongestDomain}</p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-3 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                  <p className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Rekomendasi Aksi Nyata RKAS / ARKAS:</span>
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    {contextualSummary.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Preview Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Pratinjau Indikator yang Siap Disinkronkan:</span>
                  <span className="text-[10px] font-normal text-slate-400">Otomatis terhubung ke 8 SNP & modul RTL</span>
                </h4>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden max-h-56 overflow-y-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-[10px] uppercase font-bold text-slate-500 sticky top-0">
                      <tr>
                        <th className="py-2 px-3">Kode & Domain</th>
                        <th className="py-2 px-2 text-center">Skor</th>
                        <th className="py-2 px-2 text-center">Status</th>
                        <th className="py-2 px-3">Akar Masalah & Rencana Benahi</th>
                        <th className="py-2 px-2 text-center">Terkait 8 SNP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                      {parsedItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 mr-1.5">{item.code}</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.domain}</span>
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold">
                            {item.score}
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              item.category === 'Mahir' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                              item.category === 'Cakap' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                              item.category === 'Mencapai Minimum' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[10px] text-slate-600 dark:text-slate-400 max-w-xs truncate">
                            <p className="font-medium text-slate-700 dark:text-slate-300 truncate">🔴 {item.rootCause}</p>
                            <p className="text-teal-600 dark:text-teal-400 truncate">💡 {item.recommendedProgram}</p>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                              Std: {item.linkedStandardIds.join(', ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400 hidden sm:block">
            {parsedItems.length > 0 ? `${parsedItems.length} indikator siap disinkronkan.` : 'Pilih berkas Excel untuk melihat analisis.'}
          </p>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={parsedItems.length === 0}
              onClick={handleApplyImport}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>Terapkan & Simpan ke Rapor PBD ({parsedItems.length})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
