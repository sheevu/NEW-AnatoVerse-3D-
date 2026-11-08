import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FamilyProfile, MedicalReport, OrganKey } from '../../types';
import {
  Activity,
  ScanLine,
  HeartPulse,
  Pill,
  Calendar,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  Share2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface HealthDashboardProps {
  activeProfile: FamilyProfile | null;
  reports: MedicalReport[];
  onNavigateToTab: (tab: string) => void;
  onSelectReport: (report: MedicalReport) => void;
  onOpenWhatsAppShare: (report: MedicalReport) => void;
}

export function HealthDashboard({
  activeProfile,
  reports,
  onNavigateToTab,
  onSelectReport,
  onOpenWhatsAppShare,
}: HealthDashboardProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  // Compute metrics across reports
  const allRows = useMemo(() => reports.flatMap((r) => r.rows), [reports]);
  const abnormalRows = useMemo(
    () => allRows.filter((r) => r.status === 'high' || r.status === 'low'),
    [allRows]
  );
  const normalRows = useMemo(
    () => allRows.filter((r) => r.status === 'within'),
    [allRows]
  );

  // Historical trend data (e.g. Glucose, Cholesterol)
  const trendData = useMemo(() => {
    return reports
      .slice()
      .reverse()
      .map((r) => {
        const glucose = r.rows.find((row) => /glucose|sugar/i.test(row.name));
        const cholesterol = r.rows.find((row) => /cholesterol/i.test(row.name));
        const alt = r.rows.find((row) => /alt|sgpt/i.test(row.name));
        return {
          date: r.date,
          title: r.title.slice(0, 14) + '...',
          glucose: glucose?.numericValue || null,
          cholesterol: cholesterol?.numericValue || null,
          alt: alt?.numericValue || null,
        };
      })
      .filter((d) => d.glucose || d.cholesterol || d.alt);
  }, [reports]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {activeProfile?.name || 'Rahul Sharma'} •{' '}
              {t(`family.relationships.${activeProfile?.relationship || 'Self'}`)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {lang === 'hi'
              ? 'नमस्ते! आपकी स्वास्थ्य रिपोर्ट और 3D शरीर विश्लेषण तैयार है।'
              : "Welcome! Your Family's Health Insights & 3D Anatomy Are Ready."}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            {t('app.tagline')}
          </p>

          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigateToTab('scanner')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-lg hover:bg-emerald-50 transition-all"
            >
              <ScanLine className="w-4 h-4 text-emerald-700" />
              <span>{t('nav.scanner')}</span>
            </button>
            <button
              onClick={() => onNavigateToTab('anatomy')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-white font-bold text-xs border border-emerald-400/40 backdrop-blur-sm transition-all"
            >
              <HeartPulse className="w-4 h-4 text-emerald-300" />
              <span>{t('nav.anatomy')}</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {reports.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Verified Medical Reports
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
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
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {abnormalRows.length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Flagged For Doctor Review
            </div>
          </div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      {trendData.length > 0 && (
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Biomarker Trajectory Over Time</span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                Metabolic & Liver Trends
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Fasting Glucose (mg/dL)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Cholesterol (mg/dL)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="glucose"
                  name="Fasting Glucose"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cholesterol"
                  name="Cholesterol"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Medical Reports Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Recent Health Records</span>
          </h3>
          <button
            onClick={() => onNavigateToTab('scanner')}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            + Scan New Report
          </button>
        </div>

        <div className="space-y-3">
          {reports.map((rep) => {
            const highCount = rep.rows.filter((r) => r.status === 'high').length;
            const lowCount = rep.rows.filter((r) => r.status === 'low').length;

            return (
              <div
                key={rep.id}
                className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
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
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{rep.date}</span>
                    <span>•</span>
                    <span>{rep.labName || 'Diagnostic Lab'}</span>
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
                    <span>View AI Insights</span>
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
