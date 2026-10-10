import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Eye,
  ShieldAlert,
  UserCheck,
  Check,
  X,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { Alert, AlertReviewStatus, AlertSeverity, AlertType } from '../../types';
import { exportToCSV, formatDateTime } from '../../utils/complianceEngine';

export const AlertsPage: React.FC = () => {
  const {
    alerts,
    centres,
    classrooms,
    updateAlertStatus,
    bulkAcknowledgeAlerts,
    currentUser,
    setActivePage
  } = useApp();

  // Filters
  const [centreFilter, setCentreFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Bulk Selection
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);

  // Action Modal State
  const [inspectingAlert, setInspectingAlert] = useState<Alert | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionToPerform, setActionToPerform] = useState<'verify' | 'dismiss' | 'request_inspection' | 'close' | 'assign'>('verify');
  const [showActionModal, setShowActionModal] = useState(false);

  // Filter alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (centreFilter !== 'all' && a.centreId !== centreFilter) return false;
      if (severityFilter !== 'all' && a.severity !== severityFilter) return false;
      if (typeFilter !== 'all' && a.alertType !== typeFilter) return false;
      if (statusFilter !== 'all' && a.reviewStatus !== statusFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.id.toLowerCase().includes(q) && !a.explanation.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [alerts, centreFilter, severityFilter, typeFilter, statusFilter, searchFilter]);

  const toggleSelectAll = () => {
    if (selectedAlertIds.length === filteredAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map(a => a.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedAlertIds.includes(id)) {
      setSelectedAlertIds(prev => prev.filter(item => item !== id));
    } else {
      setSelectedAlertIds(prev => [...prev, id]);
    }
  };

  const handleBulkAck = () => {
    if (selectedAlertIds.length === 0) return;
    bulkAcknowledgeAlerts(selectedAlertIds);
    setSelectedAlertIds([]);
  };

  const openActionDialog = (alert: Alert, action: 'verify' | 'dismiss' | 'request_inspection' | 'close' | 'assign') => {
    setInspectingAlert(alert);
    setActionToPerform(action);
    setResolutionNote(alert.resolutionNotes || '');
    setShowActionModal(true);
  };

  const handleConfirmAction = () => {
    if (!inspectingAlert) return;

    let targetStatus: AlertReviewStatus = 'verified';
    if (actionToPerform === 'verify') targetStatus = 'verified';
    if (actionToPerform === 'dismiss') targetStatus = 'dismissed';
    if (actionToPerform === 'request_inspection') targetStatus = 'inspection_requested';
    if (actionToPerform === 'close') targetStatus = 'closed';
    if (actionToPerform === 'assign') targetStatus = 'in_review';

    updateAlertStatus(inspectingAlert.id, targetStatus, resolutionNote, actionToPerform);
    setShowActionModal(false);
    setInspectingAlert(null);
    setResolutionNote('');
  };

  const handleExportCSV = () => {
    const headers = [
      'Alert ID',
      'Title',
      'Severity',
      'Type',
      'Centre',
      'Classroom',
      'Expected',
      'Observed',
      'Status',
      'Assigned To',
      'Created At',
      'Resolution Notes'
    ];
    const rows = filteredAlerts.map(a => {
      const centre = centres.find(c => c.id === a.centreId);
      const room = classrooms.find(r => r.id === a.classroomId);
      return [
        a.id,
        a.title,
        a.severity,
        a.alertType,
        centre?.name || a.centreId,
        room?.name || a.classroomId,
        a.expectedValue,
        a.observedValue,
        a.reviewStatus,
        a.assignedReviewer || 'Unassigned',
        a.createdAt,
        a.resolutionNotes || 'None'
      ];
    });
    exportToCSV(`SAIMS_Alerts_Registry_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Centralized Incident Resolution
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous Compliance Monitoring</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Alerts & Incidents Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Audit discrepancies, review video evidence, record resolution notes, and assign physical inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedAlertIds.length > 0 && (
            <button
              onClick={handleBulkAck}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              Acknowledge Selected ({selectedAlertIds.length})
            </button>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Alerts (CSV)
          </button>
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
            <label className="text-[11px] text-slate-500 font-medium">Severity:</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 uppercase"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
              <option value="pending">Pending</option>
              <option value="in_review">In Review</option>
              <option value="verified">Verified</option>
              <option value="inspection_requested">Inspection Requested</option>
              <option value="closed">Closed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search alerts by title or ID..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-52"
          />

          {(centreFilter !== 'all' || severityFilter !== 'all' || statusFilter !== 'all' || searchFilter) && (
            <button
              onClick={() => {
                setCentreFilter('all');
                setSeverityFilter('all');
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

      {/* Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={filteredAlerts.length > 0 && selectedAlertIds.length === filteredAlerts.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-4">Severity & Alert ID</th>
                <th className="py-3 px-4">Issue Description & Evidence</th>
                <th className="py-3 px-4">Centre & Classroom</th>
                <th className="py-3 px-4 text-center">Expected vs Observed</th>
                <th className="py-3 px-4">Review Status</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAlerts.map((alert) => {
                const centre = centres.find(c => c.id === alert.centreId);
                const room = classrooms.find(r => r.id === alert.classroomId);
                const isSelected = selectedAlertIds.includes(alert.id);

                return (
                  <tr key={alert.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}>
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(alert.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                          alert.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px] font-semibold">{alert.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {formatDateTime(alert.createdAt)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-900">{alert.title}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {alert.explanation}
                      </p>
                      {alert.evidenceReference && (
                        <div className="text-[10px] text-blue-600 font-mono mt-1 flex items-center gap-1">
                          <span>Evidence: {alert.evidenceReference}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{centre?.name}</div>
                      <div className="text-[11px] text-slate-500">{room?.name || 'Classroom'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono">
                      <div className="text-[11px] text-slate-500">Exp: <strong className="text-slate-800">{alert.expectedValue}</strong></div>
                      <div className="text-[11px] text-slate-500">Obs: <strong className="text-red-600">{alert.observedValue}</strong></div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                        alert.reviewStatus === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-300' :
                        alert.reviewStatus === 'in_review' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        alert.reviewStatus === 'closed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        alert.reviewStatus === 'inspection_requested' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {alert.reviewStatus.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {alert.assignedReviewer || <span className="text-slate-400">Unassigned</span>}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openActionDialog(alert, 'verify')}
                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-medium transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => openActionDialog(alert, 'close')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-medium transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Alert Review & Action Dialog */}
      {showActionModal && inspectingAlert && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600">{inspectingAlert.id}</span>
                <h2 className="font-bold text-base text-slate-900 mt-0.5">{inspectingAlert.title}</h2>
              </div>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              {/* Context Summary */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div><strong>Explanation:</strong> {inspectingAlert.explanation}</div>
                <div><strong>Confidence & Constraints:</strong> {inspectingAlert.confidenceLimitations}</div>
                {inspectingAlert.evidenceReference && (
                  <div><strong>Evidence Reference:</strong> {inspectingAlert.evidenceReference}</div>
                )}
              </div>

              {/* Action Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Officer Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setActionToPerform('verify')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      actionToPerform === 'verify' ? 'bg-blue-50 border-blue-500 font-semibold text-blue-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>Verify Alert</div>
                    <div className="text-[10px] text-slate-400">Confirm discrepancy as valid</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionToPerform('request_inspection')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      actionToPerform === 'request_inspection' ? 'bg-purple-50 border-purple-500 font-semibold text-purple-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>Request Physical Inspection</div>
                    <div className="text-[10px] text-slate-400">Dispatch empanelled auditor</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionToPerform('close')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      actionToPerform === 'close' ? 'bg-emerald-50 border-emerald-500 font-semibold text-emerald-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>Close with Justification</div>
                    <div className="text-[10px] text-slate-400">Discrepancy satisfactorily explained</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActionToPerform('dismiss')}
                    className={`p-2.5 rounded-lg border text-left transition-colors ${
                      actionToPerform === 'dismiss' ? 'bg-slate-100 border-slate-400 font-semibold text-slate-900' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div>Dismiss Alert</div>
                    <div className="text-[10px] text-slate-400">False positive or camera glare</div>
                  </button>
                </div>
              </div>

              {/* Resolution Notes Input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Mandatory Resolution Notes (Recorded in Audit Trail)
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Detail the inquiry result, reference document numbers, or technician findings..."
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Audit History of this Alert */}
              {inspectingAlert.history && inspectingAlert.history.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-800 text-xs mb-1.5 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-slate-500" />
                    <span>Audit Review Log History</span>
                  </div>
                  <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-32 overflow-y-auto">
                    {inspectingAlert.history.map((h, i) => (
                      <div key={i} className="p-2 text-[11px] bg-slate-50">
                        <div className="flex justify-between font-medium text-slate-800">
                          <span>{h.reviewerName} ({h.reviewerRole})</span>
                          <span className="text-slate-400">{formatDateTime(h.timestamp)}</span>
                        </div>
                        <div className="text-slate-600 mt-0.5">{h.resolutionNotes}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Submit Official Decision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
