import { MedicalReport } from '../types';
import { organFor, rangeStatus } from './medicalRules';

export const SAMPLE_REPORTS: Omit<MedicalReport, 'id' | 'profileId' | 'createdAt'>[] = [
  {
    title: 'Comprehensive Metabolic & Lipid Panel',
    date: '2026-09-15',
    labName: 'Dr. Lal PathLabs / SRL Diagnostics, New Delhi',
    type: 'lab',
    verified: true,
    doctorNotes: 'Fasting 12 hours. Advised dietary reduction in refined carbohydrates and re-testing in 90 days.',
    prescribedMedicines: ['Atorvastatin 10mg', 'Metformin 500mg'],
    rows: [
      {
        id: 'r1',
        name: 'Fasting Blood Glucose',
        value: '118',
        numericValue: 118,
        unit: 'mg/dL',
        range: '70 - 99',
        status: 'high',
        organ: organFor('Fasting Blood Glucose'),
        clinicalNote: 'Impaired fasting glucose range. Correlate with HbA1c.'
      },
      {
        id: 'r2',
        name: 'HbA1c (Glycated Hemoglobin)',
        value: '6.4',
        numericValue: 6.4,
        unit: '%',
        range: '< 5.7',
        status: 'high',
        organ: organFor('HbA1c'),
        clinicalNote: 'Prediabetes tier (5.7% to 6.4%). Lifestyle counseling advised.'
      },
      {
        id: 'r3',
        name: 'Total Cholesterol',
        value: '228',
        numericValue: 228,
        unit: 'mg/dL',
        range: '< 200',
        status: 'high',
        organ: organFor('Total Cholesterol'),
        clinicalNote: 'Borderline elevated. Discuss dietary modifications.'
      },
      {
        id: 'r4',
        name: 'LDL Cholesterol',
        value: '142',
        numericValue: 142,
        unit: 'mg/dL',
        range: '< 100',
        status: 'high',
        organ: organFor('LDL Cholesterol'),
        clinicalNote: 'Primary atherogenic marker. Targets vary with cardiovascular profile.'
      },
      {
        id: 'r5',
        name: 'HDL Cholesterol',
        value: '44',
        numericValue: 44,
        unit: 'mg/dL',
        range: '> 40',
        status: 'within',
        organ: organFor('HDL Cholesterol'),
        clinicalNote: 'Protective lipid carrier within standard acceptable limits.'
      },
      {
        id: 'r6',
        name: 'Serum Triglycerides',
        value: '185',
        numericValue: 185,
        unit: 'mg/dL',
        range: '< 150',
        status: 'high',
        organ: organFor('Serum Triglycerides'),
        clinicalNote: 'Moderately elevated. Responsive to sugar reduction and aerobic exercise.'
      },
      {
        id: 'r7',
        name: 'Serum Creatinine',
        value: '0.95',
        numericValue: 0.95,
        unit: 'mg/dL',
        range: '0.7 - 1.3',
        status: 'within',
        organ: organFor('Serum Creatinine'),
        clinicalNote: 'Normal glomerular filtration baseline.'
      },
      {
        id: 'r8',
        name: 'SGPT / ALT',
        value: '36',
        numericValue: 36,
        unit: 'U/L',
        range: '7 - 56',
        status: 'within',
        organ: organFor('SGPT / ALT'),
        clinicalNote: 'Hepatic transaminase activity within normal bounds.'
      }
    ],
    aiSummaryEn: 'This routine health screening shows mildly elevated fasting glucose (118 mg/dL) and borderline HbA1c (6.4%), which fall into the pre-diabetes bracket. Total cholesterol and LDL are also mildly raised, while renal filtration (creatinine) and liver transaminases are healthy. Discuss nutrition, physical activity, and repeat testing with your doctor.',
    aiSummaryHi: 'इस नियमित स्वास्थ्य जांच में फास्टिंग ग्लूकोज (118 mg/dL) और एचबीए1सी (6.4%) थोड़े बढ़े हुए पाए गए हैं, जो प्रीडायबिटीज श्रेणी में आते हैं। कोलेस्ट्रॉल और एलडीएल भी हल्के बढ़े हुए हैं, जबकि गुर्दे और लिवर के पैरामीटर पूरी तरह सामान्य हैं। डॉक्टर से आहार और जीवनशैली में सुधार पर चर्चा करें।'
  },
  {
    title: 'Liver Function & Abdominal Enzymes',
    date: '2026-08-20',
    labName: 'Apollo Diagnostics, Mumbai',
    type: 'lab',
    verified: true,
    doctorNotes: 'Evaluated post mild abdominal bloating. Advised hydration and avoiding paracetamol overuse.',
    prescribedMedicines: ['UDCA 300mg', 'Pantoprazole 40mg'],
    rows: [
      {
        id: 'l1',
        name: 'SGPT / ALT',
        value: '68',
        numericValue: 68,
        unit: 'U/L',
        range: '7 - 56',
        status: 'high',
        organ: 'liver',
        clinicalNote: 'Mild elevation. Often associated with fatty liver changes or medication impact.'
      },
      {
        id: 'l2',
        name: 'SGOT / AST',
        value: '52',
        numericValue: 52,
        unit: 'U/L',
        range: '10 - 40',
        status: 'high',
        organ: 'liver',
        clinicalNote: 'Elevated. Monitor AST/ALT ratio in conjunction with clinical symptoms.'
      },
      {
        id: 'l3',
        name: 'Total Bilirubin',
        value: '1.0',
        numericValue: 1.0,
        unit: 'mg/dL',
        range: '0.2 - 1.2',
        status: 'within',
        organ: 'liver',
        clinicalNote: 'Normal biliary clearance without evidence of jaundice.'
      },
      {
        id: 'l4',
        name: 'Alkaline Phosphatase (ALP)',
        value: '95',
        numericValue: 95,
        unit: 'U/L',
        range: '44 - 147',
        status: 'within',
        organ: 'liver',
        clinicalNote: 'Normal biliary ductal and bone metabolism.'
      },
      {
        id: 'l5',
        name: 'Serum Amylase',
        value: '65',
        numericValue: 65,
        unit: 'U/L',
        range: '28 - 100',
        status: 'within',
        organ: 'pancreas',
        clinicalNote: 'Pancreatic digestive enzyme secretion is normal.'
      }
    ],
    aiSummaryEn: 'Liver transaminases (ALT at 68 U/L and AST at 52 U/L) are mildly above reference thresholds, while bilirubin and alkaline phosphatase are completely normal. Mild transaminase bumps are common with fatty liver changes, weight fluctuations, or certain medications. Review with your physician for appropriate lifestyle guidance.',
    aiSummaryHi: 'लिवर एंजाइम (ALT 68 U/L और AST 52 U/L) सामान्य सीमा से थोड़े अधिक हैं, जबकि बिलीरुबिन पूरी तरह सामान्य है। यह फैटी लिवर या कुछ दवाओं के प्रभाव से हो सकता है। खान-पान में वसा कम करने और डॉक्टर की सलाह अनुसार आगे की जांच कराएं।'
  },
  {
    title: 'Complete Blood Count (CBC) & Hemogram',
    date: '2026-07-10',
    labName: 'Max Healthcare Pathology, Gurugram',
    type: 'lab',
    verified: true,
    doctorNotes: 'Screening for fatigue. Iron-rich diet recommended.',
    prescribedMedicines: ['Autrin Iron Capsule', 'Vitamin C 500mg'],
    rows: [
      {
        id: 'c1',
        name: 'Hemoglobin',
        value: '10.8',
        numericValue: 10.8,
        unit: 'g/dL',
        range: '12.0 - 15.5',
        status: 'low',
        organ: 'lungs',
        clinicalNote: 'Mild microcytic anemia picture. Check ferritin and iron stores.'
      },
      {
        id: 'c2',
        name: 'Total Leukocyte Count (WBC)',
        value: '6800',
        numericValue: 6800,
        unit: '/cumm',
        range: '4000 - 11000',
        status: 'within',
        organ: 'intestines',
        clinicalNote: 'Normal immune cell count, no signs of acute infection.'
      },
      {
        id: 'c3',
        name: 'Platelet Count',
        value: '240000',
        numericValue: 240000,
        unit: '/cumm',
        range: '150000 - 450000',
        status: 'within',
        organ: 'intestines',
        clinicalNote: 'Healthy clotting cell baseline.'
      },
      {
        id: 'c4',
        name: 'ESR (Erythrocyte Sedimentation Rate)',
        value: '18',
        numericValue: 18,
        unit: 'mm/hr',
        range: '< 20',
        status: 'within',
        organ: 'intestines',
        clinicalNote: 'Systemic inflammatory marker within expected limits.'
      }
    ],
    aiSummaryEn: 'The Complete Blood Count reveals a mildly reduced Hemoglobin level of 10.8 g/dL (normal range 12.0 - 15.5 g/dL), indicating mild anemia which is common in Indian populations and often responds well to iron and dietary supplementation. Platelets and White Blood Cells are healthy.',
    aiSummaryHi: 'सीबीसी रिपोर्ट में हीमोग्लोबिन 10.8 g/dL पाया गया है, जो सामान्य सीमा (12.0 - 15.5) से कम है। यह हल्के एनीमिया की ओर इशारा करता है, जो अक्सर आयरन और संतुलित आहार से ठीक हो जाता है। प्लेटलेट्स और श्वेत रक्त कोशिकाएं बिल्कुल सामान्य हैं।'
  }
];
