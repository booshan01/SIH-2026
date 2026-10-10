import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Search, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  UserCircle, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  LogOut,
  LogIn,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { UserRole } from '../../types';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    isAuthenticated,
    authProvider,
    logout,
    showAuthModal,
    setShowAuthModal,
    switchUserRole, 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead,
    settings,
    toggleLowBandwidth,
    resetToDefaults,
    loadDemoData,
    globalSearch,
    setGlobalSearch,
    setActivePage
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: UserRole[] = ['State Officer', 'System Administrator', 'Monitoring Officer', 'Centre Manager'];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        {/* Left: Organization Badge & Search */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-600/20 flex items-center justify-center text-amber-700 font-bold text-xs">
              🇮🇳
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-slate-800 leading-tight">
                MSDE · Government of India
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                Problem ID: 26245
              </div>
            </div>
          </div>

          <div className="relative flex-1 max-w-md ml-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search centres, batches, alerts, inventory..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Low bandwidth toggle, Demo actions, Notifications, User Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Low-Bandwidth Mode Toggle */}
          <button
            onClick={toggleLowBandwidth}
            title={settings.connectivity.lowBandwidthMode ? 'Low-Bandwidth Mode Active (Metadata-only sync)' : 'Standard High-Speed Mode'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              settings.connectivity.lowBandwidthMode
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {settings.connectivity.lowBandwidthMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden md:inline">Low-BW (1 FPS)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Broadband</span>
              </>
            )}
          </button>

          {/* Quick Demo Data Reload */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => loadDemoData()}
              className="px-2.5 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 font-medium transition-colors"
            >
              Reload 6 Demo Cases
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="Toggle notifications drawer"
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="font-semibold text-xs text-slate-900">
                    Notifications ({unreadCount} unread)
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          if (n.linkPage) setActivePage(n.linkPage);
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                            {n.type === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                            {n.type === 'inspection' && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                            {n.type === 'system' && <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />}
                            <span>{n.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                  <button
                    onClick={() => {
                      setActivePage('notifications');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all in Notification Centre →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Auth & Profile Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                {/* Avatar with Google badge if logged in with Gmail */}
                <div className="relative">
                  {currentUser.provider === 'gmail' ? (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                      G
                    </div>
                  ) : (
                    <UserCircle className="w-5 h-5 text-slate-600" />
                  )}
                  {currentUser.provider === 'gmail' && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
                  )}
                </div>

                <div className="text-left hidden sm:block max-w-[120px] truncate">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block leading-tight font-semibold truncate">
                    {currentUser.provider === 'gmail' ? 'Gmail User' : currentUser.role}
                  </span>
                  <span className="text-xs font-semibold text-slate-900 leading-tight truncate block">
                    {currentUser.name}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in">
                  {/* User Profile Card */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {currentUser.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        currentUser.provider === 'gmail' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {currentUser.provider === 'gmail' ? 'Google / Gmail Auth' : 'Govt Portal Auth'}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  {/* Switch Role Option */}
                  <div className="px-3 py-1.5 border-b border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Active Role
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {roles.map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchUserRole(r);
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            currentUser.role === r ? 'font-semibold text-blue-700 bg-blue-50/60' : 'text-slate-700'
                          }`}
                        >
                          <span>{r}</span>
                          {currentUser.role === r && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: Sign In with Another Account or Log Out */}
                  <div className="py-1 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>Switch Google / Gmail Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowResetConfirm(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-md flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                      <span>Reset Demo Environment</span>
                    </button>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Sign Out / Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out State: Big Sign In Button */
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Gmail</span>
            </button>
          )}
        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200">
              <h3 className="font-semibold text-slate-900 text-sm">Reset Demo Environment?</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                This will reseed all 4 centres, 6 compliance scenarios, inventory, and attendance records back to the pristine state.
              </p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    resetToDefaults();
                    setShowResetConfirm(false);
                  }}
                  className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-xs"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal || !isAuthenticated}
        onClose={() => setShowAuthModal(false)}
        canDismiss={isAuthenticated}
      />
    </>
  );
};
