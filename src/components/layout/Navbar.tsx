import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../../i18n/i18n';
import { FamilyProfile, UserAuth } from '../../types';
import {
  ShieldCheck,
  Activity,
  ScanLine,
  Pill,
  Users,
  Globe,
  Moon,
  Sun,
  ChevronDown,
  UserCheck,
  HeartPulse,
  LogOut,
  MessageSquare,
  Sparkles,
  FileText,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  profiles: FamilyProfile[];
  activeProfile: FamilyProfile | null;
  onSelectProfile: (id: string) => void;
  userAuth: UserAuth | null;
  onLogout: () => void;
}

export function Navbar({
  currentTab,
  onTabChange,
  profiles,
  activeProfile,
  onSelectProfile,
  userAuth,
  onLogout,
}: NavbarProps) {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === 'hi' ? 'hi' : 'en';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('vedashield_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('vedashield_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('vedashield_theme', 'light');
    }
  }, [darkMode]);

  const toggleLanguage = () => {
    const next = currentLang === 'en' ? 'hi' : 'en';
    changeLanguage(next);
  };

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Activity },
    { id: 'anatomy', label: t('nav.anatomy'), icon: HeartPulse },
    {
      id: 'chat',
      label: currentLang === 'hi' ? 'लक्षण चर्चा (AI)' : 'Symptom Chat',
      icon: MessageSquare,
      highlight: true,
    },
    { id: 'scanner', label: t('nav.scanner'), icon: ScanLine },
    { id: 'wellness', label: t('nav.wellness'), icon: Sparkles },
    { id: 'medicines', label: t('nav.medicines'), icon: Pill },
    { id: 'records', label: t('nav.records'), icon: FileText },
    { id: 'family', label: t('nav.family'), icon: Users },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/85 backdrop-blur-md dark:border-emerald-950 dark:bg-slate-900/85 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div
            onClick={() => onTabChange('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-emerald-800 to-teal-700 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  VedaShield
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {currentLang === 'hi' ? 'परिवार स्वास्थ्य व 3D एनाटॉमी' : 'Family Health & 3D Anatomy'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? item.highlight
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'bg-white text-emerald-800 dark:bg-slate-900 dark:text-emerald-400 shadow-sm'
                      : item.highlight
                      ? 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/50'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Active Family Member Dropdown */}
            {activeProfile && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-all text-xs"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeProfile.avatarColor || '#059669' }}
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[85px] sm:max-w-[120px] truncate">
                    {activeProfile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">
                    ({t(`family.relationships.${activeProfile.relationship}`)})
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('family.switchMember')}
                    </div>
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProfile(p.id);
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors ${
                          p.id === activeProfile.id
                            ? 'bg-emerald-50/70 dark:bg-slate-800/80 font-bold text-emerald-800 dark:text-emerald-400'
                            : 'text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: p.avatarColor || '#059669' }}
                          />
                          <span className="truncate">{p.name}</span>
                        </div>
                        {p.id === activeProfile.id && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={() => {
                          onTabChange('family');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                      >
                        + {t('family.addMember')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Switch Language / भाषा बदलें"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Light/Dark Theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign Out / Guest Indicator */}
            {userAuth && (
              <button
                onClick={onLogout}
                title={userAuth.isGuest ? 'Exit Guest Session' : 'Sign Out'}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <div
                  className={`p-1 rounded-lg ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                      : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="truncate max-w-[58px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
