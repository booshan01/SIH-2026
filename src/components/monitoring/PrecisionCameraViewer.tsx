import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Crosshair,
  Sparkles,
  Camera as CameraIcon,
  Maximize2,
  Minimize2,
  CheckCircle2,
  X,
  ChevronDown,
  Eye,
  Zap,
  BarChart2,
  Bot,
  Tablet,
  Wrench,
  Thermometer,
  Monitor,
  Cpu,
  Radio,
  Loader2,
  RotateCcw,
  AlertTriangle,
  UserCheck,
  UserX,
  PackageX,
  Plus,
  Sliders,
  Shield,
  Layers,
  Flame,
  Check,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Trash2
} from 'lucide-react';
import { generateRoomAuditWithGemini, InspectionAuditResult, DEFAULT_INSPECTION_AUDIT } from '../../services/geminiService';
import { useApp } from '../../context/AppContext';
import { PinpointTarget } from '../../types';
import { useLiveCctvClock } from '../../utils/useLiveCctvClock';

import cctvFactoryImg from '../../assets/images/cctv_factory_workshop_1791819809488.jpg';
import cctvClassroomImg from '../../assets/images/cctv_classroom_attendance_1791819789935.jpg';
import cctvWeldingImg from '../../assets/images/cctv_welding_bay_1791955209015.jpg';
import cctvCncImg from '../../assets/images/cctv_cnc_milling_1791955210588.jpg';
import cctvServerImg from '../../assets/images/cctv_server_racks_1791955211007.jpg';
import cctvRoboticsImg from '../../assets/images/cctv_robotics_arm_1791955211812.jpg';
import cctvComputerLabImg from '../../assets/images/cctv_computer_lab_1791955211671.jpg';

export interface CameraDefinition {
  id: string;
  name: string;
  sector: 'workshops' | 'academics' | 'electrical_iot' | 'security_facilities';
  type: 'image' | 'video';
  url: string;
  imageUrl: string;
  videoUrl: string;
  badge?: string;
  subtitle?: string;
  resolution: string;
  fps: number;
  latencyMs: number;
}

// 18 LIVE CAMERA SECTIONS WITH AUTHENTIC CCTV IMAGES (>14 LIVE CAMERAS)
export const CAMERAS: CameraDefinition[] = [
  {
    id: 'cam-factory',
    name: '🏭 Cam 12: Factory Electronics Workshop',
    sector: 'workshops',
    type: 'image',
    url: cctvFactoryImg,
    imageUrl: cctvFactoryImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    badge: 'MISSING TOOL DETECTION',
    subtitle: 'High-precision SMT & soldering workstation with automated tool accountability reticles',
    resolution: '4K Ultra-HD',
    fps: 30,
    latencyMs: 16
  },
  {
    id: 'cam-classroom',
    name: '👥 Cam 04: Classroom Attendance & Face Scan',
    sector: 'academics',
    type: 'image',
    url: cctvClassroomImg,
    imageUrl: cctvClassroomImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    badge: 'FACIAL HEADCOUNT',
    subtitle: 'Biometric face matching & seated trainee headcount audit with seating roster overlays',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 22
  },
  {
    id: 'cam-welding',
    name: '🔥 Cam 06: Heavy Welding & Metal Fabrication Bay',
    sector: 'workshops',
    type: 'image',
    url: cctvWeldingImg,
    imageUrl: cctvWeldingImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    badge: 'HOT WORK & OSHA',
    subtitle: 'TIG/MIG welding booths, argon pressure monitor & flash protection shield zone',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 38
  },
  {
    id: 'cam-cnc',
    name: '⚙️ Cam 08: Precision CNC Milling & Lathe Cell',
    sector: 'workshops',
    type: 'image',
    url: cctvCncImg,
    imageUrl: cctvCncImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    badge: 'HEAVY CNC CELL',
    subtitle: 'Multi-axis CNC milling spindle, automated tool changer & digital readout telemetry',
    resolution: '1080p FHD',
    fps: 25,
    latencyMs: 44
  },
  {
    id: 'cam-iot-server',
    name: '🖥️ Cam 14: Core Cloud Server Racks & Backbone',
    sector: 'electrical_iot',
    type: 'image',
    url: cctvServerImg,
    imageUrl: cctvServerImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    badge: 'TIER-3 SERVER RACK',
    subtitle: 'Fiber distribution frames, blade servers, UPS battery bank & gas suppression nozzles',
    resolution: '2560x1440 QHD',
    fps: 30,
    latencyMs: 14
  },
  {
    id: 'cam-robotics',
    name: '🤖 Cam 09: Robotics Arm Arena & Automation',
    sector: 'electrical_iot',
    type: 'image',
    url: cctvRoboticsImg,
    imageUrl: cctvRoboticsImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    badge: '6-AXIS COBOT',
    subtitle: 'Industrial pick-and-place robot arm, safety light curtain & conveyor encoder tracking',
    resolution: '1080p FHD',
    fps: 60,
    latencyMs: 19
  },
  {
    id: 'cam-pc-lab-a',
    name: '💻 Cam 01: IT Lab A - Trainee Workstations',
    sector: 'academics',
    type: 'image',
    url: cctvComputerLabImg,
    imageUrl: cctvComputerLabImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    badge: 'DUAL MONITOR LAB',
    subtitle: '35 networked dual-screen development consoles & central instructor projection hub',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 25
  },
  {
    id: 'cam-pc-lab-b',
    name: '💻 Cam 07: Digital Literacy & Cyber Testing Lab',
    sector: 'academics',
    type: 'image',
    url: cctvComputerLabImg,
    imageUrl: cctvComputerLabImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    badge: 'CYBER LAB',
    subtitle: 'High-speed trainee testing terminal rows and secure biometric session monitoring',
    resolution: '1080p FHD',
    fps: 25,
    latencyMs: 31
  },
  {
    id: 'cam-sewing',
    name: '🧵 Cam 05: Garment & Industrial Sewing Hall',
    sector: 'workshops',
    type: 'image',
    url: cctvFactoryImg,
    imageUrl: cctvFactoryImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    badge: 'TEXTILE PRODUCTION',
    subtitle: 'High-speed single needle lockstitch machines, thread spool tower & rotary fabric cutters',
    resolution: '1080p FHD',
    fps: 25,
    latencyMs: 35
  },
  {
    id: 'cam-electrical',
    name: '⚡ Cam 03: Electrical Bench & Power Distribution',
    sector: 'electrical_iot',
    type: 'image',
    url: cctvRoboticsImg,
    imageUrl: cctvRoboticsImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    badge: 'HIGH VOLTAGE RIG',
    subtitle: '3-phase regulated AC/DC power supply, benchtop digital storage oscilloscopes & LCR meters',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 20
  },
  {
    id: 'cam-turnstile',
    name: '🛂 Cam 00: Main Entrance & Turnstile Gate',
    sector: 'security_facilities',
    type: 'image',
    url: cctvClassroomImg,
    imageUrl: cctvClassroomImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    badge: 'ACCESS GATE',
    subtitle: 'High-speed biometric access turnstiles, thermal scanning & anti-tailgating optical gates',
    resolution: '4K Ultra-HD',
    fps: 60,
    latencyMs: 12
  },
  {
    id: 'cam-storage',
    name: '📦 Cam 11: Tool Crib & Precision Equipment Locker',
    sector: 'security_facilities',
    type: 'image',
    url: cctvCncImg,
    imageUrl: cctvCncImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    badge: 'SECURE TOOL CRIB',
    subtitle: 'RFID scanned tool check-out lockers, digital micrometers & torque wrench vaults',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 28
  },
  {
    id: 'cam-lecture-hall',
    name: '🎓 Cam 02: Smart Lecture Theater & Podium',
    sector: 'academics',
    type: 'image',
    url: cctvClassroomImg,
    imageUrl: cctvClassroomImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    badge: 'LECTURE THEATER',
    subtitle: 'Tiered auditorium seating, interactive lecturer podium & 120-inch motorized projection',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 24
  },
  {
    id: 'cam-safety-station',
    name: '🦺 Cam 15: OSHA Safety & Emergency Eye-Wash',
    sector: 'security_facilities',
    type: 'image',
    url: cctvWeldingImg,
    imageUrl: cctvWeldingImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    badge: 'OSHA COMPLIANCE',
    subtitle: 'Class ABC dry powder fire extinguishers, emergency eye-wash drench & trauma medical kit',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 18
  },
  {
    id: 'cam-automotive',
    name: '🚗 Cam 16: Automotive & Engine Diagnostic Bay',
    sector: 'workshops',
    type: 'image',
    url: cctvCncImg,
    imageUrl: cctvCncImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    badge: 'AUTO MECHANICS',
    subtitle: 'Two-post hydraulic vehicle hoist, OBD-II real-time ECU scanner & pneumatic air guns',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 32
  },
  {
    id: 'cam-chemical',
    name: '🔬 Cam 17: Materials Science & Chemical Testing',
    sector: 'security_facilities',
    type: 'image',
    url: cctvFactoryImg,
    imageUrl: cctvFactoryImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    badge: 'HAZMAT & FUME HOOD',
    subtitle: 'Ducted exhaust fume hoods, 0.0001g analytical balance & double-wall flammables cabinet',
    resolution: '1080p FHD',
    fps: 25,
    latencyMs: 29
  },
  {
    id: 'cam-loading-dock',
    name: '🚛 Cam 18: Logistics Loading Bay & Heavy Ingress',
    sector: 'security_facilities',
    type: 'image',
    url: cctvWeldingImg,
    imageUrl: cctvWeldingImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    badge: 'LOGISTICS GATE',
    subtitle: 'Hydraulic loading dock leveler, electric pallet jacks & floor scale sensor integration',
    resolution: '1080p FHD',
    fps: 30,
    latencyMs: 27
  },
  {
    id: 'cam-drone-bay',
    name: '🛸 Cam 19: Drone Avionics & Flight Testing Arena',
    sector: 'electrical_iot',
    type: 'image',
    url: cctvRoboticsImg,
    imageUrl: cctvRoboticsImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    badge: 'AVIONICS ARENA',
    subtitle: 'Indoor netted drone flight cage, RTK-GPS calibration markers & fireproof LiPo charging safe',
    resolution: '2560x1440 QHD',
    fps: 60,
    latencyMs: 15
  }
];

// DEFAULT PRESET PINPOINTS ACCURATELY PLACED FOR ALL CAMERA SECTIONS
const DEFAULT_CAMERA_PINPOINTS: Record<string, PinpointTarget[]> = {
  'cam-factory': [
    {
      id: 'pin-fact-1',
      name: 'Soldering Station #2 (MISSING)',
      category: 'tool',
      x: 74.0,
      y: 44.0,
      status: 'missing',
      assignedTo: 'David Miller',
      note: 'Workbench #4 (Station 24) - Unreturned',
      confidence: 0.96,
      width: 14,
      height: 18
    },
    {
      id: 'pin-fact-2',
      name: 'Tablet Scanner #04 (EMPTY BAY)',
      category: 'tool',
      x: 22.5,
      y: 39.0,
      status: 'missing',
      note: 'Slot 4 Empty on Charging Rack',
      confidence: 0.94,
      width: 10,
      height: 12
    },
    {
      id: 'pin-fact-3',
      name: 'Digital Oscilloscope #01',
      category: 'electronics',
      x: 42.0,
      y: 68.0,
      status: 'operational',
      note: 'Workbench #13 · Rigol 100MHz Dual Channel',
      confidence: 0.99,
      width: 12,
      height: 14
    },
    {
      id: 'pin-fact-4',
      name: 'Multimeter #03 (Fluke 87V)',
      category: 'electronics',
      x: 50.0,
      y: 76.0,
      status: 'operational',
      note: 'Calibration Bench · Verified in Place',
      confidence: 0.98,
      width: 8,
      height: 10
    },
    {
      id: 'pin-fact-5',
      name: 'Precision Tool Rack A',
      category: 'tool',
      x: 88.0,
      y: 38.0,
      status: 'operational',
      note: '100% Pliers & Cutters Secured',
      confidence: 0.97,
      width: 15,
      height: 22
    },
    {
      id: 'pin-fact-6',
      name: 'Fume Extractor Hood',
      category: 'safety',
      x: 68.0,
      y: 22.0,
      status: 'operational',
      note: 'Active HEPA filter at 99.7% efficiency',
      confidence: 0.95
    }
  ],
  'cam-classroom': [
    {
      id: 'pin-cls-1',
      name: 'Alex Chen (TN-101)',
      category: 'student',
      x: 64.0,
      y: 72.0,
      status: 'present',
      note: 'Biometric Face Match 98% · Seated Row 2',
      confidence: 0.98
    },
    {
      id: 'pin-cls-2',
      name: 'Sarah Jenkins (TN-102)',
      category: 'student',
      x: 21.0,
      y: 58.0,
      status: 'present',
      note: 'Biometric Face Match 97% · Seated Row 1',
      confidence: 0.97
    },
    {
      id: 'pin-cls-3',
      name: 'David Miller (TN-103)',
      category: 'student',
      x: 45.0,
      y: 52.0,
      status: 'present',
      note: 'Biometric Face Match 99% · Seated Center',
      confidence: 0.99
    },
    {
      id: 'pin-cls-4',
      name: 'Amanda Ross (UNAUTHORIZED ABSENT)',
      category: 'student',
      x: 76.0,
      y: 46.0,
      status: 'missing',
      note: 'Empty Desk 5 · Missing Morning Check-In',
      confidence: 0.92
    },
    {
      id: 'pin-cls-5',
      name: 'Emily Watson (APPROVED LEAVE)',
      category: 'student',
      x: 53.0,
      y: 42.0,
      status: 'absent',
      note: 'Empty Desk 3 · Medical Slip Verified',
      confidence: 0.95
    },
    {
      id: 'pin-cls-6',
      name: 'Interactive Smart Board 85"',
      category: 'facility',
      x: 48.0,
      y: 20.0,
      status: 'operational',
      note: 'Optical 4K Touch Active · HDMI-1 Input',
      confidence: 0.99
    },
    {
      id: 'pin-cls-7',
      name: 'Biometric Kiosk Scanner',
      category: 'electronics',
      x: 10.0,
      y: 76.0,
      status: 'operational',
      note: 'Optical Fingerprint & IR Face Sensor',
      confidence: 0.96
    }
  ],
  'cam-welding': [
    {
      id: 'pin-weld-1',
      name: 'TIG Inverter Welder 250A',
      category: 'machinery',
      x: 34.0,
      y: 56.0,
      status: 'operational',
      note: 'Lincoln Invertec · High Frequency Arc',
      confidence: 0.97
    },
    {
      id: 'pin-weld-2',
      name: 'Argon Shielding Gas Tank',
      category: 'safety',
      x: 18.0,
      y: 42.0,
      status: 'operational',
      note: 'Pressure: 155 Bar · No Leaks Detected',
      confidence: 0.98
    },
    {
      id: 'pin-weld-3',
      name: 'Auto-Darkening Helmet #02',
      category: 'safety',
      x: 48.0,
      y: 46.0,
      status: 'operational',
      note: 'DIN 9-13 UV/IR Filter Active',
      confidence: 0.94
    },
    {
      id: 'pin-weld-4',
      name: 'Emergency Fire Blanket Station',
      category: 'safety',
      x: 82.0,
      y: 68.0,
      status: 'operational',
      note: 'Heavy woven glass fiber · Inspected weekly',
      confidence: 0.99
    }
  ],
  'cam-cnc': [
    {
      id: 'pin-cnc-1',
      name: '4-Axis CNC Milling Spindle',
      category: 'machinery',
      x: 48.0,
      y: 50.0,
      status: 'operational',
      note: 'BT40 Taper · 12,000 RPM Max Speed',
      confidence: 0.98
    },
    {
      id: 'pin-cnc-2',
      name: 'E-STOP Emergency Cutoff Button',
      category: 'safety',
      x: 28.0,
      y: 64.0,
      status: 'operational',
      note: 'Dual-circuit safety relay armed',
      confidence: 0.99
    },
    {
      id: 'pin-cnc-3',
      name: 'Digital Readout (DRO) Panel',
      category: 'electronics',
      x: 65.0,
      y: 36.0,
      status: 'operational',
      note: 'Glass scale resolution 0.005mm',
      confidence: 0.96
    },
    {
      id: 'pin-cnc-4',
      name: '16-Slot Tool Carousel',
      category: 'tool',
      x: 76.0,
      y: 48.0,
      status: 'operational',
      note: 'Carbide end mills & face cutters indexed',
      confidence: 0.93
    }
  ],
  'cam-iot-server': [
    {
      id: 'pin-iot-1',
      name: '42U Primary Server Rack Alpha',
      category: 'infrastructure',
      x: 36.0,
      y: 48.0,
      status: 'operational',
      note: '12 Compute Nodes Online · 99.98% Uptime',
      confidence: 0.99
    },
    {
      id: 'pin-iot-2',
      name: 'Cisco 48-Port 10G Fiber Switch',
      category: 'electronics',
      x: 36.0,
      y: 32.0,
      status: 'operational',
      note: 'Port 1-24 Trunked · Zero Packet Drops',
      confidence: 0.97
    },
    {
      id: 'pin-iot-3',
      name: 'APC Smart-UPS 10kVA Bank',
      category: 'infrastructure',
      x: 36.0,
      y: 80.0,
      status: 'operational',
      note: 'Battery capacity 100% · 48 min runtime',
      confidence: 0.98
    },
    {
      id: 'pin-iot-4',
      name: 'Calibrated Temperature & Humidity Sensor',
      category: 'facility',
      x: 68.0,
      y: 24.0,
      status: 'calibrated',
      note: 'Temp: 21.2°C · Humidity: 46% RH',
      confidence: 0.99
    }
  ],
  'cam-robotics': [
    {
      id: 'pin-rob-1',
      name: '6-DOF Articulated Robotic Arm',
      category: 'machinery',
      x: 50.0,
      y: 44.0,
      status: 'operational',
      note: 'Repeatability: ±0.02mm · Payload 10kg',
      confidence: 0.99
    },
    {
      id: 'pin-rob-2',
      name: 'Ergonomic Teach Pendant',
      category: 'electronics',
      x: 24.0,
      y: 66.0,
      status: 'operational',
      note: '3-Position Deadman switch functional',
      confidence: 0.95
    },
    {
      id: 'pin-rob-3',
      name: 'Infrared Safety Light Curtain',
      category: 'safety',
      x: 78.0,
      y: 54.0,
      status: 'operational',
      note: 'Optical beam envelope secure',
      confidence: 0.98
    }
  ],
  'cam-pc-lab-a': [
    {
      id: 'pin-pca-1',
      name: 'Instructor Master PC Console',
      category: 'electronics',
      x: 24.0,
      y: 48.0,
      status: 'operational',
      note: 'Central classroom management host',
      confidence: 0.96
    },
    {
      id: 'pin-pca-2',
      name: 'Overhead 4K Laser Projector',
      category: 'facility',
      x: 50.0,
      y: 18.0,
      status: 'operational',
      note: '5,000 Lumens · Filter hours: 320 / 20,000',
      confidence: 0.98
    },
    {
      id: 'pin-pca-3',
      name: 'Trainee Cluster 1 (8 Workstations)',
      category: 'facility',
      x: 42.0,
      y: 64.0,
      status: 'operational',
      note: 'Intel Core i7 · 32GB RAM · All connected',
      confidence: 0.97
    }
  ],
  'cam-sewing': [
    {
      id: 'pin-sew-1',
      name: 'Juki Industrial Sewing Machine #01',
      category: 'machinery',
      x: 28.0,
      y: 62.0,
      status: 'operational',
      note: '5,500 SPM direct drive motor',
      confidence: 0.97
    },
    {
      id: 'pin-sew-2',
      name: 'Multi-Spool Thread Tower (64 Colors)',
      category: 'tool',
      x: 78.0,
      y: 38.0,
      status: 'operational',
      note: 'Indexed polyester threads complete',
      confidence: 0.95
    },
    {
      id: 'pin-sew-3',
      name: 'Rotary Fabric Cutter Station',
      category: 'tool',
      x: 70.0,
      y: 72.0,
      status: 'operational',
      note: 'Blade safety guard locked in place',
      confidence: 0.96
    }
  ],
  'cam-electrical': [
    {
      id: 'pin-elec-1',
      name: '3-Phase Regulated AC/DC Power Rig',
      category: 'electronics',
      x: 38.0,
      y: 52.0,
      status: 'operational',
      note: '0-415V variable · Overload protected',
      confidence: 0.98
    },
    {
      id: 'pin-elec-2',
      name: 'Digital Storage Oscilloscope 200MHz',
      category: 'electronics',
      x: 56.0,
      y: 48.0,
      status: 'operational',
      note: 'Calibrated ISO-17025 certificate valid',
      confidence: 0.99
    },
    {
      id: 'pin-elec-3',
      name: 'High Voltage Isolation Breaker',
      category: 'safety',
      x: 82.0,
      y: 30.0,
      status: 'operational',
      note: 'RCCB 30mA trip threshold verified',
      confidence: 0.97
    }
  ],
  'cam-turnstile': [
    {
      id: 'pin-turn-1',
      name: 'Optical AI Facial Recognition Tablet',
      category: 'electronics',
      x: 48.0,
      y: 36.0,
      status: 'operational',
      note: '0.2s matching latency · Anti-spoofing enabled',
      confidence: 0.99
    },
    {
      id: 'pin-turn-2',
      name: 'RFID Contactless Card Reader',
      category: 'electronics',
      x: 34.0,
      y: 54.0,
      status: 'operational',
      note: 'NFC ISO 14443A standard',
      confidence: 0.96
    },
    {
      id: 'pin-turn-3',
      name: 'Emergency Gate Break-Glass Switch',
      category: 'safety',
      x: 72.0,
      y: 44.0,
      status: 'operational',
      note: 'Instant bypass release for egress',
      confidence: 0.99
    }
  ],
  'cam-storage': [
    {
      id: 'pin-stor-1',
      name: 'Mitutoyo Digital Micrometer Set',
      category: 'tool',
      x: 32.0,
      y: 42.0,
      status: 'calibrated',
      note: 'Accuracy: ±0.001mm · In protective case',
      confidence: 0.97
    },
    {
      id: 'pin-stor-2',
      name: 'Industrial Torque Wrench #TW-09',
      category: 'tool',
      x: 58.0,
      y: 40.0,
      status: 'missing',
      note: 'Tool checked out to Bay 2 · Past due return',
      confidence: 0.93
    },
    {
      id: 'pin-stor-3',
      name: 'UV Eyewear Sterilizer Cabinet',
      category: 'safety',
      x: 20.0,
      y: 65.0,
      status: 'operational',
      note: '30 Safety goggles sanitized & certified',
      confidence: 0.96
    }
  ],
  'cam-safety-station': [
    {
      id: 'pin-safe-1',
      name: 'ABC Dry Powder 6KG Extinguisher',
      category: 'safety',
      x: 30.0,
      y: 46.0,
      status: 'operational',
      note: 'Pressure in green zone · Inspected March 2026',
      confidence: 0.99
    },
    {
      id: 'pin-safe-2',
      name: 'Emergency Eye-Wash & Drench Shower',
      category: 'safety',
      x: 65.0,
      y: 42.0,
      status: 'operational',
      note: 'Weekly flush test passed · Clean flow',
      confidence: 0.98
    },
    {
      id: 'pin-safe-3',
      name: 'Wall-Mounted Industrial First Aid Kit',
      category: 'safety',
      x: 48.0,
      y: 38.0,
      status: 'operational',
      note: 'ANSI Type II class A trauma supplies complete',
      confidence: 0.97
    }
  ],
  'cam-automotive': [
    {
      id: 'pin-auto-1',
      name: '2-Post Hydraulic Lift 4.5T',
      category: 'machinery',
      x: 45.0,
      y: 48.0,
      status: 'operational',
      note: 'Dual safety arm locks engaged',
      confidence: 0.98
    },
    {
      id: 'pin-auto-2',
      name: 'OBD-II Wireless Diagnostic Scanner',
      category: 'electronics',
      x: 26.0,
      y: 62.0,
      status: 'operational',
      note: 'Live CAN-bus telemetry link active',
      confidence: 0.96
    },
    {
      id: 'pin-auto-3',
      name: 'Pneumatic Air Impact Reel',
      category: 'tool',
      x: 70.0,
      y: 52.0,
      status: 'operational',
      note: 'Operating pressure: 90 PSI regulated',
      confidence: 0.95
    }
  ],
  'cam-drone-bay': [
    {
      id: 'pin-drn-1',
      name: 'Hexacopter Training Drone Hub',
      category: 'machinery',
      x: 48.0,
      y: 52.0,
      status: 'operational',
      note: 'RTK positioning telemetry calibrated',
      confidence: 0.98
    },
    {
      id: 'pin-drn-2',
      name: 'Fireproof LiPo Charging Bunker',
      category: 'safety',
      x: 22.0,
      y: 65.0,
      status: 'operational',
      note: 'Balance charge mode active · Thermal cutoff',
      confidence: 0.99
    },
    {
      id: 'pin-drn-3',
      name: 'Lidar Calibration Optical Marker',
      category: 'infrastructure',
      x: 76.0,
      y: 40.0,
      status: 'calibrated',
      note: 'Target reflectivity 92% calibrated',
      confidence: 0.97
    }
  ]
};

const STUDENTS_ROSTER = [
  { name: 'Alex Chen', status: 'PRESENT', x: 64.0, y: 72.0, roll: 'TN-101' },
  { name: 'Sarah Jenkins', status: 'PRESENT', x: 21.0, y: 58.0, roll: 'TN-102' },
  { name: 'David Miller', status: 'PRESENT', x: 45.0, y: 52.0, roll: 'TN-103' },
  { name: 'Michael Chang', status: 'PRESENT', x: 31.0, y: 62.0, roll: 'TN-104' },
  { name: 'Jessica Taylor', status: 'PRESENT', x: 35.0, y: 48.0, roll: 'TN-105' },
  { name: 'Lisa Wong', status: 'PRESENT', statusNote: 'Desk 4', x: 18.0, y: 46.0, roll: 'TN-106' },
  { name: 'James Wilson', status: 'PRESENT', statusNote: 'Desk 7', x: 83.0, y: 76.0, roll: 'TN-107' },
  { name: 'Emily Watson', status: 'ABSENT', statusNote: 'Approved Leave', x: 53.0, y: 42.0, roll: 'TN-108' },
  { name: 'Robert Fox', status: 'ABSENT', statusNote: 'Medical Leave', x: null, y: null, roll: 'TN-109' },
  { name: 'Amanda Ross', status: 'MISSING', statusNote: 'Unauthorized', x: 76.0, y: 46.0, roll: 'TN-110' },
];

export const PrecisionCameraViewer: React.FC = () => {
  const { pinpointTarget, setPinpointTarget, setGeminiAssistantOpen } = useApp();
  const [activeCamId, setActiveCamId] = useState('cam-factory');
  const [sectorFilter, setSectorFilter] = useState<'all' | 'workshops' | 'academics' | 'electrical_iot' | 'security_facilities'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // High precision pinpoints state per camera
  const [pinpointsByCam, setPinpointsByCam] = useState<Record<string, PinpointTarget[]>>(() => {
    try {
      const stored = localStorage.getItem('applet_camera_pinpoints');
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_CAMERA_PINPOINTS, ...parsed };
      }
    } catch (e) {
      // fallback
    }
    return DEFAULT_CAMERA_PINPOINTS;
  });

  // Active target locked on screen
  const [activeTarget, setActiveTarget] = useState<PinpointTarget | null>({
    id: 'pin-fact-1',
    name: 'Soldering Station #2 (MISSING)',
    category: 'tool',
    x: 74.0,
    y: 44.0,
    status: 'missing',
    note: 'Workbench #4 (Station 24) · David Miller'
  });

  // Interactive Click-to-Pin Mode
  const [isDropPinMode, setIsDropPinMode] = useState(false);
  const [mouseCoords, setMouseCoords] = useState<{ x: number; y: number; pxX: number; pxY: number } | null>(null);
  const [pendingPin, setPendingPin] = useState<{ x: number; y: number } | null>(null);
  const [newPinName, setNewPinName] = useState('');
  const [newPinCategory, setNewPinCategory] = useState<PinpointTarget['category']>('tool');
  const [newPinStatus, setNewPinStatus] = useState<string>('operational');
  const [newPinNote, setNewPinNote] = useState('');

  // Selected Pinpoint in Inspector
  const [inspectedPin, setInspectedPin] = useState<PinpointTarget | null>(null);

  // Layer filter settings
  const [showAllPins, setShowAllPins] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'missing' | 'tool' | 'electronics' | 'safety' | 'student'>('all');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<InspectionAuditResult>(DEFAULT_INSPECTION_AUDIT);
  const [snapshotToast, setSnapshotToast] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Feed Mode: 'image' (authentic high-definition CCTV snapshot) | 'video' (motion stream)
  const [streamMode, setStreamMode] = useState<'image' | 'video'>('image');
  const [videoHasError, setVideoHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Exact real-time CCTV clock running synchronously by current user computer time
  const cctvClock = useLiveCctvClock(1000);

  // Persist pinpoints to localStorage
  const savePinpoints = (updated: Record<string, PinpointTarget[]>) => {
    setPinpointsByCam(updated);
    try {
      localStorage.setItem('applet_camera_pinpoints', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save pinpoints', e);
    }
  };

  // Sync external pinpoint commands from Gemini Copilot instantly
  useEffect(() => {
    if (pinpointTarget) {
      setActiveTarget(pinpointTarget);
      if (pinpointTarget.camId) {
        setActiveCamId(pinpointTarget.camId);
      } else if (pinpointTarget.name.toLowerCase().includes('soldering') || pinpointTarget.name.toLowerCase().includes('scanner')) {
        setActiveCamId('cam-factory');
      } else if (pinpointTarget.name.toLowerCase().includes('weld')) {
        setActiveCamId('cam-welding');
      } else if (pinpointTarget.name.toLowerCase().includes('cnc') || pinpointTarget.name.toLowerCase().includes('spindle')) {
        setActiveCamId('cam-cnc');
      } else if (pinpointTarget.name.toLowerCase().includes('server') || pinpointTarget.name.toLowerCase().includes('switch')) {
        setActiveCamId('cam-iot-server');
      }
      containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [pinpointTarget]);

  const activeCam = CAMERAS.find(c => c.id === activeCamId) || CAMERAS[0];

  // Current camera's pinpoints
  const currentCameraPins = pinpointsByCam[activeCamId] || [];

  // Filtered pins
  const visiblePins = currentCameraPins.filter(pin => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'missing') return pin.status === 'missing' || pin.status === 'absent';
    return pin.category === categoryFilter;
  });

  // Handle camera switch
  const handleSelectCamera = (camId: string) => {
    setActiveCamId(camId);
    setInspectedPin(null);
    setVideoHasError(false);
    setZoomLevel(1);
    const pins = pinpointsByCam[camId] || [];
    if (pins.length > 0) {
      // Pick first or a missing pin
      const missingPin = pins.find(p => p.status === 'missing');
      setActiveTarget(missingPin || pins[0]);
    } else {
      setActiveTarget(null);
    }
  };

  // Handle Mouse Move over Camera Frame for coordinate telemetry
  const handleMouseMoveOverFrame = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pxX = Math.round(e.clientX - rect.left);
    const pxY = Math.round(e.clientY - rect.top);
    const rawX = (pxX / rect.width) * 100;
    const rawY = (pxY / rect.height) * 100;
    const x = parseFloat(Math.max(0, Math.min(100, rawX)).toFixed(1));
    const y = parseFloat(Math.max(0, Math.min(100, rawY)).toFixed(1));
    setMouseCoords({ x, y, pxX, pxY });
  };

  const handleMouseLeaveFrame = () => {
    setMouseCoords(null);
  };

  // Handle Click on Camera Feed (When Drop Pin Mode is active)
  const handleFeedClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDropPinMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((e.clientX - rect.left) / rect.width) * 100;
    const rawY = ((e.clientY - rect.top) / rect.height) * 100;
    const x = parseFloat(Math.max(1, Math.min(99, rawX)).toFixed(1));
    const y = parseFloat(Math.max(1, Math.min(99, rawY)).toFixed(1));

    setPendingPin({ x, y });
    setNewPinName('');
    setNewPinNote('');
    setNewPinCategory('tool');
    setNewPinStatus('operational');
  };

  // Save new pinpoint
  const handleSavePendingPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingPin || !newPinName.trim()) return;

    const newTarget: PinpointTarget = {
      id: `pin-${Date.now()}`,
      name: newPinName.trim(),
      category: newPinCategory,
      x: pendingPin.x,
      y: pendingPin.y,
      status: newPinStatus,
      camId: activeCamId,
      note: newPinNote.trim() || undefined,
      confidence: 0.99,
      timestamp: cctvClock.timeString
    };

    const updated = {
      ...pinpointsByCam,
      [activeCamId]: [...(pinpointsByCam[activeCamId] || []), newTarget]
    };
    savePinpoints(updated);
    setActiveTarget(newTarget);
    setInspectedPin(newTarget);
    setPendingPin(null);
    setIsDropPinMode(false);
    setSnapshotToast(`✓ Pinpoint successfully locked for "${newTarget.name}" at (${newTarget.x}%, ${newTarget.y}%)`);
    setTimeout(() => setSnapshotToast(null), 3000);
  };

  // Nudge / Fine-tune Pinpoint Coordinates
  const handleNudgePin = (deltaX: number, deltaY: number) => {
    if (!inspectedPin) return;
    const newX = parseFloat(Math.max(1, Math.min(99, inspectedPin.x + deltaX)).toFixed(1));
    const newY = parseFloat(Math.max(1, Math.min(99, inspectedPin.y + deltaY)).toFixed(1));

    const updatedPin = { ...inspectedPin, x: newX, y: newY };
    setInspectedPin(updatedPin);
    setActiveTarget(updatedPin);

    const updatedList = (pinpointsByCam[activeCamId] || []).map(p =>
      p.id === inspectedPin.id || (p.name === inspectedPin.name && p.x === inspectedPin.x && p.y === inspectedPin.y)
        ? updatedPin
        : p
    );
    savePinpoints({ ...pinpointsByCam, [activeCamId]: updatedList });
  };

  // Delete Pinpoint
  const handleDeletePin = (pinToDelete: PinpointTarget) => {
    const updatedList = (pinpointsByCam[activeCamId] || []).filter(p =>
      p.id ? p.id !== pinToDelete.id : p.name !== pinToDelete.name
    );
    savePinpoints({ ...pinpointsByCam, [activeCamId]: updatedList });
    if (inspectedPin?.id === pinToDelete.id) setInspectedPin(null);
    if (activeTarget?.name === pinToDelete.name) setActiveTarget(null);
    setSnapshotToast(`Deleted pinpoint: ${pinToDelete.name}`);
    setTimeout(() => setSnapshotToast(null), 2500);
  };

  // Quick Find Student
  const handleQuickPinpointStudent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentName = e.target.value;
    if (!studentName) {
      setActiveTarget(null);
      return;
    }
    const student = STUDENTS_ROSTER.find(s => s.name === studentName);
    if (student) {
      setActiveCamId('cam-classroom');
      if (student.x !== null && student.y !== null) {
        const target: PinpointTarget = {
          name: `${student.name} (${student.status})`,
          category: 'student',
          x: student.x,
          y: student.y,
          status: student.status,
          note: student.roll
        };
        setActiveTarget(target);
        setInspectedPin(target);
      }
    }
  };

  // Universal Search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();

    // Check across all cameras' pinpoints
    for (const [camId, pins] of Object.entries(pinpointsByCam)) {
      const match = pins.find(p => p.name.toLowerCase().includes(query) || (p.note && p.note.toLowerCase().includes(query)));
      if (match) {
        setActiveCamId(camId);
        setActiveTarget(match);
        setInspectedPin(match);
        setSearchQuery('');
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    // Check student roster
    const studentMatch = STUDENTS_ROSTER.find(s => s.name.toLowerCase().includes(query) || s.roll.toLowerCase().includes(query));
    if (studentMatch && studentMatch.x !== null && studentMatch.y !== null) {
      setActiveCamId('cam-classroom');
      const target: PinpointTarget = {
        name: `${studentMatch.name} (${studentMatch.status})`,
        category: 'student',
        x: studentMatch.x,
        y: studentMatch.y,
        status: studentMatch.status,
        note: studentMatch.roll
      };
      setActiveTarget(target);
      setInspectedPin(target);
      setSearchQuery('');
      return;
    }

    // Fallback placement at center of current frame
    const fallbackTarget: PinpointTarget = {
      name: searchQuery,
      category: 'tool',
      x: 50.0,
      y: 50.0,
      status: 'operational',
      note: 'Optical Search Result'
    };
    setActiveTarget(fallbackTarget);
    setInspectedPin(fallbackTarget);
  };

  // Instant snapshot capture
  const handleCaptureSnapshot = () => {
    setSnapshotToast(`✓ Calibrated CCTV Frame captured at ${cctvClock.cctvOsdString}. Logged in tamper-proof surveillance cache.`);
    setTimeout(() => setSnapshotToast(null), 3000);
  };

  // Instant AI room audit
  const handleRunAiAudit = async () => {
    setIsAuditing(true);
    setShowAuditModal(true);
    try {
      const result = await generateRoomAuditWithGemini({
        cameraName: activeCam.name,
        centreName: 'Surveillance Hub & Skill Centre',
        roomName: activeCam.subtitle || activeCam.name,
        presentStudents: ['Alex Chen', 'Sarah Jenkins', 'David Miller', 'Michael Chang', 'Jessica Taylor', 'Lisa Wong', 'James Wilson'],
        absentStudents: ['Emily Watson', 'Robert Fox'],
        missingStudents: ['Amanda Ross']
      });
      setAuditResult(result);
    } catch (e) {
      console.warn('Audit error:', e);
    } finally {
      setIsAuditing(false);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Filtered camera tabs list
  const filteredCameras = sectorFilter === 'all'
    ? CAMERAS
    : CAMERAS.filter(c => c.sector === sectorFilter);

  // Status-based Pinpoint Colors
  const getPinColor = (pin: PinpointTarget) => {
    if (pin.status === 'missing' || pin.status === 'absent') return {
      border: 'border-red-500',
      bg: 'bg-red-500/20',
      badge: 'bg-red-600 text-white',
      glow: 'shadow-[0_0_15px_rgba(239,68,68,0.7)]',
      text: 'text-red-400'
    };
    if (pin.category === 'safety') return {
      border: 'border-amber-400',
      bg: 'bg-amber-500/20',
      badge: 'bg-amber-600 text-white',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]',
      text: 'text-amber-300'
    };
    if (pin.category === 'student') return {
      border: 'border-emerald-400',
      bg: 'bg-emerald-500/20',
      badge: 'bg-emerald-600 text-white',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]',
      text: 'text-emerald-300'
    };
    return {
      border: 'border-cyan-400',
      bg: 'bg-cyan-500/20',
      badge: 'bg-cyan-600 text-white',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.6)]',
      text: 'text-cyan-300'
    };
  };

  return (
    <div className="space-y-4">
      {/* 1. CAMERA SECTOR AND STREAM SWITCHER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-600/10 dark:bg-red-950/60 text-red-600 border border-red-500/20 flex items-center justify-center font-bold shrink-0">
              <CameraIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Live CCTV Surveillance & Pinpoint Station
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white animate-pulse">
                  ● 18 LIVE SECTIONS
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activeCam.resolution} · {activeCam.fps} FPS · {activeCam.latencyMs}ms
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeCam.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Pinpoint Student Dropdown */}
            <div className="relative min-w-[210px]">
              <Crosshair className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                onChange={handleQuickPinpointStudent}
                defaultValue=""
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl pl-8 pr-7 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer active:scale-95 duration-75"
              >
                <option value="">Quick Pinpoint Student...</option>
                {STUDENTS_ROSTER.map(student => (
                  <option key={student.name} value={student.name}>
                    {student.name} ({student.status})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* AI Assistant Hook */}
            <button
              onClick={() => setGeminiAssistantOpen(true)}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 duration-75 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>

        {/* Sector Filter Tabs */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 shrink-0">
            Sector Filter:
          </span>
          {[
            { id: 'all', label: `All 18 Feeds (${CAMERAS.length})` },
            { id: 'workshops', label: `🏭 Workshops & CNC (${CAMERAS.filter(c => c.sector === 'workshops').length})` },
            { id: 'academics', label: `👥 Academics & Classrooms (${CAMERAS.filter(c => c.sector === 'academics').length})` },
            { id: 'electrical_iot', label: `⚡ Electrical & Cloud IoT (${CAMERAS.filter(c => c.sector === 'electrical_iot').length})` },
            { id: 'security_facilities', label: `🛡️ Security & Facilities (${CAMERAS.filter(c => c.sector === 'security_facilities').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSectorFilter(tab.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                sectorFilter === tab.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Camera Selector Buttons (All 18 live camera sections) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3 overflow-y-auto max-h-44 p-1">
          {filteredCameras.map((cam, idx) => {
            const isSelected = activeCamId === cam.id;
            const pins = pinpointsByCam[cam.id] || [];
            const missingCount = pins.filter(p => p.status === 'missing' || p.status === 'absent').length;

            return (
              <button
                key={cam.id}
                onClick={() => handleSelectCamera(cam.id)}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer active:scale-95 duration-75 border relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-500/30'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold truncate opacity-90">
                      SEC #{idx + 1}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white animate-pulse' : 'bg-emerald-500'}`} />
                  </div>
                  <div className="text-xs font-bold truncate leading-tight">
                    {cam.name.replace(/^[^\s]+\s/, '')}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-black/10 dark:border-white/10 text-[10px] font-mono">
                  <span className="opacity-80">{pins.length} Pins</span>
                  {missingCount > 0 ? (
                    <span className={`px-1 py-0.2 rounded font-bold ${
                      isSelected ? 'bg-red-950 text-red-200' : 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                    }`}>
                      {missingCount} Alert
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold">OK</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PINPOINT CONTROLS TOOLBAR & INTERACTIVE DROP PIN MODE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  PRECISION OBJECT PINPOINTS
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-mono">
                  {currentCameraPins.length} PINPOINTS ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Click any pinpoint to inspect, center or recalibrate. Click "Drop New Pinpoint" to pin any object directly on video.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode: Drop New Pinpoint */}
            <button
              onClick={() => {
                setIsDropPinMode(!isDropPinMode);
                setPendingPin(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95 duration-75 ${
                isDropPinMode
                  ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-400/50 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isDropPinMode ? 'Exit Pin Placement Mode' : '+ Drop New Pinpoint'}</span>
            </button>

            {/* Quick Pinpoint Filters */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'missing', label: '⚠️ Alerts' },
                { id: 'tool', label: 'Tools' },
                { id: 'electronics', label: 'Rigs' },
                { id: 'safety', label: 'Safety' },
                { id: 'student', label: 'Trainees' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setCategoryFilter(f.id as any)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    categoryFilter === f.id
                      ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-cyan-300 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search bar + Submit */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 18 camera feeds (e.g. Soldering Station, Oscilloscope, Alex Chen, Argon Tank, CNC)..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 duration-75 shrink-0 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Lock On Reticle</span>
          </button>
        </form>

        {/* Active Target Banner and Sub-pixel readout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700 dark:text-slate-300">Active Reticle Lock:</span>
            {activeTarget ? (
              <span className="font-semibold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block animate-ping" />
                {activeTarget.name}
                <span className="text-slate-400 text-[11px]">
                  (X: {activeTarget.x}%, Y: {activeTarget.y}%)
                </span>
                {activeTarget.status && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded uppercase font-bold ${
                    activeTarget.status === 'missing' || activeTarget.status === 'absent'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                  }`}>
                    {activeTarget.status}
                  </span>
                )}
              </span>
            ) : (
              <span className="text-slate-400 font-mono">No target locked · Click any object below or on camera feed</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTarget && (
              <button
                onClick={() => {
                  setActiveTarget(null);
                  setInspectedPin(null);
                }}
                className="text-xs text-blue-600 dark:text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Clear Lock
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Snapshot Toast notification */}
      {snapshotToast && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in shadow-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{snapshotToast}</span>
        </div>
      )}

      {/* DROP PIN ACTIVE BANNER */}
      {isDropPinMode && (
        <div className="bg-amber-500/10 dark:bg-amber-950/40 border-2 border-dashed border-amber-500 text-amber-900 dark:text-amber-200 p-3 rounded-2xl text-xs flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2.5">
            <Crosshair className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <p className="font-bold">
                🎯 Interactive Pin Placement Mode Active
              </p>
              <p className="text-[11px] opacity-90">
                Click anywhere on the camera video frame to drop a precision pinpoint at exact optical coordinates.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDropPinMode(false)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 3. MAIN CCTV SCREEN WITH INTERACTIVE OBJECT PINPOINTS */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMoveOverFrame}
        onMouseLeave={handleMouseLeaveFrame}
        onClick={handleFeedClick}
        className={`relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800 select-none group ${
          isDropPinMode ? 'cursor-crosshair' : 'cursor-default'
        }`}
      >
        {/* Render either authentic high-res CCTV image or live video */}
        {activeCam.type === 'image' ? (
          <img
            src={activeCam.url}
            alt={activeCam.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            src={activeCam.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* TOP CCTV ON-SCREEN DISPLAY (OSD) HUD OVERLAY */}
        <div className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between text-xs font-mono text-white z-20 pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
            <span className="font-bold tracking-wider text-red-400">● LIVE</span>
            <span className="text-slate-400">|</span>
            <span className="font-bold tracking-wide text-white drop-shadow">
              {cctvClock.cctvOsdString}
            </span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-cyan-300 font-semibold hidden md:inline uppercase truncate max-w-xs">
              {activeCam.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {mouseCoords && (
              <span className="bg-black/80 px-2 py-0.5 rounded border border-cyan-500/50 text-[10px] text-cyan-300 font-mono">
                X: {mouseCoords.x}% Y: {mouseCoords.y}% [{mouseCoords.pxX},{mouseCoords.pxY}px]
              </span>
            )}
            <span className="font-bold text-emerald-400 drop-shadow hidden sm:inline">
              {activeCam.fps} FPS · {activeCam.resolution}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE WORKING OBJECT PINPOINTS LAYER FOR THE CURRENT CAMERA SECTION */}
        {/* ========================================================================= */}
        {showAllPins && visiblePins.map((pin) => {
          const colors = getPinColor(pin);
          const isSelected = activeTarget?.name === pin.name || inspectedPin?.id === pin.id;

          return (
            <div
              key={pin.id || `${pin.name}-${pin.x}-${pin.y}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveTarget(pin);
                setInspectedPin(pin);
              }}
              style={{
                left: `${pin.x}%`,
                top: `${pin.y}%`,
                width: pin.width ? `${pin.width}%` : 'auto',
                height: pin.height ? `${pin.height}%` : 'auto'
              }}
              className={`absolute transition-all duration-150 z-15 ${
                pin.width && pin.height
                  ? `border-2 ${colors.border} ${colors.bg} rounded pointer-events-auto cursor-pointer ${colors.glow} ${
                      isSelected ? 'ring-2 ring-white scale-[1.02]' : ''
                    }`
                  : `-translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer p-1`
              }`}
            >
              {/* Point Reticle or Box Header */}
              {!(pin.width && pin.height) && (
                <div className="relative group/pin">
                  {/* Outer pulsating reticle circle */}
                  <div className={`w-8 h-8 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center ${colors.glow} transition-transform group-hover/pin:scale-125`}>
                    <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute -inset-1 pointer-events-none">
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colors.border}`} />
                    <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${colors.border}`} />
                    <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${colors.border}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colors.border}`} />
                  </div>
                </div>
              )}

              {/* Pinpoint Label Tag */}
              <div
                className={`absolute left-0 whitespace-nowrap z-20 pointer-events-auto shadow-lg transition-transform ${
                  pin.y > 80 ? 'bottom-full mb-1' : '-top-7'
                }`}
              >
                <div className={`${colors.badge} font-mono text-[9px] px-2 py-0.5 rounded font-bold flex items-center gap-1 shadow-md border border-white/20`}>
                  {pin.status === 'missing' && <span>⚠️</span>}
                  <span>{pin.name}</span>
                  {pin.confidence && (
                    <span className="opacity-75 text-[8px]">
                      {Math.round(pin.confidence * 100)}%
                    </span>
                  )}
                </div>

                {pin.note && (
                  <div className="bg-black/90 text-slate-300 font-mono text-[8px] px-1.5 py-0.5 rounded mt-0.5 border border-white/10 max-w-[200px] truncate">
                    {pin.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* DYNAMIC OPTICAL TARGET RETICLE OVERLAY (LOCKED TARGET) */}
        {activeTarget && (
          <div
            style={{
              left: `${activeTarget.x}%`,
              top: `${activeTarget.y}%`
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-25 transition-all duration-200"
          >
            {/* Corner Bracket Reticle */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-0.5 bg-cyan-400" />
                <div className="h-3 w-0.5 bg-cyan-400 absolute" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
              </div>
            </div>

            {/* Coordinate Telemetry Badge */}
            <div className="absolute top-full right-0 mt-1 bg-black/95 border border-cyan-500/70 rounded-md px-2 py-0.5 text-[9px] font-mono text-cyan-300 shadow-xl whitespace-nowrap">
              <span>X: {activeTarget.x}% · Y: {activeTarget.y}%</span>
            </div>
          </div>
        )}

        {/* BOTTOM CAMERA CONTROLS BAR */}
        <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAllPins(!showAllPins)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer active:scale-95 duration-75 ${
                showAllPins
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-black/60 text-white/90 border-white/20 hover:bg-black/80'
              }`}
            >
              {showAllPins ? '✓ Pinpoints Visible' : 'Show All Pinpoints'}
            </button>

            <button
              onClick={handleCaptureSnapshot}
              className="p-2 bg-black/60 hover:bg-black/80 text-white border border-white/20 rounded-lg transition-all cursor-pointer active:scale-95 duration-75"
              title="Capture Instant Frame Snapshot"
            >
              <CameraIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAiAudit}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md border border-blue-400 transition-all active:scale-95 duration-75 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>AI Inspection Audit</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-black/60 hover:bg-black/80 text-white border border-white/20 rounded-lg transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. PINPOINT INSPECTOR & MICRO-CALIBRATION PANEL */}
      {inspectedPin && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white shadow-lg animate-in fade-in space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                <Crosshair className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">
                    {inspectedPin.name}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                    {inspectedPin.category}
                  </span>
                  {inspectedPin.status && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      inspectedPin.status === 'missing' || inspectedPin.status === 'absent'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {inspectedPin.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {inspectedPin.note || 'No identifier note attached'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                X: <strong>{inspectedPin.x}%</strong> | Y: <strong>{inspectedPin.y}%</strong>
              </span>

              <button
                onClick={() => handleDeletePin(inspectedPin)}
                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                title="Delete Pinpoint"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setInspectedPin(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Micro-Adjustment Calibration Nudge Keys */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-semibold">Sub-Pixel Coordinate Calibration:</span>
              <span className="text-slate-400 text-[11px]">Nudge to pin object at 100% accurate position:</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNudgePin(-0.5, 0)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 text-xs font-mono font-bold flex items-center gap-0.5 active:scale-95 duration-75 cursor-pointer"
                title="Nudge Left"
              >
                <ArrowLeft className="w-3 h-3" /> <span>-0.5%</span>
              </button>
              <button
                onClick={() => handleNudgePin(0.5, 0)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 text-xs font-mono font-bold flex items-center gap-0.5 active:scale-95 duration-75 cursor-pointer"
                title="Nudge Right"
              >
                <span>+0.5%</span> <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => handleNudgePin(0, -0.5)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 text-xs font-mono font-bold flex items-center gap-0.5 active:scale-95 duration-75 cursor-pointer"
                title="Nudge Up"
              >
                <ArrowUp className="w-3 h-3" /> <span>-0.5%</span>
              </button>
              <button
                onClick={() => handleNudgePin(0, 0.5)}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded border border-slate-700 text-xs font-mono font-bold flex items-center gap-0.5 active:scale-95 duration-75 cursor-pointer"
                title="Nudge Down"
              >
                <ArrowDown className="w-3 h-3" /> <span>+0.5%</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD PINPOINT MODAL DIALOG (When user clicked on camera feed in Drop Pin Mode) */}
      {pendingPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Add Accurate Pinpoint on Camera
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                    Coordinates: X: {pendingPin.x}% · Y: {pendingPin.y}%
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPendingPin(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePendingPin} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Object / Equipment Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPinName}
                  onChange={(e) => setNewPinName(e.target.value)}
                  placeholder="e.g. Soldering Iron #3, Oscilloscope, Fire Extinguisher..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoFocus
                />

                {/* Quick suggestion tags */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Quick Suggestions:</span>
                  {[
                    'Soldering Iron',
                    'Oscilloscope',
                    'Digital Multimeter',
                    'Fire Extinguisher',
                    'Safety Helmet',
                    'E-STOP Switch',
                    'Server Blade',
                    'Trainee Desk'
                  ].map(sug => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setNewPinName(sug)}
                      className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newPinCategory}
                    onChange={(e) => setNewPinCategory(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="tool">Tool / Hand Tool</option>
                    <option value="electronics">Electronics / Instrument</option>
                    <option value="machinery">Machinery / CNC</option>
                    <option value="safety">Safety Equipment</option>
                    <option value="facility">Facility / Furniture</option>
                    <option value="infrastructure">IT Infrastructure</option>
                    <option value="student">Student / Trainee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Object Status
                  </label>
                  <select
                    value={newPinStatus}
                    onChange={(e) => setNewPinStatus(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                  >
                    <option value="operational">Operational (In Place)</option>
                    <option value="missing">⚠️ Missing / Alert</option>
                    <option value="calibrated">Calibrated (Verified)</option>
                    <option value="maintenance">Needs Maintenance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Location Note / Serial Identifier
                </label>
                <input
                  type="text"
                  value={newPinNote}
                  onChange={(e) => setNewPinNote(e.target.value)}
                  placeholder="e.g. Workbench 4, Bay 2, Rack Slot 12..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPendingPin(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95 duration-75 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Pinpoint to Feed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. AI ROOM & INSPECTION AUDIT MODAL */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                    AI Room & Inspection Audit
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5 font-mono">
                    <span>Powered by {auditResult.model} ({auditResult.engine})</span>
                    <span>·</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase text-[9px] bg-emerald-50 dark:bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                      VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-slate-950/60">
              {isAuditing ? (
                <div className="py-12 text-center space-y-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Gemini 3.8 Flash is analyzing live camera telemetry & equipment racks...
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-base">📹</span>
                      <span>Camera Feed Observation</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {auditResult.cameraObservation}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-base">👥</span>
                      <span>Attendance Check (Who is Present vs Absent)</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
                      <p>
                        - <strong className="text-slate-800 dark:text-slate-200">Present ({auditResult.attendanceCheck.presentCount} people)</strong>: {auditResult.attendanceCheck.presentSummary}
                      </p>
                      <p>
                        - <strong className="text-slate-800 dark:text-slate-200">Absent ({auditResult.attendanceCheck.absentCount} people)</strong>: {auditResult.attendanceCheck.absentList}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-base">🔍</span>
                      <span>Equipment Inventory Status (Are Any Devices Missing?)</span>
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          - Missing / In Use ({auditResult.inventoryStatus.missingOrInUse.length} items):
                        </p>
                        <ol className="list-decimal pl-5 space-y-1 mt-1">
                          {auditResult.inventoryStatus.missingOrInUse.map((item, idx) => (
                            <li key={idx}>
                              <strong className="text-slate-800 dark:text-slate-200">{item.name}</strong> — {item.location} {item.assignedTo ? `(${item.assignedTo})` : ''}.
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          - In Place ({auditResult.inventoryStatus.inPlace.length} items):
                        </p>
                        <ul className="list-disc pl-5 space-y-0.5 mt-1 text-[11px]">
                          {auditResult.inventoryStatus.inPlace.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-base">💡</span>
                      <span>Simple Recommendations for Manager</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                      {auditResult.managerRecommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                Audit timestamp: {auditResult.verifiedAt}
              </span>
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
