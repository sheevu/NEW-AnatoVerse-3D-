// Ayurveda & Preventive Wellness Evidence-Based Knowledge Base
// Compliant with Ministry of AYUSH reference guidelines & Integrative Medicine pharmacology

export interface HerbInteraction {
  herbName: string;
  hindiName: string;
  sanskritName: string;
  therapeuticCategory: string;
  traditionalUsesEn: string;
  traditionalUsesHi: string;
  evidenceSummary: string;
  contraindications: string[];
  drugInteractions: {
    allopathicDrug: string;
    riskLevel: 'critical' | 'moderate' | 'mild';
    mechanism: string;
    clinicalAdvice: string;
  }[];
}

export interface DoshaProfile {
  name: 'Vata' | 'Pitta' | 'Kapha';
  hindiName: string;
  elements: string;
  qualities: string[];
  balanceSigns: string[];
  imbalanceSigns: string[];
  dietaryRecommendationsEn: string[];
  dietaryRecommendationsHi: string[];
  lifestyleTipsEn: string[];
  lifestyleTipsHi: string[];
}

export const DOSHA_PROFILES: Record<string, DoshaProfile> = {
  Vata: {
    name: 'Vata',
    hindiName: 'वात (वायु + आकाश)',
    elements: 'Air + Space (वायु और आकाश)',
    qualities: ['Dry', 'Light', 'Cold', 'Rough', 'Subtle', 'Mobile'],
    balanceSigns: ['Energetic', 'Creative', 'Flexible', 'Clear mind', 'Good circulation'],
    imbalanceSigns: ['Dry skin', 'Constipation', 'Anxiety', 'Insomnia', 'Joint stiffness', 'Fatigue'],
    dietaryRecommendationsEn: [
      'Favor warm, freshly cooked, grounding foods (soups, stews, warm milk).',
      'Use healthy unrefined fats like ghee, sesame oil, and olive oil.',
      'Incorporate sweet, sour, and salty tastes; minimize raw or cold foods.',
    ],
    dietaryRecommendationsHi: [
      'गर्म, ताजा पका हुआ और पचने में आसान भोजन (दलिया, खिचड़ी, गर्म सूप) लें।',
      'भोजन में शुद्ध गाय का घी और तिल के तेल का संतुलित प्रयोग करें।',
      'ठंडी, सूखी और बासी चीजों से बचें; नियमित समय पर भोजन करें।',
    ],
    lifestyleTipsEn: [
      'Maintain regular daily sleep schedules; sleep before 10:30 PM.',
      'Practice gentle warming exercises like Hatha yoga and walking.',
      'Daily warm sesame oil self-massage (Abhyanga).',
    ],
    lifestyleTipsHi: [
      'नियमित दिनचर्या का पालन करें; रात 10:30 बजे से पहले सोएं।',
      'हल्के व्यायाम, प्राणायाम (अनुलोम-विलोम) और ध्यान करें।',
      'सप्ताह में 2-3 बार तिल के गर्म तेल से मालिश (अभ्यंग) करें।',
    ],
  },
  Pitta: {
    name: 'Pitta',
    hindiName: 'पित्त (अग्नि + जल)',
    elements: 'Fire + Water (अग्नि और जल)',
    qualities: ['Oily', 'Sharp', 'Hot', 'Light', 'Fleshy smell', 'Spreading'],
    balanceSigns: ['Sharp intellect', 'Strong digestion', 'Warm complexion', 'Courageous'],
    imbalanceSigns: ['Acid reflux', 'Skin rashes', 'Irritability', 'Inflammation', 'Excessive body heat'],
    dietaryRecommendationsEn: [
      'Favor cooling, hydrating foods (cucumbers, melons, mint, coconut water).',
      'Incorporate sweet, bitter, and astringent tastes; avoid excessive chilies and vinegar.',
      'Drink room-temperature or slightly cooled water; avoid ice-cold drinks.',
    ],
    dietaryRecommendationsHi: [
      'ठंडी तासीर वाले, रसदार फल और सब्जियां (खीरा, तरबूज, पुदीना, नारियल पानी) लें।',
      'अत्यधिक तीखा, तला-भुना, खट्टा और मसालेदार भोजन कम करें।',
      'पर्याप्त मात्रा में सामान्य तापमान का पानी पिएं।',
    ],
    lifestyleTipsEn: [
      'Avoid prolonged direct midday sun exposure; stay in well-ventilated spaces.',
      'Engage in calming exercises like swimming or evening walks in nature.',
      'Practice Sheetali and Sheetkari cooling breathing techniques.',
    ],
    lifestyleTipsHi: [
      'दोपहर की तेज धूप से बचें और शांत वातावरण में रहें।',
      'शाम के समय टहलना या तैराकी जैसे शांत व्यायाम करें।',
      'शीतली और शीतकारी प्राणायाम से शरीर को ठंडक पहुंचाएं।',
    ],
  },
  Kapha: {
    name: 'Kapha',
    hindiName: 'कफ (पृथ्वी + जल)',
    elements: 'Earth + Water (पृथ्वी और जल)',
    qualities: ['Heavy', 'Slow', 'Cool', 'Oily', 'Smooth', 'Dense', 'Soft'],
    balanceSigns: ['Stamina', 'Calm disposition', 'Strong immunity', 'Loyalty', 'Deep sleep'],
    imbalanceSigns: ['Lethargy', 'Weight gain', 'Sinus congestion', 'Fluid retention', 'Sluggish digestion'],
    dietaryRecommendationsEn: [
      'Favor light, warm, stimulating foods with pungent, bitter, and astringent flavors.',
      'Use warming spices like ginger, black pepper, cinnamon, and cumin.',
      'Minimize dairy, heavy desserts, deep-fried snacks, and refined sugars.',
    ],
    dietaryRecommendationsHi: [
      'हल्का, गर्म और पचने में आसान भोजन लें जिसमें अदरक, काली मिर्च और जीरा हो।',
      'दही, पनीर, मिठाइयां और तली-भुनी चीजों का सीमित उपयोग करें।',
      'गुनगुना पानी पिएं और दिन में सोने से बचें।',
    ],
    lifestyleTipsEn: [
      'Engage in vigorous cardiovascular exercises: brisk walking, cycling, or dynamic Surya Namaskar.',
      'Wake up early before sunrise (ideally before 6:00 AM).',
      'Incorporate dry brushing or dry powder massage (Udvartana).',
    ],
    lifestyleTipsHi: [
      'नियमित रूप से सक्रिय व्यायाम (तेज चलना, सूर्य नमस्कार) करें।',
      'सुबह सूर्योदय से पहले (प्रातः 6 बजे से पूर्व) उठें।',
      'आलस्य त्यागें और मानसिक व शारीरिक रूप से सक्रिय रहें।',
    ],
  },
};

export const HERB_SAFETY_DATABASE: HerbInteraction[] = [
  {
    herbName: 'Ashwagandha',
    hindiName: 'अश्वगंधा (Withania somnifera)',
    sanskritName: 'Withania somnifera (Indian Ginseng)',
    therapeuticCategory: 'Adaptogen / Rasayana (Rejuvenation)',
    traditionalUsesEn: 'Supports stress resilience, healthy sleep architecture, and vitality.',
    traditionalUsesHi: 'तनाव कम करने, मानसिक शांति, बेहतर नींद और शारीरिक शक्ति बढ़ाने में सहायक।',
    evidenceSummary: 'Randomized controlled trials support moderate reduction in salivary cortisol and perceived stress. May mildly modulate thyroid hormone synthesis.',
    contraindications: ['Autoimmune disorders (lupus, rheumatoid arthritis)', 'Severe hyperthyroidism', 'Pregnancy'],
    drugInteractions: [
      {
        allopathicDrug: 'Thyroid Medication (Levothyroxine / Eltroxin / Thyronorm)',
        riskLevel: 'critical',
        mechanism: 'Ashwagandha may stimulate thyroid gland activity, potentially exacerbating hyperthyroidism or skewing levothyroxine dosing.',
        clinicalAdvice: 'Do not take without regular TSH monitoring. Consult treating endocrinologist.',
      },
      {
        allopathicDrug: 'Sedatives & Benzodiazepines (Alprazolam, Clonazepam)',
        riskLevel: 'moderate',
        mechanism: 'Additive GABA-ergic sedative effects causing marked drowsiness and impaired psychomotor coordination.',
        clinicalAdvice: 'Avoid concurrent administration, especially before driving or operating machinery.',
      },
      {
        allopathicDrug: 'Antihypertensives (Amlodipine, Telmisartan)',
        riskLevel: 'mild',
        mechanism: 'May mildly lower blood pressure, potentially causing postural hypotension.',
        clinicalAdvice: 'Monitor home blood pressure regularly.',
      },
    ],
  },
  {
    herbName: 'Karela / Bitter Melon',
    hindiName: 'करेला (Momordica charantia)',
    sanskritName: 'Karavellaka',
    therapeuticCategory: 'Metabolic & Glycemic Support',
    traditionalUsesEn: 'Traditional dietary bitter used to balance Kapha and support healthy carbohydrate digestion.',
    traditionalUsesHi: 'रक्त शर्करा (ब्लड शुगर) को नियंत्रित करने और पाचन में सुधार के लिए पारंपरिक रूप से प्रयुक्त।',
    evidenceSummary: 'Contains charantin and polypeptide-p which exhibit insulin-mimetic properties in cellular and preclinical models.',
    contraindications: ['Hypoglycemia-prone individuals', 'Pregnancy', 'G6PD deficiency'],
    drugInteractions: [
      {
        allopathicDrug: 'Oral Hypoglycemics (Metformin, Glimepiride) & Insulin',
        riskLevel: 'critical',
        mechanism: 'Additive hypoglycemic effect. Combining potent bitter melon extracts with diabetes medication can cause dangerous drops in blood sugar (hypoglycemia).',
        clinicalAdvice: 'Monitor blood glucose with a glucometer. Inform your diabetologist before taking concentrated extract capsules.',
      },
    ],
  },
  {
    herbName: 'Guggulu / Guggul',
    hindiName: 'गुग्गुलु (Commiphora mukul)',
    sanskritName: 'Commiphora wightii',
    therapeuticCategory: 'Lipid & Joint Metabolism / Medohara',
    traditionalUsesEn: 'Traditional formulation for balancing Kapha and clearing metabolic toxins (Ama) from joints and blood vessels.',
    traditionalUsesHi: 'कोलेस्ट्रॉल और जोड़ों की जकड़न को संतुलित करने के लिए पारंपरिक उपयोग।',
    evidenceSummary: 'Guggulsterones act as farnesoid X receptor antagonists. Can induce CYP3A4 hepatic clearance enzymes.',
    contraindications: ['Active liver impairment', 'Bleeding disorders', 'Pregnancy / lactation'],
    drugInteractions: [
      {
        allopathicDrug: 'Statins (Atorvastatin, Rosuvastatin)',
        riskLevel: 'moderate',
        mechanism: 'Induction of CYP3A4 by guggul may reduce the circulating bioavailability of certain statins, altering therapeutic efficacy.',
        clinicalAdvice: 'Consult cardiologist. Separate ingestion times and check periodic lipid panels.',
      },
      {
        allopathicDrug: 'Anticoagulants & Antiplatelets (Warfarin, Aspirin, Clopidogrel)',
        riskLevel: 'critical',
        mechanism: 'Guggul possesses mild antiplatelet activity, which may elevate hemorrhage risk when combined with blood thinners.',
        clinicalAdvice: 'Strict caution required. Discontinue at least 2 weeks prior to scheduled surgical procedures.',
      },
    ],
  },
  {
    herbName: 'Triphala',
    hindiName: 'त्रिफला (Amla, Haritaki, Bibhitaki)',
    sanskritName: 'Phalatrikam',
    therapeuticCategory: 'Digestive Regimen / Anulomana',
    traditionalUsesEn: 'Mild bowel tonic, antioxidant formulation balancing all three doshas (Tridoshic).',
    traditionalUsesHi: 'पाचन तंत्र की सफाई, कब्ज निवारण और पेट के स्वास्थ्य के लिए प्रसिद्ध त्रिफला चूर्ण।',
    evidenceSummary: 'Rich in polyphenols, chebulic acid, and Vitamin C. Modulates intestinal motility and gut microbiota diversity.',
    contraindications: ['Acute diarrhea or dysentery', 'First trimester pregnancy'],
    drugInteractions: [
      {
        allopathicDrug: 'Oral Medications (Broad Absorption Impact)',
        riskLevel: 'moderate',
        mechanism: 'High tannin content and enhanced gut transit time may reduce the intestinal absorption of concurrent oral medications.',
        clinicalAdvice: 'Maintain an interval of at least 2 hours between taking Triphala and any prescribed prescription medicine.',
      },
    ],
  },
  {
    herbName: 'Tulsi / Holy Basil',
    hindiName: 'तुलसी (Ocimum sanctum)',
    sanskritName: 'Surasa / Tulasi',
    therapeuticCategory: 'Respiratory & Immunomodulatory',
    traditionalUsesEn: 'Respiratory comfort, soothing cough, relieving mild fever and seasonal congestion.',
    traditionalUsesHi: 'श्वसन तंत्र को स्वस्थ रखने, सर्दी-खांसी में राहत और रोग प्रतिरोधक क्षमता बढ़ाने हेतु।',
    evidenceSummary: 'Eugenol and rosmarinic acid provide anti-inflammatory and free-radical scavenging properties.',
    contraindications: ['Coupled with high-dose anticoagulants immediately prior to surgery'],
    drugInteractions: [
      {
        allopathicDrug: 'Blood Thinners (Heparin, Warfarin, Aspirin)',
        riskLevel: 'moderate',
        mechanism: 'Eugenol in Holy Basil may prolong bleeding time and inhibit platelet aggregation.',
        clinicalAdvice: 'Consume culinary amounts safely; avoid super-concentrated medicinal tinctures alongside prescription anticoagulants.',
      },
    ],
  },
];
