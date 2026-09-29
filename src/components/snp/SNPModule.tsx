import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentStatus, Indicator } from '../../types';
import { 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MinusCircle, 
  ChevronRight, 
  FileText, 
  Upload, 
  Sparkles, 
  Calendar, 
  User, 
  ArrowUpRight,
  BookOpen,
  Info,
  X,
  Plus
} from 'lucide-react';

interface SNPModuleProps {
  onOpenUploadForIndicator: (indicatorId: string, standardId: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const SNPModule: React.FC<SNPModuleProps> = ({
  onOpenUploadForIndicator,
  onNavigateTab
}) => {
  const { 
    standards, 
    indicators, 
    activeStandardId, 
    setActiveStandardId, 
    setIndicatorStatus, 
    evidences, 
    activeSchool,
    currentUser,
    users
  } = useApp();

  const [selectedGuideIndicator, setSelectedGuideIndicator] = useState<Indicator | null>(null);
  const [editingIndicatorId, setEditingIndicatorId] = useState<string | null>(null);

  // Form for inline recommendation / PIC edit
  const [recommendationForm, setRecommendationForm] = useState({
    notes: '',
    recommendation: '',
    picId: '',
    picName: '',
    targetDeadline: ''
  });

  const activeStandard = standards.find(s => s.id === activeStandardId) || standards[0];
  const standardIndicators = indicators.filter(i => i.standardId === activeStandardId);

  const canEditAssessment = 
    currentUser.role === 'pengawas' || 
    currentUser.role === 'kepala_sekolah' || 
    currentUser.role === 'tim_mutu';

  const statusConfig: Record<AssessmentStatus, { label: string; badgeBg: string; text: string; icon: React.ReactNode }> = {
    baik: {
      label: 'Baik / Memenuhi',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      text: 'text-emerald-600',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    perlu_perbaikan: {
      label: 'Sebagian / Perlu Perbaikan',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      text: 'text-amber-600',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
    },
    belum_memenuhi: {
      label: 'Belum Memenuhi',
      badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      text: 'text-rose-600',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
    },
    belum_dinilai: {
      label: 'Belum Dinilai',
      badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      text: 'text-slate-500',
      icon: <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
    }
  };

  const handleStartEdit = (ind: Indicator) => {
    setEditingIndicatorId(ind.id);
    setRecommendationForm({
      notes: ind.notes || '',
      recommendation: ind.recommendation || '',
      picId: ind.assignedPicId || '',
      picName: ind.assignedPicName || '',
      targetDeadline: ind.targetDeadline || ''
    });
  };

  const handleSaveEdit = (indId: string, currentStatus: AssessmentStatus) => {
    setIndicatorStatus(
      indId,
      currentStatus,
      recommendationForm.notes,
      recommendationForm.recommendation,
      recommendationForm.picId,
      recommendationForm.picName,
      recommendationForm.targetDeadline
    );
    setEditingIndicatorId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Standard Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                8 Standar Nasional Pendidikan
              </span>
              <span className="text-xs text-slate-400">
                Jenjang {activeSchool.level} • {activeSchool.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
              Standar {activeStandard.id}: {activeStandard.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {activeStandard.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('akreditasi')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Akreditasi</span>
            </button>
          </div>
        </div>

        {/* 8 SNP Tabs Navigation */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {standards.map(std => {
            const isTabActive = std.id === activeStandardId;
            const countBaik = indicators.filter(i => i.standardId === std.id && i.status === 'baik').length;
            const totalStdInd = indicators.filter(i => i.standardId === std.id).length || 1;
            const percent = Math.round((countBaik / totalStdInd) * 100);

            return (
              <button
                key={std.id}
                onClick={() => setActiveStandardId(std.id)}
                className={`flex-1 min-w-[130px] p-2.5 rounded-2xl border text-left transition shrink-0 ${
                  isTabActive
                    ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                    isTabActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    STD {std.id}
                  </span>
                  <span className={`text-[10px] font-bold ${isTabActive ? 'text-teal-100' : 'text-slate-400'}`}>
                    {percent}%
                  </span>
                </div>
                <p className={`text-xs font-bold mt-1.5 truncate ${isTabActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                  {std.shortName}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Indicator Cards List */}
      <div className="space-y-4">
        {standardIndicators.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Belum ada indikator tersimpan untuk standar ini.</p>
          </div>
        ) : (
          standardIndicators.map(ind => {
            const linkedDocs = evidences.filter(e => ind.linkedEvidenceIds?.includes(e.id));
            const isEditing = editingIndicatorId === ind.id;

            return (
              <div
                key={ind.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition"
              >
                {/* Header row: Code, Title, Guide button, Status badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-sm shrink-0 border border-teal-200/50">
                      {ind.code}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {ind.component}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600">
                          {ind.targetLevel === 'ALL' ? 'Semua Jenjang' : ind.targetLevel}
                        </span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {ind.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* "Panduan Mudah" modal trigger */}
                    <button
                      onClick={() => setSelectedGuideIndicator(ind)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60 text-xs font-semibold hover:bg-blue-100 transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Panduan Mudah</span>
                    </button>

                    {/* Status badge */}
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${statusConfig[ind.status].badgeBg}`}>
                      {statusConfig[ind.status].icon}
                      <span>{statusConfig[ind.status].label}</span>
                    </span>
                  </div>
                </div>

                {/* Guiding Question */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block mb-1">
                    Pertanyaan Panduan Asesmen
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 italic leading-relaxed">
                    “{ind.question}”
                  </p>
                </div>

                {/* 4 Status Switcher Buttons (if user has permission) */}
                {canEditAssessment && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Perbarui Status Pemenuhan Indikator:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(['baik', 'perlu_perbaikan', 'belum_memenuhi', 'belum_dinilai'] as AssessmentStatus[]).map(st => (
                        <button
                          key={st}
                          onClick={() => setIndicatorStatus(ind.id, st)}
                          className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                            ind.status === st 
                              ? `${statusConfig[st].badgeBg} ring-2 ring-teal-500 shadow-xs` 
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {statusConfig[st].icon}
                          <span className="truncate">{statusConfig[st].label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes, Operational Recommendation, PIC, Deadline */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Catatan Kondisi Riil */}
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Catatan Kondisi Riil Sekolah
                    </span>
                    {isEditing ? (
                      <textarea
                        value={recommendationForm.notes}
                        onChange={e => setRecommendationForm({ ...recommendationForm, notes: e.target.value })}
                        rows={2}
                        className="mt-1.5 w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                        placeholder="Tuliskan catatan kondisi nyata di sekolah..."
                      />
                    ) : (
                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                        {ind.notes || 'Belum ada catatan pembina/sekolah.'}
                      </p>
                    )}
                  </div>

                  {/* Rekomendasi Operasional & PIC */}
                  <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40">
                    <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider block">
                      Rekomendasi Tindak Lanjut & Penugasan
                    </span>
                    {isEditing ? (
                      <div className="mt-1.5 space-y-2">
                        <input
                          type="text"
                          value={recommendationForm.recommendation}
                          onChange={e => setRecommendationForm({ ...recommendationForm, recommendation: e.target.value })}
                          className="w-full p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs"
                          placeholder="Rekomendasi tindakan konkrit..."
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={recommendationForm.picName}
                            onChange={e => setRecommendationForm({ ...recommendationForm, picName: e.target.value })}
                            className="flex-1 p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs"
                            placeholder="Nama PIC (contoh: Guru Kls VI)"
                          />
                          <input
                            type="date"
                            value={recommendationForm.targetDeadline}
                            onChange={e => setRecommendationForm({ ...recommendationForm, targetDeadline: e.target.value })}
                            className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-xs"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                          {ind.recommendation || 'Belum ada rekomendasi operasional.'}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                          {ind.assignedPicName && (
                            <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                              <User className="w-3 h-3 text-teal-600" />
                              <span>PIC: {ind.assignedPicName}</span>
                            </span>
                          )}
                          {ind.targetDeadline && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Calendar className="w-3 h-3 text-amber-500" />
                              <span>Target: {ind.targetDeadline}</span>
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit & Save Action button */}
                {canEditAssessment && (
                  <div className="mt-3 flex justify-end">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingIndicatorId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-100"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleSaveEdit(ind.id, ind.status)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 shadow-xs"
                        >
                          Simpan Catatan & PIC
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(ind)}
                        className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                      >
                        Ubah Catatan & Rekomendasi
                      </button>
                    )}
                  </div>
                )}

                {/* Linked Evidence Section ("Bukti sekali, manfaat berkali-kali") */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-500" />
                      <span>Bukti Terkait ({linkedDocs.length})</span>
                    </span>

                    <button
                      onClick={() => onOpenUploadForIndicator(ind.id, activeStandardId)}
                      className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-lg transition"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload Bukti Indikator Ini</span>
                    </button>
                  </div>

                  {linkedDocs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-1">
                      Belum ada dokumen bukti yang ditautkan ke indikator ini.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {linkedDocs.map(doc => (
                        <div
                          key={doc.id}
                          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between"
                        >
                          <div className="truncate pr-2">
                            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                              {doc.title}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {doc.fileSize} • Versi {doc.version}
                            </p>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold shrink-0 ${
                            doc.status === 'terverifikasi' ? 'bg-emerald-100 text-emerald-800' :
                            doc.status === 'perlu_perbaikan' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* "Panduan Mudah" Modal (PRD Section 47) */}
      {selectedGuideIndicator && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-white/10 text-teal-300">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                    Panduan Mudah Indikator {selectedGuideIndicator.code}
                  </span>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {selectedGuideIndicator.title}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedGuideIndicator(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal content based on PRD requirements */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              
              {/* 1. Apa maksud indikator ini? */}
              <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/50">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>1. Apa maksud indikator ini?</span>
                </h4>
                <p>{selectedGuideIndicator.guide.meaning}</p>
              </div>

              {/* 2. Mengapa penting? */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>2. Mengapa indikator ini penting bagi mutu sekolah?</span>
                </h4>
                <p>{selectedGuideIndicator.guide.whyImportant}</p>
              </div>

              {/* 3. Apa yang perlu dilakukan? */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  3. Apa langkah konkret yang perlu dilakukan sekolah?
                </h4>
                <div className="space-y-1.5">
                  {selectedGuideIndicator.guide.actionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Contoh bukti yang dapat digunakan */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                  4. Contoh bukti fisik / digital yang dapat diunggah:
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                  {selectedGuideIndicator.guide.exampleEvidence.map((ev, idx) => (
                    <li key={idx}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* 5. Kesalahan yang sering terjadi */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/50 text-rose-950 dark:text-rose-200">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5 mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>5. Kesalahan umum yang sering terjadi:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {selectedGuideIndicator.guide.commonMistakes.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedGuideIndicator(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
