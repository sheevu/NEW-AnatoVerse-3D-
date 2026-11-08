// Z-Anatomy & Terminologia Anatomica 2 (TA2) bilingual dataset
// Derived from TA2.csv and BodyParts3D ontology

export interface AnatomicalSubStructure {
  id: string;
  nameEn: string;
  nameHi: string;
  latin: string;
  ta2Id: string;
  descriptionEn: string;
  descriptionHi: string;
}

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
  radialExplosionVector: [number, number, number];
  subStructures: AnatomicalSubStructure[];
  physiologicalSync: {
    type: 'cardiac' | 'respiratory' | 'vascular' | 'peristaltic' | 'filtration' | 'cranial';
    bpmDefault?: number;
    amplitude: number;
    phaseOffset: number;
  };
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
    radialExplosionVector: [0.35, 0.22, 0.55],
    physiologicalSync: {
      type: 'cardiac',
      bpmDefault: 72,
      amplitude: 0.05,
      phaseOffset: 0.0,
    },
    subStructures: [
      { id: 'lv', nameEn: 'Left Ventricle', nameHi: 'बायाँ निलय', latin: 'Ventriculus sinister', ta2Id: 'TA2:4112', descriptionEn: 'Thick muscular chamber ejecting systemic cardiac output into the ascending aorta.', descriptionHi: 'मुख्य पंपिंग कक्ष जो पूरे शरीर में महाधमनी द्वारा रक्त भेजता है।' },
      { id: 'rv', nameEn: 'Right Ventricle', nameHi: 'दायाँ निलय', latin: 'Ventriculus dexter', ta2Id: 'TA2:4120', descriptionEn: 'Chamber pumping deoxygenated venous return through the pulmonary valve into the lungs.', descriptionHi: 'कक्ष जो अशुद्ध रक्त को शुद्ध करने के लिए फेफड़ों में भेजता है।' },
      { id: 'la', nameEn: 'Left Atrium', nameHi: 'बायाँ अलिंद', latin: 'Atrium sinistrum', ta2Id: 'TA2:4125', descriptionEn: 'Receives freshly oxygenated blood from the four pulmonary veins.', descriptionHi: 'फेफड़ों से ऑक्सीजन युक्त शुद्ध रक्त प्राप्त करने वाला कक्ष।' },
      { id: 'ra', nameEn: 'Right Atrium', nameHi: 'दायाँ अलिंद', latin: 'Atrium dextrum', ta2Id: 'TA2:4130', descriptionEn: 'Receives systemic venous return from the superior and inferior vena cava.', descriptionHi: 'पूरे शरीर से अशुद्ध रक्त एकत्रित करने वाला कक्ष।' },
      { id: 'aortic_arch', nameEn: 'Aortic Arch', nameHi: 'महाधमनी चाप', latin: 'Arcus aortae', ta2Id: 'TA2:4140', descriptionEn: 'Distributes high-pressure oxygenated blood into the brachiocephalic, carotid, and subclavian arteries.', descriptionHi: 'प्रमुख धमनी चाप जो सिर, गर्दन और बाहों को रक्त पहुंचाता है।' },
    ],
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
    radialExplosionVector: [0.0, 0.65, 0.15],
    physiologicalSync: {
      type: 'cranial',
      amplitude: 0.015,
      phaseOffset: 0.3,
    },
    subStructures: [
      { id: 'cerebrum', nameEn: 'Cerebrum (Cerebral Cortex)', nameHi: 'प्रमस्तिष्क (सेरेब्रम)', latin: 'Telencephalon', ta2Id: 'TA2:5280', descriptionEn: 'Higher-order cognitive processing, speech, conscious sensory perception, and voluntary movement.', descriptionHi: 'सोचने, समझने, भाषा और चेतना का मुख्य केंद्र।' },
      { id: 'cerebellum', nameEn: 'Cerebellum', nameHi: 'अनुमस्तिष्क (सेरिबेलम)', latin: 'Cerebellum', ta2Id: 'TA2:5340', descriptionEn: 'Coordination of fine voluntary motor actions, posture, and equilibrium.', descriptionHi: 'शारीरिक संतुलन, चाल और मांसपेशियों की गति का समन्वय।' },
      { id: 'brainstem', nameEn: 'Brainstem & Medulla', nameHi: 'मस्तिष्क स्तंभ (ब्रेनस्टेम)', latin: 'Truncus encephali', ta2Id: 'TA2:5380', descriptionEn: 'Autonomic life support regulating cardiac rate, respiratory rhythm, and vasomotor tone.', descriptionHi: 'श्वसन, हृदय धड़कन और रक्तचाप जैसी आवश्यक अनैच्छिक क्रियाओं का केंद्र।' },
      { id: 'thalamus', nameEn: 'Thalamus & Hypothalamus', nameHi: 'थैलेमस व हाइपोथैलेमस', latin: 'Diencephalon', ta2Id: 'TA2:5420', descriptionEn: 'Relay station for sensory pathways, circadian sleep-wake cycles, and neuroendocrine regulation.', descriptionHi: 'संवेदी संकेतों का रिले स्टेशन और शारीरिक तापमान व भूख-प्यास का नियंत्रक।' },
    ],
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
    radialExplosionVector: [-0.48, 0.18, 0.35],
    physiologicalSync: {
      type: 'respiratory',
      bpmDefault: 16,
      amplitude: 0.045,
      phaseOffset: 0.5,
    },
    subStructures: [
      { id: 'lung_right', nameEn: 'Right Lung (3 Lobes)', nameHi: 'दायाँ फेफड़ा (3 खंड)', latin: 'Pulmo dexter', ta2Id: 'TA2:3430', descriptionEn: 'Comprises superior, middle, and inferior lobes with oblique and horizontal fissures.', descriptionHi: 'तीन खंडों (लोब्स) से बना बड़ा फेफड़ा जो प्रचुर ऑक्सीजन ग्रहण करता है।' },
      { id: 'lung_left', nameEn: 'Left Lung (2 Lobes)', nameHi: 'बायाँ फेफड़ा (2 खंड)', latin: 'Pulmo sinister', ta2Id: 'TA2:3445', descriptionEn: 'Comprises superior and inferior lobes shaped with the cardiac notch accommodating the heart.', descriptionHi: 'हृदय की स्थिति के लिए खांच युक्त दो खंडों वाला फेफड़ा।' },
      { id: 'trachea_bronchi', nameEn: 'Trachea & Primary Bronchi', nameHi: 'श्वासनली व ब्रोन्काई', latin: 'Trachea et arbor bronchialis', ta2Id: 'TA2:3460', descriptionEn: 'Cartilaginous airway branching into secondary and tertiary lobar bronchi.', descriptionHi: 'हवा को फेफड़ों के भीतरी हिस्सों तक ले जाने वाला मुख्य वायुमार्ग।' },
      { id: 'alveolar_capillaries', nameEn: 'Alveoli & Capillary Bed', nameHi: 'वायु कोष्ठिकाएं व केशिकाएं', latin: 'Alveoli pulmonis', ta2Id: 'TA2:3475', descriptionEn: 'Thin-walled terminal sacs where passive diffusion of O2 and CO2 occurs.', descriptionHi: 'सूक्ष्म वायु थैलियां जहां रक्त और हवा के बीच गैसों का आदान-प्रदान होता है।' },
    ],
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
    radialExplosionVector: [-0.60, -0.08, 0.45],
    physiologicalSync: {
      type: 'filtration',
      amplitude: 0.015,
      phaseOffset: 0.1,
    },
    subStructures: [
      { id: 'right_lobe', nameEn: 'Right Hepatic Lobe', nameHi: 'दायाँ यकृत खंड', latin: 'Lobus dexter hepatis', ta2Id: 'TA2:2985', descriptionEn: 'Dominant hepatic parenchyma performing the bulk of filtration and glycogen synthesis.', descriptionHi: 'यकृत का सबसे बड़ा खंड जो रक्त निस्पंदन और ग्लूकोज भंडारण करता है।' },
      { id: 'left_lobe', nameEn: 'Left Hepatic Lobe', nameHi: 'बायाँ यकृत खंड', latin: 'Lobus sinister hepatis', ta2Id: 'TA2:2992', descriptionEn: 'Flattened visceral lobe extending over the anterior stomach wall.', descriptionHi: 'पेट के सामने तक फैला हुआ यकृत का बायाँ हिस्सा।' },
      { id: 'portal_triad', nameEn: 'Hepatic Portal Vein & Biliary Ducts', nameHi: 'पोर्टल शिरा व पित्त नलिकाएं', latin: 'Vena portae hepatis', ta2Id: 'TA2:3005', descriptionEn: 'Transports nutrient-rich venous blood from the intestines into the liver sinusoid network.', descriptionHi: 'आंतों से अवशोषित पोषक तत्वों से भरपूर रक्त को यकृत में लाने वाली शिरा।' },
      { id: 'gallbladder', nameEn: 'Gallbladder & Cystic Duct', nameHi: 'पित्ताशय (गॉलब्लेडर)', latin: 'Vesica biliaris', ta2Id: 'TA2:3015', descriptionEn: 'Stores and concentrates alkaline bile for emulsification of dietary lipids.', descriptionHi: 'वसा को पचाने वाले पित्त रस का भंडारण और गाढ़ा करने वाला अंग।' },
    ],
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
    radialExplosionVector: [0.0, -0.15, -0.55],
    physiologicalSync: {
      type: 'filtration',
      amplitude: 0.015,
      phaseOffset: 0.7,
    },
    subStructures: [
      { id: 'renal_cortex', nameEn: 'Renal Cortex & Glomeruli', nameHi: 'वृक्क कॉर्टेक्स व ग्लोमेरुली', latin: 'Cortex renalis', ta2Id: 'TA2:3570', descriptionEn: 'Outer granular zone containing over 1 million filtering nephron units.', descriptionHi: 'गुर्दे की बाहरी परत जिसमें लाखों सूक्ष्म निस्यंदन इकाइयां (नेफ्रॉन) होती हैं।' },
      { id: 'renal_medulla', nameEn: 'Renal Medulla & Pyramids', nameHi: 'वृक्क मज्जा व पिरामिड', latin: 'Medulla renalis', ta2Id: 'TA2:3582', descriptionEn: 'Internal striated pyramids concentrating urine via the Henle loops.', descriptionHi: 'गुर्दे की भीतरी परत जो मूत्र को सांद्रित कर एकत्र करती है।' },
      { id: 'renal_pelvis', nameEn: 'Renal Pelvis & Calyces', nameHi: 'वृक्क पेल्विस व कैलिक्स', latin: 'Pelvis renalis', ta2Id: 'TA2:3595', descriptionEn: 'Funnel-shaped collection basin channelling urine into the descending ureter.', descriptionHi: 'मूत्र को इकट्ठा कर मूत्रवाहिनी में भेजने वाला कीप जैसा भाग।' },
      { id: 'adrenal_glands', nameEn: 'Suprarenal Adrenal Glands', nameHi: 'अधिवृक्क ग्रंथियां (एड्रेनल)', latin: 'Glandulae suprarenales', ta2Id: 'TA2:3801', descriptionEn: 'Crescent caps secreting adrenaline, aldosterone, and cortisol stress hormones.', descriptionHi: 'गुर्दे के ऊपर स्थित ग्रंथियां जो तनाव और रक्तचाप नियंत्रित करने वाले हार्मोन बनाती हैं।' },
    ],
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
    radialExplosionVector: [0.0, -0.10, 0.65],
    physiologicalSync: {
      type: 'peristaltic',
      amplitude: 0.02,
      phaseOffset: 0.4,
    },
    subStructures: [
      { id: 'pancreatic_head', nameEn: 'Head of Pancreas', nameHi: 'अग्न्याशय का शीर्ष', latin: 'Caput pancreatis', ta2Id: 'TA2:3038', descriptionEn: 'Tucked within the C-loop of the duodenum, draining pancreatic enzymes via the main duct.', descriptionHi: 'छोटी आंत के मोड़ में स्थित हिस्सा जो पाचक रस स्रावित करता है।' },
      { id: 'pancreatic_body_tail', nameEn: 'Body & Tail of Pancreas', nameHi: 'अग्न्याशय का मध्य व पुच्छ भाग', latin: 'Corpus et cauda pancreatis', ta2Id: 'TA2:3046', descriptionEn: 'Elongated horizontal body extending toward the spleen, rich in endocrine islet clusters.', descriptionHi: 'तिल्ली (प्लीहा) तक फैला हिस्सा जो इंसुलिन बनाने वाली कोशिकाओं से समृद्ध है।' },
      { id: 'islets_langerhans', nameEn: 'Islets of Langerhans', nameHi: 'लैंगरहैंस के द्वीप समूह', latin: 'Insulae pancreaticae', ta2Id: 'TA2:3055', descriptionEn: 'Microscopic endocrine clusters of beta and alpha cells regulating blood glucose.', descriptionHi: 'इंसुलिन और ग्लूकागोन हार्मोन स्रावित कर रक्त शर्करा नियंत्रित करने वाली कोशिकाएं।' },
      { id: 'pancreatic_duct', nameEn: 'Main Pancreatic Duct (Wirsung)', nameHi: 'मुख्य अग्न्याशय वाहिनी', latin: 'Ductus pancreaticus', ta2Id: 'TA2:3060', descriptionEn: 'Carries digestive enzymes (amylase, lipase, trypsinogen) into the ampulla of Vater.', descriptionHi: 'एंजाइमों को भोजन पचाने के लिए आंत में पहुंचाने वाली नलिका।' },
    ],
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
    radialExplosionVector: [0.60, -0.05, 0.45],
    physiologicalSync: {
      type: 'peristaltic',
      amplitude: 0.035,
      phaseOffset: 0.2,
    },
    subStructures: [
      { id: 'cardia_fundus', nameEn: 'Gastric Fundus & Cardia', nameHi: 'फंडस व कार्डिया', latin: 'Fundus gastricus', ta2Id: 'TA2:2912', descriptionEn: 'Superior dome catching swallowed gases and storing unmixed meals.', descriptionHi: 'पेट का ऊपरी गुंबदनुमा हिस्सा जो ग्रासनली से भोजन ग्रहण करता है।' },
      { id: 'gastric_body', nameEn: 'Body of Stomach (Corpus)', nameHi: 'आमाशय का मध्य भाग', latin: 'Corpus gastricum', ta2Id: 'TA2:2918', descriptionEn: 'Largest section equipped with rugae folds and parietal cells producing stomach acid (HCl).', descriptionHi: 'मुख्य मांसपेशीय हिस्सा जहां हाइड्रोक्लोरिक एसिड और पेप्सिन भोजन को पचाते हैं।' },
      { id: 'pyloric_antrum', nameEn: 'Pyloric Antrum & Sphincter', nameHi: 'पाइलोरिक एंट्रम व स्फिंक्टर', latin: 'Antrum pyloricum', ta2Id: 'TA2:2925', descriptionEn: 'Muscular valve controlling metered passage of liquefied chyme into the duodenum.', descriptionHi: 'मांसपेशीय वॉल्व जो पचे हुए तरल भोजन को धीरे-धीरे छोटी आंत में भेजता है।' },
    ],
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
    radialExplosionVector: [0.0, -0.55, 0.40],
    physiologicalSync: {
      type: 'peristaltic',
      amplitude: 0.03,
      phaseOffset: 0.6,
    },
    subStructures: [
      { id: 'small_intestine', nameEn: 'Small Intestine (Duodenum, Jejunum, Ileum)', nameHi: 'छोटी आंत', latin: 'Intestinum tenue', ta2Id: 'TA2:2938', descriptionEn: '6-meter convoluted tube with microscopic villi absorbing amino acids, sugars, and vitamins.', descriptionHi: 'लगभग 20 फीट लंबी आंत जहां भोजन के सभी मुख्य पोषक तत्व रक्त में सोखे जाते हैं।' },
      { id: 'large_colon', nameEn: 'Colon & Cecum (Ascending, Transverse, Descending)', nameHi: 'बड़ी आंत (कोलन)', latin: 'Colon', ta2Id: 'TA2:2950', descriptionEn: 'Houses trillions of beneficial gut flora, absorbing electrolytes and consolidating stool.', descriptionHi: 'पानी और लवणों को अवशोषित करने और अपशिष्ट को निकालने वाली मुख्य आंत।' },
      { id: 'rectum_appendix', nameEn: 'Appendix & Rectum', nameHi: 'अपेंडिक्स व मलाशय', latin: 'Appendix vermiformis et rectum', ta2Id: 'TA2:2965', descriptionEn: 'Immune lymphoid reservoir (appendix) and terminal storage conduit before excretion.', descriptionHi: 'रोग प्रतिरोधक ऊतक (अपेंडिक्स) और मल निष्कासन से पूर्व का संग्रहण कक्ष।' },
    ],
    ayurvedaAssociation: {
      dosha: 'Vata',
      dhatu: 'Purisha',
      subdosha: 'Samana & Apana Vayu',
    },
  },
};
