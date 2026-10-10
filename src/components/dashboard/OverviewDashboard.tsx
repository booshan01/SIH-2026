import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Video,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Filter,
  PlusCircle,
  Upload,
  UserCheck,
  PackagePlus,
  FileBarChart,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Wifi,
  ExternalLink
} from 'lucide-react';
import { formatDateTime } from '../../utils/complianceEngine';

export const OverviewDashboard: React.FC = () => {
  const {
    centres,
    cameras,
    attendance,
    inventory,
    alerts,
    inspections,
    analysisRuns,
    setActivePage,
    setSelectedCentreId,
    addCentre,
    submitAttendance,
    addInventoryItem,
    classrooms,
    currentUser,
    settings
  } = useApp();

  // Filters
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('all');

  // Quick Action Modals
  const [showAddCentreModal, setShowAddCentreModal] = useState(false);
  const [showSubmitAttendanceModal, setShowSubmitAttendanceModal] = useState(false);

  // New Centre Form State
  const [newCentreCode, setNewCentreCode] = useState('TN-SLM-0518');
  const [newCentreName, setNewCentreName] = useState('Salem Skill Development Academy');
  const [newCentreDistrict, setNewCentreDistrict] = useState('Salem');
  const [newCentreAddress, setNewCentreAddress] = useState('14, Meyyanur Main Road, Salem, Tamil Nadu');
  const [newCentreManager, setNewCentreManager] = useState('K. R. Vasanth');
  const [newCentreEmail, setNewCentreEmail] = useState('salem.centre@msde.gov.in');
  const [newCentrePhone, setNewCentrePhone] = useState('+91 427 244 5510');

  // Quick Attendance Form State
  const [attCentreId, setAttCentreId] = useState(centres[0]?.id || '');
  const [attClassroomId, setAttClassroomId] = useState(classrooms[0]?.id || '');
  const [attBatchName, setAttBatchName] = useState('Solar PV Installer (Batch 26-F)');
  const [attRegistered, setAttRegistered] = useState(25);
  const [attPresent, setAttPresent] = useState(24);
  const [attEstimated, setAttEstimated] = useState(20);

  // Filtered centres
  const filteredCentres = useMemo(() => {
    return centres.filter(c => {
      if (selectedStateFilter !== 'all' && c.state !== selectedStateFilter) return false;
      if (selectedDistrictFilter !== 'all' && c.district !== selectedDistrictFilter) return false;
      return true;
    });
  }, [centres, selectedStateFilter, selectedDistrictFilter]);

  // Dynamic KPI Calculations from stored state
  const totalRegisteredCentres = centres.length;
  const activeMonitoredCentres = centres.filter(c => c.status === 'active' || c.status === 'under_review').length;
  const centresRequiringAttention = centres.filter(c => c.complianceScore < 85 || c.status === 'under_review').length;
  
  const attendanceAlertsCount = alerts.filter(a => a.alertType === 'attendance_discrepancy').length;
  const infraAlertsCount = alerts.filter(a => a.alertType === 'equipment_shortage' || a.alertType === 'uncertain_detection').length;
  const openAlertsCount = alerts.filter(a => a.reviewStatus === 'pending' || a.reviewStatus === 'in_review').length;

  const verifiedAttendanceCount = attendance.filter(a => a.verificationStatus === 'verified').length;
  const complianceRate = attendance.length > 0 ? Math.round((verifiedAttendanceCount / attendance.length) * 100) : 100;

  const onlineCameras = cameras.filter(c => c.status === 'connected').length;
  const cameraAvailabilityRate = cameras.length > 0 ? Math.round((onlineCameras / cameras.length) * 100) : 100;

  const successfulAnalyses = analysisRuns.filter(r => r.status === 'completed').length;
  const analysisSuccessRate = analysisRuns.length > 0 ? Math.round((successfulAnalyses / analysisRuns.length) * 100) : 100;

  const pendingInspectionsCount = inspections.filter(i => i.status === 'scheduled' || i.status === 'in_progress').length;

  // Recent alerts filtered
  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      if (selectedSeverityFilter !== 'all' && a.severity !== selectedSeverityFilter) return false;
      return true;
    });
  }, [alerts, selectedSeverityFilter]);

  // Handle Create Centre
  const handleCreateCentre = (e: React.FormEvent) => {
    e.preventDefault();
    addCentre({
      code: newCentreCode,
      name: newCentreName,
      state: 'Tamil Nadu',
      district: newCentreDistrict,
      address: newCentreAddress,
      managerName: newCentreManager,
      contactEmail: newCentreEmail,
      contactPhone: newCentrePhone,
      totalClassrooms: 3,
      activeCameras: 3,
      status: 'active',
      complianceScore: 90,
    });
    setShowAddCentreModal(false);
  };

  // Handle Quick Attendance Submit
  const handleQuickSubmitAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    submitAttendance({
      centreId: attCentreId,
      classroomId: attClassroomId,
      batchName: attBatchName,
      sessionDate: new Date().toISOString().split('T')[0],
      scheduledStart: '10:00',
      scheduledEnd: '13:00',
      registeredCount: Number(attRegistered),
      submittedPresent: Number(attPresent),
      submittedAbsent: Number(attRegistered) - Number(attPresent),
      estimatedPeopleCount: Number(attEstimated),
      coverageStatus: 'optimal',
      confidenceScore: 0.88,
      submittedBy: `${currentUser.name} (${currentUser.role})`,
      notes: 'Submitted via Quick Action on Dashboard.',
    });
    setShowSubmitAttendanceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Gov/MSDE Header & Quick Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Problem ID: 26245 · Smart Education
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Ministry of Skill Development & Entrepreneurship</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            SAIMS — Real-Time Training Centre Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Autonomous vision inspection, attendance integrity verification, and infrastructure auditing.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Video className="w-3.5 h-3.5" />
            Live CCTV Feeds (8)
          </button>
          <button
            onClick={() => setActivePage('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            Students Take Attendance
          </button>
          <button
            onClick={() => setActivePage('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            Check Classroom Things
          </button>
          <button
            onClick={() => setActivePage('analysis')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600" />
            AI Video Audit
          </button>
          <button
            onClick={() => setShowAddCentreModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-medium border border-slate-300 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600" />
            Add Centre
          </button>
        </div>
      </div>

      {/* Fictional Sample Data Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg px-4 py-2.5 flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demonstration Dataset:</strong> Pre-seeded with 4 Tamil Nadu training centres and all 6 compliance test scenarios. All metrics calculate dynamically from local storage.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-amber-700 font-mono">
          <span>Last Sync: {formatDateTime(settings.connectivity.lastSyncTimestamp)}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Dashboard Filters:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">State:</label>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All States (1)</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">District:</label>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Districts (4)</option>
              <option value="Chennai">Chennai</option>
              <option value="Madurai">Madurai</option>
              <option value="Coimbatore">Coimbatore</option>
              <option value="Tiruchirappalli">Tiruchirappalli</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">Severity:</label>
            <select
              value={selectedSeverityFilter}
              onChange={(e) => setSelectedSeverityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          </div>

          {(selectedStateFilter !== 'all' || selectedDistrictFilter !== 'all' || selectedSeverityFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedStateFilter('all');
                setSelectedDistrictFilter('all');
                setSelectedSeverityFilter('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid (Clickable to jump to relevant pages) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Centres */}
        <div
          onClick={() => setActivePage('centres')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Registered Centres</span>
            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalRegisteredCentres}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-medium">{activeMonitoredCentres} Monitored</span>
            <span className="text-blue-600 group-hover:underline flex items-center">
              View <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Attention Required */}
        <div
          onClick={() => setActivePage('centres')}
          className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-amber-800 text-xs font-medium">
            <span>Needs Attention</span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-900">{centresRequiringAttention}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-amber-700">Audit / Review flagged</span>
            <span className="text-amber-800 group-hover:underline flex items-center">
              Filter <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Attendance Discrepancies */}
        <div
          onClick={() => setActivePage('attendance')}
          className="bg-white border border-red-200 rounded-xl p-4 shadow-xs hover:border-red-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-red-800 text-xs font-medium">
            <span>Attendance Discrepancies</span>
            <UserCheck className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-red-900">{attendanceAlertsCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-red-700 font-medium">Tolerance: &gt; {settings.monitoring.attendanceDiscrepancyThreshold}</span>
            <span className="text-red-700 group-hover:underline flex items-center">
              Review <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Infrastructure Discrepancies */}
        <div
          onClick={() => setActivePage('infrastructure')}
          className="bg-white border border-blue-200 rounded-xl p-4 shadow-xs hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-blue-800 text-xs font-medium">
            <span>Infra Discrepancies</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-900">{infraAlertsCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-blue-700 font-medium">Shortage / low conf</span>
            <span className="text-blue-700 group-hover:underline flex items-center">
              Inspect <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Alerts Awaiting Review */}
        <div
          onClick={() => setActivePage('alerts')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-medium">
            <span>Awaiting Review</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{openAlertsCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-purple-700 font-medium">Pending Officer Action</span>
            <span className="text-purple-700 group-hover:underline flex items-center">
              Inbox <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="border-r border-slate-100 pr-3">
          <div className="text-[11px] text-slate-500 font-medium">Attendance Verified Rate</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">{complianceRate}%</div>
          <div className="text-[10px] text-slate-400">Human & AI verified sessions</div>
        </div>
        <div className="border-r border-slate-100 pr-3">
          <div className="text-[11px] text-slate-500 font-medium">Camera Availability Rate</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">{cameraAvailabilityRate}%</div>
          <div className="text-[10px] text-slate-400">{onlineCameras}/{cameras.length} CCTV streams active</div>
        </div>
        <div className="border-r border-slate-100 pr-3">
          <div className="text-[11px] text-slate-500 font-medium">Video Processing Success</div>
          <div className="text-lg font-bold text-indigo-700 mt-0.5">{analysisSuccessRate}%</div>
          <div className="text-[10px] text-slate-400">YOLOv8 Edge inference runs</div>
        </div>
        <div>
          <div className="text-[11px] text-slate-500 font-medium">Pending Inspections</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{pendingInspectionsCount}</div>
          <div className="text-[10px] text-slate-400">Physical field verifications</div>
        </div>
      </div>

      {/* Interactive Charts & Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Discrepancy Trend (SVG Crisp Graphic) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Attendance Integrity Trend (Last 7 Days)</h3>
                <p className="text-xs text-slate-500">Submitted roster count vs AI visual people count</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full" /> Submitted
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" /> Visual Count
                </span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="mt-6 h-48 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#e2e8f0" strokeWidth="1" />

                {/* Y Axis Labels */}
                <text x="10" y="24" fontSize="10" fill="#94a3b8">35</text>
                <text x="10" y="64" fontSize="10" fill="#94a3b8">25</text>
                <text x="10" y="104" fontSize="10" fill="#94a3b8">15</text>
                <text x="10" y="144" fontSize="10" fill="#94a3b8">0</text>

                {/* Submitted Attendance Line (Blue) */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  points="60,42 130,40 200,45 270,38 340,42 410,40 460,42"
                />
                {/* Visual Count Line (Emerald with red dip at Chennai) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  points="60,44 130,42 200,50 270,95 340,42 410,40 460,43"
                />

                {/* Discrepancy Highlight Circle (Chennai Incident on 09 Oct) */}
                <circle cx="270" cy="95" r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                <text x="250" y="115" fontSize="10" fontWeight="bold" fill="#dc2626">Diff -12 (Alert)</text>

                {/* Data Points */}
                {[
                  [60, 42], [130, 40], [200, 45], [270, 38], [340, 42], [410, 40], [460, 42]
                ].map(([x, y], i) => (
                  <circle key={`sub-${i}`} cx={x} cy={y} r="3" fill="#2563eb" />
                ))}

                {[
                  [60, 44], [130, 42], [200, 50], [340, 42], [410, 40], [460, 43]
                ].map(([x, y], i) => (
                  <circle key={`vis-${i}`} cx={x} cy={y} r="3" fill="#10b981" />
                ))}

                {/* X Axis Labels */}
                <text x="50" y="156" fontSize="10" fill="#64748b">03 Oct</text>
                <text x="120" y="156" fontSize="10" fill="#64748b">04 Oct</text>
                <text x="190" y="156" fontSize="10" fill="#64748b">05 Oct</text>
                <text x="255" y="156" fontSize="10" fill="#dc2626" fontWeight="bold">09 Oct (Today)</text>
                <text x="330" y="156" fontSize="10" fill="#64748b">10 Oct</text>
                <text x="400" y="156" fontSize="10" fill="#64748b">11 Oct</text>
                <text x="445" y="156" fontSize="10" fill="#64748b">12 Oct</text>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Mean absolute difference: <strong className="text-slate-800">1.8 trainees</strong>
            </span>
            <button
              onClick={() => setActivePage('attendance')}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              Open Full Attendance Table <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Alert Breakdown by Severity */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Alerts by Severity</h3>
              <span className="text-xs text-slate-400 font-mono">Total {alerts.length}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Distribution of operational & compliance flags</p>

            {/* Severity Bars */}
            <div className="mt-5 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-red-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600" /> Critical ({alerts.filter(a => a.severity === 'critical').length})
                  </span>
                  <span className="text-slate-500">
                    {Math.round((alerts.filter(a => a.severity === 'critical').length / alerts.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${(alerts.filter(a => a.severity === 'critical').length / alerts.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> High ({alerts.filter(a => a.severity === 'high').length})
                  </span>
                  <span className="text-slate-500">
                    {Math.round((alerts.filter(a => a.severity === 'high').length / alerts.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-amber-500 h-2 rounded-full" 
                    style={{ width: `${(alerts.filter(a => a.severity === 'high').length / alerts.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-blue-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" /> Medium ({alerts.filter(a => a.severity === 'medium').length})
                  </span>
                  <span className="text-slate-500">
                    {Math.round((alerts.filter(a => a.severity === 'medium').length / alerts.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(alerts.filter(a => a.severity === 'medium').length / alerts.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Low ({alerts.filter(a => a.severity === 'low').length})
                  </span>
                  <span className="text-slate-500">0%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-300 h-2 rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActivePage('alerts')}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
            >
              Manage & Resolve Alerts ({openAlertsCount} Open)
            </button>
          </div>
        </div>
      </div>

      {/* Training Centres Monitoring Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Training Centres Real-Time Status</h3>
            <p className="text-xs text-slate-500">Compliance score, classroom coverage, and live telemetry</p>
          </div>
          <button
            onClick={() => setActivePage('centres')}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            All Centres ({centres.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Centre Name & Code</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Rooms / Cameras</th>
                <th className="py-3 px-4">Compliance Score</th>
                <th className="py-3 px-4">Monitoring Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCentres.map((centre) => {
                const centreCameras = cameras.filter(c => c.centreId === centre.id);
                const onlineCam = centreCameras.filter(c => c.status === 'connected').length;
                return (
                  <tr key={centre.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{centre.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{centre.code}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{centre.district}</div>
                      <div className="text-[11px] text-slate-400">{centre.state}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{centre.totalClassrooms} Classrooms</div>
                      <div className="text-[11px] flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${onlineCam === centreCameras.length ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{onlineCam}/{centreCameras.length} Cameras Online</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              centre.complianceScore >= 90 ? 'bg-emerald-600' :
                              centre.complianceScore >= 75 ? 'bg-amber-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${centre.complianceScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800">{centre.complianceScore}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {centre.status === 'active' && (
                        <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                          Active & Monitored
                        </span>
                      )}
                      {centre.status === 'under_review' && (
                        <span className="text-amber-800 font-medium bg-amber-50 border border-amber-300 px-2 py-0.5 rounded text-[11px]">
                          Audit Required
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCentreId(centre.id);
                          setActivePage('centre-detail');
                        }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        Inspect Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts Feed & Centres with Discrepancies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Open Alerts */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Recent Discrepancy Alerts</h3>
              <p className="text-xs text-slate-500">Autonomous triggers awaiting verification</p>
            </div>
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              All Alerts ({alerts.length}) →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {filteredAlerts.slice(0, 4).map((alert) => {
              const centre = centres.find(c => c.id === alert.centreId);
              return (
                <div key={alert.id} className="py-3 text-xs flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'high' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-semibold text-slate-900">{alert.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {centre?.name} · {formatDateTime(alert.createdAt)}
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1 line-clamp-1">
                      {alert.explanation}
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePage('alerts')}
                    className="shrink-0 text-[11px] text-blue-600 hover:text-blue-800 font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded"
                  >
                    Review
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Infrastructure Compliance Highlights */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Equipment Inventory Audit Status</h3>
              <p className="text-xs text-slate-500">Physical vs detected industrial machinery</p>
            </div>
            <button
              onClick={() => setActivePage('infrastructure')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              View Infrastructure →
            </button>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {inventory.slice(0, 4).map((item) => {
              const centre = centres.find(c => c.id === item.centreId);
              return (
                <div key={item.id} className="py-3 text-xs flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-900">{item.itemName}</div>
                    <div className="text-[11px] text-slate-500">
                      {centre?.name} · Category: <span className="capitalize">{item.category.replace(/_/g, ' ')}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xs">
                      <span className="font-bold text-slate-900">{item.detectedQuantity}</span>
                      <span className="text-slate-400"> / {item.approvedQuantity} approved</span>
                    </div>
                    {item.countDifference < 0 ? (
                      <span className="text-[10px] text-red-600 font-semibold">
                        Shortage ({Math.abs(item.countDifference)})
                      </span>
                    ) : item.countDifference === 0 ? (
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        100% Verified
                      </span>
                    ) : (
                      <span className="text-[10px] text-blue-600 font-semibold">
                        Excess (+{item.countDifference})
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Add Centre */}
      {showAddCentreModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h2 className="font-bold text-base text-slate-900">Register New Training Centre</h2>
            <p className="text-xs text-slate-500 mt-0.5">MSDE Approved Skill Development Facility</p>

            <form onSubmit={handleCreateCentre} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Code</label>
                  <input
                    type="text"
                    required
                    value={newCentreCode}
                    onChange={(e) => setNewCentreCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={newCentreDistrict}
                    onChange={(e) => setNewCentreDistrict(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Full Name</label>
                <input
                  type="text"
                  required
                  value={newCentreName}
                  onChange={(e) => setNewCentreName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={newCentreAddress}
                  onChange={(e) => setNewCentreAddress(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Manager</label>
                  <input
                    type="text"
                    required
                    value={newCentreManager}
                    onChange={(e) => setNewCentreManager(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    required
                    value={newCentrePhone}
                    onChange={(e) => setNewCentrePhone(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={newCentreEmail}
                  onChange={(e) => setNewCentreEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCentreModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Training Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Quick Submit Attendance */}
      {showSubmitAttendanceModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h2 className="font-bold text-base text-slate-900">Submit Classroom Attendance Figure</h2>
            <p className="text-xs text-slate-500 mt-0.5">Automated visual cross-verification will run immediately</p>

            <form onSubmit={handleQuickSubmitAttendance} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Centre</label>
                <select
                  value={attCentreId}
                  onChange={(e) => setAttCentreId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Batch / Course Title</label>
                <input
                  type="text"
                  required
                  value={attBatchName}
                  onChange={(e) => setAttBatchName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Registered</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={attRegistered}
                    onChange={(e) => setAttRegistered(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Submitted Present</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={attPresent}
                    onChange={(e) => setAttPresent(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Visual Count (AI)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={attEstimated}
                    onChange={(e) => setAttEstimated(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Discrepancy:</span>
                  <span className={`font-bold font-mono ${
                    Math.abs(attPresent - attEstimated) >= settings.monitoring.attendanceDiscrepancyThreshold
                      ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {Math.abs(attPresent - attEstimated)} Trainees
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Threshold is {settings.monitoring.attendanceDiscrepancyThreshold}. Exceeding this triggers an automated inspection alert.
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitAttendanceModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Submit & Compare
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
