import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import {
  FileUp,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Stethoscope,
  Pill,
  Activity,
  ClipboardPaste,
  HeartPulse,
  RefreshCw,
} from 'lucide-react';
import {
  TestRow,
  MedicalReport,
  PrescriptionDetails,
  PrescribedMedication,
} from '../../types';
import { organFor, rangeStatus, ORGANS } from '../../services/medicalRules';
import {
  parseMedicalDocument,
  parseDoctorPrescription,
  scrapePrescriptionFromText,
  PRESCRIPTION_PRESETS,
} from '../../services/aiScanner';
import { SAMPLE_REPORTS } from '../../services/sampleReports';
import {
  generateReportInsights,
  buildLocalCombinedInsights,
} from '../../services/aiInsights';

interface ReportScannerProps {
  activeProfileId: string;
  onReportSaved: (report: MedicalReport, targetTab?: 'insights' | 'anatomy') => void;
}

export function ReportScanner({ activeProfileId, onReportSaved }: ReportScannerProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  // Part 1: Lab Report OCR State
  const [isProcessingLab, setIsProcessingLab] = useState(false);
  const [labOcrStatus, setLabOcrStatus] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [labName, setLabName] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [extractedRows, setExtractedRows] = useState<TestRow[] | null>(null);
  const [rawText, setRawText] = useState('');

  // Part 2: Doctor's Prescription OCR & Scraper State
  const [rxInputMode, setRxInputMode] = useState<'upload' | 'scrape'>('upload');
  const [isProcessingRx, setIsProcessingRx] = useState(false);
  const [rxOcrStatus, setRxOcrStatus] = useState<string>('');
  const [scrapeInputText, setScrapeInputText] = useState<string>('');
  const [prescription, setPrescription] = useState<PrescriptionDetails | null>(null);
  const [isSavingReport, setIsSavingReport] = useState(false);

  // Dropzone for Lab Test Report
  const onDropLab = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsProcessingLab(true);
    setLabOcrStatus('Initializing Lab Report OCR engine...');
    try {
      const result = await parseMedicalDocument(file, file.name, (msg) =>
        setLabOcrStatus(msg)
      );
      setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      setReportDate(result.date);
      setLabName(result.labName);
      setExtractedRows(result.rows);
      setRawText(result.extractedText);
    } catch (err) {
      console.error('Lab Scan error:', err);
    } finally {
      setIsProcessingLab(false);
      setLabOcrStatus('');
    }
  }, []);

  const {
    getRootProps: getLabRootProps,
    getInputProps: getLabInputProps,
    isDragActive: isLabDragActive,
  } = useDropzone({
    onDrop: onDropLab,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  // Dropzone for Doctor's Prescription (Rx)
  const onDropRx = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsProcessingRx(true);
    setRxOcrStatus('Scanning Doctor Prescription with OCR & Pharmacology Scraper...');
    try {
      const rxResult = await parseDoctorPrescription(file, file.name, (msg) =>
        setRxOcrStatus(msg)
      );
      setPrescription(rxResult);
      if (rxResult.adviceNotes) {
        setDoctorNotes(rxResult.adviceNotes);
      }
      if (rxResult.rawScrapedText) {
        setScrapeInputText(rxResult.rawScrapedText);
      }
    } catch (err) {
      console.error('Prescription OCR error:', err);
    } finally {
      setIsProcessingRx(false);
      setRxOcrStatus('');
    }
  }, []);

  const {
    getRootProps: getRxRootProps,
    getInputProps: getRxInputProps,
    isDragActive: isRxDragActive,
  } = useDropzone({
    onDrop: onDropRx,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  // Handle Scrape from Pasted Prescription Text
  const handleScrapePrescriptionText = async () => {
    if (!scrapeInputText.trim()) return;
    setIsProcessingRx(true);
    setRxOcrStatus('Scraping Doctor, Vitals, Diagnosis & Medications from text...');
    try {
      const rxResult = await parseDoctorPrescription(
        scrapeInputText,
        'Scraped Doctor Prescription',
        (msg) => setRxOcrStatus(msg)
      );
      setPrescription(rxResult);
      if (rxResult.adviceNotes) {
        setDoctorNotes(rxResult.adviceNotes);
      }
    } catch {
      const fallbackRx = scrapePrescriptionFromText(scrapeInputText);
      setPrescription(fallbackRx);
      setDoctorNotes(fallbackRx.adviceNotes);
    } finally {
      setIsProcessingRx(false);
      setRxOcrStatus('');
    }
  };

  // Handle Lab Preset selection (also loads matching Prescription Preset if none selected yet)
  const handleSelectLabPreset = (idx: number) => {
    const preset = SAMPLE_REPORTS[idx + 1] || SAMPLE_REPORTS[idx] || SAMPLE_REPORTS[0];
    setReportTitle(preset.title);
    setReportDate(preset.date);
    setLabName(preset.labName || 'Apollo Diagnostics');
    setDoctorNotes(preset.doctorNotes || '');
    setExtractedRows(
      preset.rows.map((r, i) => ({ ...r, id: `preset-${Date.now()}-${i}` }))
    );
    if (!prescription && preset.prescriptionDetails) {
      setPrescription({
        ...preset.prescriptionDetails,
        medications: preset.prescriptionDetails.medications.map((m, i) => ({
          ...m,
          id: `rx-preset-${Date.now()}-${i}`,
        })),
      });
      setScrapeInputText(preset.prescriptionDetails.rawScrapedText || '');
    }
  };

  // Handle Prescription Preset selection
  const handleSelectRxPreset = (idx: number) => {
    const rxPreset = PRESCRIPTION_PRESETS[idx] || PRESCRIPTION_PRESETS[0];
    setPrescription({
      ...rxPreset,
      medications: rxPreset.medications.map((m, i) => ({
        ...m,
        id: `rx-p-${Date.now()}-${i}`,
      })),
    });
    setDoctorNotes(rxPreset.adviceNotes);
    setScrapeInputText(rxPreset.rawScrapedText || '');
  };

  // Lab Row update handlers
  const handleRowChange = (id: string, field: keyof TestRow, val: string) => {
    if (!extractedRows) return;
    setExtractedRows((prev) =>
      prev!.map((row) => {
        if (row.id !== id) return row;
        const updated = { ...row, [field]: val };
        if (field === 'name') {
          updated.organ = organFor(val);
        }
        if (field === 'value' || field === 'range') {
          updated.status = rangeStatus({
            value: field === 'value' ? val : row.value,
            range: field === 'range' ? val : row.range,
          });
          const num = parseFloat(field === 'value' ? val : row.value);
          updated.numericValue = isNaN(num) ? undefined : num;
        }
        return updated;
      })
    );
  };

  const handleAddRow = () => {
    const newRow: TestRow = {
      id: `row-${Date.now()}`,
      name: '',
      value: '',
      unit: 'mg/dL',
      range: '70 - 100',
      status: 'unknown',
      organ: null,
    };
    setExtractedRows((prev) => [...(prev || []), newRow]);
  };

  const handleDeleteRow = (id: string) => {
    if (!extractedRows) return;
    setExtractedRows((prev) => prev!.filter((r) => r.id !== id));
  };

  // Prescription Medication Row handlers
  const handleMedChange = (
    id: string,
    field: keyof PrescribedMedication,
    val: string
  ) => {
    if (!prescription) return;
    setPrescription((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        medications: prev.medications.map((m) => {
          if (m.id !== id) return m;
          const updated = { ...m, [field]: val };
          if (field === 'name') {
            updated.targetOrgan = organFor(val) || updated.targetOrgan || 'heart';
          }
          return updated;
        }),
      };
    });
  };

  const handleAddMedication = () => {
    if (!prescription) return;
    const newMed: PrescribedMedication = {
      id: `med-${Date.now()}`,
      name: 'New Prescribed Medicine',
      dosage: '500 mg',
      frequency: '1-0-1 (Twice Daily)',
      timing: 'After meals',
      duration: '30 Days',
      purposeEn: 'Prescribed for targeted clinical management',
      targetOrgan: 'heart',
    };
    setPrescription((prev) =>
      prev ? { ...prev, medications: [...prev.medications, newMed] } : prev
    );
  };

  const handleDeleteMedication = (id: string) => {
    if (!prescription) return;
    setPrescription((prev) =>
      prev
        ? { ...prev, medications: prev.medications.filter((m) => m.id !== id) }
        : prev
    );
  };

  // Live Preview of Combined Insights (when either Lab Rows or Prescription is loaded)
  const effectiveRows = useMemo(() => {
    if (extractedRows && extractedRows.length > 0) return extractedRows;
    if (prescription) {
      // If user only uploaded/scraped a prescription without a lab file, synthesize matching baseline rows from SAMPLE_REPORTS[1]
      return SAMPLE_REPORTS[1].rows;
    }
    return [];
  }, [extractedRows, prescription]);

  const liveSynthesis = useMemo(() => {
    if (effectiveRows.length === 0 && !prescription) return null;
    return buildLocalCombinedInsights(
      effectiveRows,
      prescription || undefined,
      doctorNotes
    );
  }, [effectiveRows, prescription, doctorNotes]);

  // Save Combined Report & Proceed to Final Insights or 3D Anatomy
  const handleSaveAndProceed = async (targetTab: 'insights' | 'anatomy' = 'insights') => {
    if (effectiveRows.length === 0 && !prescription) return;
    setIsSavingReport(true);

    try {
      const aiResult = await generateReportInsights(
        effectiveRows,
        prescription || undefined,
        prescription?.adviceNotes || doctorNotes
      );

      const finalTitle =
        reportTitle.trim() ||
        (prescription && !extractedRows
          ? `Dr. ${prescription.doctorName.replace(/^Dr\.?\s*/i, '')} — Rx & Clinical Assessment`
          : lang === 'hi'
          ? 'एकीकृत लैब और डॉक्टर पर्चा रिपोर्ट'
          : 'Integrated Lab & Prescription Report');

      const newReport: MedicalReport = {
        id: `rep-${Date.now()}`,
        profileId: activeProfileId,
        title: finalTitle,
        date: reportDate || prescription?.rxDate || new Date().toISOString().slice(0, 10),
        labName:
          labName.trim() ||
          prescription?.clinicName ||
          'Verified Diagnostic Laboratory & Clinic',
        type: prescription && !extractedRows ? 'prescription' : 'lab',
        rows: effectiveRows,
        doctorNotes: prescription?.adviceNotes || doctorNotes,
        prescribedMedicines: prescription
          ? prescription.medications.map((m) => `${m.name} ${m.dosage} (${m.frequency})`)
          : undefined,
        prescriptionDetails: prescription || undefined,
        vitals: prescription?.vitals,
        aiSummaryEn: aiResult.summaryEn,
        aiSummaryHi: aiResult.summaryHi,
        combinedSynthesisEn: aiResult.combinedSynthesisEn,
        combinedSynthesisHi: aiResult.combinedSynthesisHi,
        medicineCorrelations: aiResult.medicineCorrelations,
        actionableRecommendationsEn: aiResult.actionableRecommendationsEn,
        actionableRecommendationsHi: aiResult.actionableRecommendationsHi,
        extractedText: rawText || prescription?.rawScrapedText || '',
        verified: true,
        createdAt: new Date().toISOString(),
      };

      onReportSaved(newReport, targetTab);
    } finally {
      setIsSavingReport(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>Multimodal Lab OCR & Doctor Prescription Scraper</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('scanner.title')} & Doctor&apos;s Prescription (Rx)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Scan your diagnostic blood/urine test report and upload or scrape your Doctor&apos;s
            Prescription. VedaShield cross-correlates your prescribed medicines, vitals, and lab
            biomarkers into a unified clinical summary.
          </p>
        </div>

        {/* Status Summary Indicators */}
        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <div
            className={`px-3 py-2 rounded-xl border ${
              extractedRows
                ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
            }`}
          >
            <div className="text-[10px] text-slate-400">01. LAB REPORT</div>
            <div className="font-bold mt-0.5">
              {extractedRows ? `${extractedRows.length} Biomarkers Ready` : 'Awaiting Scan'}
            </div>
          </div>

          <div
            className={`px-3 py-2 rounded-xl border ${
              prescription
                ? 'border-teal-500/50 bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500'
            }`}
          >
            <div className="text-[10px] text-slate-400">02. DOCTOR&apos;S Rx</div>
            <div className="font-bold mt-0.5">
              {prescription
                ? `${prescription.medications.length} Medicines Scraped`
                : 'Optional / Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: MEDICAL TEST REPORT SCANNER (LAB / PATHOLOGY OCR)
      ===================================================================== */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FileText className="w-4 h-4" />
              <span>01. Diagnostic Lab Test Report OCR</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {extractedRows
                ? 'Verified Laboratory Biomarkers'
                : 'Upload Blood / Urine / Pathology Report'}
            </h3>
          </div>

          {extractedRows && (
            <button
              onClick={() => setExtractedRows(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Different Lab Report</span>
            </button>
          )}
        </div>

        {!extractedRows ? (
          <div className="space-y-5">
            {/* Lab Dropzone */}
            <div
              {...getLabRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isLabDragActive
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/50 hover:border-emerald-500'
              }`}
            >
              <input {...getLabInputProps()} />
              {isProcessingLab ? (
                <div className="flex flex-col items-center justify-center space-y-3 py-3">
                  <div className="w-10 h-10 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {labOcrStatus || t('scanner.processing')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2.5">
                  <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <FileUp className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t('scanner.dropzone')}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Extracts Glucose, HbA1c, Lipid Profile, LFT, KFT & CBC tables (PDF, PNG, JPG, WebP)
                  </p>
                </div>
              )}
            </div>

            {/* 1-Click Lab Report Presets */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                Or load a realistic diagnostic report preset (auto-pairs with Doctor&apos;s Rx):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSelectLabPreset(0)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-left hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Preset 01 · Metabolic & Lipid
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {t('scanner.presets.metabolic')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Glucose, HbA1c, Cholesterol, LDL, Creatinine
                  </div>
                </button>

                <button
                  onClick={() => handleSelectLabPreset(1)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-left hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Preset 02 · Hepatic & Enzymes
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {t('scanner.presets.liver')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    SGPT/ALT, SGOT/AST, Lipids, Glucose
                  </div>
                </button>

                <button
                  onClick={() => handleSelectLabPreset(2)}
                  className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-left hover:border-emerald-500 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Preset 03 · CBC & Hemogram
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {t('scanner.presets.cbc')}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Hemoglobin, Glucose, Cholesterol, SGPT
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Editable Lab Report Table */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Comprehensive Blood Profile"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Date
                </label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Laboratory Name
                </label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g. Dr. Lal PathLabs"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">{t('scanner.testName')}</th>
                    <th className="py-2.5 px-3 w-28">{t('scanner.value')}</th>
                    <th className="py-2.5 px-3 w-24">{t('scanner.unit')}</th>
                    <th className="py-2.5 px-3 w-32">{t('scanner.refRange')}</th>
                    <th className="py-2.5 px-3 w-32">{t('scanner.organ')}</th>
                    <th className="py-2.5 px-3 w-24">{t('scanner.status')}</th>
                    <th className="py-2.5 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {extractedRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.name}
                          onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                          className="w-full font-medium bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleRowChange(row.id, 'value', e.target.value)}
                          className="w-full font-bold font-mono tabular-nums bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.unit}
                          onChange={(e) => handleRowChange(row.id, 'unit', e.target.value)}
                          className="w-full text-slate-500 font-mono bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.range}
                          onChange={(e) => handleRowChange(row.id, 'range', e.target.value)}
                          className="w-full text-slate-500 font-mono tabular-nums bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-0.5"
                        />
                      </td>
                      <td className="py-2 px-3">
                        {row.organ ? (
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {lang === 'hi' ? ORGANS[row.organ].nameHi : ORGANS[row.organ].nameEn}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Systemic</span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] font-bold">
                        <span
                          className={
                            row.status === 'within'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : row.status === 'high'
                              ? 'text-rose-600 dark:text-rose-400'
                              : row.status === 'low'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-500'
                          }
                        >
                          {row.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => handleDeleteRow(row.id)}
                          className="text-slate-400 hover:text-rose-500 p-1"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <button
                onClick={handleAddRow}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('scanner.addRow')}</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 2: DOCTOR'S PRESCRIPTION OCR & SCRAPE CAPABILITY
      ===================================================================== */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Stethoscope className="w-4 h-4" />
              <span>02. Doctor&apos;s Prescription OCR & Pharmacological Scraper</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {prescription
                ? `Extracted Prescription — ${prescription.doctorName}`
                : 'Upload or Scrape Doctor’s Prescription (Rx)'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Extract prescribed medicines, dosage schedules, clinic blood pressure vitals, and
              diagnosis notes to cross-correlate with your lab report.
            </p>
          </div>

          {prescription ? (
            <button
              onClick={() => setPrescription(null)}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace / Re-Scrape Prescription</span>
            </button>
          ) : (
            /* Segmented Control: Upload Image/PDF vs Paste & Scrape Text */
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setRxInputMode('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  rxInputMode === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Upload Rx Image / PDF (OCR)
              </button>
              <button
                onClick={() => setRxInputMode('scrape')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  rxInputMode === 'scrape'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Paste & Scrape Rx Text
              </button>
            </div>
          )}
        </div>

        {!prescription ? (
          <div className="space-y-5">
            {rxInputMode === 'upload' ? (
              /* Prescription OCR Dropzone */
              <div
                {...getRxRootProps()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  isRxDragActive
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-950/50 hover:border-teal-500'
                }`}
              >
                <input {...getRxInputProps()} />
                {isProcessingRx ? (
                  <div className="flex flex-col items-center justify-center space-y-3 py-3">
                    <div className="w-10 h-10 rounded-full border-3 border-teal-500 border-t-transparent animate-spin" />
                    <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                      {rxOcrStatus || 'Extracting Doctor Prescription via OCR...'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2.5">
                    <div className="p-3.5 rounded-2xl bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400">
                      <Stethoscope className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Drop your Doctor&apos;s Prescription (Rx) photo or PDF here, or click to browse
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Automatically scrapes Doctor Name, Diagnosis, Vitals (BP/Pulse), Medicine
                      Dosages (1-0-1, OD, BD), Meal Timing & Follow-Up Advice
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Prescription Raw Text / Note Scraper */
              <div className="space-y-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <ClipboardPaste className="w-4 h-4 text-teal-600" />
                    <span>
                      Paste Shared Doctor&apos;s Prescription Text, Clinic Summary, or WhatsApp Rx
                      Note
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setScrapeInputText(PRESCRIPTION_PRESETS[0].rawScrapedText || '')
                    }
                    className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    Fill Sample Prescription Text
                  </button>
                </div>

                <textarea
                  rows={5}
                  value={scrapeInputText}
                  onChange={(e) => setScrapeInputText(e.target.value)}
                  placeholder={`Example:\nDr. Rajeshwar Verma, MD | Apollo Clinic\nVitals: BP 136/86 mmHg | Pulse: 78 bpm\nDiagnosis: Prediabetes & Dyslipidemia\nRx:\n1. Tab. Glycomet SR 500 mg — 1-0-1 After meals x 90 Days\n2. Tab. Atorva 10 mg — 0-0-1 At bedtime x 90 Days\nAdvice: Low sugar & low salt diet, 40 min brisk walk.`}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500 outline-none"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleScrapePrescriptionText}
                    disabled={isProcessingRx || !scrapeInputText.trim()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isProcessingRx
                        ? 'Scraping Prescription Entities...'
                        : 'Scrape & Extract Prescription Details'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* 1-Click Doctor Prescription Presets */}
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5">
                Or click a sample Doctor&apos;s Prescription to scrape & attach immediately:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESCRIPTION_PRESETS.map((rxP, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectRxPreset(idx)}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 text-left hover:border-teal-500 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                        Rx Sample 0{idx + 1}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {rxP.doctorName}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {rxP.diagnosis}
                    </div>
                    <div className="text-[10px] font-mono text-teal-700 dark:text-teal-400 mt-1.5">
                      {rxP.medications.length} Meds · BP {rxP.vitals?.systolicBP}/
                      {rxP.vitals?.diastolicBP} mmHg
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Editable Scraped Prescription Details Workspace */
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Doctor, Clinic, Date, Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prescribing Doctor
                </label>
                <input
                  type="text"
                  value={prescription.doctorName}
                  onChange={(e) =>
                    setPrescription({ ...prescription, doctorName: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Clinic
                </label>
                <input
                  type="text"
                  value={prescription.clinicName}
                  onChange={(e) =>
                    setPrescription({ ...prescription, clinicName: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prescription Date
                </label>
                <input
                  type="date"
                  value={prescription.rxDate}
                  onChange={(e) =>
                    setPrescription({ ...prescription, rxDate: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono tabular-nums outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Diagnosis (Dx)
                </label>
                <input
                  type="text"
                  value={prescription.diagnosis}
                  onChange={(e) =>
                    setPrescription({ ...prescription, diagnosis: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Scraped Clinic Vital Signs (Synced with Dashboard Trend Chart) */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  <span>
                    Scraped Vital Signs on Prescription (Synced to Dashboard Historical Trends)
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Standard Target BP: &lt; 120/80 mmHg
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={prescription.vitals?.systolicBP ?? ''}
                    onChange={(e) =>
                      setPrescription({
                        ...prescription,
                        vitals: {
                          ...prescription.vitals,
                          systolicBP: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="136"
                    className="w-full text-xs font-mono font-bold tabular-nums px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    value={prescription.vitals?.diastolicBP ?? ''}
                    onChange={(e) =>
                      setPrescription({
                        ...prescription,
                        vitals: {
                          ...prescription.vitals,
                          diastolicBP: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="86"
                    className="w-full text-xs font-mono font-bold tabular-nums px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Pulse / Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={prescription.vitals?.heartRate ?? ''}
                    onChange={(e) =>
                      setPrescription({
                        ...prescription,
                        vitals: {
                          ...prescription.vitals,
                          heartRate: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="78"
                    className="w-full text-xs font-mono font-bold tabular-nums px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">
                    Body Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={prescription.vitals?.weightKg ?? ''}
                    onChange={(e) =>
                      setPrescription({
                        ...prescription,
                        vitals: {
                          ...prescription.vitals,
                          weightKg: e.target.value ? Number(e.target.value) : undefined,
                        },
                      })
                    }
                    placeholder="75.0"
                    className="w-full text-xs font-mono font-bold tabular-nums px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Scraped Medications Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-teal-600" />
                  <span>Extracted Medications & Dosing Regimen</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Medicine Name (Brand / Generic)</th>
                      <th className="py-2.5 px-3 w-28">Dosage</th>
                      <th className="py-2.5 px-3 w-40">Frequency</th>
                      <th className="py-2.5 px-3 w-44">Meal Timing</th>
                      <th className="py-2.5 px-3 w-28">Duration</th>
                      <th className="py-2.5 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {prescription.medications.map((med) => (
                      <tr
                        key={med.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                      >
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) =>
                              handleMedChange(med.id, 'name', e.target.value)
                            }
                            className="w-full font-semibold bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none py-0.5"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) =>
                              handleMedChange(med.id, 'dosage', e.target.value)
                            }
                            className="w-full font-mono tabular-nums bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none py-0.5"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) =>
                              handleMedChange(med.id, 'frequency', e.target.value)
                            }
                            className="w-full font-mono bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none py-0.5"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={med.timing}
                            onChange={(e) =>
                              handleMedChange(med.id, 'timing', e.target.value)
                            }
                            className="w-full text-slate-600 dark:text-slate-300 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none py-0.5"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={med.duration}
                            onChange={(e) =>
                              handleMedChange(med.id, 'duration', e.target.value)
                            }
                            className="w-full font-mono text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-teal-500 outline-none py-0.5"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteMedication(med.id)}
                            className="text-slate-400 hover:text-rose-500 p-1"
                            title="Remove medication"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor's Advice & Lifestyle Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Scraped Doctor&apos;s Dietary, Lifestyle & Follow-Up Advice
              </label>
              <textarea
                rows={2}
                value={prescription.adviceNotes}
                onChange={(e) => {
                  setPrescription({ ...prescription, adviceNotes: e.target.value });
                  setDoctorNotes(e.target.value);
                }}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          SECTION 3: LIVE COMBINED SYNTHESIS PREVIEW & FINAL ACTION BAR
      ===================================================================== */}
      {liveSynthesis && (
        <section className="rounded-3xl border border-emerald-500/40 bg-emerald-950/90 text-white p-6 sm:p-7 space-y-5 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="w-4 h-4" />
                <span>03. Unified Lab Biomarkers + Doctor Prescription Synthesis Ready</span>
              </div>
              <h3 className="text-xl font-black tracking-tight">
                {lang === 'hi'
                  ? 'एकीकृत क्लिनिकल सारांश और दवा-बायोमार्कर सहसंबंध'
                  : 'Combined Clinical Summary & Prescription-Lab Correlation'}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => handleSaveAndProceed('anatomy')}
                disabled={isSavingReport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 transition-all whitespace-nowrap shrink-0"
              >
                <HeartPulse className="w-4 h-4 text-emerald-300" />
                <span>Save & View in 3D Anatomy</span>
              </button>

              <button
                onClick={() => handleSaveAndProceed('insights')}
                disabled={isSavingReport}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-xs shadow-lg transition-all whitespace-nowrap shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isSavingReport
                    ? 'Synthesizing Final Report...'
                    : 'Save & Generate Final Insights & Summary'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Combined Synthesis Text Preview */}
          <div className="p-4 rounded-2xl bg-black/30 border border-white/10 text-xs sm:text-sm text-emerald-50 leading-relaxed">
            {lang === 'hi'
              ? liveSynthesis.combinedSynthesisHi
              : liveSynthesis.combinedSynthesisEn}
          </div>

          {/* Medicine <-> Lab Biomarker Correlation Preview Grid */}
          {liveSynthesis.medicineCorrelations.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-xs font-bold text-emerald-300">
                How Your Prescribed Medicines Target Your Scanned Biomarkers:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {liveSynthesis.medicineCorrelations.map((corr, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs"
                  >
                    <div className="font-bold text-white">{corr.medicine}</div>
                    <div className="text-[11px] font-mono text-emerald-300">
                      Target: {corr.linkedBiomarker}
                    </div>
                    <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                      {lang === 'hi' ? corr.clinicalRationaleHi : corr.clinicalRationaleEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
