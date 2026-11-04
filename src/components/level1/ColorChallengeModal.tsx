import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FOREST_COLORS, COLOR_CHALLENGES } from '../../data/colorsData';
import { audioService } from '../../services/audioService';
import {
  X,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Palette,
  Heart,
  Volume2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { NikoCharacter, NikoPose } from '../characters/NikoCharacter';

export const ColorChallengeModal: React.FC = () => {
  const {
    activeColorChallenge,
    closeColorChallenge,
    restoreColor,
    addPoints,
    accessibility,
    speak,
  } = useGame();

  const [currentStage, setCurrentStage] = useState<'identify' | 'paint' | 'celebrate'>('identify');
  const [collectedItemIds, setCollectedItemIds] = useState<string[]>([]);
  const [hintActive, setHintActive] = useState<boolean>(false);
  const [paintedRatio, setPaintedRatio] = useState<number>(0);
  const [gentleFeedback, setGentleFeedback] = useState<string | null>(null);
  const [nikoPose, setNikoPose] = useState<NikoPose>('idle');
  const nikoPoseTimer = useRef<number | null>(null);

  useEffect(() => {
    if (activeColorChallenge) {
      setCurrentStage('identify');
      setCollectedItemIds([]);
      setHintActive(false);
      setPaintedRatio(0);
      setGentleFeedback(null);
      setNikoPose('idle');
    }
  }, [activeColorChallenge]);

  useEffect(() => () => {
    if (nikoPoseTimer.current !== null) window.clearTimeout(nikoPoseTimer.current);
  }, []);

  const animateNiko = (pose: NikoPose) => {
    setNikoPose(pose);
    if (nikoPoseTimer.current !== null) window.clearTimeout(nikoPoseTimer.current);
    if (pose !== 'idle') {
      nikoPoseTimer.current = window.setTimeout(() => setNikoPose('idle'), 900);
    }
  };

  if (!activeColorChallenge) return null;

  const colorInfo = FOREST_COLORS[activeColorChallenge];
  const challengeData = COLOR_CHALLENGES[activeColorChallenge];

  const targetItems = challengeData.stage1Items.filter((i) => i.isTarget);

  // Handle tapping an item in Stage 1
  const handleItemClick = (item: typeof challengeData.stage1Items[0]) => {
    if (collectedItemIds.includes(item.id)) return;

    if (item.isTarget) {
      // Correct item picked!
      audioService.playSparkle();
      setGentleFeedback(null);
      animateNiko('celebrating');
      const updated = [...collectedItemIds, item.id];
      setCollectedItemIds(updated);

      speak(
        'Barnaby (Rabbit)',
        `Great find! ${item.name}! That adds lovely ${colorInfo.name} magic!`,
        undefined,
        'happy'
      );

      // Check if all targets collected
      if (targetItems.every((ti) => updated.includes(ti.id))) {
        setTimeout(() => {
          audioService.playSecretFound();
          setCurrentStage('paint');
          animateNiko('interacting');
          speak(
            'Jessica (Teacher)',
            `Outstanding work! You collected all the ${colorInfo.name} items!`,
            challengeData.stage2Prompt,
            'celebrate'
          );
        }, 800);
      }
    } else {
      // Friendly, encouraging feedback - NEVER a failure sound or harsh red X
      audioService.playGentleEncouragement();
      animateNiko('gentle');
      setGentleFeedback(
        `That’s ${item.name} (${item.spokenHint}). Let's look for something ${colorInfo.name.toLowerCase()} like ${colorInfo.hint.toLowerCase()}`
      );
      speak(
        'Jessica (Teacher)',
        `That is a wonderful ${item.name}!`,
        `We are looking for ${colorInfo.name.toUpperCase()} right now. ${colorInfo.hint}`,
        'gentle'
      );
    }
  };

  // Give hint
  const handleHint = () => {
    audioService.playButton();
    setHintActive(true);
    const uncollected = targetItems.find((i) => !collectedItemIds.includes(i.id));
    if (uncollected) {
      speak(
        'Barnaby (Rabbit)',
        `Psst! Try looking for the ${uncollected.name}!`,
        colorInfo.hint,
        'thinking'
      );
    }
  };

  // Handle painting / restoring the flora
  const handleBrushStroke = () => {
    audioService.playSparkle();
    animateNiko('interacting');
    const next = Math.min(100, paintedRatio + 34);
    setPaintedRatio(next);

    if (next >= 100) {
      audioService.playColorRestore();
      animateNiko('celebrating');

      // Confetti celebration if not in sensory calm mode
      if (!accessibility.sensoryCalmMode) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: [colorInfo.hex, '#fbbf24', '#34d399', '#f472b6'],
        });
      }

      addPoints(100, `Restored ${colorInfo.name} to the Forest!`);
      restoreColor(activeColorChallenge);
      setCurrentStage('celebrate');
    }
  };

  // Replay voice
  const replayPrompt = () => {
    speak(
      'Jessica (Teacher)',
      currentStage === 'identify' ? challengeData.stage1Prompt : challengeData.stage2Prompt,
      colorInfo.hint,
      'happy'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border-4 border-amber-300 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-md"
              style={{ backgroundColor: colorInfo.hex }}
            >
              {colorInfo.symbol}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg sm:text-xl text-amber-950">
                  {challengeData.stationTitle}
                </h3>
                <span
                  className="text-xs font-black px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: colorInfo.hex }}
                >
                  {colorInfo.name}
                </span>
              </div>
              <p className="text-xs font-bold text-amber-800">{colorInfo.stationName}</p>
            </div>
          </div>

          <button
            onClick={closeColorChallenge}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            aria-label="Close activity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STAGE 1: COLOR IDENTIFICATION */}
        {currentStage === 'identify' && (
          <div>
            {/* Instruction Card */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 sm:p-4 mb-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-black text-base sm:text-lg text-amber-950 leading-snug">
                  {challengeData.stage1Prompt}
                </p>
                <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
                  Target: Find 3 {colorInfo.name.toUpperCase()} objects • Collected:{' '}
                  {collectedItemIds.length}/{targetItems.length}
                </p>
              </div>

              <NikoCharacter
                size="avatar"
                focus="face"
                pose={nikoPose}
                decorative
                className="shrink-0 rounded-xl overflow-hidden border-2 border-amber-200 bg-teal-50"
              />

              <button
                onClick={replayPrompt}
                className="w-8 h-8 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center shrink-0 cursor-pointer"
                title="Read prompt again"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Gentle Feedback Message if an item was tried */}
            {gentleFeedback && (
              <div className="bg-pink-50 border-2 border-pink-200 rounded-xl p-2.5 mb-3 flex items-center gap-2 text-xs sm:text-sm font-bold text-pink-900 animate-gentle-pulse">
                <NikoCharacter
                  size="icon"
                  focus="face"
                  pose="gentle"
                  decorative
                  className="shrink-0 rounded-lg overflow-hidden border border-pink-200 bg-teal-50"
                />
                <Heart className="w-4 h-4 text-pink-500 shrink-0" />
                <span>{gentleFeedback}</span>
              </div>
            )}

            {/* Interactive Item Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {challengeData.stage1Items.map((item) => {
                const isCollected = collectedItemIds.includes(item.id);
                const isHintTarget = hintActive && item.isTarget && !isCollected;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`relative p-3 sm:p-4 rounded-2xl border-3 text-left transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                      isCollected
                        ? 'bg-emerald-50 border-emerald-400 opacity-90 scale-95 shadow-inner'
                        : isHintTarget
                        ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105'
                        : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 shadow-md hover:scale-102 active:scale-95'
                    }`}
                  >
                    {/* Item Emoji / Illustration */}
                    <div className="text-4xl sm:text-5xl mb-1.5">{item.emoji}</div>

                    {/* Item Name */}
                    <div className="font-black text-xs sm:text-sm text-slate-800 leading-tight">
                      {item.name}
                    </div>

                    {/* Accessible Symbol */}
                    {accessibility.colorBlindSymbols && (
                      <span className="mt-1 text-[11px] font-black text-slate-500">
                        {item.shapeSymbol}
                      </span>
                    )}

                    {/* Checkmark badge if collected */}
                    {isCollected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Helpers */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleHint}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-extrabold text-xs sm:text-sm px-3.5 py-2 rounded-2xl flex items-center gap-1.5 cursor-pointer transition shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-amber-700" />
                <span>Ask Barnaby for a Hint</span>
              </button>

              <div className="text-xs sm:text-sm font-extrabold text-amber-900">
                Unlimited retries • Take your time!
              </div>
            </div>
          </div>
        )}

        {/* STAGE 2: MAGIC PAINTBRUSH RESTORATION */}
        {currentStage === 'paint' && (
          <div className="text-center py-2">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-4">
              <h4 className="font-black text-lg text-amber-950 mb-1">
                Magic Paintbrush Ready!
              </h4>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                {challengeData.stage2Prompt}
              </p>
            </div>

            {/* Mixing preview for purple and orange */}
            {challengeData.mixingColors && (
              <div className="flex items-center justify-center gap-3 mb-4 bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <span className="text-xs font-black text-purple-900">Color Mixing Formula:</span>
                <div
                  className="w-6 h-6 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: challengeData.mixingColors.from1 }}
                />
                <span className="font-black text-purple-800">+</span>
                <div
                  className="w-6 h-6 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: challengeData.mixingColors.from2 }}
                />
                <span className="font-black text-purple-800">=</span>
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: challengeData.mixingColors.result }}
                />
              </div>
            )}

            {/* Interactive Paint Palette Canvas Area */}
            <div
              onClick={handleBrushStroke}
              className="group relative w-full h-44 sm:h-52 rounded-2xl border-4 border-amber-300 shadow-xl overflow-hidden cursor-pointer flex flex-col items-center justify-center select-none"
              style={{
                backgroundColor: colorInfo.lightHex,
              }}
            >
              {/* Desaturated / Blooming Flower Preview */}
              <div className="relative text-center">
                <div
                  className="text-6xl sm:text-7xl mb-2 transition-transform group-hover:scale-110"
                  style={{
                    filter: `saturate(${Math.max(20, paintedRatio)}%)`,
                  }}
                >
                  🌸
                </div>
                <div className="font-black text-base sm:text-lg text-amber-950">
                  {colorInfo.floraName}
                </div>
                <div className="text-xs font-bold text-amber-800">
                  Color Restored: {paintedRatio}%
                </div>
              </div>

              {/* Progress fill bar on bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/10">
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${paintedRatio}%`, backgroundColor: colorInfo.hex }}
                />
              </div>

              <NikoCharacter
                size="small"
                pose="interacting"
                facing="left"
                decorative
                className="absolute right-2 bottom-4 z-10 h-24 w-12"
              />

              {/* Tap to brush instruction badge */}
              <div className="absolute top-3 bg-white/90 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-md border border-amber-200 flex items-center gap-1.5 animate-gentle-pulse">
                <Palette className="w-3.5 h-3.5 text-amber-600" />
                <span>Tap or Click to Paint with Barnaby!</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-500 mt-3">
              Tap anywhere on the painting canvas to swirl the magic color onto the flowers!
            </p>
          </div>
        )}

        {/* STAGE 3: CELEBRATION & FUN FACT */}
        {currentStage === 'celebrate' && (
          <div className="text-center py-3">
            <NikoCharacter size="modal" pose="celebrating" decorative className="mx-auto mb-2" />
            <div
              className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-3 shadow-lg text-white"
              style={{ backgroundColor: colorInfo.hex }}
            >
              {colorInfo.symbol}
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
              ★ +100 Adventure Points Earned! ★
            </span>

            <h4 className="text-2xl font-black text-amber-950 mt-2 mb-1">
              {colorInfo.name} Restored to the Forest!
            </h4>

            <p className="text-sm font-bold text-amber-900 max-w-md mx-auto mb-4 leading-relaxed">
              {challengeData.jessicaVoiceNote}
            </p>

            {/* Educational Fun Fact Card */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 text-left max-w-lg mx-auto mb-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🌿</span>
                <span className="font-black text-xs uppercase tracking-wider text-amber-800">
                  Forest Explorer Fun Fact
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                {challengeData.funFact}
              </p>
            </div>

            {/* Return Button */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={closeColorChallenge}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Return to Forest Exploration</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
