import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActionPlan, Indicator } from '../../types';
import { 
  CheckSquare, 
  Upload, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  FileText, 
  AlertCircle,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface TaskAssignmentViewProps {
  onOpenUpload: (indicatorId?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const TaskAssignmentView: React.FC<TaskAssignmentViewProps> = ({
  onOpenUpload,
  onNavigateTab
}) => {
  const { 
    currentUser, 
    actionPlans, 
    indicators, 
    activeSchool, 
    updateActionPlan,
    evidences
  } = useApp();

  const isTeacher = currentUser.role === 'guru';

  // Filter tasks assigned to current user or all if Kepsek
  const myRTLTasks = actionPlans.filter(p => {
    if (p.schoolId !== activeSchool.id) return false;
    if (isTeacher) {
      return p.picName.toLowerCase().includes(currentUser.name.toLowerCase()) || 
             p.picId === currentUser.id ||
             p.picRole.toLowerCase().includes('guru');
    }
    return true;
  });

  const myIndicators = indicators.filter(ind => {
    if (isTeacher) {
      return ind.assignedPicId === currentUser.id || 
             ind.assignedPicName?.toLowerCase().includes('guru') ||
             ind.assignedPicName?.toLowerCase().includes(currentUser.name.toLowerCase());
    }
    return true;
  });

  const completedCount = myRTLTasks.filter(t => t.status === 'selesai').length;
  const inProgressCount = myRTLTasks.filter(t => t.status === 'berjalan').length;
  const overdueCount = myRTLTasks.filter(t => t.status === 'terlambat').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {isTeacher ? 'Fokus Pendidik & Guru' : 'Manajemen Penugasan Tim (PIC)'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1.5">
              {isTeacher ? `Daftar Tugas Saya — ${currentUser.name}` : 'Penugasan Tim & Pemantauan Beban Kerja'}
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
              Prinsip Guru: <strong>Lihat → Pahami → Kerjakan → Upload → Dapat Umpan Balik → Selesai</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[75px]">
              <span className="text-[10px] text-purple-300 font-semibold block uppercase">Berjalan</span>
              <span className="text-xl font-black text-amber-300">{inProgressCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[75px]">
              <span className="text-[10px] text-purple-300 font-semibold block uppercase">Selesai</span>
              <span className="text-xl font-black text-emerald-300">{completedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-purple-600" />
            <span>Tugas Rencana Tindak Lanjut yang Harus Diselesaikan</span>
          </h2>
          <span className="text-xs text-slate-400">Total: {myRTLTasks.length} Tugas</span>
        </div>

        {myRTLTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-80" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Luar biasa! Tidak ada tugas yang tertunda.</p>
            <p className="text-xs text-slate-400 mt-1">Seluruh indikator dan pengumpulan bukti berjalan sesuai tenggat waktu.</p>
          </div>
        ) : (
          myRTLTasks.map(task => {
            const isCompleted = task.status === 'selesai';

            return (
              <div
                key={task.id}
                className={`rounded-3xl p-5 sm:p-6 border transition bg-white dark:bg-slate-900 shadow-xs ${
                  isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/10' 
                    : task.status === 'terlambat'
                    ? 'border-rose-300 ring-2 ring-rose-300/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      Standar {task.standardId}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>Batas Waktu: <strong>{task.targetDate}</strong></span>
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' :
                    task.status === 'terlambat' ? 'bg-rose-100 text-rose-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>
                </div>

                {/* Task Title & What to do */}
                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {task.title}
                  </h3>
                  <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 block mb-0.5">
                      Apa yang harus dilakukan?
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {task.activity}
                    </p>
                  </div>
                </div>

                {/* Supervisor Feedback if present */}
                {task.supervisorNotes && (
                  <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-bold block">Catatan / Umpan Balik Pembina:</span>
                    <p className="mt-0.5 italic">“{task.supervisorNotes}”</p>
                  </div>
                )}

                {/* 3 Main Action Buttons for Guru (PRD Section 20) */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    PIC: <strong>{task.picName}</strong>
                  </span>

                  <div className="flex items-center gap-2">
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
                    {!isCompleted ? (
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
                        className="text-xs text-slate-400 hover:underline"
                      >
                        Buka Kembali
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
