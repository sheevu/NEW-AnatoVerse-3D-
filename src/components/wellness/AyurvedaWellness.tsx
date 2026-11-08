import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Heart,
  Moon,
  Sun,
  Coffee,
  CheckCircle2,
  Info,
  Search,
  BookOpen,
  Filter,
} from 'lucide-react';
import {
  HERB_SAFETY_DATABASE,
  DOSHA_PROFILES,
  HerbInteraction,
  DoshaProfile,
} from '../../data/ayurvedaData';

export function AyurvedaWellness() {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [activeSubTab, setActiveSubTab] = useState<'herbs' | 'doshas' | 'routine'>('herbs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDosha, setSelectedDosha] = useState<'Vata' | 'Pitta' | 'Kapha'>('Vata');
  const [selectedHerb, setSelectedHerb] = useState<HerbInteraction | null>(HERB_SAFETY_DATABASE[0]);

  // Filter herbs by name, allopathic drug, or therapeutic category
  const filteredHerbs = HERB_SAFETY_DATABASE.filter((herb) => {
    const q = searchQuery.toLowerCase();
    const matchesHerb =
      herb.herbName.toLowerCase().includes(q) ||
      herb.hindiName.toLowerCase().includes(q) ||
      herb.therapeuticCategory.toLowerCase().includes(q);
    const matchesDrug = herb.drugInteractions.some(
      (d) =>
        d.allopathicDrug.toLowerCase().includes(q) ||
        d.mechanism.toLowerCase().includes(q)
    );
    return matchesHerb || matchesDrug;
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? 'आयुर्वेद एवं निवारक स्वास्थ्य' : 'Ayurveda & Integrative Wellness'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isHi ? 'पारंपरिक ज्ञान और वैज्ञानिक सुरक्षा' : 'Ancient Health Literacy with Modern Safety'}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
            {isHi
              ? 'दैनिक जीवनशैली, आहार-विहार, त्रिदोष संतुलन और पारंपरिक जड़ी-बूटियों की आधुनिक दवाओं के साथ संभावित पारस्परिक क्रिया (Interaction) की प्रामाणिक जानकारी।'
              : 'Evidence-informed lifestyle rhythms, doshic balance, and crucial safety interaction warnings between common Ayurvedic herbs and allopathic prescription medications.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>{isHi ? 'दवा पारस्परिक क्रिया सुरक्षा गाइड' : 'Drug-Herb Interaction Checker'}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-lg border border-white/10">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{isHi ? 'दिनचर्या एवं जीवनशैली सुझाव' : 'Dinacharya Regimen'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Safety Matrix Notice Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {isHi ? 'महत्वपूर्ण सुरक्षा चेतावनी (Clinical Advisory)' : 'Integrative Medicine Safety Rule'}
          </p>
          <p className="leading-relaxed opacity-90">
            {isHi
              ? 'आयुर्वेदिक जड़ी-बूटियाँ शक्तिशाली जैव-सक्रिय यौगिक होती हैं। यदि आप मधुमेह (Sugar), थायरॉइड, रक्तचाप (B.P.), या खून पतला करने वाली दवाएं ले रहे हैं, तो जड़ी-बूटियों का प्रयोग शुरू करने से पहले अपने चिकित्सक से परामर्श अवश्य करें।'
              : 'Ayurvedic formulations contain biologically active phytochemicals. If you are taking prescription drugs for diabetes, thyroid, hypertension, or blood thinning, never combine them with concentrated herbal extracts without your physician’s oversight.'}
          </p>
        </div>
      </div>

      {/* Main Tab Selectors */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('herbs')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'herbs'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{isHi ? 'जड़ी-बूटी व दवा सुरक्षा' : 'Herb & Drug Interactions'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('doshas')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'doshas'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{isHi ? 'प्रकृति एवं त्रिदोष' : 'Dosha Constitution'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('routine')}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeSubTab === 'routine'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>{isHi ? 'दिनचर्या एवं जीवनशैली' : 'Daily Dinacharya Routine'}</span>
        </button>
      </div>

      {/* Tab 1: Herb-Drug Interaction Matrix */}
      {activeSubTab === 'herbs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Herb Directory & Search */}
          <div className="lg:col-span-1 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'जड़ी-बूटी या दवा खोजें (जैसे Metformin, Karela)...' : 'Search herb or prescription drug...'}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredHerbs.map((herb) => {
                const isSelected = selectedHerb?.herbName === herb.herbName;
                const hasCritical = herb.drugInteractions.some((d) => d.riskLevel === 'critical');

                return (
                  <div
                    key={herb.herbName}
                    onClick={() => setSelectedHerb(herb)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {isHi ? herb.hindiName : herb.herbName}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {herb.sanskritName}
                        </p>
                      </div>
                      {hasCritical && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          High Risk
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      {herb.therapeuticCategory}
                    </div>
                  </div>
                );
              })}

              {filteredHerbs.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  {isHi ? 'कोई मेल नहीं मिला' : 'No matching herbs or drugs found.'}
                </div>
              )}
            </div>
          </div>

          {/* Detailed Herb & Interaction View */}
          <div className="lg:col-span-2">
            {selectedHerb ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        {isHi ? selectedHerb.hindiName : selectedHerb.herbName}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono italic">
                        {selectedHerb.sanskritName}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
                      {selectedHerb.therapeuticCategory}
                    </span>
                  </div>

                  {/* Traditional Uses & Scientific Evidence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        {isHi ? 'पारंपरिक उपयोग' : 'Traditional Ayurvedic Uses'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {isHi ? selectedHerb.traditionalUsesHi : selectedHerb.traditionalUsesEn}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1.5">
                        {isHi ? 'वैज्ञानिक शोध एवं साक्ष्य' : 'Modern Scientific Evidence'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {selectedHerb.evidenceSummary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contraindications */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {isHi ? 'सावधानियां एवं निषेध (Contraindications)' : 'Contraindications & Precautions'}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedHerb.contraindications.map((c, i) => (
                      <li
                        key={i}
                        className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Allopathic Drug Interaction Matrix */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span>{isHi ? 'एलोपैथिक दवाओं के साथ परस्पर क्रिया' : 'Allopathic Drug Interactions'}</span>
                  </h3>

                  <div className="space-y-3">
                    {selectedHerb.drugInteractions.map((interaction, i) => {
                      const isCrit = interaction.riskLevel === 'critical';
                      const isMod = interaction.riskLevel === 'moderate';

                      return (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border transition-all ${
                            isCrit
                              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                              : isMod
                              ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                              {interaction.allopathicDrug}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isCrit
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-200'
                                  : isMod
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-200'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200'
                              }`}
                            >
                              {interaction.riskLevel} risk
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                            <strong>{isHi ? 'क्रियाविधि: ' : 'Mechanism: '}</strong>
                            {interaction.mechanism}
                          </p>

                          <div className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-white/70 dark:bg-slate-900/70 p-2.5 rounded-lg border border-slate-200/50 dark:border-slate-700/50 flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-600" />
                            <span>
                              <strong>{isHi ? 'चिकित्सकीय सलाह: ' : 'Clinical Guidance: '}</strong>
                              {interaction.clinicalAdvice}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                {isHi ? 'विवरण देखने के लिए कोई जड़ी-बूटी चुनें' : 'Select an herb from the list to view clinical details.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Dosha Constitution & Profiles */}
      {activeSubTab === 'doshas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['Vata', 'Pitta', 'Kapha'] as const).map((doshaKey) => {
              const dosha = DOSHA_PROFILES[doshaKey];
              const isSelected = selectedDosha === doshaKey;

              return (
                <div
                  key={doshaKey}
                  onClick={() => setSelectedDosha(doshaKey)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                    {isHi ? dosha.hindiName : dosha.name}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                    {dosha.elements}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dosha.qualities.slice(0, 4).map((q) => (
                      <span
                        key={q}
                        className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Dosha In-depth Details */}
          {DOSHA_PROFILES[selectedDosha] && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {isHi ? DOSHA_PROFILES[selectedDosha].hindiName : `${selectedDosha} Profile & Guidance`}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {DOSHA_PROFILES[selectedDosha].elements} · Qualities:{' '}
                  {DOSHA_PROFILES[selectedDosha].qualities.join(', ')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diet */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-emerald-600" />
                    <span>{isHi ? 'आहार संबंधी दिशा-निर्देश (Diet)' : 'Recommended Dietary Principles'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {(isHi
                      ? DOSHA_PROFILES[selectedDosha].dietaryRecommendationsHi
                      : DOSHA_PROFILES[selectedDosha].dietaryRecommendationsEn
                    ).map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lifestyle */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>{isHi ? 'जीवनशैली व व्यवहार (Lifestyle)' : 'Balancing Lifestyle Practices'}</span>
                  </h4>
                  <ul className="space-y-2">
                    {(isHi
                      ? DOSHA_PROFILES[selectedDosha].lifestyleTipsHi
                      : DOSHA_PROFILES[selectedDosha].lifestyleTipsEn
                    ).map((tip, i) => (
                      <li
                        key={i}
                        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <CheckCircle2 className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Daily Dinacharya Routine */}
      {activeSubTab === 'routine' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {isHi ? 'दिनचर्या (आयुर्वेदिक दैनिक स्वास्थ्य चक्र)' : 'Dinacharya (Circadian Wellness Protocol)'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isHi
                ? 'शरीर की जैविक घड़ी (Circadian Rhythm) के अनुसार स्वास्थ्य और दीर्घायु बनाए रखने के नियम।'
                : 'Aligning physiological routines with biological circadian rhythms for optimal vitality.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Morning */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{isHi ? 'प्रातःकाल (6:00 AM - 10:00 AM)' : 'Morning (6:00 AM - 10:00 AM)'}</span>
              </div>
              <ul className="text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{isHi ? 'सूर्योदय से पूर्व जागना (Brahma Muhurta)' : 'Wake before sunrise; drink warm water (Ushapan).'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{isHi ? 'जीभ की सफाई और तेल कुल्ला (Oil Pulling)' : 'Oral hygiene: tongue scraping and warm oil gargling.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{isHi ? 'हल्का प्राणायाम और सूर्य नमस्कार' : 'Gentle physical movement, Surya Namaskar, and Pranayama.'}</span>
                </li>
              </ul>
            </div>

            {/* Midday */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                <Coffee className="w-4 h-4 text-emerald-500" />
                <span>{isHi ? 'मध्याह्न (10:00 AM - 2:00 PM)' : 'Midday (10:00 AM - 2:00 PM)'}</span>
              </div>
              <ul className="text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{isHi ? 'पाचक अग्नि सबसे प्रबल - मुख्य भोजन लें' : 'Pitta peak: Enjoy the primary and most substantial meal.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{isHi ? 'भोजन के तुरंत बाद ठंडा पानी न पिएं' : 'Avoid cold drinks during meals to preserve digestive fire (Agni).'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{isHi ? 'दिन में सोने (दिवास्वप्न) से बचें' : 'Stay upright; avoid midday sleeping which aggravates Kapha.'}</span>
                </li>
              </ul>
            </div>

            {/* Evening / Night */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
              <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-300 font-bold text-sm">
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>{isHi ? 'सायंकाल व रात्रि (6:00 PM - 10:00 PM)' : 'Evening & Night (6:00 PM - 10:00 PM)'}</span>
              </div>
              <ul className="text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{isHi ? 'हल्का और सुपाच्य रात्रिभोज (सोने से 3 घंटे पूर्व)' : 'Light dinner at least 2.5–3 hours before bed.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{isHi ? 'डिजिटल स्क्रीन बंद करें (Digital Sunset)' : 'Limit blue-light exposure 60 minutes before bedtime.'}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{isHi ? 'पैरों की मालिश (पादाभ्यंग) एवं 10:30 से पूर्व शयन' : 'Foot massage with warm oil for sound restorative sleep.'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
