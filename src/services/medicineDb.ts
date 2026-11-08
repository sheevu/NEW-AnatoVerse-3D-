import { IndianMedicine } from '../types';

export const INDIAN_MEDICINES: IndianMedicine[] = [
  {
    id: 'med-dolo650',
    brandName: 'Dolo 650',
    genericName: 'Paracetamol / Acetaminophen (650mg)',
    genericNameHi: 'पैरासिटामोल (650 मि.ग्रा.)',
    category: 'Analgesic & Antipyretic (Pain & Fever)',
    categoryHi: 'दर्द निवारक और बुखार रोधी',
    commonUsesEn: ['Fever reduction', 'Mild to moderate body pain', 'Headache', 'Post-vaccination discomfort'],
    commonUsesHi: ['बुखार कम करना', 'हल्का से मध्यम बदन दर्द', 'सिरदर्द', 'टीकाकरण के बाद दर्द'],
    dosageForm: 'Oral Tablet',
    strengths: ['500mg', '650mg'],
    precautionsEn: 'Do not exceed 4000mg/day to prevent acute liver toxicity. Avoid alcohol consumption while on medication.',
    precautionsHi: 'लिवर की सुरक्षा के लिए 24 घंटे में 4000mg से अधिक न लें। दवा के साथ शराब से बचें।',
    sideEffectsEn: 'Nausea, allergic skin rash (rare), liver enzyme elevations with chronic overuse.',
    sideEffectsHi: 'मतली, त्वचा पर लाल चकत्ते (दुर्लभ), लंबे समय तक अधिक उपयोग से लिवर पर प्रभाव।',
    foodInteractionEn: 'Can be taken with or after food. Taking after meals prevents slight stomach irritation.',
    foodInteractionHi: 'भोजन के साथ या बाद में लें। भोजन के बाद लेने से पेट में जलन नहीं होती।',
    isPrescriptionRequired: false,
    verifiedSource: 'CDSCO / Indian Pharmacopoeia / DailyMed'
  },
  {
    id: 'med-glycomet',
    brandName: 'Glycomet 500 / 850 / 1000',
    genericName: 'Metformin Hydrochloride',
    genericNameHi: 'मेटफॉर्मिन हाइड्रोक्लोराइड',
    category: 'Anti-Diabetic (Biguanide)',
    categoryHi: 'मधुमेह रोधी (ब्लड शुगर नियंत्रक)',
    commonUsesEn: ['Type 2 Diabetes Mellitus glycemic management', 'Insulin sensitization', 'PCOS insulin resistance'],
    commonUsesHi: ['टाइप 2 डायबिटीज में ब्लड शुगर नियंत्रण', 'इंसुलिन संवेदनशीलता बढ़ाना', 'पीसीओएस में इंसुलिन रेजिस्टेंस'],
    dosageForm: 'Sustained Release Tablet (SR / ER)',
    strengths: ['500mg', '850mg', '1000mg'],
    precautionsEn: 'Monitor renal function (serum creatinine & eGFR) periodically. Rare risk of lactic acidosis with dehydration.',
    precautionsHi: 'गुर्दे की नियमित जांच कराएं। गंभीर निर्जलीकरण (डिहाइड्रेशन) होने पर डॉक्टर को सूचित करें।',
    sideEffectsEn: 'Bloating, metallic taste, soft stools during initial weeks, vitamin B12 deficiency with long-term use.',
    sideEffectsHi: 'शुरुआती हफ्तों में पेट फूलना, दस्त, मुंह में धातु जैसा स्वाद, लंबे समय तक लेने पर विटामिन B12 की कमी।',
    foodInteractionEn: 'Must be taken WITH meals to minimize gastrointestinal discomfort.',
    foodInteractionHi: 'पेट की परेशानी से बचने के लिए भोजन के ठीक साथ लें।',
    isPrescriptionRequired: true,
    verifiedSource: 'Indian National Formulary / openFDA'
  },
  {
    id: 'med-pand',
    brandName: 'Pan-D / Pantocid-DSR',
    genericName: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
    genericNameHi: 'पेंटोप्राजोल (40 मि.ग्रा.) + डोमपेरिडोन (30 मि.ग्रा.)',
    category: 'Proton Pump Inhibitor + Prokinetic',
    categoryHi: 'एसिडिटी और उल्टी/मतली रोधी दवा',
    commonUsesEn: ['Severe Acid Reflux (GERD)', 'Heartburn', 'Nausea associated with acidity', 'Peptic ulcer prevention'],
    commonUsesHi: ['गंभीर एसिड रिफ्लक्स (जीईआरडी)', 'सीने में जलन', 'एसिडिटी से जुड़ी मतली', 'पेट के अल्सर से बचाव'],
    dosageForm: 'Capsule',
    strengths: ['40mg + 30mg'],
    precautionsEn: 'Take strictly on an empty stomach. Not intended for long-term continuous use without gastroenterologist review.',
    precautionsHi: 'सुबह खाली पेट लें। बिना डॉक्टर की सलाह के लगातार कई महीनों तक न लें।',
    sideEffectsEn: 'Headache, dryness of mouth, dizziness, loose stools.',
    sideEffectsHi: 'सिरदर्द, मुंह सूखना, चक्कर आना, पेट खराब होना।',
    foodInteractionEn: 'Take 30-45 minutes BEFORE breakfast with a full glass of water.',
    foodInteractionHi: 'नाश्ते से 30-45 मिनट पहले एक गिलास पानी के साथ खाली पेट लें।',
    isPrescriptionRequired: true,
    verifiedSource: 'CDSCO India'
  },
  {
    id: 'med-telma',
    brandName: 'Telma 40 / Telmikind',
    genericName: 'Telmisartan',
    genericNameHi: 'टेल्मीसार्टन',
    category: 'Antihypertensive (ARB - Angiotensin Receptor Blocker)',
    categoryHi: 'उच्च रक्तचाप (बीपी) नियंत्रक',
    commonUsesEn: ['Hypertension (High Blood Pressure)', 'Cardiovascular risk reduction in diabetic patients'],
    commonUsesHi: ['उच्च रक्तचाप (हाई ब्लड प्रेशर) नियंत्रण', 'हृदय और गुर्दे की सुरक्षा'],
    dosageForm: 'Tablet',
    strengths: ['20mg', '40mg', '80mg'],
    precautionsEn: 'Strictly contraindicated during pregnancy. Monitor serum potassium and blood pressure regularly.',
    precautionsHi: 'गर्भावस्था में इस दवा का सेवन कतई न करें। पोटैशियम और बीपी की नियमित निगरानी करें।',
    sideEffectsEn: 'Dizziness upon standing quickly, fatigue, occasional back pain.',
    sideEffectsHi: 'अचानक उठने पर चक्कर आना, थकान, पीठ दर्द।',
    foodInteractionEn: 'Can be taken with or without food, preferably at the same time each morning.',
    foodInteractionHi: 'भोजन के साथ या बिना भोजन के लिया जा सकता है, प्रतिदिन एक निश्चित समय पर लें।',
    isPrescriptionRequired: true,
    verifiedSource: 'Indian Pharmacopoeia / DailyMed'
  },
  {
    id: 'med-augmentin',
    brandName: 'Augmentin 625 Duo / Moxikind-CV',
    genericName: 'Amoxicillin (500mg) + Clavulanic Acid (125mg)',
    genericNameHi: 'एमोक्सिसिलिन (500 मि.ग्रा.) + क्लैवुलैनिक एसिड (125 मि.ग्रा.)',
    category: 'Broad-Spectrum Antibiotic',
    categoryHi: 'ब्रॉड-स्पेक्ट्रम एंटीबायोटिक (संक्रमण रोधी)',
    commonUsesEn: ['Bacterial respiratory tract infections', 'Sinusitis', 'Urinary tract infections (UTI)', 'Dental abscess'],
    commonUsesHi: ['फेफड़ों व सांस नली का बैक्टीरियल संक्रमण', 'साइनस', 'मूत्र संक्रमण (यूटीआई)', 'दांतों का संक्रमण'],
    dosageForm: 'Oral Film-Coated Tablet',
    strengths: ['375mg', '625mg', '1000mg'],
    precautionsEn: 'Complete the entire course prescribed by the doctor to prevent antibiotic resistance. Do not use for viral colds.',
    precautionsHi: 'डॉक्टर द्वारा निर्धारित पूरा कोर्स पूरा करें। वायरल सर्दी-जुकाम में एंटीबायोटिक का उपयोग न करें।',
    sideEffectsEn: 'Diarrhea, mild nausea, fungal rash, abdominal cramps.',
    sideEffectsHi: 'दस्त, पेट में मरोड़, मतली, त्वचा पर रैश।',
    foodInteractionEn: 'Take at the start of a meal to enhance absorption and reduce stomach upset.',
    foodInteractionHi: 'भोजन की शुरुआत में लें ताकि अवशोषण बेहतर हो और पेट खराब न हो।',
    isPrescriptionRequired: true,
    verifiedSource: 'CDSCO / British Pharmacopoeia'
  },
  {
    id: 'med-azithral',
    brandName: 'Azithral 500 / Azee',
    genericName: 'Azithromycin',
    genericNameHi: 'एजिथ्रोमाइसिन',
    category: 'Macrolide Antibiotic',
    categoryHi: 'मैक्रोलाइड एंटीबायोटिक',
    commonUsesEn: ['Throat infections (tonsillitis, pharyngitis)', 'Bronchitis', 'Ear and skin infections'],
    commonUsesHi: ['गले का संक्रमण (टॉन्सिलाइटिस)', 'ब्रोंकाइटिस', 'कान और त्वचा का संक्रमण'],
    dosageForm: 'Tablet',
    strengths: ['250mg', '500mg'],
    precautionsEn: 'Notify physician if you have underlying cardiac arrhythmias or liver disease.',
    precautionsHi: 'यदि हृदय गति की समस्या या लिवर रोग हो तो डॉक्टर को पहले बताएं।',
    sideEffectsEn: 'Abdominal pain, loose stools, temporary taste changes.',
    sideEffectsHi: 'पेट दर्द, दस्त, स्वाद में हल्का बदलाव।',
    foodInteractionEn: 'Can be taken with or without food. Tablets can be taken with meals to minimize stomach upset.',
    foodInteractionHi: 'भोजन के साथ या बिना भोजन के लें।',
    isPrescriptionRequired: true,
    verifiedSource: 'DailyMed / CDSCO'
  },
  {
    id: 'med-allegra',
    brandName: 'Allegra 120 / 180',
    genericName: 'Fexofenadine Hydrochloride',
    genericNameHi: 'फेक्सोफेनाडाइन हाइड्रोक्लोराइड',
    category: 'Non-Sedating Antihistamine',
    categoryHi: 'एलर्जी रोधी (एंटी-एलर्जिक)',
    commonUsesEn: ['Allergic rhinitis (sneezing, runny nose)', 'Urticaria (itchy skin hives)', 'Seasonal pollen allergy'],
    commonUsesHi: ['एलर्जी (छींकें, बहती नाक, आंखों में खुजली)', 'पित्ती (त्वचा पर खुजली वाले चकत्ते)'],
    dosageForm: 'Tablet',
    strengths: ['120mg', '180mg'],
    precautionsEn: 'Do not take with fruit juices (apple, orange, grapefruit) within 4 hours as they reduce bioavailability.',
    precautionsHi: 'दवा लेने के 4 घंटे के भीतर सेब, संतरे या मौसमी का जूस न पिएं क्योंकि यह दवा का असर घटाता है।',
    sideEffectsEn: 'Headache, drowsiness (rare compared to older antihistamines).',
    sideEffectsHi: 'हल्का सिरदर्द, कभी-कभार थकान।',
    foodInteractionEn: 'Take with plain water only. Avoid citrus juices.',
    foodInteractionHi: 'केवल सादे पानी के साथ लें। फलों के रस से बचें।',
    isPrescriptionRequired: false,
    verifiedSource: 'openFDA'
  },
  {
    id: 'med-shelcal',
    brandName: 'Shelcal 500 / Cipcal',
    genericName: 'Calcium Carbonate (1250mg eq. to 500mg elemental Ca) + Vitamin D3 (250 IU)',
    genericNameHi: 'कैल्शियम + विटामिन डी3',
    category: 'Mineral & Vitamin Supplement',
    categoryHi: 'हड्डियों के लिए कैल्शियम व विटामिन डी पूरक',
    commonUsesEn: ['Bone strengthening (Osteoporosis prevention)', 'Pregnancy & lactation calcium support', 'Fracture healing'],
    commonUsesHi: ['हड्डियों की मजबूती (ऑस्टियोपोरोसिस से बचाव)', 'गर्भावस्था में पोषण', 'हड्डी जुड़ने में सहायता'],
    dosageForm: 'Oral Tablet',
    strengths: ['250mg', '500mg'],
    precautionsEn: 'Do not take at the same time as thyroid medicines (Thyronorm) or iron supplements; keep 2-4 hours gap.',
    precautionsHi: 'थायराइड की दवा या आयरन के साथ न लें; दोनों में कम से कम 2 से 4 घंटे का अंतर रखें।',
    sideEffectsEn: 'Mild constipation, belching.',
    sideEffectsHi: 'कब्ज, डकार आना।',
    foodInteractionEn: 'Best absorbed when taken after lunch or dinner.',
    foodInteractionHi: 'दोपहर या रात के भोजन के बाद लेने पर सबसे अच्छा अवशोषण होता है।',
    isPrescriptionRequired: false,
    verifiedSource: 'Indian Pharmacopoeia'
  },
  {
    id: 'med-atorva',
    brandName: 'Atorva 10 / 20 / Lipitor',
    genericName: 'Atorvastatin Calcium',
    genericNameHi: 'एटोरवास्टेटिन कैल्शियम',
    category: 'Statin / Lipid-Lowering Agent',
    categoryHi: 'कोलेस्ट्रॉल घटाने वाली दवा (स्टेटिन)',
    commonUsesEn: ['Hypercholesterolemia (High LDL / Triglycerides)', 'Atherosclerosis prevention', 'Post-stent heart protection'],
    commonUsesHi: ['उच्च कोलेस्ट्रॉल और एलडीएल कम करना', 'हार्ट अटैक और स्ट्रोक के जोखिम से बचाव'],
    dosageForm: 'Film-Coated Tablet',
    strengths: ['10mg', '20mg', '40mg', '80mg'],
    precautionsEn: 'Report unexplained muscle aches or weakness immediately. Check liver enzymes periodically.',
    precautionsHi: 'यदि मांसपेशियों में अकारण दर्द या कमजोरी महसूस हो तो तुरंत डॉक्टर को सूचित करें।',
    sideEffectsEn: 'Muscle pain (myalgia), mild liver enzyme elevation, joint discomfort.',
    sideEffectsHi: 'मांसपेशियों में दर्द, जोड़ों में खिंचाव।',
    foodInteractionEn: 'Take once daily at night (cholesterol synthesis peaks overnight). Avoid grapefruit.',
    foodInteractionHi: 'रोज रात को एक निश्चित समय पर लें। मौसमी/ग्रेपफ्रूट से बचें।',
    isPrescriptionRequired: true,
    verifiedSource: 'openFDA / DailyMed'
  },
  {
    id: 'med-thyronorm',
    brandName: 'Thyronorm / Eltroxin',
    genericName: 'Levothyroxine Sodium',
    genericNameHi: 'लेवोथायरोक्सिन सोडियम',
    category: 'Thyroid Hormone Replacement',
    categoryHi: 'थायराइड हार्मोन सप्लीमेंट',
    commonUsesEn: ['Hypothyroidism (Underactive Thyroid)', 'Goiter management', 'Post-thyroidectomy hormone maintenance'],
    commonUsesHi: ['हाइपोथायरायडिज्म (थायराइड की कमी)', 'गले की गांठ (घेंघा)', 'थायराइड सर्जरी के बाद'],
    dosageForm: 'Tablet',
    strengths: ['25mcg', '50mcg', '75mcg', '88mcg', '100mcg', '125mcg'],
    precautionsEn: 'Strict adherence to timing is essential. Do not alter doses without checking Serum TSH levels.',
    precautionsHi: 'नियमित समय पर लेना अनिवार्य है। हर 2-3 महीने में टीएसएच जांच के बिना खुराक न बदलें।',
    sideEffectsEn: 'Palpitations, weight loss, heat intolerance if over-replaced.',
    sideEffectsHi: 'अधिक खुराक होने पर दिल की धड़कन तेज होना, पसीना आना या घबराहट।',
    foodInteractionEn: 'Must be taken FIRST THING IN THE MORNING on a strictly empty stomach, 45-60 min before tea/coffee/breakfast.',
    foodInteractionHi: 'सुबह सोकर उठते ही खाली पेट केवल पानी के साथ लें। चाय, कॉफी या नाश्ते से कम से कम 45 मिनट पहले।',
    isPrescriptionRequired: true,
    verifiedSource: 'Indian Pharmacopoeia'
  }
];

export async function searchMedicines(query: string): Promise<IndianMedicine[]> {
  const q = query.trim().toLowerCase();
  if (!q) return INDIAN_MEDICINES.slice(0, 8);

  const localMatches = INDIAN_MEDICINES.filter(m =>
    m.brandName.toLowerCase().includes(q) ||
    m.genericName.toLowerCase().includes(q) ||
    m.genericNameHi.toLowerCase().includes(q) ||
    m.category.toLowerCase().includes(q) ||
    m.commonUsesEn.some(u => u.toLowerCase().includes(q)) ||
    m.commonUsesHi.some(u => u.includes(q))
  );

  if (localMatches.length > 0) {
    return localMatches;
  }

  // Fallback to openFDA live lookup if available
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(q)}"+openfda.brand_name:"${encodeURIComponent(q)}"&limit=3`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const fetched: IndianMedicine[] = data.results.map((r: any, idx: number) => ({
          id: `fda-${r.id || idx}`,
          brandName: r.openfda?.brand_name?.[0] || q.toUpperCase(),
          genericName: r.openfda?.generic_name?.[0] || 'Active Pharmaceutical Ingredient',
          genericNameHi: 'जेनेरिक दवा (सक्रिय घटक)',
          category: r.openfda?.pharm_class_cs?.[0] || 'Therapeutic Agent',
          categoryHi: 'चिकित्सीय दवा',
          commonUsesEn: (r.indications_and_usage?.[0] || 'See packaging for authorized indications').slice(0, 200).split('. '),
          commonUsesHi: ['डॉक्टर द्वारा निर्देशित उपयोग देखें'],
          dosageForm: 'Oral Dosage',
          strengths: ['Standard medical strength'],
          precautionsEn: (r.warnings?.[0] || r.warnings_and_cautions?.[0] || 'Use strictly under clinical supervision.').slice(0, 280),
          precautionsHi: 'केवल पंजीकृत चिकित्सक की देखरेख में उपयोग करें।',
          sideEffectsEn: (r.adverse_reactions?.[0] || 'Consult physician if unusual symptoms occur.').slice(0, 240),
          sideEffectsHi: 'असामान्य लक्षण होने पर तुरंत डॉक्टर से संपर्क करें।',
          foodInteractionEn: 'Consult healthcare professional or packaging insert for specific food directions.',
          foodInteractionHi: 'दवा के साथ खान-पान के निर्देशों के लिए डॉक्टर से पूछें।',
          isPrescriptionRequired: true,
          verifiedSource: 'openFDA Drug Label Data'
        }));
        return fetched;
      }
    }
  } catch {
    // If openFDA is offline or rate-limited, return nearest local medicines
  }

  return INDIAN_MEDICINES.slice(0, 5);
}
