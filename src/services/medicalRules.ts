import { OrganDetail, OrganKey, RangeStatus, TestRow, DoctorQuestion } from '../types';

export const ORGANS: Record<OrganKey, OrganDetail> = {
  brain: {
    key: 'brain',
    nameEn: 'Brain & Central Nervous System',
    nameHi: 'मस्तिष्क (दिमाग)',
    fmaId: 'FMA50801 / BP49',
    color: '#e58e99',
    highlightColor: '#f43f5e',
    position: [0.0, 2.15, -0.04],
    arrowOffset: [0.45, 2.45, 0.25],
    cameraDistance: 1.05,
    shortInsightEn: 'Governs all cognitive thoughts, memory, motor reflexes, and vital autonomous body rhythms.',
    shortInsightHi: 'सोच, स्मृति, सजगता और शरीर की सभी स्वैच्छिक व अनैच्छिक क्रियाओं का नियंत्रण केंद्र।',
    functionEn: 'Master neurological center regulating cognition, autonomous cardiac rhythm, metabolic homeostasis, and motor coordination.',
    functionHi: 'सोच, गति, हृदय गति नियंत्रण और समग्र शारीरिक संतुलन बनाए रखने वाला मुख्य तंत्रिका केंद्र।',
    descriptionEn: 'Sensory and motor processing unit sensitive to fluid electrolytes (Sodium, Potassium), Vitamin B12, and systemic oxygenation.',
    descriptionHi: 'विचार, स्मृति और शारीरिक क्रियाओं का समन्वय करता है। सोडियम, पोटैशियम, विटामिन B12 और ऑक्सीजन स्तर से अत्यधिक प्रभावित होता है।',
    symptomsEn: ['headache', 'dizziness', 'memory loss', 'brain fog', 'migraine', 'tingling', 'numbness', 'confusion', 'insomnia'],
    symptomsHi: ['सिरदर्द', 'चक्कर आना', 'याददाश्त की कमी', 'सुस्ती', 'माइग्रेन', 'हाथ पैर में झनझनाहट', 'अनिद्रा'],
    recommendedTests: ['Serum Vitamin B12', 'Serum Electrolytes (Na, K)', 'Fasting Blood Sugar', 'Thyroid Profile (TSH)'],
    triangles: 18000,
    files: ['FMA50801', 'BP49', 'BP50', 'FMA61844']
  },
  heart: {
    key: 'heart',
    nameEn: 'Heart & Cardiovascular System',
    nameHi: 'हृदय (दिल)',
    fmaId: 'FMA7274',
    color: '#dc2626',
    highlightColor: '#ef4444',
    position: [0.05, 1.22, 0.07],
    arrowOffset: [0.55, 1.45, 0.35],
    cameraDistance: 0.95,
    shortInsightEn: 'Beats ~100,000 times daily, circulating 7,500 liters of blood through the arterial network.',
    shortInsightHi: 'प्रतिदिन लगभग 1 लाख बार धड़कता है और पूरे शरीर में 7,500 लीटर रक्त का संचार करता है।',
    functionEn: 'Muscular pump generating systemic blood pressure to circulate oxygen and nutrients to all bodily tissues.',
    functionHi: 'पूरे शरीर में ऑक्सीजन व पोषक तत्वों से भरपूर रक्त का निरंतर संचार बनाए रखने वाला मुख्य पंप।',
    descriptionEn: 'Pumps blood around the body. Blood lipid markers (Cholesterol, LDL, HDL, Triglycerides) reflect vascular plaque and cardiovascular risks.',
    descriptionHi: 'पूरे शरीर में रक्त पंप करता है। लिपिड जांच (कोलेस्ट्रॉल, एलडीएल, ट्राइग्लिसराइड्स) धमनियों के स्वास्थ्य और हृदय संबंधी जोखिम को समझने में सहायक है।',
    symptomsEn: ['chest pain', 'palpitations', 'high bp', 'breathlessness', 'chest tightness', 'rapid heart rate', 'sweating on exertion'],
    symptomsHi: ['सीने में दर्द', 'घबराहट', 'धड़कन तेज होना', 'हाई बीपी', 'सांस फूलना', 'सीने में भारीपन', 'पसीना आना'],
    recommendedTests: ['Lipid Profile (Total Cholesterol, LDL, HDL)', 'Serum Triglycerides', 'ECG', 'Hs-CRP', 'Troponin-I'],
    triangles: 9000,
    files: ['FMA7274']
  },
  lungs: {
    key: 'lungs',
    nameEn: 'Lungs & Pulmonary Network',
    nameHi: 'फेफड़े (फुफ्फुस)',
    fmaId: 'FMA7333-7383',
    color: '#38bdf8',
    highlightColor: '#0ea5e9',
    position: [-0.01, 1.21, 0.00],
    arrowOffset: [-0.60, 1.50, 0.30],
    cameraDistance: 1.35,
    shortInsightEn: 'Contains ~300 million micro-alveoli providing a gas-exchange surface area as large as a tennis court.',
    shortInsightHi: 'लगभग 30 करोड़ सूक्ष्म वायु-थैलियां होती हैं जो रक्त को निरंतर शुद्ध ऑक्सीजन प्रदान करती हैं।',
    functionEn: 'Pulmonary alveolar exchange of atmospheric oxygen with metabolic carbon dioxide during inhalation and exhalation.',
    functionHi: 'सांस लेने पर फेफड़ों की वायु-थैलियों द्वारा ऑक्सीजन को रक्त में मिलाना और कार्बन डाइऑक्साइड को बाहर निकालना।',
    descriptionEn: 'Exchanges oxygen and carbon dioxide. Red blood cells and Hemoglobin determine oxygen carrying capacity to organs.',
    descriptionHi: 'सांस लेते समय ऑक्सीजन और कार्बन डाइऑक्साइड का आदान-प्रदान करते हैं। हीमोग्लोबिन स्तर सीधे फेफड़ों से शरीर तक ऑक्सीजन ले जाने की क्षमता तय करता है।',
    symptomsEn: ['cough', 'wheezing', 'shortness of breath', 'asthma', 'mucus', 'chest congestion', 'fatigue due to low oxygen'],
    symptomsHi: ['खांसी', 'सांस लेने में कठिनाई', 'दमा', 'बलगम', 'छाती में जकड़न', 'कमजोरी', 'जल्दी थक जाना'],
    recommendedTests: ['Complete Blood Count (Hemoglobin, RBC)', 'SPO2 Pulse Oximetry', 'Chest X-Ray', 'ESR (Infection Marker)'],
    triangles: 9000,
    files: ['FMA7333', 'FMA7337', 'FMA7370', 'FMA7371', 'FMA7383']
  },
  liver: {
    key: 'liver',
    nameEn: 'Liver & Hepatic System',
    nameHi: 'यकृत (लिवर)',
    fmaId: 'FMA7197',
    color: '#b45309',
    highlightColor: '#d97706',
    position: [-0.13, 0.93, 0.10],
    arrowOffset: [-0.55, 1.15, 0.35],
    cameraDistance: 1.05,
    shortInsightEn: 'The body\'s primary chemical factory performing over 500 vital metabolic and detoxifying functions.',
    shortInsightHi: 'शरीर की सबसे बड़ी ग्रंथि जो 500 से अधिक रासायनिक व विष-निवारक कार्य करती है।',
    functionEn: 'Central metabolic processing organ synthesizing clotting proteins, metabolizing lipids, detoxifying compounds, and producing bile.',
    functionHi: 'रक्त के थक्के बनाने वाले प्रोटीन का निर्माण, दवाओं व विषैले पदार्थों का शुद्धिकरण और पित्त रस बनाना।',
    descriptionEn: 'Processes nutrients, synthesizes albumin, and filters toxins. Transaminases (SGPT/ALT, SGOT/AST) and Bilirubin indicate liver tissue integrity.',
    descriptionHi: 'पोषक तत्वों को संसाधित करता है और प्रोटीन बनाता है। लिवर एंजाइम (SGPT/ALT, SGOT/AST, बिलीरुबिन) की जांच लिवर की सूजन या दबाव की स्थिति दर्शाती है।',
    symptomsEn: ['jaundice', 'yellow eyes', 'fatty liver', 'upper right abdominal pain', 'nausea', 'loss of appetite', 'dark urine'],
    symptomsHi: ['पीलिया', 'आंखों में पीलापन', 'फैटी लिवर', 'पेट के दाहिने ऊपरी हिस्से में दर्द', 'भूख न लगना', 'मतली', 'गहरा पेशाब'],
    recommendedTests: ['Liver Function Test (SGPT/ALT, SGOT/AST)', 'Total Bilirubin', 'Alkaline Phosphatase (ALP)', 'Serum Albumin'],
    triangles: 9000,
    files: ['FMA7197']
  },
  pancreas: {
    key: 'pancreas',
    nameEn: 'Pancreas & Insulin Gland',
    nameHi: 'अग्न्याशय (पैन्क्रियाज)',
    fmaId: 'FMA7198nsn',
    color: '#eab308',
    highlightColor: '#facc15',
    position: [-0.02, 0.71, 0.11],
    arrowOffset: [-0.45, 0.85, 0.35],
    cameraDistance: 0.85,
    shortInsightEn: 'Produces insulin to channel glucose into energy cells; vital regulator in preventing diabetes.',
    shortInsightHi: 'इंसुलिन बनाता है जो रक्त शर्करा को ऊर्जा में बदलता है; डायबिटीज नियंत्रण में सबसे अहम अंग।',
    functionEn: 'Dual-action gland secreting insulin and glucagon from Islets of Langerhans, plus exocrine digestive enzymes into the duodenum.',
    functionHi: 'रक्त शर्करा नियंत्रित करने के लिए इंसुलिन और ग्लूकागोन हार्मोन बनाना तथा भोजन पचाने वाले एंजाइम उत्पन्न करना।',
    descriptionEn: 'Produces insulin to regulate cellular glucose uptake. Fasting Glucose and HbA1c reflect pancreatic endocrine balance.',
    descriptionHi: 'इंसुलिन बनाता है जो रक्त में शर्करा को नियंत्रित करता है। फास्टिंग ग्लूकोज और एचबीए1सी अग्न्याशय के कार्य और प्रीडायबिटीज के स्तर को दर्शाते हैं।',
    symptomsEn: ['frequent urination', 'excessive thirst', 'high blood sugar', 'unexplained weight loss', 'sugar spikes', 'sweet cravings'],
    symptomsHi: ['बार-बार पेशाब आना', 'अधिक प्यास लगना', 'ब्लड शुगर बढ़ना', 'अचानक वजन कम होना', 'मीठा खाने की तीव्र इच्छा'],
    recommendedTests: ['Fasting Blood Glucose', 'Post-Prandial Blood Sugar', 'HbA1c (3-Month Glycemic Average)', 'Serum Amylase & Lipase'],
    triangles: 9000,
    files: ['FMA7198nsn']
  },
  stomach: {
    key: 'stomach',
    nameEn: 'Stomach & Gastric Cavity',
    nameHi: 'पेट (आमाशय)',
    fmaId: 'FMA7148',
    color: '#ea580c',
    highlightColor: '#f97316',
    position: [0.16, 0.89, 0.12],
    arrowOffset: [0.55, 1.10, 0.35],
    cameraDistance: 0.95,
    shortInsightEn: 'Generates potent gastric acid (pH 1.5-2.0) capable of breaking down tough nutrients and sterilizing microbes.',
    shortInsightHi: 'शक्तिशाली पाचक अम्ल बनाता है जो भोजन को पचाने और भोजन के हानिकारक बैक्टीरिया को नष्ट करने में सक्षम है।',
    functionEn: 'Muscular reservoir churning food with hydrochloric acid and pepsin to initiate protein digestion.',
    functionHi: 'हाइड्रोक्लोरिक एसिड और पाचक एंजाइमों द्वारा भोजन को पीसकर छोटी आंत में भेजने के लिए तैयार करना।',
    descriptionEn: 'Secretes gastric juices and digestive acids. Strongly influenced by spicy diets, painkiller medications, and H. pylori.',
    descriptionHi: 'भोजन को पचाने के लिए पाचक रस और अम्ल बनाता है। अधिक दर्द निवारक दवाओं, एसिडिटी और खान-पान की आदतों से प्रभावित होता है।',
    symptomsEn: ['acidity', 'heartburn', 'acid reflux', 'bloating', 'burning sensation in chest', 'gastritis', 'belching', 'stomach cramps'],
    symptomsHi: ['एसिडिटी', 'सीने में जलन', 'खट्टी डकारें', 'पेट फूलना', 'पेट में गैस', 'उल्टी जैसा लगना', 'पेट में जलन'],
    recommendedTests: ['H. Pylori Antigen Test', 'Stomach Ultrasound', 'Endoscopy Evaluation', 'Complete Stool Examination'],
    triangles: 9000,
    files: ['FMA7148']
  },
  kidneys: {
    key: 'kidneys',
    nameEn: 'Kidneys & Renal Filtration',
    nameHi: 'गुर्दे (किडनी)',
    fmaId: 'FMA7204-7205',
    color: '#7c3aed',
    highlightColor: '#8b5cf6',
    position: [-0.02, 0.71, -0.07],
    arrowOffset: [-0.48, 0.75, -0.35],
    cameraDistance: 0.95,
    shortInsightEn: 'Contains ~2 million microscopic nephron filters purifying 180 liters of blood daily.',
    shortInsightHi: 'दोनों गुर्दों में लगभग 20 लाख सूक्ष्म नेफ्रॉन फिल्टर होते हैं जो प्रतिदिन 180 लीटर रक्त को शुद्ध करते हैं।',
    functionEn: 'Renal nephrons filtering metabolic wastes (creatinine, urea) from plasma and maintaining blood volume, electrolytes, and arterial pH.',
    functionHi: 'रक्त से अपशिष्ट (क्रिएटिनिन, यूरिया) छानना और शरीर में पानी, नमक व रक्तचाप का सटीक संतुलन बनाए रखना।',
    descriptionEn: 'Filters blood to form urine and regulate hydration. Serum Creatinine, Urea, and eGFR indicate renal filtration health.',
    descriptionHi: 'रक्त को छानते हैं और अतिरिक्त तरल को मूत्र के रूप में बाहर निकालते हैं। सीरम क्रिएटिनिन और ईजीएफआर गुर्दे की कार्यक्षमता के प्रमुख संकेतक हैं।',
    symptomsEn: ['swelling in feet', 'puffy eyes', 'foamy urine', 'lower back flank pain', 'reduced urination', 'high urea'],
    symptomsHi: ['पैरों में सूजन', 'आंखों के नीचे सूजन', 'झागदार पेशाब', 'कमर के निचले हिस्से में दर्द', 'पेशाब कम आना', 'क्रिएटिनिन बढ़ना'],
    recommendedTests: ['Serum Creatinine', 'Blood Urea Nitrogen (BUN)', 'eGFR (Filtration Rate)', 'Urine Routine & Microscopic', 'Uric Acid'],
    triangles: 9000,
    files: ['FMA7204', 'FMA7205']
  },
  intestines: {
    key: 'intestines',
    nameEn: 'Intestines & Gut Microbiome',
    nameHi: 'आंतें (पाचन तंत्र)',
    fmaId: 'FMA7206-7208',
    color: '#059669',
    highlightColor: '#10b981',
    position: [0.02, 0.41, 0.13],
    arrowOffset: [0.50, 0.45, 0.35],
    cameraDistance: 1.15,
    shortInsightEn: 'Measures ~7.5 meters in length and houses ~70% of the body\'s immune defense cells.',
    shortInsightHi: 'लगभग 22 फीट लंबी होती हैं और शरीर की 70% रोग प्रतिरोधक क्षमता आंतों के माइक्रोबायोम में होती है।',
    functionEn: 'Terminal nutrient absorption in small intestine villi and water reclamation/microbiome synthesis in large colon.',
    functionHi: 'भोजन से आवश्यक विटामिन, खनिज और पानी का अवशोषण तथा रोग प्रतिरोधक क्षमता (आंतों के माइक्रोबायोम) की रक्षा करना।',
    descriptionEn: 'Absorbs nutrients and houses the gut microbiome. Inflammatory and immune markers (Platelets, ESR, WBC) reflect gut barrier health.',
    descriptionHi: 'पोषक तत्वों और पानी को अवशोषित करती हैं। शरीर की 70% रोग प्रतिरोधक क्षमता आंतों के स्वास्थ्य और पाचन तंत्र से जुड़ी होती है।',
    symptomsEn: ['constipation', 'diarrhea', 'cramps', 'IBS', 'indigestion', 'gas and flatulence', 'abdominal pain', 'loose stools'],
    symptomsHi: ['कब्ज', 'दस्त (लूज मोशन)', 'पेट में मरोड़', 'आईबीएस', 'अपच', 'पेट में भारीपन', 'गैस बनना'],
    recommendedTests: ['Stool Routine & Occult Blood', 'Serum Calprotectin', 'Complete Hemogram (Platelets, WBC)', 'C-Reactive Protein (CRP)'],
    triangles: 9000,
    files: ['FMA7206', 'FMA7207', 'FMA7208', 'FMA14543nsn']
  }
};

export function identifyOrganFromSymptom(query: string): {
  organ: OrganKey | null;
  confidence: 'high' | 'medium' | 'low';
  explanationEn: string;
  explanationHi: string;
  suggestedTests: string[];
} {
  const q = query.toLowerCase();

  // Heart
  if (/chest\s*pain|palpitat|heart|bp|blood\s*pressure|hypertens|cholesterol|cardio|धड़कन|दिल|बीपी|सीने\s*में\s*दर्द/.test(q)) {
    return {
      organ: 'heart',
      confidence: 'high',
      explanationEn: 'Your symptoms relate to the Cardiovascular System (Heart). Variations in blood pressure, heart rate, or chest pressure warrant evaluation.',
      explanationHi: 'आपके लक्षण हृदय व रक्त परिसंचरण तंत्र से जुड़े हैं। सीने में भारीपन, धड़कन तेज होना या बीपी की समस्या में हृदय की जांच जरूरी है।',
      suggestedTests: ORGANS.heart.recommendedTests
    };
  }

  // Pancreas & Glucose
  if (/sugar|glucose|diabet|thirst|urination|hba1c|शर्करा|शुगर|डायबिटीज|प्यास|बार-बार\s*पेशाब/.test(q)) {
    return {
      organ: 'pancreas',
      confidence: 'high',
      explanationEn: 'Your symptoms match metabolic glucose regulation, primarily managed by the Pancreas via insulin secretion.',
      explanationHi: 'आपके लक्षण रक्त शर्करा (ब्लड शुगर) और मेटाबॉलिज्म से जुड़े हैं, जिसे मुख्य रूप से अग्न्याशय (पैन्क्रियाज) नियंत्रित करता है।',
      suggestedTests: ORGANS.pancreas.recommendedTests
    };
  }

  // Liver
  if (/liver|jaundice|sgpt|sgot|bilirubin|fatty\s*liver|लिवर|पीलिया|यकृत|दाहिने\s*पेट/.test(q)) {
    return {
      organ: 'liver',
      confidence: 'high',
      explanationEn: 'Your symptoms indicate the Hepatic System (Liver), which handles nutrient synthesis, lipid metabolism, and toxin clearance.',
      explanationHi: 'आपके लक्षण लिवर (यकृत) से संबंधित हैं। यह पाचन, एंजाइम संतुलन और विषैले तत्वों को साफ करने का प्रमुख अंग है।',
      suggestedTests: ORGANS.liver.recommendedTests
    };
  }

  // Lungs
  if (/breath|cough|lung|asthma|wheez|oxygen|spo2|सांस|खांसी|फेफड़े|दमा|जकड़न/.test(q)) {
    return {
      organ: 'lungs',
      confidence: 'high',
      explanationEn: 'Your symptoms correspond to the Respiratory System (Lungs), responsible for oxygen intake and carbon dioxide expulsion.',
      explanationHi: 'आपके लक्षण श्वसन तंत्र (फेफड़ों) से संबंधित हैं। खांसी, सांस फूलना या ऑक्सीजन की कमी फेफड़ों की जांच का संकेत देती है।',
      suggestedTests: ORGANS.lungs.recommendedTests
    };
  }

  // Kidneys
  if (/kidney|creatinine|swelling|feet|edema|urea|foamy|गुर्दे|किडनी|पैरों\s*में\s*सूजन|झागदार/.test(q)) {
    return {
      organ: 'kidneys',
      confidence: 'high',
      explanationEn: 'Your symptoms point toward the Renal Filtration System (Kidneys), responsible for fluid balance and blood purification.',
      explanationHi: 'आपके लक्षण गुर्दे (किडनी) से संबंधित हैं। पैरों में सूजन, पेशाब में बदलाव या कमर दर्द में गुर्दे की जांच आवश्यक है।',
      suggestedTests: ORGANS.kidneys.recommendedTests
    };
  }

  // Stomach
  if (/acid|reflux|heartburn|bloat|stomach|gastric|vomit|एसिडिटी|खट्टी\s*डकार|सीने\s*में\s*जलन|पेट\s*में\s*जलन/.test(q)) {
    return {
      organ: 'stomach',
      confidence: 'high',
      explanationEn: 'Your symptoms point to the Gastric Cavity (Stomach), where digestive acid secretion can lead to reflux or gastritis.',
      explanationHi: 'आपके लक्षण आमाशय (पेट) और एसिडिटी से जुड़े हैं। भोजन के बाद जलन या खट्टी डकारें पाचक अम्ल के असंतुलन को दर्शाती हैं।',
      suggestedTests: ORGANS.stomach.recommendedTests
    };
  }

  // Brain
  if (/headache|migraine|dizzy|memory|fog|neuro|सिरदर्द|चक्कर|माइग्रेन|दिमाग/.test(q)) {
    return {
      organ: 'brain',
      confidence: 'high',
      explanationEn: 'Your symptoms correlate with the Central Nervous System (Brain) and cerebral blood flow.',
      explanationHi: 'आपके लक्षण मस्तिष्क व तंत्रिका तंत्र से जुड़े हैं। सिरदर्द या चक्कर आना तनाव, नींद या इलेक्ट्रोलाइट्स की कमी से हो सकता है।',
      suggestedTests: ORGANS.brain.recommendedTests
    };
  }

  // Intestines
  if (/constipat|diarrhea|cramp|gut|bowel|stool|ibs|कब्ज|दस्त|आंतें|पेट\s*खराब|मरोड़/.test(q)) {
    return {
      organ: 'intestines',
      confidence: 'high',
      explanationEn: 'Your symptoms correlate with the Gastrointestinal Tract (Intestines), regulating fluid absorption and microbiome health.',
      explanationHi: 'आपके लक्षण आंतों (पाचन तंत्र) से जुड़े हैं। कब्ज या पेट खराब होने पर आंतों के माइक्रोबायोम और खान-पान पर ध्यान दें।',
      suggestedTests: ORGANS.intestines.recommendedTests
    };
  }

  return {
    organ: null,
    confidence: 'low',
    explanationEn: 'These symptoms appear multi-systemic. Review your overall health panel or consult a general physician for guidance.',
    explanationHi: 'ये लक्षण कई अंगों से जुड़े हो सकते हैं। समग्र स्वास्थ्य जांच के लिए अपने चिकित्सक से परामर्श लें।',
    suggestedTests: ['Complete Blood Count (CBC)', 'Comprehensive Metabolic Panel', 'Fasting Blood Sugar', 'Lipid Profile']
  };
}

export function organFor(name: string): OrganKey | null {
  const n = name.toLowerCase();
  // Heart & Lipids / Cardiovascular
  if (/cholesterol|\bldl\b|\bhdl\b|triglyceride|\bvldl\b|lipid|troponin|ck-mb|bnp|cardio|apolipoprotein|homocysteine/.test(n)) return 'heart';
  // Pancreas & Glycemic Regulation
  if (/glucose|hba1c|sugar|insulin|c-peptide|amylase|lipase|diabet|fbs|ppbs|glycated/.test(n)) return 'pancreas';
  // Kidneys & Renal Filtration
  if (/creatinine|egfr|\bbun\b|urea|uric\s*acid|proteinuria|microalbumin|renal|glomerular|cystatin|uacr/.test(n)) return 'kidneys';
  // Liver & Hepatic / Biliary
  if (/\balt\b|\bast\b|sgpt|sgot|bilirubin|alkaline\s*phosphatase|\balp\b|\bggt\b|albumin|globulin|hepatic|ferritin|serum\s*iron/.test(n)) return 'liver';
  // Lungs & Hematopoietic / Oxygenation
  if (/hemoglobin|\bhgb\b|\bhb\b|\brbc\b|pco2|po2|spo2|oxygen|hematocrit|\bhct\b|pulmonary|respirat|leukocyte|tlc|\bwbc\b|platelet|neutrophil|lymphocyte|monocyte|eosinophil|basophil|pcv|mcv|mch|mchc/.test(n)) return 'lungs';
  // Brain & Neurological / Electrolytes / Neuro-Endocrine
  if (/\bsodium\b|\bpotassium\b|chloride|calcium|b12|folate|neuro|cerebr|tsh|thyroid|\bt3\b|\bt4\b/.test(n)) return 'brain';
  // Stomach & Gastric
  if (/h\.?\s*pylori|gastrin|pepsinogen|occult|gastric|acid|reflux/.test(n)) return 'stomach';
  // Intestines & GI / Systemic Inflammation
  if (/calprotectin|stool|esr|\bcrp\b|hs-crp|colon|bowel|enteric|gut/.test(n)) return 'intestines';
  
  return null;
}

export function rangeStatus(row: { value: string; range: string }): RangeStatus {
  const cleanVal = String(row.value).replace(/,/g, '').trim();
  const num = parseFloat(cleanVal);
  if (isNaN(num)) return 'unknown';

  const ref = String(row.range || '').replace(/[–—]/g, '-').trim();
  if (!ref) return 'unknown';

  const pair = ref.match(/^(-?\d*\.?\d+)\s*(?:-|to)\s*(-?\d*\.?\d+)$/i);
  if (pair) {
    const lo = parseFloat(pair[1]);
    const hi = parseFloat(pair[2]);
    if (isNaN(lo) || isNaN(hi) || lo > hi) return 'unknown';
    if (num < lo) return 'low';
    if (num > hi) return 'high';
    return 'within';
  }

  const inequality = ref.match(/^(<=|>=|<|>|≤|≥)\s*(-?\d*\.?\d+)$/);
  if (inequality) {
    const bound = parseFloat(inequality[2]);
    if (isNaN(bound)) return 'unknown';
    const op = inequality[1];
    if (op === '<' || op === '<=' || op === '≤') {
      return num <= bound ? 'within' : 'high';
    }
    if (op === '>' || op === '>=' || op === '≥') {
      return num >= bound ? 'within' : 'low';
    }
  }

  return 'unknown';
}

export function getEducationalInsight(row: TestRow, lang: 'en' | 'hi' = 'en'): {
  status: RangeStatus;
  statusBadge: string;
  explanation: string;
  organImpact: string;
  doctorQuestions: DoctorQuestion;
} {
  const status = row.status;
  const organ = row.organ ? ORGANS[row.organ] : null;

  let statusBadge = lang === 'hi' ? 'सामान्य सीमा में' : 'Within Range';
  if (status === 'high') statusBadge = lang === 'hi' ? 'सामान्य से अधिक (High)' : 'Above Range';
  if (status === 'low') statusBadge = lang === 'hi' ? 'सामान्य से कम (Low)' : 'Below Range';
  if (status === 'unknown') statusBadge = lang === 'hi' ? 'अनिर्धारित सीमा' : 'Reference Unspecified';

  let explanation = '';
  if (lang === 'hi') {
    if (status === 'within') {
      explanation = `यह मान (${row.value} ${row.unit}) प्रयोगशाला की सामान्य सीमा (${row.range}) के भीतर है। यह अंग की स्वस्थ कार्यप्रणाली का सकारात्मक संकेत है।`;
    } else if (status === 'high') {
      explanation = `यह मान (${row.value} ${row.unit}) प्रयोगशाला की मानक सीमा (${row.range}) से अधिक दर्ज हुआ है। यह संबंधित अंग पर अस्थायी तनाव (जैसे खान-पान, दवाइयों का असर, या जीवनशैली) की ओर संकेत कर सकता है।`;
    } else if (status === 'low') {
      explanation = `यह मान (${row.value} ${row.unit}) सामान्य सीमा (${row.range}) से कम पाया गया है। पोषक तत्वों की कमी या जलयोजन के स्तर पर चिकित्सक से परामर्श लेना चाहिए।`;
    } else {
      explanation = `इस परिणाम के लिए संख्यात्मक संदर्भ सीमा की पुष्टि अपने डॉक्टर या पैथोलॉजी लैब से करें।`;
    }
  } else {
    if (status === 'within') {
      explanation = `This value (${row.value} ${row.unit}) is comfortably within the standard clinical target (${row.range}), reflecting healthy physiological function for this biological pathway.`;
    } else if (status === 'high') {
      explanation = `This value (${row.value} ${row.unit}) exceeds the standard reference threshold (${row.range}). Elevations can stem from acute factors (fasting duration, physical exertion, medications) or early metabolic shifts.`;
    } else if (status === 'low') {
      explanation = `This value (${row.value} ${row.unit}) is lower than the expected baseline (${row.range}). Sub-optimal concentrations warrant a clinical review of nutrient intake and metabolic reserve.`;
    } else {
      explanation = `This biomarker does not have a direct standard numerical interval. Verify clinical context with your testing laboratory.`;
    }
  }

  let organImpact = '';
  if (organ) {
    organImpact = lang === 'hi'
      ? `${organ.nameHi}: ${organ.descriptionHi}`
      : `${organ.nameEn}: ${organ.descriptionEn}`;
  } else {
    organImpact = lang === 'hi'
      ? 'यह जांच किसी एकल अंग तक सीमित नहीं है, बल्कि संपूर्ण शारीरिक स्वास्थ्य को दर्शाती है।'
      : 'This biomarker represents systemic cellular health rather than being confined to a single anatomical organ.';
  }

  const doctorQuestions: DoctorQuestion = {
    en: `Does my ${row.name} result (${row.value} ${row.unit}) indicate a need for dietary changes, medication adjustment, or a repeat panel in 3 months?`,
    hi: `क्या मेरे ${row.name} परिणाम (${row.value} ${row.unit}) के आधार पर खान-पान में बदलाव, दवा समीक्षा या 3 महीने बाद दोबारा जांच की जरूरत है?`
  };

  return {
    status,
    statusBadge,
    explanation,
    organImpact,
    doctorQuestions
  };
}
