import React from 'react';
import {
  ShieldCheck,
  EyeOff,
  UserX,
  FileLock2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
            Ethical AI & Data Protection Mandate
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500">DPDP Act 2023 Alignment</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          Privacy & AI Ethics Transparency Disclosure
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Constitutional privacy guarantees, anonymous computer vision principles, and human-in-the-loop safeguards.
        </p>
      </div>

      {/* Core Privacy Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Zero Facial Recognition</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            SAIMS does not perform facial recognition, facial landmark feature mapping, or emotion analysis. Trainees are detected purely as anonymous pedestrian bounding boxes.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <UserX className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">No Biometric Databases</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No biometric templates, fingerprints, iris scans, or photo rosters are ever uploaded, indexed, or stored in system databases.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <FileLock2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Ephemeral Video Storage</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Continuous video footage is buffered locally and automatically purged after 14 days. Only discrete sampled keyframe evidence for audited alerts is retained.
          </p>
        </div>
      </div>

      {/* What the system detects vs what it DOES NOT */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Vision System Operational Scope</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>WHAT THE SYSTEM DETECTS</span>
            </div>
            <ul className="space-y-1.5 text-emerald-800 list-disc list-inside">
              <li>Numerical count of human occupants currently seated or working in classroom</li>
              <li>Vocational machinery categories (sewing machines, welding units, PC monitors)</li>
              <li>Classroom spatial coverage percentages and camera occlusion flags</li>
              <li>Aggregate session attendance numbers for comparison against manual registers</li>
            </ul>
          </div>

          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2">
            <div className="font-bold text-red-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>WHAT THE SYSTEM NEVER IDENTIFIES</span>
            </div>
            <ul className="space-y-1.5 text-red-800 list-disc list-inside">
              <li>Individual trainee identity, name, Aadhaar number, or demographic profile</li>
              <li>Face-to-roster 1:1 or 1:N identity matching</li>
              <li>Personal biometric markers, facial hair, glasses, or religious attire</li>
              <li>Audio recordings, conversational surveillance, or biometric voiceprints</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Decision Mandate */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs leading-relaxed text-slate-700">
        <h3 className="font-bold text-sm text-slate-900">Mandatory Human-in-the-Loop Safeguard</h3>
        <p>
          In full accordance with the Government of India’s <em>National Strategy for Artificial Intelligence</em> and the <em>Digital Personal Data Protection (DPDP) Act, 2023</em>:
        </p>
        <p>
          Autonomous visual inferences are treated strictly as advisory indicators. No adverse compliance penalty, grant deduction, or de-affiliation of a training centre can occur automatically through software algorithms alone. A human Monitoring Officer must review camera angles, examine secondary work areas, and verify sign-in logs before initiating any administrative action.
        </p>
      </div>
    </div>
  );
};
