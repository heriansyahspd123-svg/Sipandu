import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Phone, 
  Mail, 
  Award, 
  Sparkles,
  Check
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    nip: currentUser.nip || '',
    title: currentUser.title || '',
    email: currentUser.email || '',
    phone: currentUser.phone || ''
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        nip: currentUser.nip || '',
        title: currentUser.title || '',
        email: currentUser.email || '',
        phone: currentUser.phone || ''
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    updateUserProfile({
      name: formData.name.trim(),
      nip: formData.nip.trim(),
      title: formData.title.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim()
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-900 via-slate-900 to-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 font-extrabold text-sm border border-white/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Ubah Nama & Profil Pengawas</h3>
              <p className="text-[11px] text-teal-200">Hak Akses: Pengawas Sekolah (Admin)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="p-3 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-900/40 text-teal-900 dark:text-teal-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Nama ini akan langsung tampil di seluruh dashboard, kop surat resmi, lembar asesmen 8 SNP, verifikasi bukti, dan tanda tangan digital laporan.
            </p>
          </div>

          {/* Nama Lengkap & Gelar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800 dark:text-slate-200 block">
                Nama Lengkap & Gelar Pembina: <span className="text-rose-500">*</span>
              </label>
            </div>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Heriansyah, S.Pd. atau Drs. H. Muhammad Yunus, M.Pd."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {/* Quick preset name pills */}
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-slate-400">Pilih Cepat:</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ 
                  ...prev, 
                  name: 'Heriansyah, S.Si., S.Pd., M.Pd',
                  email: 'heriansyah.spd123@gmail.com',
                  title: 'Pengawas Sekolah Pembina & Pengembang Sistem'
                }))}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-xs"
              >
                + Heriansyah, S.Si., S.Pd., M.Pd (Pengembang)
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, name: 'Drs. H. Muhammad Yunus, M.Pd.' }))}
                className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition"
              >
                + Drs. H. Muhammad Yunus, M.Pd.
              </button>
            </div>
          </div>

          {/* NIP */}
          <div>
            <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              NIP (Nomor Induk Pegawai):
            </label>
            <input
              type="text"
              value={formData.nip}
              onChange={e => setFormData({ ...formData, nip: e.target.value })}
              placeholder="19xxxxxxxx xxxxxx x xxx"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Jabatan / Gelar */}
          <div>
            <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
              Jabatan / Peran Pengawas:
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Pengawas Sekolah Madya / Pembina"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="text-slate-400">Pilihan:</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Pengawas Sekolah Pembina (Admin Mutu)' }))}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-600"
              >
                Pengawas Sekolah Pembina
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, title: 'Pengawas Ahli Madya Disdikbud' }))}
                className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-600"
              >
                Pengawas Ahli Madya
              </button>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Email Dinas:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="nama@sidrapkab.go.id"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                No. WhatsApp / HP:
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812xxxxxxxx"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Disdikbud Kab. Sidrap
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savedSuccess}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition active:scale-95"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <span>Simpan Perubahan</span>
                )}
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
