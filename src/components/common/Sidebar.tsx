import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Building2, 
  FileText, 
  BarChart3, 
  Layers, 
  CheckSquare, 
  Calendar, 
  Award, 
  BookOpen, 
  FolderArchive, 
  History, 
  Activity, 
  X,
  Sparkles,
  Edit3,
  Cloud,
  Users,
  PanelLeftClose,
  Network
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'sekolah'
  | 'tpmps'
  | 'snp'
  | 'benang_merah'
  | 'rapor'
  | 'rtl'
  | 'tugas'
  | 'bank_bukti'
  | 'monitoring'
  | 'kunjungan'
  | 'akreditasi'
  | 'laporan'
  | 'regulasi'
  | 'audit';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenUserProfile?: () => void;
  onOpenCloudStorage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onOpenUserProfile,
  onOpenCloudStorage
}) => {
  const { currentUser, activeSchool } = useApp();
  const role = currentUser.role;

  // Build navigation items based on Role-Based Access Control (RBAC) from PRD
  const getNavItems = () => {
    const items: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [];

    // Dashboard - for everyone (customized per role)
    items.push({
      id: 'dashboard',
      label: role === 'pengawas' ? 'Dashboard Pengawas' : role === 'guru' ? 'Dashboard Guru' : 'Dashboard Sekolah',
      icon: <LayoutDashboard className="w-4 h-4" />
    });

    // Sekolah Binaan / Profil Sekolah
    if (role === 'pengawas') {
      items.push({
        id: 'sekolah',
        label: 'Peta Sekolah Binaan',
        icon: <Building2 className="w-4 h-4" />,
        badge: '20'
      });
    } else {
      items.push({
        id: 'sekolah',
        label: 'Profil Sekolah',
        icon: <Building2 className="w-4 h-4" />
      });
    }

    // Tim Mutu (TPMPS) - Sistem Penjaminan Mutu Internal
    items.push({
      id: 'tpmps',
      label: 'Tim Mutu (TPMPS)',
      icon: <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />,
      badge: 'SPMI'
    });

    // 8 SNP (Pengawas, Kepsek, Tim Mutu, Guru, Komite)
    items.push({
      id: 'snp',
      label: '8 Standar (SNP)',
      icon: <Layers className="w-4 h-4" />
    });

    // Benang Merah IA2024 & 8 SNP (Kepmendikbudristek No. 246/O/2024)
    items.push({
      id: 'benang_merah',
      label: 'Benang Merah IA2024 & 8 SNP',
      icon: <Network className="w-4 h-4 text-teal-400" />,
      badge: 'IA2024'
    });

    // Rapor Pendidikan
    items.push({
      id: 'rapor',
      label: 'Rapor Pendidikan',
      icon: <BarChart3 className="w-4 h-4" />
    });

    // Program & RTL
    items.push({
      id: 'rtl',
      label: 'Program & RTL',
      icon: <CheckSquare className="w-4 h-4" />
    });

    // Tugas Tim / Tugas Saya (for Guru and Kepsek)
    if (role === 'guru') {
      items.push({
        id: 'tugas',
        label: 'Tugas Saya',
        icon: <CheckSquare className="w-4 h-4 text-purple-500" />,
        badge: 'Prioritas'
      });
    } else if (role === 'kepala_sekolah' || role === 'tim_mutu') {
      items.push({
        id: 'tugas',
        label: 'Pembagian Tugas (PIC)',
        icon: <CheckSquare className="w-4 h-4" />
      });
    }

    // Bank Bukti Digital (Core Feature)
    items.push({
      id: 'bank_bukti',
      label: 'Bank Bukti Digital',
      icon: <FolderArchive className="w-4 h-4" />
    });

    // Monitoring Mutu
    if (role !== 'komite') {
      items.push({
        id: 'monitoring',
        label: 'Monitoring Mutu',
        icon: <Activity className="w-4 h-4" />
      });
    }

    // Kunjungan Pengawas (Pengawas & Kepsek)
    if (role === 'pengawas' || role === 'kepala_sekolah' || role === 'tim_mutu') {
      items.push({
        id: 'kunjungan',
        label: role === 'pengawas' ? 'Kunjungan & Pembinaan' : 'Riwayat Pembinaan',
        icon: <Calendar className="w-4 h-4" />
      });
    }

    // Simulasi Kesiapan Akreditasi
    items.push({
      id: 'akreditasi',
      label: 'Kesiapan Akreditasi',
      icon: <Award className="w-4 h-4" />
    });

    // Laporan Otomatis
    items.push({
      id: 'laporan',
      label: 'Pelaporan Otomatis',
      icon: <FileText className="w-4 h-4" />
    });

    // Master Regulasi (Pengawas / Admin utama)
    if (role === 'pengawas') {
      items.push({
        id: 'regulasi',
        label: 'Master Regulasi',
        icon: <BookOpen className="w-4 h-4" />
      });
    }

    // Audit Trail
    if (role === 'pengawas' || role === 'kepala_sekolah') {
      items.push({
        id: 'audit',
        label: 'Audit Trail',
        icon: <History className="w-4 h-4" />
      });
    }

    return items;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand & close button */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 font-extrabold text-sm shadow-md">
              SP
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wide text-white">SIPANDU SEKOLAH</h1>
              <p className="text-[10px] text-teal-400 font-medium">Kab. Sidrap - Sulsel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex items-center gap-1.5 group"
            title="Tutup / Sembunyikan Sidebar"
            aria-label="Tutup Sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-300 group-hover:text-white hidden sm:inline">
              Tutup
            </span>
          </button>
        </div>

        {/* Current Active Context Info */}
        <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {role === 'pengawas' ? 'Fokus Wilayah' : 'Satuan Pendidikan'}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-900/60 text-teal-300 font-semibold">
              {activeSchool?.level}
            </span>
          </div>
          <p className="text-xs font-semibold text-white truncate mt-1">
            {activeSchool?.name}
          </p>
          <p className="text-[10px] text-slate-400 truncate">
            {activeSchool?.kecamatan} • NPSN: {activeSchool?.npsn}
          </p>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold shadow-md shadow-teal-900/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-teal-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile Card & Direct Edit Name Button */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-teal-400 font-medium truncate">
                  {currentUser.role === 'pengawas' ? 'Pengawas Sekolah (Admin)' : currentUser.role}
                </p>
              </div>
            </div>
            {onOpenUserProfile && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenUserProfile();
                }}
                className="p-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 text-teal-300 hover:text-white border border-teal-700/60 transition shrink-0 cursor-pointer"
                title="Edit Nama Pengawas / Data Profil"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {onOpenUserProfile && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUserProfile();
              }}
              className="mt-2 w-full py-1.5 px-2.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 hover:text-white border border-teal-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-teal-400" />
              <span>Edit Nama / Profil Pengawas</span>
            </button>
          )}

          {onOpenCloudStorage && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCloudStorage();
              }}
              className="mt-1.5 w-full py-1.5 px-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Cloud className="w-3 h-3 text-emerald-400" />
              <span>Penyimpanan Cloud & Backup</span>
            </button>
          )}
        </div>

        {/* Tagline & Developer Credits footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-2">
          <div className="flex items-start gap-2 text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[10px] leading-tight text-slate-300 italic">
              “Dampingi Mutunya, Tingkatkan Sekolahnya.”
            </p>
          </div>

          {/* Pengembang Sistem Attribution */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
              <span className="font-semibold text-slate-300">Pengembang Sistem:</span>
            </div>
            <p className="text-[11px] font-extrabold text-teal-300 mt-0.5 truncate tracking-tight">
              Heriansyah, S.Si., S.Pd., M.Pd
            </p>
            <p className="text-[9px] text-slate-400">
              Disdikbud Kab. Sidenreng Rappang
            </p>
          </div>

          <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-500">
            <span>Versi 1.0 — Sidrap 2026</span>
            <span className="text-teal-400 font-semibold">SIPANDU SEKOLAH</span>
          </div>
        </div>
      </aside>
    </>
  );
};
