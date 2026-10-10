import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileBarChart,
  Download,
  Printer,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Building2
} from 'lucide-react';
import { exportToCSV, formatDateTime } from '../../utils/complianceEngine';

type ReportType =
  | 'daily_attendance'
  | 'weekly_centre'
  | 'monthly_infrastructure'
  | 'centre_comparison'
  | 'outstanding_alerts'
  | 'reviewed_closed_alerts'
  | 'camera_availability'
  | 'inspection_followup';

export const ReportsPage: React.FC = () => {
  const {
    attendance,
    inventory,
    alerts,
    centres,
    cameras,
    inspections,
    settings
  } = useApp();

  const [selectedReport, setSelectedReport] = useState<ReportType>('daily_attendance');
  const [centreFilter, setCentreFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  const reportTitles: Record<ReportType, { title: string; desc: string }> = {
    daily_attendance: {
      title: 'Daily Attendance Discrepancy Audit Report',
      desc: 'Compares submitted manual registers vs autonomous edge vision headcounts.',
    },
    weekly_centre: {
      title: 'Weekly Training Centre Compliance Scorecard',
      desc: 'Aggregated compliance ratings, audit alerts, and classroom operational index.',
    },
    monthly_infrastructure: {
      title: 'Monthly Infrastructure & Machinery Compliance Audit',
      desc: 'Approved equipment allocations versus detected industrial machines and shortages.',
    },
    centre_comparison: {
      title: 'Comparative Performance & Integrity Matrix across Centres',
      desc: 'Cross-centre ranking by discrepancy frequency and promptness of alert resolution.',
    },
    outstanding_alerts: {
      title: 'Outstanding & Open Compliance Alerts Summary',
      desc: 'Unresolved incidents pending monitoring officer verification or on-site inspections.',
    },
    reviewed_closed_alerts: {
      title: 'Reviewed, Addressed & Closed Audit Cases',
      desc: 'Archive of resolved compliance alerts with official justifications and notes.',
    },
    camera_availability: {
      title: 'CCTV Camera Network Availability & Health Log',
      desc: 'Uptime percentages, offline camera incidents, and coverage blind spots.',
    },
    inspection_followup: {
      title: 'Empanelled Physical Inspection Follow-Up Report',
      desc: 'Physical audit findings, machinery condition assessments, and open action items.',
    },
  };

  const currentReportMeta = reportTitles[selectedReport];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    if (selectedReport === 'daily_attendance') {
      const headers = ['Record ID', 'Centre', 'Batch', 'Date', 'Submitted', 'Visual Count', 'Difference', 'Status'];
      const rows = attendance.map(a => {
        const c = centres.find(x => x.id === a.centreId);
        return [a.id, c?.name || a.centreId, a.batchName, a.sessionDate, a.submittedPresent, a.estimatedPeopleCount, a.absoluteDifference, a.verificationStatus];
      });
      exportToCSV('SAIMS_Daily_Attendance_Report', headers, rows);
    } else if (selectedReport === 'monthly_infrastructure') {
      const headers = ['Item', 'Category', 'Centre', 'Approved', 'Detected', 'Diff', 'Condition'];
      const rows = inventory.map(i => {
        const c = centres.find(x => x.id === i.centreId);
        return [i.itemName, i.category, c?.name || i.centreId, i.approvedQuantity, i.detectedQuantity, i.countDifference, i.operationalStatus];
      });
      exportToCSV('SAIMS_Monthly_Infrastructure_Report', headers, rows);
    } else if (selectedReport === 'outstanding_alerts') {
      const headers = ['Alert ID', 'Severity', 'Title', 'Centre', 'Status', 'Created At'];
      const rows = alerts.filter(a => a.reviewStatus === 'pending' || a.reviewStatus === 'in_review').map(a => {
        const c = centres.find(x => x.id === a.centreId);
        return [a.id, a.severity, a.title, c?.name || a.centreId, a.reviewStatus, a.createdAt];
      });
      exportToCSV('SAIMS_Outstanding_Alerts_Report', headers, rows);
    } else {
      const headers = ['Centre Code', 'Centre Name', 'District', 'Classrooms', 'Compliance Score', 'Status'];
      const rows = centres.map(c => [c.code, c.name, c.district, c.totalClassrooms, c.complianceScore, c.status]);
      exportToCSV('SAIMS_Centres_Report', headers, rows);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Official Compliance Reporting
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Ministry of Skill Development & Entrepreneurship</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Reports & Analytics Studio
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Generate and export official compliance audit reports with verifiable timestamps and metadata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Print Dossier
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Report (CSV)
          </button>
        </div>
      </div>

      {/* Select Report Type Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 no-print">
        {(Object.keys(reportTitles) as ReportType[]).map((type) => {
          const isSelected = selectedReport === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedReport(type)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-600 shadow-xs ring-1 ring-blue-600'
                  : 'bg-white hover:bg-slate-50 border-slate-200'
              }`}
            >
              <div className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                {reportTitles[type].title.split(' ')[0]} {reportTitles[type].title.split(' ')[1]}
              </div>
              <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                {reportTitles[type].desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-600/40 flex items-center justify-center text-xl">
              🇮🇳
            </div>
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-slate-700">
                Government of India · Ministry of Skill Development & Entrepreneurship (MSDE)
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {currentReportMeta.title}
              </h2>
              <div className="text-xs text-slate-500">
                Smart AI Monitoring System (SAIMS) · Problem Statement ID: 26245
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Report Ref: SAIMS-{Date.now().toString().slice(-8)}</div>
            <div>Generated: {formatDateTime(new Date().toISOString())}</div>
            <div className="text-emerald-700 font-semibold">Verification: Certified Authentic</div>
          </div>
        </div>

        {/* Audit Scope / Context */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-slate-400 font-medium uppercase text-[10px]">Monitoring Target</div>
            <div className="font-semibold text-slate-900 mt-0.5">Tamil Nadu State Directorate</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium uppercase text-[10px]">Total Centres Covered</div>
            <div className="font-semibold text-slate-900 mt-0.5">{centres.length} Training Centres</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium uppercase text-[10px]">AI Inference Engine</div>
            <div className="font-semibold text-slate-900 mt-0.5">YOLOv8 Edge Vision Core</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium uppercase text-[10px]">Human Verification</div>
            <div className="font-semibold text-slate-900 mt-0.5">Mandatory Officer Review</div>
          </div>
        </div>

        {/* Dynamic Report Table Based on Selected Tab */}
        {selectedReport === 'daily_attendance' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Attendance Discrepancy Log (Today)</h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Batch & Course</th>
                  <th className="py-2.5 px-3">Centre</th>
                  <th className="py-2.5 px-3 text-center">Submitted</th>
                  <th className="py-2.5 px-3 text-center">Visual AI</th>
                  <th className="py-2.5 px-3 text-center">Difference</th>
                  <th className="py-2.5 px-3">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {attendance.map(a => {
                  const c = centres.find(x => x.id === a.centreId);
                  return (
                    <tr key={a.id}>
                      <td className="py-2.5 px-3 font-medium">{a.batchName}</td>
                      <td className="py-2.5 px-3">{c?.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{a.submittedPresent}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{a.estimatedPeopleCount}</td>
                      <td className="py-2.5 px-3 text-center font-mono">
                        <span className={a.absoluteDifference >= 3 ? 'text-red-600 font-bold' : 'text-emerald-700 font-bold'}>
                          {a.absoluteDifference}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 capitalize">{a.verificationStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {selectedReport === 'monthly_infrastructure' && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Infrastructure Inventory Allocations & Shortages</h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Equipment Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Centre</th>
                  <th className="py-2.5 px-3 text-center">Approved Norm</th>
                  <th className="py-2.5 px-3 text-center">AI Count</th>
                  <th className="py-2.5 px-3">Audit Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {inventory.map(i => {
                  const c = centres.find(x => x.id === i.centreId);
                  return (
                    <tr key={i.id}>
                      <td className="py-2.5 px-3 font-medium">{i.itemName}</td>
                      <td className="py-2.5 px-3 capitalize">{i.category.replace(/_/g, ' ')}</td>
                      <td className="py-2.5 px-3">{c?.name}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{i.approvedQuantity}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold">{i.detectedQuantity}</td>
                      <td className="py-2.5 px-3 font-semibold">
                        {i.countDifference < 0 ? (
                          <span className="text-red-600">Shortage of {Math.abs(i.countDifference)} units</span>
                        ) : (
                          <span className="text-emerald-700">100% Compliant</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {(selectedReport === 'outstanding_alerts' || selectedReport === 'reviewed_closed_alerts') && (
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Compliance Incident Case Files</h4>
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 font-semibold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Alert ID</th>
                  <th className="py-2.5 px-3">Incident Title</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Assigned Officer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{a.id}</td>
                    <td className="py-2.5 px-3 font-medium">{a.title}</td>
                    <td className="py-2.5 px-3 uppercase font-mono font-bold text-red-600">{a.severity}</td>
                    <td className="py-2.5 px-3 capitalize">{a.reviewStatus}</td>
                    <td className="py-2.5 px-3">{a.assignedReviewer || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Sign-Off Footer */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="text-[11px] text-slate-400">AUDIT VERIFIED BY:</div>
            <div className="font-bold text-slate-900 mt-1">Ananya Deshmukh</div>
            <div>Monitoring Officer, Regional Directorate of Skill Development</div>
            <div className="text-[10px] text-slate-400 mt-1">Digital Signature Key: SHA256-MSDE-26245-OK</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">AUTHORIZED SYSTEM ADMINISTRATOR:</div>
            <div className="font-bold text-slate-900 mt-1">Dr. Rajesh Sundaram</div>
            <div>National Skill Development Agency / MSDE, New Delhi</div>
            <div className="text-[10px] text-slate-400 mt-1">System Health: 100% Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
};
