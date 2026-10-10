import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ClipboardCheck,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  X
} from 'lucide-react';
import { InspectionRecord } from '../../types';

export const InspectionsPage: React.FC = () => {
  const {
    inspections,
    centres,
    classrooms,
    scheduleInspection,
    updateInspection
  } = useApp();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [centreId, setCentreId] = useState(centres[0]?.id || '');
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id || '');
  const [inspectorName, setInspectorName] = useState('P. Ramesh (State Quality Assessor)');
  const [inspectorDesignation, setInspectorDesignation] = useState('Senior Technical Auditor, MSDE');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Quarterly physical verification of high-power training equipment and safety gear.');

  const availableRooms = classrooms.filter(r => r.centreId === centreId);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleInspection({
      centreId,
      classroomId,
      inspectorName,
      inspectorDesignation,
      scheduledDate,
      equipmentVerifiedCount: 0,
      equipmentConditionNotes: notes,
      operationalStatusAssessment: 'operational',
      followUpRequired: false,
      actionItems: ['Verify machinery safety tags', 'Review electrical ground fault circuit'],
    });
    setShowScheduleModal(false);
  };

  const markComplete = (id: string) => {
    updateInspection(id, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
      equipmentVerifiedCount: 20,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Field Operations & Quality Audits
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Physical Inspections</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Inspections & Maintenance Workflow
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Physical on-site inspections verify equipment operability separate from visual detection.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Schedule Physical Inspection
        </button>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inspections.map((insp) => {
          const centre = centres.find(c => c.id === insp.centreId);
          const room = classrooms.find(r => r.id === insp.classroomId);

          return (
            <div key={insp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {insp.id}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{insp.inspectorName}</h3>
                  <div className="text-[11px] text-slate-500">{insp.inspectorDesignation}</div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                  insp.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  insp.status === 'scheduled' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-800 border border-amber-300'
                }`}>
                  {insp.status}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 space-y-1">
                <div><strong>Location:</strong> {centre?.name} ({room?.name || 'Classroom'})</div>
                <div><strong>Date:</strong> {insp.scheduledDate} {insp.completedDate ? `(Completed: ${insp.completedDate})` : ''}</div>
                <div><strong>Notes:</strong> {insp.equipmentConditionNotes}</div>
              </div>

              {insp.actionItems && insp.actionItems.length > 0 && (
                <div className="text-xs">
                  <div className="font-semibold text-slate-700 mb-1">Audit Action Items:</div>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                    {insp.actionItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-xs font-semibold ${
                  insp.operationalStatusAssessment === 'operational' ? 'text-emerald-700' :
                  insp.operationalStatusAssessment === 'partial_faults' ? 'text-amber-700' : 'text-red-600'
                }`}>
                  Condition: {insp.operationalStatusAssessment.replace(/_/g, ' ')}
                </span>

                {insp.status !== 'completed' && (
                  <button
                    onClick={() => markComplete(insp.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                  >
                    Mark Inspection Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Schedule Inspection */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900">Schedule Physical Audit Inspection</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSchedule} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Centre</label>
                <select
                  value={centreId}
                  onChange={(e) => setCentreId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Room</label>
                <select
                  value={classroomId}
                  onChange={(e) => setClassroomId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {availableRooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Auditor Name</label>
                  <input
                    type="text"
                    required
                    value={inspectorName}
                    onChange={(e) => setInspectorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={inspectorDesignation}
                  onChange={(e) => setInspectorDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Inspection Objectives</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
