import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { School, SchoolLevel } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  ArrowRight, 
  TrendingUp, 
  Layers, 
  Calendar, 
  ShieldCheck, 
  Users, 
  Sparkles,
  Award,
  Edit3,
  Plus,
  Settings,
  BookOpen,
  CheckSquare,
  X,
  HelpCircle,
  User
} from 'lucide-react';

interface SupervisorDashboardProps {
  onNavigateTab: (tab: string, meta?: any) => void;
  onOpenUpload: () => void;
  onOpenSchoolProfile?: () => void;
  onOpenUserProfile?: () => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  onNavigateTab,
  onOpenUpload,
  onOpenSchoolProfile,
  onOpenUserProfile
}) => {
  const { 
    currentUser, 
    schools, 
    activeSchool, 
    setActiveSchoolId,
    getSupervisorSummary, 
    actionPlans, 
    evidences, 
    addSchool
  } = useApp();

  const summary = getSupervisorSummary();
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);

  // New School Form State
  const [newSchoolForm, setNewSchoolForm] = useState({
    name: '',
    npsn: '',
    level: 'SD' as SchoolLevel,
    status: 'Negeri' as 'Negeri' | 'Swasta',
    kecamatan: 'Maritengngae',
    address: 'Kabupaten Sidenreng Rappang',
    principalName: '',
    principalNip: '',
    teacherCount: 12,
    studentCount: 220,
    rombelCount: 6
  });

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolForm.name.trim() || !newSchoolForm.npsn.trim()) return;

    addSchool({
      name: newSchoolForm.name.trim(),
      npsn: newSchoolForm.npsn.trim(),
      level: newSchoolForm.level,
      status: newSchoolForm.status,
      address: newSchoolForm.address,
      desaKelurahan: newSchoolForm.kecamatan,
      kecamatan: newSchoolForm.kecamatan,
      kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
      provinsi: 'Sulawesi Selatan',
      principalName: newSchoolForm.principalName || 'Kepala Satuan Pendidikan',
      principalNip: newSchoolForm.principalNip,
      supervisorName: currentUser.name,
      teacherCount: Number(newSchoolForm.teacherCount) || 10,
      staffCount: 3,
      studentCount: Number(newSchoolForm.studentCount) || 150,
      rombelCount: Number(newSchoolForm.rombelCount) || 6,
      academicYear: '2026/2027',
      lastAccreditation: 'B',
      lastAccreditationYear: 2023,
      facilities: {
        classrooms: Number(newSchoolForm.rombelCount) || 6,
        library: true,
        uks: true,
        sanitasiBaik: true,
        internetAccess: true,
        lapanganOlahraga: true
      },
      qualityTeam: [
        { name: 'Koordinator TPMPS', role: 'Ketua Tim Mutu' }
      ]
    });

    setShowAddSchoolModal(false);
  };

  const urgentRTLs = actionPlans.filter(p => p.status === 'terlambat' || p.status === 'perlu_perbaikan');
  const pendingEvidences = evidences.filter(e => e.status === 'menunggu_verifikasi');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (PRD Section 60) */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/10 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Pusat Komando Pengawas Pembina (Admin Utama)</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Pengembang: Heriansyah, S.Si., S.Pd., M.Pd</span>
              </span>
              <span className="text-xs text-slate-400">
                Disdikbud Kabupaten Sidenreng Rappang
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Selamat datang, {currentUser.name}
              </h1>
              <button
                type="button"
                onClick={onOpenUserProfile}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white border border-teal-400/40 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                title="Klik di sini untuk mengubah nama pengawas atau data profil Anda"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-300" />
                <span>Ubah Nama Anda</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-2xl leading-relaxed">
              “Mari lihat kondisi sekolah binaan dan tentukan prioritas pendampingan hari ini.”
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('kunjungan')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>Agenda Kunjungan</span>
            </button>
            <button
              onClick={() => onNavigateTab('bank_bukti')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-teal-300" />
              <span>Verifikasi Bukti ({pendingEvidences.length})</span>
            </button>
            <button
              onClick={() => setShowAddSchoolModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Sekolah</span>
            </button>
          </div>
        </div>
      </div>

      {/* PUSAT KONTROL & PANDUAN EDIT SEBAGAI ADMIN (Answer to User's Question) */}
      <div className="bg-gradient-to-br from-amber-500/10 via-teal-500/5 to-slate-900/5 dark:bg-slate-900 rounded-3xl p-6 border-2 border-teal-500/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-teal-500/20">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-600 text-white font-black text-xs">
                ADMIN
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Pusat Kontrol & Tempat Anda Bisa Mengedit Data
              </h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Sebagai <strong>Pengawas Sekolah (Admin Utama)</strong>, Anda memiliki hak penuh untuk mengedit data pada 6 modul berikut:
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-300 shrink-0">
            Hak Akses: Pengawas Sekolah
          </span>
        </div>

        {/* Direct Edit Portals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          
          {/* Edit 0: Nama & Profil Pengawas (Answer to User's Need) */}
          <div className="p-4 rounded-2xl bg-teal-500/10 dark:bg-slate-800 border-2 border-teal-500/50 hover:border-teal-600 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-teal-200 dark:bg-teal-900 text-teal-950 dark:text-teal-200">
                  Akun Anda: Pengawas Sekolah
                </span>
                <User className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Ubah Nama & Profil Pengawas
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Ubah nama lengkap, gelar, NIP, no. WhatsApp, dan email: <strong className="text-teal-700 dark:text-teal-300">{currentUser.name}</strong>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-teal-500/20">
              <button
                type="button"
                onClick={onOpenUserProfile}
                className="text-xs font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ubah Nama Pengawas Sekarang</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          
          {/* Edit 1: Data Profil Sekolah */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  Modul 1: Satuan Pendidikan
                </span>
                <Edit3 className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Edit Profil Sekolah Binaan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ubah nama kepala sekolah, NIP, jumlah guru, siswa, rombel, akreditasi, dan sarpras <strong>{activeSchool.name}</strong>.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <button
                onClick={onOpenSchoolProfile}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Edit Sekolah Aktif</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('sekolah')}
                className="text-[11px] text-slate-400 hover:text-slate-600"
              >
                Pilih Sekolah Lain
              </button>
            </div>
          </div>

          {/* Edit 2: Asesmen 8 SNP */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Modul 2: 8 Standar Mutu
                </span>
                <Layers className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Edit Asesmen & Status 8 SNP
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Ubah status indikator (🟢 Baik, 🟡 Perlu Diperbaiki, 🔴 Belum Memenuhi), input catatan riil, rekomendasi, dan PIC.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => onNavigateTab('snp')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Buka & Edit 8 SNP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Edit 3: Verifikasi Bukti */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                  Modul 3: Bank Bukti Digital
                </span>
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Verifikasi & Edit Bukti Fisik
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Beri status 🟢 Valid, 🟡 Perlu Perbaikan, atau 🔴 Tidak Sesuai pada berkas yang diunggah guru beserta catatan pembinaan.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => onNavigateTab('bank_bukti')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Verifikasi Bukti ({pendingEvidences.length} Menunggu)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Edit 4: Program & RTL */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                  Modul 4: Tindak Lanjut
                </span>
                <CheckSquare className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Edit & Tambah Program RTL
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tambah program mutu baru, edit kegiatan tindak lanjut, atur penugasan PIC guru/kepsek, dan update tenggat waktu.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => onNavigateTab('rtl')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Kelola & Edit RTL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Edit 5: Kunjungan Pengawas */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                  Modul 5: Supervisi Klinis
                </span>
                <Calendar className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Edit Agenda & Catatan Kunjungan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Buat jadwal baru, masukkan temuan supervisi, rumuskan rekomendasi, dan tulis kesepakatan target bersama sekolah.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => onNavigateTab('kunjungan')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Catatan Kunjungan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Edit 6: Master Regulasi */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 transition shadow-xs flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                  Modul 6: Regulasi Pendidikan
                </span>
                <BookOpen className="w-4 h-4 text-rose-600" />
              </div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                Edit Master Regulasi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Tambahkan Permendikbudristek baru, perbarui ringkasan aturan kurikulum, dan hubungkan dengan 8 standar SNP.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={() => onNavigateTab('regulasi')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>Kelola Master Regulasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 6 Core Cards (PRD Section 8: 20 Sekolah Binaan, 12 SD | 8 SMP, Rata-rata 74%, RTL terlambat 14, Bukti menunggu 38, Sekolah perlu perhatian 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Card 1: Total Sekolah Binaan */}
        <div 
          onClick={() => onNavigateTab('sekolah')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Sekolah Binaan</span>
            <Building2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {summary.totalSchools}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Wilayah Kab. Sidrap
          </p>
        </div>

        {/* Card 2: SD vs SMP */}
        <div 
          onClick={() => onNavigateTab('sekolah')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Jenjang Satdik</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {summary.sdCount} SD <span className="text-slate-300">|</span> {summary.smpCount} SMP
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            100% Terpetakan
          </p>
        </div>

        {/* Card 3: Rata-rata Progres Mutu */}
        <div 
          onClick={() => onNavigateTab('monitoring')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rerata Progres</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {summary.avgProgress}%
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Capaian 8 SNP Satdik
          </p>
        </div>

        {/* Card 4: Tindak Lanjut Terlambat */}
        <div 
          onClick={() => onNavigateTab('rtl')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">RTL Terlambat</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">
            {summary.overdueRTLs}
          </p>
          <p className="text-[11px] text-rose-500 font-medium mt-0.5">
            Perlu Intervensi
          </p>
        </div>

        {/* Card 5: Bukti Menunggu Verifikasi */}
        <div 
          onClick={() => onNavigateTab('bank_bukti')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {summary.pendingVerifications}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Dokumen Digital
          </p>
        </div>

        {/* Card 6: Sekolah Perlu Perhatian */}
        <div 
          onClick={() => onNavigateTab('sekolah')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Perlu Atensi</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">
            {summary.attentionNeededSchools}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Satuan Prioritas
          </p>
        </div>

      </div>

      {/* Prioritas Tindakan Hari Ini (PRD Section 43 & 60) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom 1 & 2: Tindakan Yang Perlu Segera Diselesaikan */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Prioritas Tindakan Pengawas Hari Ini</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pekerjaan mendesak agar sekolah tidak terhambat dalam persiapan akreditasi.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('monitoring')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Lihat Seluruhnya →
            </button>
          </div>

          <div className="space-y-3">
            {/* Urgent Item 1: Pending Evidence Verification */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Verifikasi Dokumen Bukti Baru ({pendingEvidences.length} berkas)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    UPT SDN 1 Pangkajene Sidrap & UPT SMPN 1 Maritengngae telah mengunggah revisi modul ajar numerasi dan KIR sarpras.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('bank_bukti')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-xs transition"
              >
                Verifikasi Sekarang
              </button>
            </div>

            {/* Urgent Item 2: Overdue RTL */}
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-rose-700 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Tindak Lanjut Mendekati Batas Waktu
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Program perbaikan rubrik asesmen formatif (Target: 10 Okt 2026) memerlukan pemantauan berkala.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('rtl')}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shrink-0 shadow-xs transition"
              >
                Pantau RTL
              </button>
            </div>

            {/* Urgent Item 3: Upcoming Visit */}
            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/40 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Jadwal Kunjungan Supervisi Berikutnya
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Kunjungan pendampingan numerasi & pengecekan sanitasi di UPT SDN 1 Pangkajene disepakati pada 22 Oktober 2026.
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('kunjungan')}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shrink-0 shadow-xs transition"
              >
                Buka Agenda
              </button>
            </div>
          </div>
        </div>

        {/* Kolom 3: Radar Kesiapan Satuan Pendidikan Binaan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-600" />
              <span>Peta Cepat Satdik Binaan</span>
            </h3>
            <span className="text-[10px] text-slate-400">Aktif</span>
          </div>

          <div className="space-y-2.5">
            {schools.slice(0, 5).map(school => (
              <div
                key={school.id}
                onClick={() => {
                  setActiveSchoolId(school.id);
                  onNavigateTab('snp');
                }}
                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${school.level === 'SD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {school.level}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-white truncate max-w-[170px]">
                      {school.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Kec. {school.kecamatan} • Akreditasi {school.lastAccreditation}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('sekolah')}
            className="w-full py-2 text-center text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline border-t border-slate-100 dark:border-slate-800 pt-3 block"
          >
            Lihat Semua 20 Sekolah Binaan →
          </button>
        </div>

      </div>

      {/* Modal Tambah Sekolah Binaan Baru */}
      {showAddSchoolModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 text-teal-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Tambah Sekolah Binaan Baru</h3>
                  <p className="text-[11px] text-teal-200">Wilayah Binaan Pengawas Disdikbud Sidrap</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddSchoolModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Satuan Pendidikan: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSchoolForm.name}
                  onChange={e => setNewSchoolForm({ ...newSchoolForm, name: e.target.value })}
                  placeholder="Contoh: UPT SDN 2 Pangkajene Sidrap"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NPSN: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newSchoolForm.npsn}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, npsn: e.target.value })}
                    placeholder="8 digit NPSN resmi"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jenjang Sekolah:
                  </label>
                  <select
                    value={newSchoolForm.level}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, level: e.target.value as SchoolLevel })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  >
                    <option value="SD">SD (Sekolah Dasar)</option>
                    <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Kecamatan:
                  </label>
                  <select
                    value={newSchoolForm.kecamatan}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, kecamatan: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  >
                    {['Maritengngae', 'Baranti', 'Panca Rijang', 'Watang Pulu', 'Tellu Limpoe', 'Dua Pitue', 'Pitu Riase', 'Pitu Riawa', 'Kulo', 'Watang Sidenreng'].map(kec => (
                      <option key={kec} value={kec}>{kec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status:
                  </label>
                  <select
                    value={newSchoolForm.status}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, status: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  >
                    <option value="Negeri">Negeri</option>
                    <option value="Swasta">Swasta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Kepala Sekolah:
                </label>
                <input
                  type="text"
                  value={newSchoolForm.principalName}
                  onChange={e => setNewSchoolForm({ ...newSchoolForm, principalName: e.target.value })}
                  placeholder="Nama lengkap & gelar kepala sekolah"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jumlah Guru:
                  </label>
                  <input
                    type="number"
                    value={newSchoolForm.teacherCount}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, teacherCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Peserta Didik:
                  </label>
                  <input
                    type="number"
                    value={newSchoolForm.studentCount}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, studentCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Rombel:
                  </label>
                  <input
                    type="number"
                    value={newSchoolForm.rombelCount}
                    onChange={e => setNewSchoolForm({ ...newSchoolForm, rombelCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSchoolModal(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Sekolah Binaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
