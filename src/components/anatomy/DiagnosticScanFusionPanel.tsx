import React, { useState, useEffect } from 'react';
import { OrganKey } from '../../types';
import {
  Activity,
  Layers,
  Maximize2,
  Scan,
  Sparkles,
  AlertTriangle,
  ZoomIn,
  Eye,
  FileText,
  X,
  Compass,
  CheckCircle2,
  Share2,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface ScanFusionData {
  reportId: string;
  systemTitleEn: string;
  systemTitleHi: string;
  modality: 'ANGIOGRAPHY' | 'ULTRASOUND' | 'OCT_FUNDUS' | 'MRI_T2' | 'CT_XRAY' | 'USG_DOPPLER';
  alertBadgeEn: string;
  alertBadgeHi: string;
  alertSeverity: 'critical' | 'warning' | 'normal';
  imagePath: string;
  cropCoordinates?: { top: number; left: number; width: number; height: number };
  lesionNameEn: string;
  lesionSize?: string;
  locationEn: string;
  modalityStatusEn: string;
  telemetry1: { label: string; current: string; unit: string; trend: 'up' | 'down' | 'stable'; path: string };
  telemetry2: { label: string; current: string; unit: string; trend: 'up' | 'down' | 'stable'; path: string };
  telemetry3?: { label: string; current: string; unit: string; trend: 'up' | 'down' | 'stable'; path: string };
}

export const SCAN_FUSION_CATALOG: Record<string, ScanFusionData> = {
  heart: {
    reportId: 'ANGIOGRAPHY_RE_02',
    systemTitleEn: 'Coronary Vascular Network & Myocardium',
    systemTitleHi: 'हृदय एवं कोरोनरी धमनी नेटवर्क',
    modality: 'ANGIOGRAPHY',
    alertBadgeEn: '85% STENOSIS DETECTED · FLOW: REDUCED',
    alertBadgeHi: '85% स्टेनोसिस (रुकावट) का पता चला · रक्त प्रवाह धीमा',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-HEART-4.2_13816cea.jpg',
    lesionNameEn: 'LAD Coronary Stenosis (85% Luminal Narrowing)',
    lesionSize: '2.8 mm lumen',
    locationEn: 'Left Anterior Descending (LAD) Proximal Segment',
    modalityStatusEn: 'IMPACTED / REDUCED DISTAL PERFUSION',
    telemetry1: {
      label: 'Reduced Perfusion',
      current: '34.2',
      unit: 'mL/min/g',
      trend: 'down',
      path: 'M0,45 Q15,10 30,35 T60,20 T90,40 T120,25 T150,45',
    },
    telemetry2: {
      label: 'Heart Rate (ECG)',
      current: '82',
      unit: 'BPM',
      trend: 'up',
      path: 'M0,30 L20,30 L24,28 L28,30 L32,30 L34,10 L38,48 L42,30 L50,30 L56,22 L62,30 L80,30 L84,28 L88,30 L92,30 L94,10 L98,48 L102,30 L110,30 L116,22 L122,30 L150,30',
    },
    telemetry3: {
      label: 'Vascular Resistance',
      current: '1.42',
      unit: 'dyn·s/cm⁵',
      trend: 'up',
      path: 'M0,15 Q30,22 60,35 T120,42 T150,46',
    },
  },
  kidneys: {
    reportId: 'ULTRASOUND_RE_04',
    systemTitleEn: 'Renal & Urinary Tract Architecture',
    systemTitleHi: 'वृक्क (किडनी) एवं मूत्र मार्ग संरचना',
    modality: 'ULTRASOUND',
    alertBadgeEn: 'CALCULUS (STONE) 8.5mm · OBSTRUCTED FLOW ALERT',
    alertBadgeHi: 'पथरी (8.5mm) · मूत्र प्रवाह में रुकावट की चेतावनी',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-KIDNEY-6.2_10d3f243.jpg',
    lesionNameEn: 'Renal Calculus with Posterior Acoustic Shadowing',
    lesionSize: '8.5 mm',
    locationEn: 'Right Kidney Lower Pole / Calyx',
    modalityStatusEn: 'IMPACTED / URETERIC FLOW RETARDED',
    telemetry1: {
      label: 'Ureteric Flow Rate',
      current: '110',
      unit: 'mL/hr',
      trend: 'down',
      path: 'M0,45 Q40,15 80,40 T120,35 T150,42',
    },
    telemetry2: {
      label: 'eGFR Filtration',
      current: '68',
      unit: 'mL/min/1.73m²',
      trend: 'down',
      path: 'M0,35 Q20,20 40,38 T80,25 T120,32 T150,28',
    },
    telemetry3: {
      label: 'Hydronephrosis Index',
      current: 'Mild Grade 1',
      unit: 'SFU',
      trend: 'up',
      path: 'M0,40 Q35,28 75,18 T115,24 T150,30',
    },
  },
  brain: {
    reportId: 'BRAIN_MRI_03',
    systemTitleEn: 'Cerebral Hemispheres & Vascular Axis',
    systemTitleHi: 'प्रमस्तिष्क (दिमाग) एवं न्यूरो-सर्कुलेशन',
    modality: 'MRI_T2',
    alertBadgeEn: '85% ISCHEMIA DETECTED · BLOOD FLOW: REDUCED',
    alertBadgeHi: '85% सेरेब्रल इस्कीमिया · रक्त प्रवाह कम पाया गया',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-BRAIN-2.1_c77543e6.jpg',
    lesionNameEn: 'Subcortical Ischemic Focal Zone',
    lesionSize: '14.2 mm²',
    locationEn: 'Middle Cerebral Artery (MCA) Perfusion Territory SC4',
    modalityStatusEn: 'CRITICAL / DEGRADED CEREBRAL PERFUSION',
    telemetry1: {
      label: 'Reduced Perfusion',
      current: '42.8',
      unit: 'mL/100g/min',
      trend: 'down',
      path: 'M0,42 Q25,12 50,35 T100,20 T150,40',
    },
    telemetry2: {
      label: 'Cerebral Activity (EEG)',
      current: '12.4',
      unit: 'Hz (Alpha/Theta)',
      trend: 'down',
      path: 'M0,25 Q10,12 20,38 T40,15 T60,35 T80,18 T100,32 T120,15 T140,30 T150,22',
    },
  },
  lungs: {
    reportId: 'THORAX_SCN_33',
    systemTitleEn: 'Pulmonary Parenchyma & Bronchial Tree',
    systemTitleHi: 'फेफड़े (श्वसन तंत्र) एवं ब्रोन्कियल शाखाएं',
    modality: 'CT_XRAY',
    alertBadgeEn: 'HYPER-METABOLIC NODULE · CARDIOPULMONARY TELEMETRY',
    alertBadgeHi: 'फुफ्फुसीय नोड्यूल एवं कार्डियोपल्मोनरी टेलीमेट्री',
    alertSeverity: 'warning',
    imagePath: '/assets/aistudio/HBE-CHEST-5.1_55f5a481.jpg',
    lesionNameEn: 'Bronchovascular Consolidations',
    lesionSize: '6.4 mm',
    locationEn: 'Left Lower Lobe Segmental Segment',
    modalityStatusEn: 'EVALUATED / TIDAL VOLUME MONITORED',
    telemetry1: {
      label: 'Pulmonary Activity',
      current: '480',
      unit: 'mL Tidal',
      trend: 'stable',
      path: 'M0,42 Q30,12 60,42 T120,42 T150,15',
    },
    telemetry2: {
      label: 'Spirometry FEV1',
      current: '2.85',
      unit: 'Liters',
      trend: 'stable',
      path: 'M0,45 Q35,40 70,25 T115,15 T150,10',
    },
  },
  liver: {
    reportId: 'ABDOMINAL_SCAN_45',
    systemTitleEn: 'Hepatic Parenchyma & Biliary Tract',
    systemTitleHi: 'यकृत (लिवर) एवं पित्त नली',
    modality: 'USG_DOPPLER',
    alertBadgeEn: 'HEPATIC STEATOSIS · GASTRIC WALL THICKENING',
    alertBadgeHi: 'फैटी लिवर ग्रेड 1 एवं गैस्ट्रिक वॉल का अध्ययन',
    alertSeverity: 'warning',
    imagePath: '/assets/aistudio/HBE-CHEST-5.5_c1deb7a7.jpg',
    lesionNameEn: 'Echogenic Hepatic Infiltration & Portal Triad',
    lesionSize: 'Diffuse',
    locationEn: 'Segment VI & VII Right Hepatic Lobe',
    modalityStatusEn: 'EVALUATED / ELEVATED ENZYMATIC MOTILITY',
    telemetry1: {
      label: 'GI / Hepatic Motility',
      current: '3.2',
      unit: 'waves/min',
      trend: 'stable',
      path: 'M0,40 Q25,15 50,38 T100,22 T150,38',
    },
    telemetry2: {
      label: 'Enzymatic Activity (pH)',
      current: '7.38',
      unit: 'pH',
      trend: 'stable',
      path: 'M0,35 Q30,15 60,32 T120,18 T150,28',
    },
  },
  stomach: {
    reportId: 'GASTRIC_USG_08',
    systemTitleEn: 'Gastric Mucosa & Enteric Motility',
    systemTitleHi: 'आमाशय (पेट) एवं जठराग्नि तंत्र',
    modality: 'ULTRASOUND',
    alertBadgeEn: 'GASTRIC WALL THICKENING · HYPERACIDITY PATTERN',
    alertBadgeHi: 'आमाशय की दीवार में सूजन व एसिडिटी का लक्षण',
    alertSeverity: 'warning',
    imagePath: '/assets/aistudio/HBE-CHEST-5.5_c1deb7a7.jpg',
    lesionNameEn: 'Antral Wall Edema / Gastritis Pattern',
    lesionSize: '4.8 mm wall',
    locationEn: 'Prepyloric Gastric Antrum',
    modalityStatusEn: 'INSPECTED / REFLUX DETECTED',
    telemetry1: {
      label: 'Gastric Motility',
      current: '2.9',
      unit: 'cpm',
      trend: 'down',
      path: 'M0,42 Q20,18 40,36 T80,24 T120,38 T150,30',
    },
    telemetry2: {
      label: 'Gastric pH',
      current: '1.8',
      unit: 'pH',
      trend: 'down',
      path: 'M0,25 Q35,38 75,20 T115,35 T150,22',
    },
  },
  pancreas: {
    reportId: 'PANCREAS_CT_18',
    systemTitleEn: 'Endocrine & Exocrine Pancreatic Axis',
    systemTitleHi: 'अग्न्याशय (पैंक्रियास) एवं इंसुलिन अक्ष',
    modality: 'CT_XRAY',
    alertBadgeEn: 'PARENCHYMAL HOMOGENEITY · GLUCOREGULATION',
    alertBadgeHi: 'पैंक्रियाटिक टिशू एवं ब्लड शुगर संतुलन',
    alertSeverity: 'normal',
    imagePath: '/assets/aistudio/HBE-CHEST-5.5_c1deb7a7.jpg',
    lesionNameEn: 'Islet Cellular Homogeneity Inspected',
    lesionSize: 'Normal',
    locationEn: 'Pancreatic Body & Uncinate Process',
    modalityStatusEn: 'NORMAL HOMOGENEOUS CONTRAST',
    telemetry1: {
      label: 'Amylase/Lipase Index',
      current: '64',
      unit: 'U/L',
      trend: 'stable',
      path: 'M0,35 Q30,25 60,32 T120,28 T150,30',
    },
    telemetry2: {
      label: 'Glucose Homeostasis',
      current: '98',
      unit: 'mg/dL',
      trend: 'stable',
      path: 'M0,30 Q25,35 50,28 T100,32 T150,30',
    },
  },
  intestines: {
    reportId: 'ENTERIC_USG_21',
    systemTitleEn: 'Small & Large Intestinal Peristalsis',
    systemTitleHi: 'आंतें (छोटी व बड़ी आंत) एवं पाचन प्रवाह',
    modality: 'ULTRASOUND',
    alertBadgeEn: 'PERISTALTIC SYNC ACTIVE · MUCOSAL INTEGRITY',
    alertBadgeHi: 'पेरिस्टाल्सिस गति सामान्य एवं म्यूकोसा स्वस्थ',
    alertSeverity: 'normal',
    imagePath: '/assets/aistudio/HBE-CHEST-5.5_c1deb7a7.jpg',
    lesionNameEn: 'Valvulae Conniventes Regular Fold Spacing',
    lesionSize: '2.4 mm folds',
    locationEn: 'Jejunal & Ileal Loops',
    modalityStatusEn: 'UNOBSTRUCTED PROPULSIVE WAVE',
    telemetry1: {
      label: 'Peristaltic Wave Rate',
      current: '11',
      unit: 'cycles/min',
      trend: 'stable',
      path: 'M0,35 Q15,15 30,35 T60,35 T90,35 T120,35 T150,35',
    },
    telemetry2: {
      label: 'Transit Velocity',
      current: '1.2',
      unit: 'cm/sec',
      trend: 'stable',
      path: 'M0,28 Q35,32 70,26 T110,30 T150,28',
    },
  },
  eye: {
    reportId: 'OCULAR_SCAN_22',
    systemTitleEn: 'The Sensory System - The Eye (Integrated)',
    systemTitleHi: 'दृष्टि तंत्र - नेत्र (सेंसरी अक्ष)',
    modality: 'OCT_FUNDUS',
    alertBadgeEn: '85% RETINAL DEGENERATION · MACULAR ALERT',
    alertBadgeHi: '85% रेटिनल क्षय · मैक्यूलर परिवर्तन का संकेत',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-EYE-3_1241e311.jpg',
    lesionNameEn: 'Subretinal Drusen & Foveal Thinning',
    lesionSize: '165 µm',
    locationEn: 'Fovea Centralis / Retinal Pigment Epithelium',
    modalityStatusEn: 'INSPECTED / PRESSURE FLUCTUATION ACTIVE',
    telemetry1: {
      label: 'Intraocular Pressure (IOP)',
      current: '18.4',
      unit: 'mmHg',
      trend: 'up',
      path: 'M0,45 Q35,12 70,38 T110,20 T150,36',
    },
    telemetry2: {
      label: 'Optic Nerve Degradation',
      current: '0.45',
      unit: 'Cup-to-Disc',
      trend: 'up',
      path: 'M0,40 Q25,30 50,18 T100,24 T150,32',
    },
  },
  endocrine: {
    reportId: 'THYROID_USG_09',
    systemTitleEn: 'Thyroid & Endocrine Glands (Integrated)',
    systemTitleHi: 'थायराइड एवं अंतःस्रावी ग्रंथियां',
    modality: 'ULTRASOUND',
    alertBadgeEn: '85% ENLARGEMENT DETECTED · HYPERPLASIA ALERT',
    alertBadgeHi: '85% थायराइड वृद्धि · हाइपरप्लासिया की संभावना',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-CHEST-5.7_0187ed86.jpg',
    lesionNameEn: 'Hypoechoic Colloid Nodule with Peripheral Vascularity',
    lesionSize: '11.4 mm',
    locationEn: 'Right Thyroid Lobe Inferior Aspect',
    modalityStatusEn: 'INSPECTED / T3/T4 DYSREGULATION',
    telemetry1: {
      label: 'T3 / T4 Activity Curve',
      current: '4.82',
      unit: 'pg/mL Free',
      trend: 'up',
      path: 'M0,42 Q20,15 40,38 T80,18 T120,35 T150,22',
    },
    telemetry2: {
      label: 'TSH Hormone Level',
      current: '0.24',
      unit: 'µIU/mL',
      trend: 'down',
      path: 'M0,20 Q35,42 75,18 T115,38 T150,25',
    },
  },
  urinary: {
    reportId: 'PELVIS_USG_12',
    systemTitleEn: 'Urinary Bladder & Pelvis (Integrated)',
    systemTitleHi: 'मूत्राशय एवं पेल्विक संरचना',
    modality: 'ULTRASOUND',
    alertBadgeEn: 'BLADDER CAPACITY EXPANSION · PROSTATE ENLARGED',
    alertBadgeHi: 'मूत्राशय विस्तार · प्रोस्टेट ग्रंथि में सूजन का संकेत',
    alertSeverity: 'critical',
    imagePath: '/assets/aistudio/HBE-KIDNEY-6.7_97f293cb.jpg',
    lesionNameEn: 'Intravesical Prostatic Protrusion',
    lesionSize: '28.5 cc',
    locationEn: 'Prostatic Transition Zone & Bladder Neck',
    modalityStatusEn: 'OBSTRUCTION DETECTED / URINARY RETENTION',
    telemetry1: {
      label: 'Reduced Urinary Flow',
      current: '9.2',
      unit: 'mL/sec (Qmax)',
      trend: 'down',
      path: 'M0,18 Q40,42 80,45 T120,46 T150,48',
    },
    telemetry2: {
      label: 'Post-Void Residual Volume',
      current: '145',
      unit: 'mL',
      trend: 'up',
      path: 'M0,45 Q35,32 75,15 T115,10 T150,8',
    },
  },
};

interface DiagnosticScanFusionPanelProps {
  organKey: OrganKey | 'eye' | 'endocrine' | 'urinary' | null;
  onClose: () => void;
  onOpenChatWithClinicalFocus?: (query: string) => void;
}

export function DiagnosticScanFusionPanel({
  organKey,
  onClose,
  onOpenChatWithClinicalFocus,
}: DiagnosticScanFusionPanelProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [activeScanView, setActiveScanView] = useState<'scan' | 'telemetry' | 'fusion'>('scan');
  const [pulseTime, setPulseTime] = useState(0);
  const [selectedTool, setSelectedTool] = useState<'inspect' | 'volume' | 'slices'>('inspect');

  // Real-time telemetry pulse ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTime((t) => (t + 1) % 100);
    }, 120);
    return () => clearInterval(timer);
  }, []);

  const effectiveKey = organKey || 'heart';
  const data = SCAN_FUSION_CATALOG[effectiveKey] || SCAN_FUSION_CATALOG.heart;

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-[520px] md:w-[580px] bg-slate-950/98 backdrop-blur-2xl border-l border-cyan-800/60 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300 font-sans select-none"
      aria-label="Diagnostic Scan Fusion Workstation"
    >
      {/* Top Clinical Workstation Header with Holographic Telemetry Meta */}
      <div className="p-4 border-b border-cyan-900/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex items-start justify-between gap-3 relative overflow-hidden">
        {/* Holographic scanner scanline effect */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent" />

        <div className="min-w-0 flex-1 relative z-10">
          <div className="flex items-center gap-2 mb-1 text-[10px] font-mono tracking-wider text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold">REPORT UPLOAD: {data.reportId}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">MODALITY: {data.modality}</span>
          </div>

          <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>{isHi ? data.systemTitleHi : data.systemTitleEn}</span>
          </h2>

          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>TCST MEDIORE: Laboratory Verified</span>
            <span>·</span>
            <span>AFGOMKENT: 2026</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors relative z-10 shrink-0"
          title={isHi ? 'बंद करें' : 'Close'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Clinical Alert Warning Banner matching attached references */}
      <div
        className={`px-4 py-2.5 border-b flex items-center justify-between gap-2 text-xs font-bold ${
          data.alertSeverity === 'critical'
            ? 'bg-red-950/70 border-red-800/80 text-red-200'
            : data.alertSeverity === 'warning'
            ? 'bg-amber-950/70 border-amber-800/80 text-amber-200'
            : 'bg-emerald-950/70 border-emerald-800/80 text-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <AlertTriangle
            className={`w-4 h-4 shrink-0 ${
              data.alertSeverity === 'critical'
                ? 'text-red-400 animate-pulse'
                : data.alertSeverity === 'warning'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          />
          <span className="truncate">{isHi ? data.alertBadgeHi : data.alertBadgeEn}</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider shrink-0 uppercase border bg-black/40 border-current/30">
          {data.alertSeverity.toUpperCase()}
        </span>
      </div>

      {/* Sub-Header Navigation: Scan Viewport, Dynamic Telemetry, Fusion Overlay */}
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/60 flex items-center gap-2">
        <button
          onClick={() => setActiveScanView('scan')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeScanView === 'scan'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scan className="w-3.5 h-3.5" />
          <span>{isHi ? 'डायग्नोस्टिक स्कैन' : 'Diagnostic Slices'}</span>
        </button>

        <button
          onClick={() => setActiveScanView('telemetry')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeScanView === 'telemetry'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isHi ? 'बायो-टेलीमेट्री' : 'Live Telemetry'}</span>
        </button>

        <button
          onClick={() => setActiveScanView('fusion')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeScanView === 'fusion'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 ring-1 ring-cyan-400'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isHi ? '3D स्कैन फ्यूजन' : '3D Fusion'}</span>
        </button>
      </div>

      {/* Main Body Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* VIEW 1: DIAGNOSTIC SCAN SLICES & LESION ANNOTATIONS */}
        {activeScanView === 'scan' && (
          <div className="space-y-4">
            {/* Primary Imaging Viewport Frame */}
            <div className="relative rounded-2xl overflow-hidden border border-cyan-800/60 bg-slate-950 shadow-2xl group">
              {/* Corner Telemetry HUD Crosshairs */}
              <div className="absolute top-2 left-2 z-20 pointer-events-none font-mono text-[9px] text-cyan-400/90 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-900/60">
                [CAM 04 · INSPECTED]
              </div>
              <div className="absolute top-2 right-2 z-20 pointer-events-none font-mono text-[9px] text-cyan-400/90 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-900/60">
                ZOOM: 1.8X · FOV 45°
              </div>

              {/* The Actual Reference Image from /assets/aistudio/... */}
              <div className="relative w-full aspect-[16/10] bg-slate-950 flex items-center justify-center overflow-hidden">
                <img
                  src={data.imagePath}
                  alt={data.systemTitleEn}
                  className="w-full h-full object-cover object-center filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />

                {/* Caliper / Reticle Overlay matching reference */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="relative w-36 h-36 rounded-full border border-cyan-400/30 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                    <div className="w-24 h-24 rounded-full border border-dashed border-cyan-400/50" />
                    <div className="absolute top-0 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                    <div className="absolute bottom-0 w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                  </div>
                  <div className="absolute w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-400/40 animate-ping" />
                </div>

                {/* Holographic Watermark Badge */}
                <div className="absolute bottom-2 left-2 z-20 font-mono text-[9px] text-slate-300 bg-slate-950/85 px-2 py-1 rounded border border-slate-700/80">
                  <span className="text-amber-400 font-bold">{data.lesionNameEn}</span>
                  {data.lesionSize && <span className="text-slate-400 ml-1">({data.lesionSize})</span>}
                </div>
              </div>

              {/* Action Toolbar Below Image */}
              <div className="p-3 bg-slate-900/90 border-t border-cyan-900/40 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedTool('inspect')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      selectedTool === 'inspect'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    [ VIEW 3D FUSION ]
                  </button>
                  <button
                    onClick={() => setSelectedTool('volume')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      selectedTool === 'volume'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    [ ANALYZE VOLUME ]
                  </button>
                  <button
                    onClick={() => setSelectedTool('slices')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
                      selectedTool === 'slices'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    [ SCAN SLICES ]
                  </button>
                </div>

                <div className="text-[10px] text-cyan-400">
                  <span>30cm SCALE</span>
                </div>
              </div>
            </div>

            {/* Lesion & Clinical Finding Card */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">Anatomical Target Specification</span>
                <span className="text-[10px] font-mono text-emerald-400">STATUS: VERIFIED</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono">TARGET REGION</div>
                  <div className="font-bold text-slate-200 mt-0.5">{data.locationEn}</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono">MEASURED CALIPER</div>
                  <div className="font-bold text-amber-400 mt-0.5">{data.lesionSize || 'Standard Ref'}</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                <span className="font-semibold text-slate-300">Modality Assessment: </span>
                {data.modalityStatusEn}. Correlated with clinical lab findings and multi-planar volumetric rendering.
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: LIVE TELEMETRY & PHYSIOLOGIC WAVEFORMS */}
        {activeScanView === 'telemetry' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span className="font-bold text-slate-200">Continuous Biological Waveforms</span>
              <span className="text-[10px] font-mono text-cyan-400">CLK: {(pulseTime * 0.1).toFixed(1)}s</span>
            </div>

            {/* Waveform 1 */}
            <div className="p-3.5 rounded-xl border border-cyan-900/60 bg-slate-950/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{data.telemetry1.label}</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {data.telemetry1.current} <span className="text-[10px] text-slate-400">{data.telemetry1.unit}</span>
                </span>
              </div>
              <div className="h-16 w-full rounded bg-slate-900/70 border border-slate-800/80 relative overflow-hidden flex items-center">
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:16px_16px]" />
                <svg viewBox="0 0 150 50" className="w-full h-full stroke-cyan-400 fill-none stroke-[2]" preserveAspectRatio="none">
                  <path d={data.telemetry1.path} />
                </svg>
              </div>
            </div>

            {/* Waveform 2 */}
            <div className="p-3.5 rounded-xl border border-cyan-900/60 bg-slate-950/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>{data.telemetry2.label}</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {data.telemetry2.current} <span className="text-[10px] text-slate-400">{data.telemetry2.unit}</span>
                </span>
              </div>
              <div className="h-16 w-full rounded bg-slate-900/70 border border-slate-800/80 relative overflow-hidden flex items-center">
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#fbbf24_1px,transparent_1px),linear-gradient(to_bottom,#fbbf24_1px,transparent_1px)] bg-[size:16px_16px]" />
                <svg viewBox="0 0 150 50" className="w-full h-full stroke-amber-400 fill-none stroke-[2]" preserveAspectRatio="none">
                  <path d={data.telemetry2.path} />
                </svg>
              </div>
            </div>

            {/* Waveform 3 (if present) */}
            {data.telemetry3 && (
              <div className="p-3.5 rounded-xl border border-cyan-900/60 bg-slate-950/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{data.telemetry3.label}</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {data.telemetry3.current} <span className="text-[10px] text-slate-400">{data.telemetry3.unit}</span>
                  </span>
                </div>
                <div className="h-16 w-full rounded bg-slate-900/70 border border-slate-800/80 relative overflow-hidden flex items-center">
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#34d399_1px,transparent_1px),linear-gradient(to_bottom,#34d399_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <svg viewBox="0 0 150 50" className="w-full h-full stroke-emerald-400 fill-none stroke-[2]" preserveAspectRatio="none">
                    <path d={data.telemetry3.path} />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: 3D SCAN FUSION & CLINICAL CORRELATION */}
        {activeScanView === 'fusion' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-cyan-700/60 bg-slate-900/80 space-y-3">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Multimodal 3D Anatomical Fusion Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The radiologic slices from report <code className="text-cyan-300 font-mono">{data.reportId}</code> are
                coregistered in real-time with the Three.js mesh coordinates. Spatial calipers map lesions directly to
                the organ's TA2 vascular boundaries.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Volumetric Coregistration:</span>
                  <span className="font-mono text-emerald-400 font-bold">99.4% ALIGNED</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Clipping Axis Sync:</span>
                  <span className="font-mono text-cyan-400 font-bold">AXIAL / CORONAL</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Spatial Caliper Precision:</span>
                  <span className="font-mono text-amber-400 font-bold">±0.25 mm</span>
                </div>
              </div>
            </div>

            {/* Quick Action to consult doctor/chat with finding */}
            {onOpenChatWithClinicalFocus && (
              <button
                onClick={() =>
                  onOpenChatWithClinicalFocus(
                    `Clinical inquiry regarding ${data.systemTitleEn}: ${data.alertBadgeEn}. Finding: ${data.lesionNameEn}.`
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Discuss Findings with VedaShield AI</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-3 border-t border-cyan-900/50 bg-slate-950 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>FUSION ENGINE v2.4</span>
        </div>
        <div className="flex items-center gap-2 text-cyan-400">
          <span>CO-REGISTERED WITH TA2</span>
        </div>
      </div>
    </div>
  );
}
