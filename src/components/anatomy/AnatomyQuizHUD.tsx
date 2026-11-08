import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Award,
  Lightbulb,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  BookOpen,
  Activity,
  Heart,
  Eye,
} from 'lucide-react';
import { OrganKey } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import { ANATOMICAL_STRUCTURES } from '../../data/anatomyNomenclature';
import { playCorrectAnswerChime, playIncorrectChime } from '../../utils/audioChime';

const ALL_QUIZ_ORGANS: OrganKey[] = [
  'heart',
  'brain',
  'lungs',
  'liver',
  'kidneys',
  'pancreas',
  'stomach',
  'intestines',
];

interface AnatomyQuizHUDProps {
  currentHighlightedOrgan: OrganKey;
  onSetHighlightedOrgan: (organ: OrganKey) => void;
  onZoomToOrgan: (organ: OrganKey) => void;
  onExitQuiz: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAnswerEvaluated?: (isCorrect: boolean) => void;
  lastDirectClickedOrgan?: OrganKey | null;
}

export function AnatomyQuizHUD({
  currentHighlightedOrgan,
  onSetHighlightedOrgan,
  onZoomToOrgan,
  onExitQuiz,
  soundEnabled,
  onToggleSound,
  onAnswerEvaluated,
  lastDirectClickedOrgan,
}: AnatomyQuizHUDProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<OrganKey | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  // Generate 4 randomized choices with 1 correct target
  const choices = useMemo(() => {
    const distractors = ALL_QUIZ_ORGANS.filter((k) => k !== currentHighlightedOrgan);
    // Shuffle distractors
    const shuffledDistractors = [...distractors].sort(() => 0.5 - Math.random());
    const pickedDistractors = shuffledDistractors.slice(0, 3);
    const combined = [currentHighlightedOrgan, ...pickedDistractors];
    // Shuffle combined choices deterministically per organ question
    return combined.sort(() => 0.5 - Math.random());
  }, [currentHighlightedOrgan, questionsAnswered]);

  const targetMeta = ORGANS[currentHighlightedOrgan];
  const targetStructure = ANATOMICAL_STRUCTURES[currentHighlightedOrgan];

  // If user directly clicked an organ in the 3D Canvas, treat it as an answer selection!
  useEffect(() => {
    if (lastDirectClickedOrgan && !hasAnswered) {
      handleAnswer(lastDirectClickedOrgan);
    }
  }, [lastDirectClickedOrgan, hasAnswered]);

  const handleAnswer = useCallback(
    (chosenOrgan: OrganKey) => {
      if (hasAnswered) return;

      setSelectedChoice(chosenOrgan);
      setHasAnswered(true);
      const isCorrect = chosenOrgan === currentHighlightedOrgan;

      setQuestionsAnswered((prev) => prev + 1);

      if (isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
        setScore((prev) => prev + 100 + newStreak * 20);

        if (soundEnabled) {
          playCorrectAnswerChime();
        }

        // Celebrate with confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#10b981', '#34d399', '#06b6d4', '#fbbf24'],
          });
        } catch {}

        onAnswerEvaluated?.(true);
      } else {
        setStreak(0);
        if (soundEnabled) {
          playIncorrectChime();
        }
        onAnswerEvaluated?.(false);
      }
    },
    [
      hasAnswered,
      currentHighlightedOrgan,
      streak,
      bestStreak,
      soundEnabled,
      onAnswerEvaluated,
    ]
  );

  const handleNextQuestion = () => {
    // Pick next organ avoiding the current one
    const available = ALL_QUIZ_ORGANS.filter((k) => k !== currentHighlightedOrgan);
    const nextOrgan = available[Math.floor(Math.random() * available.length)];

    setSelectedChoice(null);
    setHasAnswered(false);
    setShowHint(false);
    onSetHighlightedOrgan(nextOrgan);
  };

  const isCorrectAnswer = selectedChoice === currentHighlightedOrgan;

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-2xl pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="rounded-2xl bg-slate-950/95 border border-emerald-500/50 shadow-2xl backdrop-blur-xl overflow-hidden ring-1 ring-emerald-500/20 text-white select-none">
        {/* Top Header: Quiz Title, Streak & Scoreboard */}
        <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-b border-emerald-800/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </span>
            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-emerald-100 flex items-center gap-1.5">
                <span>{isHi ? '3D एनाटॉमी क्विज़ मोड' : '3D Human Anatomy Quiz'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-600/50">
                  Q#{questionsAnswered + 1}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {isHi
                  ? '3D मॉडल में हाइलाइट किए गए अंग को पहचानें या सीधे 3D में क्लिक करें'
                  : 'Identify the highlighted organ or click it directly in the 3D model'}
              </p>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/60 text-amber-300 font-black text-[11px]">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{streak}</span>
              </div>
            )}

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono font-bold text-[11px]">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span>{score} pts</span>
            </div>

            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            <button
              onClick={onExitQuiz}
              title={isHi ? 'क्विज़ से बाहर निकलें' : 'Exit Quiz'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Prompt Area */}
        <div className="p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
              <span className="font-bold text-xs sm:text-sm text-slate-200">
                {isHi
                  ? 'यह कौन सा अंग 3D शरीर में हाइलाइट हो रहा है?'
                  : 'Which organ is currently highlighted in the 3D model?'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onZoomToOrgan(currentHighlightedOrgan)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 flex items-center gap-1 transition-all"
                title="Focus Camera in 3D"
              >
                <Eye className="w-3 h-3 text-sky-400" />
                <span className="hidden sm:inline">{isHi ? 'ज़ूम इन करें' : 'Focus 3D'}</span>
              </button>

              <button
                onClick={() => setShowHint((prev) => !prev)}
                className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/60 flex items-center gap-1 transition-all"
              >
                <Lightbulb className="w-3 h-3 text-amber-400" />
                <span>{showHint ? (isHi ? 'संकेत छिपाएं' : 'Hide Hint') : isHi ? 'संकेत देखें' : 'Show Hint'}</span>
              </button>
            </div>
          </div>

          {/* Educational Hint Accordion */}
          {showHint && (
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/50 text-xs text-amber-200 flex items-start gap-2 animate-in fade-in">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] leading-relaxed">
                <p>
                  <strong>{isHi ? 'शारीरिक संकेत:' : 'Physiological Clue:'}</strong>{' '}
                  {isHi ? targetMeta.functionHi : targetMeta.functionEn}
                </p>
                {targetStructure && (
                  <p className="text-amber-300/80 font-serif italic">
                    Latin: {targetStructure.latin} · {targetStructure.ta2Id}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 4 Interactive Answer Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {choices.map((organKey) => {
              const organ = ORGANS[organKey];
              const isSelected = selectedChoice === organKey;
              const isTarget = organKey === currentHighlightedOrgan;

              let buttonStyle = 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-emerald-500/50';

              if (hasAnswered) {
                if (isTarget) {
                  buttonStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400/50';
                } else if (isSelected && !isTarget) {
                  buttonStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 ring-2 ring-rose-400/50';
                } else {
                  buttonStyle = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={organKey}
                  onClick={() => handleAnswer(organKey)}
                  disabled={hasAnswered}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${buttonStyle}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: organ.color }}
                    />
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">
                        {isHi ? organ.nameHi : organ.nameEn}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        {organ.fmaId}
                      </div>
                    </div>
                  </div>

                  {hasAnswered && (
                    <div className="shrink-0">
                      {isTarget ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Educational Feedback Card upon Answer */}
          {hasAnswered && (
            <div
              className={`p-3.5 rounded-xl border space-y-2.5 animate-in fade-in duration-200 ${
                isCorrectAnswer
                  ? 'bg-emerald-950/50 border-emerald-600/70 text-emerald-100'
                  : 'bg-rose-950/50 border-rose-600/70 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between pb-1 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {isCorrectAnswer ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-extrabold text-sm text-emerald-300">
                        {isHi ? 'शाबाश! बिल्कुल सही उत्तर 🎉' : 'Correct! Outstanding Knowledge 🎉'}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span className="font-extrabold text-sm text-rose-300">
                        {isHi ? 'पुनः प्रयास करें · सही उत्तर नीचे देखें' : 'Not quite · Educational Review'}
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/60 transition-all hover:scale-105 active:scale-95"
                >
                  <span>{isHi ? 'अगला अंग →' : 'Next Organ →'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Educational Synthesis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] leading-relaxed">
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>
                      {isHi ? targetMeta.nameHi : targetMeta.nameEn}{' '}
                      {targetStructure && (
                        <span className="font-serif italic font-normal text-emerald-300">
                          ({targetStructure.latin})
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-slate-200">
                    {isHi ? targetMeta.shortInsightHi : targetMeta.shortInsightEn}
                  </p>
                </div>

                <div className="space-y-1 bg-slate-900/60 p-2 rounded-lg border border-white/5">
                  <div className="font-bold text-emerald-300 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>{isHi ? 'क्लिनिकल बायोमार्कर:' : 'Clinical Lab Tests:'}</span>
                  </div>
                  <p className="text-slate-300 font-mono text-[10px]">
                    {targetMeta.recommendedTests.slice(0, 3).join(' · ')}
                  </p>
                  {targetStructure && (
                    <div className="text-[10px] text-teal-300 pt-0.5">
                      Ayurveda: {targetStructure.ayurvedaAssociation.dosha} ({targetStructure.ayurvedaAssociation.dhatu})
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Scoreboard Metrics */}
        <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              Accuracy:{' '}
              <strong className="text-white">
                {questionsAnswered > 0
                  ? `${Math.round((correctAnswers / questionsAnswered) * 100)}%`
                  : '0%'}
              </strong>
            </span>
            <span>
              Best Streak: <strong className="text-amber-400">{bestStreak}</strong>
            </span>
          </div>

          <div className="text-slate-500 hidden sm:block">
            {isHi ? 'सलाह: 3D मॉडल को घुमाकर चारों तरफ से देखें' : 'Tip: Orbit 360° to inspect landmarks & depth'}
          </div>
        </div>
      </div>
    </div>
  );
}
