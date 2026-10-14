export type UserRole = 'State Officer' | 'System Administrator' | 'Monitoring Officer' | 'Centre Manager';

export type AuthProvider = 'gmail' | 'microsoft' | 'password' | 'demo' | 'parichay';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedCentreId?: string; // Optional: for Centre Manager
  avatar?: string;
  department?: string;
  provider?: AuthProvider;
  isEmailVerified?: boolean;
  twoFactorEnabled?: boolean;
  clearanceLevel?: 'Level 4 (Apex Full)' | 'Level 3 (Tech Ops)' | 'Level 2 (Field Surveillance)' | 'Level 1 (Facility Scoped)';
  lastOtpSentAt?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  batchName: string;
  centreId: string;
  classroomId: string;
  avatar?: string;
  status: 'present' | 'absent' | 'late';
  seatNumber: number;
  lastCheckIn?: string;
  verifiedByAi: boolean;
  notes?: string;
}

export interface ClassroomChecklistItem {
  id: string;
  name: string;
  category: string;
  status: 'verified' | 'issue_flagged' | 'pending';
  lastCheckedAt?: string;
  checkedBy?: string;
  conditionNote?: string;
  requiredForSession: boolean;
}

export interface TrainingCentre {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  address: string;
  managerName: string;
  contactEmail: string;
  contactPhone: string;
  totalClassrooms: number;
  activeCameras: number;
  status: 'active' | 'under_review' | 'inactive';
  complianceScore: number; // 0 - 100
  createdAt: string;
  updatedAt: string;
}

export interface PinpointTarget {
  id?: string;
  name: string;
  category: 'tool' | 'student' | 'facility' | 'safety' | 'machinery' | 'electronics' | 'infrastructure';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  status?: string;
  assignedTo?: string;
  camId?: string;
  note?: string;
  confidence?: number;
  width?: number; // percentage
  height?: number; // percentage
  timestamp?: string;
}

export type RoomType = 
  | 'computer_lab' 
  | 'vocational_workshop' 
  | 'welding_bay' 
  | 'theory_classroom' 
  | 'electrical_lab'
  | 'textile_sewing_lab';

export interface Classroom {
  id: string;
  centreId: string;
  name: string;
  code: string;
  roomType: RoomType;
  floor: string;
  capacity: number;
}

export type CameraStatus = 'connected' | 'disconnected' | 'low_quality' | 'reconnecting';
export type CameraStreamType = 'cctv' | 'webcam' | 'simulated';

export interface Camera {
  id: string;
  centreId: string;
  classroomId: string;
  name: string;
  streamType: CameraStreamType;
  status: CameraStatus;
  rtspUrl?: string;
  videoUrl?: string; // High-definition sample CCTV stream MP4/WebM
  imageUrl?: string; // Authentic CCTV surveillance snapshot image
  sampleVideoType?: string;
  resolution: string;
  fps: number;
  latencyMs: number;
  coveragePercentage: number;
  lastHeartbeat: string;
}

export type EquipmentCategory = 
  | 'chairs'
  | 'tables'
  | 'workbenches'
  | 'computers'
  | 'sewing_machines'
  | 'welding_machines'
  | 'electrical_training_equipment'
  | 'mechanical_training_equipment'
  | 'toolkits'
  | 'laboratory_equipment'
  | 'custom';

export type InspectionStatus = 'verified' | 'shortage' | 'excess' | 'inspection_required' | 'unverified';
export type OperationalStatus = 'operational' | 'faulty' | 'maintenance_due' | 'decommissioned';

export interface InventoryItem {
  id: string;
  centreId: string;
  classroomId: string;
  itemName: string;
  category: EquipmentCategory;
  approvedQuantity: number;
  detectedQuantity: number;
  countDifference: number; // detected - approved
  detectionConfidence: number; // 0 - 1.0
  lastInspectionDate: string;
  inspectionStatus: InspectionStatus;
  operationalStatus: OperationalStatus;
  expectedLocation: string;
  referenceImageUrl?: string;
  notes?: string;
  updatedAt: string;
}

export type CoverageStatus = 'optimal' | 'partial' | 'blind_spot' | 'disconnected';
export type AttendanceVerificationStatus = 'verified' | 'flagged' | 'reviewed' | 'pending';

export interface AttendanceRecord {
  id: string;
  centreId: string;
  classroomId: string;
  batchName: string;
  sessionDate: string;
  scheduledStart: string;
  scheduledEnd: string;
  registeredCount: number;
  submittedPresent: number;
  submittedAbsent: number;
  estimatedPeopleCount: number;
  absoluteDifference: number; // abs(submittedPresent - estimatedPeopleCount)
  percentageDifference: number;
  coverageStatus: CoverageStatus;
  confidenceScore: number;
  verificationStatus: AttendanceVerificationStatus;
  submittedBy: string;
  submittedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
  notes?: string;
  analysisRunId?: string;
}

export interface BoundingBox {
  x: number; // normalized 0 - 100
  y: number; // normalized 0 - 100
  width: number;
  height: number;
  label: string;
  confidence: number;
  color?: string;
}

export interface VideoAnalysisFrame {
  frameNumber: number;
  timestampSeconds: number;
  peopleCount: number;
  equipmentCounts: Record<string, number>;
  boxes: BoundingBox[];
  imageUrl?: string;
}

export type AnalysisStage = 
  | 'File received'
  | 'Video validated'
  | 'Frames extracted'
  | 'AI inference running'
  | 'Compliance comparison running'
  | 'Results ready';

export interface StageStatus {
  stage: AnalysisStage;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp?: string;
  details?: string;
}

export interface VideoAnalysisRun {
  id: string;
  centreId: string;
  classroomId: string;
  cameraId?: string;
  videoFilename: string;
  videoDurationSeconds: number;
  totalFrames: number;
  sampledFrames: number;
  stages: StageStatus[];
  currentStageIndex: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  mode: 'real_model' | 'simulation';
  detectedPeopleCount: number;
  detectedEquipment: {
    category: EquipmentCategory | string;
    count: number;
    avgConfidence: number;
  }[];
  confidenceSummary: number;
  processingDurationMs: number;
  frames: VideoAnalysisFrame[];
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export type AlertType = 
  | 'attendance_discrepancy'
  | 'equipment_shortage'
  | 'uncertain_detection'
  | 'camera_disconnected'
  | 'poor_video_quality'
  | 'processing_failure'
  | 'repeated_discrepancy'
  | 'overdue_inspection';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertReviewStatus = 'pending' | 'in_review' | 'verified' | 'dismissed' | 'inspection_requested' | 'closed';

export interface AlertReviewLog {
  id: string;
  alertId: string;
  reviewerName: string;
  reviewerRole: string;
  previousStatus: AlertReviewStatus;
  newStatus: AlertReviewStatus;
  resolutionNotes: string;
  actionTaken: 'verify' | 'dismiss' | 'request_inspection' | 'close' | 'assign' | 'acknowledge';
  timestamp: string;
}

export interface Alert {
  id: string;
  centreId: string;
  classroomId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  expectedValue: number | string;
  observedValue: number | string;
  analysisRunId?: string;
  evidenceReference?: string;
  evidenceImageUrl?: string;
  explanation: string;
  confidenceLimitations: string;
  assignedReviewer?: string;
  reviewStatus: AlertReviewStatus;
  resolutionNotes?: string;
  acknowledged: boolean;
  history: AlertReviewLog[];
  createdAt: string;
  updatedAt: string;
}

export interface InspectionRecord {
  id: string;
  centreId: string;
  classroomId: string;
  inspectorName: string;
  inspectorDesignation: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  equipmentVerifiedCount: number;
  equipmentConditionNotes: string;
  operationalStatusAssessment: 'operational' | 'partial_faults' | 'critical_deficiencies';
  followUpRequired: boolean;
  followUpDate?: string;
  actionItems: string[];
  reportPdfUrl?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  targetType: 'Centre' | 'Attendance' | 'Inventory' | 'Alert' | 'Inspection' | 'Settings' | 'VideoAnalysis' | 'User' | 'Student';
  targetId: string;
  targetName: string;
  details: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'system' | 'inspection' | 'sync';
  severity: 'low' | 'medium' | 'high';
  read: boolean;
  linkPage?: string;
  linkId?: string;
  timestamp: string;
}

export interface SystemSettings {
  general: {
    appName: string;
    organization: string;
    theme: 'system' | 'light' | 'dark';
    language: string;
    dateFormat: string;
    timeZone: string;
    defaultPageSize: number;
  };
  monitoring: {
    attendanceDiscrepancyThreshold: number; // e.g. 3 trainees
    requiredConsecutiveWindows: number; // e.g. 2 windows
    minimumDetectionConfidence: number; // e.g. 0.65
    frameSamplingInterval: number; // e.g. 2 sec
    maxVideoDurationSeconds: number; // e.g. 600 sec
    maxUploadSizeBytes: number; // e.g. 100MB
    processingResolution: string; // "1280x720"
    cameraHealthCheckIntervalSeconds: number; // 30s
  };
  infrastructure: {
    minimumEquipmentConfidence: number; // 0.60
    inspectionIntervalDays: number; // 30 days
    shortageAlertThreshold: number; // 1 item
    manualReviewRequiredForHeavyMachinery: boolean;
  };
  notifications: {
    inAppAlerts: boolean;
    highSeverityAudioCue: boolean;
    dailyDigestSummary: boolean;
  };
  privacy: {
    videoRetentionDays: number;
    evidenceRetentionDays: number;
    anonymizeBoundingBoxes: boolean;
    autoPurgeProcessedMedia: boolean;
  };
  aiModel: {
    modelName: string;
    modelVersion: string;
    detectionEngine: 'ultralytics_yolo_v8' | 'simulation_engine';
    isSimulationMode: boolean;
    confidenceThreshold: number;
    lastInferenceTimestamp: string;
    inferenceLatencyAvgMs: number;
  };
  connectivity: {
    lowBandwidthMode: boolean;
    metadataOnlySync: boolean;
    compressionQuality: 'low' | 'medium' | 'high';
    lastSyncTimestamp: string;
    queuedSyncItems: number;
    offlineMode: boolean;
  };
}

export interface BenchmarkItem {
  id: string;
  sampleName: string;
  centreType: string;
  groundTruthPeopleCount: number;
  aiEstimatedPeopleCount: number;
  groundTruthEquipment: Record<string, number>;
  aiDetectedEquipment: Record<string, number>;
  inferenceLatencyMs: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
}

export interface EvaluationMetrics {
  totalSamples: number;
  precision: number; // TP / (TP + FP)
  recall: number; // TP / (TP + FN)
  f1Score: number;
  peopleCountMAE: number; // Mean Absolute Error
  falsePositiveRate: number; // FP / (FP + TN)
  falseNegativeRate: number; // FN / (TP + FN)
  avgLatencyMs: number;
  fpsThroughput: number;
}
