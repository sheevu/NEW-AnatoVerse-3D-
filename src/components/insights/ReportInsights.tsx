import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalReport, OrganKey, TestRow } from '../../types';
import { getEducationalInsight, ORGANS } from '../../services/medicalRules';
import {
  Sparkles,
  Share2,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

interface ReportInsightsProps {
  report: MedicalReport;
  onNavigateToAnatomy: (organKey?: OrganKey, finding?: TestRow) => void;
  onOpenWhatsAppShare: (report: MedicalReport) => void;
}

export function ReportInsights({
  report,
  onNavigateToAnatomy,
  onOpenWhatsAppShare,
}: ReportInsightsProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [copiedQuestion, setCopiedQuestion] = useState<number | null>(null);

  const abnormalRows = report.rows.filter(
    (r) => r.status === 'high' || r.status === 'low'
  );
  const normalRows = report.rows.filter((r) => r.status === 'within');

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(idx);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t('insights.title')}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{report.title}</h2>
            <p className="text-xs text-emerald-100 mt-1">
              {report.labName} • {report.date}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToAnatomy(abnormalRows[0]?.organ || undefined, abnormalRows[0])}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-black backdrop-blur-sm border border-white/20 shadow-md transition-all group"
            >
              <HeartPulse className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
              <span>{t('insights.viewIn3D')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenWhatsAppShare(report)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs shadow-lg transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('insights.shareWhatsApp')}</span>
            </button>
          </div>
        </div>

        {/* Plain-Language Summary Box */}
        <div className="mt-5 p-4 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('insights.summaryHeading')}</span>
          </h4>
          <p className="text-sm leading-relaxed text-emerald-50 font-normal">
            {lang === 'hi'
              ? report.aiSummaryHi || report.aiSummaryEn
              : report.aiSummaryEn}
          </p>
        </div>
      </div>

      {/* Abnormal / Flagged Biomarkers Section */}
      {abnormalRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Flagged Observations Requiring Discussion ({abnormalRows.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Click any card to inspect in 3D Anatomy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {abnormalRows.map((row) => {
              const info = getEducationalInsight(row, lang);
              const organ = row.organ ? ORGANS[row.organ] : null;

              return (
                <div
                  key={row.id}
                  onClick={() => onNavigateToAnatomy(row.organ || undefined, row)}
                  className="p-4 rounded-2xl border border-red-200 dark:border-red-950 bg-red-50/40 dark:bg-red-950/20 shadow-sm space-y-2.5 cursor-pointer hover:border-red-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-red-600 transition-colors">
                        {row.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Target Range: {row.range} {row.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-red-600 dark:text-red-400">
                        {row.value} <span className="text-xs">{row.unit}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">
                        {info.statusBadge}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {info.explanation}
                  </p>

                  {organ && (
                    <div className="pt-2 border-t border-red-200/50 dark:border-red-900/40 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: organ.color }}
                        />
                        <span>
                          {lang === 'hi' ? organ.nameHi : organ.nameEn}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Focus in 3D Anatomy</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Normal Biomarkers Section */}
      {normalRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Biomarkers Within Normal Reference Thresholds ({normalRows.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {normalRows.map((row) => (
              <div
                key={row.id}
                onClick={() => onNavigateToAnatomy(row.organ || undefined, row)}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between cursor-pointer hover:border-emerald-500 hover:shadow-sm transition-all"
              >
                <div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {row.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Target: {row.range} {row.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                    {row.value} {row.unit}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                    Normal
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Discussion Guide */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>{t('insights.questionsHeading')}</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Save time during your next doctor consultation by asking these tailored questions:
        </p>

        <div className="space-y-2">
          {report.rows.slice(0, 3).map((r, i) => {
            const insight = getEducationalInsight(r, lang);
            const questionText =
              lang === 'hi' ? insight.doctorQuestions.hi : insight.doctorQuestions.en;

            return (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
              >
                <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  "{questionText}"
                </p>
                <button
                  onClick={() => handleCopyQuestion(questionText, i)}
                  className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 flex-shrink-0 font-bold"
                  title="Copy question"
                >
                  {copiedQuestion === i ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Clinical Safety Notice</p>
          <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-300">
            {t('insights.safetyNotice')}
          </p>
        </div>
      </div>
    </div>
  );
}
