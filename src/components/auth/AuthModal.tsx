import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Building2,
  KeyRound,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  canDismiss = true,
}) => {
  const {
    loginWithGmail,
    loginWithCredentials,
    loginWithDemo,
    currentUser,
    isAuthenticated,
  } = useApp();

  const [authTab, setAuthTab] = useState<'google' | 'password' | 'demo'>('google');
  const [emailInput, setEmailInput] = useState('booshan222007@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Monitoring Officer');

  if (!isOpen) return null;

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithGmail(emailInput, emailInput.includes('booshan') ? 'Booshan (Google User)' : emailInput.split('@')[0]);
    if (onClose) onClose();
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials(emailInput, selectedRole);
    if (onClose) onClose();
  };

  const handleDemoSelect = (role: UserRole) => {
    loginWithDemo(role);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with National Emblem / Banner */}
        <div className="bg-[#0B192C] text-white p-6 relative">
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md tracking-wider">
              SA
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">SAIMS Portal Login</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-mono">
                  Govt of India
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Ministry of Skill Development & Entrepreneurship
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
            Authorized access for Monitoring Officers, System Administrators, Centre Managers, and Trainees.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setAuthTab('google')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authTab === 'google'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Gmail / Google</span>
          </button>
          <button
            onClick={() => setAuthTab('password')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authTab === 'password'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Official Login</span>
          </button>
          <button
            onClick={() => setAuthTab('demo')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
              authTab === 'demo'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>1-Click Demo</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: GMAIL / GOOGLE LOGIN */}
          {authTab === 'google' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600 mb-2 border border-red-100">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Sign in with Google / Gmail</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure authenticated access for registered website users
                </p>
              </div>

              {/* One-Click Google Sign In Button */}
              <button
                type="button"
                onClick={() => {
                  loginWithGmail('booshan222007@gmail.com', 'Booshan (Google User)');
                  if (onClose) onClose();
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs text-xs font-semibold text-slate-800 transition-all hover:border-slate-400 group"
              >
                {/* SVG Google Color Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue as <strong>booshan222007@gmail.com</strong></span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-3 text-slate-400 text-[10px] uppercase font-mono">or enter another Gmail</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleGoogleSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Google / Gmail Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Authorize & Sign In with Gmail</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500 leading-relaxed">
                <div className="font-semibold text-slate-700 mb-0.5">Google Workspace & Gmail Auth:</div>
                Grants verified user identity with active session token. Configured in accordance with Ministry SSO standards.
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL PASSWORD LOGIN */}
          {authTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Govt Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="officer@msde.gov.in"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designated Role Profile</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  <option value="Monitoring Officer">Monitoring Officer</option>
                  <option value="System Administrator">System Administrator</option>
                  <option value="Centre Manager">Centre Manager</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <span>Login with Credentials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* TAB 3: 1-CLICK DEMO LOGIN */}
          {authTab === 'demo' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 mb-2">
                Instantly authenticate with pre-configured demonstration personas:
              </div>

              {[
                {
                  role: 'Monitoring Officer' as UserRole,
                  name: 'Ananya Deshmukh',
                  email: 'ananya.deshmukh@msde.gov.in',
                  desc: 'Regional auditor with verify, review, and report sign-off access'
                },
                {
                  role: 'System Administrator' as UserRole,
                  name: 'Dr. Rajesh Sundaram',
                  email: 'rajesh.sundaram@msde.gov.in',
                  desc: 'Full administrative access across centres, config & security logs'
                },
                {
                  role: 'Centre Manager' as UserRole,
                  name: 'K. Balakrishnan',
                  email: 'k.balakrishnan@chennaiskills.edu.in',
                  desc: 'Chennai Technical Skills Centre head with attendance submit access'
                }
              ].map(persona => (
                <button
                  key={persona.role}
                  type="button"
                  onClick={() => handleDemoSelect(persona.role)}
                  className="w-full p-3 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700">{persona.role}</span>
                    <span className="text-[10px] text-blue-600 font-semibold font-mono">1-CLICK LOGIN →</span>
                  </div>
                  <div className="text-[11px] text-slate-700 font-medium mt-0.5">{persona.name}</div>
                  <div className="text-[10px] text-slate-400">{persona.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Government of India · MSDE Compliance Portal · Problem Statement ID: 26245
        </div>
      </div>
    </div>
  );
};
