import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChatMessage, OrganKey } from '../../types';
import { identifyOrganFromSymptom, ORGANS } from '../../services/medicalRules';
import {
  MessageSquare,
  Send,
  Sparkles,
  HeartPulse,
  Activity,
  ArrowRight,
  ShieldAlert,
  User,
  Bot,
} from 'lucide-react';

interface HealthChatProps {
  onShowInAnatomy: (organ: OrganKey) => void;
  initialQuery?: string;
}

export function HealthChat({ onShowInAnatomy, initialQuery }: HealthChatProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm1',
      sender: 'assistant',
      text:
        lang === 'hi'
          ? 'नमस्ते! आप अपनी शारीरिक परेशानी, लक्षण या स्वास्थ्य चिंता यहाँ साझा कर सकते हैं। मैं आपको संबंधित अंग और 3D एनाटॉमी में उसके प्रभाव को समझाऊंगा।'
          : "Hello! Describe any body symptoms, discomfort, or health concerns you are experiencing. I'll explain the biological mechanism and highlight the affected organ in interactive 3D anatomy.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (initialQuery) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  const quickPrompts = [
    {
      en: 'Burning in chest and sour acid reflux after dinner',
      hi: 'भोजन के बाद सीने में जलन और खट्टी डकारें (एसिडिटी)',
      organ: 'stomach' as OrganKey,
    },
    {
      en: 'Chest pressure, rapid palpitations, and breathlessness on stairs',
      hi: 'सीने में भारीपन, धड़कन तेज होना और सांस फूलना',
      organ: 'heart' as OrganKey,
    },
    {
      en: 'Excessive thirst, frequent urination at night, and fatigue',
      hi: 'अत्यधिक प्यास, रात में बार-बार पेशाब और कमजोरी',
      organ: 'pancreas' as OrganKey,
    },
    {
      en: 'Swelling around feet, ankles, and puffy morning eyes',
      hi: 'पैरों और टखनों में सूजन तथा सुबह आंखों के नीचे सूजन',
      organ: 'kidneys' as OrganKey,
    },
    {
      en: 'Pain in upper right abdomen and yellow discoloration in eyes',
      hi: 'पेट के दाहिने ऊपरी हिस्से में दर्द और आंखों में पीलापन',
      organ: 'liver' as OrganKey,
    },
  ];

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');

    // Process symptom mapping
    setTimeout(() => {
      const match = identifyOrganFromSymptom(query);
      const organMeta = match.organ ? ORGANS[match.organ] : null;

      let replyText = '';
      if (lang === 'hi') {
        replyText = match.explanationHi;
        if (organMeta) {
          replyText += `\n\n💡 **संक्षिप्त जानकारी (${organMeta.nameHi}):** ${organMeta.shortInsightHi}`;
        }
      } else {
        replyText = match.explanationEn;
        if (organMeta) {
          replyText += `\n\n💡 **Key Takeaway (${organMeta.nameEn}):** ${organMeta.shortInsightEn}`;
        }
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        relatedOrgan: match.organ,
        suggestedTests: match.suggestedTests,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[650px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in duration-200">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
            <Bot className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base tracking-tight flex items-center gap-2">
              <span>VedaShield Health Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 border border-emerald-500/30">
                AI Symptom & Anatomy Guide
              </span>
            </h3>
            <p className="text-xs text-emerald-100">
              {lang === 'hi'
                ? 'लक्षण बताएं → संबंधित अंग व 3D एनाटॉमी देखें'
                : 'Describe symptoms → Discover connected organs & view in 3D'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Symptom Chips */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap text-[11px]">
          {lang === 'hi' ? 'त्वरित उदाहरण:' : 'Quick Examples:'}
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSend(lang === 'hi' ? p.hi : p.en)}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 whitespace-nowrap transition-colors"
          >
            {lang === 'hi' ? p.hi : p.en}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-500/20'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed space-y-3 ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Show in 3D Anatomy CTA */}
              {m.relatedOrgan && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => onShowInAnatomy(m.relatedOrgan!)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/30 transition-all group"
                    >
                      <HeartPulse className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                      <span>
                        {lang === 'hi'
                          ? `3D एनाटॉमी में देखें (${ORGANS[m.relatedOrgan!].nameHi})`
                          : `View in 3D Anatomy (${ORGANS[m.relatedOrgan!].nameEn})`}
                      </span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <span className="text-[10px] font-mono text-slate-400">
                      {ORGANS[m.relatedOrgan!].fmaId}
                    </span>
                  </div>

                  {/* Diagnostic Tests Recommended */}
                  {m.suggestedTests && m.suggestedTests.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Relevant Clinical Tests:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {m.suggestedTests.map((testName, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-medium"
                          >
                            {testName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[9px] text-right opacity-60">{m.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === 'hi'
                ? 'अपने लक्षण या समस्या यहाँ लिखें (उदा. सीने में दर्द, थकान, पेट में जलन)...'
                : 'Describe your body symptoms (e.g., chest tightness, frequent thirst, abdominal pain)...'
            }
            className="flex-1 text-xs px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-40 transition-colors shadow-md shadow-emerald-600/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-center text-slate-400 mt-2">
          {lang === 'hi'
            ? 'केवल शैक्षिक मार्गदर्शन। किसी भी गंभीर लक्षण के लिए आपातकालीन चिकित्सा सहायता लें।'
            : 'For educational health literacy only. Consult a clinician for medical diagnosis.'}
        </p>
      </div>
    </div>
  );
}
