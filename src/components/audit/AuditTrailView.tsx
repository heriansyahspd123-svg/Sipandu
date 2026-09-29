import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  History, 
  Search, 
  Filter, 
  User, 
  Clock, 
  ShieldCheck, 
  Layers, 
  FileText,
  Building2
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => 
    log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300">
              Integritas & Akuntabilitas Data
            </span>
            <span className="text-xs text-slate-400">
              Audit Trail Resmi Satuan Pendidikan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1.5">
            Log Jejak Aktivitas (Audit Trail)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
            Mencatat setiap tindakan penting pengguna: <strong>Siapa → Melakukan apa → Kapan → Pada data apa</strong>. Menjamin keaslian data penjaminan mutu dan kesiapan akreditasi.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center min-w-[110px]">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Log</span>
          <span className="text-xl font-black text-slate-900 dark:text-white">{auditLogs.length} Aktivitas</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama aktor, jenis tindakan, atau rincian perubahan..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <History className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-semibold">Tidak ada log aktivitas yang cocok.</p>
          </div>
        ) : (
          filteredLogs.map(log => (
            <div
              key={log.id}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                      {log.targetEntity}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {log.details}
                  </p>
                  {log.schoolName && (
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{log.schoolName}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <User className="w-3.5 h-3.5 text-teal-600" />
                  <span>{log.actorName}</span>
                </div>
                <div className="flex items-center sm:justify-end gap-1 text-[10px] text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{log.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
