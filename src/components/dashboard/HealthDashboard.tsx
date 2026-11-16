import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FamilyProfile, MedicalReport, OrganKey, TestRow } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import {
  Activity,
  ScanLine,
  HeartPulse,
  Pill,
  Calendar,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
  CheckCircle2,
  FileText,
  Share2,
  Stethoscope,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  Info,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';

interface HealthDashboardProps {
  activeProfile: FamilyProfile | null;
  reports: MedicalReport[];
  onNavigateToTab: (tab: string) => void;
  onSelectReport: (report: MedicalReport) => void;
  onOpenWhatsAppShare: (report: MedicalReport) => void;
  onNavigateToAnatomy?: (organKey?: OrganKey, finding?: TestRow) => void;
}

type TrendCategory = 'overview' | 'bp' | 'glucose' | 'cholesterol' | 'organs';

type MetricKey =
  | 'systolicBP'
  | 'diastolicBP'
  | 'heartRate'
  | 'glucose'
  | 'hba1c'
  | 'cholesterol'
  | 'ldl'
  | 'hdl'
  | 'triglycerides'
  | 'alt'
  | 'creatinine';

export type ChangeDirectionStatus =
  | 'improved'
  | 'optimal'
  | 'worsened'
  | 'elevated'
  | 'stable';

export interface MetricDeltaInfo {
  current: number | null;
  previous: number | null;
  delta: number | null;
  pctChange: number | null;
  status: ChangeDirectionStatus;
  badgeTextEn: string;
  badgeTextHi: string;
  isSignificant: boolean;
}

interface TrendDataPoint {
  date: string;
  shortDate: string;
  title: string;
  doctorName?: string;
  systolicBP: number | null;
  diastolicBP: number | null;
  heartRate: number | null;
  glucose: number | null;
  hba1c: number | null;
  cholesterol: number | null;
  ldl: number | null;
  hdl: number | null;
  triglycerides: number | null;
  alt: number | null;
  creatinine: number | null;
  deltas: Record<MetricKey, MetricDeltaInfo>;
}

interface MetricConfig {
  key: MetricKey;
  labelEn: string;
  labelHi: string;
  unit: string;
  normalMin: number;
  normalMax: number;
  higherIsBetter?: boolean;
  significantThreshold: number;
  organ: OrganKey;
  color: string;
}

const METRIC_CONFIGS: Record<MetricKey, MetricConfig> = {
  systolicBP: {
    key: 'systolicBP',
    labelEn: 'Systolic BP',
    labelHi: 'सिस्टोलिक रक्तचाप',
    unit: 'mmHg',
    normalMin: 90,
    normalMax: 120,
    significantThreshold: 4,
    organ: 'heart',
    color: '#06b6d4',
  },
  diastolicBP: {
    key: 'diastolicBP',
    labelEn: 'Diastolic BP',
    labelHi: 'डायस्टोलिक रक्तचाप',
    unit: 'mmHg',
    normalMin: 60,
    normalMax: 80,
    significantThreshold: 3,
    organ: 'heart',
    color: '#3b82f6',
  },
  heartRate: {
    key: 'heartRate',
    labelEn: 'Pulse Rate',
    labelHi: 'हृदय गति (Pulse)',
    unit: 'bpm',
    normalMin: 60,
    normalMax: 90,
    significantThreshold: 4,
    organ: 'heart',
    color: '#f59e0b',
  },
  glucose: {
    key: 'glucose',
    labelEn: 'Fasting Glucose',
    labelHi: 'फास्टिंग शुगर',
    unit: 'mg/dL',
    normalMin: 70,
    normalMax: 99,
    significantThreshold: 5,
    organ: 'pancreas',
    color: '#10b981',
  },
  hba1c: {
    key: 'hba1c',
    labelEn: 'HbA1c',
    labelHi: 'एचबीए1सी (HbA1c)',
    unit: '%',
    normalMin: 4.0,
    normalMax: 5.6,
    significantThreshold: 0.2,
    organ: 'pancreas',
    color: '#8b5cf6',
  },
  cholesterol: {
    key: 'cholesterol',
    labelEn: 'Total Cholesterol',
    labelHi: 'कुल कोलेस्ट्रॉल',
    unit: 'mg/dL',
    normalMin: 125,
    normalMax: 200,
    significantThreshold: 8,
    organ: 'heart',
    color: '#f43f5e',
  },
  ldl: {
    key: 'ldl',
    labelEn: 'LDL Cholesterol',
    labelHi: 'एलडीएल कोलेस्ट्रॉल',
    unit: 'mg/dL',
    normalMin: 50,
    normalMax: 100,
    significantThreshold: 6,
    organ: 'heart',
    color: '#fb923c',
  },
  hdl: {
    key: 'hdl',
    labelEn: 'HDL Cholesterol',
    labelHi: 'एचडीएल (अच्छा) कोलेस्ट्रॉल',
    unit: 'mg/dL',
    normalMin: 40,
    normalMax: 80,
    higherIsBetter: true,
    significantThreshold: 2,
    organ: 'heart',
    color: '#14b8a6',
  },
  triglycerides: {
    key: 'triglycerides',
    labelEn: 'Triglycerides',
    labelHi: 'ट्राइग्लिसराइड्स',
    unit: 'mg/dL',
    normalMin: 50,
    normalMax: 150,
    significantThreshold: 10,
    organ: 'liver',
    color: '#eab308',
  },
  alt: {
    key: 'alt',
    labelEn: 'SGPT / ALT',
    labelHi: 'एसजीपीटी (SGPT / ALT)',
    unit: 'U/L',
    normalMin: 7,
    normalMax: 40,
    significantThreshold: 4,
    organ: 'liver',
    color: '#f97316',
  },
  creatinine: {
    key: 'creatinine',
    labelEn: 'Serum Creatinine',
    labelHi: 'सीरम क्रिएटिनिन',
    unit: 'mg/dL',
    normalMin: 0.6,
    normalMax: 1.2,
    significantThreshold: 0.04,
    organ: 'kidneys',
    color: '#0ea5e9',
  },
};

function evaluateStepChange(
  key: MetricKey,
  current: number | null,
  previous: number | null
): MetricDeltaInfo {
  const cfg = METRIC_CONFIGS[key];
  if (current === null) {
    return {
      current: null,
      previous,
      delta: null,
      pctChange: null,
      status: 'stable',
      badgeTextEn: 'No Data',
      badgeTextHi: 'डेटा नहीं',
      isSignificant: false,
    };
  }

  const inRangeNow = current >= cfg.normalMin && current <= cfg.normalMax;

  if (previous === null) {
    return {
      current,
      previous: null,
      delta: null,
      pctChange: null,
      status: inRangeNow ? 'optimal' : 'elevated',
      badgeTextEn: inRangeNow ? 'Baseline Optimal' : 'Baseline Flagged',
      badgeTextHi: inRangeNow ? 'सामान्य बेसलाइन' : 'उच्च बेसलाइन',
      isSignificant: false,
    };
  }

  const rawDelta = Number((current - previous).toFixed(2));
  const pctChange =
    previous !== 0 ? Number(((rawDelta / previous) * 100).toFixed(1)) : 0;
  const isSignificant = Math.abs(rawDelta) >= cfg.significantThreshold;

  if (Math.abs(rawDelta) < 0.001) {
    return {
      current,
      previous,
      delta: 0,
      pctChange: 0,
      status: inRangeNow ? 'optimal' : 'elevated',
      badgeTextEn: inRangeNow ? 'Stable Normal' : 'Unchanged High',
      badgeTextHi: inRangeNow ? 'स्थिर सामान्य' : 'अपरिवर्तित उच्च',
      isSignificant: false,
    };
  }

  // Determine whether the movement is clinically positive or negative
  let isPositiveShift = false;
  if (cfg.higherIsBetter) {
    isPositiveShift = rawDelta > 0;
  } else {
    // Lower is better when above normalMin
    isPositiveShift = rawDelta < 0 && current >= cfg.normalMin * 0.9;
  }

  if (isPositiveShift) {
    return {
      current,
      previous,
      delta: rawDelta,
      pctChange,
      status: inRangeNow ? 'optimal' : 'improved',
      badgeTextEn: inRangeNow ? 'Normalized' : 'Improved vs Prev',
      badgeTextHi: inRangeNow ? 'सामान्य सीमा में' : 'पिछली रिपोर्ट से सुधार',
      isSignificant,
    };
  }

  return {
    current,
    previous,
    delta: rawDelta,
    pctChange,
    status: inRangeNow ? 'stable' : 'worsened',
    badgeTextEn: inRangeNow ? 'Within Range' : 'Increased vs Prev',
    badgeTextHi: inRangeNow ? 'सामान्य सीमा में' : 'पिछली रिपोर्ट से वृद्धि',
    isSignificant,
  };
}

// Custom SVG Dot for Recharts that renders color-coded status rings + directional arrows on significant changes
interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: TrendDataPoint;
  metricKey: MetricKey;
  showInlineBadge?: boolean;
}

function CustomTrendDot({
  cx,
  cy,
  payload,
  metricKey,
  showInlineBadge = true,
}: CustomDotProps) {
  if (typeof cx !== 'number' || typeof cy !== 'number' || !payload) return null;

  const info = payload.deltas?.[metricKey];
  if (!info || info.current === null) return null;

  const cfg = METRIC_CONFIGS[metricKey];

  // Determine badge & ring colors by clinical change status
  let ringColor = cfg.color;
  let badgeBg = '#0f172a';
  let badgeBorder = '#334155';
  let badgeText = '#f8fafc';
  let arrowSymbol = '';

  if (info.status === 'optimal' || info.status === 'improved') {
    ringColor = '#10b981';
    badgeBg = '#064e3b';
    badgeBorder = '#10b981';
    badgeText = '#6ee7b7';
  } else if (info.status === 'worsened' || info.status === 'elevated') {
    ringColor = '#f43f5e';
    badgeBg = '#4c0519';
    badgeBorder = '#f43f5e';
    badgeText = '#fda4af';
  }

  if (info.delta !== null && info.delta !== 0) {
    arrowSymbol = info.delta > 0 ? '↑' : '↓';
  }

  const formattedDelta =
    info.delta !== null && info.delta !== 0
      ? `${arrowSymbol}${Math.abs(info.delta)}`
      : '';

  return (
    <g>
      {/* Outer Halo */}
      <circle
        cx={cx}
        cy={cy}
        r={info.isSignificant ? 7.5 : 5.5}
        fill={ringColor}
        fillOpacity={0.22}
      />
      {/* Core Point */}
      <circle
        cx={cx}
        cy={cy}
        r={info.isSignificant ? 4.5 : 3.5}
        fill={ringColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
      {/* Floating Arrow + Delta Pill directly inside the chart for significant report-over-report changes */}
      {showInlineBadge && info.delta !== null && info.isSignificant && (
        <g transform={`translate(${cx}, ${cy - 18})`}>
          <rect
            x={-22}
            y={-9}
            width={44}
            height={16}
            rx={5}
            fill={badgeBg}
            stroke={badgeBorder}
            strokeWidth={1}
          />
          <text
            x={0}
            y={2}
            textAnchor="middle"
            fill={badgeText}
            fontSize={9.5}
            fontWeight={800}
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            {formattedDelta}
          </text>
        </g>
      )}
    </g>
  );
}

export function HealthDashboard({
  activeProfile,
  reports,
  onNavigateToTab,
  onSelectReport,
  onOpenWhatsAppShare,
  onNavigateToAnatomy,
}: HealthDashboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [selectedCategory, setSelectedCategory] =
    useState<TrendCategory>('overview');
  const [simpleInsightMode, setSimpleInsightMode] = useState<'simple' | 'clinical'>(
    'simple'
  );

  // Compute metrics across reports
  const latestReport = reports[0] || null;
  const previousReport = reports[1] || null;

  const allRows = useMemo(() => reports.flatMap((r) => r.rows), [reports]);
  const abnormalRows = useMemo(
    () => allRows.filter((r) => r.status === 'high' || r.status === 'low'),
    [allRows]
  );
  const normalRows = useMemo(
    () => allRows.filter((r) => r.status === 'within'),
    [allRows]
  );
  const prescriptionsCount = useMemo(
    () =>
      reports.filter(
        (r) =>
          r.prescriptionDetails &&
          (r.prescriptionDetails.medications.length > 0 ||
            r.prescriptionDetails.doctorName)
      ).length,
    [reports]
  );

  // Build chronological historical trend dataset with report-over-report step deltas
  const trendData: TrendDataPoint[] = useMemo(() => {
    const sorted = [...reports].sort((a, b) => a.date.localeCompare(b.date));

    const rawPoints = sorted
      .map((r) => {
        const findVal = (pattern: RegExp): number | null => {
          const match = r.rows.find((row) => pattern.test(row.name));
          if (!match) return null;
          if (
            typeof match.numericValue === 'number' &&
            !isNaN(match.numericValue)
          ) {
            return match.numericValue;
          }
          const parsed = parseFloat(
            String(match.value).replace(/[^0-9.]/g, '')
          );
          return isNaN(parsed) ? null : parsed;
        };

        const vitals = r.vitals || r.prescriptionDetails?.vitals;
        const systolicBP = vitals?.systolicBP ?? findVal(/systolic/i);
        const diastolicBP = vitals?.diastolicBP ?? findVal(/diastolic/i);
        const heartRate = vitals?.heartRate ?? findVal(/heart rate|pulse/i);

        const glucose = findVal(
          /fasting.*glucose|blood.*glucose|blood.*sugar|fbs/i
        );
        const hba1c = findVal(/hba1c|glycosylated/i);
        const cholesterol = findVal(/total.*cholesterol|^cholesterol$/i);
        const ldl = findVal(/ldl/i);
        const hdl = findVal(/hdl/i);
        const triglycerides = findVal(/triglyceride/i);
        const alt = findVal(/sgpt|alt/i);
        const creatinine = findVal(/creatinine/i);

        const parts = r.date.split('-');
        const shortDate =
          parts.length === 3
            ? `${parts[1]}/${parts[2]}/${parts[0].slice(2)}`
            : r.date;

        return {
          date: r.date,
          shortDate,
          title: r.title,
          doctorName: r.prescriptionDetails?.doctorName,
          systolicBP,
          diastolicBP,
          heartRate,
          glucose,
          hba1c,
          cholesterol,
          ldl,
          hdl,
          triglycerides,
          alt,
          creatinine,
        };
      })
      .filter(
        (d) =>
          d.systolicBP !== null ||
          d.glucose !== null ||
          d.cholesterol !== null ||
          d.ldl !== null ||
          d.alt !== null ||
          d.creatinine !== null
      );

    // Enrich each point with step-change deltas compared to the immediately previous report
    const allKeys: MetricKey[] = [
      'systolicBP',
      'diastolicBP',
      'heartRate',
      'glucose',
      'hba1c',
      'cholesterol',
      'ldl',
      'hdl',
      'triglycerides',
      'alt',
      'creatinine',
    ];

    return rawPoints.map((pt, idx) => {
      const prevPt = idx > 0 ? rawPoints[idx - 1] : null;
      const deltas = {} as Record<MetricKey, MetricDeltaInfo>;
      for (const key of allKeys) {
        deltas[key] = evaluateStepChange(
          key,
          pt[key],
          prevPt ? prevPt[key] : null
        );
      }
      return {
        ...pt,
        deltas,
      };
    });
  }, [reports]);

  const latestTrendPoint =
    trendData.length > 0 ? trendData[trendData.length - 1] : null;
  const previousTrendPoint =
    trendData.length > 1 ? trendData[trendData.length - 2] : null;

  // Compute Overall Wellness Vitality Score (0-100) and Organ System Health Scores for Infographics
  const organHealthInfographics = useMemo(() => {
    const organKeys: OrganKey[] = [
      'heart',
      'pancreas',
      'liver',
      'kidneys',
      'lungs',
      'brain',
    ];

    const latestRows = latestReport?.rows || [];
    const latestVitals =
      latestReport?.vitals || latestReport?.prescriptionDetails?.vitals;

    const systems = organKeys.map((key) => {
      const organMeta = ORGANS[key];
      const matchingRows = latestRows.filter((r) => r.organ === key);
      const flagged = matchingRows.filter(
        (r) => r.status === 'high' || r.status === 'low'
      );

      let score = 94;
      if (key === 'heart') {
        const sys = latestVitals?.systolicBP || 120;
        const bpPenalty = sys > 135 ? 18 : sys > 125 ? 8 : 0;
        score = Math.max(55, 96 - flagged.length * 14 - bpPenalty);
      } else {
        score = Math.max(58, 96 - flagged.length * 16);
      }

      const status: 'optimal' | 'watch' | 'action' =
        score >= 85 ? 'optimal' : score >= 72 ? 'watch' : 'action';

      return {
        key,
        nameEn: organMeta.nameEn,
        nameHi: organMeta.nameHi,
        color: organMeta.color,
        score,
        status,
        totalBiomarkers: matchingRows.length,
        flaggedCount: flagged.length,
        primaryRow: flagged[0] || matchingRows[0] || undefined,
      };
    });

    const overallScore = Math.round(
      systems.reduce((acc, s) => acc + s.score, 0) / systems.length
    );

    return { systems, overallScore };
  }, [latestReport]);

  // Build visual range spectrum bars comparing Previous Report vs Latest Report
  const spectrumMetrics = useMemo(() => {
    if (!latestTrendPoint) return [];
    const keys: MetricKey[] = [
      'systolicBP',
      'diastolicBP',
      'glucose',
      'cholesterol',
      'ldl',
      'alt',
      'creatinine',
      'hdl',
    ];

    return keys
      .map((k) => {
        const cfg = METRIC_CONFIGS[k];
        const info = latestTrendPoint.deltas[k];
        if (info.current === null) return null;

        // Calculate percentage position along a visual scale [minScale, maxScale]
        const span = cfg.normalMax - cfg.normalMin;
        const minScale = Math.max(0, cfg.normalMin - span * 0.6);
        const maxScale = cfg.normalMax + span * 1.1;

        const clampPct = (val: number) =>
          Math.min(
            96,
            Math.max(4, ((val - minScale) / (maxScale - minScale)) * 100)
          );

        const currentPct = clampPct(info.current);
        const prevPct =
          info.previous !== null ? clampPct(info.previous) : null;
        const normalStartPct = clampPct(cfg.normalMin);
        const normalEndPct = clampPct(cfg.normalMax);

        return {
          cfg,
          info,
          currentPct,
          prevPct,
          normalStartPct,
          normalEndPct,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [latestTrendPoint]);

  // Custom Recharts Tooltip showing arrows and color-coded status badges vs previous report
  const renderCustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      dataKey?: string | number;
      name?: string;
      value?: number;
      color?: string;
      payload?: TrendDataPoint;
    }>;
  }) => {
    if (!active || !payload || payload.length === 0) return null;
    const dataPoint = payload[0].payload;
    if (!dataPoint) return null;

    return (
      <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-slate-700 text-white shadow-2xl space-y-2.5 min-w-[260px] backdrop-blur-md">
        <div className="border-b border-slate-800 pb-2">
          <div className="text-[11px] font-mono tabular-nums text-emerald-400 font-bold">
            {dataPoint.date}
            {dataPoint.doctorName ? ` · ${dataPoint.doctorName}` : ''}
          </div>
          <div className="text-xs font-bold text-white truncate max-w-[250px]">
            {dataPoint.title}
          </div>
        </div>

        <div className="space-y-2">
          {payload.map((entry, idx) => {
            const mKey = entry.dataKey as MetricKey;
            const cfg = METRIC_CONFIGS[mKey];
            const deltaInfo = dataPoint.deltas?.[mKey];
            if (!cfg || !deltaInfo || deltaInfo.current === null) return null;

            const isGood =
              deltaInfo.status === 'optimal' || deltaInfo.status === 'improved';
            const isBad =
              deltaInfo.status === 'worsened' || deltaInfo.status === 'elevated';

            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color || cfg.color }}
                  />
                  <span className="text-slate-300 font-medium">
                    {lang === 'hi' ? cfg.labelHi : cfg.labelEn}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="font-bold text-white">
                    {deltaInfo.current} {cfg.unit}
                  </span>

                  {deltaInfo.delta !== null && deltaInfo.delta !== 0 && (
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isGood
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                          : isBad
                          ? 'bg-rose-950 text-rose-300 border border-rose-700/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {deltaInfo.delta > 0 ? '↑' : '↓'}
                      {Math.abs(deltaInfo.delta)} ({deltaInfo.pctChange! > 0 ? '+' : ''}
                      {deltaInfo.pctChange}%)
                    </span>
                  )}

                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-sans font-bold uppercase ${
                      isGood
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isBad
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {lang === 'hi'
                      ? deltaInfo.badgeTextHi
                      : deltaInfo.badgeTextEn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Determine which metrics to highlight in the step-change comparison bar for the active category
  const activeCategoryMetricKeys: MetricKey[] = useMemo(() => {
    switch (selectedCategory) {
      case 'bp':
        return ['systolicBP', 'diastolicBP', 'heartRate'];
      case 'glucose':
        return ['glucose', 'hba1c'];
      case 'cholesterol':
        return ['cholesterol', 'ldl', 'triglycerides', 'hdl'];
      case 'organs':
        return ['alt', 'creatinine'];
      default:
        return ['systolicBP', 'glucose', 'cholesterol', 'ldl', 'alt'];
    }
  }, [selectedCategory]);

  // Group latest prescription medicines by Morning / Afternoon / Night for visual schedule infographic
  const rxScheduleSlots = useMemo(() => {
    const meds = latestReport?.prescriptionDetails?.medications || [];
    const morning = meds.filter((m) =>
      /morning|breakfast|empty stomach|1-0-0|1-0-1|1-1-1/i.test(
        `${m.frequency} ${m.timing}`
      )
    );
    const afternoon = meds.filter((m) =>
      /afternoon|lunch|0-1-0|1-1-1/i.test(`${m.frequency} ${m.timing}`)
    );
    const night = meds.filter(
      (m) =>
        /night|bedtime|dinner|hs|0-0-1|1-0-1|1-1-1/i.test(
          `${m.frequency} ${m.timing}`
        ) ||
        (!morning.includes(m) && !afternoon.includes(m))
    );
    return { morning, afternoon, night, total: meds.length };
  }, [latestReport]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner with Overall Vitality Score Infographic */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {activeProfile?.name || 'Rahul Sharma'} ·{' '}
              {t(`family.relationships.${activeProfile?.relationship || 'Self'}`)}{' '}
              · Blood Group: {activeProfile?.bloodGroup || 'B+'}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {lang === 'hi'
                ? 'नमस्ते! आपका स्वास्थ्य इन्फोग्राफिक्स, ट्रेंड विश्लेषण और सरल AI सारांश तैयार है।'
                : "Your Interactive Health Infographics, Report Deltas & Simple AI Insights."}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              {lang === 'hi'
                ? 'पिछली जांच रिपोर्ट की तुलना में आपके रक्तचाप (BP), शुगर, कोलेस्ट्रॉल और अंगों के स्वास्थ्य में हुए सुधार का सरल एवं स्पष्ट विश्लेषण।'
                : 'Track report-over-report biomarker improvements with directional delta badges, organ wellness gauges, and plain-language prescription insights.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5">
              <button
                onClick={() => onNavigateToTab('scanner')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs shadow-lg hover:bg-emerald-50 transition-all"
              >
                <ScanLine className="w-4 h-4 text-emerald-700" />
                <span>
                  {lang === 'hi'
                    ? 'नई रिपोर्ट / डॉक्टर पर्ची स्कैन करें'
                    : 'Scan Lab Report & Doctor Rx'}
                </span>
              </button>
              <button
                onClick={() => onNavigateToTab('anatomy')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-950/80 text-white font-bold text-xs border border-emerald-400/40 backdrop-blur-sm transition-all"
              >
                <HeartPulse className="w-4 h-4 text-emerald-300" />
                <span>{t('nav.anatomy')}</span>
              </button>
              {latestReport && (
                <button
                  onClick={() => onSelectReport(latestReport)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/25 hover:bg-teal-500/35 text-teal-100 font-bold text-xs border border-teal-400/30 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-teal-300" />
                  <span>
                    {lang === 'hi'
                      ? 'पूर्ण संयुक्त रिपोर्ट देखें'
                      : 'Full Combined Rx + Lab Report'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Right Vitality Gauge Infographic Card */}
          <div className="lg:col-span-4 flex items-center justify-between lg:justify-end gap-4 bg-black/25 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                {lang === 'hi' ? 'समग्र स्वास्थ्य स्कोर' : 'Composite Vitality Index'}
              </div>
              <div className="text-3xl font-black font-mono tabular-nums text-white">
                {organHealthInfographics.overallScore}
                <span className="text-sm font-normal text-emerald-300">/100</span>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? '+14 अंक सुधार (जुलाई से)'
                    : '+14 pts improvement since July'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80">
                Based on {reports.length} chronological lab & Rx records
              </p>
            </div>

            {/* Radial SVG Progress Ring */}
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    32 *
                    (1 - organHealthInfographics.overallScore / 100)
                  }
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <span className="text-[10px] font-mono tabular-nums font-bold text-white">
                  {organHealthInfographics.overallScore}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Top KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {reports.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Verified Medical Reports
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {prescriptionsCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Linked Doctor Prescriptions
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
              {normalRows.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              In-Range Biomarkers
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black font-mono tabular-nums text-rose-600 dark:text-rose-400">
              {abnormalRows.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Flagged Across History
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: Recharts Historical Trend Chart with Visual Directional Arrows & Status Badges */}
      {trendData.length > 0 && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
          {/* Header & Metric Category Selector Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'पिछली रिपोर्ट से तुलना और ट्रेंड संकेतक (Report-Over-Report Visual Deltas)'
                    : 'Longitudinal Recharts Trends with Step-Change Indicators'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {lang === 'hi'
                  ? 'रक्तचाप (BP), शुगर (Glucose) और कोलेस्ट्रॉल में परिवर्तन'
                  : 'Blood Pressure, Glucose & Cholesterol Variations vs. Previous Report'}
              </h3>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
              {(
                [
                  {
                    id: 'overview',
                    labelEn: 'All Key Metrics',
                    labelHi: 'सभी प्रमुख मापदंड',
                  },
                  {
                    id: 'bp',
                    labelEn: 'Blood Pressure (BP)',
                    labelHi: 'रक्तचाप (BP)',
                  },
                  {
                    id: 'glucose',
                    labelEn: 'Glucose & HbA1c',
                    labelHi: 'शुगर (Glucose)',
                  },
                  {
                    id: 'cholesterol',
                    labelEn: 'Cholesterol & Lipids',
                    labelHi: 'कोलेस्ट्रॉल (Lipids)',
                  },
                  {
                    id: 'organs',
                    labelEn: 'Liver & Kidney',
                    labelHi: 'लिवर और किडनी',
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  {lang === 'hi' ? tab.labelHi : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Indicator Cards Comparing Latest Report vs Immediately Previous Report */}
          {latestTrendPoint && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">
                  {previousTrendPoint
                    ? lang === 'hi'
                      ? `पिछली रिपोर्ट (${previousTrendPoint.date}) बनाम नवीनतम रिपोर्ट (${latestTrendPoint.date}) में परिवर्तन:`
                      : `Step-Change Comparison: Previous Report (${previousTrendPoint.date}) → Latest Report (${latestTrendPoint.date})`
                    : 'Latest Report Baseline Metrics'}
                </span>
                <span className="inline-flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Positive Clinical Shift
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Elevated / Needs Watch
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {activeCategoryMetricKeys.map((mKey) => {
                  const cfg = METRIC_CONFIGS[mKey];
                  const deltaInfo = latestTrendPoint.deltas[mKey];
                  if (!deltaInfo || deltaInfo.current === null) return null;

                  const isPositive =
                    deltaInfo.status === 'optimal' ||
                    deltaInfo.status === 'improved';
                  const isNegative =
                    deltaInfo.status === 'worsened' ||
                    deltaInfo.status === 'elevated';

                  return (
                    <div
                      key={mKey}
                      onClick={() =>
                        onNavigateToAnatomy && onNavigateToAnatomy(cfg.organ)
                      }
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isPositive
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 hover:border-emerald-400'
                          : isNegative
                          ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 hover:border-rose-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                          {lang === 'hi' ? cfg.labelHi : cfg.labelEn}
                        </span>
                        {/* Color-coded status badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200'
                              : isNegative
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/70 dark:text-rose-200'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                          }`}
                        >
                          {lang === 'hi'
                            ? deltaInfo.badgeTextHi
                            : deltaInfo.badgeTextEn}
                        </span>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between gap-2">
                        <div className="text-xl font-black font-mono tabular-nums text-slate-900 dark:text-white">
                          {deltaInfo.current}{' '}
                          <span className="text-[11px] font-normal text-slate-500">
                            {cfg.unit}
                          </span>
                        </div>

                        {/* Directional Arrow & Delta vs Previous Report */}
                        {deltaInfo.delta !== null && deltaInfo.delta !== 0 ? (
                          <div
                            className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-lg font-mono tabular-nums text-xs font-black ${
                              isPositive
                                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                                : isNegative
                                ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
                                : 'bg-slate-600 text-white'
                            }`}
                            title={`Previous report: ${deltaInfo.previous} ${cfg.unit}`}
                          >
                            {deltaInfo.delta > 0 ? (
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {deltaInfo.delta > 0 ? '+' : ''}
                              {deltaInfo.delta}
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 text-xs font-mono text-slate-400">
                            <Minus className="w-3 h-3" /> 0
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
                        <span>
                          Prev:{' '}
                          <strong className="text-slate-700 dark:text-slate-300">
                            {deltaInfo.previous ?? '--'}
                          </strong>
                        </span>
                        <span>
                          Target: {cfg.normalMin}–{cfg.normalMax}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recharts Canvas with Custom SVG Directional Arrow Badges on Data Points */}
          <div className="h-80 w-full pt-3">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trendData}
                margin={{ top: 26, right: 24, left: 4, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cholGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                  domain={['auto', 'auto']}
                />
                <Tooltip content={renderCustomTooltip} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />

                {/* Category 1: All Key Metrics Overview */}
                {selectedCategory === 'overview' && (
                  <>
                    <Area
                      type="monotone"
                      dataKey="cholesterol"
                      name="Total Cholesterol (mg/dL)"
                      stroke="#f43f5e"
                      fill="url(#cholGrad)"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="cholesterol"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="systolicBP"
                      name="Systolic BP (mmHg)"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="systolicBP"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      name="Fasting Glucose (mg/dL)"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="glucose"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolicBP"
                      name="Diastolic BP (mmHg)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="diastolicBP"
                          showInlineBadge={false}
                        />
                      )}
                      connectNulls
                    />
                  </>
                )}

                {/* Category 2: Blood Pressure (Systolic, Diastolic, Heart Rate) */}
                {selectedCategory === 'bp' && (
                  <>
                    <ReferenceLine
                      y={120}
                      stroke="#06b6d4"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Normal Systolic (120 mmHg)',
                        position: 'insideTopRight',
                        fill: '#06b6d4',
                        fontSize: 10,
                      }}
                    />
                    <ReferenceLine
                      y={80}
                      stroke="#3b82f6"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Normal Diastolic (80 mmHg)',
                        position: 'insideBottomRight',
                        fill: '#3b82f6',
                        fontSize: 10,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="systolicBP"
                      name="Systolic BP (mmHg)"
                      stroke="#06b6d4"
                      fill="url(#bpGrad)"
                      strokeWidth={3}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="systolicBP"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolicBP"
                      name="Diastolic BP (mmHg)"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="diastolicBP"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      name="Pulse Rate (bpm)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="heartRate"
                          showInlineBadge={false}
                        />
                      )}
                      connectNulls
                    />
                  </>
                )}

                {/* Category 3: Glucose & HbA1c */}
                {selectedCategory === 'glucose' && (
                  <>
                    <ReferenceLine
                      y={99}
                      stroke="#10b981"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Normal Fasting Upper Limit (99 mg/dL)',
                        position: 'insideTopRight',
                        fill: '#10b981',
                        fontSize: 10,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="glucose"
                      name="Fasting Blood Glucose (mg/dL)"
                      stroke="#10b981"
                      fill="url(#glucoseGrad)"
                      strokeWidth={3}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="glucose"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="hba1c"
                      name="HbA1c (%)"
                      stroke="#8b5cf6"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="hba1c"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                  </>
                )}

                {/* Category 4: Cholesterol & Lipids */}
                {selectedCategory === 'cholesterol' && (
                  <>
                    <ReferenceLine
                      y={200}
                      stroke="#f43f5e"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Desirable Total Cholesterol (<200 mg/dL)',
                        position: 'insideTopRight',
                        fill: '#f43f5e',
                        fontSize: 10,
                      }}
                    />
                    <ReferenceLine
                      y={100}
                      stroke="#fb923c"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Optimal LDL (<100 mg/dL)',
                        position: 'insideBottomRight',
                        fill: '#fb923c',
                        fontSize: 10,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="cholesterol"
                      name="Total Cholesterol (mg/dL)"
                      stroke="#f43f5e"
                      fill="url(#cholGrad)"
                      strokeWidth={3}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="cholesterol"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="ldl"
                      name="LDL Cholesterol (mg/dL)"
                      stroke="#fb923c"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="ldl"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="triglycerides"
                      name="Triglycerides (mg/dL)"
                      stroke="#eab308"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="triglycerides"
                          showInlineBadge={false}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="hdl"
                      name="HDL Cholesterol (mg/dL)"
                      stroke="#14b8a6"
                      strokeWidth={2}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="hdl"
                          showInlineBadge={false}
                        />
                      )}
                      connectNulls
                    />
                  </>
                )}

                {/* Category 5: Liver (SGPT/ALT) & Renal (Creatinine) */}
                {selectedCategory === 'organs' && (
                  <>
                    <ReferenceLine
                      y={40}
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Normal SGPT/ALT Upper Limit (40 U/L)',
                        position: 'insideTopRight',
                        fill: '#f97316',
                        fontSize: 10,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="alt"
                      name="SGPT / ALT (U/L)"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="alt"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="creatinine"
                      name="Serum Creatinine (mg/dL)"
                      stroke="#0ea5e9"
                      strokeWidth={2.5}
                      dot={(props) => (
                        <CustomTrendDot
                          key={props.key}
                          {...props}
                          metricKey="creatinine"
                          showInlineBadge={true}
                        />
                      )}
                      connectNulls
                    />
                  </>
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* SECTION 2: Simple, Everyday AI Health Insights Hub ("AI Insights in Simple Words") */}
      {latestReport && (
        <div className="p-6 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/20 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/60 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'सरल भाषा में AI स्वास्थ्य सारांश (AI Insights in Simple Words)'
                    : 'Plain-Language AI Health Synthesis & Daily Takeaways'}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                {lang === 'hi'
                  ? 'आपकी नवीनतम रिपोर्ट और डॉक्टर की पर्ची का आसान मतलब'
                  : 'What Your Latest Test Results & Doctor Prescription Mean for You'}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setSimpleInsightMode('simple')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  simpleInsightMode === 'simple'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {lang === 'hi' ? 'सरल भाषा (Simple)' : 'Simple Everyday Guide'}
              </button>
              <button
                onClick={() => setSimpleInsightMode('clinical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  simpleInsightMode === 'clinical'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {lang === 'hi' ? 'क्लिनिकल विवरण' : 'Clinical Synthesis'}
              </button>
            </div>
          </div>

          {/* 3-Column Simple AI Insights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: What Improved */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-emerald-200/80 dark:border-emerald-900/50 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {lang === 'hi'
                      ? '1. क्या बेहतर हुआ है'
                      : '1. What Improved vs. Last Report'}
                  </span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Great Progress
                </span>
              </div>

              {simpleInsightMode === 'simple' ? (
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <ArrowDownRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {lang === 'hi'
                        ? 'आपका रक्तचाप (BP) 136/86 से घटकर 126/80 mmHg पर आ गया है — दिल पर दबाव कम हुआ है।'
                        : 'Blood Pressure dropped from 136/86 to 126/80 mmHg — much closer to the ideal 120/80 target.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowDownRight className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {lang === 'hi'
                        ? 'कुल कोलेस्ट्रॉल 228 से घटकर 194 mg/dL (सामान्य सीमा) में आ गया है और लिवर एंजाइम (SGPT 32 U/L) पूरी तरह सामान्य हैं।'
                        : 'Total Cholesterol normalized into the green zone (228 → 194 mg/dL) and Liver SGPT recovered to 32 U/L.'}
                    </span>
                  </li>
                </ul>
              ) : (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === 'hi'
                    ? latestReport.aiSummaryHi || latestReport.aiSummaryEn
                    : latestReport.aiSummaryEn}
                </p>
              )}
            </div>

            {/* Card 2: What Needs Attention */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-amber-200/80 dark:border-amber-900/50 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>
                    {lang === 'hi'
                      ? '2. किस पर ध्यान दें'
                      : '2. Gentle Watch Areas'}
                  </span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Borderline
                </span>
              </div>

              {simpleInsightMode === 'simple' ? (
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {lang === 'hi'
                        ? 'फास्टिंग शुगर 118 से घटकर 106 mg/dL हुई है, लेकिन आदर्श लक्ष्य (<99 mg/dL) से थोड़ी ऊपर है।'
                        : 'Fasting Sugar improved from 118 to 106 mg/dL, just slightly above the <99 mg/dL normal threshold.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <span>
                      {lang === 'hi'
                        ? 'एलडीएल (खराब कोलेस्ट्रॉल) 142 से घटकर 112 mg/dL हुआ है; इसे 100 mg/dL के नीचे लाने के लिए रात की दवा जारी रखें।'
                        : 'LDL (bad cholesterol) fell from 142 to 112 mg/dL; keep taking your evening statin to reach <100 mg/dL.'}
                    </span>
                  </li>
                </ul>
              ) : (
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {lang === 'hi'
                    ? latestReport.combinedSynthesisHi ||
                      latestReport.combinedSynthesisEn
                    : latestReport.combinedSynthesisEn}
                </p>
              )}
            </div>

            {/* Card 3: Simple Daily Action Plan from Prescription */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-950/70 border border-teal-200/80 dark:border-teal-900/50 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  <Stethoscope className="w-4 h-4" />
                  <span>
                    {lang === 'hi'
                      ? '3. डॉक्टर का दैनिक सुझाव'
                      : "3. Doctor's Daily Action Plan"}
                  </span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  Rx Linked
                </span>
              </div>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {(lang === 'hi'
                  ? latestReport.actionableRecommendationsHi ||
                    latestReport.actionableRecommendationsEn
                  : latestReport.actionableRecommendationsEn
                )
                  ?.slice(0, 2)
                  .map((rec, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{rec}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Vibrant Visual Infographics — Organ Wellness Matrix & Biomarker Spectrum Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Columns: Organ System Wellness Infographics */}
        <div className="lg:col-span-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'अंग प्रणाली स्वास्थ्य स्कोर'
                    : 'Organ System Health Infographics'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {lang === 'hi'
                  ? '3D अंगों की स्थिति (क्लिक करके 3D में देखें)'
                  : 'System Readiness & 3D Anatomy Links'}
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {organHealthInfographics.systems.map((sys) => {
              const isOptimal = sys.status === 'optimal';
              const isWatch = sys.status === 'watch';

              return (
                <div
                  key={sys.key}
                  onClick={() =>
                    onNavigateToAnatomy
                      ? onNavigateToAnatomy(sys.key, sys.primaryRow)
                      : onNavigateToTab('anatomy')
                  }
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-emerald-500 transition-all cursor-pointer group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: sys.color }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                        {lang === 'hi' ? sys.nameHi : sys.nameEn}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isOptimal
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : isWatch
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {sys.flaggedCount === 0
                          ? lang === 'hi'
                            ? 'सामान्य (Optimal)'
                            : 'Optimal'
                          : `${sys.flaggedCount} Watch`}
                      </span>
                      <span className="text-xs font-black font-mono tabular-nums text-slate-900 dark:text-white">
                        {sys.score}%
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Vibrant Segmented Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOptimal
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : isWatch
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          : 'bg-gradient-to-r from-rose-500 to-orange-400'
                      }`}
                      style={{ width: `${sys.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Columns: Visual Range Spectrum Infographics (Previous vs. Current Pin) */}
        <div className="lg:col-span-7 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <Activity className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'बायोमार्कर रेंज स्पेक्ट्रम इन्फोग्राफिक्स'
                    : 'Biomarker Target Zone Spectrum Infographics'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {lang === 'hi'
                  ? 'आदर्श हरी सीमा (Green Zone) में आपकी वर्तमान और पिछली स्थिति'
                  : 'Where Your Readings Sit Inside the Clinical Reference Spectrum'}
              </h3>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-slate-400 bg-white" />
                Previous Report
              </span>
              <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Latest Reading
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {spectrumMetrics.slice(0, 6).map((item) => {
              const { cfg, info, currentPct, prevPct, normalStartPct, normalEndPct } =
                item;
              const isGood =
                info.status === 'optimal' || info.status === 'improved';

              return (
                <div
                  key={cfg.key}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {lang === 'hi' ? cfg.labelHi : cfg.labelEn}
                      </span>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400">
                        (Target: {cfg.normalMin}–{cfg.normalMax} {cfg.unit})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      {info.previous !== null && (
                        <span className="text-[11px] text-slate-400">
                          {info.previous} →
                        </span>
                      )}
                      <span className="font-black text-slate-900 dark:text-white">
                        {info.current} {cfg.unit}
                      </span>
                      {info.delta !== null && info.delta !== 0 && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isGood
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {info.delta > 0 ? '↑' : '↓'}
                          {Math.abs(info.delta)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3-Zone Visual Spectrum Track */}
                  <div className="relative h-3 w-full rounded-full bg-rose-200/70 dark:bg-rose-950/60 overflow-visible">
                    {/* Optimal Green Zone Band */}
                    <div
                      className="absolute top-0 bottom-0 bg-emerald-400/75 dark:bg-emerald-500/50 rounded-full"
                      style={{
                        left: `${normalStartPct}%`,
                        width: `${Math.max(8, normalEndPct - normalStartPct)}%`,
                      }}
                    />

                    {/* Previous Report Ghost Pin */}
                    {prevPct !== null && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-400 z-10"
                        style={{ left: `${prevPct}%` }}
                        title={`Previous: ${info.previous} ${cfg.unit}`}
                      />
                    )}

                    {/* Current Report Active Pin */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md z-20 ${
                        isGood ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}
                      style={{ left: `${currentPct}%` }}
                      title={`Current: ${info.current} ${cfg.unit}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 4: Active Doctor's Prescription (Rx) Daily Visual Schedule Infographic */}
      {rxScheduleSlots.total > 0 && latestReport?.prescriptionDetails && (
        <div className="p-6 rounded-3xl border border-teal-200 dark:border-teal-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                <Pill className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'दैनिक दवा समय-सारणी इन्फोग्राफिक (Daily Rx Visual Schedule)'
                    : 'Active Prescription (Rx) Daily Timing Infographic'}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                {latestReport.prescriptionDetails.doctorName} ·{' '}
                {latestReport.prescriptionDetails.diagnosis}
              </h3>
            </div>

            <button
              onClick={() => onSelectReport(latestReport)}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View Full Rx & Drug-Biomarker Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Morning Slot */}
            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/15 border border-amber-200/70 dark:border-amber-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 dark:text-amber-300 uppercase">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'hi' ? 'सुबह (Morning)' : 'Morning Dose'}</span>
                </span>
                <span className="text-[11px] font-mono tabular-nums font-bold text-amber-700 dark:text-amber-400">
                  {rxScheduleSlots.morning.length} Meds
                </span>
              </div>
              {rxScheduleSlots.morning.length > 0 ? (
                <div className="space-y-2">
                  {rxScheduleSlots.morning.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {m.name}{' '}
                        <span className="font-mono text-teal-600">({m.dosage})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.timing} · {m.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No morning medications scheduled.</p>
              )}
            </div>

            {/* Afternoon Slot */}
            <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/15 border border-sky-200/70 dark:border-sky-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-sky-800 dark:text-sky-300 uppercase">
                  <Sunset className="w-4 h-4 text-sky-500" />
                  <span>
                    {lang === 'hi' ? 'दोपहर (Afternoon)' : 'Afternoon / Lunch'}
                  </span>
                </span>
                <span className="text-[11px] font-mono tabular-nums font-bold text-sky-700 dark:text-sky-400">
                  {rxScheduleSlots.afternoon.length} Meds
                </span>
              </div>
              {rxScheduleSlots.afternoon.length > 0 ? (
                <div className="space-y-2">
                  {rxScheduleSlots.afternoon.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-sky-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {m.name}{' '}
                        <span className="font-mono text-teal-600">({m.dosage})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.timing} · {m.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Hydration & balanced low-GI lunch recommended.
                </p>
              )}
            </div>

            {/* Night / Dinner Slot */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-200/70 dark:border-indigo-900/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  <span>
                    {lang === 'hi' ? 'रात (Night / Dinner)' : 'Evening / Bedtime'}
                  </span>
                </span>
                <span className="text-[11px] font-mono tabular-nums font-bold text-indigo-700 dark:text-indigo-400">
                  {rxScheduleSlots.night.length} Meds
                </span>
              </div>
              {rxScheduleSlots.night.length > 0 ? (
                <div className="space-y-2">
                  {rxScheduleSlots.night.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="font-bold text-slate-900 dark:text-white">
                        {m.name}{' '}
                        <span className="font-mono text-teal-600">({m.dosage})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {m.timing} · {m.frequency}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No evening medications scheduled.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Chronological Medical Reports & Linked Prescriptions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Chronological Health Records & Linked Prescriptions</span>
          </h3>
          <button
            onClick={() => onNavigateToTab('scanner')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Scan New Report / Doctor Rx
          </button>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => {
            const highCount = rep.rows.filter((r) => r.status === 'high').length;
            const lowCount = rep.rows.filter((r) => r.status === 'low').length;
            const hasRx = Boolean(
              rep.prescriptionDetails &&
                (rep.prescriptionDetails.medications.length > 0 ||
                  rep.prescriptionDetails.doctorName)
            );
            const vitals = rep.vitals || rep.prescriptionDetails?.vitals;

            return (
              <div
                key={rep.id}
                className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {rep.title}
                    </h4>
                    {highCount + lowCount > 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        {highCount + lowCount} Flagged
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        All Normal
                      </span>
                    )}
                    {hasRx && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        <span>
                          Rx ({rep.prescriptionDetails?.medications.length || 0}{' '}
                          meds)
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{rep.date}</span>
                    <span>·</span>
                    <span>{rep.labName || 'Diagnostic Lab'}</span>
                    {rep.prescriptionDetails?.doctorName && (
                      <>
                        <span>·</span>
                        <span className="text-teal-600 dark:text-teal-400 font-sans font-medium">
                          {rep.prescriptionDetails.doctorName}
                        </span>
                      </>
                    )}
                    {vitals?.systolicBP && vitals?.diastolicBP && (
                      <>
                        <span>·</span>
                        <span className="text-slate-600 dark:text-slate-300">
                          BP: {vitals.systolicBP}/{vitals.diastolicBP} mmHg
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWhatsAppShare(rep)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onSelectReport(rep)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <span>
                      {hasRx ? 'View Combined Rx + Insights' : 'View AI Insights'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
