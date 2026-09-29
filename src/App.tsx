import React, { useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar, NavTab } from './components/common/Sidebar';
import { MobileNav } from './components/common/MobileNav';
import { UniversalSearchModal } from './components/common/UniversalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { SchoolProfileModal } from './components/schools/SchoolProfileModal';
import { UserProfileModal } from './components/common/UserProfileModal';
import { CloudStorageModal } from './components/common/CloudStorageModal';
import { SchoolBinaanView } from './components/schools/SchoolBinaanView';
import { SNPModule } from './components/snp/SNPModule';
import { BankBukti } from './components/evidence/BankBukti';
import { UploadEvidenceModal } from './components/evidence/UploadEvidenceModal';
import { RaporPendidikanView } from './components/rapor/RaporPendidikanView';
import { RTLManagement } from './components/rtl/RTLManagement';
import { TaskAssignmentView } from './components/tasks/TaskAssignmentView';
import { MonitoringView } from './components/monitoring/MonitoringView';
import { SupervisorVisits } from './components/visits/SupervisorVisits';
import { AccreditationSim } from './components/accreditation/AccreditationSim';
import { BenangMerahIA2024View } from './components/accreditation/BenangMerahIA2024View';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { MasterRegulasi } from './components/regulations/MasterRegulasi';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { TPMPSView } from './components/tpmps/TPMPSView';
import { SupervisorDashboard } from './components/dashboard/SupervisorDashboard';
import { PrincipalDashboard } from './components/dashboard/PrincipalDashboard';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { OtherRolesDashboard } from './components/dashboard/OtherRolesDashboard';

function MainAppContent() {
  const { currentUser } = useApp();

  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sipandu_sidebar_open');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.innerWidth >= 1024;
    }
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sipandu_sidebar_open', String(next));
      }
      return next;
    });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sipandu_sidebar_open', 'false');
    }
  };

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);
  const [isCloudStorageOpen, setIsCloudStorageOpen] = useState(false);
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadIndicatorId, setUploadIndicatorId] = useState<string | undefined>(undefined);
  const [uploadStandardId, setUploadStandardId] = useState<number | undefined>(undefined);

  const handleOpenUploadForIndicator = (indicatorId?: string, standardId?: number) => {
    setUploadIndicatorId(indicatorId);
    setUploadStandardId(standardId);
    setIsUploadModalOpen(true);
  };

  const handleNavigateTab = (tab: string, meta?: any) => {
    setCurrentTab(tab as NavTab);
  };

  // Render appropriate dashboard based on User Role (PRD RBAC)
  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'pengawas':
        return (
          <SupervisorDashboard 
            onNavigateTab={handleNavigateTab} 
            onOpenUpload={() => handleOpenUploadForIndicator()} 
            onOpenSchoolProfile={() => setIsProfileModalOpen(true)}
            onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
          />
        );
      case 'kepala_sekolah':
        return (
          <PrincipalDashboard 
            onNavigateTab={handleNavigateTab} 
            onOpenSchoolProfile={() => setIsProfileModalOpen(true)} 
          />
        );
      case 'guru':
        return (
          <TeacherDashboard 
            onNavigateTab={handleNavigateTab} 
            onOpenUpload={handleOpenUploadForIndicator} 
          />
        );
      default:
        return (
          <OtherRolesDashboard 
            onNavigateTab={handleNavigateTab} 
            onOpenUpload={() => handleOpenUploadForIndicator()} 
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Offline Banner for PWA compliance */}
      <OfflineBanner />

      {/* Sidebar for Desktop / Tablet / Mobile */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        onOpenCloudStorage={() => setIsCloudStorageOpen(true)}
      />

      {/* Main Layout Area - Flexible transition based on sidebar visibility */}
      <div className={`flex flex-col flex-1 pb-16 lg:pb-8 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
      }`}>
        
        {/* Top Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenSchoolProfile={() => setIsProfileModalOpen(true)}
          onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
          onOpenCloudStorage={() => setIsCloudStorageOpen(true)}
        />

        {/* Page Content View Router */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && renderDashboard()}
          {currentTab === 'sekolah' && (
            <SchoolBinaanView 
              onOpenProfile={() => setIsProfileModalOpen(true)}
              onNavigateTab={handleNavigateTab}
            />
          )}
          {currentTab === 'tpmps' && (
            <TPMPSView 
              onNavigateTab={handleNavigateTab} 
            />
          )}
          {currentTab === 'snp' && (
            <SNPModule 
              onOpenUploadForIndicator={handleOpenUploadForIndicator}
              onNavigateTab={handleNavigateTab}
            />
          )}
          {currentTab === 'benang_merah' && (
            <BenangMerahIA2024View 
              onNavigateTab={handleNavigateTab} 
            />
          )}
          {currentTab === 'bank_bukti' && (
            <BankBukti 
              onOpenUpload={() => handleOpenUploadForIndicator()} 
            />
          )}
          {currentTab === 'rapor' && (
            <RaporPendidikanView 
              onNavigateTab={handleNavigateTab} 
            />
          )}
          {currentTab === 'rtl' && (
            <RTLManagement 
              onNavigateTab={handleNavigateTab}
              onOpenUploadForRTL={handleOpenUploadForIndicator}
            />
          )}
          {currentTab === 'tugas' && (
            <TaskAssignmentView 
              onOpenUpload={handleOpenUploadForIndicator}
              onNavigateTab={handleNavigateTab}
            />
          )}
          {currentTab === 'monitoring' && (
            <MonitoringView 
              onNavigateTab={handleNavigateTab} 
            />
          )}
          {currentTab === 'kunjungan' && (
            <SupervisorVisits />
          )}
          {currentTab === 'akreditasi' && (
            <AccreditationSim 
              onNavigateTab={handleNavigateTab} 
            />
          )}
          {currentTab === 'laporan' && (
            <ReportGenerator />
          )}
          {currentTab === 'regulasi' && (
            <MasterRegulasi />
          )}
          {currentTab === 'audit' && (
            <AuditTrailView />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Universal Search Modal (Cmd+K) */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateTab}
      />

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* School Profile Details Modal */}
      <SchoolProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNavigateTab={handleNavigateTab}
      />

      {/* User Profile / Nama Admin Edit Modal */}
      <UserProfileModal
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />

      {/* Cloud Storage & Cross-Browser Sync Modal */}
      <CloudStorageModal
        isOpen={isCloudStorageOpen}
        onClose={() => setIsCloudStorageOpen(false)}
      />

      {/* Upload Evidence Modal */}
      <UploadEvidenceModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setUploadIndicatorId(undefined);
          setUploadStandardId(undefined);
        }}
        defaultIndicatorId={uploadIndicatorId}
        defaultStandardId={uploadStandardId}
      />

      {/* Floating reopen button when sidebar is closed on desktop */}
      {!isSidebarOpen && (
        <button
          type="button"
          onClick={() => {
            setIsSidebarOpen(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('sipandu_sidebar_open', 'true');
            }
          }}
          className="fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 text-white shadow-xl border border-slate-700/80 backdrop-blur-md transition-all hover:scale-105 cursor-pointer text-xs font-bold animate-in fade-in"
          title="Buka Menu Sidebar"
          aria-label="Buka Menu Sidebar"
        >
          <PanelLeft className="w-4 h-4 text-teal-400" />
          <span>Buka Menu</span>
        </button>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
