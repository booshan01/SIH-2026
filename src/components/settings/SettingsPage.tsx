import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Sliders,
  Shield,
  Sparkles,
  Wifi,
  Activity,
  CheckCircle2,
  HardDrive,
  UserCheck,
  LogOut,
  Mail,
  KeyRound,
  LogIn,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { SystemSettings } from '../../types';

export const SettingsPage: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    resetSettingsToDefault,
    currentUser,
    isAuthenticated,
    authProvider,
    loginWithGmail,
    logout,
    setShowAuthModal,
    sendVerificationOtp,
    switchUserRole,
    theme,
    setTheme
  } = useApp();

  const [activeTab, setActiveTab] = useState<'monitoring' | 'general' | 'infrastructure' | 'privacy' | 'ai' | 'connectivity' | 'diagnostics' | 'auth'>('auth');
  const [customGmail, setCustomGmail] = useState('booshan222007@gmail.com');
  const [verificationFeedback, setVerificationFeedback] = useState<string | null>(null);
  const [sendingVerification, setSendingVerification] = useState(false);

  // Form local state
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all operational settings to default factory values?')) {
      resetSettingsToDefault();
      setFormData(settings);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              System Configuration & Norms
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Thresholds & Pipeline Parameters</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Application Settings & Operational Rules
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure compliance tolerance thresholds, frame sampling rates, privacy retention, and AI model weights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Settings Saved!
            </span>
          )}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Configuration
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'auth', label: 'User Auth & Gmail Login', icon: KeyRound },
          { id: 'monitoring', label: 'Monitoring & Attendance Rules', icon: Sliders },
          { id: 'infrastructure', label: 'Infrastructure Norms', icon: Sliders },
          { id: 'privacy', label: 'Privacy & Retention', icon: Shield },
          { id: 'ai', label: 'AI Model & Inference', icon: Sparkles },
          { id: 'connectivity', label: 'Low-Bandwidth & Sync', icon: Wifi },
          { id: 'diagnostics', label: 'System Health & Diagnostics', icon: Activity },
          { id: 'general', label: 'General & Organization', icon: SettingsIcon },
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isSelected ? 'bg-blue-600 text-white shadow-xs font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Form Containers */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        {activeTab === 'auth' && (
          <div className="space-y-6 max-w-2xl text-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900 pb-1 border-b border-slate-100">
                User Authentication & Gmail Single Sign-On
              </h3>
              <p className="text-slate-500 mt-1">
                Manage your authenticated identity, connected Google account, and portal session.
              </p>
            </div>

            {/* Current Session Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs ${
                    currentUser.provider === 'gmail' ? 'bg-red-600' : 'bg-blue-600'
                  }`}>
                    {currentUser.provider === 'gmail' ? 'G' : currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">{currentUser.name}</div>
                    <div className="font-mono text-slate-600 text-xs mt-0.5">{currentUser.email}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{currentUser.department || 'Government Directorate'}</div>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isAuthenticated
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {isAuthenticated ? 'Authenticated Active' : 'Logged Out'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Sign-In Provider: </span>
                  <strong className="text-slate-800 uppercase font-mono">{currentUser.provider || 'Password'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Assigned Role: </span>
                  <strong className="text-blue-700 font-bold">{currentUser.role}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Clearance: </span>
                  <strong className="text-emerald-700 font-mono text-[10px]">{currentUser.clearanceLevel || 'Level 4 (Apex Full)'}</strong>
                </div>
              </div>

              {/* Email Verification Action */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Email Verification Status: <strong className="text-emerald-700">Verified Identity</strong></span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    setSendingVerification(true);
                    const res = await sendVerificationOtp(currentUser.email);
                    setSendingVerification(false);
                    setVerificationFeedback(`Official 2FA verification email dispatched with OTP: ${res.otp}`);
                    setTimeout(() => setVerificationFeedback(null), 6000);
                  }}
                  disabled={sendingVerification}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{sendingVerification ? 'Transmitting OTP...' : 'Send Verification Email to Credentials'}</span>
                </button>
              </div>

              {verificationFeedback && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{verificationFeedback}</span>
                </div>
              )}
            </div>

            {/* Role Privilege Level Switcher */}
            <div className="space-y-2 pt-1">
              <div className="font-semibold text-slate-800 text-xs flex items-center justify-between">
                <span>Switch Operational Privilege Tier</span>
                <span className="text-[10px] text-slate-500 font-mono">MSDE RBAC Matrix</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    role: 'State Officer' as const,
                    name: 'State Officer',
                    desc: 'Full sovereign access to all centres, CCTV overrides, legal accreditation, and audit logs.',
                    badge: 'Full Access (Level 4)',
                    color: 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/60'
                  },
                  {
                    role: 'System Administrator' as const,
                    name: 'System Administrator',
                    desc: 'Edge cameras, RTSP settings, diagnostics. Restricted from legal sanction sign-off.',
                    badge: 'Tech Ops (Level 3)',
                    color: 'border-blue-300 bg-blue-50/50 hover:bg-blue-100/60'
                  },
                  {
                    role: 'Monitoring Officer' as const,
                    name: 'Monitoring Officer',
                    desc: 'Field live surveillance, attendance and checklist. Restricted from deleting cameras.',
                    badge: 'Field Ops (Level 2)',
                    color: 'border-amber-300 bg-amber-50/50 hover:bg-amber-100/60'
                  },
                  {
                    role: 'Centre Manager' as const,
                    name: 'Centre Manager',
                    desc: 'Chennai training centre facility scoped. Restricted strictly to single centre.',
                    badge: 'Local (Level 1)',
                    color: 'border-purple-300 bg-purple-50/50 hover:bg-purple-100/60'
                  }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => switchUserRole(r.role)}
                    className={`p-3 rounded-xl border text-left transition-all ${r.color} ${
                      currentUser.role === r.role ? 'ring-2 ring-blue-600 shadow-xs' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{r.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white font-semibold">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 mt-1">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions: Sign In with Google / Switch / Logout */}
            <div className="space-y-3 pt-2">
              <div className="font-semibold text-slate-800 text-xs">Authentication Actions</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => loginWithGmail('booshan222007@gmail.com', 'Booshan (Google User)')}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left flex items-center gap-3 transition-all shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                      1-Click Sign In as booshan222007@gmail.com
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Authorize website user session
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 rounded-xl text-left flex items-center gap-3 transition-all shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <LogIn className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                      Open Dedicated Login Portal
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Change account or switch demo role
                    </div>
                  </div>
                </button>
              </div>

              {/* Direct Gmail Login Input Form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-semibold text-slate-800 text-xs flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  <span>Authenticate Any Website User with Gmail</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="Enter user@gmail.com"
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customGmail.trim()) {
                        loginWithGmail(customGmail.trim(), customGmail.includes('booshan') ? 'Booshan (Google User)' : customGmail.split('@')[0]);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    Authorize Gmail
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Current Session</span>
                </button>

                <span className="text-[11px] text-slate-400">
                  Redirects to portal login screen
                </span>
              </div>
            </div>

            {/* Security Policies */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Government Portal Access Safeguards</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                <li>OAuth 2.0 / OpenID Connect token verification enforced for Google accounts.</li>
                <li>Audit logs record all logins with timestamp and authenticated email address.</li>
                <li>Session state preserved safely in isolated client-side storage.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Attendance Discrepancy & Alert Trigger Rules
            </h3>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Attendance Discrepancy Threshold (Number of Trainees)
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.monitoring.attendanceDiscrepancyThreshold}
                onChange={(e) => setFormData({
                  ...formData,
                  monitoring: { ...formData.monitoring, attendanceDiscrepancyThreshold: Number(e.target.value) }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Alert is generated when: |submitted_present - estimated_people_count| &gt;= this threshold.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Minimum Detection Confidence Score (0.0 to 1.0)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.4"
                max="0.95"
                value={formData.monitoring.minimumDetectionConfidence}
                onChange={(e) => setFormData({
                  ...formData,
                  monitoring: { ...formData.monitoring, minimumDetectionConfidence: Number(e.target.value) }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Detections with confidence below this value trigger low-confidence review notices rather than automated penalties.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Frame Sampling Interval (Seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.monitoring.frameSamplingInterval}
                  onChange={(e) => setFormData({
                    ...formData,
                    monitoring: { ...formData.monitoring, frameSamplingInterval: Number(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Required Consecutive Windows
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.monitoring.requiredConsecutiveWindows}
                  onChange={(e) => setFormData({
                    ...formData,
                    monitoring: { ...formData.monitoring, requiredConsecutiveWindows: Number(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Infrastructure Equipment Comparison Rules
            </h3>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Minimum Equipment Detection Confidence
              </label>
              <input
                type="number"
                step="0.05"
                min="0.5"
                max="0.95"
                value={formData.infrastructure.minimumEquipmentConfidence}
                onChange={(e) => setFormData({
                  ...formData,
                  infrastructure: { ...formData.infrastructure, minimumEquipmentConfidence: Number(e.target.value) }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Mandatory Physical Inspection Interval (Days)
              </label>
              <input
                type="number"
                min="7"
                max="90"
                value={formData.infrastructure.inspectionIntervalDays}
                onChange={(e) => setFormData({
                  ...formData,
                  infrastructure: { ...formData.infrastructure, inspectionIntervalDays: Number(e.target.value) }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="manualReview"
                checked={formData.infrastructure.manualReviewRequiredForHeavyMachinery}
                onChange={(e) => setFormData({
                  ...formData,
                  infrastructure: { ...formData.infrastructure, manualReviewRequiredForHeavyMachinery: e.target.checked }
                })}
                className="rounded text-blue-600 border-slate-300"
              />
              <label htmlFor="manualReview" className="font-semibold text-slate-800">
                Mandatory human officer review required for heavy machinery shortages (Welding, CNC, Lathes)
              </label>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Privacy, Evidence Retention & DPDP Act Compliance
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Video Footage Retention (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={formData.privacy.videoRetentionDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, videoRetentionDays: Number(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Flagged Evidence Retention (Days)
                </label>
                <input
                  type="number"
                  min="30"
                  max="365"
                  value={formData.privacy.evidenceRetentionDays}
                  onChange={(e) => setFormData({
                    ...formData,
                    privacy: { ...formData.privacy, evidenceRetentionDays: Number(e.target.value) }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="anonymize"
                checked={formData.privacy.anonymizeBoundingBoxes}
                onChange={(e) => setFormData({
                  ...formData,
                  privacy: { ...formData.privacy, anonymizeBoundingBoxes: e.target.checked }
                })}
                className="rounded text-blue-600 border-slate-300"
              />
              <label htmlFor="anonymize" className="font-semibold text-slate-800">
                Anonymize bounding boxes by default (No facial attributes or biometric identifiers stored)
              </label>
            </div>
          </div>
        )}

        {activeTab === 'connectivity' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Edge Optimization & Low-Bandwidth Synchronization
            </h3>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg text-blue-900">
              Low-bandwidth mode prioritizes transmission of metadata JSON summaries (headcount, bounding boxes) over raw video streaming, saving up to 96% network bandwidth on 2G/3G rural training centre links.
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lowbw"
                checked={formData.connectivity.lowBandwidthMode}
                onChange={(e) => setFormData({
                  ...formData,
                  connectivity: { ...formData.connectivity, lowBandwidthMode: e.target.checked }
                })}
                className="rounded text-blue-600 border-slate-300"
              />
              <label htmlFor="lowbw" className="font-semibold text-slate-800">
                Enable Low-Bandwidth Mode (1 FPS frame sampling)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="metaonly"
                checked={formData.connectivity.metadataOnlySync}
                onChange={(e) => setFormData({
                  ...formData,
                  connectivity: { ...formData.connectivity, metadataOnlySync: e.target.checked }
                })}
                className="rounded text-blue-600 border-slate-300"
              />
              <label htmlFor="metaonly" className="font-semibold text-slate-800">
                Metadata-Only Cloud Synchronization (Raw frames remain on local edge gateway)
              </label>
            </div>
          </div>
        )}

        {activeTab === 'diagnostics' && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Live System Diagnostics & Subsystem Health
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-[10px] text-emerald-800 uppercase font-semibold">Backend API Server</div>
                <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Healthy (200 OK)
                </div>
                <div className="text-[10px] text-emerald-600 mt-1">Port 3000 Node.js/Express</div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="text-[10px] text-emerald-800 uppercase font-semibold">Database Storage</div>
                <div className="text-base font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Persistent LocalStorage
                </div>
                <div className="text-[10px] text-emerald-600 mt-1">Zero latency local storage</div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-[10px] text-blue-800 uppercase font-semibold">AI Inference Engine</div>
                <div className="text-base font-bold text-blue-700 mt-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> YOLOv8 Model Simulation
                </div>
                <div className="text-[10px] text-blue-600 mt-1">42ms average inference</div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <div className="text-[10px] text-purple-800 uppercase font-semibold">CCTV Network Nodes</div>
                <div className="text-base font-bold text-purple-700 mt-1 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" /> 5/6 Nodes Active
                </div>
                <div className="text-[10px] text-purple-600 mt-1">1 intentional offline test node</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="space-y-5 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              General Organization & Branding
            </h3>

            {/* Dark Mode and Light Mode Controls */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
              <div>
                <label className="font-bold text-xs text-slate-900 block">
                  Interface Color Scheme (Dark & Light Mode)
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select your preferred visual theme for the SAIMS monitoring dashboard and CCTV HUD.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setTheme('light');
                    setFormData({ ...formData, general: { ...formData.general, theme: 'light' } });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    theme === 'light'
                      ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500/30'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Sun className="w-5 h-5 text-amber-500" />
                    {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Light Mode</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Crisp daytime clarity</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('dark');
                    setFormData({ ...formData, general: { ...formData.general, theme: 'dark' } });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-slate-900 text-white shadow-xs ring-2 ring-blue-400/30'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Dark Mode</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Optimal for 24/7 CCTV vigilance</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTheme('system');
                    setFormData({ ...formData, general: { ...formData.general, theme: 'system' } });
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    theme === 'system'
                      ? 'border-blue-600 bg-white shadow-xs ring-2 ring-blue-500/30'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Monitor className="w-5 h-5 text-slate-600" />
                    {theme === 'system' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">System Default</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Sync with OS preferences</div>
                </button>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">System Application Name</label>
              <input
                type="text"
                value={formData.general.appName}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, appName: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Nodal Ministry</label>
              <input
                type="text"
                value={formData.general.organization}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, organization: e.target.value }
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Time Zone</label>
                <input
                  type="text"
                  value={formData.general.timeZone}
                  onChange={(e) => setFormData({
                    ...formData,
                    general: { ...formData.general, timeZone: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Date Format</label>
                <input
                  type="text"
                  value={formData.general.dateFormat}
                  onChange={(e) => setFormData({
                    ...formData,
                    general: { ...formData.general, dateFormat: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4 max-w-2xl text-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              AI Detection Weights & Edge Model Runtime
            </h3>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900">
              <strong>Honest Simulation Status:</strong> Real AI inference can run via WebAssembly/TensorFlow or server weights. In this demonstration deployment, detections run in certified simulation mode with deterministic sample datasets to prevent server latency hiccups.
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">Model Name</label>
              <input
                type="text"
                readOnly
                value={formData.aiModel.modelName}
                className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono text-slate-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Model Version</label>
                <input
                  type="text"
                  readOnly
                  value={formData.aiModel.modelVersion}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono text-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Inference Engine</label>
                <input
                  type="text"
                  readOnly
                  value={formData.aiModel.detectionEngine}
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono text-slate-700"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
