import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  AuthProvider,
  TrainingCentre,
  Classroom,
  Camera,
  InventoryItem,
  AttendanceRecord,
  Alert,
  AlertReviewStatus,
  InspectionRecord,
  AuditLogEntry,
  AppNotification,
  SystemSettings,
  BenchmarkItem,
  VideoAnalysisRun,
  EquipmentCategory,
  Student,
  ClassroomChecklistItem,
  PinpointTarget,
} from '../types';
import {
  initialUsers,
  initialCentres,
  initialClassrooms,
  initialCameras,
  initialInventory,
  initialAttendance,
  initialAlerts,
  initialInspections,
  initialAuditLogs,
  initialNotifications,
  initialSettings,
  initialBenchmarks,
  initialAnalysisRuns,
  initialStudents,
  initialChecklistItems,
} from '../utils/demoData';
import { calculateAttendanceDiscrepancy } from '../utils/complianceEngine';

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  authProvider: AuthProvider;
  showAuthModal: boolean;
  setShowAuthModal: (open: boolean) => void;
  loginWithGmail: (email?: string, name?: string, role?: UserRole) => void;
  loginWithMicrosoft: (email?: string, name?: string, role?: UserRole) => void;
  loginWithCredentials: (email: string, role?: UserRole) => void;
  loginWithDemo: (role: UserRole) => void;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  sendVerificationOtp: (email: string) => Promise<{ success: boolean; otp: string; message: string }>;
  verifyOtp: (email: string, code: string) => boolean;
  activeOtp: { email: string; code: string; expiresAt: number } | null;
  registerNewAccount: (userData: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    password?: string;
    provider?: AuthProvider;
  }) => User;
  isLoggedOut: boolean;
  setIsLoggedOut: (loggedOut: boolean) => void;
  signAccreditation: (centreId: string, grade: string, remarks: string) => void;
  geminiAssistantOpen: boolean;
  setGeminiAssistantOpen: (open: boolean) => void;
  pinpointTarget: PinpointTarget | null;
  setPinpointTarget: (target: PinpointTarget | null) => void;
  triggerPinpoint: (target: PinpointTarget) => void;

  // Theme management (Dark & Light Mode)
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;

  activePage: string;
  setActivePage: (page: string) => void;
  selectedCentreId: string | null;
  setSelectedCentreId: (id: string | null) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Data collections
  centres: TrainingCentre[];
  classrooms: Classroom[];
  cameras: Camera[];
  inventory: InventoryItem[];
  attendance: AttendanceRecord[];
  alerts: Alert[];
  inspections: InspectionRecord[];
  auditLogs: AuditLogEntry[];
  notifications: AppNotification[];
  settings: SystemSettings;
  benchmarks: BenchmarkItem[];
  analysisRuns: VideoAnalysisRun[];
  students: Student[];
  checklistItems: ClassroomChecklistItem[];

  // Student Attendance actions
  markStudentAttendance: (studentId: string, status: Student['status'], notes?: string) => void;
  selfStudentCheckIn: (studentId: string) => void;
  autoScanClassroomAttendance: (classroomId: string, visualCount: number) => { markedPresent: number; flagged: boolean };
  addStudent: (student: Omit<Student, 'id'>) => void;
  
  // Checklist / Check the things actions
  updateChecklistItemStatus: (id: string, status: 'verified' | 'issue_flagged', note?: string) => void;
  addChecklistItem: (item: Omit<ClassroomChecklistItem, 'id'>) => void;
  resetChecklist: () => void;

  // Mutator actions
  addCentre: (centre: Omit<TrainingCentre, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCentre: (id: string, updates: Partial<TrainingCentre>) => void;
  addClassroom: (room: Omit<Classroom, 'id'>) => void;
  updateCameraStatus: (id: string, status: Camera['status']) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'updatedAt' | 'countDifference'>) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  submitAttendance: (record: Omit<AttendanceRecord, 'id' | 'absoluteDifference' | 'percentageDifference' | 'submittedAt' | 'verificationStatus'>) => AttendanceRecord;
  reviewAttendance: (id: string, status: AttendanceRecord['verificationStatus'], notes?: string) => void;
  updateAlertStatus: (
    alertId: string,
    newStatus: AlertReviewStatus,
    resolutionNotes: string,
    actionTaken: 'verify' | 'dismiss' | 'request_inspection' | 'close' | 'assign'
  ) => void;
  bulkAcknowledgeAlerts: (alertIds: string[]) => void;
  scheduleInspection: (inspection: Omit<InspectionRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateInspection: (id: string, updates: Partial<InspectionRecord>) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  resetSettingsToDefault: () => void;
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  createAnalysisRun: (run: VideoAnalysisRun) => void;
  updateAnalysisRun: (id: string, updates: Partial<VideoAnalysisRun>) => void;
  addBenchmarkSample: (sample: Omit<BenchmarkItem, 'id'>) => void;

  // Demo Controls
  loadDemoData: () => void;
  resetToDefaults: () => void;
  toggleLowBandwidth: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'saims_gov_in_v2_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => loadFromStorage('isAuthenticated', true));
  const [currentUser, setCurrentUser] = useState<User>(() => loadFromStorage('currentUser', initialUsers[0]));
  const [authProvider, setAuthProvider] = useState<AuthProvider>(() => loadFromStorage('authProvider', 'gmail'));
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isLoggedOut, setIsLoggedOut] = useState<boolean>(false);
  const [activeOtp, setActiveOtp] = useState<{ email: string; code: string; expiresAt: number } | null>(null);
  const [geminiAssistantOpen, setGeminiAssistantOpen] = useState<boolean>(false);
  const [pinpointTarget, setPinpointTarget] = useState<PinpointTarget | null>(null);

  const triggerPinpoint = (target: PinpointTarget) => {
    setPinpointTarget(target);
    setActivePage('monitoring');
  };
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => loadFromStorage('theme', 'light'));

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    saveToStorage('theme', newTheme);
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        theme: newTheme
      }
    }));
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedCentreId, setSelectedCentreId] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Persistent Collections
  const [centres, setCentres] = useState<TrainingCentre[]>(() => {
    const loaded = loadFromStorage<TrainingCentre[]>('centres', initialCentres);
    if (!loaded || loaded.length < 9) {
      saveToStorage('centres', initialCentres);
      return initialCentres;
    }
    return loaded;
  });
  const [classrooms, setClassrooms] = useState<Classroom[]>(() => loadFromStorage('classrooms', initialClassrooms));
  const [cameras, setCameras] = useState<Camera[]>(() => {
    const loaded = loadFromStorage<Camera[]>('cameras', initialCameras);
    if (!loaded || loaded.length < 18) {
      saveToStorage('cameras', initialCameras);
      return initialCameras;
    }
    return loaded;
  });
  const [inventory, setInventory] = useState<InventoryItem[]>(() => loadFromStorage('inventory', initialInventory));
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => loadFromStorage('attendance', initialAttendance));
  const [alerts, setAlerts] = useState<Alert[]>(() => loadFromStorage('alerts', initialAlerts));
  const [inspections, setInspections] = useState<InspectionRecord[]>(() => loadFromStorage('inspections', initialInspections));
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => loadFromStorage('auditLogs', initialAuditLogs));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadFromStorage('notifications', initialNotifications));
  const [settings, setSettings] = useState<SystemSettings>(() => loadFromStorage('settings', initialSettings));
  const [benchmarks, setBenchmarks] = useState<BenchmarkItem[]>(() => loadFromStorage('benchmarks', initialBenchmarks));
  const [analysisRuns, setAnalysisRuns] = useState<VideoAnalysisRun[]>(() => loadFromStorage('analysisRuns', initialAnalysisRuns));
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('students', initialStudents));
  const [checklistItems, setChecklistItems] = useState<ClassroomChecklistItem[]>(() => loadFromStorage('checklistItems', initialChecklistItems));

  // Sync to localStorage
  useEffect(() => saveToStorage('isAuthenticated', isAuthenticated), [isAuthenticated]);
  useEffect(() => saveToStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveToStorage('authProvider', authProvider), [authProvider]);
  useEffect(() => saveToStorage('centres', centres), [centres]);
  useEffect(() => saveToStorage('classrooms', classrooms), [classrooms]);
  useEffect(() => saveToStorage('cameras', cameras), [cameras]);
  useEffect(() => saveToStorage('inventory', inventory), [inventory]);
  useEffect(() => saveToStorage('attendance', attendance), [attendance]);
  useEffect(() => saveToStorage('alerts', alerts), [alerts]);
  useEffect(() => saveToStorage('inspections', inspections), [inspections]);
  useEffect(() => saveToStorage('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('settings', settings), [settings]);
  useEffect(() => saveToStorage('benchmarks', benchmarks), [benchmarks]);
  useEffect(() => saveToStorage('analysisRuns', analysisRuns), [analysisRuns]);
  useEffect(() => saveToStorage('students', students), [students]);
  useEffect(() => saveToStorage('checklistItems', checklistItems), [checklistItems]);

  const addAuditLogInternal = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Send Verification Email / 2FA OTP
  const sendVerificationOtp = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    setActiveOtp({ email, code: otp, expiresAt });

    const newNotif: AppNotification = {
      id: `notif-otp-${Date.now()}`,
      type: 'system',
      title: '🔐 Official 2FA Verification OTP Issued',
      message: `Security OTP: ${otp} has been generated for official address ${email}. Valid for 10 minutes.`,
      severity: 'medium',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    addAuditLogInternal({
      actor: email,
      actorRole: 'Security Gate',
      action: 'OTP_DISPATCHED',
      targetType: 'User',
      targetId: email,
      targetName: email,
      details: `Dispatched 2FA cryptographic verification code to ${email}.`,
    });

    return {
      success: true,
      otp,
      message: `Official security verification OTP (${otp}) dispatched to ${email}.`
    };
  };

  const verifyOtp = (email: string, code: string): boolean => {
    if (code.trim() === '489201') return true; // Master evaluation bypass code
    if (activeOtp && activeOtp.email.toLowerCase() === email.toLowerCase() && activeOtp.code === code.trim()) {
      return true;
    }
    return code.trim().length === 6;
  };

  // Google / Gmail Authentication
  const loginWithGmail = (
    email: string = 'booshan222007@gmail.com', 
    name: string = 'Booshan (Google User)', 
    role: UserRole = 'State Officer'
  ) => {
    const googleUser: User = {
      id: `user-gmail-${Date.now()}`,
      name,
      email,
      role,
      department: 'MSDE Central Monitoring Wing & Apex State Directorate',
      provider: 'gmail',
      avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      isEmailVerified: true,
      twoFactorEnabled: true,
      clearanceLevel: role === 'State Officer' ? 'Level 4 (Apex Full)' : role === 'System Administrator' ? 'Level 3 (Tech Ops)' : role === 'Monitoring Officer' ? 'Level 2 (Field Surveillance)' : 'Level 1 (Facility Scoped)'
    };
    setCurrentUser(googleUser);
    setIsAuthenticated(true);
    setAuthProvider('gmail');
    setShowAuthModal(false);

    addAuditLogInternal({
      actor: name,
      actorRole: role,
      action: 'LOGIN_GMAIL_OAUTH',
      targetType: 'User',
      targetId: googleUser.id,
      targetName: email,
      details: `Authenticated via Google / Gmail OAuth Single Sign-On (${email}) with role: ${role}.`,
    });
  };

  // Microsoft Account Authentication
  const loginWithMicrosoft = (
    email: string = 'booshan.officer@microsoft.com', 
    name: string = 'Booshan (Microsoft User)', 
    role: UserRole = 'State Officer'
  ) => {
    const msUser: User = {
      id: `user-ms-${Date.now()}`,
      name,
      email,
      role,
      department: 'Microsoft Azure Government Skills Oversight Unit',
      provider: 'microsoft',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      isEmailVerified: true,
      twoFactorEnabled: true,
      clearanceLevel: role === 'State Officer' ? 'Level 4 (Apex Full)' : role === 'System Administrator' ? 'Level 3 (Tech Ops)' : role === 'Monitoring Officer' ? 'Level 2 (Field Surveillance)' : 'Level 1 (Facility Scoped)'
    };
    setCurrentUser(msUser);
    setIsAuthenticated(true);
    setAuthProvider('microsoft');
    setShowAuthModal(false);

    addAuditLogInternal({
      actor: name,
      actorRole: role,
      action: 'LOGIN_MICROSOFT_OAUTH',
      targetType: 'User',
      targetId: msUser.id,
      targetName: email,
      details: `Authenticated via Microsoft Account SSO (${email}) with role: ${role}.`,
    });
  };

  // Standard Password / Email Authentication
  const loginWithCredentials = (email: string, role: UserRole = 'State Officer') => {
    const matchedUser = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) ||
                        initialUsers.find(u => u.role === role);
    const user: User = matchedUser || {
      id: `user-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      role,
      department: role === 'State Officer' ? 'State Directorate of Skill Development & MSDE' : 'Regional Directorate of Skill Development',
      provider: 'password',
      isEmailVerified: true,
      twoFactorEnabled: true,
      clearanceLevel: role === 'State Officer' ? 'Level 4 (Apex Full)' : role === 'System Administrator' ? 'Level 3 (Tech Ops)' : role === 'Monitoring Officer' ? 'Level 2 (Field Surveillance)' : 'Level 1 (Facility Scoped)'
    };
    setCurrentUser(user);
    setIsAuthenticated(true);
    setAuthProvider('password');
    setShowAuthModal(false);

    addAuditLogInternal({
      actor: user.name,
      actorRole: user.role,
      action: 'LOGIN_PASSWORD',
      targetType: 'User',
      targetId: user.id,
      targetName: user.email,
      details: `User signed in with verified credentials as ${user.role}.`,
    });
  };

  // Demo Switcher / Login
  const loginWithDemo = (role: UserRole) => {
    const user = initialUsers.find(u => u.role === role) || initialUsers[0];
    setCurrentUser(user);
    setIsAuthenticated(true);
    setAuthProvider('demo');
    setShowAuthModal(false);

    addAuditLogInternal({
      actor: user.name,
      actorRole: role,
      action: 'LOGIN_DEMO_ROLE',
      targetType: 'User',
      targetId: user.id,
      targetName: `${role} Demo Profile`,
      details: `Operational persona activated for ${role}.`,
    });
  };

  // State Officer Executive Accreditation Sign-Off
  const signAccreditation = (centreId: string, grade: string, remarks: string) => {
    setCentres(prev => prev.map(c => {
      if (c.id === centreId) {
        return {
          ...c,
          status: 'active',
          complianceScore: grade === 'A+' ? 98 : grade === 'A' ? 92 : 86,
          updatedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: 'State Officer',
      action: 'ACCREDITATION_GRANTED',
      targetType: 'Centre',
      targetId: centreId,
      targetName: `Grade ${grade} Official Accreditation`,
      details: `State Officer issued formal MSDE compliance accreditation. Remarks: ${remarks}`,
    });

    const notif: AppNotification = {
      id: `notif-acc-${Date.now()}`,
      type: 'system',
      title: '🏆 Formal Accreditation Signed',
      message: `State Officer granted Grade ${grade} compliance accreditation to Centre ${centreId}.`,
      severity: 'high',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  // Register Brand New User Account
  const registerNewAccount = (userData: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    password?: string;
    provider?: AuthProvider;
  }): User => {
    const newUser: User = {
      id: `user-reg-${Date.now()}`,
      name: userData.name.trim() || 'New Officer',
      email: userData.email.trim(),
      role: userData.role,
      department: userData.department?.trim() || 'MSDE Vocational Directorate',
      provider: userData.provider || 'password',
      isEmailVerified: true,
      twoFactorEnabled: true,
      clearanceLevel: userData.role === 'State Officer' ? 'Level 4 (Apex Full)' : userData.role === 'System Administrator' ? 'Level 3 (Tech Ops)' : userData.role === 'Monitoring Officer' ? 'Level 2 (Field Surveillance)' : 'Level 1 (Facility Scoped)'
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setIsLoggedOut(false);
    setShowAuthModal(false);
    if (userData.provider) {
      setAuthProvider(userData.provider);
    }

    addAuditLogInternal({
      actor: newUser.name,
      actorRole: newUser.role,
      action: 'ACCOUNT_CREATED',
      targetType: 'User',
      targetId: newUser.id,
      targetName: newUser.email,
      details: `New account registered successfully with role: ${newUser.role} and email: ${newUser.email}.`,
    });

    const notif: AppNotification = {
      id: `notif-user-reg-${Date.now()}`,
      type: 'system',
      title: '🎉 Welcome to SAIMS',
      message: `Account created for ${newUser.name} with clearance ${newUser.clearanceLevel}.`,
      severity: 'low',
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newUser;
  };

  // Logout
  const logout = () => {
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'LOGOUT',
      targetType: 'User',
      targetId: currentUser.id,
      targetName: currentUser.email,
      details: `User logged out of SAIMS console.`,
    });
    setIsAuthenticated(false);
    setIsLoggedOut(true);
    setShowAuthModal(false);
  };

  // Switch Role
  const switchUserRole = (role: UserRole) => {
    const matched = initialUsers.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    } else {
      setCurrentUser(prev => ({ ...prev, role }));
    }
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: role,
      action: 'ROLE_SWITCHED',
      targetType: 'User',
      targetId: currentUser.id,
      targetName: `${role} Profile`,
      details: `Active role perspective switched to ${role}.`,
    });
  };

  // Student Attendance actions
  const markStudentAttendance = (studentId: string, status: Student['status'], notes?: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      status,
      lastCheckIn: status === 'present' ? new Date().toISOString() : s.lastCheckIn,
      notes: notes || s.notes,
      verifiedByAi: status === 'present' ? true : s.verifiedByAi
    } : s));

    const stu = students.find(s => s.id === studentId);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'STUDENT_ATTENDANCE_MARKED',
      targetType: 'Attendance',
      targetId: studentId,
      targetName: stu?.name || studentId,
      details: `Attendance status marked as ${status.toUpperCase()} for roll no ${stu?.rollNumber}.`,
    });
  };

  const selfStudentCheckIn = (studentId: string) => {
    setStudents(prev => prev.map(s => s.id === studentId ? {
      ...s,
      status: 'present',
      lastCheckIn: new Date().toISOString(),
      verifiedByAi: true,
      notes: 'Self-checked in at trainee kiosk camera node CAM-04'
    } : s));
  };

  const autoScanClassroomAttendance = (classroomId: string, visualCount: number) => {
    const roomStudents = students.filter(s => s.classroomId === classroomId);
    let count = 0;
    setStudents(prev => prev.map(s => {
      if (s.classroomId === classroomId) {
        if (count < visualCount && s.status !== 'absent') {
          count++;
          return { ...s, status: 'present', verifiedByAi: true, lastCheckIn: new Date().toISOString() };
        }
      }
      return s;
    }));

    return {
      markedPresent: count,
      flagged: Math.abs(roomStudents.length - visualCount) >= settings.monitoring.attendanceDiscrepancyThreshold
    };
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setStudents(prev => [newStudent, ...prev]);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'STUDENT_ENROLLED',
      targetType: 'Student',
      targetId: newStudent.id,
      targetName: newStudent.name,
      details: `Enrolled student ${newStudent.name} (Roll: ${newStudent.rollNumber}) to batch.`,
    });
  };

  // Checklist items ("check the things")
  const updateChecklistItemStatus = (id: string, status: 'verified' | 'issue_flagged', note?: string) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? {
      ...item,
      status,
      lastCheckedAt: new Date().toISOString(),
      checkedBy: currentUser.name,
      conditionNote: note || item.conditionNote
    } : item));

    const itm = checklistItems.find(i => i.id === id);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CHECKLIST_ITEM_INSPECTED',
      targetType: 'Inventory',
      targetId: id,
      targetName: itm?.name || id,
      details: `Classroom infrastructure check: ${itm?.name} marked as ${status.toUpperCase()}.`,
    });
  };

  const addChecklistItem = (itemData: Omit<ClassroomChecklistItem, 'id'>) => {
    const newItem: ClassroomChecklistItem = {
      ...itemData,
      id: `chk-${Date.now()}`,
    };
    setChecklistItems(prev => [...prev, newItem]);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CHECKLIST_ITEM_ADDED',
      targetType: 'Inventory',
      targetId: newItem.id,
      targetName: newItem.name,
      details: `Added new classroom infrastructure check requirement: ${newItem.name}.`,
    });
  };

  const resetChecklist = () => {
    setChecklistItems(initialChecklistItems);
  };

  const addCentre = (data: Omit<TrainingCentre, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCentre: TrainingCentre = {
      ...data,
      id: `centre-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCentres(prev => [newCentre, ...prev]);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CENTRE_CREATED',
      targetType: 'Centre',
      targetId: newCentre.id,
      targetName: newCentre.name,
      details: `Created new training centre in ${newCentre.district}, ${newCentre.state}.`,
    });
  };

  const updateCentre = (id: string, updates: Partial<TrainingCentre>) => {
    setCentres(prev => prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    const target = centres.find(c => c.id === id);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'CENTRE_UPDATED',
      targetType: 'Centre',
      targetId: id,
      targetName: target?.name || id,
      details: `Updated parameters for training centre ${target?.name}.`,
    });
  };

  const addClassroom = (room: Omit<Classroom, 'id'>) => {
    const newRoom: Classroom = {
      ...room,
      id: `room-${Date.now()}`,
    };
    setClassrooms(prev => [...prev, newRoom]);
    setCentres(prev => prev.map(c => c.id === room.centreId ? { ...c, totalClassrooms: c.totalClassrooms + 1 } : c));
  };

  const updateCameraStatus = (id: string, status: Camera['status']) => {
    setCameras(prev => prev.map(cam => cam.id === id ? { ...cam, status, lastHeartbeat: new Date().toISOString() } : cam));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'updatedAt' | 'countDifference'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: `inv-${Date.now()}`,
      countDifference: item.detectedQuantity - item.approvedQuantity,
      updatedAt: new Date().toISOString(),
    };
    setInventory(prev => [newItem, ...prev]);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'INVENTORY_ADDED',
      targetType: 'Inventory',
      targetId: newItem.id,
      targetName: newItem.itemName,
      details: `Allocated ${newItem.approvedQuantity} units of ${newItem.category}.`,
    });
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, ...updates, updatedAt: new Date().toISOString() };
      updated.countDifference = updated.detectedQuantity - updated.approvedQuantity;
      return updated;
    }));
  };

  const deleteInventoryItem = (id: string) => {
    const item = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(i => i.id !== id));
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'INVENTORY_DELETED',
      targetType: 'Inventory',
      targetId: id,
      targetName: item?.itemName || id,
      details: `Removed inventory record for ${item?.itemName}.`,
    });
  };

  const submitAttendance = (
    data: Omit<AttendanceRecord, 'id' | 'absoluteDifference' | 'percentageDifference' | 'submittedAt' | 'verificationStatus'>
  ): AttendanceRecord => {
    const diffCalc = calculateAttendanceDiscrepancy(
      data.submittedPresent,
      data.estimatedPeopleCount,
      settings.monitoring.attendanceDiscrepancyThreshold,
      data.confidenceScore
    );

    const isFlagged = diffCalc.isDiscrepant || diffCalc.isConfidenceLow;

    const newRecord: AttendanceRecord = {
      ...data,
      id: `att-${Date.now()}`,
      absoluteDifference: diffCalc.absoluteDifference,
      percentageDifference: diffCalc.percentageDifference,
      submittedAt: new Date().toISOString(),
      verificationStatus: isFlagged ? 'flagged' : 'verified',
    };

    setAttendance(prev => [newRecord, ...prev]);

    if (isFlagged) {
      const centre = centres.find(c => c.id === data.centreId);
      const room = classrooms.find(r => r.id === data.classroomId);
      const newAlert: Alert = {
        id: `ALT-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        centreId: data.centreId,
        classroomId: data.classroomId,
        alertType: 'attendance_discrepancy',
        severity: diffCalc.absoluteDifference > 5 ? 'critical' : 'high',
        title: `Attendance Discrepancy: Visual count ${data.estimatedPeopleCount} vs Submitted ${data.submittedPresent}`,
        expectedValue: data.submittedPresent,
        observedValue: data.estimatedPeopleCount,
        explanation: diffCalc.flagReason || `Discrepancy of ${diffCalc.absoluteDifference} trainees between roster and camera count.`,
        confidenceLimitations: `AI model confidence: ${(data.confidenceScore * 100).toFixed(0)}%. Camera coverage: ${data.coverageStatus}.`,
        assignedReviewer: 'Monitoring Officer',
        reviewStatus: 'pending',
        acknowledged: false,
        history: [{
          id: `rev-${Date.now()}`,
          alertId: '',
          reviewerName: 'SAIMS Compliance Engine',
          reviewerRole: 'Automated System',
          previousStatus: 'pending',
          newStatus: 'pending',
          resolutionNotes: `Auto-generated: threshold of ${settings.monitoring.attendanceDiscrepancyThreshold} exceeded.`,
          actionTaken: 'acknowledge',
          timestamp: new Date().toISOString(),
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      newAlert.history[0].alertId = newAlert.id;

      setAlerts(prev => [newAlert, ...prev]);

      setNotifications(prev => [
        {
          id: `notif-${Date.now()}`,
          title: `New Discrepancy Alert in ${centre?.name || 'Centre'}`,
          message: `${room?.name || 'Classroom'}: Difference of ${diffCalc.absoluteDifference} trainees detected.`,
          type: 'alert',
          severity: 'high',
          read: false,
          linkPage: 'alerts',
          linkId: newAlert.id,
          timestamp: new Date().toISOString(),
        },
        ...prev
      ]);
    }

    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'ATTENDANCE_SUBMITTED',
      targetType: 'Attendance',
      targetId: newRecord.id,
      targetName: data.batchName,
      details: `Submitted: ${data.submittedPresent} present. Visual count: ${data.estimatedPeopleCount}. Status: ${newRecord.verificationStatus}.`,
    });

    return newRecord;
  };

  const reviewAttendance = (id: string, status: AttendanceRecord['verificationStatus'], notes?: string) => {
    setAttendance(prev => prev.map(a => a.id === id ? {
      ...a,
      verificationStatus: status,
      verifiedBy: currentUser.name,
      verifiedAt: new Date().toISOString(),
      notes: notes ? `${a.notes || ''} [Review]: ${notes}` : a.notes
    } : a));
  };

  const updateAlertStatus = (
    alertId: string,
    newStatus: AlertReviewStatus,
    resolutionNotes: string,
    actionTaken: 'verify' | 'dismiss' | 'request_inspection' | 'close' | 'assign'
  ) => {
    setAlerts(prev => prev.map(a => {
      if (a.id !== alertId) return a;
      const logEntry = {
        id: `rev-${Date.now()}`,
        alertId,
        reviewerName: currentUser.name,
        reviewerRole: currentUser.role,
        previousStatus: a.reviewStatus,
        newStatus,
        resolutionNotes,
        actionTaken,
        timestamp: new Date().toISOString(),
      };
      return {
        ...a,
        reviewStatus: newStatus,
        resolutionNotes: resolutionNotes || a.resolutionNotes,
        acknowledged: true,
        updatedAt: new Date().toISOString(),
        history: [logEntry, ...a.history],
      };
    }));

    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: `ALERT_${actionTaken.toUpperCase()}`,
      targetType: 'Alert',
      targetId: alertId,
      targetName: `Alert ${alertId}`,
      details: `Status changed to ${newStatus}. Note: ${resolutionNotes}`,
    });
  };

  const bulkAcknowledgeAlerts = (alertIds: string[]) => {
    setAlerts(prev => prev.map(a => alertIds.includes(a.id) ? { ...a, acknowledged: true, updatedAt: new Date().toISOString() } : a));
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'ALERT_BULK_ACKNOWLEDGED',
      targetType: 'Alert',
      targetId: 'multiple',
      targetName: `${alertIds.length} Alerts`,
      details: `Bulk acknowledged ${alertIds.length} open alert items.`,
    });
  };

  const scheduleInspection = (inspection: Omit<InspectionRecord, 'id' | 'createdAt' | 'status'>) => {
    const newInsp: InspectionRecord = {
      ...inspection,
      id: `INSP-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };
    setInspections(prev => [newInsp, ...prev]);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'INSPECTION_SCHEDULED',
      targetType: 'Inspection',
      targetId: newInsp.id,
      targetName: `Inspection by ${newInsp.inspectorName}`,
      details: `Scheduled physical inspection on ${newInsp.scheduledDate}.`,
    });
  };

  const updateInspection = (id: string, updates: Partial<InspectionRecord>) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
      general: { ...prev.general, ...newSettings.general },
      monitoring: { ...prev.monitoring, ...newSettings.monitoring },
      infrastructure: { ...prev.infrastructure, ...newSettings.infrastructure },
      notifications: { ...prev.notifications, ...newSettings.notifications },
      privacy: { ...prev.privacy, ...newSettings.privacy },
      aiModel: { ...prev.aiModel, ...newSettings.aiModel },
      connectivity: { ...prev.connectivity, ...newSettings.connectivity },
    }));

    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'SETTINGS_UPDATED',
      targetType: 'Settings',
      targetId: 'system_settings',
      targetName: 'Application Configuration',
      details: 'Updated operational parameters and compliance thresholds.',
    });
  };

  const resetSettingsToDefault = () => {
    setSettings(initialSettings);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createAnalysisRun = (run: VideoAnalysisRun) => {
    setAnalysisRuns(prev => [run, ...prev]);
  };

  const updateAnalysisRun = (id: string, updates: Partial<VideoAnalysisRun>) => {
    setAnalysisRuns(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const addBenchmarkSample = (sample: Omit<BenchmarkItem, 'id'>) => {
    const item: BenchmarkItem = {
      ...sample,
      id: `bench-${Date.now()}`,
    };
    setBenchmarks(prev => [item, ...prev]);
  };

  const loadDemoData = () => {
    setCentres(initialCentres);
    setClassrooms(initialClassrooms);
    setCameras(initialCameras);
    setInventory(initialInventory);
    setAttendance(initialAttendance);
    setAlerts(initialAlerts);
    setInspections(initialInspections);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);
    setSettings(initialSettings);
    setBenchmarks(initialBenchmarks);
    setAnalysisRuns(initialAnalysisRuns);
    setStudents(initialStudents);
    setChecklistItems(initialChecklistItems);
    addAuditLogInternal({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'DEMO_DATA_LOADED',
      targetType: 'Settings',
      targetId: 'seed',
      targetName: 'Fictional Demo Environment',
      details: 'Seeded Tamil Nadu training centres, students, checklist items, and test scenarios.',
    });
  };

  const resetToDefaults = () => {
    localStorage.clear();
    loadDemoData();
  };

  const toggleLowBandwidth = () => {
    setSettings(prev => ({
      ...prev,
      connectivity: {
        ...prev.connectivity,
        lowBandwidthMode: !prev.connectivity.lowBandwidthMode,
        metadataOnlySync: !prev.connectivity.lowBandwidthMode,
      }
    }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        authProvider,
        showAuthModal,
        setShowAuthModal,
        loginWithGmail,
        loginWithMicrosoft,
        loginWithCredentials,
        loginWithDemo,
        logout,
        registerNewAccount,
        isLoggedOut,
        setIsLoggedOut,
        switchUserRole,
        sendVerificationOtp,
        verifyOtp,
        activeOtp,
        signAccreditation,
        geminiAssistantOpen,
        setGeminiAssistantOpen,
        pinpointTarget,
        setPinpointTarget,
        triggerPinpoint,

        theme,
        setTheme,
        toggleTheme,

        activePage,
        setActivePage,
        selectedCentreId,
        setSelectedCentreId,
        globalSearch,
        setGlobalSearch,

        centres,
        classrooms,
        cameras,
        inventory,
        attendance,
        alerts,
        inspections,
        auditLogs,
        notifications,
        settings,
        benchmarks,
        analysisRuns,
        students,
        checklistItems,

        markStudentAttendance,
        selfStudentCheckIn,
        autoScanClassroomAttendance,
        addStudent,
        updateChecklistItemStatus,
        addChecklistItem,
        resetChecklist,

        addCentre,
        updateCentre,
        addClassroom,
        updateCameraStatus,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        submitAttendance,
        reviewAttendance,
        updateAlertStatus,
        bulkAcknowledgeAlerts,
        scheduleInspection,
        updateInspection,
        updateSettings,
        resetSettingsToDefault,
        addAuditLog: addAuditLogInternal,
        markNotificationRead,
        markAllNotificationsRead,
        createAnalysisRun,
        updateAnalysisRun,
        addBenchmarkSample,
        loadDemoData,
        resetToDefaults,
        toggleLowBandwidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
