import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VisitRecord } from '../../types';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ArrowRight, 
  X,
  AlertCircle,
  Building2,
  Users
} from 'lucide-react';

export const SupervisorVisits: React.FC = () => {
  const { 
    visits, 
    schools, 
    activeSchool, 
    addVisit, 
    updateVisit, 
    currentUser 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitRecord | null>(null);

  const canManage = currentUser.role === 'pengawas';

  const [formState, setFormState] = useState({
    schoolId: activeSchool.id,
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    attendees: 'Kepala Sekolah, TPMPS, Komite',
    findings: '',
    recommendations: '',
    agreement: '',
    picAssigned: '',
    targetCompletionDate: '',
    nextVisitDate: '',
    status: 'Terjadwal' as 'Terjadwal' | 'Selesai' | 'Dibatalkan'
  });

  const handleOpenAdd = () => {
    setFormState({
      schoolId: activeSchool.id,
      date: new Date().toISOString().split('T')[0],
      purpose: '',
      attendees: 'Kepala Sekolah, TPMPS, Komite',
      findings: '',
      recommendations: '',
      agreement: '',
      picAssigned: '',
      targetCompletionDate: '',
      nextVisitDate: '',
      status: 'Terjadwal'
    });
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.purpose.trim()) return;

    const sch = schools.find(s => s.id === formState.schoolId) || activeSchool;

    addVisit({
      schoolId: formState.schoolId,
      schoolName: sch.name,
      date: formState.date,
      supervisorId: currentUser.id,
      supervisorName: currentUser.name,
      purpose: formState.purpose.trim(),
      attendees: formState.attendees.split(',').map(s => s.trim()).filter(Boolean),
      findings: formState.findings ? formState.findings.split('\n').filter(Boolean) : [],
      recommendations: formState.recommendations ? formState.recommendations.split('\n').filter(Boolean) : [],
      agreement: formState.agreement,
      picAssigned: formState.picAssigned,
      targetCompletionDate: formState.targetCompletionDate,
      nextVisitDate: formState.nextVisitDate,
      status: formState.status
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Agenda & Catatan Pembinaan
            </span>
            <span className="text-xs text-slate-400">
              Pengawas Sekolah Madya / Pembina
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Kunjungan & Pendampingan Berkelanjutan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Mendokumentasikan seluruh proses visitasi supervisi klinis: <strong>Tujuan → Temuan → Bukti → Rekomendasi → Kesepakatan → PIC → Kunjungan Berikutnya</strong>.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 shrink-0 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Jadwalkan Kunjungan Baru</span>
          </button>
        )}
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        {visits.map(visit => {
          const isDone = visit.status === 'Selesai';

          return (
            <div
              key={visit.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {visit.schoolName}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Tanggal: <strong>{visit.date}</strong> • Pembina: {visit.supervisorName}
                    </p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {visit.status}
                </span>
              </div>

              {/* Purpose */}
              <div className="mt-3">
                <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                  Tujuan Kunjungan & Fokus Pembinaan:
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                  {visit.purpose}
                </p>
              </div>

              {/* Attendees */}
              {visit.attendees?.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Peserta: {visit.attendees.join(', ')}</span>
                </div>
              )}

              {/* Findings & Recommendations Grid */}
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Findings */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-white block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Temuan Kondisi Lapangan</span>
                  </span>
                  {visit.findings && visit.findings.length > 0 ? (
                    <ul className="space-y-1 list-disc pl-4 text-slate-600 dark:text-slate-300">
                      {visit.findings.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Belum ada catatan temuan.</p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-teal-900 dark:text-teal-300 block mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" />
                    <span>Rekomendasi Operasional Pengawas</span>
                  </span>
                  {visit.recommendations && visit.recommendations.length > 0 ? (
                    <ul className="space-y-1 list-disc pl-4 text-slate-700 dark:text-slate-200">
                      {visit.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-400 italic">Belum ada rekomendasi.</p>
                  )}
                </div>
              </div>

              {/* Agreement & Next Visit Date */}
              {visit.agreement && (
                <div className="mt-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 text-xs">
                  <span className="font-bold text-amber-900 dark:text-amber-300 block">
                    Kesepakatan Bersama Satuan Pendidikan:
                  </span>
                  <p className="text-slate-700 dark:text-slate-200 mt-0.5 italic">
                    “{visit.agreement}”
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                    {visit.picAssigned && <span>PIC: <strong>{visit.picAssigned}</strong></span>}
                    {visit.targetCompletionDate && <span>Target: <strong>{visit.targetCompletionDate}</strong></span>}
                    {visit.nextVisitDate && (
                      <span className="text-teal-700 dark:text-teal-400 font-bold">
                        Kunjungan Berikutnya: {visit.nextVisitDate}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick status toggle for Pengawas */}
              {canManage && (
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs">
                  {visit.status === 'Terjadwal' ? (
                    <button
                      onClick={() => updateVisit(visit.id, { status: 'Selesai' })}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
                    >
                      Tandai Selesai Dilaksanakan
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Terdokumentasi Resmi dalam Histori Satdik</span>
                    </span>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Add Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-extrabold">Jadwalkan Kunjungan & Catatan Pembinaan</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sekolah Tujuan:
                  </label>
                  <select
                    value={formState.schoolId}
                    onChange={e => setFormState({ ...formState, schoolId: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  >
                    {schools.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Pelaksanaan:
                  </label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={e => setFormState({ ...formState, date: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tujuan / Agenda Pendampingan: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.purpose}
                  onChange={e => setFormState({ ...formState, purpose: e.target.value })}
                  placeholder="Contoh: Supervisi Klinis Pembelajaran Diferensiasi & Pengecekan Sanitasi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Peserta / Sasaran yang Didampingi:
                </label>
                <input
                  type="text"
                  value={formState.attendees}
                  onChange={e => setFormState({ ...formState, attendees: e.target.value })}
                  placeholder="Kepala Sekolah, Guru Kelas VI, TPMPS"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan Temuan (pisahkan per baris):
                </label>
                <textarea
                  rows={2}
                  value={formState.findings}
                  onChange={e => setFormState({ ...formState, findings: e.target.value })}
                  placeholder="Temuan 1...&#10;Temuan 2..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Rekomendasi Tindak Lanjut Pengawas (pisahkan per baris):
                </label>
                <textarea
                  rows={2}
                  value={formState.recommendations}
                  onChange={e => setFormState({ ...formState, recommendations: e.target.value })}
                  placeholder="Rekomendasi 1...&#10;Rekomendasi 2..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kesepakatan Bersama Satuan Pendidikan:
                </label>
                <input
                  type="text"
                  value={formState.agreement}
                  onChange={e => setFormState({ ...formState, agreement: e.target.value })}
                  placeholder="Sekolah menyepakati target penyelesaian bukti perbaikan sebelum tanggal..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jadwal Kunjungan Berikutnya:
                  </label>
                  <input
                    type="date"
                    value={formState.nextVisitDate}
                    onChange={e => setFormState({ ...formState, nextVisitDate: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status:
                  </label>
                  <select
                    value={formState.status}
                    onChange={e => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
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
                  Simpan Agenda Kunjungan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
