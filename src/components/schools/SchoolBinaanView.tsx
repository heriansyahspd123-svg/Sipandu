import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Filter,
  Trash2,
  Check,
  Edit3
} from 'lucide-react';

interface SchoolBinaanViewProps {
  onOpenProfile: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SchoolBinaanView: React.FC<SchoolBinaanViewProps> = ({
  onOpenProfile,
  onNavigateTab
}) => {
  const { 
    schools, 
    activeSchoolId, 
    setActiveSchoolId, 
    getSchoolMetrics,
    getAccreditationReadiness,
    deleteSchool,
    currentUser
  } = useApp();

  const [levelFilter, setLevelFilter] = useState<'ALL' | 'SD' | 'SMP'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [schoolToDelete, setSchoolToDelete] = useState<any | null>(null);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState<string | null>(null);

  const filteredSchools = schools.filter(school => {
    const matchLevel = levelFilter === 'ALL' || school.level === levelFilter;
    const matchSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        school.kecamatan.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        school.npsn.includes(searchQuery);
    return matchLevel && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Pusat Kendali Pengawas Pembina
              </span>
              <span className="text-xs text-slate-400">Wilayah Kabupaten Sidrap</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-2 text-white">
              Peta Sekolah Binaan
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Daftar 20 satuan pendidikan binaan (12 SD & 8 SMP). Pilih sekolah untuk melihat capaian 8 Standar Nasional, progres RTL, dan verifikasi bank bukti digital.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[90px]">
              <span className="text-[10px] text-teal-300 font-semibold block uppercase">SD Binaan</span>
              <span className="text-2xl font-black text-white">{schools.filter(s => s.level === 'SD').length}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-center min-w-[90px]">
              <span className="text-[10px] text-blue-300 font-semibold block uppercase">SMP Binaan</span>
              <span className="text-2xl font-black text-white">{schools.filter(s => s.level === 'SMP').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Success Alert Toast */}
      {deleteSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{deleteSuccessMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setDeleteSuccessMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 dark:hover:text-emerald-100 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama sekolah, kecamatan, atau NPSN..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <button
            onClick={() => setLevelFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              levelFilter === 'ALL'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua ({schools.length})
          </button>
          <button
            onClick={() => setLevelFilter('SD')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              levelFilter === 'SD'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            SD ({schools.filter(s => s.level === 'SD').length})
          </button>
          <button
            onClick={() => setLevelFilter('SMP')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              levelFilter === 'SMP'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            SMP ({schools.filter(s => s.level === 'SMP').length})
          </button>
        </div>
      </div>

      {/* Grid of Supervised Schools */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSchools.map(school => {
          const isSelected = school.id === activeSchoolId;
          const metrics = getSchoolMetrics(school.id);
          const readiness = getAccreditationReadiness(school.id);

          return (
            <div
              key={school.id}
              className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between bg-white dark:bg-slate-900 shadow-xs hover:shadow-md ${
                isSelected 
                  ? 'ring-2 ring-teal-500 border-teal-500 bg-teal-50/20 dark:bg-slate-800/80' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-teal-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                      school.level === 'SD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {school.level}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      STATUS {school.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      NPSN: {school.npsn}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                    <Award className="w-3 h-3 text-emerald-600" />
                    <span>Akreditasi {school.lastAccreditation} ({school.lastAccreditationYear || 2022})</span>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 mt-2.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {school.name}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSchoolId(school.id);
                      onOpenProfile();
                    }}
                    className="p-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-teal-400 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-slate-800 text-[10px] font-bold flex items-center gap-1 shrink-0 transition"
                    title={`Edit Status, Akreditasi, dan Profil ${school.name}`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between gap-1 mt-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1 truncate">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span className="truncate">
                      {school.address ? `${school.address}, ` : ''}Kec. {school.kecamatan}, {school.kabupaten}
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSchoolId(school.id);
                      onOpenProfile();
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 transition shrink-0"
                    title={`Edit Alamat & Profil ${school.name}`}
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Kesiapan</span>
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {readiness.score}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">RTL Selesai</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {metrics.rtlProgressPercent}%
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] text-slate-400 block">Murid</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {school.studentCount}
                    </span>
                  </div>
                </div>

                {metrics.overdueRtlCount > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-xl font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{metrics.overdueRtlCount} tindak lanjut melewati batas waktu</span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveSchoolId(school.id);
                    onNavigateTab('snp');
                  }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{isSelected ? 'Buka 8 SNP' : 'Kelola Satuan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setActiveSchoolId(school.id);
                    onOpenProfile();
                  }}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
                  title="Lihat & Edit Profil Sekolah Ini"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Edit Profil</span>
                </button>

                {/* Tombol Hapus Sekolah Binaan */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSchoolToDelete(school);
                  }}
                  className="p-2 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  title={`Hapus ${school.name} dari daftar binaan`}
                  aria-label="Hapus Sekolah"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Konfirmasi Hapus Sekolah Binaan */}
      {schoolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div 
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Hapus Sekolah Binaan?
            </h3>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Apakah Anda yakin ingin menghapus <strong className="text-slate-900 dark:text-white">{schoolToDelete.name}</strong> (NPSN: {schoolToDelete.npsn}) dari daftar sekolah binaan Anda?
            </p>

            <div className="mt-3.5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-[11px] text-rose-800 dark:text-rose-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>Satuan pendidikan ini tidak akan lagi muncul dalam pengawasan 8 SNP, Rapor Pendidikan, dan jadwal kunjungan pembinaan.</span>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSchoolToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetName = schoolToDelete.name;
                  deleteSchool(schoolToDelete.id);
                  setSchoolToDelete(null);
                  setDeleteSuccessMsg(`Sekolah "${targetName}" berhasil dihapus dari daftar binaan.`);
                  setTimeout(() => setDeleteSuccessMsg(null), 3500);
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
  );
};
