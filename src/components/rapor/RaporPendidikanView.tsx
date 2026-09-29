import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RaporItem } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Lightbulb, 
  PlusCircle,
  HelpCircle,
  X
} from 'lucide-react';

interface RaporPendidikanViewProps {
  onNavigateTab: (tab: string) => void;
}

export const RaporPendidikanView: React.FC<RaporPendidikanViewProps> = ({ onNavigateTab }) => {
  const { 
    raporItems, 
    activeSchool, 
    convertRaporToRTL, 
    standards 
  } = useApp();

  const [selectedRapor, setSelectedRapor] = useState<RaporItem | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const schoolRapor = raporItems.filter(r => r.schoolId === activeSchool.id);

  const handleConvertToProgram = (r: RaporItem) => {
    convertRaporToRTL(r.id);
    setSuccessBanner(`Program perbaikan untuk ${r.domain} berhasil dibuat dan ditambahkan ke modul Program & RTL!`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const getScoreColor = (category: string) => {
    switch (category) {
      case 'Mahir': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Cakap': return 'text-blue-600 bg-blue-100 dark:bg-blue-950 dark:text-blue-300';
      case 'Mencapai Minimum': return 'text-amber-600 bg-amber-100 dark:bg-amber-950 dark:text-amber-300';
      default: return 'text-rose-600 bg-rose-100 dark:bg-rose-950 dark:text-rose-300';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                Data Rapor Pendidikan Kemendikbudristek
              </span>
              <span className="text-xs text-slate-400">
                {activeSchool.name} • Tahun 2026
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Analisis Rapor Pendidikan & Perencanaan Berbasis Data (PBD)
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Prinsip utama: Bukan sekadar melihat angka, tetapi memahami <em>masalah riil apa yang dihadapi murid</em>, menelusuri <em>akar masalahnya</em>, dan mengubahnya menjadi <em>program nyata di RTL</em>.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0 text-center">
            <span className="text-[10px] text-indigo-200 font-semibold block uppercase">Prioritas Utama</span>
            <span className="text-xl font-black text-amber-300">
              {schoolRapor.filter(r => r.isPriority).length} Indikator
            </span>
          </div>
        </div>
      </div>

      {/* Card Keterangan Asal & Sumber Data Rapor Pendidikan */}
      <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 text-xs text-indigo-950 dark:text-indigo-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Asal & Sumber Resmi Data Rapor Pendidikan
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-200/70 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200">
            Pusmendik & BSKAP Kemendikbudristek
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-700 dark:text-slate-300">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block">1. Asesmen Nasional (ANBK) - Siswa</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mengukur <strong>A.1 (Kemampuan Literasi)</strong> dan <strong>A.2 (Kemampuan Numerasi)</strong> melalui tes AKM komputer, serta <strong>A.3 (Karakter)</strong> melalui Survei Karakter murid sampel kelas 5 SD / 8 SMP.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block">2. Survei Lingkungan Belajar (Sulingjar)</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Diisi mandiri oleh <strong>Kepala Sekolah dan Seluruh Guru</strong> untuk memotret <strong>D.1 (Kualitas Pembelajaran)</strong>, <strong>D.4 (Iklim Keamanan)</strong>, dan <strong>D.8 (Iklim Kebinekaan)</strong>.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-300 block">3. Unduhan Resmi Portal Rapor PBD</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Data terintegrasi dari unduhan resmi portal <strong>raporpendidikan.kemdikbud.go.id</strong> dan dihubungkan ke indikator 8 SNP serta otomatis dikonversi ke Rencana Tindak Lanjut (RTL).
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => onNavigateTab('rtl')}
            className="text-xs underline hover:text-emerald-700 ml-3 shrink-0"
          >
            Lihat di RTL →
          </button>
        </div>
      )}

      {/* Cards List: Not just numbers, but "Masalah -> Akar Masalah -> Aksi" */}
      <div className="space-y-4">
        {schoolRapor.map(item => {
          const linkedStandards = standards.filter(s => item.linkedStandardIds.includes(s.id));

          return (
            <div
              key={item.id}
              className={`rounded-3xl p-5 sm:p-6 border transition bg-white dark:bg-slate-900 shadow-xs ${
                item.isPriority 
                  ? 'border-amber-400/80 ring-2 ring-amber-400/20 bg-amber-50/10' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header row: Code, Domain, Score, Delta, Priority badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-black text-sm shrink-0 border border-indigo-200">
                    {item.code}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {item.domain}
                      </h3>
                      {item.isPriority && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Perhatian Utama</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Status Capaian: <strong className="text-slate-700 dark:text-slate-200">{item.category}</strong>
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {item.code.startsWith('A.1') || item.code.startsWith('A.2') 
                          ? 'Instrumen: AKM Siswa (ANBK)' 
                          : item.code.startsWith('A.3')
                          ? 'Instrumen: Survei Karakter Siswa'
                          : 'Instrumen: Sulingjar (Guru & KS)'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Score & Delta pill */}
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900 dark:text-white leading-none block">
                        {item.score}
                      </span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>

                    <div className={`p-1.5 rounded-xl flex items-center gap-1 text-[11px] font-bold ${
                      item.delta >= 0 ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40' : 'text-rose-700 bg-rose-50 dark:bg-rose-950/40'
                    }`}>
                      {item.delta >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      <span>{item.delta > 0 ? `+${item.delta}` : item.delta}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Step Diagnosis Grid: Masalah -> Akar Masalah -> Solusi Operasional */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Masalah Teridentifikasi */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    1. Masalah yang Teridentifikasi
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {item.identifiedProblem}
                  </p>
                </div>

                {/* 2. Akar Masalah */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider block mb-1">
                    2. Analisis Akar Masalah (Mengapa Terjadi?)
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                    {item.rootCause}
                  </p>
                </div>

                {/* 3. Program Rekomendasi */}
                <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/50 dark:border-teal-900/30">
                  <span className="text-[10px] font-bold text-teal-800 dark:text-teal-400 uppercase tracking-wider block mb-1">
                    3. Rekomendasi Program Nyata
                  </span>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {item.recommendedProgram}
                  </p>
                </div>
              </div>

              {/* Link to 8 SNP & Convert to RTL CTA */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Terkait SNP:</span>
                  <div className="flex gap-1.5">
                    {linkedStandards.map(s => (
                      <span
                        key={s.id}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        Standar {s.id} ({s.shortName})
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                    item.status === 'Tercapai' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'Dalam Pelaksanaan' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    Status: {item.status}
                  </span>

                  <button
                    onClick={() => handleConvertToProgram(item)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Jadikan Program RTL</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
