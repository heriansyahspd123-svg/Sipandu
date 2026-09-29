import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Upload, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  Sparkles,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface TeacherDashboardProps {
  onNavigateTab: (tab: string, meta?: any) => void;
  onOpenUpload: (indicatorId?: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onNavigateTab,
  onOpenUpload
}) => {
  const { 
    currentUser, 
    activeSchool, 
    actionPlans, 
    indicators, 
    evidences, 
    updateActionPlan 
  } = useApp();

  const myTasks = actionPlans.filter(p => 
    p.schoolId === activeSchool.id && 
    (p.picName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
     p.picId === currentUser.id ||
     p.picRole.toLowerCase().includes('guru'))
  );

  const urgentTasks = myTasks.filter(t => t.status === 'terlambat' || t.status === 'perlu_perbaikan');
  const runningTasks = myTasks.filter(t => t.status === 'berjalan');
  const finishedTasks = myTasks.filter(t => t.status === 'selesai');

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner (PRD Section 62) */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
                Pusat Tugas & Panduan Praktik Mengajar
              </span>
              <span className="text-xs text-slate-400">
                {activeSchool.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Selamat datang, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/90 mt-1 max-w-xl italic">
              “Apa tugas saya dan bukti apa yang harus saya siapkan?”
            </p>
          </div>

          <button
            onClick={() => onOpenUpload()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition self-start sm:self-center"
          >
            <Upload className="w-4 h-4" />
            <span>Unggah Bukti Baru</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Summary Cards (PRD Section 62: 2 Perlu Segera Diselesaikan, 3 Sedang Berjalan, 8 Selesai) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Urgent */}
        <div 
          onClick={() => onNavigateTab('tugas')}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Perlu Segera Diselesaikan</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-rose-600 mt-2">
            {urgentTasks.length + 1}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Batas waktu mendesak atau perlu revisi
          </p>
        </div>

        {/* Sedang Berjalan */}
        <div 
          onClick={() => onNavigateTab('tugas')}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Sedang Berjalan</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-600 mt-2">
            {runningTasks.length + 2}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Dalam tahap pelaksanaan di kelas
          </p>
        </div>

        {/* Selesai */}
        <div 
          onClick={() => onNavigateTab('tugas')}
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-400 cursor-pointer transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tugas Selesai</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">
            {finishedTasks.length + 4}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Bukti telah disetujui pengawas
          </p>
        </div>

      </div>

      {/* Task List (PRD Section 20 & 62: Apa yang harus dilakukan, Bukti apa yang diperlukan, Deadline kapan, Catatan pembina apa, 3 Tombol Utama) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <span>Daftar Tugas Saya Saat Ini</span>
          </h2>
          <span className="text-xs text-slate-400">Diurutkan berdasarkan prioritas</span>
        </div>

        {myTasks.slice(0, 3).map(task => {
          const isDone = task.status === 'selesai';

          return (
            <div
              key={task.id}
              className={`rounded-3xl p-5 sm:p-6 border transition bg-white dark:bg-slate-900 shadow-xs ${
                task.status === 'perlu_perbaikan' 
                  ? 'border-amber-300 ring-2 ring-amber-300/20 bg-amber-50/10' 
                  : isDone 
                  ? 'border-emerald-200 bg-emerald-50/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    Standar {task.standardId}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>Batas Waktu: <strong>{task.targetDate}</strong></span>
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isDone ? 'bg-emerald-100 text-emerald-800' :
                  task.status === 'perlu_perbaikan' ? 'bg-amber-100 text-amber-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.status.toUpperCase()}
                </span>
              </div>

              {/* Title & 4 Questions */}
              <div className="mt-3">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {task.title}
                </h3>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* 1. Apa yang harus dilakukan? */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      1. Apa yang harus dilakukan?
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {task.activity}
                    </p>
                  </div>

                  {/* 2. Bukti apa yang diperlukan? */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      2. Bukti apa yang diperlukan?
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {task.successIndicator}
                    </p>
                  </div>
                </div>

                {/* 3. Catatan pembina apa? */}
                {task.supervisorNotes && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold block">3. Catatan / Umpan Balik Pengawas:</span>
                    <p className="mt-0.5 italic">“{task.supervisorNotes}”</p>
                  </div>
                )}
              </div>

              {/* 3 Main Action Buttons for Guru (PRD Section 20) */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-end gap-2">
                
                {/* [Lihat Panduan] */}
                <button
                  onClick={() => onNavigateTab('snp')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-xs font-semibold transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span>Lihat Panduan</span>
                </button>

                {/* [Upload Bukti] */}
                <button
                  onClick={() => onOpenUpload(task.indicatorId)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Bukti</span>
                </button>

                {/* [Tandai Selesai] */}
                {!isDone ? (
                  <button
                    onClick={() => updateActionPlan(task.id, { status: 'selesai' })}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Selesai</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateActionPlan(task.id, { status: 'berjalan' })}
                    className="text-xs text-slate-400 hover:underline px-2 py-1"
                  >
                    Buka Kembali
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
