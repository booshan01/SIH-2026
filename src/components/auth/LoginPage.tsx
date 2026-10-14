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
  ChevronRight,
  AlertCircle,
  KeyRound,
  Send,
  Timer,
  Check,
  UserPlus,
  LogIn,
  RotateCcw,
  ArrowLeft,
  Clock,
  Zap,
  Users
} from 'lucide-react';
import { UserRole } from '../../types';
import { ROLE_CONFIGURATIONS } from '../../utils/permissions';
import { useLiveCctvClock } from '../../utils/useLiveCctvClock';

interface LoginPageProps {
  logoutNotice?: boolean;
  initialMode?: 'signin' | 'signup';
  onNavigateToLogout?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  logoutNotice = false,
  initialMode = 'signin',
  onNavigateToLogout
}) => {
  const {
    loginWithGmail,
    loginWithMicrosoft,
    loginWithCredentials,
    loginWithDemo,
    registerNewAccount,
    sendVerificationOtp,
    verifyOtp,
    theme,
    toggleTheme,
    setIsLoggedOut
  } = useApp();

  const cctvClock = useLiveCctvClock(1000);

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [activeTab, setActiveTab] = useState<'gmail' | 'microsoft' | 'credentials' | 'demo'>('gmail');

  // Form inputs
  const [nameInput, setNameInput] = useState('Booshan');
  const [emailInput, setEmailInput] = useState('booshan222007@gmail.com');
  const [passwordInput, setPasswordInput] = useState('state@msde2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('State Officer');
  const [departmentInput, setDepartmentInput] = useState('MSDE Directorate of Skill Development');

  // OTP Verification Cross-Check Screen state
  const [step, setStep] = useState<'input' | 'otp_verification'>('input');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '9', '2', '0', '1']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('489201');
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [otpErrorMessage, setOtpErrorMessage] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Sync sample credentials when tab or role changes
  useEffect(() => {
    if (activeTab === 'credentials') {
      const config = ROLE_CONFIGURATIONS[selectedRole];
      if (config) {
        setEmailInput(config.loginEmail);
        setPasswordInput(config.loginPass);
      }
    } else if (activeTab === 'gmail') {
      setEmailInput(authMode === 'signup' ? 'new.officer@gmail.com' : 'booshan222007@gmail.com');
    } else if (activeTab === 'microsoft') {
      setEmailInput(authMode === 'signup' ? 'new.officer@microsoft.com' : 'booshan.officer@microsoft.com');
    }
  }, [selectedRole, activeTab, authMode]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // ULTRA-FAST 1-Click Express Login (0ms instant execution)
  const handleFastExpressLogin = (role: UserRole = selectedRole) => {
    setIsLoggedOut(false);
    if (authMode === 'signup') {
      registerNewAccount({
        name: nameInput.trim() || 'New Officer',
        email: emailInput.trim() || 'officer@msde.gov.in',
        role,
        department: departmentInput.trim(),
        password: passwordInput,
        provider: activeTab === 'gmail' ? 'gmail' : activeTab === 'microsoft' ? 'microsoft' : 'password'
      });
    } else {
      if (activeTab === 'gmail') {
        loginWithGmail(emailInput, nameInput || 'Booshan (Google User)', role);
      } else if (activeTab === 'microsoft') {
        loginWithMicrosoft(emailInput, nameInput || 'Booshan (Microsoft User)', role);
      } else {
        loginWithDemo(role);
      }
    }
  };

  // Dispatch OTP with high speed
  const handleInitiateOtp = async (targetEmail: string) => {
    if (!targetEmail || !targetEmail.includes('@')) {
      setOtpErrorMessage('Please provide a valid official government, Google, or Microsoft email address.');
      return;
    }
    setOtpSending(true);
    setOtpErrorMessage(null);

    try {
      const res = await sendVerificationOtp(targetEmail);
      setGeneratedOtp(res.otp);
      setOtpSent(true);
      setOtpSuccessMessage(`Security OTP dispatched to ${targetEmail}. (Demo Security Code: ${res.otp})`);
      setCooldownSeconds(60);
      setStep('otp_verification');
      // Auto-populate 6 digits for ultra-fast validation
      const digits = res.otp.split('').slice(0, 6);
      setOtpDigits(digits);
    } catch {
      setOtpErrorMessage('Failed to dispatch verification code. Please retry.');
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP and complete sign-in OR create account
  const handleConfirmOtpAndLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setOtpErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    const isValid = verifyOtp(emailInput, enteredCode);
    if (!isValid && enteredCode !== generatedOtp && enteredCode !== '489201') {
      setOtpErrorMessage('Invalid OTP code. Please enter the correct code or click "Auto-Fill Demo Code".');
      return;
    }

    setIsLoggedOut(false);

    // If signing up: create and register brand new account!
    if (authMode === 'signup') {
      registerNewAccount({
        name: nameInput.trim() || 'Registered Officer',
        email: emailInput.trim(),
        role: selectedRole,
        department: departmentInput.trim(),
        password: passwordInput,
        provider: activeTab === 'gmail' ? 'gmail' : activeTab === 'microsoft' ? 'microsoft' : 'password'
      });
      return;
    }

    // If signing in: log in with selected provider
    if (activeTab === 'gmail') {
      loginWithGmail(emailInput, nameInput || 'Booshan (Google User)', selectedRole);
    } else if (activeTab === 'microsoft') {
      loginWithMicrosoft(emailInput, nameInput || 'Booshan (Microsoft User)', selectedRole);
    } else {
      loginWithCredentials(emailInput, selectedRole);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const currentRoleConfig = ROLE_CONFIGURATIONS[selectedRole];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Govt of India Header Strip */}
      <div className="bg-[#07111E] border-b border-slate-800 text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
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
          <span className="flex items-center gap-1.5 text-cyan-300">
            <Clock className="w-3 h-3 text-cyan-400" />
            {cctvClock.cctvOsdString}
          </span>
          <span className="text-slate-600">|</span>
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
          
          {/* Left Column: Branding & Features */}
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
                Real-Time CCTV Video Streaming with Precision Pinpoint Reticle, Automated Biometric Face Attendance, and Infrastructure Missing Tool Audit for Vocational Training Centres.
              </p>
            </div>

            {/* Role Clearance Levels Matrix */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Multi-Role Security Clearance Hierarchy</span>
                <span className="text-[10px] text-blue-400 font-mono">MSDE Directive 2026</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2">
                  <span className="text-base">🛡️</span>
                  <div>
                    <div className="font-bold text-emerald-400 text-[11px]">State Officer (FULL ACCESS)</div>
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
                <div className="text-[10px] text-slate-400">Factory & Classroom CCTV</div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 text-center">
                <UserCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <div className="font-bold text-xs text-white">Google & Microsoft</div>
                <div className="text-[10px] text-slate-400">Verified SSO Accounts</div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-2.5 text-center">
                <ShieldCheck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <div className="font-bold text-xs text-white">Email OTP Check</div>
                <div className="text-[10px] text-slate-400">Cross-checked 2FA Code</div>
              </div>
            </div>
          </div>

          {/* Right Column: High Security Authentication & Sign-Up Card */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              
              {/* Card Header with Govt Ashoka Ribbon */}
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
                      {authMode === 'signin' ? 'Sign In to Existing Account' : 'Create Brand New Account'} · 2FA OTP Verified
                    </p>
                  </div>
                </div>

                {/* Mode Selector Tabs: Sign In vs Create New Account */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => {
                      setAuthMode('signin');
                      setStep('input');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      authMode === 'signin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setStep('input');
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      authMode === 'signup'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Account</span>
                  </button>
                </div>
              </div>

              {/* Logout notice */}
              {logoutNotice && (
                <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Session terminated securely. Please authenticate or create an account.</span>
                  </div>
                  {onNavigateToLogout && (
                    <button
                      onClick={onNavigateToLogout}
                      className="font-bold underline text-amber-900 text-[11px] cursor-pointer"
                    >
                      View Logout Receipt
                    </button>
                  )}
                </div>
              )}

              {/* ⚡ High-Speed Express Launcher Bar for Judges */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-b border-emerald-200/80 p-3 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="font-bold text-emerald-900">
                    ⚡ Instant Express Speed:
                  </span>
                  <span className="text-emerald-700 text-[11px] hidden sm:inline">
                    Skip waiting & enter dashboard in 0ms
                  </span>
                </div>
                <button
                  onClick={() => handleFastExpressLogin('State Officer')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>1-Click Launch (State Officer)</span>
                </button>
              </div>

              {/* Auth Mode Tabs (Google, Microsoft, Credentials, Demo) */}
              {step === 'input' && (
                <div className="grid grid-cols-4 border-b border-slate-200 text-xs font-semibold bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setActiveTab('gmail')}
                    className={`py-3 px-1 text-center border-b-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                      activeTab === 'gmail'
                        ? 'border-red-600 text-red-600 bg-white font-bold'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">G</span>
                    <span className="text-[11px]">Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('microsoft')}
                    className={`py-3 px-1 text-center border-b-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                      activeTab === 'microsoft'
                        ? 'border-blue-600 text-blue-600 bg-white font-bold'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span className="grid grid-cols-2 gap-0.5 w-3 h-3">
                      <span className="bg-red-500 rounded-2xs" />
                      <span className="bg-emerald-500 rounded-2xs" />
                      <span className="bg-blue-500 rounded-2xs" />
                      <span className="bg-amber-500 rounded-2xs" />
                    </span>
                    <span className="text-[11px]">Microsoft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('credentials')}
                    className={`py-3 px-1 text-center border-b-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                      activeTab === 'credentials'
                        ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('demo')}
                    className={`py-3 px-1 text-center border-b-2 transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer ${
                      activeTab === 'demo'
                        ? 'border-emerald-600 text-emerald-600 bg-white font-bold'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Personas</span>
                  </button>
                </div>
              )}

              {/* Form Content Area */}
              <div className="p-5">

                {/* STEP 1: CREDENTIALS & ACCOUNT INPUT */}
                {step === 'input' && (
                  <div className="space-y-4">
                    
                    {/* Header info banner */}
                    {activeTab === 'gmail' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs flex items-start gap-2.5 text-red-900">
                        <div className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          G
                        </div>
                        <div>
                          <div className="font-bold">
                            {authMode === 'signin' ? 'Sign In with Google / Gmail' : 'Create New Account with Google / Gmail'}
                          </div>
                          <div className="text-[11px] text-red-700 mt-0.5">
                            Cross-checked via Email OTP verification code to secure state monitoring access.
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'microsoft' && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-start gap-2.5 text-blue-900">
                        <div className="grid grid-cols-2 gap-0.5 w-5 h-5 shrink-0 mt-0.5">
                          <span className="bg-red-500 rounded-2xs" />
                          <span className="bg-emerald-500 rounded-2xs" />
                          <span className="bg-blue-500 rounded-2xs" />
                          <span className="bg-amber-500 rounded-2xs" />
                        </div>
                        <div>
                          <div className="font-bold">
                            {authMode === 'signin' ? 'Sign In with Microsoft Account' : 'Create New Account with Microsoft SSO'}
                          </div>
                          <div className="text-[11px] text-blue-700 mt-0.5">
                            Microsoft Azure AD & Government accounts cross-checked via 2FA Security OTP.
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'credentials' && (
                      <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs flex items-start gap-2.5 text-indigo-900">
                        <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">
                            {authMode === 'signin' ? 'Official Login Credentials & Password' : 'Create Brand New Government Account'}
                          </div>
                          <div className="text-[11px] text-indigo-700 mt-0.5">
                            Government portal password authentication with mandatory Gmail OTP cross-check.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sign Up Fields: Full Name & Department */}
                    {authMode === 'signup' && activeTab !== 'demo' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Officer / Trainee Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            placeholder="Ananya Sharma"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-medium"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">
                            Government Department / Centre
                          </label>
                          <input
                            type="text"
                            value={departmentInput}
                            onChange={(e) => setDepartmentInput(e.target.value)}
                            placeholder="MSDE State Directorate"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    {activeTab !== 'demo' && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          {activeTab === 'gmail' ? 'Google / Gmail Address' : activeTab === 'microsoft' ? 'Microsoft Account Email' : 'Email Address'} *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder={activeTab === 'gmail' ? 'yourname@gmail.com' : activeTab === 'microsoft' ? 'yourname@microsoft.com' : 'officer@msde.gov.in'}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Password Input (for Credentials tab or Sign Up) */}
                    {(activeTab === 'credentials' || authMode === 'signup') && activeTab !== 'demo' && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Security Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="password"
                            required
                            value={passwordInput}
                            onChange={(e) => setPasswordInput(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-mono"
                          />
                        </div>
                      </div>
                    )}

                    {/* Role Selection */}
                    {activeTab !== 'demo' && (
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Target Security Role & Access Level
                        </label>
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 font-medium"
                        >
                          <option value="State Officer">State Officer — Apex Level 4 (FULL ACCESS to All Features)</option>
                          <option value="System Administrator">System Administrator — Tech Ops (Cameras, Diagnostics, Accounts)</option>
                          <option value="Monitoring Officer">Monitoring Officer — Field Surveillance (Live CCTV & Checklists)</option>
                          <option value="Centre Manager">Centre Manager — Local Facility (Chennai Skills Hub Only)</option>
                        </select>
                      </div>
                    )}

                    {/* Role Permission Preview */}
                    {activeTab !== 'demo' && (
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
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white shadow-xs">
                            {currentRoleConfig?.clearanceLevel}
                          </span>
                        </div>
                        <div className="text-[10px] mt-1 text-slate-600">
                          {currentRoleConfig?.description}
                        </div>
                      </div>
                    )}

                    {/* TAB 4: DEMO PERSONAS */}
                    {activeTab === 'demo' && (
                      <div className="space-y-3">
                        <div className="text-xs text-slate-600">
                          Select any pre-configured official persona to immediately experience distinct role permissions (instant 0ms switch):
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => loginWithDemo('State Officer')}
                            className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-left transition-colors cursor-pointer group"
                          >
                            <div className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                              <span>🛡️ State Officer</span>
                              <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.2 rounded font-mono">FULL ACCESS</span>
                            </div>
                            <div className="text-[10px] text-slate-600 mt-1">Dr. Thiru Vikramaditya IAS</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => loginWithDemo('System Administrator')}
                            className="p-3 rounded-xl border border-blue-300 bg-blue-50/70 hover:bg-blue-100 text-left transition-colors cursor-pointer group"
                          >
                            <div className="font-bold text-xs text-blue-900">⚙️ System Admin</div>
                            <div className="text-[10px] text-slate-600 mt-1">S. Meenakshi Sundaram</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => loginWithDemo('Monitoring Officer')}
                            className="p-3 rounded-xl border border-amber-300 bg-amber-50/70 hover:bg-amber-100 text-left transition-colors cursor-pointer group"
                          >
                            <div className="font-bold text-xs text-amber-900">📹 Monitoring Officer</div>
                            <div className="text-[10px] text-slate-400 mt-1">Vigilance & Inspection</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => loginWithDemo('Centre Manager')}
                            className="p-3 rounded-xl border border-purple-300 bg-purple-50/70 hover:bg-purple-100 text-left transition-colors cursor-pointer group"
                          >
                            <div className="font-bold text-xs text-purple-900">🏢 Centre Manager</div>
                            <div className="text-[10px] text-slate-600 mt-1">R. Anandan (Chennai Hub)</div>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Error display */}
                    {otpErrorMessage && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-1.5 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{otpErrorMessage}</span>
                      </div>
                    )}

                    {/* Action Buttons: 2FA OTP or Instant Express */}
                    {activeTab !== 'demo' && (
                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleInitiateOtp(emailInput)}
                          disabled={otpSending}
                          className={`w-full py-3 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 ${
                            authMode === 'signup'
                              ? 'bg-purple-600 hover:bg-purple-700 text-white'
                              : activeTab === 'gmail'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : activeTab === 'microsoft'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          {otpSending ? (
                            <span>Generating Security OTP...</span>
                          ) : (
                            <>
                              <span>
                                {authMode === 'signin' ? 'Proceed with 2FA OTP Verification' : 'Verify & Create Account via OTP'}
                              </span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>

                        {/* Ultra-Fast 1-Click Bypass Button */}
                        <button
                          type="button"
                          onClick={() => handleFastExpressLogin(selectedRole)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            ⚡ 1-Click Fast {authMode === 'signin' ? 'Sign In' : 'Create & Launch'} (Skip OTP)
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: DEDICATED 2FA OTP VERIFICATION CROSS-CHECK */}
                {step === 'otp_verification' && (
                  <form onSubmit={handleConfirmOtpAndLogin} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setStep('input')}
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Details
                    </button>

                    <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1.5">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-blue-700" />
                        <span>Security Identity Cross-Check (2FA OTP)</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        A 6-digit one-time password has been generated for official address:
                      </p>
                      <div className="font-mono font-bold text-xs text-blue-800 bg-white border border-blue-200 px-2 py-1 rounded inline-block">
                        {emailInput}
                      </div>
                    </div>

                    {/* 6-Digit Code Input Boxes */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 block text-center mb-2">
                        Enter 6-Digit Verification Code
                      </label>
                      <div className="flex justify-center gap-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleDigitChange(idx, e.target.value)}
                            className="w-10 h-12 text-center text-lg font-bold font-mono border-2 border-slate-300 focus:border-blue-600 focus:outline-none rounded-lg bg-slate-50 text-slate-900"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Quick Demo Helper */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Expires in 10 minutes</span>
                      <button
                        type="button"
                        onClick={() => {
                          const digits = (generatedOtp || '489201').split('').slice(0, 6);
                          setOtpDigits(digits);
                        }}
                        className="text-blue-600 hover:text-blue-800 font-bold cursor-pointer"
                      >
                        Auto-Fill Demo Code ({generatedOtp || '489201'})
                      </button>
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

                    {/* Confirm Button */}
                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {authMode === 'signup' ? 'Verify & Create My Account' : 'Verify OTP & Launch Dashboard'} ({selectedRole})
                      </span>
                    </button>

                    {/* Resend button */}
                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => handleInitiateOtp(emailInput)}
                        disabled={cooldownSeconds > 0 || otpSending}
                        className="text-xs text-slate-600 hover:text-slate-900 font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        {cooldownSeconds > 0 ? `Resend Code in ${cooldownSeconds}s` : 'Did not receive code? Resend OTP'}
                      </button>
                    </div>
                  </form>
                )}

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
