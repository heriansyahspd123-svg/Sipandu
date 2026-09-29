import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { NavTab } from './Sidebar';
import { 
  Search, 
  X, 
  Layers, 
  FileText, 
  CheckSquare, 
  Building2, 
  BookOpen, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab, meta?: { id?: string; standardId?: number }) => void;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const { 
    schools, 
    indicators, 
    evidences, 
    actionPlans, 
    regulations, 
    setActiveSchoolId,
    setActiveStandardId
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Results calculation
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { schools: [], indicators: [], evidences: [], actionPlans: [], regulations: [] };

    const matchedSchools = schools.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.npsn.includes(q) || 
      s.kecamatan.toLowerCase().includes(q)
    );

    const matchedIndicators = indicators.filter(i => 
      i.title.toLowerCase().includes(q) || 
      i.code.toLowerCase().includes(q) || 
      i.component.toLowerCase().includes(q) ||
      i.question.toLowerCase().includes(q) ||
      i.guide.meaning.toLowerCase().includes(q)
    );

    const matchedEvidences = evidences.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q) ||
      e.fileName.toLowerCase().includes(q)
    );

    const matchedRtls = actionPlans.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.activity.toLowerCase().includes(q) || 
      p.picName.toLowerCase().includes(q)
    );

    const matchedRegs = regulations.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.shortTitle.toLowerCase().includes(q) || 
      r.codeNo.toLowerCase().includes(q)
    );

    return {
      schools: matchedSchools,
      indicators: matchedIndicators,
      evidences: matchedEvidences,
      actionPlans: matchedRtls,
      regulations: matchedRegs
    };
  }, [query, schools, indicators, evidences, actionPlans, regulations]);

  if (!isOpen) return null;

  const totalHits = 
    results.schools.length + 
    results.indicators.length + 
    results.evidences.length + 
    results.actionPlans.length + 
    results.regulations.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ketik kata kunci (misal: asesmen formatif, numerasi, KOSP, toilet, modul)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query ? (
            <div className="py-8 text-center">
              <Sparkles className="w-8 h-8 text-teal-500 mx-auto opacity-70 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Pencarian Universal SIPANDU</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Cari seketika lintas data: indikator 8 SNP, bank dokumen bukti, rencana tindak lanjut (RTL), sekolah binaan, dan dasar hukum regulasi.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Asesmen Formatif', 'KOSP', 'Numerasi', 'Sanitasi Sarpras', 'Permendikbud No. 16/2022'].map(sugg => (
                  <button
                    key={sugg}
                    onClick={() => setQuery(sugg)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-600 transition"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>
          ) : totalHits === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-semibold">Tidak ditemukan hasil untuk "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci umum seperti "RPP", "RTL", "SKL", atau nama sekolah.</p>
            </div>
          ) : (
            <>
              {/* Indikator 8 SNP Hits */}
              {results.indicators.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Layers className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Indikator 8 SNP ({results.indicators.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.indicators.map(ind => (
                      <div
                        key={ind.id}
                        onClick={() => {
                          setActiveStandardId(ind.standardId);
                          onNavigate('snp', { standardId: ind.standardId, id: ind.id });
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-teal-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              SNP {ind.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-white">
                              {ind.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {ind.question}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bank Bukti Hits */}
              {results.evidences.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Bank Bukti Digital ({results.evidences.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.evidences.map(ev => (
                      <div
                        key={ev.id}
                        onClick={() => {
                          onNavigate('bank_bukti', { id: ev.id });
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">
                            {ev.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {ev.category} • Diunggah oleh: {ev.uploadedByName}
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          ev.status === 'terverifikasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ev.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Plans / RTL Hits */}
              {results.actionPlans.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <CheckSquare className="w-3.5 h-3.5 text-purple-500" />
                    <span>Rencana Tindak Lanjut / RTL ({results.actionPlans.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.actionPlans.map(rtl => (
                      <div
                        key={rtl.id}
                        onClick={() => {
                          onNavigate('rtl', { id: rtl.id });
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-purple-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">
                            {rtl.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            PIC: {rtl.picName} • Target: {rtl.targetDate}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sekolah Hits */}
              {results.schools.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sekolah Binaan ({results.schools.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.schools.map(sch => (
                      <div
                        key={sch.id}
                        onClick={() => {
                          setActiveSchoolId(sch.id);
                          onNavigate('sekolah', { id: sch.id });
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-amber-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">
                            {sch.name}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            NPSN: {sch.npsn} • {sch.kecamatan} • Akreditasi: {sch.lastAccreditation}
                          </p>
                        </div>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                          Pilih
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regulasi Hits */}
              {results.regulations.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                    <span>Master Regulasi ({results.regulations.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.regulations.map(reg => (
                      <div
                        key={reg.id}
                        onClick={() => {
                          onNavigate('regulasi', { id: reg.id });
                          onClose();
                        }}
                        className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50/50 dark:hover:bg-slate-800/80 cursor-pointer transition flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">
                            {reg.shortTitle}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                            {reg.summary}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Tekan <strong>ESC</strong> untuk menutup</span>
          <span>SIPANDU Universal Query Engine</span>
        </div>
      </div>
    </div>
  );
};
