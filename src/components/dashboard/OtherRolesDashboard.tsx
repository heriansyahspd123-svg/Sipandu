import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  CheckSquare, 
  FolderArchive, 
  Award, 
  UserCheck, 
  Building2, 
  FileText, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface OtherRolesDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenUpload: () => void;
}

export const OtherRolesDashboard: React.FC<OtherRolesDashboardProps> = ({
  onNavigateTab,
  onOpenUpload
}) => {
  const { currentUser, activeSchool, getSchoolMetrics, getAccreditationReadiness } = useApp();
  const metrics = getSchoolMetrics(activeSchool.id);
  const readiness = getAccreditationReadiness(activeSchool.id);

  const isOperator = currentUser.role === 'operator';
  const isQuality = currentUser.role === 'tim_mutu';
  const isCommittee = currentUser.role === 'komite';

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                {isOperator ? 'Tenaga Kependidikan & Operator Satdik' : isQuality ? 'Tim Penjaminan Mutu Satdik (TPMPS)' : 'Komite Satuan Pendidikan'}
              </span>
              <span className="text-xs text-slate-400">
                {activeSchool.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Selamat datang, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-xl">
              {isOperator 
                ? 'Kelola administrasi sarana prasarana, data pokok pendidikan, dan pengunggahan berkas bukti digital.' 
                : isQuality 
                ? 'Analisis pencapaian 8 Standar Nasional, kawal program peningkatan mutu, dan evaluasi ketercapaian RTL.' 
                : 'Informasi keterbukaan program sekolah, sarana prasarana, dan kemajuan mutu peserta didik.'}
            </p>
          </div>

          {isOperator && (
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition shrink-0"
            >
              Upload Dokumen Sarpras
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Keterpenuhan 8 SNP</span>
          <p className="text-2xl font-black text-teal-600 mt-1">{metrics.baikPercent}%</p>
          <span className="text-[10px] text-slate-400">Standar Mutu Nasional</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Progres RTL</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{metrics.rtlProgressPercent}%</p>
          <span className="text-[10px] text-slate-400">Program Terlaksana</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Bukti Digital</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{metrics.verifiedEvidencePercent}%</p>
          <span className="text-[10px] text-slate-400">Terverifikasi Pengawas</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Kesiapan Akreditasi</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{readiness.score}%</p>
          <span className="text-[10px] font-bold text-emerald-600">{readiness.grade}</span>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigateTab('snp')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 cursor-pointer transition"
        >
          <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950 text-teal-600 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">8 Standar Nasional (SNP)</h3>
          <p className="text-xs text-slate-500 mt-1">Lihat status pemenuhan indikator dan pertanyaan panduan asesmen.</p>
        </div>

        <div 
          onClick={() => onNavigateTab('bank_bukti')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 cursor-pointer transition"
        >
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 w-fit">
            <FolderArchive className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">Bank Bukti Digital</h3>
          <p className="text-xs text-slate-500 mt-1">Arsip dokumen digital terverifikasi dan riwayat perubahan berkas.</p>
        </div>

        <div 
          onClick={() => onNavigateTab('rtl')}
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 cursor-pointer transition"
        >
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 w-fit">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-3">Program & RTL</h3>
          <p className="text-xs text-slate-500 mt-1">Pantau rencana tindak lanjut dan penugasan PIC satuan pendidikan.</p>
        </div>
      </div>

    </div>
  );
};
