// Z-Anatomy & Terminologia Anatomica 2 (TA2) bilingual dataset
// Derived from TA2.csv and BodyParts3D ontology

export interface AnatomicalStructure {
  id: string;
  ta2Id: string;
  english: string;
  latin: string;
  hindi: string;
  system: 'circulatory' | 'nervous' | 'respiratory' | 'digestive' | 'urinary' | 'endocrine' | 'skeletal' | 'muscular';
  descriptionEn: string;
  descriptionHi: string;
  associatedBiomarkers: string[];
  ayurvedaAssociation: {
    dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Kapha-Pitta' | 'Tridoshic';
    dhatu: string;
    subdosha: string;
  };
}

export const ANATOMICAL_STRUCTURES: Record<string, AnatomicalStructure> = {
  heart: {
    id: 'heart',
    ta2Id: 'TA2:4105',
    english: 'Heart',
    latin: 'Cor',
    hindi: 'हृदय (दिल)',
    system: 'circulatory',
    descriptionEn: 'Muscular organ that pumps oxygenated blood throughout the systemic circulation.',
    descriptionHi: 'मांसपेशीय अंग जो पूरे शरीर में रक्त और ऑक्सीजन का संचार करता है।',
    associatedBiomarkers: ['Cholesterol', 'Triglycerides', 'HDL', 'LDL', 'Troponin', 'Blood Pressure'],
    ayurvedaAssociation: {
      dosha: 'Pitta-Kapha',
      dhatu: 'Rasa / Rakta',
      subdosha: 'Sadhaka Pitta & Avalambaka Kapha',
    },
  },
  brain: {
    id: 'brain',
    ta2Id: 'TA2:5270',
    english: 'Brain',
    latin: 'Encephalon',
    hindi: 'मस्तिष्क (दिमाग)',
    system: 'nervous',
    descriptionEn: 'Central nervous system command center governing cognitive, motor, and autonomic homeostasis.',
    descriptionHi: 'केंद्रीय तंत्रिका तंत्र जो विचार, स्मृति, और शारीरिक क्रियाओं को नियंत्रित करता है।',
    associatedBiomarkers: ['Vitamin B12', 'Sodium', 'Potassium', 'Calcium', 'TSH'],
    ayurvedaAssociation: {
      dosha: 'Vata',
      dhatu: 'Majja',
      subdosha: 'Prana Vayu & Tarpaka Kapha',
    },
  },
  lungs: {
    id: 'lungs',
    ta2Id: 'TA2:3421',
    english: 'Lungs',
    latin: 'Pulmones',
    hindi: 'फेफड़े (फुफ्फुस)',
    system: 'respiratory',
    descriptionEn: 'Primary respiratory organs facilitating gas exchange between atmospheric air and the bloodstream.',
    descriptionHi: 'श्वसन अंग जो हवा से ऑक्सीजन लेकर रक्त में पहुंचाते हैं और कार्बन डाइऑक्साइड बाहर निकालते हैं।',
    associatedBiomarkers: ['Hemoglobin', 'RBC', 'Oxygen Saturation (SpO2)', 'ESR'],
    ayurvedaAssociation: {
      dosha: 'Kapha',
      dhatu: 'Rasa',
      subdosha: 'Avalambaka Kapha & Udana Vayu',
    },
  },
  liver: {
    id: 'liver',
    ta2Id: 'TA2:2978',
    english: 'Liver',
    latin: 'Hepar',
    hindi: 'यकृत (लिवर)',
    system: 'digestive',
    descriptionEn: 'Largest metabolic gland, processing nutrients, synthesizing proteins, and detoxifying biochemical waste.',
    descriptionHi: 'सबसे बड़ी ग्रंथि जो चयापचय (मेटाबॉलिज्म), विषहरण (डिटॉक्स) और पित्त उत्पादन करती है।',
    associatedBiomarkers: ['SGPT (ALT)', 'SGOT (AST)', 'Bilirubin', 'Alkaline Phosphatase', 'Albumin'],
    ayurvedaAssociation: {
      dosha: 'Pitta',
      dhatu: 'Rakta',
      subdosha: 'Ranjaka Pitta',
    },
  },
  kidneys: {
    id: 'kidneys',
    ta2Id: 'TA2:3561',
    english: 'Kidneys',
    latin: 'Ren',
    hindi: 'गुर्दे (किडनी)',
    system: 'urinary',
    descriptionEn: 'Paired retroperitoneal organs filtering blood plasma, regulating electrolytes, fluid balance, and blood pressure.',
    descriptionHi: 'रक्त से अपशिष्ट और अतिरिक्त तरल को छानकर मूत्र के रूप में बाहर निकालने वाले अंग।',
    associatedBiomarkers: ['Creatinine', 'Blood Urea Nitrogen (BUN)', 'Uric Acid', 'eGFR', 'Microalbumin'],
    ayurvedaAssociation: {
      dosha: 'Vata',
      dhatu: 'Meda / Rakta',
      subdosha: 'Apana Vayu',
    },
  },
  pancreas: {
    id: 'pancreas',
    ta2Id: 'TA2:3032',
    english: 'Pancreas',
    latin: 'Pancreas',
    hindi: 'अग्न्याशय (पैंक्रियाज)',
    system: 'endocrine',
    descriptionEn: 'Dual endocrine and exocrine organ producing insulin, glucagon, and digestive enzymes.',
    descriptionHi: 'इंसुलिन और पाचक रस बनाने वाला अंग, जो रक्त शर्करा (शुगर) को नियंत्रित करता है।',
    associatedBiomarkers: ['Fasting Blood Glucose', 'HbA1c', 'Post Prandial Glucose', 'Serum Amylase', 'Lipase'],
    ayurvedaAssociation: {
      dosha: 'Pitta',
      dhatu: 'Meda',
      subdosha: 'Pachaka Pitta',
    },
  },
  stomach: {
    id: 'stomach',
    ta2Id: 'TA2:2905',
    english: 'Stomach',
    latin: 'Gaster',
    hindi: 'आमाशय (पेट)',
    system: 'digestive',
    descriptionEn: 'J-shaped muscular reservoir secreting gastric acid and pepsin for enzymatic food breakdown.',
    descriptionHi: 'पाचन तंत्र का मुख्य हिस्सा जो पाचक अम्ल और एंजाइम से भोजन को तोड़ता है।',
    associatedBiomarkers: ['H. Pylori', 'Gastric Acidity', 'Hemoglobin (iron absorption)'],
    ayurvedaAssociation: {
      dosha: 'Kapha-Pitta',
      dhatu: 'Rasa',
      subdosha: 'Kledaka Kapha & Pachaka Pitta',
    },
  },
  intestines: {
    id: 'intestines',
    ta2Id: 'TA2:2930',
    english: 'Intestines',
    latin: 'Intestinum',
    hindi: 'आंतें (आंत्र)',
    system: 'digestive',
    descriptionEn: 'Small and large bowel responsible for nutrient absorption, gut microbiome ecology, and water recovery.',
    descriptionHi: 'पोषक तत्वों और पानी को अवशोषित करने और अपशिष्ट को निकालने वाली प्रणाली।',
    associatedBiomarkers: ['Stool Occult Blood', 'ESR', 'C-Reactive Protein (CRP)', 'Platelets'],
    ayurvedaAssociation: {
      dosha: 'Vata',
      dhatu: 'Purisha',
      subdosha: 'Samana & Apana Vayu',
    },
  },
};
