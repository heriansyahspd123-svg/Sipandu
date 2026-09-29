import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IA2024Item } from '../../types';
import { IA2024_COMPONENT_INFO } from '../../data/ia2024Data';
import { 
  Network, 
  Award, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  FileText, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Search, 
  Save, 
  RotateCcw, 
  FolderArchive, 
  BarChart3, 
  ArrowRight,
  HelpCircle,
  Eye,
  Check,
  Building2,
  Printer
} from 'lucide-react';

interface BenangMerahIA2024ViewProps {
  onNavigateTab: (tab: string, meta?: any) => void;
}

export const BenangMerahIA2024View: React.FC<BenangMerahIA2024ViewProps> = ({ onNavigateTab }) => {
  const { 
    activeSchool, 
    ia2024Items, 
    updateIA2024Item, 
    resetIA2024Items, 
    standards, 
    evidences,
    raporItems 
  } = useApp();

  const [selectedComponentFilter, setSelectedComponentFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEditingId, setActiveEditingId] = useState<number | null>(null);
  const [editReflectionText, setEditReflectionText] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter items
  const filteredItems = ia2024Items.filter(item => {
    const matchComp = selectedComponentFilter === 'all' || item.componentId === selectedComponentFilter;
    const matchSearch = 
      item.statement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manifestationInAction.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.linkedStandardNames.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchComp && matchSearch;
  });

  // Calculate statistics
  const totalItems = ia2024Items.length;
  const level4Count = ia2024Items.filter(i => i.currentLevel === 4).length;
  const level3Count = ia2024Items.filter(i => i.currentLevel === 3).length;
  const level2Count = ia2024Items.filter(i => i.currentLevel === 2).length;
  const level1Count = ia2024Items.filter(i => i.currentLevel === 1).length;
  const averageLevel = (ia2024Items.reduce((acc, curr) => acc + curr.currentLevel, 0) / totalItems).toFixed(1);

  // Rapor Pendidikan data for Component 4
  const schoolRapor = raporItems.filter(r => r.schoolId === activeSchool.id);

  // Handle saving reflection edit
  const handleStartEdit = (item: IA2024Item) => {
    setActiveEditingId(item.id);
    setEditReflectionText(item.schoolReflection || '');
  };

  const handleSaveReflection = (itemId: number) => {
    updateIA2024Item(itemId, { schoolReflection: editReflectionText });
    setActiveEditingId(null);
    setSuccessToast(`Catatan refleksi kinerja Butir ${itemId} berhasil disimpan!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleLevelChange = (itemId: number, newLevel: 1 | 2 | 3 | 4) => {
    updateIA2024Item(itemId, { currentLevel: newLevel });
    setSuccessToast(`Level capaian Butir ${itemId} diperbarui menjadi Level ${newLevel}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-extrabold flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5" />
                <span>Instrumen IA2024 Terbaru</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 text-[11px] font-semibold">
                Kepmendikbudristek No. 246/O/2024
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 text-[11px] font-semibold">
                Permendikdasmen No. 14/2026 (BSANP)
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Benang Merah IA2024 & 8 Standar Nasional Pendidikan (SNP)
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Transformasi paradigma dari <strong>Kepatuhan Administratif (*Compliance*)</strong> menuju <strong>Kinerja Nyata & Substansi (*Performance*)</strong>. Asesor BAN-PDM/BSANP menilai bagaimana 8 SNP berfungsi nyata meningkatkan mutu pembelajaran di <strong>{activeSchool.name}</strong> melalui triangulasi data lapangan.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Ekspor Matriks IA2024</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('akreditasi')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Buka Simulasi Akreditasi</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('bank_bukti')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <FolderArchive className="w-4 h-4 text-emerald-400" />
                <span>Tinjau Bank Bukti Digital</span>
              </button>
            </div>
          </div>

          {/* Quick Score Card */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-700/80 flex flex-col justify-between shrink-0 lg:w-72 text-center">
            <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider">
              Rerata Level Kinerja Nyata
            </span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {averageLevel}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ 4.0</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] pt-2 border-t border-slate-700">
              <div className="p-1 rounded bg-emerald-950/60 text-emerald-300">
                <span className="block font-bold">{level4Count}</span>
                <span className="text-[9px]">L4</span>
              </div>
              <div className="p-1 rounded bg-blue-950/60 text-blue-300">
                <span className="block font-bold">{level3Count}</span>
                <span className="text-[9px]">L3</span>
              </div>
              <div className="p-1 rounded bg-amber-950/60 text-amber-300">
                <span className="block font-bold">{level2Count}</span>
                <span className="text-[9px]">L2</span>
              </div>
              <div className="p-1 rounded bg-rose-950/60 text-rose-300">
                <span className="block font-bold">{level1Count}</span>
                <span className="text-[9px]">L1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paradigm Shift Visual Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Pergeseran Paradigma: Kepatuhan Dokumen (Lama) vs. Kinerja Nyata (IA2024)
            </h2>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
            Fokus Utama Asesor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Old Compliance */}
          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Paradigma Lama (Compliance / Administratif)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Sekolah dinilai dari <strong>kelengkapan tumpukan berkas dokumen fisik</strong> di dalam lemari dan map (RPP tebal berlembar-lembar, SK kepanitiaan, cap stempel, dan buku portofolio). <em>Kelemahan:</em> Dokumen sering kali hanya formalitas tanpa dipraktikkan nyata di kelas.
            </p>
          </div>

          {/* New Performance */}
          <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/40 space-y-2">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold uppercase text-[11px]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Paradigma Baru IA2024 (Performance / Kinerja Nyata)</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Asesor menguji <strong>apakah 8 SNP benar-benar hidup dan berdampak nyata bagi murid</strong> menggunakan metode <strong>Triangulasi Data</strong>: observasi interaksi di kelas, wawancara mendalam murid/guru/orang tua, dan verifikasi bukti digital di SIPANDU SEKOLAH.
            </p>
          </div>
        </div>

        {/* 4 Komponen IA2024 Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
          {IA2024_COMPONENT_INFO.map(comp => (
            <div 
              key={comp.id}
              onClick={() => setSelectedComponentFilter(comp.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedComponentFilter === comp.id
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 shadow-md ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {comp.itemRange}
                </span>
                <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400">
                  Komponen {comp.id}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {comp.title}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {comp.integratedSNP.join(' • ')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Component Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedComponentFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedComponentFilter === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Semua (14 Butir Inti)
          </button>
          {[1, 2, 3, 4].map(id => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedComponentFilter(id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedComponentFilter === id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Komp {id}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari butir, 8 SNP, atau kinerja..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Component 4 Special Banner (when selected or all) */}
      {(selectedComponentFilter === 'all' || selectedComponentFilter === 4) && (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-50 via-slate-50 to-indigo-50 dark:from-purple-950/40 dark:via-slate-900 dark:to-indigo-950/30 border border-purple-200 dark:border-purple-900/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200 uppercase">
                  Komponen 4: Hasil Belajar Lulusan (ESP)
                </span>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  Ditarik Otomatis dari Asesmen Nasional (AN) & Rapor Pendidikan
                </h3>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('rapor')}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Buka Data Rapor Pendidikan ({schoolRapor.length} Indikator)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Benang Merah SNP:</strong> Mengintegrasikan <strong>Standar 1 (Standar Kompetensi Lulusan - SKL)</strong>. Aspek ini tidak dinilai melalui observasi asesor di kelas, melainkan ditarik langsung dari <em>Evaluasi Sistem Pendidikan (ESP)</em> Kemendikbudristek berdasarkan data capaian Asesmen Nasional (ANBK) satuan pendidikan.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {schoolRapor.slice(0, 4).map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs">
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block">{item.code} - {item.domain}</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-base font-black text-slate-800 dark:text-white">{item.score}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.category === 'Mahir' ? 'bg-emerald-100 text-emerald-800' :
                    item.category === 'Cakap' ? 'bg-blue-100 text-blue-800' :
                    item.category === 'Mencapai Minimum' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 14 Core Items Card List */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          const isEditing = activeEditingId === item.id;
          
          return (
            <div 
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-300 dark:hover:border-teal-700/60 transition-all space-y-4"
            >
              {/* Header Butir */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {item.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-teal-700 dark:text-teal-400">
                        {item.code}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        • {item.componentTitle}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {item.statement}
                    </h3>
                  </div>
                </div>

                {/* Level Selector */}
                <div className="flex items-center gap-1 shrink-0 self-start sm:self-auto bg-slate-50 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] font-bold text-slate-400 px-2">Level Kinerja:</span>
                  {[1, 2, 3, 4].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelChange(item.id, lvl as 1 | 2 | 3 | 4)}
                      className={`w-7 h-7 rounded-xl text-xs font-black transition cursor-pointer ${
                        item.currentLevel === lvl
                          ? lvl === 4 ? 'bg-emerald-600 text-white shadow-xs' :
                            lvl === 3 ? 'bg-teal-600 text-white shadow-xs' :
                            lvl === 2 ? 'bg-amber-600 text-white shadow-xs' :
                            'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                      title={`Pilih Level ${lvl}`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benang Merah Grid: Integrasi 8 SNP & Kinerja Nyata */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                
                {/* Integrasi 8 SNP */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Integrasi 8 Standar Nasional (SNP)</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.linkedStandardNames.map((stdName, idx) => {
                      const stdId = item.linkedStandardIds[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onNavigateTab('snp')}
                          className="px-2 py-0.5 rounded-lg bg-indigo-200/60 dark:bg-indigo-900/60 text-indigo-900 dark:text-indigo-200 text-[10px] font-bold hover:bg-indigo-300 transition cursor-pointer"
                          title="Klik untuk membuka modul 8 Standar"
                        >
                          Standar {stdId}: {stdName}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    {item.focusExplanation}
                  </p>
                </div>

                {/* Kinerja Nyata yang Dilihat Asesor */}
                <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Kinerja Nyata di Lapangan</span>
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.manifestationInAction}
                  </p>
                </div>

                {/* Metode Triangulasi Asesor */}
                <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>Metode Triangulasi Asesor</span>
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.triangulationMethod}
                  </p>
                </div>

              </div>

              {/* Interactive School Reflection Input Area */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>Catatan Refleksi Kinerja Nyata Satuan Pendidikan ({activeSchool.name}):</span>
                  </span>
                  
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(item)}
                      className="px-3 py-1 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 hover:bg-teal-100 transition cursor-pointer"
                    >
                      Ubah Refleksi
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveEditingId(null)}
                        className="px-2.5 py-1 rounded-xl text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveReflection(item.id)}
                        className="px-3 py-1 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 flex items-center gap-1 transition cursor-pointer shadow-xs"
                      >
                        <Save className="w-3 h-3" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editReflectionText}
                    onChange={e => setEditReflectionText(e.target.value)}
                    placeholder="Tuliskan praktik baik, budaya nyata, dan pembiasaan yang telah berjalan di sekolah terkait butir ini..."
                    className="w-full p-3 rounded-xl border border-teal-300 dark:border-teal-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{item.schoolReflection || 'Belum ada catatan refleksi sekolah. Klik tombol Ubah Refleksi untuk melengkapi bukti deskripsi kinerja.'}"
                  </p>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Official Regulation Reference & Links */}
      <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-extrabold text-white">
            Regulasi Resmi & Tautan Unduh Instrumen IA2024
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Dokumen instrumen kinerja nyata akreditasi ditetapkan secara sah melalui <strong>Kepmendikbudristek No. 246/O/2024</strong> dan masa transisi kelembagaan evaluasi mutu di bawah <strong>Permendikdasmen No. 14 Tahun 2026</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <a
            href="https://banpdm.kemdikbud.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs flex items-center justify-between text-slate-200 hover:text-white transition group"
          >
            <div>
              <p className="font-bold text-white group-hover:text-teal-300">Buku Panduan IA2024 BAN-PDM</p>
              <p className="text-[10px] text-slate-400">Pedoman penjelasan butir & rubrik skor</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
          </a>

          <a
            href="https://jdih.kemdikbud.go.id"
            target="_blank"
            rel="noreferrer"
            className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs flex items-center justify-between text-slate-200 hover:text-white transition group"
          >
            <div>
              <p className="font-bold text-white group-hover:text-teal-300">Kepmendikbudristek No. 246/O/2024</p>
              <p className="text-[10px] text-slate-400">Naskah hukum resmi instrumen akreditasi</p>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-teal-400" />
          </a>

          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs flex items-center justify-between text-slate-200">
            <div>
              <p className="font-bold text-teal-300">Permendikdasmen No. 14/2026</p>
              <p className="text-[10px] text-slate-400">Transformasi BSANP & Efisiensi Evaluasi Mutu</p>
            </div>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
        </div>
      </div>

    </div>
  );
};
