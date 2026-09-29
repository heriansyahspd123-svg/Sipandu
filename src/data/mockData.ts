import { 
  School, 
  User, 
  SNPStandard, 
  Indicator, 
  Evidence, 
  RaporItem, 
  ActionPlan, 
  VisitRecord, 
  Regulation, 
  AuditLogItem, 
  NotificationItem 
} from '../types';

export const SNP_STANDARDS: SNPStandard[] = [
  {
    id: 1,
    code: 'SKL',
    name: 'Standar Kompetensi Lulusan',
    shortName: 'Kompetensi Lulusan',
    description: 'Kriteria mengenai kualifikasi kemampuan lulusan mencakup sikap, pengetahuan, dan keterampilan sesuai Profil Pelajar Pancasila.',
    focusArea: 'Capaian karakter, literasi, numerasi, dan kesiapan jenjang berikutnya.',
    iconName: 'Award',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 2,
    code: 'SI',
    name: 'Standar Isi',
    shortName: 'Standar Isi',
    description: 'Kriteria mengenai ruang lingkup materi dan tingkat kompetensi untuk mencapai kompetensi lulusan pada jenjang pendidikan tertentu.',
    focusArea: 'Struktur kurikulum KOSP, muatan pembelajaran, modul pembelajaran, dan muatan lokal.',
    iconName: 'BookOpen',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 3,
    code: 'SPRO',
    name: 'Standar Proses',
    shortName: 'Standar Proses',
    description: 'Kriteria mengenai pelaksanaan pembelajaran yang interaktif, inspiratif, menyenangkan, menantang, dan berpusat pada peserta didik.',
    focusArea: 'Perencanaan pembelajaran (RPP/Modul Ajar), diferensiasi, asesmen formatif, dan refleksi pembelajaran.',
    iconName: 'Activity',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    code: 'SPEN',
    name: 'Standar Penilaian Pendidikan',
    shortName: 'Penilaian Pendidikan',
    description: 'Kriteria mengenai mekanisme, prosedur, dan instrumen penilaian hasil belajar peserta didik.',
    focusArea: 'Asesmen awal, formatif, sumatif, rubrik kriteria, dan pemanfaatan umpan balik berkelanjutan.',
    iconName: 'ClipboardCheck',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 5,
    code: 'PTK',
    name: 'Standar Pendidik dan Tenaga Kependidikan',
    shortName: 'Pendidik & Tenaga Kependidikan',
    description: 'Kriteria kualifikasi akademik dan kompetensi pendidik serta tenaga kependidikan di satuan pendidikan.',
    focusArea: 'Kualifikasi S1/D4, sertifikasi pendidik, keaktifan Komunitas Belajar (Kombel), PMM, dan PKG.',
    iconName: 'Users',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 6,
    code: 'SARPRAS',
    name: 'Standar Sarana dan Prasarana',
    shortName: 'Sarana & Prasarana',
    description: 'Kriteria mengenai ruang belajar, tempat berolahraga, tempat ibadah, perpustakaan, laboratorium, serta kelayakan fasilitas.',
    focusArea: 'Ketersediaan ruang kelas, rasio buku, sanitasi higienis, lab/pojok baca, akses internet, dan keselamatan.',
    iconName: 'Building',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 7,
    code: 'PENGELOLAAN',
    name: 'Standar Pengelolaan',
    shortName: 'Standar Pengelolaan',
    description: 'Kriteria mengenai perencanaan, pelaksanaan, dan pengawasan kegiatan pendidikan pada tingkat satuan pendidikan.',
    focusArea: 'RKT, RKAS, KOSP, TPMPS, kepemimpinan instruksional, serta pelibatan komite dan orang tua.',
    iconName: 'Compass',
    color: 'from-sky-500 to-blue-700'
  },
  {
    id: 8,
    code: 'PEMBIAYAAN',
    name: 'Standar Pembiayaan',
    shortName: 'Standar Pembiayaan',
    description: 'Kriteria mengenai komponen dan besarnya biaya operasi satuan pendidikan yang berlaku selama satu tahun.',
    focusArea: 'Penggunaan dana BOS/BOSP, transparansi pelaporan ARKAS, efisiensi alokasi peningkatan mutu guru & murid.',
    iconName: 'Coins',
    color: 'from-lime-600 to-green-700'
  }
];

export const INITIAL_SCHOOLS: School[] = [
  {
    id: 'sch-1',
    npsn: '40304211',
    name: 'UPT SDN 1 Pangkajene Sidrap',
    level: 'SD',
    status: 'Negeri',
    address: 'Jl. Jenderal Sudirman No. 12, Pangkajene',
    desaKelurahan: 'Pangkajene',
    kecamatan: 'Maritengngae',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'Hj. Fatimah, S.Pd., M.Pd.',
    principalNip: '19710314 199403 2 004',
    supervisorName: 'Heriansyah, S.Si., S.Pd., M.Pd',
    teacherCount: 18,
    staffCount: 4,
    studentCount: 382,
    rombelCount: 12,
    academicYear: '2026/2027',
    lastAccreditation: 'A',
    lastAccreditationYear: 2022,
    facilities: {
      classrooms: 12,
      library: true,
      pojokBaca: true,
      uks: true,
      sanitasiBaik: true,
      internetAccess: true,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Andi Rahmawati, S.Pd.', role: 'Ketua Tim TPMPS / Guru Kls VI' },
      { name: 'Baharuddin, S.Pd.', role: 'Koordinator SNP Proses' },
      { name: 'Ilham Saputra, S.Kom.', role: 'Operator & Dokumentasi Digital' }
    ],
    specialNotes: 'Sekolah rujukan digital jenjang SD Kecamatan Maritengngae. Fokus persiapan perpanjangan akreditasi tahun 2027.',
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sch-2',
    npsn: '40304255',
    name: 'UPT SMPN 1 Maritengngae',
    level: 'SMP',
    status: 'Negeri',
    address: 'Jl. Wolter Monginsidi No. 45, Pangkajene',
    desaKelurahan: 'Rizal',
    kecamatan: 'Maritengngae',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'Drs. Rusli Basri, M.M.',
    principalNip: '19680812 199303 1 008',
    supervisorName: 'Heriansyah, S.Si., S.Pd., M.Pd',
    teacherCount: 34,
    staffCount: 8,
    studentCount: 640,
    rombelCount: 18,
    academicYear: '2026/2027',
    lastAccreditation: 'A',
    lastAccreditationYear: 2021,
    facilities: {
      classrooms: 18,
      library: true,
      labIpa: true,
      labKomputer: true,
      uks: true,
      sanitasiBaik: true,
      internetAccess: true,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Nurlina, S.Pd., M.Pd.', role: 'Ketua Tim Penjaminan Mutu' },
      { name: 'Syamsuddin, S.Pd.', role: 'Koordinator Kurikulum' },
      { name: 'Rahmatia, A.Md.', role: 'Operator Data Mutu' }
    ],
    specialNotes: 'SMP Negeri percontohan di pusat kabupaten dengan sarana laboratorium IPA dan TIK yang lengkap.',
    photoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sch-3',
    npsn: '40304218',
    name: 'UPT SDN 3 Baranti',
    level: 'SD',
    status: 'Negeri',
    address: 'Jl. Poros Baranti - Rappang KM 3',
    desaKelurahan: 'Passeno',
    kecamatan: 'Baranti',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'H. Sudirman, S.Pd., M.Si.',
    principalNip: '19740510 199803 1 006',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    teacherCount: 14,
    staffCount: 2,
    studentCount: 215,
    rombelCount: 8,
    academicYear: '2026/2027',
    lastAccreditation: 'B',
    lastAccreditationYear: 2020,
    facilities: {
      classrooms: 8,
      library: true,
      pojokBaca: true,
      uks: true,
      sanitasiBaik: false,
      internetAccess: true,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Hasnah, S.Pd.SD', role: 'Ketua Mutu' },
      { name: 'Muh. Faisal, S.Pd.', role: 'Sekretaris' }
    ],
    specialNotes: 'Perlu peningkatan sanitasi toilet murid dan penguatan pembelajaran numerasi di kelas awal.',
    photoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sch-4',
    npsn: '40304230',
    name: 'UPT SDN 5 Rappang',
    level: 'SD',
    status: 'Negeri',
    address: 'Jl. Andi Nona No. 8, Rappang',
    desaKelurahan: 'Rappang',
    kecamatan: 'Panca Rijang',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'Dra. Hj. Rosmini, M.Pd.',
    principalNip: '19691204 199307 2 001',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    teacherCount: 16,
    staffCount: 3,
    studentCount: 285,
    rombelCount: 10,
    academicYear: '2026/2027',
    lastAccreditation: 'A',
    lastAccreditationYear: 2023,
    facilities: {
      classrooms: 10,
      library: true,
      pojokBaca: true,
      uks: true,
      sanitasiBaik: true,
      internetAccess: true,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Drs. Muhammad Arsyad', role: 'Ketua TPMPS' }
    ],
    specialNotes: 'Program unggulan sekolah adiwiyata dan penguatan literasi digital dasar.',
    photoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sch-5',
    npsn: '40304260',
    name: 'UPT SMPN 2 Watang Pulu',
    level: 'SMP',
    status: 'Negeri',
    address: 'Jl. Poros Pare-Pare - Sidrap KM 9, Lawawoi',
    desaKelurahan: 'Lawawoi',
    kecamatan: 'Watang Pulu',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'Rustam Effendi, S.Pd., M.Pd.',
    principalNip: '19750211 200003 1 003',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    teacherCount: 26,
    staffCount: 5,
    studentCount: 420,
    rombelCount: 12,
    academicYear: '2026/2027',
    lastAccreditation: 'B',
    lastAccreditationYear: 2021,
    facilities: {
      classrooms: 12,
      library: true,
      labIpa: true,
      labKomputer: false,
      uks: true,
      sanitasiBaik: true,
      internetAccess: true,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Nurhaedah, S.Pd.', role: 'Koordinator Penjaminan Mutu' }
    ],
    specialNotes: 'Target peningkatan akreditasi dari B ke A pada visitasi 2026/2027. Perlu pemenuhan perangkat lab komputer.',
    photoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'sch-6',
    npsn: '40304245',
    name: 'UPT SDN 1 Amparita',
    level: 'SD',
    status: 'Negeri',
    address: 'Jl. Poros Amparita - Tanrutedong',
    desaKelurahan: 'Amparita',
    kecamatan: 'Tellu Limpoe',
    kabupaten: 'Kabupaten Sidenreng Rappang (Sidrap)',
    provinsi: 'Sulawesi Selatan',
    principalName: 'Kamaruddin, S.Pd.',
    principalNip: '19780419 200502 1 004',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    teacherCount: 12,
    staffCount: 2,
    studentCount: 198,
    rombelCount: 6,
    academicYear: '2026/2027',
    lastAccreditation: 'B',
    lastAccreditationYear: 2022,
    facilities: {
      classrooms: 6,
      library: true,
      pojokBaca: true,
      uks: true,
      sanitasiBaik: true,
      internetAccess: false,
      lapanganOlahraga: true
    },
    qualityTeam: [
      { name: 'Syamsiah, S.Pd.SD', role: 'Ketua Tim Mutu' }
    ],
    specialNotes: 'Sekolah di wilayah Tellu Limpoe, penguatan sinyal internet dan pemanfaatan perpustakaan keliling.',
    photoUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-supervisor',
    name: 'Heriansyah, S.Si., S.Pd., M.Pd',
    role: 'pengawas',
    schoolId: 'sch-1',
    nip: '19790515 200502 1 004',
    email: 'heriansyah.spd123@gmail.com',
    phone: '081242338891',
    title: 'Pengawas Sekolah Pembina & Pengembang Sistem',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-principal',
    name: 'Hj. Fatimah, S.Pd., M.Pd.',
    role: 'kepala_sekolah',
    schoolId: 'sch-1',
    nip: '19710314 199403 2 004',
    email: 'fatimah.kepsek@sdn1pangsid.sch.id',
    phone: '085299441234',
    title: 'Kepala UPT SDN 1 Pangkajene Sidrap',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-teacher',
    name: 'Andi Rahmawati, S.Pd.',
    role: 'guru',
    schoolId: 'sch-1',
    nip: '19840915 200902 2 007',
    email: 'andi.rahmawati@sdn1pangsid.sch.id',
    phone: '081355447788',
    title: 'Guru Kelas VI / Guru Penggerak',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-operator',
    name: 'Ilham Saputra, S.Kom.',
    role: 'operator',
    schoolId: 'sch-1',
    nip: '19920824 202012 1 008',
    email: 'ilham.operator@sdn1pangsid.sch.id',
    phone: '082188776655',
    title: 'Operator Data & Administrasi Satdik',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-quality',
    name: 'Baharuddin, S.Pd.',
    role: 'tim_mutu',
    schoolId: 'sch-1',
    nip: '19810110 200604 1 011',
    email: 'baharuddin.tpmps@sdn1pangsid.sch.id',
    phone: '081299887711',
    title: 'Koordinator Penjaminan Mutu Internal (TPMPS)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-committee',
    name: 'H. Mansyur, S.E.',
    role: 'komite',
    schoolId: 'sch-1',
    email: 'mansyur.komite@sdn1pangsid.sch.id',
    phone: '0811412233',
    title: 'Ketua Komite Sekolah',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_INDICATORS: Indicator[] = [
  // Standar 1: SKL
  {
    id: 'ind-skl-1',
    standardId: 1,
    component: 'Kompetensi Sikap & Karakter',
    code: '1.1',
    title: 'Penguatan Profil Pelajar Pancasila & Karakter Murid',
    question: 'Apakah sekolah telah memfasilitasi pembiasaan dan projek penguatan karakter beriman, berkebinekaan global, gotong royong, mandiri, bernalar kritis, dan kreatif?',
    guide: {
      meaning: 'Karakter murid dibangun melalui pembiasaan harian, budaya sekolah yang konsisten, serta projek kokurikuler terstruktur.',
      whyImportant: 'Fondasi utama mutu lulusan tidak hanya nilai angka kognitif, melainkan akhlak mulia dan ketangguhan karakter Profil Pelajar Pancasila.',
      actionSteps: [
        'Susun program pembiasaan pagi (senyum-sapa-salam, tadarus/doa, literasi 15 menit).',
        'Rancang modul kokurikuler P5/PBL sesuai tema kebutuhan sekolah.',
        'Lakukan asesmen berkala perkembangan dimensi Profil Pelajar Pancasila.'
      ],
      exampleEvidence: [
        'Jurnal kegiatan pembiasaan dan ibadah pagi sekolah.',
        'Modul Projek Penguatan Profil Pelajar Pancasila (P5) semester berjalan.',
        'Laporan asesmen atau portofolio gelar karya murid.'
      ],
      commonMistakes: [
        'Projek P5 hanya dianggap kegiatan kerajinan tanpa asesmen dimensi karakter.',
        'Dokumentasi hanya foto tanpa catatan refleksi perkembangan murid.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'Program pembiasaan apel pagi, literasi 15 menit dan P5 berjalan rutin di SDN 1 Pangsid.',
    recommendation: 'Pertahankan dan lengkapi rubrik asesmen mandiri oleh murid untuk aspek bernalar kritis.',
    assignedPicId: 'usr-teacher',
    assignedPicName: 'Andi Rahmawati, S.Pd.',
    targetDeadline: '2026-10-25',
    linkedEvidenceIds: ['ev-1', 'ev-5'],
    lastUpdated: '2026-09-20',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },
  {
    id: 'ind-skl-2',
    standardId: 1,
    component: 'Kompetensi Literasi dan Numerasi Lulusan',
    code: '1.2',
    title: 'Pencapaian Kompetensi Literasi & Numerasi Minimum',
    question: 'Apakah proporsi lulusan yang mencapai kompetensi minimum literasi dan numerasi terus meningkat sesuai target Rapor Pendidikan?',
    guide: {
      meaning: 'Kemampuan bernalar murid menggunakan teks bacaan (literasi) dan konsep angka/pola matematis (numerasi) dalam kehidupan nyata.',
      whyImportant: 'Literasi dan numerasi adalah kunci penguasaan seluruh mata pelajaran dan kesiapan jenjang lebih tinggi.',
      actionSteps: [
        'Identifikasi murid dengan capaian belum minimum melalui asesmen diagnostik.',
        'Bentuk kelompok bimbingan numerasi terfokus pada jam pengayaan.',
        'Manfaatkan sudut baca kelas dan buku non-teks berkualitas.'
      ],
      exampleEvidence: [
        'Grafik hasil Asesmen Nasional (AN) / Rapor Pendidikan 2 tahun terakhir.',
        'Lembar pemetaan hasil tes diagnostik literasi numerasi kelas awal/akhir.',
        'Daftar pinjaman pojok baca dan jurnal baca harian.'
      ],
      commonMistakes: [
        'Menganggap literasi hanya urusan guru Bahasa Indonesia dan numerasi hanya guru Matematika.',
        'Belum ada intervensi khusus terstruktur untuk murid yang tertinggal.'
      ]
    },
    targetLevel: 'ALL',
    status: 'perlu_perbaikan',
    notes: 'Skor numerasi masih berada di batas cukup (54.2), butuh penguatan metode kontekstual.',
    recommendation: 'Laksanakan program pendampingan numerasi berbasis alat peraga lokal dan bimbingan guru sebaya.',
    assignedPicId: 'usr-teacher',
    assignedPicName: 'Andi Rahmawati, S.Pd.',
    targetDeadline: '2026-10-18',
    linkedEvidenceIds: ['ev-2'],
    lastUpdated: '2026-09-18',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 2: Standar Isi
  {
    id: 'ind-si-1',
    standardId: 2,
    component: 'Kurikulum Operasional Satuan Pendidikan (KOSP)',
    code: '2.1',
    title: 'Penyusunan & Peninjauan Dokumen KOSP / Kurikulum Sekolah',
    question: 'Apakah dokumen kurikulum operasional disusun secara kontekstual, melibatkan komite sekolah, dan disahkan oleh dinas pendidikan?',
    guide: {
      meaning: 'KOSP adalah peta jalan pembelajaran yang merefleksikan karakteristik unik sekolah, kearifan lokal Sidrap, dan potensi peserta didik.',
      whyImportant: 'Tanpa KOSP kontekstual, pembelajaran menjadi seragam dan tidak menjawab kebutuhan riil lingkungan murid.',
      actionSteps: [
        'Lakukan analisis karakteristik sekolah (kondisi sarpras, guru, orang tua, budaya lokal).',
        'Adakan rapat penyusunan KOSP melibatkan Pengawas, Kepala Sekolah, Guru, dan Komite.',
        'Pastikan pengesahan resmi dari Disdikbud Kabupaten Sidrap.'
      ],
      exampleEvidence: [
        'Dokumen KOSP Tahun Ajaran berjalan yang telah disahkan Disdikbud.',
        'Berita acara, daftar hadir, dan notula rapat penyusunan kurikulum.',
        'SK Tim Pengembang Kurikulum (TPK) Satuan Pendidikan.'
      ],
      commonMistakes: [
        'Hanya "copy-paste" dokumen sekolah lain tanpa menyesuaikan karakteristik sekolah sendiri.',
        'Komite sekolah tidak dilibatkan secara aktif.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'KOSP SDN 1 Pangsid tahun 2026/2027 telah disahkan Disdikbud Sidrap pada bulan Juli 2026.',
    recommendation: 'Lakukan refleksi berkala per semester terhadap keterlaksanaan struktur kurikulum.',
    assignedPicId: 'usr-principal',
    assignedPicName: 'Hj. Fatimah, S.Pd., M.Pd.',
    targetDeadline: '2026-11-01',
    linkedEvidenceIds: ['ev-3'],
    lastUpdated: '2026-09-15',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 3: Standar Proses
  {
    id: 'ind-spro-1',
    standardId: 3,
    component: 'Perencanaan Pembelajaran',
    code: '3.1',
    title: 'Perencanaan Pembelajaran Berdiferensiasi & Berpusat pada Murid',
    question: 'Apakah perencanaan pembelajaran (Modul Ajar/RPP) memuat tujuan jelas, langkah diferensiasi proses/konten/produk, serta asesmen yang selaras?',
    guide: {
      meaning: 'Guru merancang rencana pembelajaran yang mengakomodasi keragaman kesiapan belajar, minat, dan profil belajar murid di kelas.',
      whyImportant: 'Perencanaan yang matang mencegah pembelajaran yang monoton dan memastikan setiap murid terlayani secara adil.',
      actionSteps: [
        'Lakukan asesmen diagnostik awal kognitif dan non-kognitif.',
        'Rancang modul ajar dengan diferensiasi konten atau proses yang fleksibel.',
        'Sertakan rubrik asesmen formatif yang jelas di dalam modul.'
      ],
      exampleEvidence: [
        'Sampel Modul Ajar Kurikulum Merdeka yang memuat skenario diferensiasi.',
        'Hasil asesmen diagnostik awal murid per kelas.',
        'Instrumen supervisi klinis pengawas/kepala sekolah atas perencanaan.'
      ],
      commonMistakes: [
        'Modul ajar hanya formalitas unduhan internet tanpa modifikasi sesuai kesiapan murid kelas riil.',
        'Langkah diferensiasi hanya tertulis tanpa ada penyesuaian materi/tugas di kelas.'
      ]
    },
    targetLevel: 'ALL',
    status: 'perlu_perbaikan',
    notes: 'Sebagian guru telah memiliki modul ajar, namun penyesuaian diferensiasi bagi murid berkebutuhan khusus/lambat belajar masih perlu dilatih.',
    recommendation: 'Adakan sesi berbagi praktik baik diferensiasi dalam Komunitas Belajar (Kombel) intra-sekolah.',
    assignedPicId: 'usr-teacher',
    assignedPicName: 'Andi Rahmawati, S.Pd.',
    targetDeadline: '2026-10-15',
    linkedEvidenceIds: ['ev-4'],
    lastUpdated: '2026-09-22',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },
  {
    id: 'ind-spro-2',
    standardId: 3,
    component: 'Pelaksanaan Pembelajaran',
    code: '3.2',
    title: 'Penciptaan Suasana Belajar yang Aman, Nyaman, dan Interaktif',
    question: 'Apakah proses pembelajaran di kelas menerapkan interaksi positif, bebas dari perundungan, dan mendorong murid aktif bertanya serta berdiskusi?',
    guide: {
      meaning: 'Lingkungan belajar fisik dan psikologis yang mendukung rasa ingin tahu murid tanpa rasa takut salah.',
      whyImportant: 'Murid belajar optimal jika merasa aman, dihargai, dan tidak terancam secara emosional.',
      actionSteps: [
        'Buat kesepakatan kelas bersama murid di awal tahun ajaran.',
        'Gunakan metode diskusi kelompok kecil dan demonstrasi langsung.',
        'Hindari hukuman fisik/verbal, ganti dengan disiplin positif.'
      ],
      exampleEvidence: [
        'Dokumentasi Kesepakatan / Keyakinan Kelas yang dipajang di dinding.',
        'Laporan umpan balik / survei lingkungan belajar murid.',
        'Video atau foto aktivitas pembelajaran interaktif kelompok.'
      ],
      commonMistakes: [
        'Kesepakatan kelas dibuat sepihak oleh guru sebagai aturan kaku.',
        'Metode ceramah satu arah masih mendominasi jam tatap muka.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'Keyakinan kelas telah terpasang di semua rombel kelas 1 s.d. 6. Suasana kelas kondusif dan interaktif.',
    recommendation: 'Dokumentasikan praktik disiplin positif sebagai portofolio akreditasi butir iklim belajar.',
    assignedPicId: 'usr-teacher',
    assignedPicName: 'Andi Rahmawati, S.Pd.',
    targetDeadline: '2026-10-30',
    linkedEvidenceIds: ['ev-5'],
    lastUpdated: '2026-09-21',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 4: Standar Penilaian
  {
    id: 'ind-spen-1',
    standardId: 4,
    component: 'Asesmen Formatif & Pemanfaatan Hasil',
    code: '4.1',
    title: 'Pemberian Umpan Balik Berkala Berdasarkan Asesmen Formatif',
    question: 'Apakah guru memberikan umpan balik konstruktif (deskriptif) kepada murid saat proses belajar dan menggunakan hasilnya untuk perbaikan mengajar?',
    guide: {
      meaning: 'Asesmen bukan sekadar memberi angka akhir, melainkan kompas perbaikan belajar sehari-hari (assessment for & as learning).',
      whyImportant: 'Murid membutuhkan petunjuk spesifik apa yang sudah bagus dan langkah konkrit yang perlu diperbaiki.',
      actionSteps: [
        'Gunakan teknik asesmen formatif sederhana: tiket keluar (exit ticket), kuis kilat, rubrik ceklis.',
        'Tulis catatan umpan balik deskriptif pada lembar kerja murid.',
        'Gunakan hasil asesmen untuk mengulang materi yang belum dikuasai mayoritas murid.'
      ],
      exampleEvidence: [
        'Contoh lembar tugas murid yang telah diberi umpan balik deskriptif guru.',
        'Jurnal refleksi guru mengenai tindak lanjut hasil asesmen formatif.',
        'Rubrik penilaian unjuk kerja / portofolio murid.'
      ],
      commonMistakes: [
        'Nilai tugas hanya diberi paraf atau nilai angka tanpa petunjuk cara memperbaikinya.',
        'Hasil ulangan tidak dianalisis untuk menentukan materi yang perlu remedial.'
      ]
    },
    targetLevel: 'ALL',
    status: 'perlu_perbaikan',
    notes: 'Guru sudah melakukan kuis berkala, namun catatan umpan balik deskriptif masih minim.',
    recommendation: 'Berikan panduan contoh kalimat umpan balik deskriptif yang memotivasi murid.',
    assignedPicId: 'usr-teacher',
    assignedPicName: 'Andi Rahmawati, S.Pd.',
    targetDeadline: '2026-10-20',
    linkedEvidenceIds: ['ev-4'],
    lastUpdated: '2026-09-23',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 5: PTK
  {
    id: 'ind-ptk-1',
    standardId: 5,
    component: 'Komunitas Belajar (Kombel) & Pengembangan Diri',
    code: '5.1',
    title: 'Keaktifan Komunitas Belajar (Kombel) Guru & Pemanfaatan PMM',
    question: 'Apakah Komunitas Belajar intra-sekolah aktif beroperasi rutin tiap minggu untuk mendiskusikan masalah nyata belajar murid dan pemanfaatan PMM?',
    guide: {
      meaning: 'Guru saling belajar, berefleksi, dan mencari solusi bersama secara terjadwal untuk meningkatkan kualitas pembelajaran murid.',
      whyImportant: 'Peningkatan kompetensi guru paling efektif terjadi melalui refleksi sejawat berbasis data murid di sekolah sendiri.',
      actionSteps: [
        'Terbitkan SK Kepala Sekolah tentang Tim Komunitas Belajar Sekolah.',
        'Tetapkan jadwal tetap pertemuan mingguan (misal tiap Jumat siang 13.00 - 15.00).',
        'Dokumentasikan masalah yang dibahas, kesepakatan solusi, dan notulanya.'
      ],
      exampleEvidence: [
        'SK Komunitas Belajar Intra-Sekolah SDN 1 Pangsid.',
        'Daftar hadir, foto kegiatan, dan notula sesi berbagi Kombel.',
        'Sertifikat atau aksi nyata PMM yang diunggah guru.'
      ],
      commonMistakes: [
        'Kombel hanya ada di atas kertas tanpa jadwal pertemuan nyata.',
        'Pertemuan Kombel hanya membahas administrasi umum, bukan masalah belajar murid.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'Kombel "Mabbarakka SDN 1 Pangsid" aktif berkumpul setiap Jumat siang. Terdapat 14 aksi nyata tervalidasi.',
    recommendation: 'Tingkatkan keterlibatan guru kelas rendah dalam berbagi modul ajar numerasi kelas awal.',
    assignedPicId: 'usr-quality',
    assignedPicName: 'Baharuddin, S.Pd.',
    targetDeadline: '2026-11-15',
    linkedEvidenceIds: ['ev-6'],
    lastUpdated: '2026-09-19',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 6: Sarpras
  {
    id: 'ind-sarpras-1',
    standardId: 6,
    component: 'Kelayakan Ruang & Sarana Belajar',
    code: '6.1',
    title: 'Ketersediaan & Pemeliharaan Sarana Pembelajaran serta Sanitasi',
    question: 'Apakah ruang kelas, sanitasi toilet terpisah, perpustakaan, dan area olahraga dalam kondisi bersih, layak pakai, dan terawat?',
    guide: {
      meaning: 'Fasilitas fisik yang menunjang kesehatan, keselamatan, dan kenyamanan murid dalam proses kegiatan belajar mengajar.',
      whyImportant: 'Kondisi toilet kotor atau ruang kelas bocor langsung menurunkan fokus dan kehadiran murid di sekolah.',
      actionSteps: [
        'Buat kartu kendali pemeliharaan sarpras berkala (cek mingguan).',
        'Pastikan rasio toilet murid putra dan putri memenuhi standar kelayakan.',
        'Optimalkan pencahayaan dan sirkulasi udara di setiap ruang kelas.'
      ],
      exampleEvidence: [
        'Buku inventaris barang dan sarana prasarana sekolah.',
        'Foto kondisi perpustakaan, ruang kelas, dan sanitasi toilet terkini.',
        'Laporan alokasi anggaran pemeliharaan sarana di RKAS.'
      ],
      commonMistakes: [
        'Sanitasi toilet sering kekurangan air bersih atau pintu rusak tanpa perbaikan cepat.',
        'Buku perpustakaan terkunci dan sulit diakses langsung oleh murid.'
      ]
    },
    targetLevel: 'ALL',
    status: 'perlu_perbaikan',
    notes: 'Ruang kelas dan perpustakaan baik, namun kran air di toilet murid sebelah utara perlu penggantian dan perbaikan ventilasi.',
    recommendation: 'Alokasikan pemeliharaan ringan dari BOSP tahap 2 untuk perbaikan instalasi kran toilet murid.',
    assignedPicId: 'usr-operator',
    assignedPicName: 'Ilham Saputra, S.Kom.',
    targetDeadline: '2026-10-10',
    linkedEvidenceIds: ['ev-7'],
    lastUpdated: '2026-09-17',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 7: Pengelolaan
  {
    id: 'ind-peng-1',
    standardId: 7,
    component: 'Perencanaan Berbasis Data (PBD)',
    code: '7.1',
    title: 'Penyusunan RKT & RKAS Berdasarkan Capaian Rapor Pendidikan',
    question: 'Apakah program Rencana Kerja Tahunan (RKT) dan RKAS dirumuskan berdasarkan analisis akar masalah pada Rapor Pendidikan sekolah?',
    guide: {
      meaning: 'Sekolah mengalokasikan anggaran dan tenaganya langsung pada titik terlemah yang teridentifikasi dalam data Rapor Pendidikan.',
      whyImportant: 'Mencegah pemborosan anggaran sekolah pada kegiatan yang tidak berdampak langsung terhadap mutu hasil belajar murid.',
      actionSteps: [
        'Unduh profil dan lembar rekomendasi PBD Rapor Pendidikan.',
        'Diskusikan 3 indikator prioritas terendah bersama TPMPS.',
        'Tuangkan kegiatan perbaikan langsung ke dalam format RKT dan ARKAS.'
      ],
      exampleEvidence: [
        'Dokumen Rencana Kerja Tahunan (RKT) berbasis PBD.',
        'Lembar RKAS / ARKAS yang telah disahkan Dinas Pendidikan.',
        'Matriks keterkaitan indikator Rapor Pendidikan dengan mata anggaran RKAS.'
      ],
      commonMistakes: [
        'RKT dibuat sekadar menyalin program tahun lalu tanpa melihat data Rapor Pendidikan terbaru.',
        'Anggaran pelatihan guru tidak fokus pada mata pelajaran yang capaiannya rendah.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'RKT 2026/2027 telah memuat program peningkatan kompetensi numerasi guru sesuai indikator merah di Rapor Pendidikan.',
    recommendation: 'Lakukan evaluasi tengah tahun (monev internal) keterlaksanaan anggaran program mutu.',
    assignedPicId: 'usr-principal',
    assignedPicName: 'Hj. Fatimah, S.Pd., M.Pd.',
    targetDeadline: '2026-11-20',
    linkedEvidenceIds: ['ev-8'],
    lastUpdated: '2026-09-14',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  },

  // Standar 8: Pembiayaan
  {
    id: 'ind-pem-1',
    standardId: 8,
    component: 'Transparansi & Akuntabilitas Anggaran',
    code: '8.1',
    title: 'Transparansi Penggunaan Dana BOSP & Pelaporan ARKAS',
    question: 'Apakah sekolah mempublikasikan ringkasan penerimaan dan penggunaan dana BOSP pada papan informasi terbuka serta melaporkan tepat waktu di ARKAS?',
    guide: {
      meaning: 'Pengelolaan keuangan sekolah dilakukan secara terbuka kepada warga sekolah dan masyarakat, serta tertib administrasi.',
      whyImportant: 'Membangun kepercayaan orang tua dan komite serta menjamin akuntabilitas tata kelola sekolah yang bersih.',
      actionSteps: [
        'Pasang infografis rekapitulasi BOS/BOSP pada papan pengumuman sekolah.',
        'Input SPJ dan transaksi pembelanjaan tepat waktu pada aplikasi ARKAS Kemdikbud.',
        'Sampaikan laporan pertanggungjawaban dalam rapat pleno komite sekolah.'
      ],
      exampleEvidence: [
        'Foto papan informasi penggunaan dana BOS/BOSP di dinding sekolah.',
        'Rekapitulasi tanda terima pengesahan LPJ BOSP dari Dinas Pendidikan.',
        'Berita acara rapat laporan keuangan bersama pengurus komite sekolah.'
      ],
      commonMistakes: [
        'Laporan hanya disimpan di meja bendahara tanpa diketahui orang tua/komite.',
        'Pelaporan ARKAS terlambat hingga mendekati batas cut-off pencairan berikutnya.'
      ]
    },
    targetLevel: 'ALL',
    status: 'baik',
    notes: 'Papan informasi BOS telah diperbarui per triwulan II 2026. Laporan ARKAS nihil keterlambatan.',
    recommendation: 'Sediakan kanal kotak saran atau WhatsApp informasi bagi orang tua yang ingin menanyakan rincian program.',
    assignedPicId: 'usr-operator',
    assignedPicName: 'Ilham Saputra, S.Kom.',
    targetDeadline: '2026-10-30',
    linkedEvidenceIds: ['ev-9'],
    lastUpdated: '2026-09-16',
    updatedBy: 'Drs. H. Muhammad Yunus, M.Pd.'
  }
];

export const INITIAL_EVIDENCES: Evidence[] = [
  {
    id: 'ev-1',
    schoolId: 'sch-1',
    title: 'Modul Ajar P5 Tema Kewirausahaan & Kearifan Lokal Sidrap',
    fileName: 'Modul_P5_Kewirausahaan_SDN1Pangsid.pdf',
    fileType: 'pdf',
    fileSize: '3.4 MB',
    fileUrl: '#',
    category: 'Perangkat Ajar & Modul',
    standardId: 1,
    linkedIndicatorIds: ['ind-skl-1'],
    uploadedBy: 'usr-teacher',
    uploadedByName: 'Andi Rahmawati, S.Pd.',
    uploadedRole: 'guru',
    uploadDate: '2026-09-18',
    version: 2,
    status: 'terverifikasi',
    verificationNotes: 'Dokumen sangat lengkap, memuat rubrik perkembangan dimensi mandiri dan kreatif murid.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-20',
    history: [
      { date: '2026-09-10', user: 'Andi Rahmawati, S.Pd.', action: 'Upload Dokumen Versi 1' },
      { date: '2026-09-15', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Umpan Balik: Lengkapi rubrik penilaian sikap' },
      { date: '2026-09-18', user: 'Andi Rahmawati, S.Pd.', action: 'Upload Dokumen Versi 2 (Revisi)' },
      { date: '2026-09-20', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Status disetujui (Valid)' }
    ]
  },
  {
    id: 'ev-2',
    schoolId: 'sch-1',
    title: 'Lembar Asesmen Diagnostik Numerasi Kelas Awal & Analisis',
    fileName: 'Asesmen_Diagnostik_Numerasi_2026.xlsx',
    fileType: 'sheet',
    fileSize: '1.2 MB',
    fileUrl: '#',
    category: 'Asesmen & Penilaian',
    standardId: 1,
    linkedIndicatorIds: ['ind-skl-2'],
    uploadedBy: 'usr-teacher',
    uploadedByName: 'Andi Rahmawati, S.Pd.',
    uploadedRole: 'guru',
    uploadDate: '2026-09-17',
    version: 1,
    status: 'menunggu_verifikasi',
    verificationNotes: '',
    history: [
      { date: '2026-09-17', user: 'Andi Rahmawati, S.Pd.', action: 'Upload Dokumen Versi 1' }
    ]
  },
  {
    id: 'ev-3',
    schoolId: 'sch-1',
    title: 'Dokumen KOSP SDN 1 Pangsid 2026/2027 Disahkan Disdikbud',
    fileName: 'KOSP_SDN1_Pangsid_2026_Disahkan.pdf',
    fileType: 'pdf',
    fileSize: '8.7 MB',
    fileUrl: '#',
    category: 'Dokumen Kurikulum',
    standardId: 2,
    linkedIndicatorIds: ['ind-si-1'],
    uploadedBy: 'usr-principal',
    uploadedByName: 'Hj. Fatimah, S.Pd., M.Pd.',
    uploadedRole: 'kepala_sekolah',
    uploadDate: '2026-08-05',
    version: 1,
    status: 'terverifikasi',
    verificationNotes: 'Telah divalidasi oleh Tim Kurikulum Disdikbud Kabupaten Sidrap. Sangat baik.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-08-10',
    history: [
      { date: '2026-08-05', user: 'Hj. Fatimah, S.Pd., M.Pd.', action: 'Upload KOSP Resmi' },
      { date: '2026-08-10', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Valid' }
    ]
  },
  {
    id: 'ev-4',
    schoolId: 'sch-1',
    title: 'Sampel Modul Ajar Matematika Berdiferensiasi & Hasil Formatif',
    fileName: 'Modul_Ajar_Matematika_Diferensiasi.pdf',
    fileType: 'pdf',
    fileSize: '2.8 MB',
    fileUrl: '#',
    category: 'Perangkat Ajar & Modul',
    standardId: 3,
    linkedIndicatorIds: ['ind-spro-1', 'ind-spen-1'],
    uploadedBy: 'usr-teacher',
    uploadedByName: 'Andi Rahmawati, S.Pd.',
    uploadedRole: 'guru',
    uploadDate: '2026-09-21',
    version: 1,
    status: 'perlu_perbaikan',
    verificationNotes: 'Perlu menambahkan contoh rubrik umpan balik deskriptif untuk anak yang memerlukan bimbingan tambahan.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-22',
    history: [
      { date: '2026-09-21', user: 'Andi Rahmawati, S.Pd.', action: 'Upload Dokumen' },
      { date: '2026-09-22', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Catatan Pengawas: Perlu perbaikan contoh umpan balik' }
    ]
  },
  {
    id: 'ev-5',
    schoolId: 'sch-1',
    title: 'Dokumentasi Keyakinan Kelas & Pembiasaan Budaya Positif',
    fileName: 'Foto_Keyakinan_Kelas_Dan_Apel.pdf',
    fileType: 'image',
    fileSize: '4.5 MB',
    fileUrl: '#',
    category: 'Dokumentasi Foto/Kegiatan',
    standardId: 3,
    linkedIndicatorIds: ['ind-spro-2', 'ind-skl-1'],
    uploadedBy: 'usr-teacher',
    uploadedByName: 'Andi Rahmawati, S.Pd.',
    uploadedRole: 'guru',
    uploadDate: '2026-09-12',
    version: 1,
    status: 'terverifikasi',
    verificationNotes: 'Kondisi riil kelas sangat mencerminkan iklim belajar yang aman dan berpusat pada murid.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-21',
    history: [
      { date: '2026-09-12', user: 'Andi Rahmawati, S.Pd.', action: 'Upload Dokumen' },
      { date: '2026-09-21', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Terverifikasi' }
    ]
  },
  {
    id: 'ev-6',
    schoolId: 'sch-1',
    title: 'SK Tim Kombel "Mabbarakka" & Buku Notula Pertemuan Rutin',
    fileName: 'SK_Dan_Notula_Kombel_Mabbarakka.pdf',
    fileType: 'pdf',
    fileSize: '3.1 MB',
    fileUrl: '#',
    category: 'SK & Tata Kelola',
    standardId: 5,
    linkedIndicatorIds: ['ind-ptk-1'],
    uploadedBy: 'usr-quality',
    uploadedByName: 'Baharuddin, S.Pd.',
    uploadedRole: 'tim_mutu',
    uploadDate: '2026-09-19',
    version: 1,
    status: 'terverifikasi',
    verificationNotes: 'Dokumentasi kegiatan Kombel konsisten per minggu, topik berfokus pada masalah belajar murid.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-20',
    history: [
      { date: '2026-09-19', user: 'Baharuddin, S.Pd.', action: 'Upload Dokumen' },
      { date: '2026-09-20', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Valid' }
    ]
  },
  {
    id: 'ev-7',
    schoolId: 'sch-1',
    title: 'Kartu Inventaris Sarana Prasarana & Buku Cek Pemeliharaan',
    fileName: 'Ceklis_KIR_Sarpras_2026.pdf',
    fileType: 'pdf',
    fileSize: '1.9 MB',
    fileUrl: '#',
    category: 'Sarana & Prasarana',
    standardId: 6,
    linkedIndicatorIds: ['ind-sarpras-1'],
    uploadedBy: 'usr-operator',
    uploadedByName: 'Ilham Saputra, S.Kom.',
    uploadedRole: 'operator',
    uploadDate: '2026-09-14',
    version: 1,
    status: 'menunggu_verifikasi',
    verificationNotes: '',
    history: [
      { date: '2026-09-14', user: 'Ilham Saputra, S.Kom.', action: 'Upload Dokumen' }
    ]
  },
  {
    id: 'ev-8',
    schoolId: 'sch-1',
    title: 'Rencana Kerja Tahunan (RKT) Berbasis PBD 2026/2027',
    fileName: 'RKT_PBD_SDN1_Pangsid_2026.pdf',
    fileType: 'pdf',
    fileSize: '5.2 MB',
    fileUrl: '#',
    category: 'Perencanaan Sekolah',
    standardId: 7,
    linkedIndicatorIds: ['ind-peng-1'],
    uploadedBy: 'usr-principal',
    uploadedByName: 'Hj. Fatimah, S.Pd., M.Pd.',
    uploadedRole: 'kepala_sekolah',
    uploadDate: '2026-08-20',
    version: 1,
    status: 'terverifikasi',
    verificationNotes: 'Analisis akar masalah selaras dengan indikator merah Rapor Pendidikan.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-14',
    history: [
      { date: '2026-08-20', user: 'Hj. Fatimah, S.Pd., M.Pd.', action: 'Upload Dokumen' },
      { date: '2026-09-14', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Valid' }
    ]
  },
  {
    id: 'ev-9',
    schoolId: 'sch-1',
    title: 'Foto Banner Transparansi Penggunaan BOS Tahap I & II 2026',
    fileName: 'Banner_Transparansi_BOS_2026.jpg',
    fileType: 'image',
    fileSize: '2.1 MB',
    fileUrl: '#',
    category: 'Dokumentasi Foto/Kegiatan',
    standardId: 8,
    linkedIndicatorIds: ['ind-pem-1'],
    uploadedBy: 'usr-operator',
    uploadedByName: 'Ilham Saputra, S.Kom.',
    uploadedRole: 'operator',
    uploadDate: '2026-09-15',
    version: 1,
    status: 'terverifikasi',
    verificationNotes: 'Terpasang jelas di lobi utama sekolah, mudah dibaca pengunjung dan wali murid.',
    verifiedBy: 'Drs. H. Muhammad Yunus, M.Pd.',
    verifiedDate: '2026-09-16',
    history: [
      { date: '2026-09-15', user: 'Ilham Saputra, S.Kom.', action: 'Upload Foto' },
      { date: '2026-09-16', user: 'Drs. H. Muhammad Yunus, M.Pd.', action: 'Verifikasi: Valid' }
    ]
  }
];

export const INITIAL_RAPOR: RaporItem[] = [
  {
    id: 'rp-1',
    schoolId: 'sch-1',
    domain: 'Kemampuan Literasi',
    code: 'A.1',
    score: 78.4,
    maxScore: 100,
    category: 'Cakap',
    delta: 6.2,
    isPriority: false,
    identifiedProblem: 'Kemampuan membaca teks informasi panjang masih perlu ditingkatkan pada murid kelas tinggi.',
    rootCause: 'Bahan bacaan di perpustakaan didominasi teks fiksi/cerita dongeng, teks sains kontekstual masih terbatas.',
    linkedStandardIds: [1, 3, 6],
    recommendedProgram: 'Gerakan Literasi Sains Sekolah: Penyediaan bacaan tematik alam dan bedah buku mingguan.',
    status: 'Sudah Terprogram'
  },
  {
    id: 'rp-2',
    schoolId: 'sch-1',
    domain: 'Kemampuan Numerasi',
    code: 'A.2',
    score: 54.2,
    maxScore: 100,
    category: 'Mencapai Minimum',
    delta: -2.1,
    isPriority: true,
    identifiedProblem: 'Sebagian besar murid kesulitan menyelesaikan soal numerasi penalaran berbasis pemecahan masalah (geometri & data).',
    rootCause: 'Metode pengajaran matematika masih berorientasi rumus hafalan tanpa manipulasi benda konkrit atau konteks lokal.',
    linkedStandardIds: [1, 3, 5],
    recommendedProgram: 'Workshop Pendampingan Numerasi Berbasis Alat Konkrit & Penguatan Modul Numerasi Guru Melalui Kombel.',
    status: 'Dalam Pelaksanaan'
  },
  {
    id: 'rp-3',
    schoolId: 'sch-1',
    domain: 'Karakter',
    code: 'A.3',
    score: 74.8,
    maxScore: 100,
    category: 'Cakap',
    delta: 4.5,
    isPriority: false,
    identifiedProblem: 'Dimensi kemandirian dan nalar kritis masih memiliki skor terendah dibanding gotong royong.',
    rootCause: 'Murid jarang diberikan ruang untuk memilih cara penyelesaian tugas sesuai minatnya (pembelajaran satu pola).',
    linkedStandardIds: [1, 3],
    recommendedProgram: 'Penerapan Proyek Terbuka Berbasis Pilihan (Student Agency) dalam Asesmen Pembelajaran.',
    status: 'Sudah Terprogram'
  },
  {
    id: 'rp-4',
    schoolId: 'sch-1',
    domain: 'Iklim Keamanan Sekolah',
    code: 'D.4',
    score: 83.5,
    maxScore: 100,
    category: 'Mahir',
    delta: 8.3,
    isPriority: false,
    identifiedProblem: 'Telah terbentuk TPPK aktif dan mekanisme pelaporan perundungan aman.',
    rootCause: 'Kerjasama erat antara guru piket, wali kelas, dan orang tua dalam memantau interaksi murid.',
    linkedStandardIds: [3, 7],
    recommendedProgram: 'Pertahankan sistem pos pantau ramah anak dan sosialisasi berkala TPPK bersama komite.',
    status: 'Tercapai'
  },
  {
    id: 'rp-5',
    schoolId: 'sch-1',
    domain: 'Iklim Kebinekaan',
    code: 'D.8',
    score: 79.1,
    maxScore: 100,
    category: 'Cakap',
    delta: 3.1,
    isPriority: false,
    identifiedProblem: 'Pemahaman moderasi beragama dan toleransi budaya Bugis-Makassar berjalan baik.',
    rootCause: 'Pembiasaan mengenakan pakaian adat lokal dan perayaan hari besar secara inklusif.',
    linkedStandardIds: [1, 2],
    recommendedProgram: 'Pekan Budaya Kearifan Lokal Sidrap dan dialog persahabatan antar murid.',
    status: 'Sudah Terprogram'
  },
  {
    id: 'rp-6',
    schoolId: 'sch-1',
    domain: 'Kualitas Pembelajaran',
    code: 'D.1',
    score: 66.8,
    maxScore: 100,
    category: 'Cakap',
    delta: 1.8,
    isPriority: true,
    identifiedProblem: 'Dukungan umpan balik konstruktif guru dan manajemen kelas diferensiasi masih belum merata di semua guru.',
    rootCause: 'Kurangnya praktik supervisi klinis yang berfokus pada pendampingan (coaching), bukan sekadar inspeksi administratif.',
    linkedStandardIds: [3, 4, 5],
    recommendedProgram: 'Supervisi Akademik Berbasis Coaching Klinis oleh Kepala Sekolah & Pengawas Pembina.',
    status: 'Dalam Pelaksanaan'
  }
];

export const INITIAL_RTL: ActionPlan[] = [
  {
    id: 'rtl-1',
    schoolId: 'sch-1',
    title: 'Pelatihan Guru: Pembuatan Alat Peraga Numerasi Konkret Berbasis Bahan Lokal Sidrap',
    problemSource: 'Rapor Pendidikan A.2 (Numerasi 54.2) & Indikator 1.2',
    rootCause: 'Pembelajaran matematika masih abstrak dan minim media manipulatif.',
    standardId: 3,
    indicatorId: 'ind-skl-2',
    indicatorCode: '1.2',
    activity: 'Workshop 2 hari di Kombel intra-sekolah membuat kit numerasi manipulatif bagi guru kelas 1 - 6.',
    picId: 'usr-teacher',
    picName: 'Andi Rahmawati, S.Pd.',
    picRole: 'Guru Kelas VI / Guru Penggerak',
    targetDate: '2026-10-15',
    resources: 'BOS Reguler Pembinaan Guru, Bahan Karton & Alat Peraga Lokal',
    successIndicator: '100% guru kelas memiliki minimal 2 set media manipulatif numerasi dan diterapkan di kelas.',
    status: 'berjalan',
    linkedEvidenceIds: ['ev-2'],
    notes: 'Jadwal workshop telah disepakati pada pertemuan Kombel tanggal 5 Oktober.',
    supervisorNotes: 'Bagus. Pastikan alat peraga disesuaikan dengan fase A, B, dan C.',
    createdAt: '2026-09-18',
    updatedAt: '2026-09-22'
  },
  {
    id: 'rtl-2',
    schoolId: 'sch-1',
    title: 'Penyempurnaan Rubrik Umpan Balik Deskriptif pada Lembar Kerja Formatif',
    problemSource: 'Temuan Asesmen Standar Penilaian (Indikator 4.1)',
    rootCause: 'Umpan balik pada tugas murid masih berupa skor/paraf tanpa arahan koreksi spesifik.',
    standardId: 4,
    indicatorId: 'ind-spen-1',
    indicatorCode: '4.1',
    activity: 'Penyusunan format "Catatan Bintang & Tangga Perbaikan" dan ujicoba pada tugas tematik/matematika.',
    picId: 'usr-teacher',
    picName: 'Andi Rahmawati, S.Pd.',
    picRole: 'Guru Kelas VI',
    targetDate: '2026-10-10',
    resources: 'Modul Bimbingan Guru, Buku Refleksi',
    successIndicator: 'Minimal 5 sampel pekerjaan murid per kelas memiliki umpan balik deskriptif terverifikasi.',
    status: 'perlu_perbaikan',
    linkedEvidenceIds: ['ev-4'],
    notes: 'Revisi lembar kerja belum selesai karena ada kegiatan tengah semester.',
    supervisorNotes: 'Segera selesaikan sebelum tanggal 10 Oktober agar dapat diverifikasi saat kunjungan berikutnya.',
    createdAt: '2026-09-22',
    updatedAt: '2026-09-24'
  },
  {
    id: 'rtl-3',
    schoolId: 'sch-1',
    title: 'Perbaikan Instalasi Kran Air & Sanitasi Toilet Murid Sayap Utara',
    problemSource: 'Temuan Sarana Prasarana (Indikator 6.1)',
    rootCause: 'Kran air bocor dan ventilasi toilet sayap utara perlu penambahan exhaust sederhana.',
    standardId: 6,
    indicatorId: 'ind-sarpras-1',
    indicatorCode: '6.1',
    activity: 'Penggantian 4 unit kran air, perbaikan engsel pintu, dan penambahan tempat sabun cuci tangan.',
    picId: 'usr-operator',
    picName: 'Ilham Saputra, S.Kom.',
    picRole: 'Operator & Sarpras',
    targetDate: '2026-10-05',
    resources: 'Dana Pemeliharaan Ringan BOSP Tahap 2',
    successIndicator: 'Semua kran mengalir lancar, tidak ada genangan, toilet bersih dan harum.',
    status: 'berjalan',
    linkedEvidenceIds: ['ev-7'],
    notes: 'Tukang sedang mengerjakan instalasi pipa baru.',
    supervisorNotes: 'Prioritaskan kebersihan dan ketersediaan sabun agar mendukung PHBS sekolah.',
    createdAt: '2026-09-17',
    updatedAt: '2026-09-23'
  },
  {
    id: 'rtl-4',
    schoolId: 'sch-1',
    title: 'Penyusunan Jadwal & Notula Rutin Komunitas Belajar Triwulan IV',
    problemSource: 'Standar PTK (Indikator 5.1)',
    rootCause: 'Diperlukan kesinambungan agenda setelah pergantian semester.',
    standardId: 5,
    indicatorId: 'ind-ptk-1',
    indicatorCode: '5.1',
    activity: 'Menyusun kalender belajar Kombel dan penentuan narasumber internal tiap Jumat.',
    picId: 'usr-quality',
    picName: 'Baharuddin, S.Pd.',
    picRole: 'Koordinator TPMPS',
    targetDate: '2026-09-30',
    resources: 'Ruang Multimedia & Bahan Tayang',
    successIndicator: 'Jadwal 8 sesi pertemuan triwulan IV terdokumentasi dan ditandatangani Kepala Sekolah.',
    status: 'selesai',
    linkedEvidenceIds: ['ev-6'],
    notes: 'Jadwal telah ditandatangani dan dipajang di ruang guru.',
    supervisorNotes: 'Sangat baik dan terencana. Lanjutkan!',
    createdAt: '2026-09-10',
    updatedAt: '2026-09-20'
  },
  {
    id: 'rtl-5',
    schoolId: 'sch-1',
    title: 'Simulasi Visitasi Internal Kesiapan Akreditasi 2027',
    problemSource: 'Persiapan Visitasi Akreditasi BAN-PDM',
    rootCause: 'Menghindari penumpukan dokumen di akhir periode masa berlaku akreditasi.',
    standardId: 7,
    indicatorId: 'ind-peng-1',
    indicatorCode: '7.1',
    activity: 'Pengecekan kecukupan bukti 8 SNP bersama Tim Pengawas Pembina Disdikbud.',
    picId: 'usr-principal',
    picName: 'Hj. Fatimah, S.Pd., M.Pd.',
    picRole: 'Kepala Sekolah',
    targetDate: '2026-11-15',
    resources: 'Bank Bukti Digital SIPANDU SEKOLAH',
    successIndicator: 'Tingkat kesiapan bukti digital mencapai di atas 85% tanpa ada standar tertinggal.',
    status: 'belum_mulai',
    linkedEvidenceIds: ['ev-1', 'ev-3', 'ev-8'],
    notes: 'Dijadwalkan setelah kelengkapan bukti sarpras dan penilaian terpenuhi.',
    createdAt: '2026-09-25',
    updatedAt: '2026-09-25'
  }
];

export const INITIAL_VISITS: VisitRecord[] = [
  {
    id: 'vst-1',
    schoolId: 'sch-1',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap',
    date: '2026-09-20',
    supervisorId: 'usr-supervisor',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    purpose: 'Pendampingan Tindak Lanjut Rapor Pendidikan & Verifikasi Dokumen 8 SNP',
    attendees: ['Hj. Fatimah, S.Pd., M.Pd. (Kepsek)', 'Andi Rahmawati, S.Pd. (Guru/TPMPS)', 'Ilham Saputra, S.Kom. (Operator)', 'H. Mansyur, S.E. (Komite)'],
    findings: [
      'Program pembiasaan apel pagi dan literasi berjalan tertib.',
      'Data Rapor Pendidikan menunjukkan peningkatan literasi, namun numerasi masih memerlukan intervensi media konkret.',
      'Bank bukti digital sudah mulai terisi dengan modul P5 dan KOSP resmi.',
      'Toilet murid sebelah utara membutuhkan perbaikan kran air.'
    ],
    recommendations: [
      'Fokuskan agenda Kombel minggu ini pada workshop pembuatan alat peraga matematika sederhana.',
      'Sempurnakan rubrik asesmen formatif dengan umpan balik tertulis yang memberi petunjuk perbaikan bagi murid.',
      'Alokasikan BOSP pemeliharaan ringan untuk perbaikan sanitasi toilet.'
    ],
    agreement: 'Kepala Sekolah bersama tim TPMPS menyepakati target penyelesaian bukti perbaikan numerasi dan sarpras paling lambat 15 Oktober 2026.',
    picAssigned: 'Andi Rahmawati, S.Pd. & Ilham Saputra, S.Kom.',
    targetCompletionDate: '2026-10-15',
    nextVisitDate: '2026-10-22',
    status: 'Selesai',
    notes: 'Kunjungan berjalan sangat kondusif. Warga sekolah menunjukkan komitmen tinggi terhadap budaya mutu berkelanjutan.'
  },
  {
    id: 'vst-2',
    schoolId: 'sch-2',
    schoolName: 'UPT SMPN 1 Maritengngae',
    date: '2026-09-23',
    supervisorId: 'usr-supervisor',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    purpose: 'Supervisi Klinis Pembelajaran Guru Mapel IPA & Matematika',
    attendees: ['Drs. Rusli Basri, M.M. (Kepsek)', 'Nurlina, S.Pd., M.Pd. (Ketua Mutu)', 'Guru IPA dan Matematika (6 orang)'],
    findings: [
      'Laboratorium IPA dimanfaatkan dengan baik untuk praktikum kalor dan listrik statis.',
      'Guru sudah menggunakan Chromebook bantuan pemerintah dalam asesmen formatif.',
      'Perlu penambahan rubrik penilaian profil pelajar pancasila dimensi bernalar kritis.'
    ],
    recommendations: [
      'Gunakan bank soal kontekstual AKM untuk mengasah daya analisis peserta didik.',
      'Adakan pameran karya sains sederhana pada peringatan Hari Guru.'
    ],
    agreement: 'Tim guru sains menyusun rubrik terpadu dan mengunggahnya ke Bank Bukti SIPANDU sebelum kunjungan verifikasi berikutnya.',
    picAssigned: 'Nurlina, S.Pd., M.Pd.',
    targetCompletionDate: '2026-10-18',
    nextVisitDate: '2026-10-28',
    status: 'Selesai'
  },
  {
    id: 'vst-3',
    schoolId: 'sch-1',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap',
    date: '2026-10-22',
    supervisorId: 'usr-supervisor',
    supervisorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    purpose: 'Monitoring Keterlaksanaan RTL Numerasi & Pengecekan Sanitasi Toilet',
    attendees: ['Kepala Sekolah', 'Guru Kelas VI', 'Pengurus Komite'],
    findings: [],
    recommendations: [],
    agreement: 'Melihat langsung keterterapan media manipulatif numerasi di kelas 4, 5, dan 6.',
    picAssigned: 'Andi Rahmawati, S.Pd.',
    targetCompletionDate: '2026-10-22',
    nextVisitDate: '2026-11-20',
    status: 'Terjadwal'
  }
];

export const INITIAL_REGULATIONS: Regulation[] = [
  {
    id: 'reg-1',
    codeNo: 'Permendikbudristek No. 5 Tahun 2022',
    year: 2022,
    title: 'Standar Kompetensi Lulusan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah',
    shortTitle: 'Permendikbudristek No. 5/2022 (SKL)',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '2022-03-01',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: 'Menetapkan rumusan kualifikasi kemampuan lulusan yang mencakup sikap beriman, berakhlak mulia, bernalar kritis, kreatif, mandiri, dan bergotong royong pada Kurikulum Merdeka.',
    linkedStandardIds: [1],
    isActive: true,
    lastValidated: '2026-09-01'
  },
  {
    id: 'reg-2',
    codeNo: 'Permendikbudristek No. 7 Tahun 2022',
    year: 2022,
    title: 'Standar Isi pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah',
    shortTitle: 'Permendikbudristek No. 7/2022 (Standar Isi)',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '2022-03-01',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: 'Memuat ruang lingkup materi esensial sesuai fase perkembangan peserta didik untuk mendukung fleksibilitas pembelajaran dan muatan kearifan lokal.',
    linkedStandardIds: [2],
    isActive: true,
    lastValidated: '2026-09-01'
  },
  {
    id: 'reg-3',
    codeNo: 'Permendikbudristek No. 16 Tahun 2022',
    year: 2022,
    title: 'Standar Proses pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Jenjang Pendidikan Menengah',
    shortTitle: 'Permendikbudristek No. 16/2022 (Standar Proses)',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '2022-04-06',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: 'Menegaskan perencanaan, pelaksanaan, dan penilaian proses pembelajaran yang berpusat pada murid melalui diferensiasi, interaksi positif, dan refleksi berkala.',
    linkedStandardIds: [3],
    isActive: true,
    lastValidated: '2026-09-01'
  },
  {
    id: 'reg-4',
    codeNo: 'Permendikbudristek No. 21 Tahun 2022',
    year: 2022,
    title: 'Standar Penilaian Pendidikan pada Jenjang Pendidikan Dasar dan Jenjang Pendidikan Menengah',
    shortTitle: 'Permendikbudristek No. 21/2022 (Standar Penilaian)',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '2022-04-28',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: 'Mengatur mekanisme penilaian formatif dan sumatif, pergeseran paradigma penilaian berkeadilan, umpan balik deskriptif, dan kriteria ketuntasan tujuan pembelajaran (KKTP).',
    linkedStandardIds: [4],
    isActive: true,
    lastValidated: '2026-09-01'
  },
  {
    id: 'reg-5',
    codeNo: 'Permendikbudristek No. 47 Tahun 2023',
    year: 2023,
    title: 'Standar Pengelolaan pada Pendidikan Anak Usia Dini, Jenjang Pendidikan Dasar, dan Pendidikan Menengah',
    shortTitle: 'Permendikbudristek No. 47/2023 (Standar Pengelolaan)',
    category: 'Standar Nasional Pendidikan',
    effectiveDate: '2023-08-15',
    officialSource: 'jdih.kemdikbud.go.id',
    summary: 'Memuat tata cara perencanaan berbasis data (PBD), kepemimpinan instruksional kepala sekolah, iklim kerja kolaboratif, serta pelibatan komite dan masyarakat.',
    linkedStandardIds: [7],
    isActive: true,
    lastValidated: '2026-09-01'
  },
  {
    id: 'reg-6',
    codeNo: 'Keputusan Mendikbudristek No. 246/O/2024',
    year: 2024,
    title: 'Instrumen Akreditasi Satuan Pendidikan (IASP) BAN-PDM',
    shortTitle: 'Instrumen Akreditasi BAN-PDM Terkini',
    category: 'Regulasi Akreditasi',
    effectiveDate: '2024-05-10',
    officialSource: 'ban-pdm.kemdikbud.go.id',
    summary: 'Instrumen akreditasi terbaru berfokus pada 4 komponen utama: Kinerja Pendidik, Kepemimpinan Kepala Satuan Pendidikan, Iklim Lingkungan Belajar, dan Hasil Belajar Murid.',
    linkedStandardIds: [1, 3, 5, 7],
    isActive: true,
    lastValidated: '2026-09-01'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-28 09:14',
    actorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    actorRole: 'pengawas',
    action: 'Verifikasi Bukti Digital',
    targetEntity: 'Bank Bukti (ev-1)',
    details: 'Menyetujui dokumen Modul Ajar P5 Tema Kewirausahaan dengan status Terverifikasi (🟢 Valid).',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap'
  },
  {
    id: 'log-2',
    timestamp: '2026-09-28 08:30',
    actorName: 'Andi Rahmawati, S.Pd.',
    actorRole: 'guru',
    action: 'Unggah Bukti Revisi',
    targetEntity: 'Bank Bukti (ev-4)',
    details: 'Mengunggah sampel modul ajar matematika diferensiasi versi 2.',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap'
  },
  {
    id: 'log-3',
    timestamp: '2026-09-27 14:20',
    actorName: 'Hj. Fatimah, S.Pd., M.Pd.',
    actorRole: 'kepala_sekolah',
    action: 'Pemberian Tugas RTL',
    targetEntity: 'Rencana Tindak Lanjut (rtl-1)',
    details: 'Menugaskan Andi Rahmawati, S.Pd. sebagai penanggung jawab pelatihan alat peraga numerasi target 15 Okt 2026.',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap'
  },
  {
    id: 'log-4',
    timestamp: '2026-09-26 11:05',
    actorName: 'Drs. H. Muhammad Yunus, M.Pd.',
    actorRole: 'pengawas',
    action: 'Pembaruan Asesmen 8 SNP',
    targetEntity: 'Standar Proses (Indikator 3.2)',
    details: 'Mengubah status indikator 3.2 dari 🟡 Perlu Diperbaiki menjadi 🟢 Baik.',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap'
  },
  {
    id: 'log-5',
    timestamp: '2026-09-25 15:45',
    actorName: 'Ilham Saputra, S.Kom.',
    actorRole: 'operator',
    action: 'Pembaruan Profil Sekolah',
    targetEntity: 'Data Sarpras Sekolah',
    details: 'Memperbarui jumlah rombel menjadi 12 dan peserta didik menjadi 382 siswa.',
    schoolName: 'UPT SDN 1 Pangkajene Sidrap'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Bukti Menunggu Verifikasi',
    message: 'UPT SDN 1 Pangkajene Sidrap mengunggah 2 dokumen bukti baru yang membutuhkan tinjauan pengawas.',
    timestamp: '20 menit yang lalu',
    isRead: false,
    type: 'action',
    targetRole: 'pengawas',
    schoolId: 'sch-1',
    linkAction: 'bank-bukti'
  },
  {
    id: 'notif-2',
    title: 'Catatan Perbaikan Bukti Ajar',
    message: 'Pengawas memberikan catatan pada Modul Ajar Matematika Diferensiasi. Silakan periksa kolom catatan pembina.',
    timestamp: '2 jam yang lalu',
    isRead: false,
    type: 'warning',
    targetRole: 'guru',
    schoolId: 'sch-1',
    linkAction: 'bank-bukti'
  },
  {
    id: 'notif-3',
    title: 'Tindak Lanjut Mendekati Tenggat Waktu',
    message: 'Program perbaikan sanitasi toilet murid (PIC: Operator) jatuh tempo dalam 7 hari.',
    timestamp: '1 hari yang lalu',
    isRead: false,
    type: 'warning',
    targetRole: 'kepala_sekolah',
    schoolId: 'sch-1',
    linkAction: 'rtl'
  },
  {
    id: 'notif-4',
    title: 'Agenda Kunjungan Pengawas Disepakati',
    message: 'Kunjungan pemantauan RTL dan keterterapan numerasi dijadwalkan pada 22 Oktober 2026.',
    timestamp: '2 hari yang lalu',
    isRead: true,
    type: 'info',
    targetRole: 'ALL',
    schoolId: 'sch-1',
    linkAction: 'kunjungan'
  }
];
