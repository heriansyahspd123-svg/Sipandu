export type UserRole = 
  | 'pengawas'
  | 'kepala_sekolah'
  | 'guru'
  | 'operator'
  | 'tim_mutu'
  | 'komite';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  schoolId: string;
  nip?: string;
  email: string;
  phone?: string;
  avatar?: string;
  title?: string;
}

export type SchoolLevel = 'SD' | 'SMP';
export type AccreditationGrade = 'A' | 'B' | 'C' | 'Belum Terakreditasi';

export interface SchoolFacilities {
  classrooms: number;
  library: boolean;
  labIpa?: boolean;
  labKomputer?: boolean;
  pojokBaca?: boolean;
  uks: boolean;
  sanitasiBaik: boolean;
  internetAccess: boolean;
  lapanganOlahraga: boolean;
}

export interface TPMPSMember {
  id: string;
  name: string;
  role: string;
  nip?: string;
  nuptk?: string;
  position: string;
  phone?: string;
  tasks?: string;
}

export interface TPMPSProgram {
  id: string;
  stage: 'Pemetaan Mutu (EDS & 8 SNP)' | 'Perencanaan PBD & RKT' | 'Pelaksanaan RTL Mutu' | 'Monev Internal TPMPS' | 'Penyusunan Rekomendasi';
  activity: string;
  pic: string;
  schedule: string;
  status: 'Belum Terlaksana' | 'Sedang Berjalan' | 'Selesai';
  targetOutput: string;
  notes?: string;
}

export interface TPMPSData {
  skNumber: string;
  skDate: string;
  academicYear: string;
  establishedBy: string;
  notes?: string;
  members: TPMPSMember[];
  programs: TPMPSProgram[];
}

export interface School {
  id: string;
  npsn: string;
  name: string;
  level: SchoolLevel;
  status: 'Negeri' | 'Swasta';
  address: string;
  desaKelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  principalName: string;
  principalNip?: string;
  supervisorName: string;
  teacherCount: number;
  staffCount: number;
  studentCount: number;
  rombelCount: number;
  academicYear: string;
  lastAccreditation: AccreditationGrade;
  lastAccreditationYear: number;
  facilities: SchoolFacilities;
  qualityTeam: { name: string; role: string }[];
  tpmpsData?: TPMPSData;
  qualityHistory?: { year: string; score: number; stage: string }[];
  specialNotes?: string;
  photoUrl?: string;
}

export type AssessmentStatus = 'baik' | 'perlu_perbaikan' | 'belum_memenuhi' | 'belum_dinilai';
export type EvidenceStatus = 'terverifikasi' | 'perlu_perbaikan' | 'tidak_sesuai' | 'menunggu_verifikasi' | 'belum_ada';
export type RTLStatus = 'belum_mulai' | 'berjalan' | 'menunggu_verifikasi' | 'perlu_perbaikan' | 'selesai' | 'terlambat';

export interface SNPStandard {
  id: number;
  code: string;
  name: string;
  shortName: string;
  description: string;
  focusArea: string;
  iconName: string;
  color: string;
}

export interface IndicatorGuide {
  meaning: string;
  whyImportant: string;
  actionSteps: string[];
  exampleEvidence: string[];
  commonMistakes: string[];
}

export interface Indicator {
  id: string;
  standardId: number;
  component: string;
  code: string;
  title: string;
  question: string;
  guide: IndicatorGuide;
  targetLevel: 'ALL' | 'SD' | 'SMP';
  status: AssessmentStatus;
  notes?: string;
  recommendation?: string;
  assignedPicId?: string;
  assignedPicName?: string;
  targetDeadline?: string;
  linkedEvidenceIds: string[];
  lastUpdated: string;
  updatedBy: string;
}

export interface EvidenceHistory {
  date: string;
  user: string;
  action: string;
  notes?: string;
}

export interface Evidence {
  id: string;
  schoolId: string;
  title: string;
  fileName: string;
  fileType: 'pdf' | 'doc' | 'image' | 'sheet' | 'link';
  fileSize: string;
  fileUrl?: string;
  category: string;
  standardId: number;
  linkedIndicatorIds: string[];
  uploadedBy: string;
  uploadedByName: string;
  uploadedRole: UserRole;
  uploadDate: string;
  version: number;
  status: EvidenceStatus;
  verificationNotes?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  history: EvidenceHistory[];
}

export type RaporDomain = 
  | 'Kemampuan Literasi'
  | 'Kemampuan Numerasi'
  | 'Karakter'
  | 'Iklim Keamanan Sekolah'
  | 'Iklim Kebinekaan'
  | 'Kualitas Pembelajaran';

export interface RaporItem {
  id: string;
  schoolId: string;
  domain: RaporDomain;
  code: string;
  score: number;
  maxScore: number;
  category: 'Mahir' | 'Cakap' | 'Mencapai Minimum' | 'Perlu Peningkatan';
  delta: number; // vs previous year
  isPriority: boolean;
  identifiedProblem: string;
  rootCause: string;
  linkedStandardIds: number[];
  recommendedProgram: string;
  status: 'Perlu Rencana' | 'Sudah Terprogram' | 'Dalam Pelaksanaan' | 'Tercapai';
}

export interface ActionPlan {
  id: string;
  schoolId: string;
  title: string;
  problemSource: string;
  rootCause: string;
  standardId: number;
  indicatorId?: string;
  indicatorCode?: string;
  activity: string;
  picId: string;
  picName: string;
  picRole: string;
  targetDate: string;
  resources: string;
  successIndicator: string;
  status: RTLStatus;
  linkedEvidenceIds: string[];
  notes?: string;
  supervisorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VisitRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  date: string;
  supervisorId: string;
  supervisorName: string;
  purpose: string;
  attendees: string[];
  findings: string[];
  recommendations: string[];
  agreement: string;
  picAssigned: string;
  targetCompletionDate: string;
  nextVisitDate: string;
  status: 'Terjadwal' | 'Selesai' | 'Dibatalkan';
  notes?: string;
}

export interface Regulation {
  id: string;
  codeNo: string;
  year: number;
  title: string;
  shortTitle: string;
  category: string;
  effectiveDate: string;
  officialSource: string;
  summary: string;
  linkedStandardIds: number[];
  isActive: boolean;
  lastValidated: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'warning' | 'success' | 'urgent' | 'action';
  targetRole?: UserRole | 'ALL';
  schoolId?: string;
  linkAction?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetEntity: string;
  details: string;
  schoolName?: string;
}

export interface IA2024Item {
  id: number; // 1 to 14
  code: string; // 'Butir 1', 'Butir 2', etc.
  componentId: 1 | 2 | 3 | 4;
  componentTitle: string;
  statement: string;
  focusExplanation: string;
  linkedStandardIds: number[]; // 1 to 8 SNP
  linkedStandardNames: string[];
  manifestationInAction: string; // Kinerja nyata yang dinilai asesor di lapangan
  triangulationMethod: string; // Observasi kelas, wawancara, telaah bukti digital
  // Interactive inputs per school:
  currentLevel: 1 | 2 | 3 | 4; // 1: Perlu Peningkatan, 2: Dasar/Cukup, 3: Baik/Cakap, 4: Unggul/Mahir
  schoolReflection: string; // Catatan refleksi kinerja nyata sekolah
  linkedEvidenceIds: string[]; // Bukti digital terpaut dari bank bukti
  updatedAt?: string;
}

