import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TPMPSMember, TPMPSProgram, TPMPSData } from '../../types';
import { generateAndDownloadWordReport } from '../../utils/wordExport';
import { 
  Users, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Calendar, 
  Award, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Layers, 
  BookOpen, 
  Building2, 
  Sparkles, 
  X,
  Phone,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface TPMPSViewProps {
  onNavigateTab?: (tab: string) => void;
}

const TPMPS_ROLES = [
  'Penanggung Jawab (Kepala Satuan Pendidikan)',
  'Ketua Tim TPMPS',
  'Sekretaris TPMPS',
  'Bendahara TPMPS',
  'Koordinator Standar Isi & Proses (Kurikulum)',
  'Koordinator Standar Penilaian Pendidikan',
  'Koordinator Standar Pendidik & Tenaga Kependidikan',
  'Koordinator Standar Sarana & Prasarana',
  'Koordinator Standar Pengelolaan & Pembiayaan',
  'Tim Teknis IT & Bank Bukti Digital',
  'Perwakilan Komite Satuan Pendidikan'
];

const SPMI_STAGES = [
  'Pemetaan Mutu (EDS & 8 SNP)',
  'Perencanaan PBD & RKT',
  'Pelaksanaan RTL Mutu',
  'Monev Internal TPMPS',
  'Penyusunan Rekomendasi'
] as const;

export const TPMPSView: React.FC<TPMPSViewProps> = ({ onNavigateTab }) => {
  const { activeSchool, updateSchoolProfile, currentUser } = useApp();
  const canEdit = currentUser.role === 'pengawas' || currentUser.role === 'kepala_sekolah' || currentUser.role === 'tim_mutu' || currentUser.role === 'operator';

  // Sub tabs within TPMPS view
  const [activeSubTab, setActiveSubTab] = useState<'struktur' | 'sk' | 'monev'>('struktur');

  // Modals state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TPMPSMember | null>(null);
  const [isSkModalOpen, setIsSkModalOpen] = useState(false);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<TPMPSProgram | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states for adding/editing members
  const [memberForm, setMemberForm] = useState({
    name: '',
    role: TPMPS_ROLES[1],
    position: 'Guru Kelas / Mata Pelajaran',
    nip: '',
    nuptk: '',
    phone: '',
    tasks: ''
  });

  // Form states for SK
  const [skForm, setSkForm] = useState({
    skNumber: activeSchool?.tpmpsData?.skNumber || `421.2/048/${activeSchool?.npsn}/VII/2026`,
    skDate: activeSchool?.tpmpsData?.skDate || '2026-07-15',
    academicYear: activeSchool?.tpmpsData?.academicYear || '2026/2027',
    establishedBy: activeSchool?.tpmpsData?.establishedBy || activeSchool?.principalName || 'Kepala Satuan Pendidikan',
    notes: activeSchool?.tpmpsData?.notes || 'Mendasari Keputusan Kepala Dinas Pendidikan dan Kebudayaan Kabupaten Sidenreng Rappang tentang Standar Pelayanan Minimal dan Sistem Penjaminan Mutu Internal.'
  });

  // Form states for Program
  const [programForm, setProgramForm] = useState<Omit<TPMPSProgram, 'id'>>({
    stage: 'Pemetaan Mutu (EDS & 8 SNP)',
    activity: '',
    pic: 'Ketua TPMPS',
    schedule: 'Minggu ke-2 Bulan Berjalan',
    status: 'Sedang Berjalan',
    targetOutput: '',
    notes: ''
  });

  // Initialize or get TPMPS Data
  const tpmpsData: TPMPSData = activeSchool.tpmpsData || {
    skNumber: `421.2/048/${activeSchool.npsn}/VII/2026`,
    skDate: '2026-07-15',
    academicYear: '2026/2027',
    establishedBy: activeSchool.principalName,
    notes: 'Tim Penjaminan Mutu Pendidikan Satuan Pendidikan (TPMPS) dibentuk untuk mengawal ketercapaian 8 Standar Nasional Pendidikan dan Rapor Pendidikan.',
    members: [
      {
        id: 'mem-1',
        name: activeSchool.principalName,
        role: 'Penanggung Jawab (Kepala Satuan Pendidikan)',
        position: 'Kepala Sekolah',
        nip: activeSchool.principalNip || '19710314 199403 2 004',
        phone: '0812-4231-xxxx',
        tasks: 'Memberikan arahan kebijakan, menetapkan SK Tim TPMPS, dan mengesahkan dokumen RKT, RKAS, serta laporan evaluasi diri.'
      },
      {
        id: 'mem-2',
        name: 'Andi Rahmawati, S.Pd.',
        role: 'Ketua Tim TPMPS',
        position: 'Guru Senior / Wakasek Kurikulum',
        nip: '19820512 200801 2 015',
        phone: '0813-5512-xxxx',
        tasks: 'Memimpin rapat koordinasi pemenuhan mutu, mengoordinasikan pengisian asesmen 8 SNP, dan merekap evaluasi ketercapaian program.'
      },
      {
        id: 'mem-3',
        name: 'Baharuddin, S.Pd.',
        role: 'Sekretaris TPMPS',
        position: 'Guru Kelas V / Tim KOSP',
        nip: '19860822 201101 1 008',
        phone: '0852-9981-xxxx',
        tasks: 'Menyusun notula rapat, mengarsipkan dokumen SK, notulensi koordinasi, dan menyusun draf laporan penjaminan mutu.'
      },
      {
        id: 'mem-4',
        name: 'Mustafa, S.Pd., M.Pd.',
        role: 'Koordinator Standar Penilaian Pendidikan',
        position: 'Guru Mata Pelajaran',
        nip: '19880915 201502 1 003',
        phone: '0853-4122-xxxx',
        tasks: 'Mengembangkan instrumen asesmen formatif dan sumatif, memvalidasi kisi-kisi soal, dan menganalisis capaian belajar siswa.'
      },
      {
        id: 'mem-5',
        name: 'Ilham Saputra, S.Kom.',
        role: 'Tim Teknis IT & Bank Bukti Digital',
        position: 'Operator Satdik / IT',
        nip: '-',
        phone: '0821-8845-xxxx',
        tasks: 'Mengunggah dan mengelola berkas digital pada Bank Bukti SIPANDU SEKOLAH, serta memastikan sinkronisasi data Dapodik.'
      },
      {
        id: 'mem-6',
        name: 'H. Mansyur, S.E.',
        role: 'Perwakilan Komite Satuan Pendidikan',
        position: 'Ketua Komite Sekolah',
        phone: '0811-412-xxxx',
        tasks: 'Memberikan masukan keterlibatan masyarakat dan orang tua murid dalam pemenuhan sarana dan iklim belajar yang aman.'
      }
    ],
    programs: [
      {
        id: 'prog-1',
        stage: 'Pemetaan Mutu (EDS & 8 SNP)',
        activity: 'Rapat Evaluasi Diri Sekolah (EDS) dan Pengisian Indikator 8 SNP SIPANDU',
        pic: 'Ketua TPMPS & Operator',
        schedule: 'Juli - Agustus 2026',
        status: 'Selesai',
        targetOutput: 'Matriks Capaian 8 Standar terisi 100% dan rekomendasi pembenahan awal.'
      },
      {
        id: 'prog-2',
        stage: 'Perencanaan PBD & RKT',
        activity: 'Penyelarasan Rekomendasi Rapor Pendidikan ke Dokumen RKT dan RKAS (ARKAS)',
        pic: 'Kepala Sekolah & Bendahara',
        schedule: 'September 2026',
        status: 'Selesai',
        targetOutput: 'RKT dan RKAS berbasis Perencanaan Berbasis Data (PBD) Sidrap.'
      },
      {
        id: 'prog-3',
        stage: 'Pelaksanaan RTL Mutu',
        activity: 'Workshop Pendampingan Pembelajaran Berdiferensiasi dan Penguatan Literasi-Numerasi',
        pic: 'Koordinator Standar Isi & Proses',
        schedule: 'Oktober - November 2026',
        status: 'Sedang Berjalan',
        targetOutput: 'Modul ajar berdiferensiasi dan bukti karya P5 terunggah di Bank Bukti.'
      },
      {
        id: 'prog-4',
        stage: 'Monev Internal TPMPS',
        activity: 'Supervisi Klinis Guru & Audit Kelengkapan Dokumen Bukti Fisik/Digital',
        pic: 'Kepala Sekolah & Tim Mutu',
        schedule: 'Desember 2026',
        status: 'Belum Terlaksana',
        targetOutput: 'Lembar observasi kelas dan berita acara evaluasi tengah tahun.'
      }
    ]
  };

  // Helper to persist TPMPS data to school
  const saveTPMPS = (newData: TPMPSData) => {
    updateSchoolProfile(activeSchool.id, { tpmpsData: newData });
  };

  // Members Actions
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: '',
      role: TPMPS_ROLES[1],
      position: 'Guru Kelas / Tim Mutu',
      nip: '',
      nuptk: '',
      phone: '',
      tasks: ''
    });
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member: TPMPSMember) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      position: member.position,
      nip: member.nip || '',
      nuptk: member.nuptk || '',
      phone: member.phone || '',
      tasks: member.tasks || ''
    });
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForm.name.trim()) return;

    let updatedMembers = [...tpmpsData.members];

    if (editingMember) {
      updatedMembers = updatedMembers.map(m => 
        m.id === editingMember.id 
          ? { ...m, ...memberForm } 
          : m
      );
      setToastMsg(`Data anggota "${memberForm.name}" berhasil diperbarui.`);
    } else {
      const newMember: TPMPSMember = {
        id: 'mem-' + Date.now(),
        ...memberForm
      };
      updatedMembers.push(newMember);
      setToastMsg(`Anggota baru "${memberForm.name}" berhasil ditambahkan ke TPMPS.`);
    }

    saveTPMPS({
      ...tpmpsData,
      members: updatedMembers
    });

    setIsMemberModalOpen(false);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (!confirm(`Hapus ${memberName} dari struktur TPMPS?`)) return;
    const updated = tpmpsData.members.filter(m => m.id !== memberId);
    saveTPMPS({ ...tpmpsData, members: updated });
    setToastMsg(`Anggota "${memberName}" dihapus dari TPMPS.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // SK Actions
  const handleSaveSk = (e: React.FormEvent) => {
    e.preventDefault();
    saveTPMPS({
      ...tpmpsData,
      skNumber: skForm.skNumber,
      skDate: skForm.skDate,
      academicYear: skForm.academicYear,
      establishedBy: skForm.establishedBy,
      notes: skForm.notes
    });
    setIsSkModalOpen(false);
    setToastMsg('Data SK Penetapan TPMPS berhasil disimpan.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Program Actions
  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgramForm({
      stage: 'Pemetaan Mutu (EDS & 8 SNP)',
      activity: '',
      pic: 'Ketua TPMPS',
      schedule: 'Bulan Berjalan',
      status: 'Sedang Berjalan',
      targetOutput: '',
      notes: ''
    });
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: TPMPSProgram) => {
    setEditingProgram(prog);
    setProgramForm({
      stage: prog.stage,
      activity: prog.activity,
      pic: prog.pic,
      schedule: prog.schedule,
      status: prog.status,
      targetOutput: prog.targetOutput,
      notes: prog.notes || ''
    });
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programForm.activity.trim()) return;

    let updatedPrograms = [...tpmpsData.programs];

    if (editingProgram) {
      updatedPrograms = updatedPrograms.map(p => 
        p.id === editingProgram.id ? { ...p, ...programForm } : p
      );
      setToastMsg('Agenda SPMI berhasil diperbarui.');
    } else {
      const newProg: TPMPSProgram = {
        id: 'prog-' + Date.now(),
        ...programForm
      };
      updatedPrograms.push(newProg);
      setToastMsg('Agenda SPMI baru berhasil ditambahkan.');
    }

    saveTPMPS({
      ...tpmpsData,
      programs: updatedPrograms
    });

    setIsProgramModalOpen(false);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDeleteProgram = (progId: string) => {
    if (!confirm('Hapus agenda kerja SPMI ini?')) return;
    const updated = tpmpsData.programs.filter(p => p.id !== progId);
    saveTPMPS({ ...tpmpsData, programs: updated });
    setToastMsg('Agenda kerja SPMI berhasil dihapus.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Word Export for SK & Structure
  const handleExportWord = () => {
    const tableHeaders = ['No', 'Nama Lengkap & Gelar', 'Jabatan dalam TPMPS', 'Jabatan Kedinasan', 'NIP / NUPTK', 'Uraian Tugas Pokok'];
    const tableRows = tpmpsData.members.map((m, idx) => [
      idx + 1,
      m.name,
      m.role,
      m.position,
      m.nip || m.nuptk || '-',
      m.tasks || 'Melaksanakan tugas penjaminan mutu internal sesuai pembagian standar.'
    ]);

    generateAndDownloadWordReport({
      reportTitle: 'SURAT KEPUTUSAN & STRUKTUR TIM PENJAMINAN MUTU PENDIDIKAN SATUAN PENDIDIKAN (TPMPS)',
      schoolName: activeSchool.name,
      npsn: activeSchool.npsn,
      level: activeSchool.level,
      status: activeSchool.status,
      principalName: activeSchool.principalName,
      principalNip: activeSchool.principalNip,
      supervisorName: activeSchool.supervisorName,
      kabupaten: 'Sidenreng Rappang',
      tableHeaders,
      tableRows,
      metrics: [
        { label: 'Nomor SK TPMPS', value: tpmpsData.skNumber },
        { label: 'Tahun Ajaran', value: tpmpsData.academicYear },
        { label: 'Jumlah Personel', value: `${tpmpsData.members.length} Orang` }
      ],
      summaryNotes: `Surat Keputusan Kepala Satuan Pendidikan Nomor: ${tpmpsData.skNumber} tanggal ${tpmpsData.skDate} tentang Penetapan Susunan Tim Penjaminan Mutu Pendidikan Satuan Pendidikan (TPMPS) Tahun Ajaran ${tpmpsData.academicYear}. Disahkan oleh Pengawas Pembina Heriansyah, S.Si., S.Pd., M.Pd.`
    });

    setToastMsg(`Draft SK & Struktur TPMPS (.doc) berhasil diunduh untuk ${activeSchool.name}`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="space-y-6">

      {/* Toast Alert */}
      {toastMsg && (
        <div className="print:hidden p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
          <button 
            type="button" 
            onClick={() => setToastMsg(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner / Heading */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Sistem Penjaminan Mutu Internal (SPMI)</span>
              </span>
              <span className="text-xs text-slate-300">
                Permendikbud No. 28 Tahun 2016 • Kemendikbudristek
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Tim Penjaminan Mutu Satuan Pendidikan (TPMPS)
            </h1>
            
            <p className="text-xs sm:text-sm text-teal-200/90 mt-1 max-w-2xl leading-relaxed">
              Pusat kendali dan administrasi tim mutu <strong>{activeSchool.name}</strong>. Kelola susunan personalia SK, distribusi koordinator 8 Standar, serta jadwal monev mutu internal sekolah.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {canEdit && (
              <button
                type="button"
                onClick={handleOpenAddMember}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md transition cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Input Anggota TPMPS</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportWord}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
              title="Unduh SK dan Susunan TPMPS format Word (.doc)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Simpan Word (.doc)</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition cursor-pointer active:scale-95"
              title="Cetak struktur TPMPS ke printer atau PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Struktur Anggota, SK Penetapan, Agenda Monev */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('struktur')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'struktur'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-teal-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>1. Susunan Personalia & Koordinator ({tpmpsData.members.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'sk'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-teal-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>2. Legalitas & SK Kepala Satdik</span>
          </button>

          <button
            onClick={() => setActiveSubTab('monev')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 ${
              activeSubTab === 'monev'
                ? 'bg-teal-500 text-slate-950 shadow-md'
                : 'text-teal-200 hover:text-white hover:bg-white/10'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>3. Siklus SPMI & Agenda Monev ({tpmpsData.programs.length})</span>
          </button>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Personel Tim Mutu</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{tpmpsData.members.length} Orang</span>
            <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold">Tercatat dalam SK Resmi</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status SK TPMPS</span>
            <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-1 block truncate max-w-[180px]">{tpmpsData.skNumber}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>SK Aktif TA {tpmpsData.academicYear}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agenda Kerja SPMI</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 block">{tpmpsData.programs.length} Program</span>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
              {tpmpsData.programs.filter(p => p.status === 'Selesai').length} Selesai • {tpmpsData.programs.filter(p => p.status === 'Sedang Berjalan').length} Berjalan
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: SUSUNAN ANGGOTA & KOORDINATOR TPMPS */}
      {activeSubTab === 'struktur' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daftar Personalia Tim Penjaminan Mutu Pendidikan (TPMPS)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold">
                  {tpmpsData.members.length} Anggota
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Koordinator dan anggota yang bertanggung jawab terhadap ketercapaian 8 Standar Nasional Pendidikan.
              </p>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={handleOpenAddMember}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Anggota Baru</span>
              </button>
            )}
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 text-center w-12">No</th>
                  <th className="py-3 px-4">Nama Lengkap & NIP</th>
                  <th className="py-3 px-4">Jabatan dalam TPMPS</th>
                  <th className="py-3 px-4">Jabatan Kedinasan</th>
                  <th className="py-3 px-4">Tugas Pokok & Kontak</th>
                  {canEdit && <th className="py-3 px-3 text-center w-28 print:hidden">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tpmpsData.members.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-400">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{member.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {member.nip ? `NIP: ${member.nip}` : member.nuptk ? `NUPTK: ${member.nuptk}` : 'Non-NIP'}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                        member.role.includes('Penanggung Jawab') 
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300' 
                          : member.role.includes('Ketua') 
                          ? 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300'
                          : member.role.includes('Sekretaris') || member.role.includes('Bendahara')
                          ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {member.position}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{member.tasks || '-'}</p>
                      {member.phone && (
                        <p className="text-[10px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </p>
                      )}
                    </td>
                    {canEdit && (
                      <td className="py-3 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditMember(member)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Edit Data Anggota"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member.id, member.name)}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                            title="Hapus dari TPMPS"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SK PENETAPAN & LEGALITAS TPMPS */}
      {activeSubTab === 'sk' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Surat Keputusan (SK) Penetapan Tim TPMPS</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                  SK Resmi
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dokumen legalitas penetapan struktur tim penjaminan mutu internal sekolah.
              </p>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={() => {
                  setSkForm({
                    skNumber: tpmpsData.skNumber,
                    skDate: tpmpsData.skDate,
                    academicYear: tpmpsData.academicYear,
                    establishedBy: tpmpsData.establishedBy,
                    notes: tpmpsData.notes || ''
                  });
                  setIsSkModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Informasi SK</span>
              </button>
            )}
          </div>

          {/* SK Preview Paper Box */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-4 max-w-3xl mx-auto">
            <div className="text-center border-b border-slate-300 dark:border-slate-700 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Pemerintah Kabupaten Sidenreng Rappang • Dinas Pendidikan dan Kebudayaan
              </p>
              <h3 className="text-sm sm:text-base font-black uppercase mt-1 text-slate-900 dark:text-white">
                KEPUTUSAN KEPALA {activeSchool.name.toUpperCase()}
              </h3>
              <p className="text-xs font-bold mt-1 text-teal-700 dark:text-teal-400 font-mono">
                NOMOR: {tpmpsData.skNumber}
              </p>
              <p className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mt-1">
                TENTANG PEMBENTUKAN TIM PENJAMINAN MUTU PENDIDIKAN SATUAN PENDIDIKAN (TPMPS)<br/>
                TAHUN PELAJARAN {tpmpsData.academicYear}
              </p>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p>
                <strong>Menimbang:</strong> Bahwa dalam rangka penjaminan dan peningkatan mutu pendidikan yang terarah dan berkelanjutan di {activeSchool.name}, perlu dibentuk Tim Penjaminan Mutu Pendidikan Satuan Pendidikan (TPMPS).
              </p>
              <p>
                <strong>Mengingat:</strong> Undang-Undang No. 20 Tahun 2003 tentang Sisdiknas, Permendikbud No. 28 Tahun 2016 tentang Sistem Penjaminan Mutu Pendidikan Dasar dan Menengah, serta Surat Edaran Kepala Disdikbud Kabupaten Sidrap.
              </p>
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white mb-2">MEMUTUSKAN & MENETAPKAN:</p>
                <ol className="list-decimal pl-4 space-y-1.5">
                  <li>Membentuk Tim Penjaminan Mutu Pendidikan Satuan Pendidikan (TPMPS) Tahun Pelajaran {tpmpsData.academicYear} sebagaimana tercantum pada lampiran keputusan ini.</li>
                  <li>Tim bertugas mengoordinasikan evaluasi diri sekolah (EDS), asesmen 8 Standar Nasional, dan penyusunan program RTL berbasis Rapor Pendidikan.</li>
                  <li>Keputusan ini berlaku sejak tanggal ditetapkan dengan ketentuan apabila terdapat kekeliruan akan diperbaiki sebagaimana mestinya.</li>
                </ol>
              </div>
            </div>

            <div className="pt-6 grid grid-cols-2 text-center text-xs">
              <div>
                <p className="text-slate-400">Mengetahui Pengawas Pembina:</p>
                <div className="h-14 flex items-center justify-center italic text-slate-300">
                  [Tervalidasi Digital]
                </div>
                <p className="font-bold underline text-slate-900 dark:text-white">{activeSchool.supervisorName}</p>
                <p className="text-[10px] text-slate-400">Pengawas Pembina Disdikbud Sidrap</p>
              </div>

              <div>
                <p className="text-slate-400">Ditetapkan di Sidenreng Rappang, {tpmpsData.skDate}</p>
                <div className="h-14 flex items-center justify-center italic text-slate-300">
                  [Tertanda Tangani]
                </div>
                <p className="font-bold underline text-slate-900 dark:text-white">{tpmpsData.establishedBy}</p>
                <p className="text-[10px] text-slate-400">NIP: {activeSchool.principalNip || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SIKLUS SPMI & AGENDA KERJA MONEV */}
      {activeSubTab === 'monev' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Program Kerja & Agenda Monev Internal TPMPS</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
                  Siklus SPMI
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                5 Tahapan siklus penjaminan mutu internal sekolah dalam memantau 8 SNP dan pembenahan Rapor Pendidikan.
              </p>
            </div>

            {canEdit && (
              <button
                type="button"
                onClick={handleOpenAddProgram}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Agenda SPMI</span>
              </button>
            )}
          </div>

          {/* 5 Stages Progress Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
            {SPMI_STAGES.map((stage, idx) => {
              const stagePrograms = tpmpsData.programs.filter(p => p.stage === stage);
              const isFinished = stagePrograms.length > 0 && stagePrograms.every(p => p.status === 'Selesai');
              const isRunning = stagePrograms.some(p => p.status === 'Sedang Berjalan');

              return (
                <div 
                  key={idx} 
                  className={`p-3 rounded-2xl border text-center transition ${
                    isFinished 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                      : isRunning 
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase block tracking-wider">Tahap {idx + 1}</span>
                  <p className="font-bold text-xs mt-0.5 leading-snug">{stage}</p>
                  <span className="text-[10px] mt-1.5 font-semibold inline-block">
                    {stagePrograms.length} Agenda
                  </span>
                </div>
              );
            })}
          </div>

          {/* Programs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 text-center w-12">No</th>
                  <th className="py-3 px-3">Tahap SPMI</th>
                  <th className="py-3 px-4">Nama Agenda / Aktivitas</th>
                  <th className="py-3 px-3">PIC / Pelaksana</th>
                  <th className="py-3 px-3">Jadwal</th>
                  <th className="py-3 px-3">Target Output</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  {canEdit && <th className="py-3 px-3 text-center w-24 print:hidden">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {tpmpsData.programs.map((prog, idx) => (
                  <tr key={prog.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-[10px]">
                        {prog.stage}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {prog.activity}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{prog.pic}</td>
                    <td className="py-3 px-3 text-slate-500">{prog.schedule}</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{prog.targetOutput || '-'}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        prog.status === 'Selesai' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : prog.status === 'Sedang Berjalan' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {prog.status}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="py-3 px-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditProgram(prog)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Agenda"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProgram(prog.id)}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 text-rose-600 hover:bg-rose-50"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT ANGGOTA TPMPS */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-300" />
                <h3 className="text-base font-extrabold">
                  {editingMember ? 'Edit Data Anggota TPMPS' : 'Input Anggota Baru TPMPS'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsMemberModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Lengkap & Gelar: *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={e => setMemberForm({ ...memberForm, name: e.target.value })}
                  placeholder="Contoh: Dra. Hj. Nurlaela, M.Pd."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jabatan dalam TPMPS: *
                  </label>
                  <select
                    value={memberForm.role}
                    onChange={e => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {TPMPS_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jabatan Kedinasan:
                  </label>
                  <input
                    type="text"
                    value={memberForm.position}
                    onChange={e => setMemberForm({ ...memberForm, position: e.target.value })}
                    placeholder="Contoh: Guru Kelas VI / Wakasek"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    NIP / NUPTK:
                  </label>
                  <input
                    type="text"
                    value={memberForm.nip}
                    onChange={e => setMemberForm({ ...memberForm, nip: e.target.value })}
                    placeholder="19820512 200801 2 015"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Nomor Kontak / WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={memberForm.phone}
                    onChange={e => setMemberForm({ ...memberForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Uraian Tugas Pokok dalam Tim:
                </label>
                <textarea
                  rows={3}
                  value={memberForm.tasks}
                  onChange={e => setMemberForm({ ...memberForm, tasks: e.target.value })}
                  placeholder="Deskripsikan tanggung jawab spesifik dalam penjaminan mutu..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT SK PENETAPAN */}
      {isSkModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
                <h3 className="text-base font-extrabold">Edit Data SK Penetapan TPMPS</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsSkModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSk} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nomor Surat Keputusan (SK): *
                </label>
                <input
                  type="text"
                  required
                  value={skForm.skNumber}
                  onChange={e => setSkForm({ ...skForm, skNumber: e.target.value })}
                  placeholder="Contoh: 421.2/048/SDN.1-PKG/VII/2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tanggal Penetapan SK: *
                  </label>
                  <input
                    type="date"
                    required
                    value={skForm.skDate}
                    onChange={e => setSkForm({ ...skForm, skDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tahun Pelajaran: *
                  </label>
                  <input
                    type="text"
                    required
                    value={skForm.academicYear}
                    onChange={e => setSkForm({ ...skForm, academicYear: e.target.value })}
                    placeholder="2026/2027"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Pejabat Penandatangan (Kepala Sekolah):
                </label>
                <input
                  type="text"
                  value={skForm.establishedBy}
                  onChange={e => setSkForm({ ...skForm, establishedBy: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Catatan / Konsideran Tambahan:
                </label>
                <textarea
                  rows={3}
                  value={skForm.notes}
                  onChange={e => setSkForm({ ...skForm, notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  Simpan Perubahan SK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT / EDIT AGENDA SPMI */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5 bg-gradient-to-r from-teal-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-300" />
                <h3 className="text-base font-extrabold">
                  {editingProgram ? 'Edit Agenda Kerja SPMI' : 'Input Agenda Baru SPMI'}
                </h3>
              </div>
              <button 
                type="button" 
                onClick={() => setIsProgramModalOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Tahapan Siklus SPMI: *
                </label>
                <select
                  value={programForm.stage}
                  onChange={e => setProgramForm({ ...programForm, stage: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {SPMI_STAGES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Kegiatan / Agenda: *
                </label>
                <input
                  type="text"
                  required
                  value={programForm.activity}
                  onChange={e => setProgramForm({ ...programForm, activity: e.target.value })}
                  placeholder="Contoh: Rapat Evaluasi Diri Sekolah & Analisis 8 Standar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Penanggung Jawab (PIC):
                  </label>
                  <input
                    type="text"
                    value={programForm.pic}
                    onChange={e => setProgramForm({ ...programForm, pic: e.target.value })}
                    placeholder="Ketua TPMPS"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Jadwal Pelaksanaan:
                  </label>
                  <input
                    type="text"
                    value={programForm.schedule}
                    onChange={e => setProgramForm({ ...programForm, schedule: e.target.value })}
                    placeholder="Contoh: Oktober 2026"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Status Pelaksanaan:
                  </label>
                  <select
                    value={programForm.status}
                    onChange={e => setProgramForm({ ...programForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Belum Terlaksana">Belum Terlaksana</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Output / Dokumen Bukti:
                  </label>
                  <input
                    type="text"
                    value={programForm.targetOutput}
                    onChange={e => setProgramForm({ ...programForm, targetOutput: e.target.value })}
                    placeholder="Contoh: Berita Acara & Notula Rapat"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
