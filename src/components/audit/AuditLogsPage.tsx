import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Download,
  Filter,
  Search,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { exportToCSV, formatDateTime } from '../../utils/complianceEngine';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (targetTypeFilter !== 'all' && log.targetType !== targetTypeFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        if (!log.action.toLowerCase().includes(q) && !log.actor.toLowerCase().includes(q) && !log.details.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [auditLogs, targetTypeFilter, searchFilter]);

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Actor', 'Actor Role', 'Action', 'Target Type', 'Target Name', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.actor,
      l.actorRole,
      l.action,
      l.targetType,
      l.targetName,
      l.details
    ]);
    exportToCSV(`SAIMS_Audit_Trail_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Immutable Governance Audit Trail
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Chain of Custody & Activity Registry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            System Audit Logs
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Tamper-evident logs of all user actions, attendance submissions, inventory edits, and alert resolutions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          Export Audit Trail (CSV)
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Target Entity:</label>
            <select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="all">All Targets</option>
              <option value="Alert">Alert</option>
              <option value="Attendance">Attendance</option>
              <option value="Inventory">Inventory</option>
              <option value="Centre">Centre</option>
              <option value="Inspection">Inspection</option>
              <option value="Settings">Settings</option>
            </select>
          </div>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search action or actor..."
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 w-52"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Code</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-900">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-800">{log.targetName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.targetType}</div>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600 text-xs max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
