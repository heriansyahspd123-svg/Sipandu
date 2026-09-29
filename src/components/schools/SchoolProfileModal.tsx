import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  X, 
  MapPin, 
  UserCheck, 
  Users, 
  GraduationCap, 
  Award, 
  Calendar, 
  Check, 
  Edit3,
  BookOpen,
  Wifi,
  Sparkles,
  Trash2,
  AlertTriangle,
  ChevronRight,
  BarChart3
} from 'lucide-react';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  const { activeSchool, updateSchoolProfile, deleteSchool, currentUser, indicators } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingFacilities, setIsEditingFacilities] = useState(false);
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canEdit = currentUser.role === 'pengawas' || currentUser.role === 'kepala_sekolah' || currentUser.role === 'operator';

  const liveCurrentScore = indicators && indicators.length > 0
    ? Math.round((indicators.filter(i => i.status === 'baik').length / indicators.length) * 100)
    : 78;

  const [formData, setFormData] = useState({
    name: activeSchool?.name || '',
    npsn: activeSchool?.npsn || '',
    status: activeSchool?.status || 'Negeri',
    level: activeSchool?.level || 'SD',
    address: activeSchool?.address || 'Jl. Jenderal Sudirman No. 12, Pangkajene',
    kecamatan: activeSchool?.kecamatan || 'Maritengngae',
    kabupaten: activeSchool?.kabupaten || 'Sidenreng Rappang',
    principalName: activeSchool?.principalName || '',
    principalNip: activeSchool?.principalNip || '',
    studentCount: activeSchool?.studentCount || 0,
    teacherCount: activeSchool?.teacherCount || 0,
    staffCount: activeSchool?.staffCount || 0,
    rombelCount: activeSchool?.rombelCount || 0,
    lastAccreditation: activeSchool?.lastAccreditation || 'B',
    lastAccreditationYear: activeSchool?.lastAccreditationYear || 2022,
    specialNotes: activeSchool?.specialNotes || ''
  });

  const [identityForm, setIdentityForm] = useState({
    name: activeSchool?.name || '',
    npsn: activeSchool?.npsn || '',
    status: activeSchool?.status || 'Negeri',
    level: activeSchool?.level || 'SD',
    lastAccreditation: activeSchool?.lastAccreditation || 'B',
    lastAccreditationYear: activeSchool?.lastAccreditationYear || 2022
  });

  const [addressForm, setAddressForm] = useState({
    address: activeSchool?.address || 'Jl. Jenderal Sudirman No. 12, Pangkajene',
    kecamatan: activeSchool?.kecamatan || 'Maritengngae',
    kabupaten: activeSchool?.kabupaten || 'Sidenreng Rappang'
  });

  const [facilitiesForm, setFacilitiesForm] = useState({
    classrooms: activeSchool?.facilities.classrooms || 12,
    library: activeSchool?.facilities.library ?? true,
    uks: activeSchool?.facilities.uks ?? true,
    sanitasiBaik: activeSchool?.facilities.sanitasiBaik ?? true,
    internetAccess: activeSchool?.facilities.internetAccess ?? true,
    pojokBaca: activeSchool?.facilities.pojokBaca ?? true
  });

  const [historyForm, setHistoryForm] = useState(activeSchool?.qualityHistory || [
    { year: 'Tahun 2024', score: 58, stage: 'Asesmen Awal' },
    { year: 'Tahun 2025', score: 69, stage: 'Tahap RTL 1' },
    { year: 'Tahun 2026 (Kini)', score: 60, stage: 'Siap Akreditasi' }
  ]);

  React.useEffect(() => {
    if (activeSchool) {
      setFormData({
        name: activeSchool.name,
        npsn: activeSchool.npsn,
        status: activeSchool.status || 'Negeri',
        level: activeSchool.level || 'SD',
        address: activeSchool.address || 'Jl. Jenderal Sudirman No. 12, Pangkajene',
        kecamatan: activeSchool.kecamatan || 'Maritengngae',
        kabupaten: activeSchool.kabupaten || 'Sidenreng Rappang',
        principalName: activeSchool.principalName,
        principalNip: activeSchool.principalNip || '',
        studentCount: activeSchool.studentCount,
        teacherCount: activeSchool.teacherCount,
        staffCount: activeSchool.staffCount,
        rombelCount: activeSchool.rombelCount,
        lastAccreditation: activeSchool.lastAccreditation,
        lastAccreditationYear: activeSchool.lastAccreditationYear,
        specialNotes: activeSchool.specialNotes || ''
      });
      setIdentityForm({
        name: activeSchool.name,
        npsn: activeSchool.npsn,
        status: activeSchool.status || 'Negeri',
        level: activeSchool.level || 'SD',
        lastAccreditation: activeSchool.lastAccreditation || 'B',
        lastAccreditationYear: activeSchool.lastAccreditationYear || 2022
      });
      setAddressForm({
        address: activeSchool.address || 'Jl. Jenderal Sudirman No. 12, Pangkajene',
        kecamatan: activeSchool.kecamatan || 'Maritengngae',
        kabupaten: activeSchool.kabupaten || 'Sidenreng Rappang'
      });
      setFacilitiesForm({
        classrooms: activeSchool.facilities.classrooms || 12,
        library: activeSchool.facilities.library ?? true,
        uks: activeSchool.facilities.uks ?? true,
        sanitasiBaik: activeSchool.facilities.sanitasiBaik ?? true,
        internetAccess: activeSchool.facilities.internetAccess ?? true,
        pojokBaca: activeSchool.facilities.pojokBaca ?? true
      });
      setHistoryForm(activeSchool.qualityHistory || [
        { year: 'Tahun 2024', score: 58, stage: 'Asesmen Awal' },
        { year: 'Tahun 2025', score: 69, stage: 'Tahap RTL 1' },
        { year: 'Tahun 2026 (Kini)', score: 60, stage: 'Siap Akreditasi' }
      ]);
    }
  }, [activeSchool, isOpen, liveCurrentScore]);

  if (!isOpen || !activeSchool) return null;

  const handleSave = () => {
    updateSchoolProfile(activeSchool.id, formData);
    setIsEditing(false);
  };

  const handleSaveIdentity = () => {
    if (activeSchool) {
      updateSchoolProfile(activeSchool.id, {
        name: identityForm.name.trim(),
        npsn: identityForm.npsn.trim(),
        status: identityForm.status as any,
        level: identityForm.level as any,
        lastAccreditation: identityForm.lastAccreditation as any,
        lastAccreditationYear: Number(identityForm.lastAccreditationYear)
      });
      setIsEditingIdentity(false);
    }
  };

  const handleSaveFacilities = () => {
    if (activeSchool) {
      updateSchoolProfile(activeSchool.id, {
        facilities: {
          ...activeSchool.facilities,
          classrooms: Number(facilitiesForm.classrooms),
          library: facilitiesForm.library,
          uks: facilitiesForm.uks,
          sanitasiBaik: facilitiesForm.sanitasiBaik,
          internetAccess: facilitiesForm.internetAccess,
          pojokBaca: facilitiesForm.pojokBaca
        }
      });
      setIsEditingFacilities(false);
    }
  };

  const handleSaveHistory = () => {
    if (activeSchool) {
      updateSchoolProfile(activeSchool.id, {
        qualityHistory: historyForm
      });
      setIsEditingHistory(false);
    }
  };

  const handleSaveAddress = () => {
    if (activeSchool) {
      updateSchoolProfile(activeSchool.id, {
        address: addressForm.address.trim(),
        kecamatan: addressForm.kecamatan.trim(),
        kabupaten: addressForm.kabupaten.trim()
      });
      setIsEditingAddress(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Banner with school info */}
        <div className="relative bg-gradient-to-r from-teal-900 via-slate-900 to-teal-800 text-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-300 font-extrabold text-2xl shadow-inner shrink-0">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  activeSchool.level === 'SD' ? 'bg-amber-400 text-amber-950' : 'bg-blue-400 text-blue-950'
                }`}>
                  JENJANG {activeSchool.level}
                </span>

                {/* Badge STATUS NEGERI dengan Tombol Edit */}
                <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md text-[10px] border border-white/10">
                  <span className="font-semibold text-white">STATUS {activeSchool.status.toUpperCase()}</span>
                  {canEdit && !isEditingIdentity && (
                    <button
                      type="button"
                      onClick={() => setIsEditingIdentity(true)}
                      className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-teal-300 hover:text-white text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer"
                      title="Klik untuk Edit Status Sekolah (Negeri / Swasta)"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Status</span>
                    </button>
                  )}
                </div>

                {/* Badge AKREDITASI B (2022) dengan Tombol Edit */}
                <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                  <Award className="w-3 h-3 text-emerald-400" />
                  <span>AKREDITASI {activeSchool.lastAccreditation} ({activeSchool.lastAccreditationYear || 2022})</span>
                  {canEdit && !isEditingIdentity && (
                    <button
                      type="button"
                      onClick={() => setIsEditingIdentity(true)}
                      className="px-1.5 py-0.5 rounded bg-emerald-500/25 hover:bg-emerald-500/40 text-emerald-200 hover:text-white text-[10px] font-bold flex items-center gap-0.5 transition cursor-pointer border border-emerald-400/30"
                      title="Klik untuk Edit Peringkat Akreditasi & Tahun"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Edit Akreditasi</span>
                    </button>
                  )}
                </div>
              </div>

              {/* NAMA SEKOLAH dengan Tombol Edit */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {activeSchool.name}
                </h2>
                {canEdit && !isEditingIdentity && (
                  <button
                    type="button"
                    onClick={() => setIsEditingIdentity(true)}
                    className="px-2.5 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/35 text-teal-200 hover:text-white border border-teal-400/40 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                    title={`Edit Nama Sekolah, Status, dan Akreditasi ${activeSchool.name}`}
                  >
                    <Edit3 className="w-3 h-3 text-teal-300" />
                    <span>Edit Nama & Status</span>
                  </button>
                )}
              </div>

              {/* Jendela Cepat Edit Status, Akreditasi, dan Nama Sekolah */}
              {isEditingIdentity && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-900/95 border border-teal-400/50 backdrop-blur-md space-y-3 animate-in fade-in shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Edit Identitas: Nama Satdik, Status, dan Akreditasi</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsEditingIdentity(false)}
                      className="text-[10px] text-slate-400 hover:text-white transition"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Nama Satuan Pendidikan: *
                      </label>
                      <input
                        type="text"
                        value={identityForm.name}
                        onChange={e => setIdentityForm({ ...identityForm, name: e.target.value })}
                        placeholder="Contoh: UPT SDN 1 Amparita"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        NPSN: *
                      </label>
                      <input
                        type="text"
                        value={identityForm.npsn}
                        onChange={e => setIdentityForm({ ...identityForm, npsn: e.target.value })}
                        placeholder="40304245"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Status Sekolah:
                      </label>
                      <select
                        value={identityForm.status}
                        onChange={e => setIdentityForm({ ...identityForm, status: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="Negeri">Negeri</option>
                        <option value="Swasta">Swasta</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Jenjang:
                      </label>
                      <select
                        value={identityForm.level}
                        onChange={e => setIdentityForm({ ...identityForm, level: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Peringkat Akreditasi:
                      </label>
                      <select
                        value={identityForm.lastAccreditation}
                        onChange={e => setIdentityForm({ ...identityForm, lastAccreditation: e.target.value as any })}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      >
                        <option value="A">A (Unggul)</option>
                        <option value="B">B (Baik)</option>
                        <option value="C">C (Cukup)</option>
                        <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Tahun Akreditasi:
                      </label>
                      <input
                        type="number"
                        value={identityForm.lastAccreditationYear}
                        onChange={e => setIdentityForm({ ...identityForm, lastAccreditationYear: Number(e.target.value) })}
                        placeholder="2022"
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingIdentity(false)}
                      className="px-3 py-1 rounded-xl border border-white/20 text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveIdentity}
                      className="px-4 py-1 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Perubahan Identitas</span>
                    </button>
                  </div>
                </div>
              )}
              {/* Alamat Satuan Pendidikan & Tombol Edit Alamat */}
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="font-medium">
                    {activeSchool.address}, Kec. {activeSchool.kecamatan}, {activeSchool.kabupaten}
                  </span>
                </div>

                {canEdit && !isEditingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="px-2.5 py-1 rounded-xl bg-teal-500/20 hover:bg-teal-500/35 text-teal-200 hover:text-white border border-teal-400/40 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer shadow-xs active:scale-95"
                    title="Edit Alamat Sekolah (Jl. Jenderal Sudirman No. 12, Pangkajene)"
                  >
                    <Edit3 className="w-3 h-3 text-teal-300" />
                    <span>Edit Alamat</span>
                  </button>
                )}
              </div>

              {/* Jendela Cepat Edit Alamat */}
              {isEditingAddress && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-teal-400/50 backdrop-blur-md space-y-3 animate-in fade-in shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Edit Alamat & Wilayah Satuan Pendidikan</span>
                    </span>
                    <button 
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="text-[10px] text-slate-400 hover:text-white transition"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">
                        Alamat Lengkap / Jalan:
                      </label>
                      <input
                        type="text"
                        value={addressForm.address}
                        onChange={e => setAddressForm({ ...addressForm, address: e.target.value })}
                        placeholder="Contoh: Jl. Jenderal Sudirman No. 12, Pangkajene"
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-300 block mb-1">
                          Kecamatan:
                        </label>
                        <select
                          value={addressForm.kecamatan}
                          onChange={e => setAddressForm({ ...addressForm, kecamatan: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                          {['Maritengngae', 'Baranti', 'Panca Rijang', 'Watang Pulu', 'Tellu Limpoe', 'Dua Pitue', 'Pitu Riase', 'Pitu Riawa', 'Kulo', 'Watang Sidenreng', 'Panca Lautang'].map(k => (
                            <option key={k} value={k}>{k}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-300 block mb-1">
                          Kabupaten / Wilayah:
                        </label>
                        <input
                          type="text"
                          value={addressForm.kabupaten}
                          onChange={e => setAddressForm({ ...addressForm, kabupaten: e.target.value })}
                          placeholder="Kabupaten Sidenreng Rappang"
                          className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-white/20 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="px-3 py-1 rounded-xl border border-white/20 text-[11px] font-semibold text-slate-300 hover:bg-white/10 transition cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAddress}
                        className="px-4 py-1 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan Alamat</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Peserta Didik</span>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-teal-600" />
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={formData.studentCount}
                      onChange={e => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border text-sm"
                    />
                  ) : activeSchool.studentCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rombel</span>
              <div className="flex items-center gap-2 mt-1">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={formData.rombelCount}
                      onChange={e => setFormData({ ...formData, rombelCount: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border text-sm"
                    />
                  ) : activeSchool.rombelCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Guru & Pendidik</span>
              <div className="flex items-center gap-2 mt-1">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={formData.teacherCount}
                      onChange={e => setFormData({ ...formData, teacherCount: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border text-sm"
                    />
                  ) : activeSchool.teacherCount}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Tenaga Kependidikan</span>
              <div className="flex items-center gap-2 mt-1">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isEditing ? (
                    <input 
                      type="number" 
                      value={formData.staffCount}
                      onChange={e => setFormData({ ...formData, staffCount: Number(e.target.value) })}
                      className="w-16 px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border text-sm"
                    />
                  ) : activeSchool.staffCount}
                </span>
              </div>
            </div>
          </div>

          {/* Leaders & Supervisors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Kepala Satuan Pendidikan</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={e => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-slate-700 border text-xs"
                  />
                ) : activeSchool.principalName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                NIP: {activeSchool.principalNip || '-'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Pengawas Sekolah Pembina</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                {activeSchool.supervisorName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Disdikbud Kab. Sidenreng Rappang
              </p>
            </div>
          </div>

          {/* Sarana & Prasarana Utama */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Sarana & Prasarana Utama</span>
                </h3>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block mt-0.5">
                  Sumber: Dapodikdasmen Kemendikbudristek & Verifikasi Standar 5 Sarpras (8 SNP)
                </span>
              </div>

              {canEdit && !isEditingFacilities && (
                <button
                  type="button"
                  onClick={() => setIsEditingFacilities(true)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                  title="Edit Data Sarana & Prasarana"
                >
                  <Edit3 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Edit Sarpras</span>
                </button>
              )}
            </div>

            {/* Info Keterangan Asal Data */}
            <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 text-[11px] text-teal-900 dark:text-teal-200 leading-relaxed">
              <span className="font-bold">Asal Data: </span>
              Data sarana dan prasarana di atas bersumber dari data isian <strong>DAPODIK (Data Pokok Pendidikan) Kemendikbudristek</strong> satuan pendidikan yang telah diverifikasi secara faktual oleh Pengawas Pembina dan TPMPS mengacu pada <strong>Standar 5 Sarana dan Prasarana (Permendikbud No. 24 Tahun 2007)</strong>.
            </div>

            {/* Editor Inline Sarpras */}
            {isEditingFacilities ? (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-teal-400/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Edit Sarana & Prasarana Satuan Pendidikan</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingFacilities(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Jumlah Ruang Kelas Layak:
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={facilitiesForm.classrooms}
                      onChange={e => setFacilitiesForm({ ...facilitiesForm, classrooms: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={facilitiesForm.library}
                        onChange={e => setFacilitiesForm({ ...facilitiesForm, library: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Perpustakaan Sekolah (Tersedia)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={facilitiesForm.uks}
                        onChange={e => setFacilitiesForm({ ...facilitiesForm, uks: e.target.checked })}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span>Ruang UKS Terawat (Tersedia)</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facilitiesForm.sanitasiBaik}
                      onChange={e => setFacilitiesForm({ ...facilitiesForm, sanitasiBaik: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Sanitasi Toilet Layak</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facilitiesForm.internetAccess}
                      onChange={e => setFacilitiesForm({ ...facilitiesForm, internetAccess: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Akses Internet Tersedia</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={facilitiesForm.pojokBaca}
                      onChange={e => setFacilitiesForm({ ...facilitiesForm, pojokBaca: e.target.checked })}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Pojok Baca Kelas / Lab</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingFacilities(false)}
                    className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveFacilities}
                    className="px-4 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Sarpras</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSchool.facilities.classrooms} Ruang Kelas Layak</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Check className={`w-4 h-4 ${activeSchool.facilities.library ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Perpustakaan Sekolah</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Check className={`w-4 h-4 ${activeSchool.facilities.uks ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Ruang UKS Terawat</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Check className={`w-4 h-4 ${activeSchool.facilities.sanitasiBaik ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Sanitasi Toilet ({activeSchool.facilities.sanitasiBaik ? 'Layak' : 'Perlu Pemeliharaan'})</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <Wifi className={`w-4 h-4 ${activeSchool.facilities.internetAccess ? 'text-emerald-500' : 'text-rose-500'}`} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Akses Internet ({activeSchool.facilities.internetAccess ? 'Tersedia' : 'Terbatas'})</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeSchool.level === 'SD' ? 'Pojok Baca Kelas' : 'Lab Komputer/IPA'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tim Pengembang Sekolah (TPMPS) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Tim Penjaminan Mutu Pendidikan Satuan Pendidikan (TPMPS)
              </h3>
              {onNavigateTab && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab('tpmps');
                  }}
                  className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Menu Input TPMPS</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="space-y-2">
              {activeSchool.qualityTeam.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{member.name}</span>
                  </div>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">{member.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special notes */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Catatan Kondisi Khusus Satuan Pendidikan
            </h3>
            {isEditing ? (
              <textarea
                value={formData.specialNotes}
                onChange={e => setFormData({ ...formData, specialNotes: e.target.value })}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100"
              />
            ) : (
              <p className="text-xs text-slate-600 dark:text-slate-300 p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 leading-relaxed">
                {activeSchool.specialNotes || 'Tidak ada catatan khusus.'}
              </p>
            )}
          </div>

          {/* Histori Perkembangan Mutu Tahun ke Tahun */}
          <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Histori Capaian Mutu Satuan Pendidikan (2024 - 2026)</span>
                </h3>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold block mt-0.5">
                  Sumber: Rapor Pendidikan Kemendikbudristek, Evaluasi Diri Sekolah (EDS), Monev RTL, & 8 SNP SIPANDU
                </span>
              </div>

              {canEdit && !isEditingHistory && (
                <button
                  type="button"
                  onClick={() => setIsEditingHistory(true)}
                  className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                  title="Edit Data Histori Capaian Mutu"
                >
                  <Edit3 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                  <span>Edit Histori Mutu</span>
                </button>
              )}
            </div>

            {/* Kotak Penjelasan Rinci Asal & Sumber Data Termasuk Rapor Pendidikan */}
            <div className="p-3.5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 text-[11px] text-teal-900 dark:text-teal-200 space-y-2 leading-relaxed">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-bold flex items-center gap-1.5 text-xs text-teal-950 dark:text-teal-200">
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  <span>Asal & Sumber Data Capaian Mutu (Terintegrasi Rapor Pendidikan):</span>
                </p>
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateTab('rapor');
                    }}
                    className="text-[10px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center gap-1 cursor-pointer bg-white/70 dark:bg-teal-900/40 px-2 py-0.5 rounded-lg border border-teal-200 dark:border-teal-800"
                  >
                    <span>Buka Rapor Pendidikan & PBD</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li>
                  <strong>Tahun 2024 ({historyForm[0]?.score || 58}% Mutu — Asesmen Awal):</strong> Bersumber dari baseline pemetaan mutu awal dan instrumen <strong>Evaluasi Diri Sekolah (EDS) Siklus 1</strong> bersama Disdikbud Kabupaten Sidenreng Rappang sebelum intervensi, diperkuat dengan <strong>Rapor Pendidikan Kemendikbudristek Rilis Awal (Asesmen Nasional / ANBK)</strong> di mana capaian kompetensi literasi dan numerasi siswa masih dalam kategori Perlu Peningkatan.
                </li>
                <li>
                  <strong>Tahun 2025 ({historyForm[1]?.score || 69}% Mutu — Tahap RTL 1):</strong> Bersumber dari monev keterlaksanaan <strong>Rencana Tindak Lanjut (RTL) Tahap 1</strong>, workshop IHT kurikulum, pengumpulan bukti fisik awal, serta <strong>Capaian Peningkatan Indikator Prioritas Rapor Pendidikan</strong> (lonjakan skor literasi dan iklim pembelajaran yang lebih kondusif pasca PBD).
                </li>
                <li>
                  <strong>Tahun 2026 / Kini ({historyForm[2]?.score || 60}% Mutu — Siap Akreditasi):</strong> Bersumber dari <strong>Akumulasi Capaian Riil 8 Standar Nasional Pendidikan (SNP)</strong> yang aktif dan terverifikasi berkas otentiknya pada Bank Bukti Digital SIPANDU SEKOLAH diselaraskan dengan <strong>Data Rapor Pendidikan Mutakhir (Perencanaan Berbasis Data / PBD)</strong> menuju visitasi akreditasi BAN-PDM.
                </li>
              </ul>
            </div>

            {/* Editor Histori Mutu jika aktif */}
            {isEditingHistory ? (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-400/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Edit Histori Capaian Mutu Satuan Pendidikan</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingHistory(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    Batal
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {historyForm.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Periode / Tahun:</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={e => {
                            const updated = [...historyForm];
                            updated[idx].year = e.target.value;
                            setHistoryForm(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Capaian Mutu (%):</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.score}
                          onChange={e => {
                            const updated = [...historyForm];
                            updated[idx].score = Number(e.target.value);
                            setHistoryForm(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-1">Status / Tahap:</label>
                        <input
                          type="text"
                          value={item.stage}
                          onChange={e => {
                            const updated = [...historyForm];
                            updated[idx].stage = e.target.value;
                            setHistoryForm(updated);
                          }}
                          className="w-full px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingHistory(false)}
                    className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveHistory}
                    className="px-4 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Simpan Histori</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
                {historyForm.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl bg-white dark:bg-slate-900 border transition ${
                      idx === 2 
                        ? 'border-teal-400 dark:border-teal-600 ring-2 ring-teal-500/20 shadow-xs' 
                        : 'border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.year}</p>
                    <p className={`text-base font-black mt-1 ${
                      idx === 2 ? 'text-teal-600 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {item.score}% Mutu
                    </p>
                    <span className={`text-[10px] font-bold mt-1 inline-block px-2 py-0.5 rounded-md ${
                      idx === 0 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' 
                        : idx === 1 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    }`}>
                      {item.stage}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>NPSN Resmi Kemendikbudristek: {activeSchool.npsn}</span>
          </div>

          <div className="flex items-center gap-2">
            {canEdit && (
              isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                  >
                    Simpan Perubahan
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                    title="Hapus Satuan Pendidikan Binaan Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Sekolah</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profil</span>
                  </button>
                </div>
              )
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white text-xs font-semibold transition"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Modal Konfirmasi Hapus Sekolah */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
            <div 
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Hapus Sekolah Binaan Ini?
              </h3>
              
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus <strong className="text-slate-900 dark:text-white">{activeSchool?.name}</strong> (NPSN: {activeSchool?.npsn}) dari daftar binaan?
              </p>

              <div className="mt-3.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>Sekolah ini tidak akan lagi muncul dalam pengawasan 8 SNP, Rapor Pendidikan, dan jadwal kunjungan pembinaan.</span>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (activeSchool) {
                      deleteSchool(activeSchool.id);
                      setShowDeleteConfirm(false);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Hapus Sekolah</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
