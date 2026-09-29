import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Regulation } from '../../types';
import { 
  BookOpen, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Filter, 
  X,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const MasterRegulasi: React.FC = () => {
  const { regulations, addRegulation, updateRegulation, standards, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const canManage = currentUser.role === 'pengawas';

  const [formState, setFormState] = useState({
    codeNo: '',
    year: 2024,
    title: '',
    shortTitle: '',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: '',
    linkedStandardIds: [1],
    isActive: true,
    lastValidated: new Date().toISOString().split('T')[0]
  });

  const filteredRegulations = regulations.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.codeNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.codeNo.trim() || !formState.title.trim()) return;

    addRegulation({
      ...formState,
      year: Number(formState.year)
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
              Dasar Hukum & Instrumen Kebijakan
            </span>
            <span className="text-xs text-slate-400">
              Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Master Regulasi Pendidikan
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Menjamin indikator mutu SIPANDU selalu mutakhir dan dinamis mengikuti perubahan peraturan resmi pemerintah tanpa terkunci kaku pada data awal.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 shrink-0 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Regulasi Baru</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nomor permendikbud, tahun, atau kata kunci regulasi..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Regulations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRegulations.map(reg => (
          <div
            key={reg.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {reg.codeNo}
                </span>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  reg.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {reg.isActive ? 'Berlaku Aktif' : 'Telah Diperbarui'}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-2.5">
                {reg.shortTitle}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {reg.title}
              </p>

              <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-800 dark:text-white block mb-0.5">Ringkasan Ketentuan:</span>
                {reg.summary}
              </div>

              {/* Linked Standards */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Terkait SNP:</span>
                {reg.linkedStandardIds.map(sid => (
                  <span key={sid} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Standar {sid}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Sumber: <strong>{reg.officialSource}</strong></span>
              <span>Validasi: {reg.lastValidated}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Regulation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-extrabold">Tambah Master Regulasi Baru</h3>
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
                    Nomor & Kode Regulasi: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.codeNo}
                    onChange={e => setFormState({ ...formState, codeNo: e.target.value })}
                    placeholder="Contoh: Permendikbudristek No. 12 Tahun 2024"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tahun Penerbitan:
                  </label>
                  <input
                    type="number"
                    value={formState.year}
                    onChange={e => setFormState({ ...formState, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Judul Lengkap Regulasi: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formState.title}
                  onChange={e => setFormState({ ...formState, title: e.target.value })}
                  placeholder="Contoh: Kurikulum pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Singkat / Label:
                </label>
                <input
                  type="text"
                  value={formState.shortTitle}
                  onChange={e => setFormState({ ...formState, shortTitle: e.target.value })}
                  placeholder="Contoh: Permendikbud No. 12/2024 (Kurikulum Merdeka)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ringkasan Ketentuan:
                </label>
                <textarea
                  rows={3}
                  value={formState.summary}
                  onChange={e => setFormState({ ...formState, summary: e.target.value })}
                  placeholder="Pokok perubahan atau pedoman utama yang diatur..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Sumber Resmi (JDIH / BAN-PDM):
                </label>
                <input
                  type="text"
                  value={formState.officialSource}
                  onChange={e => setFormState({ ...formState, officialSource: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
                />
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
                  Simpan Regulasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
