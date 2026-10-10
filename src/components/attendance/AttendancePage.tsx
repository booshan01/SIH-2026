import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Download,
  PlusCircle,
  HelpCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Eye,
  FileCheck2,
  X
} from 'lucide-react';
import { formatDateTime, exportToCSV } from '../../utils/complianceEngine';
import { AttendanceRecord, AttendanceVerificationStatus } from '../../types';

export const AttendancePage: React.FC = () => {
  const {
    attendance,
    centres,
    classrooms,
    submitAttendance,
    reviewAttendance,
    settings,
    currentUser,
    setActivePage
  } = useApp();

  // Filters
  const [centreFilter, setCentreFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // New Attendance Submission Modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [subCentreId, setSubCentreId] = useState(centres[0]?.id || '');
  const [subClassroomId, setSubClassroomId] = useState(classrooms[0]?.id || '');
  const [subBatch, setSubBatch] = useState('Automotive Electrical Systems (Batch 26-G)');
  const [subDate, setSubDate] = useState(new Date().toISOString().split('T')[0]);
  const [subStart, setSubStart] = useState('09:30');
  const [subEnd, setSubEnd] = useState('12:30');
  const [subRegistered, setSubRegistered] = useState(25);
  const [subPresent, setSubPresent] = useState(24);
  const [subAbsent, setSubAbsent] = useState(1);
  const [subEstimated, setSubEstimated] = useState(19); // difference of 5 for demonstration
  const [subNotes, setSubNotes] = useState('Morning batch session lecture & practical');

  // Review Modal State
  const [reviewingRecord, setReviewingRecord] = useState<AttendanceRecord | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState<AttendanceVerificationStatus>('verified');

  const availableRooms = classrooms.filter(r => r.centreId === subCentreId);

  // Filtered Records
  const filteredAttendance = useMemo(() => {
    return attendance.filter(rec => {
      if (centreFilter !== 'all' && rec.centreId !== centreFilter) return false;
      if (statusFilter !== 'all' && rec.verificationStatus !== statusFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        const matchesBatch = rec.batchName.toLowerCase().includes(q);
        const matchesNotes = rec.notes?.toLowerCase().includes(q) || false;
        if (!matchesBatch && !matchesNotes) return false;
      }
      return true;
    });
  }, [attendance, centreFilter, statusFilter, searchFilter]);

  // Handle Submit Form
  const handleSubmitNewAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    submitAttendance({
      centreId: subCentreId,
      classroomId: subClassroomId,
      batchName: subBatch,
      sessionDate: subDate,
      scheduledStart: subStart,
      scheduledEnd: subEnd,
      registeredCount: Number(subRegistered),
      submittedPresent: Number(subPresent),
      submittedAbsent: Number(subAbsent),
      estimatedPeopleCount: Number(subEstimated),
      coverageStatus: 'optimal',
      confidenceScore: 0.92,
      submittedBy: `${currentUser.name} (${currentUser.role})`,
      notes: subNotes,
    });
    setShowSubmitModal(false);
  };

  // Handle Review Confirmation
  const handleConfirmReview = () => {
    if (!reviewingRecord) return;
    reviewAttendance(reviewingRecord.id, reviewDecision, reviewNotes);
    setReviewingRecord(null);
    setReviewNotes('');
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Record ID',
      'Centre',
      'Batch Name',
      'Date',
      'Schedule',
      'Registered',
      'Submitted Present',
      'AI Visual Count',
      'Abs Difference',
      'Coverage',
      'Confidence',
      'Status',
      'Submitted By',
      'Verified By'
    ];
    const rows = filteredAttendance.map(rec => {
      const centre = centres.find(c => c.id === rec.centreId);
      return [
        rec.id,
        centre?.name || rec.centreId,
        rec.batchName,
        rec.sessionDate,
        `${rec.scheduledStart} - ${rec.scheduledEnd}`,
        rec.registeredCount,
        rec.submittedPresent,
        rec.estimatedPeopleCount,
        rec.absoluteDifference,
        rec.coverageStatus,
        `${(rec.confidenceScore * 100).toFixed(0)}%`,
        rec.verificationStatus,
        rec.submittedBy,
        rec.verifiedBy || 'Pending'
      ];
    });
    exportToCSV(`SAIMS_Attendance_Compliance_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Integrity Verification Engine
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous vs Manual Roster Audit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Attendance Compliance Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Formula: absolute_difference = |submitted_present - estimated_people_count|. Flagged threshold: &gt; {settings.monitoring.attendanceDiscrepancyThreshold} trainees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Submit Batch Attendance
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export CSV
          </button>
        </div>
      </div>

      {/* MSDE Human-in-the-Loop Safeguard Notice */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong>MSDE Human Verification Mandate:</strong> A discrepancy alert is an operational notice for review, never conclusive proof of misconduct. Officers must investigate coverage blind spots, annex rooms, or hardware anomalies prior to punitive compliance actions.
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Centre:</label>
            <select
              value={centreFilter}
              onChange={(e) => setCentreFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Centres ({centres.length})</option>
              {centres.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Compliant</option>
              <option value="flagged">Flagged Discrepancy</option>
              <option value="reviewed">Officer Reviewed</option>
              <option value="pending">Pending Human Review</option>
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search batch or notes..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-48"
          />

          {(centreFilter !== 'all' || statusFilter !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setCentreFilter('all');
                setStatusFilter('all');
                setSearchFilter('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Attendance Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Session & Batch</th>
                <th className="py-3 px-4">Training Centre & Room</th>
                <th className="py-3 px-4 text-center">Submitted Present</th>
                <th className="py-3 px-4 text-center">AI Visual Estimate</th>
                <th className="py-3 px-4 text-center">Discrepancy</th>
                <th className="py-3 px-4">Coverage & Confidence</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttendance.map((rec) => {
                const centre = centres.find(c => c.id === rec.centreId);
                const room = classrooms.find(r => r.id === rec.classroomId);
                const isDiscrepant = rec.absoluteDifference >= settings.monitoring.attendanceDiscrepancyThreshold;

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Session & Batch */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{rec.batchName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {rec.sessionDate} · {rec.scheduledStart} - {rec.scheduledEnd}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Reg: {rec.registeredCount} | Submitter: {rec.submittedBy.split(' ')[0]}
                      </div>
                    </td>

                    {/* Centre & Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{centre?.name}</div>
                      <div className="text-[11px] text-slate-500">{room?.name || 'Classroom'}</div>
                    </td>

                    {/* Submitted Present */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="text-sm font-bold text-slate-900">{rec.submittedPresent}</div>
                      <div className="text-[10px] text-slate-400">({rec.submittedAbsent} absent)</div>
                    </td>

                    {/* AI Visual Count */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className={`text-sm font-bold ${isDiscrepant ? 'text-red-600' : 'text-emerald-700'}`}>
                        {rec.estimatedPeopleCount}
                      </div>
                      <div className="text-[10px] text-slate-400">anonymous bodies</div>
                    </td>

                    {/* Difference */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        rec.absoluteDifference === 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isDiscrepant ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {rec.absoluteDifference === 0 ? 'Match (0)' : `Δ ${rec.absoluteDifference} (${rec.percentageDifference}%)`}
                      </span>
                    </td>

                    {/* Coverage & Confidence */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className={`w-2 h-2 rounded-full ${
                          rec.coverageStatus === 'optimal' ? 'bg-emerald-500' :
                          rec.coverageStatus === 'partial' ? 'bg-amber-500' : 'bg-red-500'
                        }`} />
                        <span className="capitalize">{rec.coverageStatus}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Conf: {(rec.confidenceScore * 100).toFixed(0)}%
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {rec.verificationStatus === 'verified' && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Verified Compliant
                        </span>
                      )}
                      {rec.verificationStatus === 'flagged' && (
                        <span className="text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Flagged (Alert Active)
                        </span>
                      )}
                      {rec.verificationStatus === 'reviewed' && (
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <FileCheck2 className="w-3 h-3" /> Officer Reviewed
                        </span>
                      )}
                      {rec.verificationStatus === 'pending' && (
                        <span className="text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setReviewingRecord(rec);
                          setReviewNotes(rec.notes || '');
                          setReviewDecision(rec.verificationStatus === 'flagged' ? 'reviewed' : 'verified');
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Batch Attendance */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h2 className="font-bold text-base text-slate-900">Submit Classroom Attendance Figure</h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated visual cross-verification against CCTV estimation</p>

            <form onSubmit={handleSubmitNewAttendance} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Training Centre</label>
                <select
                  value={subCentreId}
                  onChange={(e) => setSubCentreId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Classroom</label>
                <select
                  value={subClassroomId}
                  onChange={(e) => setSubClassroomId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} [{r.code}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Batch / Course Title</label>
                <input
                  type="text"
                  required
                  value={subBatch}
                  onChange={(e) => setSubBatch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={subStart}
                    onChange={(e) => setSubStart(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={subEnd}
                    onChange={(e) => setSubEnd(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Total Registered</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={subRegistered}
                    onChange={(e) => setSubRegistered(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Submitted Present</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={subPresent}
                    onChange={(e) => {
                      const pres = Number(e.target.value);
                      setSubPresent(pres);
                      setSubAbsent(Math.max(0, subRegistered - pres));
                    }}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Visual Count (AI)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={subEstimated}
                    onChange={(e) => setSubEstimated(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Notes / Context</label>
                <textarea
                  rows={2}
                  value={subNotes}
                  onChange={(e) => setSubNotes(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Submit & Cross-Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Review Attendance Record */}
      {reviewingRecord && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Officer Verification Review</h2>
              <button onClick={() => setReviewingRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <div className="font-semibold text-slate-900">{reviewingRecord.batchName}</div>
                <div className="text-slate-500">
                  Submitted: <strong>{reviewingRecord.submittedPresent}</strong> trainees | Visual AI Count: <strong>{reviewingRecord.estimatedPeopleCount}</strong>
                </div>
                <div className="text-slate-500">
                  Discrepancy: <strong className={reviewingRecord.absoluteDifference >= 3 ? 'text-red-600' : 'text-emerald-600'}>
                    {reviewingRecord.absoluteDifference} trainees
                  </strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Review Decision</label>
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value as AttendanceVerificationStatus)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  <option value="verified">Approve & Verify (Compliant)</option>
                  <option value="reviewed">Resolve with Explanation Note</option>
                  <option value="flagged">Flag for Physical On-Site Inspection</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Review Notes</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter justification, e.g., verified trainees present in auxiliary testing bench..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReviewingRecord(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReview}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
