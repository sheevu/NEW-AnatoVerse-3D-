import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalReport, OrganKey, TestRow } from '../../types';
import { getEducationalInsight, ORGANS } from '../../services/medicalRules';
import { buildLocalCombinedInsights } from '../../services/aiInsights';
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
  Stethoscope,
  Pill,
  Activity,
  ClipboardList,
  Clock,
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

  // Compute combined Rx + Lab synthesis (uses saved AI synthesis or falls back to deterministic pharmacological synthesis)
  const combinedData = useMemo(() => {
    const localFallback = buildLocalCombinedInsights(
      report.rows,
      report.prescriptionDetails,
      report.doctorNotes
    );
    return {
      combinedSynthesisEn:
        report.combinedSynthesisEn || localFallback.combinedSynthesisEn,
      combinedSynthesisHi:
        report.combinedSynthesisHi || localFallback.combinedSynthesisHi,
      medicineCorrelations:
        report.medicineCorrelations && report.medicineCorrelations.length > 0
          ? report.medicineCorrelations
          : localFallback.medicineCorrelations,
      actionableRecommendationsEn:
        report.actionableRecommendationsEn &&
        report.actionableRecommendationsEn.length > 0
          ? report.actionableRecommendationsEn
          : localFallback.actionableRecommendationsEn,
      actionableRecommendationsHi:
        report.actionableRecommendationsHi &&
        report.actionableRecommendationsHi.length > 0
          ? report.actionableRecommendationsHi
          : localFallback.actionableRecommendationsHi,
    };
  }, [report]);

  const rx = report.prescriptionDetails;
  const vitals = report.vitals || rx?.vitals;
  const hasRx = Boolean(
    rx &&
      (rx.medications.length > 0 ||
        rx.doctorName ||
        rx.diagnosis ||
        rx.adviceNotes)
  );

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedQuestion(idx);
    setTimeout(() => setCopiedQuestion(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1.5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>
                {hasRx
                  ? lang === 'hi'
                    ? 'संयुक्त लैब रिपोर्ट + डॉक्टर पर्ची (Rx) सारांश'
                    : 'Unified Diagnostic Report & Doctor Prescription Synthesis'
                  : t('insights.title')}
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">{report.title}</h2>
            <p className="text-xs text-emerald-100 mt-1 font-mono tabular-nums">
              {report.labName} · {report.date}
              {rx?.doctorName ? ` · Rx: ${rx.doctorName}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onNavigateToAnatomy(
                  abnormalRows[0]?.organ || undefined,
                  abnormalRows[0]
                )
              }
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

        {/* Plain-Language Lab Summary Box */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-black/25 border border-white/10 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('insights.summaryHeading')}</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-emerald-50 font-normal">
              {lang === 'hi'
                ? report.aiSummaryHi || report.aiSummaryEn
                : report.aiSummaryEn}
            </p>
          </div>

          {/* Combined Doctor's Prescription + Lab Synthesis Box */}
          <div className="p-4 rounded-2xl bg-teal-950/50 border border-teal-400/25 backdrop-blur-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'डॉक्टर की पर्ची (Rx) और जांच रिपोर्ट का संयुक्त निष्कर्ष'
                  : 'Combined Prescription (Rx) & Lab Test Clinical Synthesis'}
              </span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed text-teal-50 font-normal">
              {lang === 'hi'
                ? combinedData.combinedSynthesisHi
                : combinedData.combinedSynthesisEn}
            </p>
          </div>
        </div>

        {/* Recorded Clinic Vitals Strip (if available from Prescription or Report) */}
        {vitals &&
          (vitals.systolicBP ||
            vitals.diastolicBP ||
            vitals.heartRate ||
            vitals.spO2 ||
            vitals.weightKg) && (
            <div className="mt-4 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                <Activity className="w-4 h-4 text-emerald-300" />
                <span>
                  {lang === 'hi'
                    ? 'क्लिनिक में दर्ज वाइटल संकेत (Vitals)'
                    : 'Recorded Clinical Vitals on Prescription'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
                {vitals.systolicBP && vitals.diastolicBP && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                    <span className="text-emerald-300 mr-1.5">BP:</span>
                    <span className="font-bold text-white">
                      {vitals.systolicBP}/{vitals.diastolicBP} mmHg
                    </span>
                  </div>
                )}
                {vitals.heartRate && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                    <span className="text-emerald-300 mr-1.5">Pulse:</span>
                    <span className="font-bold text-white">
                      {vitals.heartRate} bpm
                    </span>
                  </div>
                )}
                {vitals.spO2 && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                    <span className="text-emerald-300 mr-1.5">SpO2:</span>
                    <span className="font-bold text-white">{vitals.spO2}%</span>
                  </div>
                )}
                {vitals.weightKg && (
                  <div className="px-3 py-1.5 rounded-xl bg-black/25 border border-white/10">
                    <span className="text-emerald-300 mr-1.5">Weight:</span>
                    <span className="font-bold text-white">
                      {vitals.weightKg} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
      </div>

      {/* Extracted Doctor's Prescription & Medication Schedule Card */}
      {hasRx && rx && (
        <div className="p-5 sm:p-6 rounded-3xl border border-teal-200 dark:border-teal-900/60 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
                <Stethoscope className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? 'स्कैन की गई डॉक्टर की पर्ची (Extracted Prescription Details)'
                    : "Extracted Doctor's Prescription (Rx) & Treatment Plan"}
                </span>
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {rx.doctorName || 'Attending Physician'}
                {rx.specialty ? ` · ${rx.specialty}` : ''}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {rx.clinicName || report.labName}
                {rx.rxDate ? ` · ${rx.rxDate}` : ''}
                {rx.followUpDate ? ` · Follow-up: ${rx.followUpDate}` : ''}
              </p>
            </div>

            {rx.diagnosis && (
              <div className="px-3.5 py-2 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800/70 max-w-md">
                <div className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                  {lang === 'hi' ? 'प्राथमिक निदान (Diagnosis)' : 'Clinical Diagnosis'}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                  {rx.diagnosis}
                </div>
              </div>
            )}
          </div>

          {/* Prescribed Medications Table */}
          {rx.medications.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    {lang === 'hi'
                      ? `निर्धारित दवाएं (${rx.medications.length})`
                      : `Prescribed Medications (${rx.medications.length})`}
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                  OCR + Pharmacological Scraper Verified
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-2.5 px-3 font-bold">Medicine & Purpose</th>
                      <th className="py-2.5 px-3 font-bold">Dosage</th>
                      <th className="py-2.5 px-3 font-bold">Frequency</th>
                      <th className="py-2.5 px-3 font-bold">Timing</th>
                      <th className="py-2.5 px-3 font-bold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800">
                    {rx.medications.map((med) => (
                      <tr
                        key={med.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {med.name}
                          </div>
                          {(med.purposeEn || med.purposeHi) && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {lang === 'hi'
                                ? med.purposeHi || med.purposeEn
                                : med.purposeEn}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums font-semibold text-teal-700 dark:text-teal-400">
                          {med.dosage}
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {med.frequency}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{med.timing}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          {med.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Doctor's Written Advice */}
          {(rx.adviceNotes || report.doctorNotes) && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70 text-xs space-y-1">
              <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ClipboardList className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {lang === 'hi'
                    ? 'डॉक्टर की सलाह और निर्देश'
                    : "Physician's Clinical Advice & Notes"}
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {rx.adviceNotes || report.doctorNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Prescription ↔ Lab Biomarker Cross-Correlation Matrix */}
      {combinedData.medicineCorrelations.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              <Pill className="w-4 h-4" />
              <span>
                {lang === 'hi'
                  ? `दवा और लैब बायोमार्कर का सह-संबंध (${combinedData.medicineCorrelations.length})`
                  : `Prescription ↔ Lab Biomarker Cross-Correlation (${combinedData.medicineCorrelations.length})`}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              How each prescribed medicine addresses your specific test findings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {combinedData.medicineCorrelations.map((corr, idx) => {
              const organ = corr.organ ? ORGANS[corr.organ] : null;
              const matchingRow = report.rows.find(
                (r) =>
                  r.organ === corr.organ ||
                  r.name
                    .toLowerCase()
                    .includes(corr.linkedBiomarker.split(' ')[0].toLowerCase())
              );

              return (
                <div
                  key={idx}
                  onClick={() =>
                    onNavigateToAnatomy(corr.organ || undefined, matchingRow)
                  }
                  className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/60 bg-teal-50/30 dark:bg-teal-950/20 shadow-sm space-y-2.5 cursor-pointer hover:border-teal-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                        {corr.medicine}{' '}
                        {corr.dosage && (
                          <span className="text-xs font-mono tabular-nums text-teal-700 dark:text-teal-400">
                            ({corr.dosage})
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-teal-700 dark:text-teal-400 mt-0.5">
                        Targets:{' '}
                        <span className="font-mono tabular-nums">
                          {corr.linkedBiomarker}
                        </span>
                      </div>
                    </div>

                    {organ && (
                      <span
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg text-white flex-shrink-0"
                        style={{ backgroundColor: organ.color }}
                      >
                        {lang === 'hi' ? organ.nameHi : organ.nameEn}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {lang === 'hi'
                      ? corr.clinicalRationaleHi || corr.clinicalRationaleEn
                      : corr.clinicalRationaleEn}
                  </p>

                  <div className="pt-2 border-t border-teal-200/60 dark:border-teal-900/50 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400 truncate">
                      {lang === 'hi'
                        ? corr.precautionNoteHi || corr.precautionNoteEn
                        : corr.precautionNoteEn}
                    </span>
                    {organ && (
                      <span className="font-bold text-teal-700 dark:text-teal-400 flex items-center gap-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform">
                        <span>3D Organ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actionable Recommendations & Next Steps (Derived from Combined Lab + Rx) */}
      {(lang === 'hi'
        ? combinedData.actionableRecommendationsHi
        : combinedData.actionableRecommendationsEn
      ).length > 0 && (
        <div className="p-5 rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>
              {lang === 'hi'
                ? 'उपयोगी सुझाव और जीवनशैली कार्ययोजना (Actionable Insights)'
                : 'Actionable Clinical & Lifestyle Recommendations'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {(lang === 'hi'
              ? combinedData.actionableRecommendationsHi
              : combinedData.actionableRecommendationsEn
            ).map((rec, i) => (
              <div
                key={i}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/70 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-mono tabular-nums font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {rec}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Abnormal / Flagged Biomarkers Section */}
      {abnormalRows.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>
                Flagged Observations Requiring Discussion ({abnormalRows.length})
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click any card to inspect in 3D Anatomy
            </span>
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
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                        Target Range: {row.range} {row.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black font-mono tabular-nums text-red-600 dark:text-red-400">
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
            <span>
              Biomarkers Within Normal Reference Thresholds ({normalRows.length})
            </span>
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
                  <div className="text-[11px] text-slate-400 font-mono tabular-nums">
                    Target: {row.range} {row.unit}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono tabular-nums text-xs text-emerald-700 dark:text-emerald-400">
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
          Save time during your next doctor consultation by asking these tailored
          questions:
        </p>

        <div className="space-y-2">
          {report.rows.slice(0, 3).map((r, i) => {
            const insight = getEducationalInsight(r, lang);
            const questionText =
              lang === 'hi'
                ? insight.doctorQuestions.hi
                : insight.doctorQuestions.en;

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
