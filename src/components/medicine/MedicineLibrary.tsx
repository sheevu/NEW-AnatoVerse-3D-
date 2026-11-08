import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IndianMedicine } from '../../types';
import { searchMedicines, INDIAN_MEDICINES } from '../../services/medicineDb';
import {
  Search,
  Pill,
  ShieldAlert,
  Clock,
  Utensils,
  CheckCircle,
  FileText,
  Tag,
  AlertCircle,
} from 'lucide-react';

export function MedicineLibrary() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [medicines, setMedicines] = useState<IndianMedicine[]>(INDIAN_MEDICINES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      const results = await searchMedicines(searchQuery);
      if (!isCancelled) {
        setMedicines(results);
        setLoading(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  const categories = [
    { id: 'all', labelEn: 'All Medicines', labelHi: 'सभी दवाएं' },
    { id: 'fever', labelEn: 'Fever & Pain', labelHi: 'बुखार व दर्द', match: 'dolo|paracetamol' },
    { id: 'diabetes', labelEn: 'Diabetes', labelHi: 'डायबिटीज', match: 'glycomet|metformin' },
    { id: 'acidity', labelEn: 'Acidity & Digestion', labelHi: 'एसिडिटी व पेट', match: 'pan-d|pantocid' },
    { id: 'bp', labelEn: 'Blood Pressure & Heart', labelHi: 'बीपी व हृदय', match: 'telma|atorva' },
    { id: 'antibiotic', labelEn: 'Antibiotics', labelHi: 'एंटीबायोटिक', match: 'augmentin|azithral' },
    { id: 'allergy', labelEn: 'Allergy', labelHi: 'एलर्जी', match: 'allegra' },
    { id: 'calcium', labelEn: 'Bones & Thyroid', labelHi: 'हड्डियां व थायराइड', match: 'shelcal|thyronorm' },
  ];

  const filteredMedicines = medicines.filter((m) => {
    if (activeCategory === 'all') return true;
    const cat = categories.find((c) => c.id === activeCategory);
    if (!cat || !cat.match) return true;
    const regex = new RegExp(cat.match, 'i');
    return regex.test(m.brandName) || regex.test(m.genericName);
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Search Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-emerald-200 text-xs font-bold">
            <Pill className="w-3.5 h-3.5" />
            <span>Verified Indian Pharmacopoeia Database</span>
          </div>
          <h2 className="text-2xl font-black">{t('medicines.title')}</h2>
          <p className="text-xs text-slate-300">{t('medicines.subtitle')}</p>
        </div>

        {/* Search Bar */}
        <div className="mt-5 relative max-w-xl">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('medicines.searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium placeholder-slate-400 shadow-lg outline-none focus:ring-2 focus:ring-emerald-400 border border-transparent dark:border-slate-700"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-emerald-400'
            }`}
          >
            {lang === 'hi' ? cat.labelHi : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Medicine Grid */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
          No medicines matched your query. Try searching generic names like Paracetamol, Metformin, or Pantoprazole.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {med.brandName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        med.isPrescriptionRequired
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/40'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/40'
                      }`}
                    >
                      {med.isPrescriptionRequired
                        ? t('medicines.prescriptionRequired')
                        : t('medicines.otc')}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {lang === 'hi' ? med.genericNameHi : med.genericName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'hi' ? med.categoryHi : med.category} • {med.dosageForm}
                  </p>
                </div>
              </div>

              {/* Uses */}
              <div>
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {t('medicines.uses')}
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {(lang === 'hi' ? med.commonUsesHi : med.commonUsesEn).map(
                    (use, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        ✓ {use}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Food & Timing */}
              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2 text-xs">
                <Utensils className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-300">
                    {t('medicines.food')}:{' '}
                  </span>
                  <span className="text-emerald-800 dark:text-emerald-200 text-[11px]">
                    {lang === 'hi' ? med.foodInteractionHi : med.foodInteractionEn}
                  </span>
                </div>
              </div>

              {/* Precautions & Warnings */}
              <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex items-start gap-2 text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-300">
                    {t('medicines.precautions')}:{' '}
                  </span>
                  <span className="text-amber-800 dark:text-amber-200 text-[11px]">
                    {lang === 'hi' ? med.precautionsHi : med.precautionsEn}
                  </span>
                </div>
              </div>

              {/* Footer source citation */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>{t('medicines.source')}: {med.verifiedSource}</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Strengths: {med.strengths.join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
