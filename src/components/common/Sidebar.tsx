import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  FileSpreadsheet,
  Video,
  Eye,
  UserCheck,
  Cpu,
  Package,
  AlertTriangle,
  BarChart3,
  Sparkles,
  ClipboardCheck,
  Users,
  Bell,
  History,
  Settings,
  Shield,
  HelpCircle,
  FlaskConical,
  X,
  ChevronRight,
  LogOut,
  LogIn,
  Mail,
  ShieldCheck,
  Trophy,
  UserPlus,
  KeyRound,
  MapPin
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  count?: number;
  countColor?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { 
    activePage, 
    setActivePage, 
    alerts, 
    notifications, 
    centres,
    currentUser,
    isAuthenticated,
    logout,
    setShowAuthModal
  } = useApp();

  const openAlertsCount = alerts.filter(a => a.reviewStatus === 'pending' || a.reviewStatus === 'in_review').length;
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navGroups: NavGroup[] = [
    {
      title: 'MONITORING CORE',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
        { id: 'jury-showcase', label: 'Jury Showcase Arena', icon: Trophy, badge: 'HOT' },
        { id: 'monitoring', label: 'Live Monitoring', icon: Video, badge: '18 CAMS' },
        { id: 'analysis', label: 'Video Analysis (AI)', icon: Eye, badge: 'YOLO' },
      ],
    },
    {
      title: 'COMPLIANCE & VERIFICATION',
      items: [
        { id: 'attendance', label: 'Attendance Compliance', icon: UserCheck },
        { id: 'infrastructure', label: 'Infrastructure Compliance', icon: Cpu },
        { id: 'inventory', label: 'Inventory Management', icon: Package },
        { 
          id: 'alerts', 
          label: 'Alerts & Incidents', 
          icon: AlertTriangle, 
          count: openAlertsCount,
          countColor: 'bg-red-500 text-white'
        },
      ],
    },
    {
      title: 'CENTRES & AUDITS',
      items: [
        { id: 'centres', label: 'Training Centres', icon: Building2, count: centres.length },
        { id: 'places', label: 'Places & Districts', icon: MapPin, badge: '38 DIST' },
        { id: 'centre-detail', label: 'Centre Details', icon: FileSpreadsheet },
        { id: 'inspections', label: 'Inspections & Maintenance', icon: ClipboardCheck },
      ],
    },
    {
      title: 'ANALYTICS & VALIDATION',
      items: [
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'evaluation', label: 'AI Performance Evaluation', icon: Sparkles },
        { id: 'tests', label: 'Automated Test Suite', icon: FlaskConical, badge: '12 PASS' },
      ],
    },
    {
      title: 'GOVERNANCE & SETTINGS',
      items: [
        { id: 'state-suite', label: 'State Officer Suite', icon: ShieldCheck, badge: 'APEX' },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'signup', label: 'Create New Account', icon: UserPlus, badge: 'AUTH' },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotifCount },
        { id: 'audit', label: 'Audit Logs', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'privacy', label: 'Privacy & AI Disclosure', icon: Shield },
        { id: 'help', label: 'Help & Documentation', icon: HelpCircle },
      ],
    },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Deep Navy Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0B192C] text-slate-300 flex flex-col transition-transform duration-200 ease-in-out border-r border-slate-800
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Header & Branding */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md tracking-wider">
              SA
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight">SAIMS</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-mono">
                  v2.4
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Smart AI Monitoring System
              </div>
              <div className="text-[9px] text-amber-400/90 tracking-wide uppercase font-semibold">
                MSDE · Govt of India
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 mb-2 font-mono">
                {group.title}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            item.countColor || (isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-slate-300')
                          }`}>
                            {item.count}
                          </span>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account / Auth Status in Sidebar */}
        <div className="p-3 border-t border-slate-800 bg-[#07111F]/80 text-xs space-y-2">
          {isAuthenticated ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-white shrink-0 ${
                    currentUser.provider === 'gmail' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.provider === 'gmail' ? 'G' : currentUser.name.charAt(0)}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 text-xs truncate leading-tight">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate font-mono">
                      {currentUser.provider === 'gmail' ? 'booshan222007@gmail.com' : currentUser.email}
                    </div>
                  </div>
                </div>

                <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                  {currentUser.role.split(' ')[0]}
                </span>
              </div>

              {/* Fast Action Buttons in Sidebar */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => {
                    setActivePage('signup');
                    if (mobileOpen) setMobileOpen(false);
                  }}
                  className="py-1 px-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Create New Account"
                >
                  <UserPlus className="w-3 h-3 text-purple-400" />
                  <span>New User</span>
                </button>

                <button
                  onClick={logout}
                  className="py-1 px-2 rounded-md bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Log Out of Portal"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => {
                setActivePage('login');
                if (mobileOpen) setMobileOpen(false);
              }}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Sign In</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 border-t border-slate-800 bg-[#07111F] text-[10px] text-slate-400 flex items-center justify-between">
          <div className="truncate">
            <div className="text-slate-200 font-semibold truncate">PS ID: 26245 · MSDE</div>
            <div className="text-[9px] text-slate-500">Autonomous Edge AI</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
        </div>
      </aside>
    </>
  );
};
