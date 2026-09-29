import React, { useState } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

      {/* Sidebar for Desktop / Tablet */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenUserProfile={() => setIsUserProfileModalOpen(true)}
        onOpenCloudStorage={() => setIsCloudStorageOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col flex-1 pb-16 lg:pb-8">
        
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
