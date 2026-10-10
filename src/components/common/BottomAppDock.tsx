import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  UserCheck,
  CheckSquare,
  AlertTriangle,
  Building2,
  BarChart3,
  ShieldCheck,
  Settings,
  Lock
} from 'lucide-react';

export const BottomAppDock: React.FC = () => {
  const {
    activePage,
    setActivePage,
    cameras,
    students,
    checklistItems,
    alerts,
    currentUser,
  } = useApp();

  const isStateOfficer = currentUser.role === 'State Officer';
  const activeCamerasCount = cameras.filter(c => c.status === 'connected').length;
  const presentStudentsCount = students.filter(s => s.status === 'present').length;
  const pendingChecklistCount = checklistItems.filter(c => c.status === 'pending').length;
  const pendingAlertsCount = alerts.filter(a => a.reviewStatus === 'pending' || a.reviewStatus === 'in_review').length;

  const appDockButtons = [
    {
      id: 'monitoring',
      label: 'Live CCTV',
      icon: Video,
      badge: `${activeCamerasCount} LIVE`,
      badgeColor: 'bg-emerald-500 text-white',
      page: 'monitoring',
      category: 'Surveillance'
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: UserCheck,
      badge: `${presentStudentsCount} Present`,
      badgeColor: 'bg-blue-500 text-white',
      page: 'attendance',
      category: 'Trainees'
    },
    {
      id: 'check-things',
      label: 'Check Things',
      icon: CheckSquare,
      badge: pendingChecklistCount > 0 ? `${pendingChecklistCount} Due` : 'OK',
      badgeColor: pendingChecklistCount > 0 ? 'bg-amber-500 text-slate-900' : 'bg-emerald-600 text-white',
      page: 'monitoring', // LiveMonitoringPage has the Check Things tab
      category: 'Compliance'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: AlertTriangle,
      badge: pendingAlertsCount > 0 ? `${pendingAlertsCount}` : undefined,
      badgeColor: 'bg-red-500 text-white animate-pulse',
      page: 'alerts',
      category: 'Incidents'
    },
    {
      id: 'centres',
      label: 'Centres',
      icon: Building2,
      badge: undefined,
      badgeColor: '',
      page: 'centres',
      category: 'Facilities'
    },
    {
      id: 'reports',
      label: 'Analytics',
      icon: BarChart3,
      badge: undefined,
      badgeColor: '',
      page: 'reports',
      category: 'Dossier'
    },
    {
      id: 'state-suite',
      label: 'State Suite',
      icon: ShieldCheck,
      badge: isStateOfficer ? 'APEX' : 'LOCK',
      badgeColor: isStateOfficer ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300',
      page: 'state-suite',
      category: 'Executive'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      badge: undefined,
      badgeColor: '',
      page: 'settings',
      category: 'Security'
    }
  ];

  return (
    <nav 
      aria-label="Quick Actions Navigation Dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-3xl w-[96%] sm:w-auto no-print"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] p-1.5 sm:p-2 flex items-center justify-between sm:justify-center gap-1 sm:gap-2">
        {appDockButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activePage === btn.page;

          return (
            <button
              key={btn.id}
              onClick={() => setActivePage(btn.page)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 sm:px-3 rounded-xl transition-all duration-150 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md scale-105 ring-2 ring-blue-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
              title={`${btn.label} (${btn.category})`}
            >
              {/* Badge Counter */}
              {btn.badge && (
                <span
                  className={`absolute -top-1.5 right-0.5 sm:-right-1 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase tracking-tight shadow-xs ${btn.badgeColor}`}
                >
                  {btn.badge}
                </span>
              )}

              {/* Icon */}
              <div className="relative">
                <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-blue-300'}`} />
                {btn.id === 'state-suite' && !isStateOfficer && (
                  <Lock className="w-2.5 h-2.5 text-amber-400 absolute -bottom-1 -right-1" />
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] sm:text-[11px] font-semibold mt-1 tracking-tight truncate max-w-[60px] sm:max-w-none ${
                isActive ? 'text-white font-bold' : 'text-slate-300'
              }`}>
                {btn.label}
              </span>

              {/* Active Dot indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-cyan-300 mt-0.5 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
