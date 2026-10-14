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
  ExternalLink,
  Trophy,
  Camera,
  Crosshair
} from 'lucide-react';
import { formatDateTime } from '../../utils/complianceEngine';
import cctvFactoryImg from '../../assets/images/cctv_factory_workshop_1791819809488.jpg';
import cctvClassroomImg from '../../assets/images/cctv_classroom_attendance_1791819789935.jpg';
import { useLiveCctvClock } from '../../utils/useLiveCctvClock';
import { TAMIL_NADU_DISTRICTS, INDIAN_STATES } from '../../utils/placesData';

export const OverviewDashboard: React.FC = () => {
  const cctvClock = useLiveCctvClock(1000);
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
    settings,
    setGeminiAssistantOpen,
    triggerPinpoint
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
  const [newCentreState, setNewCentreState] = useState('Tamil Nadu');
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
      state: newCentreState,
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
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-cyan-400 font-mono">
              Problem ID: 26245 · Smart Education
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Ministry of Skill Development & Entrepreneurship</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            SAIMS — Real-Time Training Centre Compliance Dashboard
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Autonomous vision inspection, attendance integrity verification, and infrastructure auditing across 18 live camera sections.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('jury-showcase')}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-lg text-xs font-bold transition-all shadow-xs ring-1 ring-amber-400/40 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 fill-current" />
            Jury Showcase & Simulation Arena
          </button>
          <button
            onClick={() => setActivePage('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Video className="w-3.5 h-3.5" />
            Live CCTV Feeds (18)
          </button>
          <button
            onClick={() => setActivePage('monitoring')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Students Take Attendance
          </button>
          <button
            onClick={() => setActivePage('places')}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-800 dark:text-cyan-300 rounded-lg text-xs font-semibold border border-blue-200 dark:border-blue-800 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            Places (38 TN Districts)
          </button>
          <button
            onClick={() => setActivePage('analysis')}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 dark:bg-purple-950/80 hover:bg-purple-100 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-200 dark:border-purple-800 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            AI Video Audit
          </button>
          <button
            onClick={() => setShowAddCentreModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            Add Centre
          </button>
        </div>
      </div>

      {/* Elite Gemini AI Copilot Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-blue-800/40 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-500/30 text-cyan-300 border border-blue-400/30">
                ✨ GOOGLE GEMINI 3.8 FLASH
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Autonomous Surveillance Guardian
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Zero-Knowledge AI Surveillance & Compliance Assistant
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              New to the system? You don't need any training or manual reading. Gemini AI monitors all 3 CCTV streams, tracks lab equipment, audits trainee attendance, and diagnoses compliance issues for you in real-time.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <button
              onClick={() => setGeminiAssistantOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-slate-950 shadow-md flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Launch Gemini Copilot</span>
              <span className="bg-slate-950/20 text-slate-950 px-1.5 py-0.2 rounded text-[10px] font-mono">
                Ctrl+K
              </span>
            </button>

            <button
              onClick={() => {
                triggerPinpoint({
                  name: 'Soldering Station',
                  category: 'tool',
                  x: 79.4,
                  y: 91.0,
                  camId: 'cam-1',
                  note: 'Workbench #4'
                });
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🎯 Locate Soldering Tool</span>
            </button>
          </div>
        </div>

        {/* 1-Click Quick Prompts Pill Row */}
        <div className="relative z-10 mt-4 pt-3 border-t border-blue-900/40 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold">1-Click Zero-Knowledge Checks:</span>
          <button
            onClick={() => setGeminiAssistantOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-200 border border-blue-700/50 text-[11px] transition-colors cursor-pointer"
          >
            🟢 30-Second Centre Briefing
          </button>
          <button
            onClick={() => setGeminiAssistantOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-200 border border-blue-700/50 text-[11px] transition-colors cursor-pointer"
          >
            👥 Who is Absent Today?
          </button>
          <button
            onClick={() => setGeminiAssistantOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-200 border border-blue-700/50 text-[11px] transition-colors cursor-pointer"
          >
            🛡️ Verify MSDE Accreditation
          </button>
          <button
            onClick={() => setGeminiAssistantOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 text-cyan-200 border border-blue-700/50 text-[11px] transition-colors cursor-pointer"
          >
            🚨 Resolve Active Alerts
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TWIN LIVE CCTV SURVEILLANCE SHOWCASE (FACTORY MISSING TOOLS + CLASSROOM ATTENDANCE) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. FACTORY CCTV: MISSING OBJECT DETECTION */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-red-500" />
                Factory CCTV · Missing Tool Detection
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 px-2 py-0.5 rounded">
              ⚠️ 2 MISSING TOOLS FLAGGED
            </span>
          </div>

          <div
            onClick={() => {
              triggerPinpoint({
                name: 'Soldering Station #2 (MISSING)',
                category: 'tool',
                x: 74.0,
                y: 44.0,
                camId: 'cam-factory',
                note: 'Workbench #4 (Station 24)'
              });
            }}
            className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 cursor-pointer group shadow-md"
            title="Click to Lock Optical Reticle onto Missing Soldering Tool"
          >
            <img
              src={cctvFactoryImg}
              alt="Factory Workshop CCTV Feed"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
            />

            {/* OSD Running Clock */}
            <div className="absolute top-0 inset-x-0 p-2.5 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between font-mono text-[10px] text-white">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                ● REC · {cctvClock.cctvOsdString}
              </span>
              <span className="text-cyan-300">CAM-12 ELECTRONICS BAY</span>
            </div>

            {/* Missing Tool Bounding Reticle 1 */}
            <div
              className="absolute border-2 border-dashed border-red-500 bg-red-500/20 rounded shadow-md pointer-events-none animate-pulse"
              style={{ left: '72%', top: '41%', width: '15%', height: '18%' }}
            >
              <div className="absolute -top-5 left-0 bg-red-600 text-white font-mono text-[8px] px-1 py-0.2 rounded font-extrabold whitespace-nowrap">
                ⚠️ MISSING: Soldering Station #2
              </div>
            </div>

            {/* Missing Tool Bounding Reticle 2 */}
            <div
              className="absolute border-2 border-dashed border-red-500 bg-red-500/20 rounded shadow-md pointer-events-none"
              style={{ left: '22%', top: '38%', width: '9%', height: '12%' }}
            >
              <div className="absolute -top-5 left-0 bg-red-600 text-white font-mono text-[8px] px-1 py-0.2 rounded font-bold whitespace-nowrap">
                ⚠️ EMPTY: Tablet Scanner
              </div>
            </div>

            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] text-white">
              <span className="bg-black/75 px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                Click to inspect on CCTV stream →
              </span>
              <span className="bg-emerald-600/90 px-2 py-0.5 rounded font-mono font-bold">
                14 Tools In Place
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Station 24: Unreturned tool detected by edge vision
            </span>
            <button
              onClick={() => {
                triggerPinpoint({
                  name: 'Soldering Station #2 (MISSING)',
                  category: 'tool',
                  x: 74.0,
                  y: 44.0,
                  camId: 'cam-factory',
                  note: 'Workbench #4 (Station 24)'
                });
              }}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              Open Factory Reticle →
            </button>
          </div>
        </div>

        {/* 2. CLASSROOM CCTV: SAMPLE ATTENDANCE AUDIT */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                Classroom CCTV · Live Trainee Attendance
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
              ✓ 18 PRESENT · 2 ABSENT
            </span>
          </div>

          <div
            onClick={() => setActivePage('attendance')}
            className="relative aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 cursor-pointer group shadow-md"
            title="Click to View Full Attendance Roster"
          >
            <img
              src={cctvClassroomImg}
              alt="Classroom Attendance CCTV Feed"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
            />

            {/* OSD Running Clock */}
            <div className="absolute top-0 inset-x-0 p-2.5 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex items-center justify-between font-mono text-[10px] text-white">
              <span className="text-red-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                ● REC · {cctvClock.cctvOsdString}
              </span>
              <span className="text-cyan-300">CAM-04 ROOM 102</span>
            </div>

            {/* Present Trainee Green Box */}
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-500/15 rounded pointer-events-none"
              style={{ left: '62%', top: '65%', width: '13%', height: '24%' }}
            >
              <div className="absolute -top-4 left-0 bg-emerald-700 text-white font-mono text-[8px] px-1 py-0.2 rounded font-bold whitespace-nowrap">
                ✓ Alex Chen · Present (99%)
              </div>
            </div>

            {/* Absent Trainee Red Box */}
            <div
              className="absolute border-2 border-dashed border-red-500 bg-red-500/20 rounded pointer-events-none animate-pulse"
              style={{ left: '74%', top: '43%', width: '10%', height: '17%' }}
            >
              <div className="absolute -top-5 left-0 bg-red-600 text-white font-mono text-[8px] px-1 py-0.2 rounded font-bold whitespace-nowrap">
                ⚠️ Amanda Ross (Absent)
              </div>
            </div>

            <div className="absolute bottom-2 inset-x-2 flex items-center justify-between text-[10px] text-white">
              <span className="bg-black/75 px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                Click to open attendance register →
              </span>
              <span className="bg-emerald-600/90 px-2 py-0.5 rounded font-mono font-bold">
                90% Batch Rate
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Chennai Technical Hub: Room 102 Theory Lecture
            </span>
            <button
              onClick={() => setActivePage('attendance')}
              className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              View Attendance Page →
            </button>
          </div>
        </div>
      </div>

      {/* 18 LIVE CAMERA SECTIONS QUICK-LAUNCH STRIP */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              18 Live Camera Surveillance Sections Online
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              ● ALL STREAMS ACTIVE
            </span>
          </div>
          <button
            onClick={() => setActivePage('monitoring')}
            className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Launch Multi-Grid Operations Center</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Click any camera section below to immediately open the stream with calibrated optical reticles and interactive pinpoint placement:
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'cam-factory', label: '🏭 Cam 12: Factory Electronics', note: '2 Missing Tools' },
            { id: 'cam-classroom', label: '👥 Cam 04: Classroom Attendance', note: '18 Students' },
            { id: 'cam-welding', label: '🔥 Cam 06: Heavy Welding Bay', note: 'Argon Station' },
            { id: 'cam-cnc', label: '⚙️ Cam 08: Precision CNC Cell', note: 'Spindle & DRO' },
            { id: 'cam-iot-server', label: '🖥️ Cam 14: Cloud Server Racks', note: '42U Racks' },
            { id: 'cam-robotics', label: '🤖 Cam 09: Robotics Arm Arena', note: '6-Axis Arm' },
            { id: 'cam-pc-lab-a', label: '💻 Cam 01: IT Computer Lab A', note: '35 Terminals' },
            { id: 'cam-sewing', label: '🧵 Cam 05: Garment Sewing Hall', note: 'Juki Machines' },
            { id: 'cam-electrical', label: '⚡ Cam 03: Electrical Bench Rig', note: '3-Phase AC/DC' },
            { id: 'cam-turnstile', label: '🛂 Cam 00: Security Turnstile Gate', note: 'Biometrics' },
            { id: 'cam-storage', label: '📦 Cam 11: Tool Crib & Locker', note: 'Micrometers' },
            { id: 'cam-safety-station', label: '🦺 Cam 15: OSHA Safety Station', note: 'Eye-Wash & Fire' },
            { id: 'cam-automotive', label: '🚗 Cam 16: Automotive Hoist Bay', note: 'Hydraulic Lift' },
            { id: 'cam-drone-bay', label: '🛸 Cam 19: Drone Avionics Arena', note: 'Flight Cage' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => {
                triggerPinpoint({
                  name: c.label,
                  category: 'facility',
                  x: 50.0,
                  y: 50.0,
                  camId: c.id
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 duration-75 cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <span>{c.label}</span>
              <span className="text-[9px] font-mono opacity-60 bg-black/5 dark:bg-white/10 px-1 py-0.2 rounded">
                {c.note}
              </span>
            </button>
          ))}
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
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All States (28 States)</option>
              {INDIAN_STATES.map(s => (
                <option key={s.code} value={s.name}>
                  {s.name} ({s.capital})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] text-slate-500 font-medium">District:</label>
            <select
              value={selectedDistrictFilter}
              onChange={(e) => setSelectedDistrictFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium"
            >
              <option value="all">All Districts (38 TN)</option>
              {TAMIL_NADU_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>
                  #{d.number} {d.name} {d.isCapital ? '★ Capital' : ''}
                </option>
              ))}
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
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Centre Code</label>
                  <input
                    type="text"
                    required
                    value={newCentreCode}
                    onChange={(e) => setNewCentreCode(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">State (28 States)</label>
                  <select
                    value={newCentreState}
                    onChange={(e) => setNewCentreState(e.target.value)}
                    style={{ colorScheme: 'light dark' }}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s.code} value={s.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                        {s.name} ({s.capital})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">District (38 TN)</label>
                  {newCentreState === 'Tamil Nadu' ? (
                    <select
                      value={newCentreDistrict}
                      onChange={(e) => setNewCentreDistrict(e.target.value)}
                      style={{ colorScheme: 'light dark' }}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-600 cursor-pointer font-medium"
                    >
                      {TAMIL_NADU_DISTRICTS.map(d => (
                        <option key={d.id} value={d.name} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium">
                          #{d.number} {d.name} {d.isCapital ? '★ Capital' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={newCentreDistrict}
                      onChange={(e) => setNewCentreDistrict(e.target.value)}
                      placeholder="District name..."
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
                    />
                  )}
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
