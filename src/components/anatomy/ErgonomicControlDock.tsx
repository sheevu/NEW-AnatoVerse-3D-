import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sliders,
  Scissors,
  Layers,
  HeartPulse,
  Compass,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Activity,
  Maximize2,
  Orbit,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { AnatomicalLayers, AnatomicalSystemKey } from '../../types';

interface ErgonomicControlDockProps {
  layers: AnatomicalLayers;
  onUpdateLayers: (updater: (prev: AnatomicalLayers) => AnatomicalLayers) => void;
  activeSystem: AnatomicalSystemKey | 'all';
  onSelectSystem: (sys: AnatomicalSystemKey | 'all') => void;
  cameraAngle: 'front' | 'back' | 'left' | 'right' | 'top';
  onSetCameraAngle: (angle: 'front' | 'back' | 'left' | 'right' | 'top') => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  isolateMode: boolean;
  onToggleIsolateMode: () => void;
  onResetView: () => void;
  hasActiveOrgan: boolean;
  isQuizMode?: boolean;
  onToggleQuizMode?: () => void;
}

export function ErgonomicControlDock({
  layers,
  onUpdateLayers,
  activeSystem,
  onSelectSystem,
  cameraAngle,
  onSetCameraAngle,
  autoRotate,
  onToggleAutoRotate,
  isolateMode,
  onToggleIsolateMode,
  onResetView,
  hasActiveOrgan,
  isQuizMode = false,
  onToggleQuizMode,
}: ErgonomicControlDockProps) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'exploded' | 'clipping' | 'systems' | 'sim' | 'camera'>('exploded');

  const systemPills: { key: AnatomicalSystemKey | 'all'; labelEn: string; labelHi: string; icon: string }[] = [
    { key: 'all', labelEn: 'All Systems', labelHi: 'सभी प्रणालियां', icon: '🧍' },
    { key: 'skeletal', labelEn: 'Skeletal', labelHi: 'कंकाल तंत्र', icon: '🦴' },
    { key: 'muscular', labelEn: 'Muscular', labelHi: 'मांसपेशियां', icon: '💪' },
    { key: 'cardiovascular', labelEn: 'Circulatory', labelHi: 'रक्त परिसंचरण', icon: '🩸' },
    { key: 'respiratory', labelEn: 'Respiratory', labelHi: 'श्वसन तंत्र', icon: '🫁' },
    { key: 'nervous', labelEn: 'Nervous', labelHi: 'तंत्रिका तंत्र', icon: '⚡' },
    { key: 'digestive', labelEn: 'Digestive', labelHi: 'पाचन तंत्र', icon: '🍏' },
    { key: 'endocrine', labelEn: 'Endocrine', labelHi: 'अंतःस्रावी', icon: '🦋' },
    { key: 'urinary', labelEn: 'Urinary', labelHi: 'उत्सर्जन तंत्र', icon: '💧' },
  ];

  return (
    <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-4xl pointer-events-auto transition-transform duration-300">
      {/* Dock Toggle Tab (Zen Mode Trigger) */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="px-3.5 py-1 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md shadow-lg text-[11px] font-bold flex items-center gap-1.5 transition-all select-none"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? 'नियंत्रण पैनल खोलें' : 'Show Controls Dock'}</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>{isHi ? 'सिनेमा मोड (छुपाएं)' : 'Hide Controls (Zen Mode)'}</span>
            </>
          )}
        </button>
      </div>

      {!isCollapsed && (
        <div className="bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl sm:rounded-3xl shadow-2xl p-2.5 sm:p-3 text-white space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Top Row: Sub-feature Switcher Buttons */}
          <div className="flex items-center justify-between gap-1 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1">
              {/* Exploded View Tab */}
              <button
                onClick={() => setActiveTab('exploded')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'exploded'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isHi ? 'रेडियल एक्सप्लोडेड व्यू' : 'Exploded View'}</span>
                {layers.explodedFactor > 0 && (
                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-200">
                    {Math.round(layers.explodedFactor * 100)}%
                  </span>
                )}
              </button>

              {/* Cross-Section Clipping Tab */}
              <button
                onClick={() => setActiveTab('clipping')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'clipping'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-sky-400" />
                <span>{isHi ? 'क्रॉस-सेक्शन स्लाइस' : 'Cross-Section Slice'}</span>
                {layers.clippingPlane && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                )}
              </button>

              {/* Anatomical Systems Tab */}
              <button
                onClick={() => setActiveTab('systems')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'systems'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? 'शारीरिक प्रणालियां' : 'Body Systems'}</span>
              </button>

              {/* Physiological Simulation Sync Tab */}
              <button
                onClick={() => setActiveTab('sim')}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                  activeTab === 'sim'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40 ring-1 ring-emerald-400/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>{isHi ? 'जैविक पल्स सिंक' : 'Pulse & Rhythm'}</span>
              </button>

              {/* Anatomy Quiz Mode Button */}
              {onToggleQuizMode && (
                <button
                  onClick={onToggleQuizMode}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                    isQuizMode
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-orange-950/60 ring-2 ring-amber-300'
                      : 'bg-amber-950/70 text-amber-200 hover:bg-amber-900/80 hover:text-white border border-amber-600/70'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isHi ? 'एनाटॉमी क्विज़' : 'Anatomy Quiz'}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-900 text-amber-100 border border-amber-500/40">
                    {isQuizMode ? 'ON' : 'QUIZ'}
                  </span>
                </button>
              )}
            </div>

            {/* Quick Utility Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={onToggleAutoRotate}
                title={isHi ? 'ऑटो-रोटेशन (O)' : 'Auto-Orbit (Press O)'}
                className={`p-1.5 rounded-xl border transition-all ${
                  autoRotate
                    ? 'bg-indigo-600 border-indigo-400 text-white shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Orbit className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={onToggleIsolateMode}
                title={isHi ? 'आइसोलेट / सोलो मोड (X)' : 'Solo Focus (Press X)'}
                className={`p-1.5 rounded-xl border transition-all ${
                  isolateMode
                    ? 'bg-amber-600 border-amber-400 text-white shadow'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onResetView}
                title={isHi ? 'दृश्य रीसेट करें' : 'Reset View (Press R)'}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Active Tab Sub-Controls Area */}
          <div className="min-h-[50px] flex items-center">
            {/* 1. Exploded View Mode */}
            {activeTab === 'exploded' && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">
                      {isHi ? 'रेडियल फैलाव दूरी (Radial Separation):' : 'Radial Exploded Displacement:'}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round(layers.explodedFactor * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.02"
                    value={layers.explodedFactor}
                    onChange={(e) =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        explodedFactor: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onUpdateLayers((prev) => ({ ...prev, explodedFactor: 0 }))}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                      layers.explodedFactor === 0
                        ? 'bg-slate-800 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    0% {isHi ? 'संक्षिप्त' : 'Packed'}
                  </button>
                  <button
                    onClick={() => onUpdateLayers((prev) => ({ ...prev, explodedFactor: 0.5 }))}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                      Math.abs(layers.explodedFactor - 0.5) < 0.05
                        ? 'bg-slate-800 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    50%
                  </button>
                  <button
                    onClick={() => onUpdateLayers((prev) => ({ ...prev, explodedFactor: 1.0 }))}
                    className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                      layers.explodedFactor === 1.0
                        ? 'bg-slate-800 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    100% {isHi ? 'पूर्ण विस्तृत' : 'Full'}
                  </button>
                </div>
              </div>
            )}

            {/* 2. Cross-Sectional Slice Mode */}
            {activeTab === 'clipping' && (
              <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                {/* Slicing Active Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        clippingPlane: !prev.clippingPlane,
                      }))
                    }
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-all flex items-center gap-1.5 ${
                      layers.clippingPlane
                        ? 'bg-sky-600 border-sky-400 text-white shadow'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{layers.clippingPlane ? (isHi ? 'स्लाइस सक्रिय' : 'Slicing Active') : (isHi ? 'स्लाइस चालू करें' : 'Enable Slice')}</span>
                  </button>

                  {/* Slicing Axis Selector */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
                    {(['axial', 'coronal', 'sagittal'] as const).map((axis) => (
                      <button
                        key={axis}
                        onClick={() =>
                          onUpdateLayers((prev) => ({
                            ...prev,
                            clippingAxis: axis,
                            clippingPlane: true,
                          }))
                        }
                        className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                          layers.clippingAxis === axis
                            ? 'bg-sky-700 text-white shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {axis === 'axial'
                          ? isHi ? 'अनुप्रस्थ (Axial)' : 'Axial (Y)'
                          : axis === 'coronal'
                          ? isHi ? 'फ्रंटल (Coronal)' : 'Coronal (Z)'
                          : isHi ? 'पार्श्व (Sagittal)' : 'Sagittal (X)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slicing Height / Depth Slider */}
                <div className="flex-1 w-full flex items-center gap-2">
                  <input
                    type="range"
                    min={layers.clippingAxis === 'coronal' ? -0.4 : layers.clippingAxis === 'sagittal' ? -0.6 : -0.2}
                    max={layers.clippingAxis === 'coronal' ? 0.4 : layers.clippingAxis === 'sagittal' ? 0.6 : 2.4}
                    step="0.05"
                    disabled={!layers.clippingPlane}
                    value={layers.clippingHeight}
                    onChange={(e) =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        clippingHeight: parseFloat(e.target.value),
                      }))
                    }
                    className="flex-1 h-2 accent-sky-400 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
                  />
                  <span className="font-mono text-sky-400 text-[11px] w-12 text-right">
                    {layers.clippingHeight.toFixed(2)}m
                  </span>
                </div>
              </div>
            )}

            {/* 3. Anatomical Systems Switcher */}
            {activeTab === 'systems' && (
              <div className="w-full flex items-center gap-1.5 overflow-x-auto py-1">
                {systemPills.map((p) => {
                  const isSelected = activeSystem === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => onSelectSystem(p.key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{p.icon}</span>
                      <span>{isHi ? p.labelHi : p.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 4. Physiological Simulation Sync */}
            {activeTab === 'sim' && (
              <div className="w-full flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-semibold">
                    {isHi ? 'जैविक गति अनुकरण:' : 'Active Simulations:'}
                  </span>

                  <button
                    onClick={() =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        animationHeart: !prev.animationHeart,
                      }))
                    }
                    className={`px-2.5 py-1 rounded-xl font-bold border transition-all flex items-center gap-1 ${
                      layers.animationHeart
                        ? 'bg-rose-950 border-rose-500 text-rose-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>❤️ Cardiac Pulse (72 BPM)</span>
                  </button>

                  <button
                    onClick={() =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        animationBreathing: !prev.animationBreathing,
                      }))
                    }
                    className={`px-2.5 py-1 rounded-xl font-bold border transition-all flex items-center gap-1 ${
                      layers.animationBreathing
                        ? 'bg-sky-950 border-sky-500 text-sky-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>🫁 Respiration (16 BPM)</span>
                  </button>

                  <button
                    onClick={() =>
                      onUpdateLayers((prev) => ({
                        ...prev,
                        animationBloodFlow: !prev.animationBloodFlow,
                      }))
                    }
                    className={`px-2.5 py-1 rounded-xl font-bold border transition-all flex items-center gap-1 ${
                      layers.animationBloodFlow
                        ? 'bg-red-950 border-red-500 text-red-300'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    <span>🩸 Arterial Waves</span>
                  </button>
                </div>

                {/* Camera Angle Presets */}
                <div className="flex items-center gap-1 border-l border-slate-800 pl-3">
                  <span className="text-slate-400 text-[11px] font-semibold mr-1">Angle:</span>
                  {(['front', 'back', 'left', 'right', 'top'] as const).map((ang) => (
                    <button
                      key={ang}
                      onClick={() => onSetCameraAngle(ang)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        cameraAngle === ang
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
