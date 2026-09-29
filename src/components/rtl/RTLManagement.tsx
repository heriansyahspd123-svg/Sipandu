import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActionPlan, RTLStatus } from '../../types';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  FileText, 
  ChevronRight, 
  Trash2, 
  Edit3,
  X,
  Sparkles
} from 'lucide-react';

interface RTLManagementProps {
  onNavigateTab: (tab: string) => void;
  onOpenUploadForRTL: (rtlId: string) => void;
}

export const RTLManagement: React.FC<RTLManagementProps> = ({
  onNavigateTab,
  onOpenUploadForRTL
}) => {
  const { 
    actionPlans, 
    activeSchool, 
    standards, 
    currentUser, 
    addActionPlan, 
    updateActionPlan, 
    deleteActionPlan,
    evidences
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RTLStatus | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);

  // Form state
  const [formState, setFormState] = useState<{
    title: string;
    problemSource: string;
    rootCause: string;
    standardId: number;
    activity: string;
    picName: string;
    picRole: string;
    targetDate: string;
    resources: string;
    successIndicator: string;
    status: RTLStatus;
    notes: string;
  }>({
    title: '',
    problemSource: 'Temuan Asesmen Standar 8 SNP',
    rootCause: '',
    standardId: 3,
    activity: '',
    picName: currentUser.name,
    picRole: currentUser.role,
    targetDate: '',
    resources: 'Dana BOSP Reguler',
    successIndicator: '',
    status: 'berjalan',
    notes: ''
  });

  const schoolPlans = actionPlans.filter(p => p.schoolId === activeSchool.id);

  const filteredPlans = schoolPlans.filter(p => {
    const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.picName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusConfigs: Record<RTLStatus, { label: string; badge: string; icon: React.ReactNode }> = {
    belum_mulai: {
      label: 'Belum Mulai',
      badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
      icon: <Clock className="w-3.5 h-3.5 text-slate-500" />
    },
    berjalan: {
      label: 'Sedang Berjalan',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />
    },
    menunggu_verifikasi: {
      label: 'Menunggu Verifikasi',
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
    },
    perlu_perbaikan: {
      label: 'Perlu Perbaikan',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
    },
    selesai: {
      label: 'Selesai',
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    terlambat: {
      label: 'Terlambat',
      badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
    }
  };

  const handleOpenAdd = () => {
    setFormState({
      title: '',
      problemSource: 'Temuan Asesmen Standar 8 SNP',
      rootCause: '',
      standardId: 3,
      activity: '',
      picName: currentUser.name,
      picRole: currentUser.role,
      targetDate: '',
      resources: 'Dana BOSP Reguler',
      successIndicator: '',
      status: 'berjalan',
      notes: ''
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title.trim() || !formState.activity.trim()) return;

    if (editingPlan) {
      updateActionPlan(editingPlan.id, formState);
      setEditingPlan(null);
    } else {
      addActionPlan({
        schoolId: activeSchool.id,
        title: formState.title.trim(),
        problemSource: formState.problemSource,
        rootCause: formState.rootCause,
        standardId: formState.standardId,
        activity: formState.activity.trim(),
        picId: currentUser.id,
        picName: formState.picName.trim(),
        picRole: formState.picRole,
        targetDate: formState.targetDate || '2026-10-30',
        resources: formState.resources,
        successIndicator: formState.successIndicator,
        status: formState.status,
        linkedEvidenceIds: [],
        notes: formState.notes
      });
    }
    setShowAddModal(false);
  };

  const handleEditClick = (plan: ActionPlan) => {
    setEditingPlan(plan);
    setFormState({
      title: plan.title,
      problemSource: plan.problemSource,
      rootCause: plan.rootCause,
      standardId: plan.standardId,
      activity: plan.activity,
      picName: plan.picName,
      picRole: plan.picRole,
      targetDate: plan.targetDate,
      resources: plan.resources,
      successIndicator: plan.successIndicator,
      status: plan.status,
      notes: plan.notes || ''
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Rencana Tindak Lanjut (RTL)
            </span>
            <span className="text-xs text-slate-400">
              {activeSchool.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Program Peningkatan Mutu & RTL
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Format: <strong>Temuan → Rekomendasi → Kegiatan → PIC → Target → Bukti → Status → Verifikasi</strong>. Menjamin setiap rekomendasi pengawas dieksekusi tuntas.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah RTL Baru</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari kegiatan RTL, nama PIC, atau temuan..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
          >
            <option value="ALL">Semua Status RTL ({schoolPlans.length})</option>
            <option value="berjalan">Berjalan</option>
            <option value="selesai">Selesai</option>
            <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
            <option value="perlu_perbaikan">Perlu Perbaikan</option>
            <option value="terlambat">Terlambat</option>
          </select>
        </div>
      </div>

      {/* RTL Cards List */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <CheckSquare className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada rencana tindak lanjut.</p>
            <p className="text-xs text-slate-400 mt-1">Klik "Tambah RTL Baru" atau konversi dari modul Rapor Pendidikan.</p>
          </div>
        ) : (
          filteredPlans.map(plan => {
            const planDocs = evidences.filter(e => plan.linkedEvidenceIds?.includes(e.id));
            const std = standards.find(s => s.id === plan.standardId);

            return (
              <div
                key={plan.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition"
              >
                {/* Header row: Standard pill, Status badge, Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
                      Standar {plan.standardId} ({std?.shortName || 'SNP'})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sumber: {plan.problemSource}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusConfigs[plan.status]?.badge}`}>
                      {statusConfigs[plan.status]?.icon}
                      <span>{statusConfigs[plan.status]?.label}</span>
                    </span>

                    <button
                      onClick={() => handleEditClick(plan)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Edit RTL"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(currentUser.role === 'pengawas' || currentUser.role === 'kepala_sekolah') && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus RTL "${plan.title}"?`)) {
                            deleteActionPlan(plan.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600"
                        title="Hapus RTL"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Activity description */}
                <div className="mt-3">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {plan.title}
                  </h3>
                  <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Kegiatan Konkret:</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{plan.activity}</p>
                  </div>
                </div>

                {/* Key metadata grid: PIC, Target, Success Indicator, Resources */}
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Penanggung Jawab (PIC)</span>
                    <p className="font-bold text-slate-800 dark:text-white mt-0.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-teal-600" />
                      <span>{plan.picName}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{plan.picRole}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Waktu Penyelesaian</span>
                    <p className="font-bold text-slate-800 dark:text-white mt-0.5 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{plan.targetDate}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">Sumber Daya: {plan.resources}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Indikator Keberhasilan</span>
                    <p className="text-slate-700 dark:text-slate-300 mt-0.5 line-clamp-2">
                      {plan.successIndicator}
                    </p>
                  </div>
                </div>

                {/* Supervisor Notes if any */}
                {plan.supervisorNotes && (
                  <div className="mt-3 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200/60 text-xs text-teal-900 dark:text-teal-300">
                    <span className="font-bold block">Catatan Pendampingan Pengawas:</span>
                    <p className="mt-0.5 italic">“{plan.supervisorNotes}”</p>
                  </div>
                )}

                {/* Footer: Quick Status Switcher & Upload Evidence CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">Ubah Status:</span>
                    {(['berjalan', 'menunggu_verifikasi', 'selesai'] as RTLStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => updateActionPlan(plan.id, { status: st })}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition ${
                          plan.status === st 
                            ? 'bg-teal-600 text-white' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {statusConfigs[st].label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigateTab('bank_bukti')}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Lihat / Unggah Bukti RTL →</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit RTL Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-extrabold">
                {editingPlan ? 'Ubah Rencana Tindak Lanjut' : 'Tambah Rencana Tindak Lanjut (RTL) Baru'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Program Tindak Lanjut: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={e => setFormState({ ...formState, title: e.target.value })}
                  placeholder="Contoh: Workshop Pembuatan Media Manipulatif Numerasi Guru"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Uraian Kegiatan Konkret: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={formState.activity}
                  onChange={e => setFormState({ ...formState, activity: e.target.value })}
                  placeholder="Langkah nyata yang akan dilaksanakan..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Standar Terkait (SNP):
                  </label>
                  <select
                    value={formState.standardId}
                    onChange={e => setFormState({ ...formState, standardId: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  >
                    {standards.map(s => (
                      <option key={s.id} value={s.id}>Standar {s.id}: {s.shortName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Tanggal Penyelesaian:
                  </label>
                  <input
                    type="date"
                    value={formState.targetDate}
                    onChange={e => setFormState({ ...formState, targetDate: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Penanggung Jawab (PIC):
                  </label>
                  <input
                    type="text"
                    value={formState.picName}
                    onChange={e => setFormState({ ...formState, picName: e.target.value })}
                    placeholder="Nama PIC (contoh: Andi Rahmawati, S.Pd.)"
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sumber Daya / Anggaran:
                  </label>
                  <input
                    type="text"
                    value={formState.resources}
                    onChange={e => setFormState({ ...formState, resources: e.target.value })}
                    placeholder="BOSP Tahap 2 / Komunitas Belajar"
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Indikator Keberhasilan:
                </label>
                <input
                  type="text"
                  value={formState.successIndicator}
                  onChange={e => setFormState({ ...formState, successIndicator: e.target.value })}
                  placeholder="Contoh: 100% guru kelas menerapkan media konkret di kelas"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Status Saat Ini:
                </label>
                <select
                  value={formState.status}
                  onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                  className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                >
                  <option value="belum_mulai">Belum Mulai</option>
                  <option value="berjalan">Sedang Berjalan</option>
                  <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                  <option value="perlu_perbaikan">Perlu Perbaikan</option>
                  <option value="selesai">Selesai</option>
                  <option value="terlambat">Terlambat</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Program RTL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
