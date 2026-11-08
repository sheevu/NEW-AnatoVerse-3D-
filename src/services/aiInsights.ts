import { TestRow } from '../types';

export interface ReportInsightResponse {
  summaryEn: string;
  summaryHi: string;
  keyConcernsEn: string[];
  keyConcernsHi: string[];
  suggestedQuestionsEn: string[];
  suggestedQuestionsHi: string[];
}

export async function generateReportInsights(rows: TestRow[]): Promise<ReportInsightResponse> {
  // Call server if configured
  try {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
      signal: AbortSignal.timeout(10000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.summaryEn) return data;
    }
  } catch {
    // Proceed to robust local generator
  }

  const highItems = rows.filter(r => r.status === 'high');
  const lowItems = rows.filter(r => r.status === 'low');
  const normalItems = rows.filter(r => r.status === 'within');

  // English Summary
  let summaryEn = `This medical report includes ${rows.length} verified laboratory parameters. `;
  if (highItems.length === 0 && lowItems.length === 0) {
    summaryEn += `All tested parameters fall within the laboratory's standard reference thresholds. Continue maintaining a balanced lifestyle and consult your physician during scheduled check-ups.`;
  } else {
    summaryEn += `Of these, ${normalItems.length} are within standard reference ranges. `;
    if (highItems.length > 0) {
      summaryEn += `${highItems.map(h => `${h.name} (${h.value} ${h.unit})`).join(', ')} were noted above the reference range. `;
    }
    if (lowItems.length > 0) {
      summaryEn += `${lowItems.map(l => `${l.name} (${l.value} ${l.unit})`).join(', ')} were noted below standard thresholds. `;
    }
    summaryEn += `These variations are educational indicators to discuss with your healthcare professional to evaluate context, diet, and lifestyle adjustments.`;
  }

  // Hindi Summary
  let summaryHi = `इस मेडिकल रिपोर्ट में कुल ${rows.length} लैब परीक्षणों की समीक्षा की गई है। `;
  if (highItems.length === 0 && lowItems.length === 0) {
    summaryHi += `सभी जांच परिणाम प्रयोगशाला की सामान्य संदर्भ सीमा के भीतर पाए गए हैं। संतुलित दिनचर्या बनाए रखें और नियमित स्वास्थ्य जांच जारी रखें।`;
  } else {
    summaryHi += `इनमें से ${normalItems.length} परिणाम सामान्य सीमा में हैं। `;
    if (highItems.length > 0) {
      summaryHi += `${highItems.map(h => `${h.name} (${h.value} ${h.unit})`).join(', ')} मानक सीमा से अधिक पाए गए हैं। `;
    }
    if (lowItems.length > 0) {
      summaryHi += `${lowItems.map(l => `${l.name} (${l.value} ${l.unit})`).join(', ')} मानक सीमा से कम दर्ज किए गए हैं। `;
    }
    summaryHi += `ये निष्कर्ष शैक्षिक मार्गदर्शन के लिए हैं। अपने चिकित्सक से इन पर चर्चा कर आहार व उचित परामर्श प्राप्त करें।`;
  }

  const keyConcernsEn: string[] = [
    ...highItems.map(h => `${h.name} elevated at ${h.value} ${h.unit} (standard range: ${h.range})`),
    ...lowItems.map(l => `${l.name} reduced at ${l.value} ${l.unit} (standard range: ${l.range})`)
  ];

  const keyConcernsHi: string[] = [
    ...highItems.map(h => `${h.name} बढ़कर ${h.value} ${h.unit} (सामान्य सीमा: ${h.range})`),
    ...lowItems.map(l => `${l.name} घटकर ${l.value} ${l.unit} (सामान्य सीमा: ${l.range})`)
  ];

  const suggestedQuestionsEn: string[] = [
    highItems.length > 0
      ? `Do the elevated levels of ${highItems[0].name} require immediate lifestyle modification, medication, or repeat testing?`
      : `Are there any specific dietary adjustments recommended based on this panel?`,
    `Could my current medications, fasting duration, or daily hydration have influenced these lab numbers?`,
    `When would you recommend a follow-up or re-test for these specific biomarkers?`
  ];

  const suggestedQuestionsHi: string[] = [
    highItems.length > 0
      ? `क्या ${highItems[0].name} के बढ़े स्तर के लिए तुरंत जीवनशैली में बदलाव, दवा या दोबारा जांच की आवश्यकता है?`
      : `क्या इस रिपोर्ट के आधार पर आहार या दिनचर्या में कोई विशेष बदलाव करना चाहिए?`,
    `क्या मेरी वर्तमान दवाओं, खाली पेट रहने की अवधि या पानी पीने की मात्रा ने इन नंबरों को प्रभावित किया?`,
    `इन जांचों की दोबारा जांच (फॉलो-अप) कब करानी चाहिए?`
  ];

  return {
    summaryEn,
    summaryHi,
    keyConcernsEn,
    keyConcernsHi,
    suggestedQuestionsEn,
    suggestedQuestionsHi
  };
}
