import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrganKey, TestRow } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import { ANATOMICAL_STRUCTURES, AnatomicalSubStructure } from '../../data/anatomyNomenclature';
import {
  X,
  RotateCcw,
  Activity,
  HeartPulse,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Dna,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Web3AttestationResult } from '../../services/web3HealthVerification';
import { SCAN_FUSION_CATALOG } from './DiagnosticScanFusionPanel';
import { Scan } from 'lucide-react';

interface ClinicalDrawerProps {
  organKey: OrganKey | null;
  isOpen: boolean;
  onClose: () => void;
  reportRows?: TestRow[];
  selectedFinding?: TestRow | null;
  onSelectFinding?: (row: TestRow | null) => void;
  onOpenChatWithSymptom?: (symptom: string) => void;
  attestationProof?: Web3AttestationResult | null;
  onOpenScanFusion?: (organ: OrganKey) => void;
}

export function ClinicalDrawer({
  organKey,
  isOpen,
  onClose,
  reportRows = [],
  selectedFinding,
  onSelectFinding,
  onOpenChatWithSymptom,
  attestationProof,
  onOpenScanFusion,
}: ClinicalDrawerProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [activeTab, setActiveTab] = useState<'clinical' | 'structures' | 'ayurveda' | 'scans'>('clinical');
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  if (!isOpen || !organKey) return null;

  const organMeta = ORGANS[organKey];
  const nomenclature = ANATOMICAL_STRUCTURES[organKey];
  const organReportRows = reportRows.filter((r) => r.organ === organKey);
  const abnormalCount = organReportRows.filter((r) => r.status === 'high' || r.status === 'low').length;

  return (
    <aside
      className="fixed inset-y-0 right-0 z-40 w-full sm:w-[460px] bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col text-slate-100 animate-in slide-in-from-right duration-300 pointer-events-auto"
      aria-label="Clinical Organ Drawer"
    >
      {/* Drawer Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/80 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full shrink-0 shadow"
              style={{ backgroundColor: organMeta.color }}
            />
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              {nomenclature ? nomenclature.ta2Id : organMeta.fmaId}
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-[11px] font-mono text-slate-400 italic">
              {nomenclature ? nomenclature.latin : ''}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white truncate">
            {isHi ? organMeta.nameHi : organMeta.nameEn}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
            {isHi ? organMeta.shortInsightHi : organMeta.shortInsightEn}
          </p>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onClose}
            title={isHi ? 'ड्रॉअर बंद करें' : 'Close Drawer'}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Segmented Tabs */}
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/40 flex items-center gap-1">
        <button
          onClick={() => setActiveTab('clinical')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'clinical'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{isHi ? 'लैब रिपोर्ट' : 'Clinical Labs'}</span>
          {abnormalCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {abnormalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('structures')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'structures'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isHi ? 'संरचनाएं (TA2)' : 'Sub-Structures'}</span>
        </button>

        <button
          onClick={() => setActiveTab('ayurveda')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'ayurveda'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Dna className="w-3.5 h-3.5" />
          <span>{isHi ? 'आयुर्वेद' : 'Ayurveda'}</span>
        </button>

        <button
          onClick={() => setActiveTab('scans')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'scans'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scan className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isHi ? 'स्कैन' : 'Scans'}</span>
        </button>
      </div>

      {/* Main Drawer Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs leading-relaxed">
        {/* TAB 1: Clinical Lab Findings & Biomarkers */}
        {activeTab === 'clinical' && (
          <div className="space-y-4">
            {/* Status Summary Banner */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
                abnormalCount > 0
                  ? 'bg-red-950/40 border-red-800/60 text-red-200'
                  : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              }`}
            >
              {abnormalCount > 0 ? (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-sm text-white">
                  {abnormalCount > 0
                    ? isHi
                      ? `${abnormalCount} परीक्षण मानक सीमा से बाहर हैं`
                      : `${abnormalCount} biomarker parameter(s) require clinical review`
                    : isHi
                    ? 'सभी परीक्षण सामान्य सीमा में हैं'
                    : 'All correlated biomarkers within normal limits'}
                </p>
                <p className="text-xs text-slate-300 mt-1">
                  {isHi ? organMeta.descriptionHi : organMeta.descriptionEn}
                </p>
              </div>
            </div>

            {/* Correlated Test Rows List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-300 text-xs">
                  {isHi ? 'संबद्ध प्रयोगशाला जांच परिणाम' : 'Associated Patient Laboratory Biomarkers'}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {organReportRows.length} {isHi ? 'परीक्षण' : 'tests'}
                </span>
              </div>

              {organReportRows.length > 0 ? (
                <div className="space-y-2">
                  {organReportRows.map((row) => {
                    const isAbnormal = row.status === 'high' || row.status === 'low';
                    const isSelected = selectedFinding?.id === row.id;

                    return (
                      <div
                        key={row.id}
                        onClick={() => onSelectFinding?.(isSelected ? null : row)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/80 border-emerald-500 shadow-md ring-1 ring-emerald-400/50'
                            : isAbnormal
                            ? 'bg-red-950/20 border-red-800/40 hover:border-red-600/80'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-white text-xs">{row.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              row.status === 'high'
                                ? 'bg-red-900/80 text-red-200 border border-red-700/60'
                                : row.status === 'low'
                                ? 'bg-amber-900/80 text-amber-200 border border-amber-700/60'
                                : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700/60'
                            }`}
                          >
                            {row.status === 'high'
                              ? isHi ? 'उच्च (High)' : 'Elevated'
                              : row.status === 'low'
                              ? isHi ? 'निम्न (Low)' : 'Low'
                              : isHi ? 'सामान्य' : 'Normal'}
                          </span>
                        </div>

                        <div className="mt-2 flex items-baseline justify-between text-slate-400 font-mono text-[11px]">
                          <div>
                            <span className="text-white font-bold text-sm">{row.value}</span>{' '}
                            <span>{row.unit}</span>
                          </div>
                          <div className="text-slate-500">
                            {isHi ? 'मानक संदर्भ:' : 'Ref:'} {row.range}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-center text-slate-400 space-y-2">
                  <FileText className="w-6 h-6 mx-auto text-slate-600" />
                  <p>
                    {isHi
                      ? 'वर्तमान मेडिकल रिपोर्ट में इस अंग के लिए कोई विशिष्ट परीक्षण परिणाम नहीं हैं।'
                      : 'No specific laboratory test rows correlated with this organ in the current report.'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {isHi
                      ? `सामान्यतः अनुशंसित जांच: ${organMeta.recommendedTests.slice(0, 3).join(', ')}`
                      : `Standard clinical panel: ${organMeta.recommendedTests.slice(0, 3).join(', ')}`}
                  </p>
                </div>
              )}
            </div>

            {/* Physiological Function Card */}
            <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1.5">
              <span className="font-bold text-slate-300 block">
                {isHi ? 'जैविक कार्यप्रणाली (Physiological Function)' : 'Primary Physiological Function'}
              </span>
              <p className="text-slate-300 leading-relaxed">
                {isHi ? organMeta.functionHi : organMeta.functionEn}
              </p>
            </div>

            {/* Recommended Preventive Lab Panel */}
            <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
              <span className="font-bold text-slate-300 block">
                {isHi ? 'अनुशंसित निवारक जांच (Preventive Diagnostic Panel)' : 'Recommended Diagnostic Tests'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {organMeta.recommendedTests.map((tName, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium"
                  >
                    {tName}
                  </span>
                ))}
              </div>
            </div>

            {/* Cryptographic Attestation Stamp */}
            {attestationProof && (
              <div className="p-3 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-300 block">
                      {isHi ? 'वेब3 मेडिकल साक्ष्य सत्यापित' : 'Web3 EIP-712 Telemetry Attestation'}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[220px] block">
                      {attestationProof.documentHash.slice(0, 16)}...
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 font-mono text-[9px] font-bold">
                  Verified
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Anatomical Sub-Structures (TA2 Hierarchy) */}
        {activeTab === 'structures' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                {isHi ? 'विस्तृत संरचनात्मक भाग (Terminologia Anatomica 2)' : 'Anatomical Sub-Components (TA2)'}
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {nomenclature?.subStructures.length || 0} structures
              </span>
            </div>

            {nomenclature?.subStructures.map((sub: AnatomicalSubStructure) => {
              const isExpanded = expandedSubId === sub.id;
              return (
                <div
                  key={sub.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                    className="w-full p-3 flex items-center justify-between gap-2 text-left hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs truncate">
                          {isHi ? sub.nameHi : sub.nameEn}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {sub.ta2Id}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 italic block truncate">
                        {sub.latin}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-slate-800/80 bg-slate-950/40 text-slate-300 text-[11px] leading-relaxed">
                      <p>{isHi ? sub.descriptionHi : sub.descriptionEn}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Ayurveda Wellness & Dosha Correlation */}
        {activeTab === 'ayurveda' && nomenclature?.ayurvedaAssociation && (
          <div className="space-y-3.5">
            <div className="p-4 rounded-2xl border border-amber-900/50 bg-amber-950/20 space-y-2">
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                {isHi ? 'दोष व धातु संतुलन (Tridosha & Dhatu Profile)' : 'Ayurvedic Constitutional Profile'}
              </span>

              <div className="grid grid-cols-2 gap-2 text-slate-200">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isHi ? 'प्रमुख दोष' : 'Primary Dosha'}</span>
                  <span className="font-bold text-amber-400 text-sm">{nomenclature.ayurvedaAssociation.dosha}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{isHi ? 'संबद्ध धातु' : 'Governed Dhatu'}</span>
                  <span className="font-bold text-amber-300 text-sm">{nomenclature.ayurvedaAssociation.dhatu}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 text-[10px] block">{isHi ? 'उप-दोष (Sub-Dosha)' : 'Sub-Dosha Principle'}</span>
                <span className="font-semibold text-slate-200">{nomenclature.ayurvedaAssociation.subdosha}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-1.5">
              <span className="font-bold text-slate-200 block">
                {isHi ? 'प्राकृतिक आहार व जीवनशैली सुझाव' : 'Dietary & Lifestyle Harmonization'}
              </span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {nomenclature.ayurvedaAssociation.dosha.includes('Pitta')
                  ? isHi
                    ? 'अत्यधिक मिर्च, खट्टे व तले खाद्य पदार्थों से बचें। शीतल जल, नारियल पानी व ताजे फलों का सेवन पित्त को शांत रखता है।'
                    : 'Cooling hydration, avoiding excessive chilies and fermented foods helps maintain optimal hepatic and cardiac Pitta balance.'
                  : nomenclature.ayurvedaAssociation.dosha.includes('Vata')
                  ? isHi
                    ? 'नियमित समय पर गर्म, पौष्टिक भोजन और पर्याप्त नींद वात संतुलन बनाए रखती है।'
                    : 'Warm unctuous meals, adequate hydration, and grounding routines sustain renal and nervous Vata vitality.'
                  : isHi
                  ? 'हल्का सुपाच्य भोजन, गुनगुना पानी और प्रातःकालीन भ्रमण कफ संतुलन के लिए सर्वोत्तम है।'
                  : 'Warm spices, active walking, and lighter evening meals optimize pulmonary and metabolic Kapha balance.'}
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: Diagnostic Imaging & Scan Fusion */}
        {activeTab === 'scans' && (
          <div className="space-y-4">
            {SCAN_FUSION_CATALOG[organKey] ? (
              (() => {
                const scanData = SCAN_FUSION_CATALOG[organKey];
                return (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-cyan-800/60 bg-slate-950">
                      <div className="absolute top-2 left-2 z-10 font-mono text-[9px] text-cyan-400 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-900/50">
                        {scanData.reportId} · {scanData.modality}
                      </div>
                      <img
                        src={scanData.imagePath}
                        alt={scanData.systemTitleEn}
                        className="w-full aspect-[16/10] object-cover filter contrast-110"
                        loading="lazy"
                      />
                      <div className="p-2.5 bg-slate-900/90 border-t border-cyan-900/40 text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="font-bold text-amber-400">{scanData.lesionNameEn}</span>
                        <span className="font-mono text-cyan-300">{scanData.lesionSize || 'Ref'}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-cyan-900/40 bg-slate-900/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">Clinical Radiologic Alert:</span>
                        <span className="font-mono text-[10px] text-red-400 font-bold uppercase">
                          {scanData.alertSeverity}
                        </span>
                      </div>
                      <p className="text-xs text-red-200 bg-red-950/30 p-2 rounded-lg border border-red-900/40">
                        {isHi ? scanData.alertBadgeHi : scanData.alertBadgeEn}
                      </p>
                    </div>

                    {onOpenScanFusion && (
                      <button
                        onClick={() => onOpenScanFusion(organKey)}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
                      >
                        <Scan className="w-4 h-4" />
                        <span>{isHi ? '3D स्कैन फ्यूजन वर्कस्टेशन खोलें' : 'Open 3D Scan Fusion Workstation'}</span>
                      </button>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="p-6 text-center text-slate-400 space-y-2">
                <p>{isHi ? 'इस अंग के लिए कोई स्कैन उपलब्ध नहीं है' : 'No specialized radiologic scan indexed.'}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center gap-2">
        <button
          onClick={() => {
            const symptomPrompt = isHi
              ? `${organMeta.nameHi} से संबंधित स्वास्थ्य लक्षण और रिपोर्ट की जानकारी चाहिए`
              : `I would like to understand symptoms and report findings related to the ${organMeta.nameEn}`;
            onOpenChatWithSymptom?.(symptomPrompt);
          }}
          className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isHi ? 'AI सहायक से पूछें' : 'Ask Health Assistant'}</span>
        </button>

        <button
          onClick={onClose}
          className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isHi ? 'रीसेट' : 'Reset View'}</span>
        </button>
      </div>
    </aside>
  );
}
