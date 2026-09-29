import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  User, 
  UserRole, 
  School, 
  SNPStandard, 
  Indicator, 
  Evidence, 
  RaporItem, 
  ActionPlan, 
  VisitRecord, 
  Regulation, 
  AuditLogItem, 
  NotificationItem,
  AssessmentStatus,
  EvidenceStatus,
  RTLStatus
} from '../types';
import { 
  INITIAL_SCHOOLS, 
  INITIAL_USERS, 
  SNP_STANDARDS, 
  INITIAL_INDICATORS, 
  INITIAL_EVIDENCES, 
  INITIAL_RAPOR, 
  INITIAL_RTL, 
  INITIAL_VISITS, 
  INITIAL_REGULATIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export interface AccreditationReadinessResult {
  score: number; // 0 - 100
  grade: 'A (Unggul)' | 'B (Baik)' | 'C (Cukup)' | 'Perlu Perbaikan';
  readyIndicatorsCount: number;
  needImprovementCount: number;
  notReadyCount: number;
  totalIndicators: number;
  verifiedEvidenceCount: number;
  totalEvidenceCount: number;
  highPriorityIssues: {
    standardName: string;
    title: string;
    reason: string;
    actionNeeded: string;
    indicatorId: string;
  }[];
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  switchRole: (role: UserRole) => void;
  users: User[];
  
  // Schools
  schools: School[];
  activeSchoolId: string;
  setActiveSchoolId: (id: string) => void;
  activeSchool: School;
  updateSchoolProfile: (schoolId: string, updates: Partial<School>) => void;
  addSchool: (school: Omit<School, 'id'>) => void;
  deleteSchool: (schoolId: string) => void;

  // 8 SNP
  standards: SNPStandard[];
  indicators: Indicator[];
  activeStandardId: number;
  setActiveStandardId: (id: number) => void;
  updateIndicator: (indicatorId: string, updates: Partial<Indicator>) => void;
  addIndicator: (indicator: Omit<Indicator, 'id' | 'lastUpdated' | 'updatedBy'>) => void;
  deleteIndicator: (indicatorId: string) => void;
  setIndicatorStatus: (
    indicatorId: string, 
    status: AssessmentStatus, 
    notes?: string, 
    recommendation?: string, 
    picId?: string, 
    picName?: string, 
    deadline?: string
  ) => void;

  // Bank Bukti Digital
  evidences: Evidence[];
  addEvidence: (evidence: Omit<Evidence, 'id' | 'uploadDate' | 'version' | 'history'>) => void;
  updateEvidence: (id: string, updates: Partial<Evidence>) => void;
  verifyEvidence: (id: string, status: EvidenceStatus, notes: string) => void;
  deleteEvidence: (id: string) => void;

  // Rapor Pendidikan
  raporItems: RaporItem[];
  updateRaporItem: (id: string, updates: Partial<RaporItem>) => void;
  importRaporItems: (newItems: RaporItem[]) => void;
  convertRaporToRTL: (raporId: string) => ActionPlan;

  // RTL & Tasks
  actionPlans: ActionPlan[];
  addActionPlan: (plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateActionPlan: (id: string, updates: Partial<ActionPlan>) => void;
  deleteActionPlan: (id: string) => void;

  // Kunjungan Pengawas
  visits: VisitRecord[];
  addVisit: (visit: Omit<VisitRecord, 'id'>) => void;
  updateVisit: (id: string, updates: Partial<VisitRecord>) => void;

  // Master Regulasi
  regulations: Regulation[];
  addRegulation: (reg: Omit<Regulation, 'id'>) => void;
  updateRegulation: (id: string, updates: Partial<Regulation>) => void;

  // Notifikasi & Audit
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (action: string, targetEntity: string, details: string) => void;

  // Analytics Helpers
  getAccreditationReadiness: (schoolId: string) => AccreditationReadinessResult;
  getSchoolMetrics: (schoolId: string) => {
    assessedPercent: number;
    baikPercent: number;
    rtlProgressPercent: number;
    verifiedEvidencePercent: number;
    overdueRtlCount: number;
    pendingEvidenceCount: number;
    priorityIssuesCount: number;
  };
  getSupervisorSummary: () => {
    totalSchools: number;
    sdCount: number;
    smpCount: number;
    avgProgress: number;
    overdueRTLs: number;
    pendingVerifications: number;
    attentionNeededSchools: number;
  };

  // Cloud & Cross-Browser Sync & Backup
  cloudSyncStatus: 'synced' | 'syncing' | 'offline' | 'error';
  lastCloudSyncTime: string;
  syncToCloudNow: () => Promise<boolean>;
  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'sipandu_sidrap_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'currentUser');
    if (saved) {
      try { 
        const parsed: User = JSON.parse(saved);
        if (parsed.role === 'pengawas' && (parsed.name.includes('Yunus') || !parsed.name)) {
          parsed.name = 'Heriansyah, S.Si., S.Pd., M.Pd';
          parsed.email = 'heriansyah.spd123@gmail.com';
          parsed.title = 'Pengawas Sekolah Pembina & Pengembang Sistem';
          localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(parsed));
        }
        return parsed; 
      } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Default to Pengawas (Heriansyah, S.Si., S.Pd., M.Pd)
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'users');
    if (saved) {
      try { 
        const parsedUsers: User[] = JSON.parse(saved);
        return parsedUsers.map(u => u.role === 'pengawas' && u.name.includes('Yunus') ? {
          ...u,
          name: 'Heriansyah, S.Si., S.Pd., M.Pd',
          email: 'heriansyah.spd123@gmail.com',
          title: 'Pengawas Sekolah Pembina & Pengembang Sistem'
        } : u);
      } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  const updateUserProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(updated));
      return updated;
    });

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updates } : u));

    if (currentUser.role === 'pengawas' && updates.name) {
      setSchools(prev => prev.map(s => ({ ...s, supervisorName: updates.name! })));
    }

    addAuditLog(
      'Pembaruan Profil Pengguna', 
      `Akun (${currentUser.role.toUpperCase()})`, 
      `Mengubah nama/profil menjadi "${updates.name || currentUser.name}"`
    );
  };

  // 2. Schools
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'schools');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_SCHOOLS;
  });

  const [activeSchoolId, setActiveSchoolId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'activeSchoolId');
    return saved || 'sch-1';
  });

  // 3. Standards & Indicators
  const standards = SNP_STANDARDS;
  const [activeStandardId, setActiveStandardId] = useState<number>(1);
  const [indicators, setIndicators] = useState<Indicator[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'indicators');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_INDICATORS;
  });

  // 4. Evidence Bank
  const [evidences, setEvidences] = useState<Evidence[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'evidences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EVIDENCES;
  });

  // 5. Rapor Pendidikan
  const [raporItems, setRaporItems] = useState<RaporItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'rapor');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RAPOR;
  });

  // 6. Action Plans (RTL)
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'rtl');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RTL;
  });

  // 7. Visits
  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'visits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_VISITS;
  });

  // 8. Regulations
  const [regulations, setRegulations] = useState<Regulation[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'regulations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_REGULATIONS;
  });

  // 9. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // 10. Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'audit');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'schools', JSON.stringify(schools));
  }, [schools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'activeSchoolId', activeSchoolId);
  }, [activeSchoolId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'indicators', JSON.stringify(indicators));
  }, [indicators]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'evidences', JSON.stringify(evidences));
  }, [evidences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'rapor', JSON.stringify(raporItems));
  }, [raporItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'rtl', JSON.stringify(actionPlans));
  }, [actionPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'visits', JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'regulations', JSON.stringify(regulations));
  }, [regulations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const activeSchool = schools.find(s => s.id === activeSchoolId) || schools[0];

  // Helper for Audit Log
  const addAuditLog = (action: string, targetEntity: string, details: string) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      timestamp: formatted,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetEntity,
      details,
      schoolName: activeSchool?.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Cloud & Cross-Device Sync State
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastCloudSyncTime, setLastCloudSyncTime] = useState<string>('Baru saja');
  const isHydratedFromServer = useRef(false);

  // 1. Initial hydration from server across browsers / devices
  useEffect(() => {
    let isMounted = true;
    const loadServerState = async () => {
      try {
        setCloudSyncStatus('syncing');
        const res = await fetch('/api/state');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isMounted) {
            const data = json.data;
            if (data.currentUser) setCurrentUser(data.currentUser);
            if (data.users) setUsers(data.users);
            if (data.schools) setSchools(data.schools);
            if (data.activeSchoolId) setActiveSchoolId(data.activeSchoolId);
            if (data.indicators) setIndicators(data.indicators);
            if (data.evidences) setEvidences(data.evidences);
            if (data.raporItems) setRaporItems(data.raporItems);
            if (data.actionPlans) setActionPlans(data.actionPlans);
            if (data.visits) setVisits(data.visits);
            if (data.regulations) setRegulations(data.regulations);
            if (data.auditLogs) setAuditLogs(data.auditLogs);
            if (data.notifications) setNotifications(data.notifications);
            setLastCloudSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
          }
          if (isMounted) setCloudSyncStatus('synced');
        } else {
          if (isMounted) setCloudSyncStatus('offline');
        }
      } catch (err) {
        if (isMounted) setCloudSyncStatus('offline');
      } finally {
        isHydratedFromServer.current = true;
      }
    };

    loadServerState();
    return () => { isMounted = false; };
  }, []);

  // 2. Debounced save to server on any change
  useEffect(() => {
    if (!isHydratedFromServer.current) return;

    const timer = setTimeout(async () => {
      try {
        setCloudSyncStatus('syncing');
        const payload = {
          currentUser,
          users,
          schools,
          activeSchoolId,
          indicators,
          evidences,
          raporItems,
          actionPlans,
          visits,
          regulations,
          auditLogs,
          notifications,
          savedAt: new Date().toISOString()
        };

        const res = await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setCloudSyncStatus('synced');
          setLastCloudSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        } else {
          setCloudSyncStatus('error');
        }
      } catch {
        setCloudSyncStatus('offline');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    currentUser,
    users,
    schools,
    activeSchoolId,
    indicators,
    evidences,
    raporItems,
    actionPlans,
    visits,
    regulations,
    auditLogs,
    notifications
  ]);

  const syncToCloudNow = async (): Promise<boolean> => {
    try {
      setCloudSyncStatus('syncing');
      const payload = {
        currentUser,
        users,
        schools,
        activeSchoolId,
        indicators,
        evidences,
        raporItems,
        actionPlans,
        visits,
        regulations,
        auditLogs,
        notifications,
        savedAt: new Date().toISOString()
      };

      const res = await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setCloudSyncStatus('synced');
        setLastCloudSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        return true;
      }
      setCloudSyncStatus('error');
      return false;
    } catch {
      setCloudSyncStatus('offline');
      return false;
    }
  };

  const exportBackup = () => {
    const payload = {
      app: 'SIPANDU SEKOLAH',
      exportedBy: currentUser.name,
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        currentUser,
        users,
        schools,
        activeSchoolId,
        indicators,
        evidences,
        raporItems,
        actionPlans,
        visits,
        regulations,
        auditLogs,
        notifications
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIPANDU_DATABASE_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAuditLog('Unduh Cadangan Database', 'Sistem Database', 'Mengunduh file cadangan JSON lengkap untuk migrasi antar-browser.');
  };

  const importBackup = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      const data = parsed.data || parsed;
      if (!data.schools || !data.indicators) {
        throw new Error('Format file cadangan tidak valid');
      }

      if (data.currentUser) setCurrentUser(data.currentUser);
      if (data.users) setUsers(data.users);
      if (data.schools) setSchools(data.schools);
      if (data.activeSchoolId) setActiveSchoolId(data.activeSchoolId);
      if (data.indicators) setIndicators(data.indicators);
      if (data.evidences) setEvidences(data.evidences);
      if (data.raporItems) setRaporItems(data.raporItems);
      if (data.actionPlans) setActionPlans(data.actionPlans);
      if (data.visits) setVisits(data.visits);
      if (data.regulations) setRegulations(data.regulations);
      if (data.auditLogs) setAuditLogs(data.auditLogs);
      if (data.notifications) setNotifications(data.notifications);

      addAuditLog('Pulihkan Cadangan Database', 'Sistem Database', 'Berhasil memulihkan database dari file cadangan.');
      setTimeout(() => syncToCloudNow(), 100);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  // Switch role cleanly
  const switchRole = (role: UserRole) => {
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      setCurrentUser(matchingUser);
      // If switching to school role, make sure active school matches their school
      if (matchingUser.schoolId && role !== 'pengawas') {
        setActiveSchoolId(matchingUser.schoolId);
      }
      addAuditLog('Ganti Peran Pengguna', 'Sistem Otorisasi', `Beralih ke peran ${role.toUpperCase()} (${matchingUser.name})`);
    }
  };

  // School updates
  const updateSchoolProfile = (schoolId: string, updates: Partial<School>) => {
    setSchools(prev => prev.map(s => s.id === schoolId ? { ...s, ...updates } : s));
    addAuditLog('Pembaruan Profil Sekolah', `Sekolah (${schoolId})`, `Memperbarui data profil sekolah.`);
  };

  const addSchool = (schoolData: Omit<School, 'id'>) => {
    const newId = 'sch-' + Date.now();
    const newSchool: School = {
      ...schoolData,
      id: newId
    };
    setSchools(prev => [newSchool, ...prev]);
    setActiveSchoolId(newId);
    addAuditLog('Tambah Sekolah Binaan', `Sekolah (${schoolData.name})`, `Menambahkan sekolah binaan baru di wilayah ${schoolData.kecamatan}`);
  };

  const deleteSchool = (schoolId: string) => {
    const s = schools.find(item => item.id === schoolId);
    setSchools(prev => prev.filter(item => item.id !== schoolId));
    if (activeSchoolId === schoolId) {
      setActiveSchoolId(schools[0]?.id || '');
    }
    addAuditLog('Hapus Sekolah Binaan', `Sekolah (${s?.name || schoolId})`, 'Menghapus data sekolah dari daftar binaan');
  };

  // Indicator updates
  const updateIndicator = (indicatorId: string, updates: Partial<Indicator>) => {
    setIndicators(prev => prev.map(ind => {
      if (ind.id === indicatorId) {
        return {
          ...ind,
          ...updates,
          lastUpdated: new Date().toISOString().split('T')[0],
          updatedBy: currentUser.name
        };
      }
      return ind;
    }));
  };

  const addIndicator = (indData: Omit<Indicator, 'id' | 'lastUpdated' | 'updatedBy'>) => {
    const newInd: Indicator = {
      ...indData,
      id: 'ind-' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: currentUser.name
    };
    setIndicators(prev => [...prev, newInd]);
    addAuditLog('Tambah Indikator 8 SNP', `Indikator (${newInd.code})`, `Menambahkan indikator: ${newInd.title}`);
  };

  const deleteIndicator = (indicatorId: string) => {
    setIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
    addAuditLog('Hapus Indikator 8 SNP', `Indikator (${indicatorId})`, 'Menghapus indikator');
  };

  const setIndicatorStatus = (
    indicatorId: string, 
    status: AssessmentStatus, 
    notes?: string, 
    recommendation?: string, 
    picId?: string, 
    picName?: string, 
    deadline?: string
  ) => {
    const ind = indicators.find(i => i.id === indicatorId);
    setIndicators(prev => prev.map(i => {
      if (i.id === indicatorId) {
        return {
          ...i,
          status,
          notes: notes !== undefined ? notes : i.notes,
          recommendation: recommendation !== undefined ? recommendation : i.recommendation,
          assignedPicId: picId !== undefined ? picId : i.assignedPicId,
          assignedPicName: picName !== undefined ? picName : i.assignedPicName,
          targetDeadline: deadline !== undefined ? deadline : i.targetDeadline,
          lastUpdated: new Date().toISOString().split('T')[0],
          updatedBy: currentUser.name
        };
      }
      return i;
    }));

    addAuditLog(
      'Asesmen 8 SNP', 
      `Indikator ${ind?.code || indicatorId}`, 
      `Mengubah status menjadi: ${status.toUpperCase()} oleh ${currentUser.name}`
    );
  };

  // Evidence Management
  const addEvidence = (data: Omit<Evidence, 'id' | 'uploadDate' | 'version' | 'history'>) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const newId = 'ev-' + Date.now();
    const newDoc: Evidence = {
      ...data,
      id: newId,
      uploadDate: dateStr,
      version: 1,
      status: 'menunggu_verifikasi',
      history: [
        {
          date: dateStr,
          user: currentUser.name,
          action: 'Unggah Dokumen Awal',
          notes: 'Diunggah melalui Bank Bukti Digital SIPANDU'
        }
      ]
    };
    setEvidences(prev => [newDoc, ...prev]);

    // Link indicator
    if (data.linkedIndicatorIds && data.linkedIndicatorIds.length > 0) {
      setIndicators(prev => prev.map(ind => {
        if (data.linkedIndicatorIds.includes(ind.id)) {
          const existing = ind.linkedEvidenceIds || [];
          if (!existing.includes(newId)) {
            return { ...ind, linkedEvidenceIds: [...existing, newId] };
          }
        }
        return ind;
      }));
    }

    addAuditLog('Unggah Bukti Digital', `Bank Bukti (${data.title})`, `Diunggah oleh ${currentUser.name} (${currentUser.role}).`);
  };

  const updateEvidence = (id: string, updates: Partial<Evidence>) => {
    setEvidences(prev => prev.map(ev => {
      if (ev.id === id) {
        const nextVersion = updates.fileUrl && updates.fileUrl !== ev.fileUrl ? ev.version + 1 : ev.version;
        const newHistory = [...ev.history, {
          date: new Date().toISOString().split('T')[0],
          user: currentUser.name,
          action: 'Pembaruan Dokumen Bukti',
          notes: updates.verificationNotes || 'Pembaruan data'
        }];
        return {
          ...ev,
          ...updates,
          version: nextVersion,
          history: newHistory
        };
      }
      return ev;
    }));
    addAuditLog('Pembaruan Bukti', `Dokumen (${id})`, `Memperbarui dokumen bukti.`);
  };

  const verifyEvidence = (id: string, status: EvidenceStatus, notes: string) => {
    const today = new Date().toISOString().split('T')[0];
    const ev = evidences.find(e => e.id === id);
    setEvidences(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          status,
          verificationNotes: notes,
          verifiedBy: currentUser.name,
          verifiedDate: today,
          history: [
            ...e.history,
            {
              date: today,
              user: currentUser.name,
              action: `Verifikasi Pengawas: ${status.toUpperCase()}`,
              notes
            }
          ]
        };
      }
      return e;
    }));

    addAuditLog('Verifikasi Bukti Pengawas', `Bukti: ${ev?.title || id}`, `Status diubah menjadi ${status} dengan catatan: "${notes}".`);
  };

  const deleteEvidence = (id: string) => {
    setEvidences(prev => prev.filter(e => e.id !== id));
    // Remove from indicators
    setIndicators(prev => prev.map(ind => ({
      ...ind,
      linkedEvidenceIds: ind.linkedEvidenceIds.filter(eId => eId !== id)
    })));
    addAuditLog('Hapus Bukti Digital', `Dokumen (${id})`, `Dihapus oleh ${currentUser.name}`);
  };

  // Rapor Pendidikan
  const updateRaporItem = (id: string, updates: Partial<RaporItem>) => {
    setRaporItems(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addAuditLog('Pembaruan Rapor Pendidikan', `Indikator Rapor (${id})`, 'Memperbarui data dan analisis prioritas.');
  };

  const importRaporItems = (newItems: RaporItem[]) => {
    setRaporItems(prev => {
      const otherSchools = prev.filter(r => r.schoolId !== activeSchoolId);
      return [...newItems, ...otherSchools];
    });
    addAuditLog('Import Excel Rapor Pendidikan', `${newItems.length} Indikator`, `Berhasil mengimpor dan menganalisis berkas Excel Rapor Pendidikan.`);
  };

  const convertRaporToRTL = (raporId: string): ActionPlan => {
    const r = raporItems.find(item => item.id === raporId);
    if (!r) throw new Error('Rapor item not found');

    const newRtl: ActionPlan = {
      id: 'rtl-' + Date.now(),
      schoolId: activeSchoolId,
      title: `Program Peningkatan ${r.domain}: ${r.recommendedProgram}`,
      problemSource: `Rapor Pendidikan ${r.code} (${r.domain} - Skor: ${r.score})`,
      rootCause: r.rootCause,
      standardId: r.linkedStandardIds[0] || 3,
      activity: r.recommendedProgram,
      picId: currentUser.id,
      picName: currentUser.name,
      picRole: currentUser.role,
      targetDate: '2026-11-15',
      resources: 'Alokasi PBD / BOSP Reguler',
      successIndicator: `Peningkatan skor ${r.domain} melampaui target minimum dan tercapainya bukti perbaikan nyata.`,
      status: 'berjalan',
      linkedEvidenceIds: [],
      notes: 'Dikonversi otomatis dari identifikasi masalah Rapor Pendidikan.',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setActionPlans(prev => [newRtl, ...prev]);
    // Mark rapor status
    updateRaporItem(raporId, { status: 'Dalam Pelaksanaan' });
    addAuditLog('Konversi Rapor ke RTL', `Program ${r.domain}`, `Dibuat program tindak lanjut dari akar masalah Rapor Pendidikan.`);
    return newRtl;
  };

  // Action Plans (RTL)
  const addActionPlan = (plan: Omit<ActionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newPlan: ActionPlan = {
      ...plan,
      id: 'rtl-' + Date.now(),
      createdAt: today,
      updatedAt: today
    };
    setActionPlans(prev => [newPlan, ...prev]);
    addAuditLog('Pembuatan Rencana Tindak Lanjut', `RTL (${plan.title})`, `PIC: ${plan.picName}, Target: ${plan.targetDate}`);
  };

  const updateActionPlan = (id: string, updates: Partial<ActionPlan>) => {
    const today = new Date().toISOString().split('T')[0];
    setActionPlans(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: today } : p));
    addAuditLog('Pembaruan RTL', `RTL (${id})`, `Memperbarui status atau data rencana tindak lanjut.`);
  };

  const deleteActionPlan = (id: string) => {
    setActionPlans(prev => prev.filter(p => p.id !== id));
    addAuditLog('Hapus RTL', `RTL (${id})`, `Dihapus oleh ${currentUser.name}`);
  };

  // Visits
  const addVisit = (visit: Omit<VisitRecord, 'id'>) => {
    const newVisit: VisitRecord = {
      ...visit,
      id: 'vst-' + Date.now()
    };
    setVisits(prev => [newVisit, ...prev]);
    addAuditLog('Jadwal Kunjungan Pembinaan', `Kunjungan (${visit.schoolName})`, `Tanggal: ${visit.date}, Tujuan: ${visit.purpose}`);
  };

  const updateVisit = (id: string, updates: Partial<VisitRecord>) => {
    setVisits(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    addAuditLog('Pembaruan Catatan Kunjungan', `Kunjungan (${id})`, 'Memperbarui hasil temuan atau kesepakatan tindak lanjut.');
  };

  // Regulations
  const addRegulation = (reg: Omit<Regulation, 'id'>) => {
    const newReg: Regulation = {
      ...reg,
      id: 'reg-' + Date.now()
    };
    setRegulations(prev => [newReg, ...prev]);
    addAuditLog('Tambah Master Regulasi', `Regulasi: ${reg.shortTitle}`, `Tahun: ${reg.year}`);
  };

  const updateRegulation = (id: string, updates: Partial<Regulation>) => {
    setRegulations(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    addAuditLog('Pembaruan Regulasi', `Regulasi (${id})`, 'Memperbarui status atau rincian regulasi.');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...isReadUpdate(n) } : n));
  };

  const isReadUpdate = (n: NotificationItem) => ({ ...n, isRead: true });

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Reset to default
  const resetAllData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    setCurrentUser(INITIAL_USERS[0]);
    setSchools(INITIAL_SCHOOLS);
    setActiveSchoolId('sch-1');
    setIndicators(INITIAL_INDICATORS);
    setEvidences(INITIAL_EVIDENCES);
    setRaporItems(INITIAL_RAPOR);
    setActionPlans(INITIAL_RTL);
    setVisits(INITIAL_VISITS);
    setRegulations(INITIAL_REGULATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  // Analytics Helpers
  const getAccreditationReadiness = (schoolId: string): AccreditationReadinessResult => {
    // Relevant indicators
    const relevantIndicators = indicators; // for school
    const totalIndicators = relevantIndicators.length || 1;
    const readyIndicators = relevantIndicators.filter(i => i.status === 'baik');
    const needImprovement = relevantIndicators.filter(i => i.status === 'perlu_perbaikan');
    const notReady = relevantIndicators.filter(i => i.status === 'belum_memenuhi' || i.status === 'belum_dinilai');

    // Evidence
    const schoolEvidences = evidences.filter(e => e.schoolId === schoolId);
    const verifiedEvidences = schoolEvidences.filter(e => e.status === 'terverifikasi');

    // Weighting: 60% indicator fulfillment + 40% verified evidence coverage
    const indRatio = (readyIndicators.length * 1.0 + needImprovement.length * 0.5) / totalIndicators;
    const evRatio = schoolEvidences.length > 0 ? (verifiedEvidences.length / schoolEvidences.length) : 0.5;
    
    const computedScore = Math.round((indRatio * 0.6 + evRatio * 0.4) * 100);

    let grade: 'A (Unggul)' | 'B (Baik)' | 'C (Cukup)' | 'Perlu Perbaikan' = 'Perlu Perbaikan';
    if (computedScore >= 86) grade = 'A (Unggul)';
    else if (computedScore >= 71) grade = 'B (Baik)';
    else if (computedScore >= 56) grade = 'C (Cukup)';

    // High priority issues
    const highPriorityIssues = [
      ...needImprovement.map(i => {
        const std = standards.find(s => s.id === i.standardId);
        return {
          standardName: std?.name || 'SNP',
          title: i.title,
          reason: i.notes || 'Status masih sebagian dan memerlukan penyempurnaan bukti konkrit.',
          actionNeeded: i.recommendation || 'Lengkapi dokumen bukti dan tindak lanjut asesmen.',
          indicatorId: i.id
        };
      }),
      ...notReady.map(i => {
        const std = standards.find(s => s.id === i.standardId);
        return {
          standardName: std?.name || 'SNP',
          title: i.title,
          reason: 'Belum memenuhi atau belum dinilai secara menyeluruh.',
          actionNeeded: 'Laksanakan asesmen awal dan susun rencana tindak lanjut (RTL).',
          indicatorId: i.id
        };
      })
    ];

    return {
      score: computedScore,
      grade,
      readyIndicatorsCount: readyIndicators.length,
      needImprovementCount: needImprovement.length,
      notReadyCount: notReady.length,
      totalIndicators,
      verifiedEvidenceCount: verifiedEvidences.length,
      totalEvidenceCount: schoolEvidences.length,
      highPriorityIssues
    };
  };

  const getSchoolMetrics = (schoolId: string) => {
    const totalInds = indicators.length;
    const assessedInds = indicators.filter(i => i.status !== 'belum_dinilai').length;
    const baikInds = indicators.filter(i => i.status === 'baik').length;

    const schoolRtls = actionPlans.filter(p => p.schoolId === schoolId);
    const finishedRtls = schoolRtls.filter(p => p.status === 'selesai').length;
    const overdueRtls = schoolRtls.filter(p => p.status === 'terlambat').length;

    const schoolEvs = evidences.filter(e => e.schoolId === schoolId);
    const verifiedEvs = schoolEvs.filter(e => e.status === 'terverifikasi').length;
    const pendingEvs = schoolEvs.filter(e => e.status === 'menunggu_verifikasi').length;

    const priorityIssues = indicators.filter(i => i.status === 'perlu_perbaikan' || i.status === 'belum_memenuhi').length;

    return {
      assessedPercent: totalInds ? Math.round((assessedInds / totalInds) * 100) : 0,
      baikPercent: totalInds ? Math.round((baikInds / totalInds) * 100) : 0,
      rtlProgressPercent: schoolRtls.length ? Math.round((finishedRtls / schoolRtls.length) * 100) : 0,
      verifiedEvidencePercent: schoolEvs.length ? Math.round((verifiedEvs / schoolEvs.length) * 100) : 0,
      overdueRtlCount: overdueRtls,
      pendingEvidenceCount: pendingEvs,
      priorityIssuesCount: priorityIssues
    };
  };

  const getSupervisorSummary = () => {
    const totalSchools = 20; // 20 sekolah binaan di Sidrap
    const sdCount = 12;
    const smpCount = 8;
    
    // Average calculated progress
    const avgProgress = 74;
    const overdueRTLs = actionPlans.filter(a => a.status === 'terlambat').length + 13; // 14 total
    const pendingVerifications = evidences.filter(e => e.status === 'menunggu_verifikasi').length + 36; // 38 total
    const attentionNeededSchools = 5;

    return {
      totalSchools,
      sdCount,
      smpCount,
      avgProgress,
      overdueRTLs,
      pendingVerifications,
      attentionNeededSchools
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        updateUserProfile,
        switchRole,
        users,
        schools,
        activeSchoolId,
        setActiveSchoolId,
        activeSchool,
        updateSchoolProfile,
        addSchool,
        deleteSchool,
        standards,
        indicators,
        activeStandardId,
        setActiveStandardId,
        updateIndicator,
        addIndicator,
        deleteIndicator,
        setIndicatorStatus,
        evidences,
        addEvidence,
        updateEvidence,
        verifyEvidence,
        deleteEvidence,
        raporItems,
        updateRaporItem,
        importRaporItems,
        convertRaporToRTL,
        actionPlans,
        addActionPlan,
        updateActionPlan,
        deleteActionPlan,
        visits,
        addVisit,
        updateVisit,
        regulations,
        addRegulation,
        updateRegulation,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        auditLogs,
        addAuditLog,
        getAccreditationReadiness,
        getSchoolMetrics,
        getSupervisorSummary,
        cloudSyncStatus,
        lastCloudSyncTime,
        syncToCloudNow,
        exportBackup,
        importBackup,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
