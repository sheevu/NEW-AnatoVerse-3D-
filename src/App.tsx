import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FamilyProfile, MedicalReport, OrganKey, TestRow, UserAuth } from './types';
import {
  getProfiles,
  saveProfile,
  deleteProfile,
  getActiveProfileId,
  setActiveProfileId,
  getReports,
  saveReport,
} from './services/storage';
import { Navbar } from './components/layout/Navbar';
import { AuthModal } from './components/auth/AuthModal';
import { HealthDashboard } from './components/dashboard/HealthDashboard';
import { AnatomyViewer } from './components/anatomy/AnatomyViewer';
import { HealthChat } from './components/chat/HealthChat';
import { ReportScanner } from './components/scanner/ReportScanner';
import { ReportInsights } from './components/insights/ReportInsights';
import { MedicineLibrary } from './components/medicine/MedicineLibrary';
import { FamilyManager } from './components/family/FamilyManager';
import { AyurvedaWellness } from './components/wellness/AyurvedaWellness';
import { HealthRecords } from './components/records/HealthRecords';
import { AccountSettings } from './components/settings/AccountSettings';
import { WhatsAppShareModal } from './components/sharing/WhatsAppShareModal';
import { ShieldAlert, Heart, Sparkles, MessageSquare } from 'lucide-react';

const AUTH_STORAGE_KEY = 'vedashield_auth_user_v2';

export function App() {
  const { t } = useTranslation();

  // Auth state
  const [userAuth, setUserAuth] = useState<UserAuth | null>(() => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    return null;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [profiles, setProfiles] = useState<FamilyProfile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string>('');
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [focusOrgan, setFocusOrgan] = useState<OrganKey | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<TestRow | null>(null);
  const [shareReport, setShareReport] = useState<MedicalReport | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState<string | undefined>(undefined);

  // Initialize data
  useEffect(() => {
    async function loadData() {
      const loadedProfiles = await getProfiles();
      setProfiles(loadedProfiles);

      const activeId = getActiveProfileId();
      setActiveProfileIdState(activeId);

      const loadedReports = await getReports(activeId);
      setReports(loadedReports);
      if (loadedReports.length > 0) {
        setSelectedReport(loadedReports[0]);
      }
    }
    loadData();
  }, []);

  // Login Handlers
  const handleLoginAsGuest = () => {
    const guestUser: UserAuth = {
      id: `guest-${Date.now()}`,
      name: 'Guest User (अतिथि)',
      isGuest: true,
    };
    setUserAuth(guestUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(guestUser));
  };

  const handleLoginWithGoogle = () => {
    const googleUser: UserAuth = {
      id: `google-${Date.now()}`,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@gmail.com',
      isGuest: false,
    };
    setUserAuth(googleUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(googleUser));
  };

  const handleLogout = () => {
    setUserAuth(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  // When active profile changes, load their reports
  const handleSelectProfile = async (id: string) => {
    setActiveProfileIdState(id);
    setActiveProfileId(id);
    const loadedReports = await getReports(id);
    setReports(loadedReports);
    if (loadedReports.length > 0) {
      setSelectedReport(loadedReports[0]);
    } else {
      setSelectedReport(null);
    }
  };

  const handleSaveProfile = async (profile: FamilyProfile) => {
    await saveProfile(profile);
    const updated = await getProfiles();
    setProfiles(updated);
    if (!activeProfileId) {
      handleSelectProfile(profile.id);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    await deleteProfile(id);
    const updated = await getProfiles();
    setProfiles(updated);
    if (activeProfileId === id && updated.length > 0) {
      handleSelectProfile(updated[0].id);
    }
  };

  const handleReportSaved = async (report: MedicalReport) => {
    await saveReport(report);
    const updatedReports = await getReports(activeProfileId);
    setReports(updatedReports);
    setSelectedReport(report);
    const firstAbnormal = report.rows.find((r) => r.status === 'high' || r.status === 'low');
    if (firstAbnormal && firstAbnormal.organ) {
      setFocusOrgan(firstAbnormal.organ);
      setSelectedFinding(firstAbnormal);
    }
    setCurrentTab('anatomy');
  };

  const handleNavigateToAnatomy = (organKey?: OrganKey, finding?: TestRow) => {
    setFocusOrgan(organKey || null);
    setSelectedFinding(finding || null);
    setCurrentTab('anatomy');
  };

  const handleShowOrganFromChat = (organKey: OrganKey) => {
    setFocusOrgan(organKey);
    // If a report is loaded, check if there's a matching test row
    if (selectedReport) {
      const match = selectedReport.rows.find((r) => r.organ === organKey);
      setSelectedFinding(match || null);
    } else {
      setSelectedFinding(null);
    }
    setCurrentTab('anatomy');
  };

  const handleOpenChatWithSymptom = (symptom: string) => {
    setChatInitialQuery(symptom);
    setCurrentTab('chat');
  };

  const handleOpenWhatsAppShare = (report: MedicalReport) => {
    setShareReport(report);
    setIsShareOpen(true);
  };

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-16 md:pb-6">
      {/* Auth Gate: Modal for Guest Login / Google Auth */}
      <AuthModal
        isOpen={!userAuth}
        onLoginAsGuest={handleLoginAsGuest}
        onLoginWithGoogle={handleLoginWithGoogle}
      />

      {/* Top Clinical Disclaimer Banner */}
      <div className="bg-emerald-950 text-emerald-200 px-4 py-1.5 text-[11px] text-center font-medium border-b border-emerald-900/50 flex items-center justify-center gap-1.5">
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
        <span>{t('app.disclaimer')}</span>
      </div>

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
        userAuth={userAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <HealthDashboard
            activeProfile={activeProfile}
            reports={reports}
            onNavigateToTab={setCurrentTab}
            onSelectReport={(rep) => {
              setSelectedReport(rep);
              setCurrentTab('insights');
            }}
            onOpenWhatsAppShare={handleOpenWhatsAppShare}
          />
        )}

        {currentTab === 'anatomy' && (
          <div className="space-y-4">
            <AnatomyViewer
              activeOrgan={focusOrgan}
              onSelectOrgan={setFocusOrgan}
              reportRows={selectedReport?.rows || []}
              selectedFinding={selectedFinding}
              onSelectFinding={setSelectedFinding}
              onOpenChatWithSymptom={handleOpenChatWithSymptom}
            />
          </div>
        )}

        {currentTab === 'chat' && (
          <HealthChat
            onShowInAnatomy={handleShowOrganFromChat}
            initialQuery={chatInitialQuery}
          />
        )}

        {currentTab === 'scanner' && (
          <ReportScanner
            activeProfileId={activeProfileId || 'prof-self'}
            onReportSaved={handleReportSaved}
          />
        )}

        {currentTab === 'insights' && (
          <div>
            {selectedReport ? (
              <ReportInsights
                report={selectedReport}
                onNavigateToAnatomy={(organ) => {
                  const match = selectedReport.rows.find((r) => r.organ === organ);
                  handleNavigateToAnatomy(organ, match);
                }}
                onOpenWhatsAppShare={handleOpenWhatsAppShare}
              />
            ) : (
              <div className="text-center py-16 space-y-4">
                <p className="text-sm text-slate-500">
                  No report selected. Scan or select a report to view AI insights.
                </p>
                <button
                  onClick={() => setCurrentTab('scanner')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Scan Report Now
                </button>
              </div>
            )}
          </div>
        )}

        {currentTab === 'medicines' && <MedicineLibrary />}

        {currentTab === 'wellness' && <AyurvedaWellness />}

        {currentTab === 'records' && (
          <HealthRecords
            reports={reports}
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectReport={(rep) => {
              setSelectedReport(rep);
              setCurrentTab('insights');
            }}
            onNavigateToAnatomy={(rep) => {
              setSelectedReport(rep);
              const firstAbnormal = rep.rows.find((r) => r.status === 'high' || r.status === 'low');
              if (firstAbnormal && firstAbnormal.organ) {
                setFocusOrgan(firstAbnormal.organ);
                setSelectedFinding(firstAbnormal);
              }
              setCurrentTab('anatomy');
            }}
            onOpenWhatsAppShare={handleOpenWhatsAppShare}
            onRefreshReports={async () => {
              const loaded = await getReports(activeProfileId);
              setReports(loaded);
            }}
            onScanNewReport={() => setCurrentTab('scanner')}
          />
        )}

        {currentTab === 'family' && (
          <FamilyManager
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={handleSelectProfile}
            onSaveProfile={handleSaveProfile}
            onDeleteProfile={handleDeleteProfile}
          />
        )}

        {currentTab === 'settings' && (
          <AccountSettings
            userAuth={userAuth}
            profiles={profiles}
            onLogout={handleLogout}
            onRefreshData={async () => {
              const loadedProfiles = await getProfiles();
              setProfiles(loadedProfiles);
            }}
          />
        )}
      </main>

      {/* WhatsApp Sharing Modal */}
      <WhatsAppShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        report={shareReport}
        profile={activeProfile}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-400">
        <p>
          VedaShield AI · Crafted for Indian Families · BodyParts3D CC BY-SA 2.1 JP & Z-Anatomy CC BY-SA 4.0 · Indian Pharmacopoeia
        </p>
      </footer>
    </div>
  );
}

export default App;
