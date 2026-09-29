import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  FileText, 
  Camera, 
  Link as LinkIcon, 
  Check, 
  Layers,
  Sparkles
} from 'lucide-react';

interface UploadEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultIndicatorId?: string;
  defaultStandardId?: number;
}

export const UploadEvidenceModal: React.FC<UploadEvidenceModalProps> = ({
  isOpen,
  onClose,
  defaultIndicatorId,
  defaultStandardId
}) => {
  const { 
    activeSchoolId, 
    standards, 
    indicators, 
    addEvidence, 
    currentUser 
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Perangkat Ajar & Modul');
  const [standardId, setStandardId] = useState<number>(defaultStandardId || 1);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(
    defaultIndicatorId ? [defaultIndicatorId] : []
  );
  const [uploadMode, setUploadMode] = useState<'file' | 'camera' | 'link'>('file');
  const [fileName, setFileName] = useState('Dokumen_Bukti_Mutu.pdf');
  const [fileType, setFileType] = useState<'pdf' | 'doc' | 'image' | 'sheet' | 'link'>('pdf');
  const [isSimulatingCamera, setIsSimulatingCamera] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'Perangkat Ajar & Modul',
    'Asesmen & Penilaian',
    'Dokumen Kurikulum',
    'Dokumentasi Foto/Kegiatan',
    'SK & Tata Kelola',
    'Sarana & Prasarana',
    'Perencanaan Sekolah',
    'Laporan Keuangan / BOS'
  ];

  const relevantIndicators = indicators.filter(i => i.standardId === standardId);

  const toggleIndicatorSelection = (id: string) => {
    setSelectedIndicators(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSimulateCameraCapture = () => {
    setIsSimulatingCamera(true);
    setTimeout(() => {
      setFileName(`Foto_Kegiatan_${Date.now()}.jpg`);
      setFileType('image');
      setIsSimulatingCamera(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      if (file.type.includes('pdf')) setFileType('pdf');
      else if (file.type.includes('image')) setFileType('image');
      else if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) setFileType('sheet');
      else setFileType('doc');
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvidence({
      schoolId: activeSchoolId,
      title: title.trim(),
      fileName: fileName || 'Dokumen_Bukti.pdf',
      fileType,
      fileSize: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
      fileUrl: '#',
      category,
      standardId,
      linkedIndicatorIds: selectedIndicators,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedRole: currentUser.role,
      status: 'menunggu_verifikasi'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-teal-300">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Unggah Bukti Digital</h3>
              <p className="text-[11px] text-teal-200">Bank Bukti Mutu Satuan Pendidikan</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Upload Method Chooser */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Metode Pengunggahan Bukti:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  uploadMode === 'file' 
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Pilih Berkas</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setUploadMode('camera');
                  handleSimulateCameraCapture();
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  uploadMode === 'camera' 
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Kamera HP</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('link')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  uploadMode === 'link' 
                    ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-700 dark:text-teal-300' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Tautan Drive</span>
              </button>
            </div>
          </div>

          {/* Upload Area / Dropzone */}
          {uploadMode === 'file' && (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:border-teal-500 transition cursor-pointer relative bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-teal-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                {fileName ? fileName : 'Pilih dokumen dari HP / Komputer'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Mendukung PDF, Word, Excel, JPG, PNG (Maks 25 MB)
              </p>
            </div>
          )}

          {uploadMode === 'camera' && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center">
              {isSimulatingCamera ? (
                <div className="py-4">
                  <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Menghubungkan kamera & mengambil gambar...</p>
                </div>
              ) : (
                <div>
                  <Camera className="w-8 h-8 text-teal-600 mx-auto mb-1" />
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Foto Berhasil Diambil</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{fileName}</p>
                  <button
                    type="button"
                    onClick={handleSimulateCameraCapture}
                    className="mt-2 text-xs font-semibold text-teal-600 hover:underline"
                  >
                    Ambil Ulang Foto
                  </button>
                </div>
              )}
            </div>
          )}

          {uploadMode === 'link' && (
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Tautan Google Drive / PMM:
              </label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                defaultValue="https://drive.google.com/drive/folders/sipandu-sidrap-sample"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs"
              />
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Nama / Judul Dokumen Bukti: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Contoh: Modul Ajar Matematika Diferensiasi Semester Ganjil"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Kategori Bukti:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Standar Utama (SNP):
              </label>
              <select
                value={standardId}
                onChange={e => {
                  const val = Number(e.target.value);
                  setStandardId(val);
                }}
                className="w-full px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white"
              >
                {standards.map(s => (
                  <option key={s.id} value={s.id}>SNP {s.id}: {s.shortName}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Multi-Indicator Linking ("Bukti Sekali, Manfaat Berkali-kali" PRD Section 45) */}
          <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Tautkan ke Indikator (“Bukti Sekali, Manfaat Berkali-kali”)</span>
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-400 font-bold">
                {selectedIndicators.length} Dipilih
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Satu berkas dapat digunakan sekaligus untuk beberapa indikator yang relevan:
            </p>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {relevantIndicators.map(ind => {
                const isChecked = selectedIndicators.includes(ind.id);
                return (
                  <div
                    key={ind.id}
                    onClick={() => toggleIndicatorSelection(ind.id)}
                    className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition border ${
                      isChecked 
                        ? 'bg-teal-600 text-white border-teal-600 font-semibold' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate pr-2">
                      [{ind.code}] {ind.title}
                    </span>
                    {isChecked ? (
                      <Check className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-[10px] text-slate-400">
            Pengunggah: {currentUser.name} ({currentUser.role})
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
            >
              Simpan & Unggah Bukti
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
