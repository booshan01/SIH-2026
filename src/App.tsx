import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { LiveMonitoringPage } from './components/monitoring/LiveMonitoringPage';
import { VideoAnalysisPage } from './components/video/VideoAnalysisPage';
import { AttendancePage } from './components/attendance/AttendancePage';
import { InfrastructurePage } from './components/infrastructure/InfrastructurePage';
import { InventoryManagementPage } from './components/inventory/InventoryManagementPage';
import { AlertsPage } from './components/alerts/AlertsPage';
import { CentresPage } from './components/centres/CentresPage';
import { CentreDetailPage } from './components/centres/CentreDetailPage';
import { ReportsPage } from './components/reports/ReportsPage';
import { AIEvaluationPage } from './components/evaluation/AIEvaluationPage';
import { InspectionsPage } from './components/inspections/InspectionsPage';
import { UserManagementPage } from './components/users/UserManagementPage';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { AuditLogsPage } from './components/audit/AuditLogsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { PrivacyPage } from './components/privacy/PrivacyPage';
import { HelpDocsPage } from './components/help/HelpDocsPage';
import { TestRunnerPage } from './components/tests/TestRunnerPage';
import { LoginPage } from './components/auth/LoginPage';
import { StateOfficerSuite } from './components/state/StateOfficerSuite';
import { BottomAppDock } from './components/common/BottomAppDock';
import { Menu, ChevronRight } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activePage, setActivePage } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Overview Dashboard';
      case 'monitoring': return 'Live Monitoring & Telemetry';
      case 'analysis': return 'Video Analysis & Detection';
      case 'attendance': return 'Attendance Compliance';
      case 'infrastructure': return 'Infrastructure Compliance';
      case 'inventory': return 'Inventory Management';
      case 'alerts': return 'Alerts & Incidents';
      case 'centres': return 'Training Centres Directory';
      case 'centre-detail': return 'Training Centre Dossier';
      case 'reports': return 'Reports & Analytics Studio';
      case 'evaluation': return 'AI Performance Evaluation';
      case 'inspections': return 'Inspections & Maintenance';
      case 'users': return 'User Management & Roles';
      case 'notifications': return 'Notification Centre';
      case 'audit': return 'System Audit Logs';
      case 'state-suite': return 'State Officer Executive Suite';
      case 'settings': return 'Application Settings';
      case 'privacy': return 'Privacy & AI Disclosure';
      case 'help': return 'Help & Evaluation Guide';
      case 'tests': return 'Automated Test Suite';
      default: return 'Overview Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Navbar */}
        <Navbar />

        {/* Mobile Header Bar & Breadcrumb Strip */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-slate-700">SAIMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900">{getPageTitle(activePage)}</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            MSDE Problem Statement ID: 26245
          </div>
        </div>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 pb-24 sm:pb-28 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <OverviewDashboard />}
          {activePage === 'monitoring' && <LiveMonitoringPage />}
          {activePage === 'analysis' && <VideoAnalysisPage />}
          {activePage === 'attendance' && <AttendancePage />}
          {activePage === 'infrastructure' && <InfrastructurePage />}
          {activePage === 'inventory' && <InventoryManagementPage />}
          {activePage === 'alerts' && <AlertsPage />}
          {activePage === 'centres' && <CentresPage />}
          {activePage === 'centre-detail' && <CentreDetailPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'evaluation' && <AIEvaluationPage />}
          {activePage === 'inspections' && <InspectionsPage />}
          {activePage === 'users' && <UserManagementPage />}
          {activePage === 'notifications' && <NotificationsPage />}
          {activePage === 'audit' && <AuditLogsPage />}
          {activePage === 'state-suite' && <StateOfficerSuite />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'privacy' && <PrivacyPage />}
          {activePage === 'help' && <HelpDocsPage />}
          {activePage === 'tests' && <TestRunnerPage />}
        </main>

        {/* Main Features Floating Bottom App Dock */}
        <BottomAppDock />
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <LoginPage logoutNotice={false} />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <AppProvider>
      <AuthenticatedApp />
    </AppProvider>
  );
}
