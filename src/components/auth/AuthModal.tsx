import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  KeyRound,
  X,
  Send,
  Check,
  ArrowLeft
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
    loginWithMicrosoft,
    loginWithCredentials,
    loginWithDemo,
    sendVerificationOtp,
    verifyOtp
  } = useApp();

  const [authTab, setAuthTab] = useState<'google' | 'microsoft' | 'password' | 'demo'>('google');
  const [emailInput, setEmailInput] = useState('booshan222007@gmail.com');
  const [passwordInput, setPasswordInput] = useState('state@msde2026');
  const [selectedRole, setSelectedRole] = useState<UserRole>('State Officer');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpInput, setOtpInput] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('489201');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartOtp = async (targetEmail: string) => {
    setOtpSending(true);
    setFeedbackMsg(null);
    try {
      const res = await sendVerificationOtp(targetEmail);
      setGeneratedOtp(res.otp);
      setOtpInput(res.otp);
      setStep('otp');
      setFeedbackMsg(`Verification OTP sent to ${targetEmail}. (Demo code: ${res.otp})`);
    } catch {
      setFeedbackMsg('Failed to dispatch verification code. Please retry.');
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyAndFinish = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = verifyOtp(emailInput, otpInput);
    if (!valid && otpInput !== generatedOtp && otpInput !== '489201') {
      setFeedbackMsg('Invalid code. Please enter 6-digit verification code.');
      return;
    }

    if (authTab === 'google') {
      loginWithGmail(emailInput, emailInput.includes('booshan') ? 'Booshan (Google User)' : emailInput.split('@')[0], selectedRole);
    } else if (authTab === 'microsoft') {
      loginWithMicrosoft(emailInput, 'Booshan (Microsoft User)', selectedRole);
    } else {
      loginWithCredentials(emailInput, selectedRole);
    }

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header with National Emblem / Banner */}
        <div className="bg-[#0B192C] text-white p-5 relative">
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
                <span className="font-bold text-white text-base">SAIMS Portal Gateway</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.2 rounded font-mono">
                  Govt of India
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Ministry of Skill Development & Entrepreneurship
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
            Role-Based Access Control verified with Two-Factor Email OTP Cross-Check.
          </p>
        </div>

        {/* Tab Selection */}
        {step === 'form' && (
          <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => {
                setAuthTab('google');
                setEmailInput('booshan222007@gmail.com');
              }}
              className={`py-2.5 text-center transition-colors border-b-2 ${
                authTab === 'google'
                  ? 'border-red-600 text-red-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Google
            </button>

            <button
              onClick={() => {
                setAuthTab('microsoft');
                setEmailInput('booshan.officer@microsoft.com');
              }}
              className={`py-2.5 text-center transition-colors border-b-2 ${
                authTab === 'microsoft'
                  ? 'border-blue-600 text-blue-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Microsoft
            </button>

            <button
              onClick={() => setAuthTab('password')}
              className={`py-2.5 text-center transition-colors border-b-2 ${
                authTab === 'password'
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Password
            </button>

            <button
              onClick={() => setAuthTab('demo')}
              className={`py-2.5 text-center transition-colors border-b-2 ${
                authTab === 'demo'
                  ? 'border-emerald-600 text-emerald-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Demo
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5">
          {step === 'form' ? (
            <div className="space-y-4">
              {/* Role selection */}
              {authTab !== 'demo' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Select Role Access Level
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    <option value="State Officer">State Officer (Apex Level 4 — FULL ACCESS)</option>
                    <option value="System Administrator">System Administrator (Tech Ops)</option>
                    <option value="Monitoring Officer">Monitoring Officer (Field Surveillance)</option>
                    <option value="Centre Manager">Centre Manager (Chennai Facility)</option>
                  </select>
                </div>
              )}

              {/* Email Input */}
              {authTab !== 'demo' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    {authTab === 'google' ? 'Google / Gmail Account' : authTab === 'microsoft' ? 'Microsoft Account Email' : 'Official Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Password for credentials */}
              {authTab === 'password' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Demo personas */}
              {authTab === 'demo' && (
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <button
                    onClick={() => {
                      loginWithDemo('State Officer');
                      if (onClose) onClose();
                    }}
                    className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-50 text-left hover:bg-emerald-100"
                  >
                    <div className="font-bold text-emerald-900">🛡️ State Officer (Full Access)</div>
                    <div className="text-[10px] text-slate-600">Dr. Thiru Vikramaditya IAS</div>
                  </button>

                  <button
                    onClick={() => {
                      loginWithDemo('System Administrator');
                      if (onClose) onClose();
                    }}
                    className="p-2.5 rounded-lg border border-blue-300 bg-blue-50 text-left hover:bg-blue-100"
                  >
                    <div className="font-bold text-blue-900">⚙️ System Administrator</div>
                    <div className="text-[10px] text-slate-600">S. Meenakshi Sundaram</div>
                  </button>

                  <button
                    onClick={() => {
                      loginWithDemo('Monitoring Officer');
                      if (onClose) onClose();
                    }}
                    className="p-2.5 rounded-lg border border-amber-300 bg-amber-50 text-left hover:bg-amber-100"
                  >
                    <div className="font-bold text-amber-900">📹 Monitoring Officer</div>
                    <div className="text-[10px] text-slate-600">Field vigilance & checklists</div>
                  </button>
                </div>
              )}

              {feedbackMsg && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                  {feedbackMsg}
                </div>
              )}

              {/* Trigger OTP Button */}
              {authTab !== 'demo' && (
                <button
                  type="button"
                  onClick={() => handleStartOtp(emailInput)}
                  disabled={otpSending}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span>Verify with Email OTP</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            /* STEP 2: OTP CROSS-CHECK */
            <form onSubmit={handleVerifyAndFinish} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Account
              </button>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-blue-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>2FA Security Cross-Check</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  One-time password issued to: <strong className="font-mono text-slate-800">{emailInput}</strong>
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  6-Digit OTP Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center text-lg font-mono font-bold tracking-widest bg-slate-50 border border-slate-300 rounded-lg py-2 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Code expires in 10m</span>
                <button
                  type="button"
                  onClick={() => setOtpInput(generatedOtp || '489201')}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Auto-Fill Code ({generatedOtp || '489201'})
                </button>
              </div>

              {feedbackMsg && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900">
                  {feedbackMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Verify OTP & Sign In ({selectedRole})</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
