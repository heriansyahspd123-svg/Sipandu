import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { generateAndDownloadWordReport } from '../../utils/wordExport';
import { 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  FileText, 
  Info,
  HelpCircle,
  Users,
  CheckSquare,
  BookOpen,
  Calendar,
  MessageSquare,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Printer,
  Sparkle,
  Sliders,
  Compass,
  Check,
  Network
} from 'lucide-react';

interface AccreditationSimProps {
  onNavigateTab: (tab: string, meta?: any) => void;
}

type AccreditationSubTab = 
  | 'diagnosa' 
  | 'komponen_ban_pdm' 
  | 'syarat_mutlak' 
  | 'triangulasi_wawancara' 
  | 'timeline_visitasi';

export const AccreditationSim: React.FC<AccreditationSimProps> = ({ onNavigateTab }) => {
  const { 
    activeSchool, 
    getAccreditationReadiness, 
    standards, 
    indicators,
    evidences,
    setActiveStandardId
  } = useApp();

  const readiness = getAccreditationReadiness(activeSchool.id);

  const [activeSubTab, setActiveSubTab] = useState<AccreditationSubTab>('diagnosa');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ISSUES'>('ALL');
  const [expandedInterviewRole, setExpandedInterviewRole] = useState<'ks' | 'guru' | 'siswa' | 'komite'>('ks');

  // Interactive Checklist for Syarat Mutlak (Compliance Checklist)
  const [complianceChecks, setComplianceChecks] = useState<Record<string, boolean>>({
    'c1': true,  // Izin Operasional / SK Pendirian
    'c2': true,  // NPSN aktif di Pusdatin / Dapodik
    'c3': true,  // Memiliki siswa di setiap tingkat kelas
    'c4': true,  // Kurikulum Operasional (KOSP) disahkan Disdikbud
    'c5': false, // Sertifikat Pendidik > 70% atau Linier S1
    'c6': true,  // Laporan BOS / PBD terintegrasi ARKAS
    'c7': false, // Kelayakan Sanitasi & Akses Ramah Difabel
  });

  const toggleCompliance = (id: string) => {
    setComplianceChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const readyPct = Math.round((readiness.readyIndicatorsCount / readiness.totalIndicators) * 100);
  const improvePct = Math.round((readiness.needImprovementCount / readiness.totalIndicators) * 100);
  const notReadyPct = Math.max(0, 100 - readyPct - improvePct);

  // 4 Komponen Utama BAN-PDM (Kepmendikbudristek 246/O/2024)
  const banPdmComponents = [
    {
      id: 'k1',
      title: 'Kinerja Pendidik dalam Proses Pembelajaran',
      weight: 35,
      score: 88,
      status: 'A (Sangat Baik)',
      focus: 'Penerapan pembelajaran mendalam, diferensiasi siswa, asesmen formatif, pemanfaatan teknologi, dan pengelolaan kelas inklusif.',
      snpMapping: 'Standar Proses (SI-3), Standar PTK (SI-4), Standar Penilaian (SI-8)',
      readyItems: 10,
      totalItems: 12
    },
    {
      id: 'k2',
      title: 'Kepemimpinan Kepala Satuan Pendidikan',
      weight: 25,
      score: 84,
      status: 'B (Baik)',
      focus: 'Visi misi terukur, Perencanaan Berbasis Data (PBD/Rapor Pendidikan), budaya refleksi guru, efisiensi anggaran BOS/ARKAS.',
      snpMapping: 'Standar Pengelolaan (SI-6), Standar Pembiayaan (SI-7)',
      readyItems: 7,
      totalItems: 9
    },
    {
      id: 'k3',
      title: 'Iklim Lingkungan Belajar (Kenyamanan & Inklusivitas)',
      weight: 20,
      score: 79,
      status: 'B (Perlu Penguatan)',
      focus: 'Pencegahan 3 Dosa Pendidikan (Perundungan, Kekerasan Seksual, Intoleransi - TPPK), sanitasi higienis, keterlibatan komite.',
      snpMapping: 'Standar Sarana Prasarana (SI-5), Standar Pengelolaan (SI-6)',
      readyItems: 5,
      totalItems: 8
    },
    {
      id: 'k4',
      title: 'Hasil Belajar & Mutu Lulusan',
      weight: 20,
      score: 86,
      status: 'A (Baik)',
      focus: 'Capaian literasi-numerasi ANBK/Rapor Pendidikan, karakter Profil Pelajar Pancasila, prestasi akademik & non-akademik.',
      snpMapping: 'Standar Kompetensi Lulusan (SI-1), Standar Isi (SI-2)',
      readyItems: 6,
      totalItems: 7
    }
  ];

  // Bank Pertanyaan Wawancara Triangulasi Asesor
  const interviewQuestions = {
    ks: [
      {
        q: 'Bagaimana Bapak/Ibu menyusun program kerja tahunan berbasis rekomendasi Rapor Pendidikan?',
        tip: 'Tunjukkan integrasi Rapor Pendidikan Sidrap ke lembar PBD (Perencanaan Berbasis Data), RKT, dan RKAS pada ARKAS.',
        docRef: 'Dokumen RKT, RKAS/ARKAS, dan Notula Rapat Evaluasi Mutu.'
      },
      {
        q: 'Bagaimana mekanisme evaluasi dan supervisi klinis yang dilakukan terhadap guru dalam menerapkan Kurikulum Merdeka?',
        tip: 'Jelaskan jadwal rutin supervisi, lembar observasi kelas, dan tindak lanjut coaching/refleksi mingguan.',
        docRef: 'Buku Catatan Supervisi Kepala Sekolah & Rekomendasi Tindak Lanjut.'
      },
      {
        q: 'Langkah apa yang dilakukan sekolah dalam membentuk dan mengoptimalkan TPPK (Tim Pencegahan & Penanganan Kekerasan)?',
        tip: 'Tunjukkan SK resmi TPPK, kanal pelaporan aduan siswa, dan sosialisasi anti-perundungan kepada wali murid.',
        docRef: 'SK TPPK, Banner Alur Pelaporan, Buku Log Kejadian/Aduan.'
      }
    ],
    guru: [
      {
        q: 'Bagaimana Anda merancang dan menerapkan pembelajaran berdiferensiasi untuk siswa yang memiliki tingkat kemampuan berbeda?',
        tip: 'Jelaskan hasil asesmen diagnostik di awal tema/bab, serta pembagian tugas atau materi berjenjang (konten/proses/produk).',
        docRef: 'Modul Ajar/RPP dengan lampiran diferensiasi dan lembar refleksi siswa.'
      },
      {
        q: 'Bagaimana Anda menggunakan asesmen formatif dalam pembelajaran sehari-hari?',
        tip: 'Jelaskan bahwa asesmen formatif bukan untuk memberi nilai rapor semata, melainkan untuk memandu perbaikan teknik mengajar seketika.',
        docRef: 'Rubrik penilaian formatif, lembar umpan balik murid, catatan portofolio.'
      },
      {
        q: 'Aktivitas apa saja dalam Komunitas Belajar (Kombel) sekolah yang nyata meningkatkan kemampuan mengajar Anda?',
        tip: 'Ceritakan praktik baik berbagi modul, bedah CP/TP, atau pemecahan masalah literasi anak kelas rendah.',
        docRef: 'Daftar hadir Kombel internal, notula diskusi, dan sertifikat PMM.'
      }
    ],
    siswa: [
      {
        q: 'Apakah guru-guru di kelas sering memberikan kesempatan berdiskusi, bertanya, dan menggunakan media pembelajaran seru?',
        tip: 'Asesor ingin memastikan pembelajaran tidak monoton satu arah (teacher-centered), melainkan aktif berpusat pada murid.',
        docRef: 'Dokumentasi karya proyek P5 dan rekaman kegiatan kelas.'
      },
      {
        q: 'Apakah kamu merasa aman dan nyaman di sekolah? Apa yang dilakukan sekolah jika ada teman yang mengejek atau membully?',
        tip: 'Asesor menguji apakah iklim sekolah benar-benar aman dari perundungan dan murid tahu ke mana harus mengadu.',
        docRef: 'Kotak saran/aduan, poster ramah anak, dan peran guru BK/Wali Kelas.'
      }
    ],
    komite: [
      {
        q: 'Sejauh mana orang tua dan Komite Sekolah dilibatkan dalam perencanaan program mutu sekolah, bukan hanya urusan dana?',
        tip: 'Komite harus menyampaikan keterlibatannya dalam penyusunan program tahunan, parenting, dan pendampingan kegiatan ekstrakurikuler.',
        docRef: 'Undangan rapat komite, daftar hadir, dan notula pengesahan KOSP bersama.'
      },
      {
        q: 'Apakah sekolah transparan mengenai perkembangan belajar anak dan penggunaan fasilitas sarana prasarana?',
        tip: 'Jawab dengan bukti laporan berkala kepsek dalam rapat pleno komite.',
        docRef: 'Buku laporan pertanggungjawaban komite & komunikasi grup paguyuban kelas.'
      }
    ]
  };

  // Timeline Pra-Visitasi (Countdown Checklist)
  const timelineSteps = [
    {
      period: 'H-90 Hari (Fase Diagnosa & Gap Analysis)',
      status: 'selesai',
      tasks: [
        'Lakukan asesmen mandiri (Self-Assessment) pada modul 8 SNP di SIPANDU SEKOLAH.',
        'Identifikasi butir-butir dengan status 🔴 Perlu Perbaikan dan 🟡 Sebagian.',
        'Bentuk Panitia Persiapan Akreditasi Sekolah (Tim Sukses) terbagi dalam 4 komponen kinerja.'
      ]
    },
    {
      period: 'H-60 Hari (Fase Bank Bukti & RTL)',
      status: 'berjalan',
      tasks: [
        'Lengkapi seluruh bukti fisik otentik di Bank Bukti Digital (KOSP, Modul Ajar, Notula, RKAS).',
        'Lakukan eksekusi Rencana Tindak Lanjut (RTL) yang mengalami keterlambatan.',
        'Minta Pengawas Pembina Disdikbud Sidrap melakukan verifikasi berkas tahap 1 di SIPANDU.'
      ]
    },
    {
      period: 'H-30 Hari (Fase Simulasi Wawancara & Sispena)',
      status: 'mendatang',
      tasks: [
        'Unggah dokumen DIA (Data Isian Akreditasi) ke portal resmi Sispena BAN-PDM.',
        'Lakukan gladi bersih simulasi wawancara terhadap Guru, Komite, dan Perwakilan Siswa.',
        'Periksa kelayakan sarana sanitasi, UKS, laboratorium/perpustakaan, dan area ramah anak.'
      ]
    },
    {
      period: 'H-7 Hari s/d Hari-H (Fase Visitasi Lapangan)',
      status: 'mendatang',
      tasks: [
        'Cetak Lembar Portofolio & Bundel Akreditasi Terpadu dari SIPANDU SEKOLAH.',
        'Siapkan ruang temu asesor dengan display dokumen bukti tersusun rapi per komponen.',
        'Pastikan seluruh guru dan komite siap hadir tepat waktu dengan pemahaman materi yang selaras.'
      ]
    }
  ];

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleExportWord = () => {
    generateAndDownloadWordReport({
      reportTitle: 'LAPORAN SIMULASI KESIAPAN AKREDITASI BAN-PDM',
      schoolName: activeSchool.name,
      npsn: activeSchool.npsn,
      level: activeSchool.level,
      status: activeSchool.status,
      principalName: activeSchool.principalName,
      principalNip: activeSchool.principalNip,
      supervisorName: activeSchool.supervisorName,
      kabupaten: 'Sidenreng Rappang',
      tableHeaders: ['Komponen Evaluasi Akreditasi', 'Capaian Mutu', 'Status Kesiapan Visitasi'],
      tableRows: [
        ['Skor Prediksi Kesiapan Internal BAN-PDM', `${readiness.score}%`, readiness.grade],
        ['Indikator Memenuhi Standar (Siap)', `${readiness.readyIndicatorsCount} dari ${readiness.totalIndicators} Indikator`, 'Siap Dinilai Asesor'],
        ['Indikator Butuh Perbaikan Dokumen', `${readiness.needImprovementCount} Indikator`, 'Sedang Dibenahi'],
        ['Indikator Belum Siap', `${readiness.notReadyCount} Indikator`, 'Prioritas Pendampingan'],
        ['Kecukupan Bank Bukti Digital Terverifikasi', `${readiness.verifiedEvidenceCount} Dokumen`, 'Tervalidasi Pengawas']
      ],
      metrics: [
        { label: 'Estimasi Skor', value: `${readiness.score}%` },
        { label: 'Predikat Akreditasi', value: readiness.grade },
        { label: 'Bukti Terverifikasi', value: `${readiness.verifiedEvidenceCount} Dokumen` }
      ],
      summaryNotes: `Simulasi kesiapan akreditasi satuan pendidikan ${activeSchool.name} menunjukkan estimasi skor ${readiness.score}% dengan grade ${readiness.grade}. Pengawas Pembina Heriansyah, S.Si., S.Pd., M.Pd merekomendasikan penuntasan catatan perbaikan sebelum visitasi resmi BAN-PDM.`
    });

    setToastMsg(`Laporan Akreditasi format Word (.doc) berhasil diunduh untuk ${activeSchool.name}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">

      {/* Toast Alert */}
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
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pusat Kendali Kesiapan Akreditasi BAN-PDM</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Kepmendikbudristek No. 246/O/2024
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Simulasi & Pendampingan Akreditasi — {activeSchool.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
              Panduan terintegrasi pengawas pembina untuk memastikan sekolah siap 100% menghadapi visitasi asesor melalui penguatan 4 komponen kinerja, kelayakan syarat mutlak, dan kesiapan triangulasi bukti.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={triggerCelebration}
              className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center hover:bg-white/15 transition cursor-pointer active:scale-95 shadow-lg"
              title="Klik untuk merayakan progres mutu!"
            >
              <span className="text-[10px] text-emerald-300 font-extrabold block uppercase tracking-wider">Estimasi Skor BAN-PDM</span>
              <div className="flex items-baseline justify-center gap-1 mt-0.5">
                <span className="text-3xl font-black text-white">{readiness.score}</span>
                <span className="text-xs text-emerald-300">/ 100</span>
              </div>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 mt-1 inline-block shadow-xs">
                Grade: {readiness.grade}
              </span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs within Akreditasi */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onNavigateTab('benang_merah')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
          >
            <Network className="w-3.5 h-3.5 text-slate-950" />
            <span>Benang Merah IA2024 & 8 SNP (14 Butir)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('diagnosa')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'diagnosa'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>1. Diagnosa & Kesiapan 8 SNP</span>
          </button>

          <button
            onClick={() => setActiveSubTab('komponen_ban_pdm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'komponen_ban_pdm'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. 4 Komponen BAN-PDM</span>
          </button>

          <button
            onClick={() => setActiveSubTab('syarat_mutlak')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'syarat_mutlak'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Syarat Mutlak (Compliance)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('triangulasi_wawancara')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'triangulasi_wawancara'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>4. Simulasi Wawancara Asesor</span>
          </button>

          <button
            onClick={() => setActiveSubTab('timeline_visitasi')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'timeline_visitasi'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>5. Timeline Pra-Visitasi</span>
          </button>
        </div>

      </div>

      {/* Action Toolbar: Simpan Word, PDF & Cetak */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Laporan Kesiapan Akreditasi — {activeSchool.name}
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">• Format Resmi Pengawas Pembina</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportWord}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Unduh laporan akreditasi format Microsoft Word (.doc)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Simpan Word (.doc)</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Simpan sebagai file PDF resmi"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Simpan PDF</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
            title="Cetak langsung ke kertas via printer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Dokumen</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIAGNOSA & GAP ANALYSIS (ORIGINAL CORE) */}
      {activeSubTab === 'diagnosa' && (
        <div className="space-y-6">
          {/* 3 Metric Progress Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sudah Siap */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Indikator Sudah Siap</span>
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600">
                  {readyPct}%
                </span>
                <span className="text-xs text-slate-400">
                  ({readiness.readyIndicatorsCount} dari {readiness.totalIndicators} Indikator)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Kondisi baik dan didukung bukti otentik terverifikasi lengkap.
              </p>
            </div>

            {/* Perlu Perbaikan */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Perlu Perbaikan</span>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-600">
                  {improvePct}%
                </span>
                <span className="text-xs text-slate-400">
                  ({readiness.needImprovementCount} Indikator)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Sudah ada sebagian, memerlukan penyempurnaan dokumen.
              </p>
            </div>

            {/* Belum Siap */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Belum Siap / Belum Dinilai</span>
                <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600">
                  {notReadyPct}%
                </span>
                <span className="text-xs text-slate-400">
                  ({readiness.notReadyCount} Indikator)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Perlu intervensi awal pengawas dan penyusunan RTL segera.
              </p>
            </div>
          </div>

          {/* Gap Mutu & Prioritas Perbaikan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Daftar Celah Mutu (Gap Analysis) Yang Wajib Dituntaskan</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Fokus pendampingan pengawas: indikator ini menjadi sasaran empuk pertanyaan asesor saat visitasi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('rtl')}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 hover:bg-teal-100 border border-teal-200 transition"
                >
                  Buka Program RTL
                </button>
              </div>
            </div>

            {readiness.highPriorityIssues.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Semua standar dalam kondisi siap visitasi!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {readiness.highPriorityIssues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                          {issue.standardName}
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {issue.title}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        <strong>Kondisi Temuan:</strong> {issue.reason}
                      </p>
                      <p className="text-teal-700 dark:text-teal-400 font-semibold mt-0.5">
                        <strong>Langkah Pendampingan:</strong> {issue.actionNeeded}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const ind = indicators.find(i => i.id === issue.indicatorId);
                        if (ind) {
                          setActiveStandardId(ind.standardId);
                        }
                        onNavigateTab('snp', { id: issue.indicatorId });
                      }}
                      className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shrink-0 shadow-xs flex items-center gap-1 transition cursor-pointer"
                    >
                      <span>Lihat & Perbaiki</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 4 KOMPONEN KINERJA BAN-PDM (KEPMEN 246/2024) */}
      {activeSubTab === 'komponen_ban_pdm' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-950 dark:text-teal-200 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Paradigma Baru Akreditasi BAN-PDM (Performance-Based):</p>
              <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                BAN-PDM tidak lagi sekadar memeriksa tumpukan berkas administratif 8 SNP, melainkan mengukur <strong>kinerja riil</strong> proses belajar-mengajar, kepemimpinan kepala sekolah, dan iklim lingkungan belajar yang aman dan berkarakter.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banPdmComponents.map((comp) => (
              <div 
                key={comp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      Bobot: {comp.weight}%
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Nilai: {comp.score} • {comp.status}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900 dark:text-white mt-2">
                    {comp.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {comp.focus}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[11px]">
                    <span className="text-slate-400 block font-semibold">Terkoneksi ke 8 SNP:</span>
                    <span className="text-teal-700 dark:text-teal-300 font-bold">{comp.snpMapping}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Kesiapan Dokumen: <strong>{comp.readyItems} / {comp.totalItems}</strong>
                  </span>
                  <button
                    onClick={() => onNavigateTab('bank_bukti')}
                    className="text-xs font-bold text-teal-600 hover:underline flex items-center gap-1"
                  >
                    <span>Cek Bukti Terkait</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Pakar Akreditasi */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-2">
            <h4 className="font-extrabold text-amber-900 dark:text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Strategi Pengawas Pembina Mengamankan Nilai A (Unggul):</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300 pl-1 leading-relaxed">
              <li>Pastikan guru tidak menggunakan RPP/Modul Ajar hasil <em>copy-paste</em>, karena asesor akan menanyakan secara mendalam alasan guru memilih asesmen tertentu.</li>
              <li>Pastikan ada bukti <strong>refleksi mingguan</strong> di mana guru bersama kepala sekolah mengevaluasi hasil belajar murid yang belum tuntas.</li>
              <li>Perkuat dokumen <strong>Perencanaan Berbasis Data (PBD)</strong> dari Rapor Pendidikan, karena ini adalah poin tertinggi pada Komponen Kepemimpinan Kepala Sekolah.</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 3: SYARAT MUTLAK (COMPLIANCE CHECKLIST) */}
      {activeSubTab === 'syarat_mutlak' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Indikator Pemenuhan Mutlak (Prasyarat Visitasi)</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Jika salah satu syarat mutlak ini tidak terpenuhi, sekolah tidak dapat divisitasi atau otomatis mendapat predikat <em>Tidak Terakreditasi</em>.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                {Object.values(complianceChecks).filter(Boolean).length} dari {Object.keys(complianceChecks).length} Syarat Terpenuhi
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'c1', title: 'Izin Operasional & SK Pendirian Sekolah Resmi', desc: 'SK Bupati / Kadisdikbud Sidrap masih berlaku dan terdaftar di Kemendikbudristek.' },
                { id: 'c2', title: 'NPSN Aktif & Sinkronisasi Dapodik Rutin', desc: 'Data rombel, peserta didik, dan PTK semester berjalan telah sinkron 100% tanpa anomali data.' },
                { id: 'c3', title: 'Memiliki Peserta Didik Lengkap di Tiap Jenjang', desc: 'Tersedia peserta didik pada kelas awal sampai kelas akhir (tidak kosong di jenjang tertentu).' },
                { id: 'c4', title: 'Kurikulum Operasional (KOSP / Kurikulum Merdeka) Disahkan', desc: 'Buku 1 KOSP telah ditandatangani oleh Kepala Sekolah, Komite, dan disahkan Pengawas / Kadisdikbud.' },
                { id: 'c5', title: 'Kualifikasi Pendidik S1 / D-IV Linier', desc: 'Minimal 80% guru berijazah S1 yang sesuai bidang mata pelajaran / guru kelas SD.' },
                { id: 'c6', title: 'Laporan Penggunaan Dana BOS Terintegrasi ARKAS', desc: 'Tersedia Buku Kas Umum (BKU), kuitansi sah, dan laporan realisasi PBD yang valid.' },
                { id: 'c7', title: 'Kelayakan Sanitasi & Lingkungan Belajar Sehat', desc: 'Ketersediaan jamban bersih rasio siswa memadai, air mengalir, dan bebas asap rokok/kekerasan.' }
              ].map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleCompliance(item.id)}
                  className={`p-3.5 rounded-2xl border transition flex items-start gap-3 cursor-pointer select-none ${
                    complianceChecks[item.id]
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/60'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                  }`}
                >
                  <div className={`mt-0.5 p-1 rounded-lg ${
                    complianceChecks[item.id] ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400 dark:bg-slate-700'
                  }`}>
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${complianceChecks[item.id] ? 'text-emerald-950 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    complianceChecks[item.id] ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                  }`}>
                    {complianceChecks[item.id] ? 'Lolos' : 'Belum Lengkap'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SIMULASI WAWANCARA ASESOR (TRIANGULASI DATA) */}
      {activeSubTab === 'triangulasi_wawancara' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 flex items-start gap-3">
            <Users className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Metode Triangulasi Asesor BAN-PDM:</p>
              <p className="mt-1 leading-relaxed text-slate-700 dark:text-slate-300">
                Asesor tidak hanya mencocokkan dokumen, tapi <strong>menguji kebenaran isi dokumen melalui wawancara terpisah</strong> kepada Kepala Sekolah, Guru, Siswa, dan Komite. Jawaban dari keempat pihak ini harus sinkron dan sesuai dengan bukti fisik di lapangan.
              </p>
            </div>
          </div>

          {/* Role Filter Buttons */}
          <div className="flex items-center gap-2">
            {[
              { id: 'ks', label: 'Kepala Sekolah (Leadership)', count: interviewQuestions.ks.length },
              { id: 'guru', label: 'Guru / Pendidik (Proses Belajar)', count: interviewQuestions.guru.length },
              { id: 'siswa', label: 'Peserta Didik (Iklim & Pelayanan)', count: interviewQuestions.siswa.length },
              { id: 'komite', label: 'Komite & Wali Murid (Kemitraan)', count: interviewQuestions.komite.length }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setExpandedInterviewRole(r.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  expandedInterviewRole === r.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{r.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20 text-white font-mono">
                  {r.count}
                </span>
              </button>
            ))}
          </div>

          {/* Questions List */}
          <div className="space-y-3">
            {interviewQuestions[expandedInterviewRole].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      "{item.q}"
                    </h4>
                  </div>
                </div>

                <div className="ml-8 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700 text-xs space-y-1.5">
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="text-emerald-700 dark:text-emerald-400">Kunci Jawaban & Strategi:</strong> {item.tip}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-slate-200/40">
                    <strong className="text-slate-600 dark:text-slate-300">Dokumen Pembuktian Pendukung:</strong> {item.docRef}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE PRA-VISITASI (COUNTDOWN CHECKLIST) */}
      {activeSubTab === 'timeline_visitasi' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                <span>Peta Alur Kerja Kesiapan Pra-Visitasi (Roadmap Menuju Akreditasi A)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Langkah sistematis sekolah bersama pengawas pembina dari 90 hari sebelum visitasi hingga hari pelaksanaan.
              </p>
            </div>

            <div className="space-y-4">
              {timelineSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-extrabold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {step.period}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      step.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                      step.status === 'berjalan' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {step.status === 'selesai' ? 'Selesai' : step.status === 'berjalan' ? 'Fase Aktif Sekarang' : 'Mendatang'}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 ml-9 list-disc">
                    {step.tasks.map((task, tIdx) => (
                      <li key={tIdx} className="leading-relaxed">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Official Disclaimer Note */}
      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <p className="font-bold">Catatan Resmi Penjaminan Mutu & Akreditasi Satuan Pendidikan:</p>
          <p className="text-slate-600 dark:text-slate-300 mt-0.5">
            SIPANDU SEKOLAH merupakan instrumen pendampingan internal Dinas Pendidikan dan Kebudayaan Kabupaten Sidenreng Rappang untuk memastikan mutu sekolah terus meningkat dan siap menjalani visitasi resmi Badan Akreditasi Nasional Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Pendidikan Menengah (BAN-PDM).
          </p>
        </div>
      </div>

    </div>
  );
};

