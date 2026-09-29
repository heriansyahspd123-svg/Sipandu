import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Building2, 
  Search, 
  Bell, 
  RotateCcw, 
  Menu, 
  ChevronDown, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  UserCheck, 
  Layers,
  Edit3,
  User,
  Cloud
} from 'lucide-react';

interface HeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenSchoolProfile: () => void;
  onOpenUserProfile: () => void;
  onOpenCloudStorage?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenSearch,
  onOpenNotifications,
  onOpenSchoolProfile,
  onOpenUserProfile,
  onOpenCloudStorage
}) => {
  const { 
    currentUser, 
    switchRole, 
    schools, 
    activeSchoolId, 
    setActiveSchoolId, 
    activeSchool, 
    notifications,
    cloudSyncStatus,
    resetAllData 
  } = useApp();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
    pengawas: { 
      label: 'Pengawas Sekolah (Admin)', 
      bg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800', 
      text: 'text-emerald-600',
      icon: <ShieldCheck className="w-3.5 h-3.5" /> 
    },
    kepala_sekolah: { 
      label: 'Kepala Sekolah', 
      bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800', 
      text: 'text-blue-600',
      icon: <GraduationCap className="w-3.5 h-3.5" /> 
    },
    guru: { 
      label: 'Guru / Pendidik', 
      bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800', 
      text: 'text-purple-600',
      icon: <BookOpen className="w-3.5 h-3.5" /> 
    },
    operator: { 
      label: 'Tenaga Kependidikan / Operator', 
      bg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800', 
      text: 'text-amber-600',
      icon: <Layers className="w-3.5 h-3.5" /> 
    },
    tim_mutu: { 
      label: 'Tim Pengembang Mutu (TPMPS)', 
      bg: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-800', 
      text: 'text-teal-600',
      icon: <CheckCircle2 className="w-3.5 h-3.5" /> 
    },
    komite: { 
      label: 'Komite Sekolah', 
      bg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700', 
      text: 'text-slate-600',
      icon: <UserCheck className="w-3.5 h-3.5" /> 
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setShowRoleDropdown(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            
            {/* Left: Mobile Menu Trigger + Brand Info */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition focus:outline-none cursor-pointer flex items-center gap-1.5 shadow-2xs"
                aria-label={isSidebarOpen ? "Tutup Sidebar Menu" : "Buka Sidebar Menu"}
                title={isSidebarOpen ? "Tutup Sidebar (Fokus Layar Penuh)" : "Buka Sidebar Menu"}
              >
                <Menu className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {isSidebarOpen ? 'Tutup Menu' : 'Menu'}
                </span>
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 font-extrabold text-sm tracking-tighter shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
                      SIPANDU
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 leading-none">
                      SIDRAP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block truncate max-w-[260px] font-medium leading-tight mt-0.5">
                    Sistem Pendampingan Mutu Sekolah
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Active School Selector */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSchoolDropdown(!showSchoolDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span className="truncate max-w-[220px] text-left">
                    {activeSchool?.name || 'Pilih Sekolah'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${activeSchool?.level === 'SD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {activeSchool?.level}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showSchoolDropdown && (
                  <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sekolah Binaan Sidrap</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {schools.map(school => (
                        <button
                          key={school.id}
                          onClick={() => {
                            setActiveSchoolId(school.id);
                            setShowSchoolDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50 dark:hover:bg-slate-800/80 transition ${
                            school.id === activeSchoolId ? 'bg-teal-50/60 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-semibold' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate font-medium">{school.name}</p>
                            <p className="text-[10px] text-slate-400">NPSN: {school.npsn} • {school.kecamatan}</p>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${school.level === 'SD' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                            {school.level}
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setShowSchoolDropdown(false);
                          onOpenSchoolProfile();
                        }}
                        className="w-full text-center py-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                      >
                        Lihat Detail Profil Sekolah
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Actions, Role Switcher, Notifications, PWA Install */}
            <div className="flex items-center gap-2">
              
              {/* Universal Search trigger */}
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-xs transition"
                title="Pencarian Cepat (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-slate-400">Cari...</span>
                <kbd className="hidden lg:inline text-[9px] px-1 bg-slate-200 dark:bg-slate-700 rounded text-slate-500 font-mono">⌘K</kbd>
              </button>

              {/* Notification Button */}
              <button
                type="button"
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* Cloud Sync Status Badge */}
              {onOpenCloudStorage && (
                <button
                  type="button"
                  onClick={onOpenCloudStorage}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-500/20 cursor-pointer"
                  title="Penyimpanan Cloud & Sinkronisasi Antar-Browser Aktif. Klik untuk opsi cadangan data."
                >
                  <span className={`w-2 h-2 rounded-full ${cloudSyncStatus === 'syncing' ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="hidden xl:inline text-[11px] font-bold">Cloud Sync Aktif</span>
                </button>
              )}

              {/* Quick Role Switcher (For demo and seamless multi-role testing) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition ${roleLabels[currentUser.role].bg}`}
                >
                  {roleLabels[currentUser.role].icon}
                  <span className="hidden md:inline truncate max-w-[130px]">
                    {currentUser.role === 'pengawas' ? 'Pengawas' : currentUser.role === 'kepala_sekolah' ? 'Kepsek' : currentUser.role === 'guru' ? 'Guru' : currentUser.role === 'operator' ? 'Operator' : currentUser.role === 'tim_mutu' ? 'Tim Mutu' : 'Komite'}
                  </span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {showRoleDropdown && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ganti Peran Pengguna (RBAC)</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Uji coba aplikasi dari 6 sudut pandang hak akses berbeda:</p>
                    </div>
                    <div className="space-y-1 py-1">
                      {(Object.keys(roleLabels) as UserRole[]).map(roleKey => (
                        <button
                          key={roleKey}
                          onClick={() => handleRoleSelect(roleKey)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition text-left ${
                            currentUser.role === roleKey 
                              ? 'bg-teal-50 dark:bg-slate-800 font-bold text-teal-700 dark:text-teal-300' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {roleLabels[roleKey].icon}
                            </span>
                            <div>
                              <p className="font-semibold leading-tight">{roleLabels[roleKey].label}</p>
                              <p className="text-[10px] text-slate-400">
                                {roleKey === 'pengawas' ? 'Admin kendali 20 sekolah' : roleKey === 'guru' ? 'Tugas & upload bukti' : roleKey === 'kepala_sekolah' ? 'Kondisi & pantau tim' : 'Akses terarah'}
                              </p>
                            </div>
                          </div>
                          {currentUser.role === roleKey && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setShowRoleDropdown(false);
                          onOpenUserProfile();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-teal-50 dark:bg-slate-800 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-teal-100 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Ubah Nama & Profil Saya</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct User Name & Edit Button */}
              <button
                type="button"
                onClick={onOpenUserProfile}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-500 text-xs font-semibold text-slate-800 dark:text-slate-100 transition shadow-2xs"
                title="Klik untuk ubah nama atau data profil Anda"
              >
                <div className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden xl:inline truncate max-w-[140px] font-bold">
                  {currentUser.name}
                </span>
                <Edit3 className="w-3 h-3 text-teal-600 opacity-80" />
              </button>

              {/* Reset Data Button for demo purposes */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Reset Data ke Default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset Semua Data?</h3>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tindakan ini akan mengembalikan data sekolah, 8 SNP, bukti, RTL, dan notifikasi kembali ke data awal PRD Kabupaten Sidrap.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
