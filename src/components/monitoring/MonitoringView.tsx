import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Layers, 
  FileText, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

interface MonitoringViewProps {
  onNavigateTab: (tab: string) => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({ onNavigateTab }) => {
  const { 
    schools, 
    activeSchool, 
    actionPlans, 
    evidences, 
    indicators, 
    standards, 
    getSchoolMetrics,
    currentUser
  } = useApp();

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(activeSchool.id);
  const [selectedStandard, setSelectedStandard] = useState<number | 'ALL'>('ALL');

  const currentMetrics = getSchoolMetrics(selectedSchoolId);
  const targetSchool = schools.find(s => s.id === selectedSchoolId) || activeSchool;

  const schoolRtls = actionPlans.filter(p => p.schoolId === selectedSchoolId);
  const overdueRtls = schoolRtls.filter(p => p.status === 'terlambat');
  const runningRtls = schoolRtls.filter(p => p.status === 'berjalan');
  const finishedRtls = schoolRtls.filter(p => p.status === 'selesai');

  const schoolEvs = evidences.filter(e => e.schoolId === selectedSchoolId);
  const pendingEvs = schoolEvs.filter(e => e.status === 'menunggu_verifikasi');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Pusat Monitoring Mutu Terpadu
            </span>
            <span className="text-xs text-slate-400">
              Pemantauan Berkelanjutan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Monitoring Keterlaksanaan Program Mutu
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Pantau progres real-time indikator 8 SNP, verifikasi bukti digital, dan deteksi dini program tindak lanjut yang mendekati atau melewati tenggat waktu.
          </p>
        </div>

        {/* School selector for monitoring */}
        {currentUser.role === 'pengawas' && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSchoolId}
              onChange={e => setSelectedSchoolId(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white font-semibold"
            >
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Real-time Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: 8 SNP Dinilai */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Capaian 8 SNP</span>
            <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentMetrics.baikPercent}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Kategori Baik</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentMetrics.baikPercent}%` }}
            />
          </div>
        </div>

        {/* Card 2: RTL Selesai */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Progres RTL</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentMetrics.rtlProgressPercent}%
            </span>
            <span className="text-xs text-slate-400">
              {finishedRtls.length}/{schoolRtls.length} Selesai
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentMetrics.rtlProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Card 3: Bukti Terverifikasi */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Validasi Bukti</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {currentMetrics.verifiedEvidencePercent}%
            </span>
            <span className="text-xs text-slate-400">
              {pendingEvs.length} Menunggu
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentMetrics.verifiedEvidencePercent}%` }}
            />
          </div>
        </div>

        {/* Card 4: RTL Terlambat / Urgent */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Perlu Atensi</span>
            <div className={`p-2 rounded-xl ${overdueRtls.length > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${overdueRtls.length > 0 ? 'text-rose-600' : 'text-slate-800 dark:text-white'}`}>
              {overdueRtls.length}
            </span>
            <span className="text-xs text-slate-400">RTL Terlambat</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {pendingEvs.length} bukti belum diverifikasi
          </p>
        </div>

      </div>

      {/* Overdue Alert Banner if any */}
      {overdueRtls.length > 0 && (
        <div className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Peringatan: Terdapat {overdueRtls.length} program tindak lanjut yang melewati target waktu!
              </h4>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                Segera hubungi PIC terkait atau jadwalkan supervisi klinis pengawas.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('rtl')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 shadow-xs"
          >
            Buka RTL
          </button>
        </div>
      )}

      {/* Active Workflows Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Status Rencana Tindak Lanjut Aktif ({targetSchool.name})</span>
        </h3>

        <div className="space-y-2">
          {schoolRtls.map(rtl => (
            <div
              key={rtl.id}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                    SNP {rtl.standardId}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white">
                    {rtl.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  PIC: <strong>{rtl.picName}</strong> • Target: {rtl.targetDate}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  rtl.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' :
                  rtl.status === 'terlambat' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {rtl.status}
                </span>

                <button
                  onClick={() => onNavigateTab('rtl')}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
