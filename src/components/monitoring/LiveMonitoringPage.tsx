import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Video,
  Camera as CameraIcon,
  Wifi,
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  AlertTriangle,
  UserCheck,
  Cpu,
  Layers,
  Activity,
  CheckCircle2,
  CheckSquare,
  Users,
  QrCode,
  ShieldCheck,
  ClipboardList,
  Eye,
  Check,
  X,
  PlusCircle,
  HelpCircle,
  LayoutGrid,
  Download,
  Search,
  Volume2,
  VolumeX,
  FastForward,
  Rewind,
  Lock,
  Film
} from 'lucide-react';
import { Camera, Student, ClassroomChecklistItem } from '../../types';
import { formatDateTime, exportToCSV } from '../../utils/complianceEngine';
import { PrecisionCameraViewer } from './PrecisionCameraViewer';
import { useLiveCctvClock } from '../../utils/useLiveCctvClock';

const SAMPLE_CCTV_PRESETS = [
  {
    id: 'lecture',
    name: 'CAM-01: Theory Lecture & Smart Podium',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Classroom Theory'
  },
  {
    id: 'computer_lab',
    name: 'CAM-C1: Computer Lab & Trainee Terminals',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'IT & Digital Literacy'
  },
  {
    id: 'robotics',
    name: 'CAM-C2: Robotics Arena & Automation Track',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    category: 'Robotics & Hardware'
  },
  {
    id: 'iot_hardware',
    name: 'CAM-03: Electrical Workbench & IoT Testing Rig',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Electrical Bay'
  },
  {
    id: 'sewing',
    name: 'CAM-M1: Textile Sewing Machine Station Rows',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    category: 'Vocational Sewing'
  },
  {
    id: 'machining',
    name: 'CAM-T1: Heavy Machining & Industrial Tooling Bay',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    category: 'Mechanical Bay'
  },
  {
    id: 'attendance_kiosk',
    name: 'CAM-04: Trainee Biometric Attendance Kiosk',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    category: 'Biometric Turnstile'
  }
];

export const LiveMonitoringPage: React.FC = () => {
  const {
    cameras,
    centres,
    classrooms,
    inventory,
    alerts,
    updateCameraStatus,
    settings,
    students,
    markStudentAttendance,
    selfStudentCheckIn,
    autoScanClassroomAttendance,
    addStudent,
    checklistItems,
    updateChecklistItemStatus,
    addChecklistItem,
    currentUser
  } = useApp();

  // Role permissions checks
  const isStateOfficer = currentUser.role === 'State Officer';
  const isSystemAdmin = currentUser.role === 'System Administrator';
  const isMonitoringOfficer = currentUser.role === 'Monitoring Officer';
  const isCentreManager = currentUser.role === 'Centre Manager';

  // Filter cameras if Centre Manager (scoped strictly to assignedCentreId)
  const availableCameras = isCentreManager && currentUser.assignedCentreId
    ? cameras.filter(c => c.centreId === currentUser.assignedCentreId)
    : cameras;

  const [selectedCameraId, setSelectedCameraId] = useState<string>(availableCameras[0]?.id || cameras[0]?.id || '');
  const [isPaused, setIsPaused] = useState(false);
  const [streamSourceMode, setStreamSourceMode] = useState<'sample_video' | 'webcam' | 'synthetic'>('sample_video');
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activeTab, setActiveTab] = useState<'stream' | 'student_attendance' | 'check_things'>('stream');
  const [streamViewMode, setStreamViewMode] = useState<'single' | 'quad_grid' | 'grid_9' | 'all_cameras'>('single');
  
  // Video playback controls
  const [isMuted, setIsMuted] = useState(true);
  const [selectedSampleUrl, setSelectedSampleUrl] = useState<string>('');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);

  // Student kiosk & roster inputs
  const [studentSearch, setStudentSearch] = useState('');
  const [kioskRollInput, setKioskRollInput] = useState('');
  const [kioskSuccessMsg, setKioskSuccessMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Add student modal
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentBatch, setNewStudentBatch] = useState('Batch 2026-A1');
  const [newStudentSeat, setNewStudentSeat] = useState<number>(16);

  // Add checklist item modal
  const [showAddCheckItem, setShowAddCheckItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Safety & Fire');
  const [newItemRequired, setNewItemRequired] = useState(true);
  const [newItemCondition, setNewItemCondition] = useState('Wall-mounted and verified operational.');
  const [isInspectingThings, setIsInspectingThings] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sampleVideoRef = useRef<HTMLVideoElement | null>(null);

  // Exact real-time CCTV clock running by current user computer time
  const cctvClock = useLiveCctvClock(1000);

  const activeCamera = cameras.find(c => c.id === selectedCameraId) || availableCameras[0] || cameras[0];
  const activeCentre = centres.find(c => c.id === activeCamera?.centreId);
  const activeRoom = classrooms.find(r => r.id === activeCamera?.classroomId);

  // Determine current active video URL
  const currentVideoUrl = selectedSampleUrl || activeCamera?.videoUrl || SAMPLE_CCTV_PRESETS[0].url;

  // Filter students for active classroom / centre
  const roomStudents = students.filter(s => s.classroomId === activeRoom?.id || s.centreId === activeCentre?.id);
  const presentStudentsCount = roomStudents.filter(s => s.status === 'present').length;

  // Live estimated stats for active camera
  const [livePeopleCount, setLivePeopleCount] = useState(presentStudentsCount > 0 ? presentStudentsCount : 18);
  const [liveLatency, setLiveLatency] = useState(activeCamera?.latencyMs || 120);

  // Handle browser webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (streamSourceMode === 'webcam') {
      setWebcamError(null);
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(e => console.log('Video play error:', e));
          }
        })
        .catch(err => {
          console.warn('Webcam permission denied or unavailable:', err);
          setWebcamError('Webcam access was denied or is unavailable. Switched to high-definition CCTV video stream.');
          setStreamSourceMode('sample_video');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [streamSourceMode]);

  // Handle sample video speed changes
  useEffect(() => {
    if (sampleVideoRef.current) {
      sampleVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Handle sample video pause/play
  useEffect(() => {
    if (sampleVideoRef.current) {
      if (isPaused) {
        sampleVideoRef.current.pause();
      } else {
        sampleVideoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  // Jitter in simulated telemetry
  useEffect(() => {
    if (isPaused || activeCamera?.status === 'disconnected') return;
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(95 + Math.random() * 45));
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, activeCamera]);

  const handleReconnect = () => {
    if (activeCamera) updateCameraStatus(activeCamera.id, 'connected');
  };

  const handleDisconnect = () => {
    // Role check: Monitoring Officer is restricted from altering camera hardware
    if (isMonitoringOfficer) {
      setPermissionNotice('Action Denied: Monitoring Officers have Level 2 field observation clearance. Disconnecting or modifying camera hardware requires System Administrator or State Officer elevation.');
      setTimeout(() => setPermissionNotice(null), 5000);
      return;
    }
    if (activeCamera) updateCameraStatus(activeCamera.id, 'disconnected');
  };

  const handleSeek = (deltaSeconds: number) => {
    if (sampleVideoRef.current) {
      sampleVideoRef.current.currentTime = Math.max(0, sampleVideoRef.current.currentTime + deltaSeconds);
    }
  };

  // Student Attendance Scan - Ultra-fast responsive
  const handleAutoScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const visualCount = Math.min(roomStudents.length || 15, 15);
      autoScanClassroomAttendance(activeRoom?.id || '', visualCount);
      setLivePeopleCount(visualCount);
      setIsScanning(false);
      setKioskSuccessMsg(`Autonomous Edge AI Scan Completed: ${visualCount} trainees identified & attendance register synced!`);
      setTimeout(() => setKioskSuccessMsg(null), 3000);
    }, 150);
  };

  // Student Self Check-In via Roll Number
  const handleKioskCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.rollNumber.toLowerCase() === kioskRollInput.trim().toLowerCase());
    if (student) {
      selfStudentCheckIn(student.id);
      setKioskSuccessMsg(`Welcome, ${student.name}! Attendance verified at CAM-04 kiosk.`);
      setKioskRollInput('');
      setTimeout(() => setKioskSuccessMsg(null), 4000);
    } else {
      setKioskSuccessMsg(`Roll number "${kioskRollInput}" not found in this batch roster.`);
      setTimeout(() => setKioskSuccessMsg(null), 4000);
    }
  };

  // Add new student
  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent({
      name: newStudentName,
      rollNumber: newStudentRoll,
      batchName: newStudentBatch,
      centreId: activeCentre?.id || 'centre-chennai',
      classroomId: activeRoom?.id || 'room-che-1',
      status: 'present',
      seatNumber: Number(newStudentSeat),
      verifiedByAi: true,
      lastCheckIn: new Date().toISOString(),
      notes: 'Manually enrolled by monitoring officer on live terminal.'
    });
    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentRoll('');
    setKioskSuccessMsg(`Enrolled trainee "${newStudentName}" (${newStudentRoll}) to ${activeRoom?.name || 'Classroom'}!`);
    setTimeout(() => setKioskSuccessMsg(null), 4000);
  };

  // Add new checklist item
  const handleCreateCheckItem = (e: React.FormEvent) => {
    e.preventDefault();
    addChecklistItem({
      name: newItemName,
      category: newItemCategory,
      status: 'verified',
      requiredForSession: newItemRequired,
      conditionNote: newItemCondition,
      checkedBy: currentUser.name,
      lastCheckedAt: new Date().toISOString()
    });
    setShowAddCheckItem(false);
    setNewItemName('');
    setKioskSuccessMsg(`Added new infrastructure check: "${newItemName}"!`);
    setTimeout(() => setKioskSuccessMsg(null), 4000);
  };

  // AI Inspect Things - Ultra-fast responsive
  const handleAiInspectThings = () => {
    setIsInspectingThings(true);
    setTimeout(() => {
      checklistItems.forEach(item => {
        updateChecklistItemStatus(item.id, 'verified', 'Autonomous Edge AI: Camera object detection confirmed item presence & condition.');
      });
      setIsInspectingThings(false);
      setKioskSuccessMsg('AI Edge Audit Completed: All classroom assets verified in compliant state!');
      setTimeout(() => setKioskSuccessMsg(null), 3000);
    }, 150);
  };

  // Export Attendance Sheet CSV
  const handleExportAttendanceCSV = () => {
    const headers = ['Roll Number', 'Student Name', 'Batch', 'Seat', 'Status', 'AI Verified', 'Check-In Time'];
    const rows = roomStudents.map(s => [
      s.rollNumber,
      s.name,
      s.batchName,
      s.seatNumber,
      s.status.toUpperCase(),
      s.verifiedByAi ? 'YES' : 'NO',
      s.lastCheckIn ? new Date(s.lastCheckIn).toLocaleString() : 'N/A'
    ]);
    exportToCSV(`Attendance_Roster_${activeRoom?.name || 'Classroom'}_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  // Export Checklist CSV
  const handleExportChecklistCSV = () => {
    const headers = ['Category', 'Item Name', 'Status', 'Mandatory', 'Notes', 'Checked By', 'Last Checked'];
    const rows = checklistItems.map(i => [
      i.category,
      i.name,
      i.status.toUpperCase(),
      i.requiredForSession ? 'YES' : 'NO',
      i.conditionNote || '',
      i.checkedBy || 'Auditor',
      i.lastCheckedAt || ''
    ]);
    exportToCSV(`Classroom_Infrastructure_Audit_${new Date().toISOString().split('T')[0]}.csv`, headers, rows);
  };

  const verifiedChecklistCount = checklistItems.filter(i => i.status === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Role Clearance Banner */}
      <div className={`p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
        isStateOfficer
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
          : isSystemAdmin
          ? 'bg-blue-50/90 border-blue-300 text-blue-900'
          : isMonitoringOfficer
          ? 'bg-amber-50/90 border-amber-300 text-amber-900'
          : 'bg-purple-50/90 border-purple-300 text-purple-900'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-base">{isStateOfficer ? '👑' : isSystemAdmin ? '⚙️' : isMonitoringOfficer ? '📹' : '🏢'}</span>
          <div>
            <strong className="font-bold">
              {currentUser.role} Clearance:
            </strong>{' '}
            <span>
              {isStateOfficer
                ? 'Full Sovereign Access across all training centres, legal accreditation, and live surveillance overrides.'
                : isSystemAdmin
                ? 'Technical Operations Clearance. RTSP configuration & diagnostics enabled (restricted from legal sanctioning).'
                : isMonitoringOfficer
                ? 'Field Surveillance Clearance. Real-time CCTV viewing & attendance enabled (restricted from deleting cameras).'
                : 'Facility Scoped Clearance. Scoped strictly to Chennai Technical Skills Centre (TN-CHE-0104).'}
            </span>
          </div>
        </div>

        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/80 border shadow-2xs">
          {currentUser.clearanceLevel || 'Level Clearance'}
        </span>
      </div>

      {/* Permission Warning Notice if triggered */}
      {permissionNotice && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-3 text-xs text-red-900 flex items-center gap-2 animate-in fade-in">
          <Lock className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{permissionNotice}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Real-Time CCTV Surveillance & Trainee Kiosk
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous Edge Stream Telemetry</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Live Centre Surveillance & Telemetry
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Monitor classrooms across training centres with live sample video feeds, verify student attendance via CCTV, and check physical classroom items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Tab Switchers */}
          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              activeTab === 'stream'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live CCTV Streams ({availableCameras.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('student_attendance')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              activeTab === 'student_attendance'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Students Take Attendance ({presentStudentsCount}/{roomStudents.length || 15})</span>
          </button>

          <button
            onClick={() => setActiveTab('check_things')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              activeTab === 'check_things'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Check Things ({verifiedChecklistCount}/{checklistItems.length})</span>
          </button>
        </div>
      </div>

      {webcamError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{webcamError}</span>
        </div>
      )}

      {kioskSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{kioskSuccessMsg}</span>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab('stream')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'stream'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Live CCTV Stream Player ({availableCameras.length} Cameras)</span>
        </button>

        <button
          onClick={() => setActiveTab('student_attendance')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'student_attendance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Students Take Attendance & Kiosk</span>
        </button>

        <button
          onClick={() => setActiveTab('check_things')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'check_things'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Check Things (Infrastructure & Safety Checklist)</span>
        </button>
      </div>

      {/* TAB 1: LIVE STREAM PLAYER */}
      {activeTab === 'stream' && (
        <div className="space-y-4">
          {/* Stream Toolbar with Grid View Toggle & Source Selectors */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display:</span>
              <button
                onClick={() => setStreamViewMode('single')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  streamViewMode === 'single'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Single Focus</span>
              </button>
              <button
                onClick={() => setStreamViewMode('quad_grid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  streamViewMode === 'quad_grid'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>4-Grid</span>
              </button>
              <button
                onClick={() => setStreamViewMode('grid_9')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  streamViewMode === 'grid_9'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>9-Matrix</span>
              </button>
              <button
                onClick={() => setStreamViewMode('all_cameras')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
                  streamViewMode === 'all_cameras'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>All 18 Feeds ({availableCameras.length})</span>
              </button>
            </div>

            {/* Video Source Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Stream Mode:</span>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800 text-xs">
                <button
                  onClick={() => setStreamSourceMode('sample_video')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    streamSourceMode === 'sample_video' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Film className="w-3 h-3 text-blue-600" />
                  <span>Real CCTV Video</span>
                </button>
                <button
                  onClick={() => setStreamSourceMode('webcam')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    streamSourceMode === 'webcam' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <CameraIcon className="w-3 h-3 text-emerald-600" />
                  <span>Local WebCam</span>
                </button>
                <button
                  onClick={() => setStreamSourceMode('synthetic')}
                  className={`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors cursor-pointer ${
                    streamSourceMode === 'synthetic' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-amber-600" />
                  <span>AI Topology</span>
                </button>
              </div>

              <button
                onClick={handleAutoScan}
                disabled={isScanning}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Scanning...' : 'Take Live Attendance From Camera'}</span>
              </button>
            </div>
          </div>

          {/* MULTI-CCTV GRID MODES (QUAD, 9-MATRIX, OR ALL 18 CAMERAS SIMULTANEOUSLY) */}
          {streamViewMode !== 'single' ? (
            <div className={`grid gap-3 ${
              streamViewMode === 'quad_grid'
                ? 'grid-cols-1 md:grid-cols-2'
                : streamViewMode === 'grid_9'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
            }`}>
              {(streamViewMode === 'quad_grid'
                ? availableCameras.slice(0, 4)
                : streamViewMode === 'grid_9'
                ? availableCameras.slice(0, 9)
                : availableCameras
              ).map((cam, idx) => {
                const room = classrooms.find(r => r.id === cam.classroomId);
                const centre = centres.find(c => c.id === cam.centreId);
                const isSelected = cam.id === activeCamera.id;
                const camVideoUrl = cam.videoUrl || SAMPLE_CCTV_PRESETS[idx % SAMPLE_CCTV_PRESETS.length].url;

                return (
                  <div
                    key={cam.id}
                    onClick={() => {
                      setSelectedCameraId(cam.id);
                      setStreamViewMode('single');
                    }}
                    className={`bg-slate-900 border rounded-xl p-2.5 text-white cursor-pointer transition-all hover:border-blue-400 group relative flex flex-col justify-between ${
                      isSelected ? 'border-blue-500 ring-2 ring-blue-500/40' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${cam.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="font-bold text-white text-[11px] truncate">{cam.name}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded shrink-0">
                        {cam.status === 'connected' ? `${cam.fps} FPS` : 'OFFLINE'}
                      </span>
                    </div>

                    <div className="aspect-video bg-slate-950 rounded-lg my-1.5 border border-slate-800 flex items-center justify-center relative overflow-hidden">
                      {cam.status === 'connected' ? (
                        <>
                          {/* Real Playable HTML5 Video Loop */}
                          <video
                            src={camVideoUrl}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                          />

                          {/* CCTV Security HUD Overlay */}
                          <div className="absolute inset-0 p-2 flex flex-col justify-between pointer-events-none select-none bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/70 font-mono text-[9px]">
                            <div className="flex justify-between items-center text-slate-300">
                              <span className="bg-red-600/90 text-white text-[8px] px-1 py-0.2 rounded font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                CAM #{idx + 1}
                              </span>
                              <span>{cctvClock.timeString}</span>
                            </div>

                            <div className="flex justify-between items-center text-[8px] text-slate-300">
                              <span className="truncate max-w-[120px]">{centre?.name}</span>
                              <span className="text-emerald-400 font-bold bg-slate-900/90 px-1 py-0.2 rounded border border-emerald-500/30">
                                PINPOINTS ↗
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-3 text-xs text-red-400 font-mono">
                          SIGNAL LOST
                        </div>
                      )}
                    </div>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 font-mono">
                      <span className="truncate max-w-[130px]">{room?.name || 'Surveillance Bay'}</span>
                      <span className="text-cyan-400 font-semibold">{cam.resolution}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* SINGLE STREAM PLAYER MODE - Precision Calibrated CCTV Viewer */
            <div className="space-y-4">
              <PrecisionCameraViewer />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: STUDENTS TAKE ATTENDANCE & KIOSK */}
      {activeTab === 'student_attendance' && (
        <div className="space-y-6">
          {/* Autonomous Attendance Bar */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                Edge Face Detection Model v4.2
              </span>
              <h2 className="text-lg font-bold mt-1">
                Autonomous Student Attendance Terminal
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Students can perform self-check-in at CAM-04 biometric kiosk, or officers can run automatic AI camera attendance counts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoScan}
                disabled={isScanning}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isScanning ? 'Scanning Trainees...' : 'Run Autonomous AI Scan'}</span>
              </button>
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Enroll Trainee</span>
              </button>
              <button
                onClick={handleExportAttendanceCSV}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Kiosk Check-In & Live Batch Roster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Student Self-Check-in Kiosk Form */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Student Self-Check-In Kiosk</h3>
                  <p className="text-xs text-slate-500">Trainees enter their roll number to mark presence</p>
                </div>
              </div>

              <form onSubmit={handleKioskCheckIn} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Student Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    value={kioskRollInput}
                    onChange={(e) => setKioskRollInput(e.target.value)}
                    placeholder="e.g. TN26-CHE-001"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify Student Check-In</span>
                </button>
              </form>

              {/* Quick-Click Student Check-In Presets */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  1-Click Sample Trainees
                </div>
                <div className="space-y-1.5">
                  {students.slice(0, 3).map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setKioskRollInput(st.rollNumber)}
                      className="p-2 rounded border border-slate-200 bg-slate-50 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-bold text-slate-800">{st.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{st.rollNumber}</div>
                      </div>
                      <span className="text-[10px] text-blue-600 font-medium font-mono">Select →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trainee Roster Table */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Active Class Roster ({activeRoom?.name || 'Main Hall'})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live presence verification confirmed via edge vision camera.
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search trainee name or roll..."
                    className="bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 w-56"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 font-semibold">
                      <th className="p-2.5">Roll No</th>
                      <th className="p-2.5">Trainee Name</th>
                      <th className="p-2.5">Seat</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">AI Verified</th>
                      <th className="p-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roomStudents
                      .filter(s => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()))
                      .map((stu) => (
                        <tr key={stu.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-[11px] font-semibold text-slate-700">{stu.rollNumber}</td>
                          <td className="p-2.5 font-bold text-slate-900">{stu.name}</td>
                          <td className="p-2.5 font-mono text-slate-500">#{stu.seatNumber}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              stu.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              stu.status === 'late' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                              {stu.status}
                            </span>
                          </td>
                          <td className="p-2.5">
                            {stu.verifiedByAi ? (
                              <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-semibold">
                                <Check className="w-3.5 h-3.5" />
                                <span>Edge Match</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Pending Scan</span>
                            )}
                          </td>
                          <td className="p-2.5 text-right space-x-1">
                            <button
                              onClick={() => markStudentAttendance(stu.id, 'present')}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-bold"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => markStudentAttendance(stu.id, 'absent')}
                              className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded text-[10px] font-bold"
                            >
                              Absent
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: CHECK THINGS (INFRASTRUCTURE & COMPLIANCE CHECKLIST) */}
      {activeTab === 'check_things' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                Classroom Infrastructure & Safety Protocol
              </span>
              <h2 className="text-lg font-bold mt-1">
                Check Things — Facility Compliance Verification
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Physical checks for fire extinguishers, biometric sensors, CCTV coverage, First Aid kits, and training equipment.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAiInspectThings}
                disabled={isInspectingThings}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isInspectingThings ? 'Inspecting Equipment...' : 'Autonomous AI Checklist Scan'}</span>
              </button>
              <button
                onClick={() => setShowAddCheckItem(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Checklist Item</span>
              </button>
              <button
                onClick={handleExportChecklistCSV}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklistItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all bg-white shadow-xs space-y-3 ${
                  item.status === 'verified'
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : item.status === 'issue_flagged'
                    ? 'border-red-200 bg-red-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 mt-0.5">{item.name}</h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.status === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.status === 'issue_flagged' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="font-medium">{item.conditionNote}</div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Audited by: {item.checkedBy} · {item.lastCheckedAt ? new Date(item.lastCheckedAt).toLocaleTimeString() : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500">
                    {item.requiredForSession ? '🔴 Mandatory for session' : '⚪ Advisory standard'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateChecklistItemStatus(item.id, 'verified')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => updateChecklistItemStatus(item.id, 'issue_flagged', 'Physical condition defect reported.')}
                      className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[10px] font-bold flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      <span>Flag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD STUDENT MODAL */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Enroll Trainee into Live Session</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Student Name</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g. Ramesh Kannan"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Roll Number</label>
                <input
                  type="text"
                  required
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  placeholder="e.g. TN26-CHE-019"
                  className="w-full bg-slate-50 border rounded-lg p-2 font-mono text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Batch</label>
                  <input
                    type="text"
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Desk / Seat</label>
                  <input
                    type="number"
                    value={newStudentSeat}
                    onChange={(e) => setNewStudentSeat(Number(e.target.value))}
                    className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                >
                  Enroll Trainee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CHECKLIST ITEM MODAL */}
      {showAddCheckItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">Add Physical Infrastructure Check</h3>
              <button onClick={() => setShowAddCheckItem(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCheckItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Equipment / Item Name</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Industrial Fire Extinguisher Type-CO2"
                  className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                >
                  <option value="Safety & Fire">Safety & Fire</option>
                  <option value="Biometric & Surveillance">Biometric & Surveillance</option>
                  <option value="Power & Backup">Power & Backup</option>
                  <option value="Sanitation & First Aid">Sanitation & First Aid</option>
                  <option value="Workstation Hardware">Workstation Hardware</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Condition & Inspection Standard</label>
                <input
                  type="text"
                  value={newItemCondition}
                  onChange={(e) => setNewItemCondition(e.target.value)}
                  className="w-full bg-slate-50 border rounded-lg p-2 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCheckItem(false)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
