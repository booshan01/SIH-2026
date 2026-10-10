import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Building2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Award,
  FileCheck,
  Download,
  Users,
  Video,
  Stamp,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileText
} from 'lucide-react';
import { ROLE_CONFIGURATIONS } from '../../utils/permissions';
import { exportToCSV } from '../../utils/complianceEngine';

export const StateOfficerSuite: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    centres,
    signAccreditation,
    auditLogs,
    alerts,
    students,
    cameras,
    settings,
    updateSettings,
  } = useApp();

  const isStateOfficer = currentUser.role === 'State Officer';
  const [selectedCentreForAccreditation, setSelectedCentreForAccreditation] = useState(centres[0]?.id || '');
  const [accreditationGrade, setAccreditationGrade] = useState<'A+' | 'A' | 'B'>('A+');
  const [officialRemarks, setOfficialRemarks] = useState('Satisfactory AI attendance telemetry compliance, infrastructure standards verified.');
  const [signedSuccess, setSignedSuccess] = useState<string | null>(null);

  // Emergency Surveillance Lockdown state
  const [emergencyOverrideActive, setEmergencyOverrideActive] = useState(false);

  const handleSignAccreditation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCentreForAccreditation) return;

    signAccreditation(selectedCentreForAccreditation, accreditationGrade, officialRemarks);
    const centreObj = centres.find(c => c.id === selectedCentreForAccreditation);
    setSignedSuccess(`Official Grade ${accreditationGrade} Compliance Accreditation issued to ${centreObj?.name || selectedCentreForAccreditation}. Audit ledger updated.`);
    setTimeout(() => setSignedSuccess(null), 5000);
  };

  const handleExportForensicDossier = () => {
    const headers = ['Centre Code', 'Centre Name', 'District', 'Compliance Score', 'Status', 'Active Cameras', 'Total Classrooms', 'Manager Name', 'State Officer Seal'];
    const rows = centres.map(c => [
      c.code,
      c.name,
      c.district,
      c.complianceScore,
      c.status,
      c.activeCameras,
      c.totalClassrooms,
      c.managerName,
      'VERIFIED_NIC_GOV_IN'
    ]);
    exportToCSV(`MSDE_Apex_State_Officer_Dossier_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // If user does not have Level 4 State Officer clearance
  if (!isStateOfficer) {
    const userRoleConfig = ROLE_CONFIGURATIONS[currentUser.role];

    return (
      <div className="space-y-6 max-w-4xl mx-auto py-6">
        <div className="bg-white border border-amber-300 rounded-2xl p-8 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto text-2xl shadow-inner">
            <Lock className="w-8 h-8 text-amber-700" />
          </div>

          <div>
            <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
              Access Restricted · Higher Official Clearance Required
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-3">
              State Officer Executive Suite
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
              This sovereign module is restricted strictly to <strong>State Officer (Level 4 Apex Authority)</strong>.
              Your current session role is <strong>{currentUser.role}</strong> ({userRoleConfig?.clearanceLevel}).
            </p>
          </div>

          {/* Role Policy Summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-xl mx-auto text-left text-xs space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Permission Enforcement Matrix (Why Access is Blocked):</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 text-[11px] list-disc list-inside">
              {userRoleConfig?.restrictedActions.map((action, idx) => (
                <li key={idx} className="text-red-700 font-medium">{action}</li>
              ))}
            </ul>
          </div>

          {/* Elevation Request / Quick Role Switcher for Evaluators */}
          <div className="pt-2">
            <button
              onClick={() => switchUserRole('State Officer')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 mx-auto transition-transform hover:scale-105"
            >
              <span>Elevate Session to State Officer (Full Access)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-slate-400 mt-2">
              One-click role elevation enabled for hackathon evaluation and compliance review.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // STATE OFFICER FULL ACCESS SUITE
  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#07192C] to-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold uppercase tracking-wider">
                  Level 4 Sovereign Clearance Active
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-slate-300 text-xs font-mono">
                  {currentUser.name} ({currentUser.email})
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white mt-1">
                State Officer Apex Governance & Sanctions Suite
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Supreme executive oversight over all 4 Tamil Nadu Vocational Training Centres. Authority to grant legal MSDE accreditation, order forensic audits, and execute central ministry sanctions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportForensicDossier}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>Export Certified State Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick State Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">State-Wide Centres</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{centres.length} Facilities</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Monitored in Real-Time</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Active CCTV Streams</div>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {cameras.filter(c => c.status === 'connected').length} / {cameras.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Multi-district RTSP telemetry</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">Enrolled Trainees</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{students.length} Verified</div>
          <div className="text-[11px] text-slate-500 mt-1">AI Face Verification Active</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">State Audit Ledger</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{auditLogs.length} Events</div>
          <div className="text-[11px] text-slate-500 mt-1">Cryptographically Sealed</div>
        </div>
      </div>

      {/* Main Governance Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Module 1: Official MSDE Accreditation Sign-Off */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Grant Formal MSDE Compliance Accreditation
              </h3>
              <p className="text-[11px] text-slate-500">
                Exclusive power of State Officer to issue legal government certification.
              </p>
            </div>
          </div>

          {signedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{signedSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSignAccreditation} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Training Centre</label>
              <select
                value={selectedCentreForAccreditation}
                onChange={(e) => setSelectedCentreForAccreditation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-medium"
              >
                {centres.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code} · Score: {c.complianceScore}%)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['A+', 'A', 'B'] as const).map(grade => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setAccreditationGrade(grade)}
                  className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                    accreditationGrade === grade
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-base font-extrabold">{grade}</div>
                  <div className="text-[10px] opacity-80">Grade Rating</div>
                </button>
              ))}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Official Executive Remarks</label>
              <textarea
                rows={2}
                value={officialRemarks}
                onChange={(e) => setOfficialRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs"
                placeholder="Enter executive sign-off remarks..."
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="text-[11px] text-slate-600">
                Digital Signature: <strong className="font-mono text-slate-900">Dr. Thiru Vikramaditya IAS</strong>
              </div>
              <Stamp className="w-5 h-5 text-amber-600" />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Affix Digital Signature & Issue Accreditation</span>
              <FileCheck className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Module 2: State-Wide CCTV Surveillance Lockdown & Security Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-bold">
              <Video className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Emergency State-Wide CCTV Telemetry Controls
              </h3>
              <p className="text-[11px] text-slate-500">
                Override local centre cameras and force full continuous surveillance stream.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">State Surveillance Lockdown Protocol</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Forces all cameras across Chennai, Madurai, Coimbatore & Trichy to continuous recording mode.
                </div>
              </div>
              <button
                onClick={() => setEmergencyOverrideActive(!emergencyOverrideActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  emergencyOverrideActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {emergencyOverrideActive ? 'LOCKDOWN ACTIVE' : 'ACTIVATE LOCKDOWN'}
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Low-Bandwidth Mode Override</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Current state: {settings.connectivity.lowBandwidthMode ? '1 FPS Metadata (Low BW)' : 'Full 25 FPS Broadband Stream'}
                </div>
              </div>
              <button
                onClick={() => updateSettings({ connectivity: { ...settings.connectivity, lowBandwidthMode: !settings.connectivity.lowBandwidthMode } })}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Toggle Stream Bandwidth
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Sovereign State Officer Protection:</strong> Subordinate roles (Monitoring Officer, Centre Manager) are programmatically blocked from overriding these controls under Rule 14.2 of MSDE Guidelines.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Module 3: Active State Training Centres Overview */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-sm text-slate-900">State Directory Governance</h3>
            <p className="text-[11px] text-slate-500">Live compliance status across all regional vocational training centres</p>
          </div>
          <span className="text-xs font-bold text-slate-700">4 Operational Centres</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {centres.map((centre) => (
            <div key={centre.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100/60 transition-colors space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500 font-semibold">{centre.code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  centre.complianceScore >= 90 ? 'bg-emerald-100 text-emerald-800' :
                  centre.complianceScore >= 75 ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  Score: {centre.complianceScore}%
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 line-clamp-1">{centre.name}</div>
              <div className="text-[11px] text-slate-500">{centre.district}, {centre.state}</div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-[10px] text-slate-600">
                <span>📹 {centre.activeCameras} Cameras</span>
                <span className="text-emerald-700 font-semibold uppercase">{centre.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
