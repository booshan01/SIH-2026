import React, { useState, useEffect } from 'react';
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
  Video,
  Activity,
  Cpu,
  Layers,
  ChevronRight,
  AlertCircle,
  KeyRound,
  Send,
  Timer,
  Info,
  ShieldAlert,
  BadgeAlert,
  Check
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_CONFIGURATIONS } from '../../utils/permissions';

interface LoginPageProps {
  logoutNotice?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ logoutNotice = false }) => {
  const {
    loginWithGmail,
    loginWithCredentials,
    loginWithDemo,
    sendVerificationOtp,
    verifyOtp,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'gmail' | 'official' | 'demo'>('gmail');
  const [emailInput, setEmailInput] = useState('booshan222007@gmail.com');
  const [passwordInput, setPasswordInput] = useState('state@msde2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('State Officer');
  const [rememberMe, setRememberMe] = useState(true);

  // Email Verification & OTP state
  const [requireOtp, setRequireOtp] = useState(true);
  const [otpInput, setOtpInput] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Sync sample credentials when role is switched
  useEffect(() => {
    if (activeTab === 'official') {
      const config = ROLE_CONFIGURATIONS[selectedRole];
      if (config) {
        setEmailInput(config.loginEmail);
        setPasswordInput(config.loginPass);
      }
    }
  }, [selectedRole, activeTab]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Handle Send Verification Email OTP
  const handleSendOtp = async (targetEmail: string) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      setOtpErrorMessage('Please provide a valid official government or Gmail address.');
      return;
    }
    setOtpSending(true);
    setOtpErrorMessage(null);

    try {
      const res = await sendVerificationOtp(targetEmail);
      setOtpSent(true);
      setOtpSuccessMessage(`Verification OTP dispatched to ${targetEmail}. (Demo OTP: ${res.otp})`);
      setCooldownSeconds(60);
      setOtpInput(res.otp); // Pre-fill for instant frictionless evaluation
    } catch {
      setOtpErrorMessage('Failed to dispatch security verification email. Please retry.');
    } finally {
      setOtpSending(false);
    }
  };

  // Handle Gmail Submit
  const handleGmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireOtp && !otpSent) {
      handleSendOtp(emailInput);
      return;
    }

    if (requireOtp && otpSent) {
      const valid = verifyOtp(emailInput, otpInput);
      if (!valid) {
        setOtpErrorMessage('Invalid OTP code entered. Please enter the 6-digit code or click "Auto-Fill Demo Code".');
        return;
      }
    }

    loginWithGmail(
      emailInput, 
      emailInput.includes('booshan') ? 'Booshan (Google User)' : emailInput.split('@')[0],
      selectedRole
    );
  };

  // Handle Official Credentials Submit
  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requireOtp && !otpSent) {
      handleSendOtp(emailInput);
      return;
    }

    if (requireOtp && otpSent) {
      const valid = verifyOtp(emailInput, otpInput);
      if (!valid) {
        setOtpErrorMessage('Invalid OTP code. Please enter the correct 6-digit security code.');
        return;
      }
    }

    loginWithCredentials(emailInput, selectedRole);
  };

  const currentRoleConfig = ROLE_CONFIGURATIONS[selectedRole];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Govt of India Header Strip */}
      <div className="bg-[#07111E] border-b border-slate-800 text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
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
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            RBAC Level-4 Gate Active
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Branding, Mission & Live Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>AI-Powered Autonomous Training Centre Surveillance</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                SAIMS — Smart AI Monitoring System
              </h1>
              <p className="text-sm text-slate-300 mt-2 font-normal leading-relaxed">
                Real-Time CCTV Live Video Streaming, Automated Face Attendance, and Infrastructure Compliance Audit for Vocational Training Centres.
              </p>
            </div>

            {/* Role Clearance Levels Matrix Ribbon */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Access Clearance Tiers</span>
                <span className="text-[10px] font-mono text-emerald-400">MSDE Security Standard v4</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2">
                  <span className="text-base">👑</span>
                  <div>
                    <div className="font-bold text-emerald-400 text-[11px]">State Officer (Full Access)</div>
                    <div className="text-[10px] text-slate-400">All centres, CCTV overrides, legal accreditation, forensic audit logs</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-start gap-2">
                  <span className="text-base">⚙️</span>
                  <div>
                    <div className="font-bold text-blue-400 text-[11px]">System Administrator</div>
                    <div className="text-[10px] text-slate-400">Cameras & tech ops. Restricted from legal sanction sign-off</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-start gap-2">
                  <span className="text-base">📹</span>
                  <div>
                    <div className="font-bold text-amber-400 text-[11px]">Monitoring Officer</div>
                    <div className="text-[10px] text-slate-400">Field vigilance & attendance check. Restricted from deleting cameras</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-start gap-2">
                  <span className="text-base">🏢</span>
                  <div>
                    <div className="font-bold text-purple-400 text-[11px]">Centre Manager</div>
                    <div className="text-[10px] text-slate-400">Restricted strictly to single centre (Chennai TN-CHE-0104)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 text-center">
                <Video className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <div className="font-bold text-xs text-white">Live Sample Video</div>
                <div className="text-[10px] text-slate-400">Realistic CCTV clips</div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 text-center">
                <UserCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="font-bold text-xs text-white">AI Attendance</div>
                <div className="text-[10px] text-slate-400">Edge face scanning</div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 text-center">
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="font-bold text-xs text-white">Email 2FA OTP</div>
                <div className="text-[10px] text-slate-400">Encrypted credentials</div>
              </div>
            </div>
          </div>

          {/* Right Column: High Security Authentication Card */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              
              {/* Card Header with Govt Ashoka Seal Ribbon */}
              <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                      <span>MSDE Secure Portal Gateway</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Role-Based Access Control · NIC Compliant
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                  256-Bit SSL
                </span>
              </div>

              {/* Logout notice if user just logged out */}
              {logoutNotice && (
                <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Session terminated securely. Please authenticate again to access monitoring services.</span>
                </div>
              )}

              {/* Auth Mode Tabs */}
              <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-semibold bg-slate-50">
                <button
                  type="button"
                  onClick={() => setActiveTab('gmail')}
                  className={`py-3 px-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'gmail'
                      ? 'border-red-600 text-red-600 bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">G</span>
                  <span>Gmail SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('official')}
                  className={`py-3 px-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'official'
                      ? 'border-blue-600 text-blue-600 bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Credentials & OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className={`py-3 px-2 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'demo'
                      ? 'border-emerald-600 text-emerald-600 bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Role Personas</span>
                </button>
              </div>

              {/* Form Content Area */}
              <div className="p-5">

                {/* TAB 1: GMAIL SSO AUTHENTICATION */}
                {activeTab === 'gmail' && (
                  <form onSubmit={handleGmailSubmit} className="space-y-4">
                    <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl text-xs flex items-start gap-2.5 text-red-900">
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        G
                      </div>
                      <div>
                        <div className="font-bold">Google & Gmail SSO Login</div>
                        <div className="text-[11px] text-red-700 mt-0.5">
                          Authenticate website users via verified Google Account with Two-Factor Security.
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Google / Gmail Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="yourname@gmail.com"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-red-500 font-mono"
                        />
                      </div>
                    </div>

                    {/* Role Selection for Google User */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Authorization Role & Privilege Level
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 font-medium"
                      >
                        <option value="State Officer">State Officer — Full Access (All Centres, Legal Accreditations & Logs)</option>
                        <option value="System Administrator">System Administrator — Tech Ops (Cameras, Diagnostics, User Accounts)</option>
                        <option value="Monitoring Officer">Monitoring Officer — Field Surveillance (Live CCTV, Attendance & Checklist)</option>
                        <option value="Centre Manager">Centre Manager — Local Facility (Chennai Skills Centre Only)</option>
                      </select>
                    </div>

                    {/* Security 2FA OTP Toggle & Verification Block */}
                    <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                          <span>Email Verification Code (2FA OTP)</span>
                        </span>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 font-medium">
                          <input
                            type="checkbox"
                            checked={requireOtp}
                            onChange={(e) => setRequireOtp(e.target.checked)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span>Enforce 2FA</span>
                        </label>
                      </div>

                      {requireOtp && (
                        <div className="space-y-2 pt-1">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otpInput}
                              onChange={(e) => setOtpInput(e.target.value)}
                              placeholder="Enter 6-digit OTP code"
                              maxLength={6}
                              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 tracking-widest font-mono text-center font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => handleSendOtp(emailInput)}
                              disabled={otpSending || cooldownSeconds > 0}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <Send className="w-3 h-3" />
                              <span>{cooldownSeconds > 0 ? `${cooldownSeconds}s` : 'Send OTP'}</span>
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Sent to: <strong className="font-mono text-slate-700">{emailInput}</strong></span>
                            <button
                              type="button"
                              onClick={() => setOtpInput('489201')}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Auto-Fill Demo Code (489201)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status feedback */}
                    {otpSuccessMessage && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{otpSuccessMessage}</span>
                      </div>
                    )}
                    {otpErrorMessage && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{otpErrorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <span>Authorize & Sign In with Gmail ({selectedRole})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* TAB 2: OFFICIAL GOVT CREDENTIALS */}
                {activeTab === 'official' && (
                  <form onSubmit={handleOfficialSubmit} className="space-y-3.5">
                    
                    {/* Role Selector */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Select Ministry Official Category
                      </label>
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 font-medium"
                      >
                        <option value="State Officer">State Officer (Apex State Directorate — FULL ACCESS)</option>
                        <option value="System Administrator">System Administrator (Edge Technical Ops)</option>
                        <option value="Monitoring Officer">Monitoring Officer (Field Surveillance)</option>
                        <option value="Centre Manager">Centre Manager (Chennai Centre Scoped)</option>
                      </select>
                    </div>

                    {/* Role Permission Preview Badge */}
                    <div className={`p-2.5 rounded-lg border text-xs ${
                      selectedRole === 'State Officer' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                        : selectedRole === 'System Administrator'
                        ? 'bg-blue-50 border-blue-300 text-blue-900'
                        : selectedRole === 'Monitoring Officer'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-purple-50 border-purple-300 text-purple-900'
                    }`}>
                      <div className="flex items-center justify-between font-bold text-[11px]">
                        <span>{currentRoleConfig?.category}</span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/70 shadow-xs">
                          {currentRoleConfig?.clearanceLevel}
                        </span>
                      </div>
                      <div className="text-[10px] mt-1 text-slate-600">
                        {currentRoleConfig?.description}
                      </div>
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Official Govt Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="stateofficer@msde.gov.in"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Portal Security Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 focus:ring-2 focus:ring-blue-600 font-mono"
                        />
                      </div>
                    </div>

                    {/* Email 2FA Verification Box */}
                    <div className="border border-slate-200 bg-slate-50/70 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                          <span>Send Verification Email / 2FA OTP</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSendOtp(emailInput)}
                          disabled={otpSending || cooldownSeconds > 0}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold transition-colors disabled:opacity-50"
                        >
                          {cooldownSeconds > 0 ? `Resend (${cooldownSeconds}s)` : 'Send Verification OTP'}
                        </button>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          placeholder="6-digit verification code"
                          maxLength={6}
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 tracking-widest font-mono text-center font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setOtpInput('489201')}
                          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-semibold"
                        >
                          Use 489201
                        </button>
                      </div>
                    </div>

                    {otpSuccessMessage && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{otpSuccessMessage}</span>
                      </div>
                    )}
                    {otpErrorMessage && (
                      <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{otpErrorMessage}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all mt-1"
                    >
                      <span>Sign In with Verified Credentials</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* TAB 3: ROLE PERSONAS & CATEGORIES FOR INSTANT SWITCHING */}
                {activeTab === 'demo' && (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 mb-1">
                      Select an official operational category to evaluate access tiers:
                    </div>

                    {/* State Officer (Full Access) */}
                    <button
                      type="button"
                      onClick={() => loginWithDemo('State Officer')}
                      className="w-full p-3 bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-300 rounded-xl text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">👑</span>
                          <span className="font-extrabold text-xs text-emerald-950">
                            State Officer (FULL ACCESS)
                          </span>
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded uppercase">
                          Apex Authority →
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-900 font-semibold mt-1">
                        Dr. Thiru Vikramaditya IAS · stateofficer@msde.gov.in
                      </div>
                      <div className="text-[10px] text-emerald-800 mt-0.5">
                        ✓ Full access to all centres, CCTV streams, legal accreditation, forensic audit & user administration.
                      </div>
                    </button>

                    {/* System Administrator */}
                    <button
                      type="button"
                      onClick={() => loginWithDemo('System Administrator')}
                      className="w-full p-3 bg-blue-50/80 hover:bg-blue-100/90 border border-blue-300 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">⚙️</span>
                          <span className="font-bold text-xs text-blue-950">System Administrator</span>
                        </div>
                        <span className="text-[10px] text-blue-700 font-bold font-mono">AUTHENTICATE →</span>
                      </div>
                      <div className="text-[11px] text-blue-900 font-medium mt-1">
                        Dr. Rajesh Sundaram · sysadmin@msde.gov.in
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        ✓ Cameras, edge diagnostics, users. <strong className="text-red-700">Restricted from legal inspection accreditation sign-off.</strong>
                      </div>
                    </button>

                    {/* Monitoring Officer */}
                    <button
                      type="button"
                      onClick={() => loginWithDemo('Monitoring Officer')}
                      className="w-full p-3 bg-amber-50/80 hover:bg-amber-100/90 border border-amber-300 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📹</span>
                          <span className="font-bold text-xs text-amber-950">Monitoring Officer</span>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold font-mono">AUTHENTICATE →</span>
                      </div>
                      <div className="text-[11px] text-amber-900 font-medium mt-1">
                        Ananya Deshmukh · monitor@msde.gov.in
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        ✓ Live CCTV view, attendance, checklist. <strong className="text-red-700">Restricted from editing system settings & deleting cameras.</strong>
                      </div>
                    </button>

                    {/* Centre Manager */}
                    <button
                      type="button"
                      onClick={() => loginWithDemo('Centre Manager')}
                      className="w-full p-3 bg-purple-50/80 hover:bg-purple-100/90 border border-purple-300 rounded-xl text-left transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🏢</span>
                          <span className="font-bold text-xs text-purple-950">Centre Manager</span>
                        </div>
                        <span className="text-[10px] text-purple-700 font-bold font-mono">AUTHENTICATE →</span>
                      </div>
                      <div className="text-[11px] text-purple-900 font-medium mt-1">
                        K. Balakrishnan · manager.chennai@msde.gov.in
                      </div>
                      <div className="text-[10px] text-slate-600 mt-0.5">
                        ✓ Local Chennai centre (TN-CHE-0104). <strong className="text-red-700">Restricted strictly to single centre only.</strong>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Guest Bypass Footer */}
              <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Evaluating as Apex Official?</span>
                <button
                  type="button"
                  onClick={() => loginWithDemo('State Officer')}
                  className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-1"
                >
                  <span>Enter as State Officer (Full Access)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Official Footer */}
      <footer className="bg-[#07111E] border-t border-slate-800 text-slate-400 py-3 text-[11px] text-center px-4">
        <p className="flex flex-wrap items-center justify-center gap-2">
          <span>SAIMS Platform © 2026</span>
          <span>·</span>
          <span>National Skill Development Agency / MSDE</span>
          <span>·</span>
          <span>All Activities Monitored & Digitally Signed under IT Act 2000</span>
        </p>
      </footer>
    </div>
  );
};
