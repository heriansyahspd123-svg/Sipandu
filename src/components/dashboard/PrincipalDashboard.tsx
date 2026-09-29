import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Layers, 
  BarChart3, 
  CheckSquare, 
  FolderArchive, 
  Award, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  Users,
  FileText
} from 'lucide-react';

interface PrincipalDashboardProps {
  onNavigateTab: (tab: string, meta?: any) => void;
  onOpenSchoolProfile: () => void;
}

export const PrincipalDashboard: React.FC<PrincipalDashboardProps> = ({
  onNavigateTab,
  onOpenSchoolProfile
}) => {
  const { 
    currentUser, 
    activeSchool, 
    indicators, 
    actionPlans, 
    evidences, 
    raporItems,
    getSchoolMetrics,
    getAccreditationReadiness
  } = useApp();

  const metrics = getSchoolMetrics(activeSchool.id);
  const readiness = getAccreditationReadiness(activeSchool.id);

  const priorityRapor = raporItems.filter(r => r.schoolId === activeSchool.id && r.isPriority);
  const overdueRtls = actionPlans.filter(p => p.schoolId === activeSchool.id && p.status === 'terlambat');
  const myTasks = actionPlans.filter(p => p.schoolId === activeSchool.id && (p.picId === currentUser.id || p.picRole.toLowerCase().includes('kepala')));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (PRD Section 61) */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Dashboard Kepala Satuan Pendidikan
              </span>
              <span className="text-xs text-slate-400">
                NPSN: {activeSchool.npsn}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Selamat datang di SIPANDU SEKOLAH
            </h1>
            <p className="text-xs sm:text-sm text-blue-200/90 mt-1 max-w-xl italic">
              “Berikut kondisi nyata capaian mutu sekolah Anda saat ini.”
            </p>
          </div>

          <button
            onClick={onOpenSchoolProfile}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition self-start sm:self-center"
          >
            <Building2 className="w-4 h-4 text-teal-300" />
            <span>Profil Satdik Lengkap</span>
          </button>
        </div>
      </div>

      {/* 5 Core School Status Cards (PRD Section 19) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        
        {/* 8 SNP */}
        <div 
          onClick={() => onNavigateTab('snp')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">8 SNP</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {metrics.baikPercent}%
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 mt-1 inline-block">
            Perlu Perbaikan
          </span>
        </div>

        {/* Rapor Pendidikan */}
        <div 
          onClick={() => onNavigateTab('rapor')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Rapor Pendidikan</span>
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-600 mt-2">
            {priorityRapor.length} Prioritas
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Numerasi & Kualitas Belajar
          </span>
        </div>

        {/* RTL Progress */}
        <div 
          onClick={() => onNavigateTab('rtl')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">RTL Mutu</span>
            <CheckSquare className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-purple-600 mt-2">
            {metrics.rtlProgressPercent}% Selesai
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Program Berkelanjutan
          </span>
        </div>

        {/* Bukti Terverifikasi */}
        <div 
          onClick={() => onNavigateTab('bank_bukti')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bukti Digital</span>
            <FolderArchive className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-2">
            {metrics.verifiedEvidencePercent}% Valid
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {metrics.pendingEvidenceCount} Menunggu Verifikasi
          </span>
        </div>

        {/* Kesiapan Akreditasi */}
        <div 
          onClick={() => onNavigateTab('akreditasi')}
          className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-400 cursor-pointer transition col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kesiapan Akreditasi</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
            {readiness.score}%
          </p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 mt-1 inline-block">
            Predikat {readiness.grade}
          </span>
        </div>

      </div>

      {/* Yang Perlu Dilakukan & Menu Cepat (PRD Section 19 & 61) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Yang Perlu Dilakukan Sekolah (CTA Focused) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Yang Perlu Dilakukan Sekolah Minggu Ini</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Daftar fokus tindakan terpenting agar warga sekolah tidak kewalahan.
              </p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
              {myTasks.length + overdueRtls.length} Agenda
            </span>
          </div>

          <div className="space-y-3">
            {/* Item 1 */}
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Pantau Pelaksanaan Workshop Media Numerasi (PIC: Guru Kls VI)
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Tindak lanjut rekomendasi pengawas atas skor numerasi Rapor Pendidikan (Target: 15 Oktober 2026).
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('rtl')}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 shadow-xs"
              >
                Pantau Tim
              </button>
            </div>

            {/* Item 2 */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <FolderArchive className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Periksa Kelengkapan Bukti Sarpras & Sanitasi Toilet
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Operator sedang menyelesaikan perbaikan kran air toilet murid sayap utara.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('bank_bukti')}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shrink-0 shadow-xs"
              >
                Cek Bukti
              </button>
            </div>

            {/* Item 3 */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/70 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Simulasi Kesiapan Dokumen Akreditasi 2027
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5">
                    Kesiapan saat ini 78%. Masih terdapat 3 indikator yang perlu dilengkapi bukti otentiknya.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('akreditasi')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 shadow-xs"
              >
                Lihat Gap
              </button>
            </div>
          </div>
        </div>

        {/* Menu Cepat (PRD Section 19) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Menu Cepat Satuan Pendidikan
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Akses langsung fitur utama</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'snp', label: '8 SNP', icon: <Layers className="w-4 h-4 text-teal-600" /> },
              { id: 'rapor', label: 'Rapor PBD', icon: <BarChart3 className="w-4 h-4 text-blue-600" /> },
              { id: 'bank_bukti', label: 'Bank Bukti', icon: <FolderArchive className="w-4 h-4 text-purple-600" /> },
              { id: 'rtl', label: 'Program & RTL', icon: <CheckSquare className="w-4 h-4 text-amber-600" /> },
              { id: 'tugas', label: 'Tugas Tim', icon: <Users className="w-4 h-4 text-pink-600" /> },
              { id: 'monitoring', label: 'Monitoring', icon: <Clock className="w-4 h-4 text-sky-600" /> },
              { id: 'akreditasi', label: 'Akreditasi', icon: <Award className="w-4 h-4 text-emerald-600" /> },
              { id: 'laporan', label: 'Laporan', icon: <FileText className="w-4 h-4 text-indigo-600" /> }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => onNavigateTab(m.id)}
                className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-white transition text-left"
              >
                {m.icon}
                <span className="truncate">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
