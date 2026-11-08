import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { FileUp, Camera, Sparkles, Plus, Trash2, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { TestRow, MedicalReport } from '../../types';
import { organFor, rangeStatus, ORGANS } from '../../services/medicalRules';
import { parseMedicalDocument } from '../../services/aiScanner';
import { SAMPLE_REPORTS } from '../../services/sampleReports';

interface ReportScannerProps {
  activeProfileId: string;
  onReportSaved: (report: MedicalReport) => void;
}

export function ReportScanner({ activeProfileId, onReportSaved }: ReportScannerProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<string>('');
  const [reportTitle, setReportTitle] = useState('');
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [labName, setLabName] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [extractedRows, setExtractedRows] = useState<TestRow[] | null>(null);
  const [rawText, setRawText] = useState('');

  // Dropzone file handler
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    setIsProcessing(true);
    setOcrStatus('Initializing OCR engine...');
    try {
      const result = await parseMedicalDocument(file, file.name, (msg) => setOcrStatus(msg));
      setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      setReportDate(result.date);
      setLabName(result.labName);
      setExtractedRows(result.rows);
      setRawText(result.extractedText);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsProcessing(false);
      setOcrStatus('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
    },
    maxFiles: 1,
  });

  // Handle Preset selection
  const handleSelectPreset = (idx: number) => {
    const preset = SAMPLE_REPORTS[idx];
    setReportTitle(preset.title);
    setReportDate(preset.date);
    setLabName(preset.labName || 'Apollo Diagnostics');
    setDoctorNotes(preset.doctorNotes || '');
    setExtractedRows(preset.rows.map((r, i) => ({ ...r, id: `preset-${Date.now()}-${i}` })));
  };

  // Row update handlers
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

  // Save report
  const handleSaveAndProceed = () => {
    if (!extractedRows || extractedRows.length === 0) return;

    const newReport: MedicalReport = {
      id: `rep-${Date.now()}`,
      profileId: activeProfileId,
      title: reportTitle.trim() || (lang === 'hi' ? 'लैब टेस्ट रिपोर्ट' : 'Lab Test Report'),
      date: reportDate,
      labName: labName.trim() || 'Clinical Laboratory',
      type: 'lab',
      rows: extractedRows,
      doctorNotes,
      extractedText: rawText,
      verified: true,
      createdAt: new Date().toISOString(),
    };

    onReportSaved(newReport);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Step 1: Upload / Capture or Select Preset */}
      {!extractedRows ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gemini AI Multimodal Document Engine</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('scanner.title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('scanner.subtitle')}
            </p>
          </div>

          {/* Dropzone Box */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
              isDragActive
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 hover:border-emerald-500 hover:bg-emerald-50/20'
            }`}
          >
            <input {...getInputProps()} />
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-4">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {ocrStatus || t('scanner.processing')}
                </p>
                <p className="text-xs text-slate-400">
                  Running optical character recognition & organ correlation...
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <FileUp className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {t('scanner.dropzone')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports blood tests, urine panels, prescriptions, and radiology reports (PDF, PNG, JPG, WebP)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 1-Click Realistic Presets for Instant Demo */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('scanner.sampleBtn')}
              </span>
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleSelectPreset(0)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Preset 1
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  {t('scanner.presets.metabolic')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Glucose, HbA1c, Cholesterol, Creatinine
                </div>
              </button>

              <button
                onClick={() => handleSelectPreset(1)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Preset 2
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  {t('scanner.presets.liver')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  SGPT, SGOT, Bilirubin, Amylase
                </div>
              </button>

              <button
                onClick={() => handleSelectPreset(2)}
                className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-left hover:border-emerald-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Preset 3
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  {t('scanner.presets.cbc')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Hemoglobin, WBC, Platelets, ESR
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Verification Screen with Editable Table */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('scanner.verificationTitle')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('scanner.verificationSubtitle')}
              </p>
            </div>
            <button
              onClick={() => setExtractedRows(null)}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              {t('scanner.discard')}
            </button>
          </div>

          {/* Report Metadata Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Annual Blood Profile"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
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
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
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
                placeholder="e.g. Dr Lal PathLabs"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Editable Test Rows Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-3">{t('scanner.testName')}</th>
                  <th className="py-3 px-3 w-28">{t('scanner.value')}</th>
                  <th className="py-3 px-3 w-24">{t('scanner.unit')}</th>
                  <th className="py-3 px-3 w-32">{t('scanner.refRange')}</th>
                  <th className="py-3 px-3 w-32">{t('scanner.organ')}</th>
                  <th className="py-3 px-3 w-28">{t('scanner.status')}</th>
                  <th className="py-3 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {extractedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => handleRowChange(row.id, 'name', e.target.value)}
                        className="w-full font-medium bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleRowChange(row.id, 'value', e.target.value)}
                        className="w-full font-bold bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.unit}
                        onChange={(e) => handleRowChange(row.id, 'unit', e.target.value)}
                        className="w-full text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.range}
                        onChange={(e) => handleRowChange(row.id, 'range', e.target.value)}
                        className="w-full text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500 outline-none py-1"
                      />
                    </td>
                    <td className="py-2 px-3">
                      {row.organ ? (
                        <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: ORGANS[row.organ].color }}
                          />
                          <span>
                            {lang === 'hi' ? ORGANS[row.organ].nameHi : ORGANS[row.organ].nameEn}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Systemic</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          row.status === 'within'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : row.status === 'high'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : row.status === 'low'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {row.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={handleAddRow}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('scanner.addRow')}</span>
            </button>

            <button
              onClick={handleSaveAndProceed}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('scanner.saveReport')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
