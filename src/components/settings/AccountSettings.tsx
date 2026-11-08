import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  User,
  Shield,
  Languages,
  Database,
  Download,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ExternalLink,
} from 'lucide-react';
import { UserAuth, FamilyProfile } from '../../types';

interface AccountSettingsProps {
  userAuth: UserAuth | null;
  profiles: FamilyProfile[];
  onLogout: () => void;
  onRefreshData: () => void;
}

export const CONSENT_STORAGE_KEY = 'vedashield_data_consent_granted';

export function AccountSettings({
  userAuth,
  profiles,
  onLogout,
  onRefreshData,
}: AccountSettingsProps) {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [hasConsent, setHasConsent] = useState(() => {
    return localStorage.getItem(CONSENT_STORAGE_KEY) !== 'false';
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
  };

  const handleToggleConsent = () => {
    const next = !hasConsent;
    setHasConsent(next);
    localStorage.setItem(CONSENT_STORAGE_KEY, String(next));
    setSaveMessage(
      next
        ? isHi
          ? 'सहमति सहेजी गई'
          : 'Consent updated'
        : isHi
        ? 'सहमति निरस्त की गई (केवल स्थानीय मोड)'
        : 'Consent revoked: Local offline mode only'
    );
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleExportAllData = () => {
    const allKeys = Object.keys(localStorage).filter((k) => k.startsWith('vedashield_'));
    const dump: Record<string, any> = {};
    for (const key of allKeys) {
      try {
        dump[key] = JSON.parse(localStorage.getItem(key) || '{}');
      } catch {
        dump[key] = localStorage.getItem(key);
      }
    }
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dump, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `VedaShield_Full_Health_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleClearLocalData = () => {
    if (
      window.confirm(
        isHi
          ? 'चेतावनी: क्या आप इस डिवाइस से सभी स्थानीय स्वास्थ्य रिकॉर्ड हटाना चाहते हैं?'
          : 'Warning: Are you sure you want to permanently clear all local health records from this device?'
      )
    ) {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('vedashield_'));
      keys.forEach((k) => localStorage.removeItem(k));
      alert(isHi ? 'स्थानीय डेटा साफ़ कर दिया गया है।' : 'Local health data cleared.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>{isHi ? 'खाता एवं गोपनीयता सेटिंग्स' : 'Account & Privacy Settings'}</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHi
            ? 'अपनी प्रोफ़ाइल, भाषा प्राथमिकताएं, डेटा गोपनीयता और सुरक्षा सेटिंग्स प्रबंधित करें।'
            : 'Manage authentication, bilingual preferences, data consent, and private health archives.'}
        </p>
      </div>

      {saveMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* User Session Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          <span>{isHi ? 'सक्रिय उपयोगकर्ता सत्र' : 'Active User Session'}</span>
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div>
            <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {userAuth?.name || 'Guest User (अतिथि)'}
            </p>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {userAuth?.email || (userAuth?.isGuest ? 'Offline Local Mode' : 'Connected to Supabase')}
            </p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
              {userAuth?.isGuest ? 'Guest Session' : 'Verified Google Account'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
          >
            {isHi ? 'लॉगआउट' : 'Sign Out'}
          </button>
        </div>
      </div>

      {/* Language Preference */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Languages className="w-5 h-5 text-emerald-600" />
          <span>{isHi ? 'भाषा प्राथमिकता (Language Preference)' : 'Language Selection'}</span>
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleLanguage('en')}
            className={`p-4 rounded-xl border text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
              !isHi
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div>
              <p className="font-bold">English (UK / US)</p>
              <p className="text-[11px] text-slate-500 font-normal">Primary medical terms & interface</p>
            </div>
            {!isHi && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>

          <button
            onClick={() => toggleLanguage('hi')}
            className={`p-4 rounded-xl border text-left font-semibold text-xs sm:text-sm transition-all flex items-center justify-between ${
              isHi
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <div>
              <p className="font-bold">हिन्दी (Hindi)</p>
              <p className="text-[11px] text-slate-500 font-normal">सरल स्वास्थ्य व्याख्या व परामर्श</p>
            </div>
            {isHi && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* Data Privacy & Consent Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <span>{isHi ? 'गोपनीयता एवं सहमति नियंत्रण (Consent)' : 'Privacy & Medical Consent'}</span>
        </h3>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                {isHi ? 'एआई स्वास्थ्य विश्लेषण हेतु सहमति' : 'Consent for AI Medical Document OCR & Insights'}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isHi
                  ? 'आपकी रिपोर्ट केवल आपके डिवाइस पर या आपके अधिकृत निजी क्लाउड में सुरक्षित रहती है। सहमति बंद करने पर स्वचालित क्लाउड सिंक अक्षम हो जाएगा।'
                  : 'Medical files are processed for educational explanation only. Revoking consent restricts processing strictly to offline browser memory.'}
              </p>
            </div>

            <button
              onClick={handleToggleConsent}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                hasConsent
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {hasConsent ? (isHi ? 'सक्रिय (Active)' : 'Granted') : isHi ? 'निष्क्रिय' : 'Revoked'}
            </button>
          </div>
        </div>

        {/* Data Export and Purge */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAllData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? 'पूरा डेटा बैकअप (JSON) डाउनलोड करें' : 'Export Full Health Backup (JSON)'}</span>
          </button>

          <button
            onClick={handleClearLocalData}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isHi ? 'सभी स्थानीय रिकॉर्ड हटाएं' : 'Purge Local Storage Records'}</span>
          </button>
        </div>
      </div>

      {/* Attributions & Clinical Disclaimers */}
      <div className="p-5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 space-y-3 text-xs text-slate-500 leading-relaxed">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>{isHi ? 'कानूनी दायित्व एवं स्रोत आभार' : 'Legal Attribution & Clinical Sources'}</span>
        </h4>
        <p>
          • <strong>BodyParts3D</strong>: © The Database Center for Life Science (DBCLS), licensed under CC BY-SA 2.1 Japan.
        </p>
        <p>
          • <strong>Z-Anatomy</strong>: Gauthier Kervyn et al., licensed under Creative Commons Attribution-ShareAlike 4.0 International.
        </p>
        <p>
          • <strong>Clinical Scope</strong>: VedaShield AI provides educational explanations only and does not formulate autonomous diagnoses or replace clinical examinations by a registered medical practitioner.
        </p>
      </div>
    </div>
  );
}
