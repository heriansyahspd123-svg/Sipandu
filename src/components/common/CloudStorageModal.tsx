import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Cloud, 
  CheckCircle2, 
  RefreshCw, 
  Download, 
  Upload, 
  X, 
  ShieldCheck, 
  Laptop, 
  Smartphone, 
  Globe, 
  AlertCircle,
  FileJson,
  Copy,
  Check
} from 'lucide-react';

interface CloudStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudStorageModal: React.FC<CloudStorageModalProps> = ({ isOpen, onClose }) => {
  const { 
    cloudSyncStatus, 
    lastCloudSyncTime, 
    syncToCloudNow, 
    exportBackup, 
    importBackup,
    schools,
    indicators,
    evidences,
    actionPlans
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    const success = await syncToCloudNow();
    setIsSyncing(false);
    if (success) {
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 2500);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackup(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1500);
        } else {
          setImportStatus('error');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <Cloud className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Penyimpanan Cloud & Sinkronisasi Antar-Browser</span>
              </h3>
              <p className="text-xs text-teal-300/90">
                Data tersimpan di server cloud dan cache lokal perangkat Anda
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300">
          
          {/* Status Box */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white mt-0.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-emerald-950 dark:text-emerald-200">
                    Penyimpanan Cloud Aktif
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200">
                    {cloudSyncStatus === 'syncing' ? 'Sedang Menyimpan...' : 'Tersinkronisasi'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Setiap perubahan (asesmen, nama pengawas, bukti, profil sekolah, RTL) otomatis disimpan ke database server cloud dan dapat diakses saat membuka link di browser lain atau perangkat berbeda.
                </p>
                <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                  Sinkronisasi terakhir: <span className="font-bold text-slate-700 dark:text-slate-200">{lastCloudSyncTime}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyimpan...' : 'Sinkronkan'}</span>
            </button>
          </div>

          {syncSuccess && (
            <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-900 dark:text-teal-200 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>Seluruh data berhasil disinkronkan ke server cloud!</span>
            </div>
          )}

          {/* Cross-Browser Instructions */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Cara Membuka di Browser atau Perangkat Lain:</span>
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Laptop className="w-4 h-4 text-teal-600 mb-1" />
                <span className="font-bold text-slate-900 dark:text-white block">1. Laptop / Komputer</span>
                <span className="text-slate-500 text-[10px]">Chrome, Edge, Firefox, Safari</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Smartphone className="w-4 h-4 text-teal-600 mb-1" />
                <span className="font-bold text-slate-900 dark:text-white block">2. HP & Tablet</span>
                <span className="text-slate-500 text-[10px]">Tampilan otomatis menyesuaikan layar</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <ShieldCheck className="w-4 h-4 text-teal-600 mb-1" />
                <span className="font-bold text-slate-900 dark:text-white block">3. Tanpa Login Rumit</span>
                <span className="text-slate-500 text-[10px]">Data otomatis termuat dari cloud</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>
            </div>
          </div>

          {/* Backup & Restore Section */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <FileJson className="w-4 h-4 text-teal-600" />
              <span>Cadangan Mandiri (Ekspor / Impor JSON):</span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Anda juga dapat mengunduh seluruh data dalam bentuk file JSON sebagai arsip pribadi atau memulihkannya kapan saja:
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={exportBackup}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Cadangan Lengkap (.JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition"
              >
                <Upload className="w-4 h-4 text-teal-600" />
                <span>Pulihkan Data dari File (.JSON)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {importStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Database berhasil dipulihkan dari file! Memperbarui tampilan...</span>
              </div>
            )}
            {importStatus === 'error' && (
              <div className="p-3 rounded-xl bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>Gagal membaca file cadangan. Pastikan format file JSON valid.</span>
              </div>
            )}
          </div>

          {/* Database Summary Info */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Data Tersimpan: <strong>{schools.length}</strong> Sekolah • <strong>{indicators.length}</strong> Indikator • <strong>{evidences.length}</strong> Bukti Digital • <strong>{actionPlans.length}</strong> RTL</span>
            <span className="font-semibold text-teal-600">Disdikbud Sidrap</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
