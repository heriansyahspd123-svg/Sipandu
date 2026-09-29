import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from './Sidebar';
import { 
  LayoutDashboard, 
  Layers, 
  FolderArchive, 
  CheckSquare, 
  Award,
  Calendar
} from 'lucide-react';

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onSelectTab }) => {
  const { currentUser } = useApp();
  const role = currentUser.role;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 lg:hidden px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
            currentTab === 'dashboard' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Beranda</span>
        </button>

        {/* 8 SNP */}
        <button
          onClick={() => onSelectTab('snp')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
            currentTab === 'snp' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">8 SNP</span>
        </button>

        {/* Bank Bukti */}
        <button
          onClick={() => onSelectTab('bank_bukti')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
            currentTab === 'bank_bukti' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <FolderArchive className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Bukti</span>
        </button>

        {/* RTL / Tugas */}
        <button
          onClick={() => onSelectTab(role === 'guru' ? 'tugas' : 'rtl')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
            (currentTab === 'rtl' || currentTab === 'tugas') ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
          }`}
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{role === 'guru' ? 'Tugas' : 'RTL'}</span>
        </button>

        {/* Akreditasi or Kunjungan */}
        {role === 'pengawas' ? (
          <button
            onClick={() => onSelectTab('kunjungan')}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
              currentTab === 'kunjungan' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Kunjungan</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('akreditasi')}
            className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
              currentTab === 'akreditasi' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Akreditasi</span>
          </button>
        )}
      </div>
    </nav>
  );
};
