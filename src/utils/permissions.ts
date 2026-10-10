import { UserRole, User } from '../types';

export interface RoleConfig {
  role: UserRole;
  category: string;
  clearanceLevel: 'Level 4 (Apex Full)' | 'Level 3 (Tech Ops)' | 'Level 2 (Field Surveillance)' | 'Level 1 (Facility Scoped)';
  clearanceRank: number; // 4 is highest
  badgeColor: string;
  loginEmail: string;
  loginPass: string;
  description: string;
  fullAccess: boolean;
  allowedActions: string[];
  restrictedActions: string[];
}

export const ROLE_CONFIGURATIONS: Record<UserRole, RoleConfig> = {
  'State Officer': {
    role: 'State Officer',
    category: 'Apex State Directorate & MSDE Executive',
    clearanceLevel: 'Level 4 (Apex Full)',
    clearanceRank: 4,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    loginEmail: 'stateofficer@msde.gov.in',
    loginPass: 'state@msde2026',
    description: 'Supreme state-level vigilance & executive authority. Holds full sovereign access across all training centres, legal accreditation sign-off, system settings, forensic audit logs, and central ministry escalations.',
    fullAccess: true,
    allowedActions: [
      'Full Multi-District Centre Access',
      'All Live CCTV Telemetry & Stream Overrides',
      'Autonomous AI Student Attendance Verification',
      'Classroom Infrastructure & "Check Things" Compliance Sign-Off',
      'Official MSDE Accreditation & Sanctions Issuance',
      'Tamper-Proof Forensic Audit Ledger & Cryptographic Export',
      'Global System Settings & Edge AI Threshold Modification',
      'User Provisioning & Role Elevation Management',
      'Discrepancy Investigation & Subsidy Freeze Authorization'
    ],
    restrictedActions: []
  },

  'System Administrator': {
    role: 'System Administrator',
    category: 'Technical Operations & Edge Infrastructure',
    clearanceLevel: 'Level 3 (Tech Ops)',
    clearanceRank: 3,
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    loginEmail: 'sysadmin@msde.gov.in',
    loginPass: 'admin@msde2026',
    description: 'Manages edge hardware, CCTV RTSP stream configurations, automated diagnostic suites, network latency, and user accounts. Restricted from sovereign state inspection approvals and legal sanctioning.',
    fullAccess: false,
    allowedActions: [
      'Configure CCTV RTSP URLs, Cameras & Edge Decoders',
      'Run Automated Diagnostics & Bandwidth Optimizations',
      'Manage User Accounts & Initial Provisioning',
      'View Real-Time Performance & GPU Telemetry',
      'Configure AI Edge Pipeline Architecture',
      'Execute Automated System Test Suites'
    ],
    restrictedActions: [
      'CANNOT Sign-off on Official Government Inspection Accreditation',
      'CANNOT Issue Financial Subsidy Freezes or Sanction Orders (State Officer Only)',
      'CANNOT Alter or Wipe Legal Forensic Audit Trail Logs',
      'CANNOT Approve Trainee Attendance Waiver Exceptions'
    ]
  },

  'Monitoring Officer': {
    role: 'Monitoring Officer',
    category: 'Field Surveillance & Vigilance Wing',
    clearanceLevel: 'Level 2 (Field Surveillance)',
    clearanceRank: 2,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    loginEmail: 'monitor@msde.gov.in',
    loginPass: 'monitor@msde2026',
    description: 'Conducts real-time field monitoring, observes live camera feeds, takes student attendance counts, and reviews infrastructure checklists. Restricted from administrative overrides and camera deletion.',
    fullAccess: false,
    allowedActions: [
      'View All Live CCTV Feeds & Multi-Camera Security Grid',
      'Run Autonomous AI Attendance Scans & Trainee Roll Kiosk',
      'Inspect Classroom "Check Things" Infrastructure Checklist',
      'Log Vigilance Incident Observations & Field Alerts',
      'Review Attendance Discrepancy Reports'
    ],
    restrictedActions: [
      'CANNOT Modify RTSP Streams or Delete Cameras',
      'CANNOT Edit Global AI Confidence Thresholds or System Rules',
      'CANNOT Manage, Create or Delete User Accounts',
      'CANNOT Dismiss Critical Ghost-Student/Fraud Incidents Without Supervisor Review',
      'CANNOT Issue Centre Accreditation or Legal Compliance Dossiers'
    ]
  },

  'Centre Manager': {
    role: 'Centre Manager',
    category: 'Local Vocational Training Centre Administration',
    clearanceLevel: 'Level 1 (Facility Scoped)',
    clearanceRank: 1,
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    loginEmail: 'manager.chennai@msde.gov.in',
    loginPass: 'manager@msde2026',
    description: 'Head of local vocational training facility (Chennai Centre TN-CHE-0104). Limited strictly to their assigned facility: can manage student check-in and local equipment. Restricted from state-level logs and other centres.',
    fullAccess: false,
    allowedActions: [
      'View Live CCTV Cameras of Assigned Centre (Chennai TN-CHE-0104)',
      'Manage Student Roster & Self-Check-in Kiosk for Active Batches',
      'Complete Daily Classroom Physical Checklist ("Check Things")',
      'Submit Facility Maintenance & Re-Inspection Requests'
    ],
    restrictedActions: [
      'CANNOT Access or View Other Training Centres (Madurai, Coimbatore, Trichy)',
      'CANNOT View State-Wide Audit Logs or Multi-District Analytics',
      'CANNOT Alter Global System Settings, AI Sensitivity, or Thresholds',
      'CANNOT Self-Dismiss or Resolve Regulatory Compliance Alerts Against Their Centre',
      'CANNOT Access User Management or System Security Controls'
    ]
  }
};

export function hasPermission(
  user: User | null | undefined, 
  action: 'full_access' | 'state_accreditation' | 'edit_settings' | 'manage_users' | 'view_audit_logs' | 'delete_camera' | 'cross_centre_access' | 'dismiss_fraud_alerts'
): boolean {
  if (!user) return false;
  const role = user.role;

  // State Officer has sovereign access to EVERYTHING
  if (role === 'State Officer') return true;

  switch (action) {
    case 'full_access':
    case 'state_accreditation':
    case 'view_audit_logs':
    case 'dismiss_fraud_alerts':
      // Only State Officer can sign official accreditations, view state audit logs, or dismiss fraud
      return false;

    case 'edit_settings':
    case 'delete_camera':
      // State Officer & System Administrator can manage hardware / settings
      return role === 'System Administrator';

    case 'manage_users':
      // System Administrator can view/provision, but only State Officer has final governance
      return role === 'System Administrator';

    case 'cross_centre_access':
      // State Officer, System Admin, and Monitoring Officer can view all centres; Centre Manager is restricted to their own
      return role !== 'Centre Manager';

    default:
      return false;
  }
}
