import {
  MedicineBiomarkerCorrelation,
  PrescriptionDetails,
  TestRow,
} from '../types';
import { organFor } from './medicalRules';

export interface ReportInsightResponse {
  summaryEn: string;
  summaryHi: string;
  combinedSynthesisEn: string;
  combinedSynthesisHi: string;
  keyConcernsEn: string[];
  keyConcernsHi: string[];
  actionableRecommendationsEn: string[];
  actionableRecommendationsHi: string[];
  suggestedQuestionsEn: string[];
  suggestedQuestionsHi: string[];
  medicineCorrelations: MedicineBiomarkerCorrelation[];
}

export async function generateReportInsights(
  rows: TestRow[],
  prescriptionDetails?: PrescriptionDetails,
  doctorNotes?: string
): Promise<ReportInsightResponse> {
  // Call server if configured
  try {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows, prescriptionDetails, doctorNotes }),
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.summaryEn) {
        return {
          summaryEn: data.summaryEn,
          summaryHi: data.summaryHi || data.summaryEn,
          combinedSynthesisEn: data.combinedSynthesisEn || data.summaryEn,
          combinedSynthesisHi: data.combinedSynthesisHi || data.summaryHi || data.summaryEn,
          keyConcernsEn: data.keyConcernsEn || [],
          keyConcernsHi: data.keyConcernsHi || [],
          actionableRecommendationsEn: data.actionableRecommendationsEn || [],
          actionableRecommendationsHi: data.actionableRecommendationsHi || [],
          suggestedQuestionsEn: data.suggestedQuestionsEn || [],
          suggestedQuestionsHi: data.suggestedQuestionsHi || [],
          medicineCorrelations: (data.medicineCorrelations || []).map((c: any) => ({
            ...c,
            organ: organFor(c.linkedBiomarker || c.medicine || '') || 'heart',
          })),
        };
      }
    }
  } catch {
    // Proceed to deterministic local clinical synthesis engine
  }

  return buildLocalCombinedInsights(rows, prescriptionDetails, doctorNotes);
}

export function buildLocalCombinedInsights(
  rows: TestRow[],
  prescriptionDetails?: PrescriptionDetails,
  doctorNotes?: string
): ReportInsightResponse {
  const highItems = rows.filter((r) => r.status === 'high');
  const lowItems = rows.filter((r) => r.status === 'low');
  const normalItems = rows.filter((r) => r.status === 'within');

  // 1. Lab Report Summary (EN & HI)
  let summaryEn = `This diagnostic report evaluates ${rows.length} verified laboratory biomarkers. `;
  if (highItems.length === 0 && lowItems.length === 0) {
    summaryEn += `All tested parameters fall within standard reference thresholds. Continue your current preventive care routine and scheduled clinical check-ups.`;
  } else {
    summaryEn += `Of these, ${normalItems.length} are within normal range. `;
    if (highItems.length > 0) {
      summaryEn += `${highItems.map((h) => `${h.name} (${h.value} ${h.unit})`).join(', ')} are elevated above reference thresholds. `;
    }
    if (lowItems.length > 0) {
      summaryEn += `${lowItems.map((l) => `${l.name} (${l.value} ${l.unit})`).join(', ')} are below the optimal threshold. `;
    }
  }

  let summaryHi = `इस मेडिकल रिपोर्ट में कुल ${rows.length} लैब बायोमार्करों का विश्लेषण किया गया है। `;
  if (highItems.length === 0 && lowItems.length === 0) {
    summaryHi += `सभी जांच परिणाम सामान्य संदर्भ सीमा के भीतर हैं। अपनी स्वस्थ दिनचर्या बनाए रखें।`;
  } else {
    summaryHi += `इनमें से ${normalItems.length} परिणाम सामान्य सीमा में हैं। `;
    if (highItems.length > 0) {
      summaryHi += `${highItems.map((h) => `${h.name} (${h.value} ${h.unit})`).join(', ')} सामान्य सीमा से अधिक पाए गए हैं। `;
    }
    if (lowItems.length > 0) {
      summaryHi += `${lowItems.map((l) => `${l.name} (${l.value} ${l.unit})`).join(', ')} सामान्य सीमा से कम दर्ज किए गए हैं। `;
    }
  }

  // 2. Medicine <-> Biomarker Cross-Correlations
  const medicineCorrelations: MedicineBiomarkerCorrelation[] = [];
  const meds = prescriptionDetails?.medications || [];

  for (const med of meds) {
    const lowerMed = med.name.toLowerCase();
    let linkedBiomarker = 'Systemic Homeostasis';
    let rationaleEn =
      med.purposeEn ||
      `Prescribed (${med.dosage}, ${med.frequency}) to manage underlying clinical findings.`;
    let rationaleHi =
      med.purposeHi ||
      `चिकित्सकीय निष्कर्षों के नियंत्रण हेतु (${med.dosage}, ${med.frequency}) निर्धारित।`;
    let precautionEn = `Take ${med.timing.toLowerCase()} for ${med.duration}. Do not skip doses.`;
    let precautionHi = `इसे ${med.timing} (${med.duration} तक) नियमित रूप से लें।`;
    let organ = med.targetOrgan || organFor(med.name) || 'heart';

    if (/metformin|glycomet|glimepiride|sitagliptin|dapagliflozin/i.test(lowerMed)) {
      const glucRow = rows.find((r) => /glucose|sugar|hba1c/i.test(r.name));
      linkedBiomarker = glucRow
        ? `${glucRow.name}: ${glucRow.value} ${glucRow.unit} (Ref: ${glucRow.range})`
        : 'Fasting Blood Glucose & HbA1c';
      rationaleEn = `Directly targets elevated glycemic markers (${linkedBiomarker}) by suppressing hepatic glucose output and enhancing peripheral insulin sensitivity.`;
      rationaleHi = `यह दवा बढ़े हुए ब्लड शुगर और HbA1c (${linkedBiomarker}) को नियंत्रित करने के लिए इंसुलिन संवेदनशीलता को बढ़ाती है।`;
      precautionEn = `Take strictly ${med.timing} to minimize gastrointestinal discomfort. Monitor for any dizziness or hypoglycemia.`;
      precautionHi = `पेट की असुविधा से बचने के लिए भोजन के तुरंत बाद लें।`;
      organ = 'pancreas';
    } else if (/atorva|rosuva|statin|fenofibrate/i.test(lowerMed)) {
      const cholRow = rows.find((r) => /cholesterol|ldl|triglyceride/i.test(r.name));
      linkedBiomarker = cholRow
        ? `${cholRow.name}: ${cholRow.value} ${cholRow.unit} (Ref: ${cholRow.range})`
        : 'LDL & Total Cholesterol';
      rationaleEn = `Addresses dyslipidemia (${linkedBiomarker}) by inhibiting hepatic HMG-CoA reductase and reducing atherosclerotic arterial plaque risk.`;
      rationaleHi = `बढ़े हुए कोलेस्ट्रॉल (${linkedBiomarker}) को कम कर हृदय की धमनियों में प्लाक जमने के जोखिम को घटाती है।`;
      precautionEn = `Best taken at bedtime when endogenous cholesterol synthesis peaks. Report any unexplained muscle soreness to your physician.`;
      precautionHi = `रात में सोते समय लेना सर्वोत्तम है। मांसपेशियों में असामान्य दर्द होने पर डॉक्टर को बताएं।`;
      organ = 'heart';
    } else if (/telma|telmisartan|amlodipine|stamlo|losartan|ramipril|metoprolol/i.test(lowerMed)) {
      const bpStr =
        prescriptionDetails?.vitals?.systolicBP && prescriptionDetails?.vitals?.diastolicBP
          ? `Recorded BP: ${prescriptionDetails.vitals.systolicBP}/${prescriptionDetails.vitals.diastolicBP} mmHg`
          : 'Systemic Arterial Blood Pressure & Renal Perfusion';
      linkedBiomarker = bpStr;
      rationaleEn = `Regulates vascular tone (${bpStr}) and lowers intraglomerular pressure, protecting both myocardium and renal nephrons.`;
      rationaleHi = `उच्च रक्तचाप (${bpStr}) को नियंत्रित कर हृदय और गुर्दों (किडनी) की सूक्ष्म रक्त वाहिकाओं की सुरक्षा करती है।`;
      precautionEn = `Take at the same time each morning. Maintain low-salt (< 4g/day) intake and monitor home BP twice weekly.`;
      precautionHi = `प्रतिदिन सुबह निश्चित समय पर लें और भोजन में नमक की मात्रा कम रखें।`;
      organ = 'heart';
    } else if (/udca|udiliv|ursodeoxycholic|silymarin/i.test(lowerMed)) {
      const liverRow = rows.find((r) => /sgpt|alt|sgot|ast|bilirubin|alp/i.test(r.name));
      linkedBiomarker = liverRow
        ? `${liverRow.name}: ${liverRow.value} ${liverRow.unit} (Ref: ${liverRow.range})`
        : 'Hepatic Transaminases (SGPT / SGOT)';
      rationaleEn = `Correlates with elevated hepatic enzymes (${linkedBiomarker}), stabilizing hepatocyte membranes and promoting bile flow.`;
      rationaleHi = `बढ़े हुए लिवर एंजाइम (${linkedBiomarker}) को शांत करने और यकृत कोशिकाओं की सूजन घटाने में सहायक है।`;
      precautionEn = `Take after meals. Avoid alcohol and unnecessary over-the-counter painkillers during liver recovery.`;
      precautionHi = `भोजन के बाद लें तथा तले-भुने आहार व अनावश्यक दर्द निवारक दवाओं से बचें।`;
      organ = 'liver';
    } else if (/pan|pantoprazole|omeprazole|rabeprazole/i.test(lowerMed)) {
      linkedBiomarker = 'Gastric Mucosal Acid Protection';
      rationaleEn = `Suppresses basal and stimulated gastric acid secretion to heal mucosal gastritis and prevent medication-induced acidity.`;
      rationaleHi = `आमाशय में एसिड स्राव को नियंत्रित कर गैस्ट्राइटिस और दवाओं से होने वाली एसिडिटी से बचाती है।`;
      precautionEn = `Must be swallowed whole 30-40 minutes before breakfast on an empty stomach.`;
      precautionHi = `सुबह नाश्ते से 30-40 मिनट पहले खाली पेट साबुत निगलें।`;
      organ = 'stomach';
    } else if (/iron|autrin|orofer|ferrous|folic|celin/i.test(lowerMed)) {
      const hbRow = rows.find((r) => /hemoglobin|rbc|hematocrit/i.test(r.name));
      linkedBiomarker = hbRow
        ? `${hbRow.name}: ${hbRow.value} ${hbRow.unit} (Ref: ${hbRow.range})`
        : 'Hemoglobin & Erythropoiesis';
      rationaleEn = `Directly replenishes elemental iron and co-factors required to raise low ${linkedBiomarker} and improve systemic oxygen delivery.`;
      rationaleHi = `कम हीमोग्लोबिन (${linkedBiomarker}) को सुधारने और लाल रक्त कोशिकाओं के निर्माण के लिए आवश्यक आयरन प्रदान करती है।`;
      precautionEn = `Take with Vitamin C / lemon water. Avoid tea, coffee, or dairy for 60 minutes before and after dose.`;
      precautionHi = `नींबू पानी के साथ लें; दवा लेने के 1 घंटे आगे-पीछे चाय, कॉफी या दूध न पिएं।`;
      organ = 'lungs';
    } else if (/thyro|levothyroxine/i.test(lowerMed)) {
      const tshRow = rows.find((r) => /tsh|thyroid/i.test(r.name));
      linkedBiomarker = tshRow
        ? `${tshRow.name}: ${tshRow.value} ${tshRow.unit} (Ref: ${tshRow.range})`
        : 'TSH (Thyroid Stimulating Hormone)';
      rationaleEn = `Restores physiological thyroid hormone levels to normalize ${linkedBiomarker} and metabolic rate.`;
      rationaleHi = `थायराइड हार्मोन की पूर्ति कर बढ़े हुए TSH (${linkedBiomarker}) और चयापचय को संतुलित करती है।`;
      precautionEn = `Take first thing in the morning on an empty stomach; wait 45 minutes before consuming tea or breakfast.`;
      precautionHi = `सुबह सबसे पहले खाली पेट लें और 45 मिनट बाद ही चाय या नाश्ता करें।`;
      organ = 'brain';
    }

    medicineCorrelations.push({
      medicine: med.name,
      dosage: `${med.dosage} · ${med.frequency}`,
      linkedBiomarker,
      clinicalRationaleEn: rationaleEn,
      clinicalRationaleHi: rationaleHi,
      precautionNoteEn: precautionEn,
      precautionNoteHi: precautionHi,
      organ,
    });
  }

  // 3. Combined Synthesis (Lab + Prescription)
  let combinedSynthesisEn = summaryEn;
  let combinedSynthesisHi = summaryHi;

  if (prescriptionDetails && meds.length > 0) {
    const bpText =
      prescriptionDetails.vitals?.systolicBP && prescriptionDetails.vitals?.diastolicBP
        ? `Recorded clinic Blood Pressure is ${prescriptionDetails.vitals.systolicBP}/${prescriptionDetails.vitals.diastolicBP} mmHg. `
        : '';
    const bpTextHi =
      prescriptionDetails.vitals?.systolicBP && prescriptionDetails.vitals?.diastolicBP
        ? `क्लिनिक में दर्ज रक्तचाप (BP) ${prescriptionDetails.vitals.systolicBP}/${prescriptionDetails.vitals.diastolicBP} mmHg है। `
        : '';

    combinedSynthesisEn = `Combined Clinical Synthesis (Lab Report + ${prescriptionDetails.doctorName}'s Prescription): Clinical diagnosis notes "${prescriptionDetails.diagnosis}". ${bpText}The prescribed regimen (${meds.map((m) => `${m.name} ${m.dosage}`).join(', ')}) directly aligns with your laboratory findings${highItems.length + lowItems.length > 0 ? ` — specifically targeting ${[...highItems, ...lowItems].map((r) => r.name).join(', ')}` : ''}. ${prescriptionDetails.adviceNotes || doctorNotes || ''}`;

    combinedSynthesisHi = `एकीकृत क्लिनिकल निष्कर्ष (लैब रिपोर्ट + ${prescriptionDetails.doctorName} का पर्चा): चिकित्सकीय निदान "${prescriptionDetails.diagnosis}" दर्ज है। ${bpTextHi}निर्धारित दवाएं (${meds.map((m) => `${m.name} ${m.dosage}`).join(', ')}) आपकी लैब रिपोर्ट के निष्कर्षों${highItems.length + lowItems.length > 0 ? ` — विशेष रूप से ${[...highItems, ...lowItems].map((r) => r.name).join(', ')}` : ''} को सीधे नियंत्रित करने के लिए संरेखित हैं। ${prescriptionDetails.adviceNotes || doctorNotes || ''}`;
  } else if (doctorNotes) {
    combinedSynthesisEn = `${summaryEn} Physician Notes: ${doctorNotes}`;
    combinedSynthesisHi = `${summaryHi} चिकित्सक की टिप्पणी: ${doctorNotes}`;
  }

  // 4. Key Concerns & Actionable Recommendations
  const keyConcernsEn: string[] = [
    ...highItems.map((h) => `${h.name} elevated at ${h.value} ${h.unit} (Reference: ${h.range})`),
    ...lowItems.map((l) => `${l.name} below threshold at ${l.value} ${l.unit} (Reference: ${l.range})`),
  ];
  if (
    prescriptionDetails?.vitals?.systolicBP &&
    (prescriptionDetails.vitals.systolicBP >= 130 || (prescriptionDetails.vitals.diastolicBP || 0) >= 85)
  ) {
    keyConcernsEn.push(
      `Clinic Blood Pressure recorded at ${prescriptionDetails.vitals.systolicBP}/${prescriptionDetails.vitals.diastolicBP} mmHg (Target: < 120/80 mmHg)`
    );
  }

  const keyConcernsHi: string[] = [
    ...highItems.map((h) => `${h.name} बढ़कर ${h.value} ${h.unit} (मानक सीमा: ${h.range})`),
    ...lowItems.map((l) => `${l.name} घटकर ${l.value} ${l.unit} (मानक सीमा: ${l.range})`),
  ];
  if (
    prescriptionDetails?.vitals?.systolicBP &&
    (prescriptionDetails.vitals.systolicBP >= 130 || (prescriptionDetails.vitals.diastolicBP || 0) >= 85)
  ) {
    keyConcernsHi.push(
      `दर्ज किया गया रक्तचाप (BP) ${prescriptionDetails.vitals.systolicBP}/${prescriptionDetails.vitals.diastolicBP} mmHg (आदर्श: < 120/80 mmHg)`
    );
  }

  const actionableRecommendationsEn: string[] = [];
  const actionableRecommendationsHi: string[] = [];

  if (meds.length > 0) {
    actionableRecommendationsEn.push(
      `Adhere to the prescribed medication timing: ${meds.map((m) => `${m.name} (${m.frequency}, ${m.timing})`).join('; ')}.`
    );
    actionableRecommendationsHi.push(
      `निर्धारित समय पर दवाएं लें: ${meds.map((m) => `${m.name} (${m.frequency}, ${m.timing})`).join('; ')}।`
    );
  }
  if (prescriptionDetails?.adviceNotes || doctorNotes) {
    actionableRecommendationsEn.push(prescriptionDetails?.adviceNotes || doctorNotes || '');
    actionableRecommendationsHi.push(
      `चिकित्सक के आहार व व्यायाम निर्देशों का पालन करें: ${prescriptionDetails?.adviceNotes || doctorNotes}`
    );
  }
  actionableRecommendationsEn.push(
    `Track Blood Pressure, Fasting Glucose, and Lipid variations in the Health Dashboard Trend Chart and schedule follow-up testing${prescriptionDetails?.followUpDate ? ` around ${prescriptionDetails.followUpDate}` : ' in 8–12 weeks'}.`
  );
  actionableRecommendationsHi.push(
    `हेल्थ डैशबोर्ड ट्रेंड चार्ट में रक्तचाप (BP), शुगर और कोलेस्ट्रॉल के उतार-चढ़ाव पर नज़र रखें और ${prescriptionDetails?.followUpDate ? `${prescriptionDetails.followUpDate} के आसपास` : '8-12 सप्ताह में'} दोबारा जांच कराएं।`
  );

  const suggestedQuestionsEn: string[] = [
    highItems.length > 0
      ? `How soon should we expect ${highItems[0].name} (${highItems[0].value} ${highItems[0].unit}) to normalize with the current prescription${meds[0] ? ` (${meds[0].name})` : ''}?`
      : `Are any dose adjustments needed given that my current biomarkers are stable?`,
    meds.length > 1
      ? `Are there any food interactions or spacing needed between ${meds[0].name} and ${meds[1].name}?`
      : `Could my daily diet, hydration, or meal timing be optimized to support these results?`,
    `Which specific parameters should we repeat on my next follow-up visit${prescriptionDetails?.followUpDate ? ` on ${prescriptionDetails.followUpDate}` : ''}?`,
  ];

  const suggestedQuestionsHi: string[] = [
    highItems.length > 0
      ? `वर्तमान पर्चे की दवाओं${meds[0] ? ` (${meds[0].name})` : ''} से ${highItems[0].name} (${highItems[0].value} ${highItems[0].unit}) कितने समय में सामान्य स्तर पर आ जाएगा?`
      : `चूंकि मेरे अधिकांश पैरामीटर स्थिर हैं, क्या दवा की खुराक में किसी बदलाव की आवश्यकता है?`,
    meds.length > 1
      ? `क्या ${meds[0].name} और ${meds[1].name} लेने के समय में अंतर रखना चाहिए या किसी विशेष भोजन से परहेज करना है?`
      : `इन परिणामों को बेहतर बनाने के लिए मुझे अपने दैनिक आहार और पानी की मात्रा में क्या सुधार करना चाहिए?`,
    `अगली फॉलो-अप विजिट${prescriptionDetails?.followUpDate ? ` (${prescriptionDetails.followUpDate})` : ''} से पहले कौन-कौन से ब्लड टेस्ट दोबारा कराने होंगे?`,
  ];

  return {
    summaryEn,
    summaryHi,
    combinedSynthesisEn,
    combinedSynthesisHi,
    keyConcernsEn,
    keyConcernsHi,
    actionableRecommendationsEn,
    actionableRecommendationsHi,
    suggestedQuestionsEn,
    suggestedQuestionsHi,
    medicineCorrelations,
  };
}
