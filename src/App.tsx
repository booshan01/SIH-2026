import React, { useState, useEffect } from 'react';
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
import { LogoutPage } from './components/auth/LogoutPage';
import { StateOfficerSuite } from './components/state/StateOfficerSuite';
import { JuryShowcasePage } from './components/jury/JuryShowcasePage';
import { PlacesPage } from './components/places/PlacesPage';
import { GeminiAIAssistantModal } from './components/common/GeminiAIAssistantModal';
import { Menu, ChevronRight, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activePage, setActivePage, geminiAssistantOpen, setGeminiAssistantOpen } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener to toggle Gemini Assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGeminiAssistantOpen(!geminiAssistantOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [geminiAssistantOpen, setGeminiAssistantOpen]);

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
      case 'places': return 'Places, States & District Jurisdictions';
      case 'centre-detail': return 'Training Centre Dossier';
      case 'reports': return 'Reports & Analytics Studio';
      case 'evaluation': return 'AI Performance Evaluation';
      case 'inspections': return 'Inspections & Maintenance';
      case 'users': return 'User Management & Roles';
      case 'notifications': return 'Notification Centre';
      case 'audit': return 'System Audit Logs';
      case 'state-suite': return 'State Officer Executive Suite';
      case 'jury-showcase': return 'Jury Showcase & Apex Innovation Suite';
      case 'settings': return 'Application Settings';
      case 'privacy': return 'Privacy & AI Disclosure';
      case 'help': return 'Help & Evaluation Guide';
      case 'tests': return 'Automated Test Suite';
      case 'login': return 'Portal Login & Credential Verification';
      case 'signup': return 'Create Brand New Official Account';
      case 'logout': return 'Session Termination & Security Sign-Off';
      default: return 'Overview Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex text-slate-900 dark:text-slate-100 transition-colors">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Navbar */}
        <Navbar />

        {/* Mobile Header Bar & Breadcrumb Strip */}
        <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between no-print transition-colors">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">SAIMS</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="font-bold text-slate-900 dark:text-white">{getPageTitle(activePage)}</span>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
            MSDE Problem Statement ID: 26245
          </div>
        </div>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 pb-8 sm:pb-12 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <OverviewDashboard />}
          {activePage === 'monitoring' && <LiveMonitoringPage />}
          {activePage === 'analysis' && <VideoAnalysisPage />}
          {activePage === 'attendance' && <AttendancePage />}
          {activePage === 'infrastructure' && <InfrastructurePage />}
          {activePage === 'inventory' && <InventoryManagementPage />}
          {activePage === 'alerts' && <AlertsPage />}
          {activePage === 'centres' && <CentresPage />}
          {activePage === 'places' && <PlacesPage />}
          {activePage === 'centre-detail' && <CentreDetailPage />}
          {activePage === 'reports' && <ReportsPage />}
          {activePage === 'evaluation' && <AIEvaluationPage />}
          {activePage === 'inspections' && <InspectionsPage />}
          {activePage === 'users' && <UserManagementPage />}
          {activePage === 'notifications' && <NotificationsPage />}
          {activePage === 'audit' && <AuditLogsPage />}
          {activePage === 'state-suite' && <StateOfficerSuite />}
          {activePage === 'jury-showcase' && <JuryShowcasePage />}
          {activePage === 'settings' && <SettingsPage />}
          {activePage === 'privacy' && <PrivacyPage />}
          {activePage === 'help' && <HelpDocsPage />}
          {activePage === 'tests' && <TestRunnerPage />}
          {activePage === 'login' && (
            <LoginPage
              initialMode="signin"
              logoutNotice={false}
              onNavigateToLogout={() => setActivePage('logout')}
            />
          )}
          {activePage === 'signup' && (
            <LoginPage
              initialMode="signup"
              logoutNotice={false}
              onNavigateToLogout={() => setActivePage('logout')}
            />
          )}
          {activePage === 'logout' && (
            <LogoutPage
              onGoToLogin={() => setActivePage('login')}
              onGoToRegister={() => setActivePage('signup')}
            />
          )}
        </main>

        {/* Floating Gemini AI Copilot Action Trigger */}
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            onClick={() => setGeminiAssistantOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-xl shadow-blue-600/30 ring-2 ring-white/20 dark:ring-slate-700/60 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            title="Open Gemini AI Copilot (Ctrl+K)"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-600 animate-ping" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold leading-tight tracking-tight flex items-center gap-1.5">
                Gemini Copilot
                <span className="hidden sm:inline text-[9px] bg-white/25 px-1 py-0.2 rounded font-mono font-medium">
                  Ctrl+K
                </span>
              </span>
              <span className="text-[10px] text-blue-100/90 leading-none">
                Zero-Knowledge Helper
              </span>
            </div>
          </button>
        </div>

        {/* Google Gemini AI Assistant Copilot Modal */}
        <GeminiAIAssistantModal
          isOpen={geminiAssistantOpen}
          onClose={() => setGeminiAssistantOpen(false)}
        />
      </div>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const { isAuthenticated, isLoggedOut, setIsLoggedOut } = useApp();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'logout'>(isLoggedOut ? 'logout' : 'login');

  useEffect(() => {
    if (isLoggedOut) {
      setAuthView('logout');
    }
  }, [isLoggedOut]);

  if (!isAuthenticated) {
    if (authView === 'logout') {
      return (
        <LogoutPage
          onGoToLogin={() => {
            setIsLoggedOut(false);
            setAuthView('login');
          }}
          onGoToRegister={() => {
            setIsLoggedOut(false);
            setAuthView('signup');
          }}
        />
      );
    }
    return (
      <LoginPage
        logoutNotice={isLoggedOut}
        initialMode={authView === 'signup' ? 'signup' : 'signin'}
        onNavigateToLogout={() => setAuthView('logout')}
      />
    );
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
