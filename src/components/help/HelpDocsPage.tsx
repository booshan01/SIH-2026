import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  Code2,
  Workflow,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

export const HelpDocsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'specs' | 'architecture' | 'api'>('walkthrough');

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
            Documentation & Evaluation Guide
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500">Problem Statement ID: 26245</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mt-1">
          SAIMS Knowledge Base & Judge Demonstration Guide
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Step-by-step evaluation walkthrough, architectural blueprints, standard operating procedures, and API specifications.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { id: 'walkthrough', label: 'Judge Demo Walkthrough' },
          { id: 'specs', label: 'Problem Statement 26245 Specs' },
          { id: 'architecture', label: 'Technical Architecture' },
          { id: 'api', label: 'REST API Reference' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Judge Demo Walkthrough */}
      {activeTab === 'walkthrough' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-sm text-blue-900 mb-1">
              🏆 Evaluation Walkthrough for Hackathon Judges
            </h3>
            <p className="text-blue-800">
              The application contains pre-loaded data for 4 Tamil Nadu training centres covering all 6 test scenarios specified in the master problem statement. Follow this 5-minute evaluation path:
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                <span>Examine the Dynamic Overview Dashboard</span>
              </div>
              <p className="text-slate-600">
                Notice the live KPI cards: 4 Registered Centres, 5 Active Cameras, and open alerts. Observe the interactive attendance trend SVG chart showing the sharp discrepancy dip at Chennai Technical Skills Centre. Click any KPI card to jump directly to its filtered table.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Verify Video Analysis AI Pipeline</span>
              </div>
              <p className="text-slate-600">
                Go to <strong>Video Analysis</strong> in the sidebar. Click <strong>"Start Compliance Video Analysis"</strong>. Watch all 6 sequential stages execute (File received → Video validated → Frames extracted → AI inference → Compliance comparison → Results ready). Inspect the bounding boxes for trainees and workstations on the canvas viewer!
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                <span>Test Attendance Submission & Automatic Alert Trigger</span>
              </div>
              <p className="text-slate-600">
                Navigate to <strong>Attendance Compliance</strong>. Click <strong>"Submit Batch Attendance"</strong>. Enter 25 submitted present and 18 visual count (difference of 7). Notice how SAIMS immediately flags the record and triggers a Critical Alert in the Alerts Inbox!
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Resolve an Alert with Officer Notes</span>
              </div>
              <p className="text-slate-600">
                Go to <strong>Alerts & Incidents</strong>. Click <strong>"Review"</strong> or <strong>"Resolve"</strong> on an open alert. Choose "Close with Justification", enter your explanation, and confirm. Verify that the alert is updated and an immutable audit entry is appended to <strong>Audit Logs</strong>.
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">5</span>
                <span>Run the In-App Automated Test Suite</span>
              </div>
              <p className="text-slate-600">
                Open <strong>Automated Test Suite</strong> in the sidebar. Click <strong>"Run All 12 Automated Tests"</strong> to verify calculation logic, edge cases, zero-denominator safety, and persistence directly inside the browser!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Specs */}
      {activeTab === 'specs' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900">Ministry Problem Statement Summary</h3>
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div><strong>Problem Statement ID:</strong> 26245</div>
            <div><strong>Theme:</strong> Smart Education</div>
            <div><strong>Organization:</strong> Ministry of Skill Development and Entrepreneurship (MSDE)</div>
            <div><strong>Category:</strong> Software</div>
          </div>

          <h4 className="font-bold text-xs text-slate-900 mt-2">Core Challenge</h4>
          <p>
            Vocational training centres in India often experience attendance manipulation, ghost trainees, and fraudulent equipment declarations. Manual physical inspections are sporadic and expensive.
          </p>
          <p>
            SAIMS provides an autonomous, real-time edge monitoring solution using computer vision that verifies:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Actual trainees physically present in classrooms vs manual attendance registers.</li>
            <li>Approved specialized machinery (sewing machines, welding booths, computer terminals) physically installed.</li>
            <li>Zero biometric identification: preserves candidate privacy under the DPDP Act 2023.</li>
            <li>Low-bandwidth resilience for remote rural training centres with intermittent network connectivity.</li>
          </ul>
        </div>
      )}

      {/* Tab: Architecture */}
      {activeTab === 'architecture' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4 text-xs text-slate-700 leading-relaxed">
          <h3 className="font-bold text-sm text-slate-900">System Architecture & Pipeline Flow</h3>
          <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto leading-loose">
            [CCTV / Edge Camera Node] <br/>
            &nbsp;&nbsp;└── RTSP Video Stream (1920x1080 @ 25fps) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Keyframe Sampler (1 FPS / 2s Interval) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Edge AI Inference Core (Ultralytics YOLOv8 Architecture) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Anonymous Person Class Headcount <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Approved Machinery & Furniture Detection <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Compliance Comparison Engine (Threshold: 3 trainees) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├── Verified Compliant (Status: Verified) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Discrepancy Flag (Alert Generated → Officer Inbox) <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── Human Officer Inquiry & Resolution Note Recorded
          </div>
        </div>
      )}

      {/* Tab: API Reference */}
      {activeTab === 'api' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-3 text-xs text-slate-700">
          <h3 className="font-bold text-sm text-slate-900">Documented REST API Specification</h3>
          <p className="text-slate-500">
            Standard REST endpoints implemented in the full-stack service architecture:
          </p>

          <div className="space-y-2 mt-3 font-mono text-[11px]">
            {[
              { method: 'GET', path: '/api/health', desc: 'Service health status, database ping, and uptime' },
              { method: 'GET', path: '/api/dashboard/summary', desc: 'Aggregated KPI metrics and compliance counts' },
              { method: 'GET', path: '/api/centres', desc: 'List all registered training centres' },
              { method: 'POST', path: '/api/centres', desc: 'Create and register a new training facility' },
              { method: 'GET', path: '/api/attendance', desc: 'Query attendance records with discrepancy flags' },
              { method: 'POST', path: '/api/attendance', desc: 'Submit manual roster and trigger visual cross-check' },
              { method: 'GET', path: '/api/inventory', desc: 'Approved versus detected equipment records' },
              { method: 'POST', path: '/api/videos/upload', desc: 'Upload CCTV clip (MP4/MOV) for processing' },
              { method: 'POST', path: '/api/analysis/start', desc: 'Initiate 6-stage video compliance pipeline' },
              { method: 'GET', path: '/api/alerts', desc: 'Retrieve open and historical compliance alerts' },
              { method: 'PATCH', path: '/api/alerts/{id}', desc: 'Update review status and append resolution notes' },
              { method: 'GET', path: '/api/audit-logs', desc: 'Query immutable system audit log entries' },
            ].map(ep => (
              <div key={ep.path} className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                    ep.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                    ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {ep.method}
                  </span>
                  <span className="ml-2 font-semibold text-slate-800">{ep.path}</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
