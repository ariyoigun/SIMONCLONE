import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ExecutiveDashboard from './views/ExecutiveDashboard';
import MasterPekerjaanView from './views/MasterPekerjaanView';
import MonitoringPaketView from './views/MonitoringPaketView';
import PreContractView from './views/PreContractView';
import PhysicalProgressView from './views/PhysicalProgressView';
import FinancialProgressView from './views/FinancialProgressView';
import SpjAdministrationView from './views/SpjAdministrationView';
import SipdSummaryView from './views/SipdSummaryView';
import ReportView from './views/ReportView';
import PendapatanView from './views/PendapatanView';
import LoginView from './views/LoginView';
import LandingView from './views/LandingView';

// Modals
import RoleSwitcherModal from './components/RoleSwitcherModal';
import YearManagementModal from './components/YearManagementModal';
import UserManagementModal from './components/UserManagementModal';
import SystemSettingsModal from './components/SystemSettingsModal';
import ProjectModal from './components/ProjectModal';
import ProjectDetailModal from './components/ProjectDetailModal';
import QuickProgressModal from './components/QuickProgressModal';
import ImportExportModal from './components/ImportExportModal';

import { CheckCircle2, AlertCircle, Info, Clock } from 'lucide-react';
import { getLatestProjectUpdateFormatted } from './utils/dateUtils';

const MainAppContent = () => {
  const { activeTab, toast, isLoggedIn, accessibleProjects = [], activeYear = 2026 } = useApp();

  // Guest & Public Portal Navigation State
  const [guestScreen, setGuestScreen] = useState('landing'); // 'landing' | 'login'
  const [showPublicPortal, setShowPublicPortal] = useState(false);

  // Modals state
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Project Modals
  const [projectModalState, setProjectModalState] = useState({
    isOpen: false,
    projectData: null
  });

  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    project: null
  });

  const [quickUpdateState, setQuickUpdateState] = useState({
    isOpen: false,
    project: null
  });

  const [importExportModalState, setImportExportModalState] = useState({
    isOpen: false,
    tab: 'import'
  });

  const handleOpenImportExportModal = (tab = 'import') => {
    setImportExportModalState({
      isOpen: true,
      tab
    });
  };

  const handleCloseImportExportModal = () => {
    setImportExportModalState({
      isOpen: false,
      tab: 'import'
    });
  };

  const handleOpenProjectModal = (project = null) => {
    setProjectModalState({
      isOpen: true,
      projectData: project
    });
  };

  const handleCloseProjectModal = () => {
    setProjectModalState({
      isOpen: false,
      projectData: null
    });
  };

  const handleViewProject = (project) => {
    setDetailModalState({
      isOpen: true,
      project
    });
  };

  const handleCloseDetailModal = () => {
    setDetailModalState({
      isOpen: false,
      project: null
    });
  };

  const handleQuickUpdate = (project) => {
    setQuickUpdateState({
      isOpen: true,
      project
    });
  };

  const handleCloseQuickUpdate = () => {
    setQuickUpdateState({
      isOpen: false,
      project: null
    });
  };

  // 1. If not logged in, show Public Landing Page or Login Screen
  if (!isLoggedIn) {
    return (
      <>
        {guestScreen === 'landing' ? (
          <LandingView onGoToLogin={() => setGuestScreen('login')} />
        ) : (
          <LoginView onBackToLanding={() => setGuestScreen('landing')} />
        )}
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
              {toast.type === 'info' && <Info size={18} color="#0ea5e9" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // 2. If logged in, but user wants to preview the Public Landing Page
  if (showPublicPortal) {
    return (
      <>
        <LandingView
          onBackToInternal={() => setShowPublicPortal(false)}
          onGoToLogin={() => setShowPublicPortal(false)}
        />
        {toast && (
          <div className="toast-container">
            <div className={`toast toast-${toast.type}`}>
              {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
              {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
              {toast.type === 'info' && <Info size={18} color="#0ea5e9" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        onOpenYearModal={() => setIsYearModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenRoleModal={() => setIsRoleModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenPublicPortal={() => setShowPublicPortal(true)}
        onOpenImportExportModal={handleOpenImportExportModal}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          onOpenYearModal={() => setIsYearModalOpen(true)}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
          onOpenPublicPortal={() => setShowPublicPortal(true)}
        />

        <main className="content-area">
          {activeTab === 'dashboard' && (
            <ExecutiveDashboard
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onQuickUpdate={handleQuickUpdate}
            />
          )}

          {activeTab === 'monitoring_paket' && (
            <MonitoringPaketView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onQuickUpdate={handleQuickUpdate}
            />
          )}

          {activeTab === 'master_pekerjaan' && (
            <MasterPekerjaanView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onOpenImportExportModal={handleOpenImportExportModal}
            />
          )}

          {activeTab === 'prakontrak' && (
            <PreContractView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
            />
          )}

          {activeTab === 'fisik' && (
            <PhysicalProgressView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onQuickUpdate={handleQuickUpdate}
            />
          )}

          {activeTab === 'keuangan' && (
            <FinancialProgressView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
              onQuickUpdate={handleQuickUpdate}
            />
          )}

          {activeTab === 'spj_keuangan' && (
            <SpjAdministrationView
              onViewProject={handleViewProject}
            />
          )}

          {activeTab === 'sipd_summary' && (
            <SipdSummaryView
              onOpenProjectModal={handleOpenProjectModal}
              onViewProject={handleViewProject}
            />
          )}

          {activeTab === 'pendapatan' && (
            <PendapatanView />
          )}

          {activeTab === 'laporan' && (
            <ReportView onOpenSettingsModal={() => setIsSettingsModalOpen(true)} />
          )}

          {/* Floating Time Stamp di Pojok Kiri Bawah untuk Modul Monitoring */}
          {['dashboard', 'monitoring_paket', 'prakontrak', 'fisik', 'keuangan', 'spj_keuangan', 'master_pekerjaan', 'sipd_summary', 'pendapatan'].includes(activeTab) && (
            <div
              className="bottom-left-timestamp-pill"
              title="Waktu sinkronisasi dan update data monitoring dinas terakhir"
            >
              <span className="pulse-dot" />
              <Clock size={13} color="#38bdf8" />
              <span>Terakhir diupdate: <strong>{getLatestProjectUpdateFormatted(accessibleProjects, activeYear)}</strong></span>
            </div>
          )}
        </main>
      </div>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />

      {/* Year Management Modal */}
      <YearManagementModal
        isOpen={isYearModalOpen}
        onClose={() => setIsYearModalOpen(false)}
      />

      {/* User Management Modal */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />

      {/* Superadmin System Sustainability Settings Modal */}
      <SystemSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Unified Input / Edit Project Modal */}
      <ProjectModal
        isOpen={projectModalState.isOpen}
        initialData={projectModalState.projectData}
        onClose={handleCloseProjectModal}
      />

      {/* Comprehensive 360 Project Detail Inspector */}
      <ProjectDetailModal
        isOpen={detailModalState.isOpen}
        project={detailModalState.project}
        onClose={handleCloseDetailModal}
        onEdit={() => {
          const prj = detailModalState.project;
          handleCloseDetailModal();
          handleOpenProjectModal(prj);
        }}
      />

      {/* Quick Physical & Financial Update Modal */}
      <QuickProgressModal
        isOpen={quickUpdateState.isOpen}
        project={quickUpdateState.project}
        onClose={handleCloseQuickUpdate}
      />

      {/* Import & Export Excel/CSV Modal */}
      <ImportExportModal
        isOpen={importExportModalState.isOpen}
        initialTab={importExportModalState.tab}
        onClose={handleCloseImportExportModal}
        filteredProjects={accessibleProjects}
      />

      {/* Global Toast Alert */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' && <CheckCircle2 size={18} color="#10b981" />}
            {toast.type === 'error' && <AlertCircle size={18} color="#ef4444" />}
            {toast.type === 'info' && <Info size={18} color="#0ea5e9" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
