import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MedicalReport, FamilyProfile } from '../../types';
import confetti from 'canvas-confetti';
import {
  Share2,
  Check,
  Copy,
  ShieldCheck,
  X,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface WhatsAppShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: MedicalReport | null;
  profile: FamilyProfile | null;
}

export function WhatsAppShareModal({
  isOpen,
  onClose,
  report,
  profile,
}: WhatsAppShareModalProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [hasConsented, setHasConsented] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  // Format the structured WhatsApp text
  const abnormalRows = report.rows.filter(
    (r) => r.status === 'high' || r.status === 'low'
  );
  const normalRows = report.rows.filter((r) => r.status === 'within');

  let shareText = '';
  if (lang === 'hi') {
    shareText = `🛡️ *वेदशील्ड एआई (VedaShield AI) - स्वास्थ्य रिपोर्ट सारांश*

👤 *सदस्य:* ${profile?.name || 'पारिवारिक सदस्य'} (${t(`family.relationships.${profile?.relationship || 'Self'}`)})
📋 *रिपोर्ट:* ${report.title}
🏥 *लैब:* ${report.labName || 'डायग्नोस्टिक लैब'}
📅 *दिनांक:* ${report.date}

---
🔍 *प्रमुख निष्कर्ष (${report.rows.length} में से ${abnormalRows.length} ध्यान देने योग्य):*
${
  abnormalRows.length > 0
    ? abnormalRows
        .map(
          (r) =>
            `⚠️ *${r.name}:* ${r.value} ${r.unit} (मानक सीमा: ${r.range}) [${
              r.status === 'high' ? 'बढ़ा हुआ' : 'कम'
            }]`
        )
        .join('\n')
    : '✅ सभी जाँचे गए बायोमार्कर सामान्य सीमा में हैं।'
}

${
  normalRows.length > 0
    ? `\n✅ *सामान्य बायोमार्कर:* ${normalRows
        .map((r) => `${r.name} (${r.value} ${r.unit})`)
        .join(', ')}`
    : ''
}

📝 *सारांश:*
${report.aiSummaryHi || report.aiSummaryEn || 'शैक्षिक उद्देश्यों के लिए तैयार सारांश।'}

⚕️ *सूचना:* यह सारांश केवल शैक्षिक संदर्भ के लिए है। किसी भी निदान या दवा के लिए अपने डॉक्टर से परामर्श लें।
_सुरक्षित रूप से वेदशील्ड एआई द्वारा जनरेट किया गया_`;
  } else {
    shareText = `🛡️ *VedaShield AI - Verified Health Summary*

👤 *Patient:* ${profile?.name || 'Family Member'} (${profile?.relationship || 'Self'})
📋 *Report:* ${report.title}
🏥 *Lab:* ${report.labName || 'Diagnostic Lab'}
📅 *Date:* ${report.date}

---
🔍 *Key Findings (${report.rows.length} tests, ${abnormalRows.length} outside range):*
${
  abnormalRows.length > 0
    ? abnormalRows
        .map(
          (r) =>
            `⚠️ *${r.name}:* ${r.value} ${r.unit} (Target: ${r.range}) [${r.status.toUpperCase()}]`
        )
        .join('\n')
    : '✅ All tested biomarkers are within standard reference ranges.'
}

${
  normalRows.length > 0
    ? `\n✅ *Normal Parameters:* ${normalRows
        .map((r) => `${r.name} (${r.value} ${r.unit})`)
        .join(', ')}`
    : ''
}

📝 *Summary:*
${report.aiSummaryEn || 'Educational health summary generated for doctor consultation.'}

⚕️ *Medical Disclaimer:* For educational and doctor consultation reference only. Not a medical prescription or diagnosis.
_Generated privately via VedaShield AI_`;
  }

  const handleOpenWhatsApp = () => {
    if (!hasConsented) return;
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    const encoded = encodeURIComponent(shareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (!hasConsented) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VedaShield Summary - ${report.title}`,
          text: shareText,
        });
      } catch (e) {
        // Ignored or cancelled
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {t('share.modalTitle')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t('share.modalSubtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="my-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-60 overflow-y-auto font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {shareText}
          </div>
        </div>

        {/* Consent Checkbox */}
        <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 mb-5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={hasConsented}
              onChange={(e) => setHasConsented(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
            />
            <span className="text-xs font-medium text-emerald-950 dark:text-emerald-200">
              {t('share.consentCheckbox')}
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t('share.copied')}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>{t('share.copyText')}</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                disabled={!hasConsented}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('share.nativeShare')}</span>
              </button>
            )}

            <button
              onClick={handleOpenWhatsApp}
              disabled={!hasConsented}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('share.sendWhatsApp')}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
