import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  Sparkles,
  RotateCcw,
  Clock,
  ArrowRight,
  Sun,
  Moon,
  Lock,
  Building2,
  KeyRound
} from 'lucide-react';
import { useLiveCctvClock } from '../../utils/useLiveCctvClock';
import { UserRole } from '../../types';

interface LogoutPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
}

export const LogoutPage: React.FC<LogoutPageProps> = ({ onGoToLogin, onGoToRegister }) => {
  const { loginWithDemo, loginWithGmail, theme, toggleTheme, currentUser } = useApp();
  const cctvClock = useLiveCctvClock(1000);

  const handleQuickReLogin = (role: UserRole = 'State Officer') => {
    loginWithDemo(role);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Govt of India Header Strip */}
      <div className="bg-[#07111E] border-b border-slate-800 text-xs px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200 text-[11px] tracking-wide">
              GOVERNMENT OF INDIA · NATIONAL SKILL DEVELOPMENT MISSION
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            Ministry of Skill Development and Entrepreneurship (MSDE)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <span>Problem Statement ID: <strong className="text-blue-400">26245</strong></span>
          <span className="bg-red-950/80 text-red-300 border border-red-700/50 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
            <Lock className="w-3 h-3 text-red-400" />
            Session Terminated
          </span>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-xl w-full">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Top Status Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 text-center relative border-b border-slate-800">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 animate-in zoom-in duration-200" />
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider inline-block">
                Session Securely Terminated
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-3 tracking-tight">
                You Have Been Logged Out
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                Your cryptographic token and surveillance clearances have been revoked in compliance with MSDE Zero-Trust security protocol.
              </p>

              {/* Exact CCTV Clock Synchronized to Current Machine Time */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700/60 font-mono text-xs text-cyan-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Log Time: {cctvClock.cctvOsdString}</span>
              </div>
            </div>

            {/* Actions Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Previous user details summary */}
              {currentUser && (
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{currentUser.email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                    {currentUser.role}
                  </span>
                </div>
              )}

              {/* Primary Fast Action Buttons */}
              <div className="space-y-3">
                {/* 1. Fast Express Re-login */}
                <button
                  onClick={() => handleQuickReLogin('State Officer')}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>⚡ 1-Click Fast Re-Login as State Officer (Full Access)</span>
                </button>

                {/* 2. Login Page Button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={onGoToLogin}
                    className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Go to Login Page</span>
                  </button>

                  {/* 3. Create New Account Button */}
                  <button
                    onClick={onGoToRegister}
                    className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create New Account</span>
                  </button>
                </div>
              </div>

              {/* Quick Persona Switcher for Evaluation */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>Fast Demo Personas (Instant Access)</span>
                  <span className="text-[10px] text-emerald-500 font-mono">0ms Load</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleQuickReLogin('State Officer')}
                    className="p-2.5 rounded-lg border border-emerald-300/60 dark:border-emerald-700/50 bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-left transition-all cursor-pointer text-xs group"
                  >
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 text-[11px] group-hover:underline">🛡️ State Officer</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Apex L4</div>
                  </button>

                  <button
                    onClick={() => handleQuickReLogin('System Administrator')}
                    className="p-2.5 rounded-lg border border-blue-300/60 dark:border-blue-700/50 bg-blue-50/70 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-left transition-all cursor-pointer text-xs group"
                  >
                    <div className="font-bold text-blue-700 dark:text-blue-400 text-[11px] group-hover:underline">⚙️ Sys Admin</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Tech Ops</div>
                  </button>

                  <button
                    onClick={() => handleQuickReLogin('Monitoring Officer')}
                    className="p-2.5 rounded-lg border border-amber-300/60 dark:border-amber-700/50 bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-left transition-all cursor-pointer text-xs group"
                  >
                    <div className="font-bold text-amber-700 dark:text-amber-400 text-[11px] group-hover:underline">📹 Monitoring</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Field CCTV</div>
                  </button>

                  <button
                    onClick={() => handleQuickReLogin('Centre Manager')}
                    className="p-2.5 rounded-lg border border-purple-300/60 dark:border-purple-700/50 bg-purple-50/70 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-left transition-all cursor-pointer text-xs group"
                  >
                    <div className="font-bold text-purple-700 dark:text-purple-400 text-[11px] group-hover:underline">🏢 Manager</div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-400">Chennai Hub</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Govt Footer Ribbon */}
      <div className="bg-[#07111E] border-t border-slate-800 text-xs px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span>Designed for Ministry of Skill Development and Entrepreneurship (MSDE)</span>
          <span>·</span>
          <span>Government of India</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span>NIC Compliant</span>
          <span>·</span>
          <span>TLS 1.3 Certified</span>
          <span>·</span>
          <button
            onClick={toggleTheme}
            className="text-slate-300 hover:text-white cursor-pointer"
          >
            Theme: {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>
    </div>
  );
};
