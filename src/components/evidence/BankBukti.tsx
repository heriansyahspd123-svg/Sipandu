import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Evidence, EvidenceStatus } from '../../types';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  Calendar, 
  ShieldCheck, 
  History, 
  Eye, 
  Trash2,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

interface BankBuktiProps {
  onOpenUpload: () => void;
}

export const BankBukti: React.FC<BankBuktiProps> = ({ onOpenUpload }) => {
  const { 
    evidences, 
    standards, 
    indicators, 
    activeSchool, 
    currentUser, 
    verifyEvidence, 
    deleteEvidence 
  } = useApp();

  const [selectedStandard, setSelectedStandard] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<EvidenceStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Verification / Detail Modal State
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<EvidenceStatus>('terverifikasi');
  const [verificationNotes, setVerificationNotes] = useState('');

  const canVerify = currentUser.role === 'pengawas';

  const statusBadges: Record<EvidenceStatus, { label: string; bg: string; icon: React.ReactNode }> = {
    terverifikasi: {
      label: 'Terverifikasi (Valid)',
      bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    perlu_perbaikan: {
      label: 'Perlu Diperbaiki',
      bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
    },
    tidak_sesuai: {
      label: 'Tidak Sesuai',
      bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
    },
    menunggu_verifikasi: {
      label: 'Menunggu Verifikasi',
      bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300',
      icon: <Clock className="w-3.5 h-3.5 text-blue-600" />
    },
    belum_ada: {
      label: 'Belum Ada',
      bg: 'bg-slate-100 text-slate-700',
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />
    }
  };

  const filteredEvidences = evidences.filter(ev => {
    // If not Pengawas, only show documents for their school (or current active school)
    const matchSchool = ev.schoolId === activeSchool.id;
    const matchStandard = selectedStandard === 'ALL' || ev.standardId === selectedStandard;
    const matchStatus = selectedStatus === 'ALL' || ev.status === selectedStatus;
    const matchSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        ev.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchStandard && matchStatus && matchSearch;
  });

  const handleOpenReview = (ev: Evidence) => {
    setSelectedEvidence(ev);
    setVerificationStatus(ev.status === 'menunggu_verifikasi' ? 'terverifikasi' : ev.status);
    setVerificationNotes(ev.verificationNotes || '');
  };

  const handleSaveVerification = () => {
    if (!selectedEvidence) return;
    verifyEvidence(selectedEvidence.id, verificationStatus, verificationNotes);
    setSelectedEvidence(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Pusat Repositori Digital Mutu
            </span>
            <span className="text-xs text-slate-400">
              {activeSchool.name}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Bank Bukti Digital
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Kumpulan seluruh dokumen otentik, foto sarpras, modul ajar, SK, dan instrumen asesmen. Menerapkan prinsip <em>“Bukti Sekali, Manfaat Berkali-kali”</em> untuk berbagai indikator 8 SNP.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 shrink-0 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Bukti Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari judul dokumen, berkas, atau kategori..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
            >
              <option value="ALL">Semua Status Bukti</option>
              <option value="terverifikasi">🟢 Terverifikasi (Valid)</option>
              <option value="menunggu_verifikasi">⚪ Menunggu Verifikasi</option>
              <option value="perlu_perbaikan">🟡 Perlu Perbaikan</option>
              <option value="tidak_sesuai">🔴 Tidak Sesuai</option>
            </select>
          </div>
        </div>

        {/* Standard tabs horizontal */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedStandard('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedStandard === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua Standar ({evidences.filter(e => e.schoolId === activeSchool.id).length})
          </button>
          {standards.map(s => {
            const count = evidences.filter(e => e.schoolId === activeSchool.id && e.standardId === s.id).length;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStandard(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedStandard === s.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                SNP {s.id} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvidences.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-400">
            <FolderArchive className="w-12 h-12 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tidak ada dokumen bukti yang sesuai kriteria.</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Unggah Bukti Baru" untuk menambahkan dokumen fisik atau digital.</p>
          </div>
        ) : (
          filteredEvidences.map(ev => {
            const linkedInds = indicators.filter(i => ev.linkedIndicatorIds?.includes(i.id));

            return (
              <div
                key={ev.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge: SNP & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      SNP {ev.standardId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${statusBadges[ev.status]?.bg || 'bg-slate-100'}`}>
                      {statusBadges[ev.status]?.icon}
                      <span>{statusBadges[ev.status]?.label}</span>
                    </span>
                  </div>

                  {/* Title & File meta */}
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-2.5 line-clamp-2">
                    {ev.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono uppercase text-[9px]">
                      {ev.fileType}
                    </span>
                    <span>{ev.fileSize}</span>
                    <span>• Versi {ev.version}</span>
                  </div>

                  {/* Multi-indicator tags */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Tertaut pada Indikator:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {linkedInds.length === 0 ? (
                        <span className="text-[11px] text-slate-400 italic">Umum</span>
                      ) : (
                        linkedInds.map(i => (
                          <span
                            key={i.id}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[200px]"
                            title={i.title}
                          >
                            [{i.code}] {i.title}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Reviewer / Verifier note snippet */}
                  {ev.verificationNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-800 dark:text-white block">Catatan Pengawas:</span>
                      <p className="line-clamp-2 mt-0.5 italic">“{ev.verificationNotes}”</p>
                    </div>
                  )}
                </div>

                {/* Footer action buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-400">
                    <p>{ev.uploadedByName}</p>
                    <p>{ev.uploadDate}</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {canVerify ? (
                      <button
                        onClick={() => handleOpenReview(ev)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenReview(ev)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Riwayat</span>
                      </button>
                    )}

                    {(currentUser.role === 'pengawas' || currentUser.role === 'kepala_sekolah') && (
                      <button
                        onClick={() => {
                          if (confirm(`Hapus dokumen "${ev.title}"?`)) {
                            deleteEvidence(ev.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Hapus Bukti"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Review / Verification Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                  Detail & Verifikasi Bukti Digital
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {selectedEvidence.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvidence(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              
              {/* Document Info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Berkas Fisik</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{selectedEvidence.fileName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ukuran & Format</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedEvidence.fileSize} ({selectedEvidence.fileType.toUpperCase()})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Pengunggah</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedEvidence.uploadedByName} ({selectedEvidence.uploadedRole})</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Unggah</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedEvidence.uploadDate}</p>
                </div>
              </div>

              {/* Pengawas Verification Form */}
              {canVerify ? (
                <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/40 space-y-3">
                  <h4 className="font-extrabold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Lembar Keputusan Verifikasi Pengawas</span>
                  </h4>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Status Hasil Verifikasi:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setVerificationStatus('terverifikasi')}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          verificationStatus === 'terverifikasi'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valid</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerificationStatus('perlu_perbaikan')}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          verificationStatus === 'perlu_perbaikan'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Perbaikan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setVerificationStatus('tidak_sesuai')}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition ${
                          verificationStatus === 'tidak_sesuai'
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Tidak Sesuai</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Catatan Pembimbingan Pengawas:
                    </label>
                    <textarea
                      rows={3}
                      value={verificationNotes}
                      onChange={e => setVerificationNotes(e.target.value)}
                      placeholder="Tuliskan umpan balik ramah dan instruksi perbaikan konkret..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                selectedEvidence.verificationNotes && (
                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200">
                    <span className="font-bold text-teal-900 dark:text-teal-300 block">Umpan Balik Pengawas:</span>
                    <p className="mt-1 italic">{selectedEvidence.verificationNotes}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Diverifikasi oleh: {selectedEvidence.verifiedBy || '-'} ({selectedEvidence.verifiedDate || '-'})</p>
                  </div>
                )
              )}

              {/* Version History / Audit */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Riwayat Aktivitas Dokumen</span>
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3 ml-2">
                  {selectedEvidence.history?.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-teal-500" />
                      <p className="font-semibold text-slate-800 dark:text-white">{h.action}</p>
                      <p className="text-[11px] text-slate-400">{h.user} • {h.date}</p>
                      {h.notes && <p className="text-[11px] text-slate-600 dark:text-slate-300 italic mt-0.5">“{h.notes}”</p>}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Tutup
              </button>
              {canVerify && (
                <button
                  type="button"
                  onClick={handleSaveVerification}
                  className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Simpan Hasil Verifikasi
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
