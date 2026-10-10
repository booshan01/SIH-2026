import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  FileVideo,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { VideoAnalysisRun, BoundingBox, VideoAnalysisFrame } from '../../types';
import { exportToCSV, formatDateTime } from '../../utils/complianceEngine';

export const VideoAnalysisPage: React.FC = () => {
  const {
    centres,
    classrooms,
    cameras,
    settings,
    analysisRuns,
    createAnalysisRun,
    updateAnalysisRun,
    submitAttendance,
    currentUser
  } = useApp();

  const [selectedCentreId, setSelectedCentreId] = useState<string>(centres[0]?.id || '');
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>(classrooms[0]?.id || '');
  const [analysisType, setAnalysisType] = useState<'attendance' | 'infrastructure' | 'hybrid'>('hybrid');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string>(analysisRuns[0]?.id || '');

  // Active frame inspection state
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showPersonBoxes, setShowPersonBoxes] = useState(true);
  const [showEquipmentBoxes, setShowEquipmentBoxes] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Available classrooms for selected centre
  const availableClassrooms = classrooms.filter(c => c.centreId === selectedCentreId);

  // Update room when centre changes
  useEffect(() => {
    if (availableClassrooms.length > 0 && !availableClassrooms.some(r => r.id === selectedClassroomId)) {
      setSelectedClassroomId(availableClassrooms[0].id);
    }
  }, [selectedCentreId]);

  const activeRun = analysisRuns.find(r => r.id === activeRunId) || analysisRuns[0];

  // Drag and drop handler
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!validExtensions.includes(ext)) {
      setFileError(`Invalid format (.${ext}). Supported formats: MP4, MOV, AVI, WEBM.`);
      return;
    }

    if (file.size > settings.monitoring.maxUploadSizeBytes) {
      setFileError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds limit of 100MB.`);
      return;
    }

    setUploadedFile(file);
    setFileError(null);
  };

  // Run the 6-stage video analysis pipeline
  const startAnalysis = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const filename = uploadedFile ? uploadedFile.name : `CCTV_SURVEILLANCE_${Date.now().toString().slice(-6)}.mp4`;
    const newRunId = `analysis-${Date.now()}`;

    // Seed mock realistic frames with people & equipment
    const generatedFrames: VideoAnalysisFrame[] = [
      {
        frameNumber: 1,
        timestampSeconds: 0,
        peopleCount: 22,
        equipmentCounts: { computers: 28, chairs: 30, tables: 15 },
        boxes: [
          { x: 12, y: 35, width: 9, height: 28, label: 'Person (Trainee)', confidence: 0.93, color: '#2563eb' },
          { x: 24, y: 34, width: 9, height: 29, label: 'Person (Trainee)', confidence: 0.91, color: '#2563eb' },
          { x: 36, y: 36, width: 8, height: 27, label: 'Person (Trainee)', confidence: 0.95, color: '#2563eb' },
          { x: 48, y: 33, width: 9, height: 30, label: 'Person (Trainee)', confidence: 0.89, color: '#2563eb' },
          { x: 60, y: 35, width: 9, height: 28, label: 'Person (Trainee)', confidence: 0.94, color: '#2563eb' },
          { x: 72, y: 36, width: 9, height: 27, label: 'Person (Trainee)', confidence: 0.92, color: '#2563eb' },
          { x: 84, y: 34, width: 8, height: 29, label: 'Person (Trainee)', confidence: 0.90, color: '#2563eb' },
          { x: 10, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.97, color: '#059669' },
          { x: 23, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.95, color: '#059669' },
          { x: 36, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.96, color: '#059669' },
          { x: 49, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.94, color: '#059669' },
          { x: 62, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.93, color: '#059669' },
        ],
      },
      {
        frameNumber: 15,
        timestampSeconds: 15,
        peopleCount: 22,
        equipmentCounts: { computers: 28, chairs: 30, tables: 15 },
        boxes: [
          { x: 13, y: 36, width: 9, height: 28, label: 'Person (Trainee)', confidence: 0.94, color: '#2563eb' },
          { x: 25, y: 35, width: 9, height: 29, label: 'Person (Trainee)', confidence: 0.92, color: '#2563eb' },
          { x: 37, y: 36, width: 8, height: 27, label: 'Person (Trainee)', confidence: 0.96, color: '#2563eb' },
          { x: 49, y: 34, width: 9, height: 30, label: 'Person (Trainee)', confidence: 0.88, color: '#2563eb' },
          { x: 61, y: 35, width: 9, height: 28, label: 'Person (Trainee)', confidence: 0.93, color: '#2563eb' },
          { x: 73, y: 36, width: 9, height: 27, label: 'Person (Trainee)', confidence: 0.91, color: '#2563eb' },
          { x: 10, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.97, color: '#059669' },
          { x: 23, y: 60, width: 12, height: 22, label: 'Computer Workstation', confidence: 0.95, color: '#059669' },
        ],
      },
      {
        frameNumber: 30,
        timestampSeconds: 30,
        peopleCount: 21,
        equipmentCounts: { computers: 28, chairs: 30, tables: 15 },
        boxes: [
          { x: 14, y: 36, width: 9, height: 28, label: 'Person (Trainee)', confidence: 0.93, color: '#2563eb' },
          { x: 26, y: 35, width: 9, height: 29, label: 'Person (Trainee)', confidence: 0.91, color: '#2563eb' },
          { x: 38, y: 36, width: 8, height: 27, label: 'Person (Trainee)', confidence: 0.94, color: '#2563eb' },
          { x: 50, y: 34, width: 9, height: 30, label: 'Person (Trainee)', confidence: 0.89, color: '#2563eb' },
        ],
      }
    ];

    const initialStages = [
      { stage: 'File received' as const, status: 'processing' as const, details: 'Validating payload headers' },
      { stage: 'Video validated' as const, status: 'pending' as const },
      { stage: 'Frames extracted' as const, status: 'pending' as const },
      { stage: 'AI inference running' as const, status: 'pending' as const },
      { stage: 'Compliance comparison running' as const, status: 'pending' as const },
      { stage: 'Results ready' as const, status: 'pending' as const },
    ];

    const newRun: VideoAnalysisRun = {
      id: newRunId,
      centreId: selectedCentreId,
      classroomId: selectedClassroomId,
      videoFilename: filename,
      videoDurationSeconds: 45,
      totalFrames: 1125,
      sampledFrames: 45,
      stages: initialStages,
      currentStageIndex: 0,
      status: 'processing',
      mode: 'simulation', // Clearly labeled simulation mode
      detectedPeopleCount: 22,
      detectedEquipment: [
        { category: 'computers', count: 28, avgConfidence: 0.95 },
        { category: 'chairs', count: 30, avgConfidence: 0.92 },
        { category: 'tables', count: 15, avgConfidence: 0.94 },
      ],
      confidenceSummary: 0.93,
      processingDurationMs: 0,
      frames: generatedFrames,
      createdAt: new Date().toISOString(),
    };

    createAnalysisRun(newRun);
    setActiveRunId(newRunId);

    // Simulate 6 sequential stages
    const stageNames = [
      'File received',
      'Video validated',
      'Frames extracted',
      'AI inference running',
      'Compliance comparison running',
      'Results ready'
    ];

    const stageDetails = [
      'Container payload validated (H.264 stream OK)',
      'Resolution: 1920x1080 @ 25fps, Bitrate: 4.5 Mbps',
      'Sampled 45 keyframes at 1s intervals (Downscaled to 1280x720)',
      'Ultralytics YOLOv8 inference: 22 people, 28 computers identified',
      'Cross-checked against MSDE approved laboratory inventory allocation',
      'Completed: Visual audit manifest generated'
    ];

    const startTime = Date.now();

    for (let i = 0; i < 6; i++) {
      await new Promise(r => setTimeout(r, 650));
      updateAnalysisRun(newRunId, {
        currentStageIndex: i,
        stages: initialStages.map((s, idx) => {
          if (idx < i) return { ...s, status: 'completed' as const, details: stageDetails[idx], timestamp: new Date().toISOString() };
          if (idx === i) return { ...s, status: 'processing' as const, details: stageDetails[idx] };
          return { ...s, status: 'pending' as const };
        })
      });
    }

    const duration = Date.now() - startTime;
    updateAnalysisRun(newRunId, {
      currentStageIndex: 5,
      status: 'completed',
      processingDurationMs: duration,
      completedAt: new Date().toISOString(),
      stages: initialStages.map((s, idx) => ({
        ...s,
        status: 'completed' as const,
        details: stageDetails[idx],
        timestamp: new Date().toISOString()
      }))
    });

    setIsProcessing(false);
  };

  // Play animation through frames
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeRun?.frames?.length > 1) {
      interval = setInterval(() => {
        setCurrentFrameIndex(prev => (prev + 1) % activeRun.frames.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeRun]);

  const currentFrame = activeRun?.frames?.[currentFrameIndex] || activeRun?.frames?.[0];

  const exportAnalysisCSV = () => {
    if (!activeRun) return;
    const headers = ['Analysis ID', 'Centre', 'Filename', 'People Count', 'Confidence', 'Duration (ms)', 'Timestamp'];
    const rows = [[
      activeRun.id,
      activeRun.centreId,
      activeRun.videoFilename,
      activeRun.detectedPeopleCount,
      activeRun.confidenceSummary,
      activeRun.processingDurationMs,
      activeRun.createdAt
    ]];
    exportToCSV(`SAIMS_Analysis_${activeRun.id}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
              Computer Vision Pipeline
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs text-slate-500">Autonomous Edge Detection Engine</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Video Analysis & AI Detection Studio
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Validate CCTV footage, run 6-stage compliance inference, and inspect bounding boxes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Badge: Clearly Labeled Demo Simulation vs Real Model */}
          <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Mode: DEMO SIMULATION (Ultralytics YOLOv8 Standard)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upload & Parameters */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3">1. Select Target & Upload</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Training Centre</label>
                <select
                  value={selectedCentreId}
                  onChange={(e) => setSelectedCentreId(e.target.value)}
                  disabled={isProcessing}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Classroom / Workshop</label>
                <select
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  disabled={isProcessing}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800"
                >
                  {availableClassrooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name} [{r.code}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Audit Mode</label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setAnalysisType('attendance')}
                    className={`text-[11px] py-1.5 font-medium rounded-md transition-colors ${
                      analysisType === 'attendance' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Attendance
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisType('infrastructure')}
                    className={`text-[11px] py-1.5 font-medium rounded-md transition-colors ${
                      analysisType === 'infrastructure' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Equipment
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnalysisType('hybrid')}
                    className={`text-[11px] py-1.5 font-medium rounded-md transition-colors ${
                      analysisType === 'hybrid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Hybrid Full
                  </button>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Footage File (MP4, MOV, AVI)</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-5 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer relative"
                >
                  <input
                    type="file"
                    accept=".mp4,.mov,.avi,.mkv,.webm"
                    onChange={handleFileInput}
                    disabled={isProcessing}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-800">
                    {uploadedFile ? uploadedFile.name : 'Click or drag CCTV clip here'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {uploadedFile
                      ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · Ready for pipeline`
                      : 'Max 100MB · MP4, MOV, AVI (H.264 / HEVC)'}
                  </div>
                </div>

                {fileError && (
                  <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

              {/* Start Analysis Button */}
              <button
                onClick={startAnalysis}
                disabled={isProcessing}
                className={`w-full py-2.5 rounded-lg text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-2 transition-colors ${
                  isProcessing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Running 6-Stage AI Pipeline...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Start Compliance Video Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 6 Processing Stages Progress Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">2. Processing Stages Pipeline</h3>
            <div className="space-y-3 mt-3">
              {activeRun?.stages?.map((stage, idx) => {
                const isCurrent = activeRun.currentStageIndex === idx && isProcessing;
                const isDone = stage.status === 'completed';
                return (
                  <div key={stage.stage} className="flex items-start gap-3 text-xs">
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 text-[10px] text-slate-400 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${isDone ? 'text-slate-900' : isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                        Stage {idx + 1}: {stage.stage}
                      </div>
                      {stage.details && (
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                          {stage.details}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Interactive Canvas Frame Inspection & Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Visual Inference Canvas Viewer */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileVideo className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-xs tracking-wide">
                  {activeRun?.videoFilename || 'Sample_Clip.mp4'}
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Frame #{currentFrame?.frameNumber || 1} / 45
                </span>
              </div>

              {/* Bounding Box Filters */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setShowPersonBoxes(!showPersonBoxes)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showPersonBoxes ? 'bg-blue-600/30 text-blue-300 border-blue-500' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  People ({currentFrame?.peopleCount || 0})
                </button>
                <button
                  onClick={() => setShowEquipmentBoxes(!showEquipmentBoxes)}
                  className={`px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    showEquipmentBoxes ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500' : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  Equipment
                </button>
              </div>
            </div>

            {/* Video Canvas Simulation Area */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden my-3 border border-slate-800 flex items-center justify-center">
              {/* Classroom backdrop representation */}
              <div className="absolute inset-0 bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col justify-between p-6 opacity-60 pointer-events-none">
                <div className="text-[11px] font-mono text-slate-600">
                  CAMERA: CAM-01 [OVERHEAD WIDE] · RES: 1920x1080 · FPS: 25.0
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-600">
                  <span>TIME: 2026-10-09 10:15:32 IST</span>
                  <span>LOCATION: CHENNAI SKILLS LAB A</span>
                </div>
              </div>

              {/* Grid representation */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              {/* Simulated Classroom Furniture Visuals */}
              <div className="absolute inset-0 flex items-center justify-around px-8 opacity-30 pointer-events-none">
                {[1, 2, 3, 4, 5].map(idx => (
                  <div key={idx} className="w-16 h-32 border-2 border-slate-700 rounded-md flex flex-col justify-end p-2 text-[10px] text-slate-600">
                    Desk {idx}
                  </div>
                ))}
              </div>

              {/* Render Bounding Boxes */}
              {showBoundingBoxes && currentFrame?.boxes?.map((box, bIdx) => {
                const isPerson = box.label.toLowerCase().includes('person');
                if (isPerson && !showPersonBoxes) return null;
                if (!isPerson && !showEquipmentBoxes) return null;

                const borderColor = isPerson ? 'border-blue-500' : 'border-emerald-500';
                const tagColor = isPerson ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white';

                return (
                  <div
                    key={bIdx}
                    className={`absolute border-2 ${borderColor} rounded-xs transition-all duration-300`}
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`,
                    }}
                  >
                    <div className={`absolute -top-5 left-0 px-1 py-0.2 text-[9px] font-mono font-semibold rounded-xs whitespace-nowrap shadow-xs ${tagColor}`}>
                      {box.label} {(box.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}

              {/* Watermark Notice */}
              <div className="absolute bottom-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] text-amber-300 font-mono flex items-center gap-1.5 border border-slate-700">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ANONYMOUS PEOPLE DETECTION · NO BIOMETRIC TEMPLATES STORED</span>
              </div>
            </div>

            {/* Playback Controls & Frame Scrubber */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white text-xs transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setCurrentFrameIndex(0)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Slider Scrubber */}
              <div className="flex-1 max-w-md mx-4 flex items-center gap-2">
                <span className="text-[10px] text-slate-400">0s</span>
                <input
                  type="range"
                  min="0"
                  max={(activeRun?.frames?.length || 1) - 1}
                  value={currentFrameIndex}
                  onChange={(e) => setCurrentFrameIndex(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[10px] text-slate-400">
                  {activeRun?.videoDurationSeconds || 45}s
                </span>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400">
                Lat: {settings.aiModel.inferenceLatencyAvgMs}ms
              </div>
            </div>
          </div>

          {/* Detections Summary & Metadata Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">AI Detection Manifest</h3>
                <p className="text-xs text-slate-500">Autonomous count breakdown and model confidence</p>
              </div>
              <button
                onClick={exportAnalysisCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export Manifest (CSV)
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Estimated People</div>
                <div className="text-2xl font-bold text-blue-700 mt-1">
                  {activeRun?.detectedPeopleCount || 0}
                </div>
                <div className="text-[10px] text-slate-400">Anonymous subjects</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Confidence Score</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">
                  {((activeRun?.confidenceSummary || 0.9) * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-400">Weighted average</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Sampled Frames</div>
                <div className="text-2xl font-bold text-slate-800 mt-1">
                  {activeRun?.sampledFrames || 45}
                </div>
                <div className="text-[10px] text-slate-400">1 FPS interval</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[11px] text-slate-500 font-medium">Processing Time</div>
                <div className="text-2xl font-bold text-indigo-700 mt-1">
                  {((activeRun?.processingDurationMs || 4200) / 1000).toFixed(1)}s
                </div>
                <div className="text-[10px] text-slate-400">YOLO inference engine</div>
              </div>
            </div>

            {/* Equipment Breakdown Table */}
            <div className="mt-4">
              <div className="text-xs font-semibold text-slate-800 mb-2">Detected Equipment Categories</div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Equipment Class</th>
                      <th className="py-2 px-3">Detected Count</th>
                      <th className="py-2 px-3">Confidence</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {activeRun?.detectedEquipment?.map((eq, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900 capitalize">
                          {String(eq.category).replace(/_/g, ' ')}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold">{eq.count} units</td>
                        <td className="py-2 px-3 font-mono">{(eq.avgConfidence * 100).toFixed(0)}%</td>
                        <td className="py-2 px-3">
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-medium">
                            Detected & Compliant
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
