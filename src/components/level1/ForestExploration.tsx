import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { FOREST_COLORS } from '../../data/colorsData';
import { ColorKey } from '../../types/game';
import { audioService } from '../../services/audioService';
import { NikoCharacter, NikoFacing } from '../characters/NikoCharacter';
import {
  Sparkles,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Compass,
  CheckCircle,
  Home,
  Map as MapIcon,
} from 'lucide-react';

export const ForestExploration: React.FC = () => {
  const {
    progress,
    secrets,
    discoverSecret,
    openColorChallenge,
    setCurrentView,
    speak,
    accessibility,
  } = useGame();

  // Niko's position (percentage 0 to 100 on the map)
  const [nikoPos, setNikoPos] = useState<{ x: number; y: number }>({ x: 50, y: 52 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(null);
  const [isWalking, setIsWalking] = useState(false);
  const [facing, setFacing] = useState<NikoFacing>('forward');
  const [activeNearbyColor, setActiveNearbyColor] = useState<ColorKey | null>(null);
  const [activeNearbySecret, setActiveNearbySecret] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const stepAudioCounter = useRef<number>(0);
  const manualWalkTimer = useRef<number | null>(null);
  const manualWalking = useRef(false);

  const markManualStep = (direction: NikoFacing) => {
    setFacing(direction);
    setTargetPos(null);
    manualWalking.current = true;
    setIsWalking(true);
    if (manualWalkTimer.current !== null) window.clearTimeout(manualWalkTimer.current);
    manualWalkTimer.current = window.setTimeout(() => {
      manualWalking.current = false;
      setIsWalking(false);
    }, 280);
  };

  // Proximity check function
  const checkProximity = useCallback(
    (current: { x: number; y: number }) => {
      // Check color stations
      let foundColor: ColorKey | null = null;
      for (const [key, info] of Object.entries(FOREST_COLORS)) {
        const dx = current.x - info.location.x;
        const dy = current.y - info.location.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 14) {
          foundColor = key as ColorKey;
          break;
        }
      }
      setActiveNearbyColor(foundColor);

      // Check secrets
      let foundSecret: string | null = null;
      for (const secret of secrets) {
        const dx = current.x - secret.x;
        const dy = current.y - secret.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 12) {
          foundSecret = secret.id;
          break;
        }
      }
      setActiveNearbySecret(foundSecret);
    },
    [secrets]
  );

  // Smooth walking loop towards targetPos
  useEffect(() => {
    if (!targetPos) {
      if (!manualWalking.current) setIsWalking(false);
      return;
    }

    manualWalking.current = false;
    if (manualWalkTimer.current !== null) window.clearTimeout(manualWalkTimer.current);
    setIsWalking(true);
    const interval = window.setInterval(() => {
      setNikoPos((prev) => {
        const dx = targetPos.x - prev.x;
        const dy = targetPos.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1.5) {
          clearInterval(interval);
          setTargetPos(null);
          setIsWalking(false);
          checkProximity(targetPos);
          return targetPos;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
          setFacing(dx < 0 ? 'left' : 'right');
        } else {
          setFacing(dy < 0 ? 'backward' : 'forward');
        }

        // Footstep sound throttled
        stepAudioCounter.current++;
        if (stepAudioCounter.current % 5 === 0) {
          audioService.playFootstep();
        }

        const speed = 1.4;
        const stepX = (dx / dist) * speed;
        const stepY = (dy / dist) * speed;

        const next = {
          x: Math.max(10, Math.min(90, prev.x + stepX)),
          y: Math.max(28, Math.min(72, prev.y + stepY)),
        };

        checkProximity(next);
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [targetPos, checkProximity]);

  // Keyboard navigation (WASD & Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        const direction: NikoFacing =
          e.key === 'ArrowLeft' || e.key === 'a'
            ? 'left'
            : e.key === 'ArrowRight' || e.key === 'd'
              ? 'right'
              : e.key === 'ArrowUp' || e.key === 'w'
                ? 'backward'
                : 'forward';
        markManualStep(direction);
        const step = 4;
        setNikoPos((prev) => {
          let nextX = prev.x;
          let nextY = prev.y;

          if (e.key === 'ArrowUp' || e.key === 'w') nextY -= step;
          if (e.key === 'ArrowDown' || e.key === 's') nextY += step;
          if (e.key === 'ArrowLeft' || e.key === 'a') nextX -= step;
          if (e.key === 'ArrowRight' || e.key === 'd') nextX += step;

          nextX = Math.max(10, Math.min(90, nextX));
          nextY = Math.max(28, Math.min(72, nextY));

          audioService.playFootstep();
          const next = { x: nextX, y: nextY };
          checkProximity(next);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (manualWalkTimer.current !== null) window.clearTimeout(manualWalkTimer.current);
    };
  }, [checkProximity]);

  // Tap-to-move handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(10, Math.min(90, clickX));
    const clampedY = Math.max(28, Math.min(72, clickY));

    audioService.playFootstep();
    setTargetPos({ x: clampedX, y: clampedY });
  };

  // D-Pad move helper
  const handleDpadMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    markManualStep(
      direction === 'up' ? 'backward' : direction === 'down' ? 'forward' : direction,
    );
    const step = 6;
    setNikoPos((prev) => {
      let nextX = prev.x;
      let nextY = prev.y;

      if (direction === 'up') nextY -= step;
      if (direction === 'down') nextY += step;
      if (direction === 'left') nextX -= step;
      if (direction === 'right') nextX += step;

      nextX = Math.max(10, Math.min(90, nextX));
      nextY = Math.max(28, Math.min(72, nextY));

      audioService.playFootstep();
      const next = { x: nextX, y: nextY };
      checkProximity(next);
      return next;
    });
  };

  // Auto-assist: walk to the nearest unrestored station
  const handleAutoAssist = () => {
    audioService.playButton();
    const unrestored = (['red', 'blue', 'yellow', 'green', 'purple', 'orange'] as ColorKey[]).find(
      (c) => !progress.restoredColors.includes(c)
    );

    if (unrestored) {
      const loc = FOREST_COLORS[unrestored].location;
      setTargetPos({ x: loc.x, y: Math.max(28, Math.min(72, loc.y + 8)) });
      speak(
        'Barnaby (Rabbit)',
        `Follow me! Let's head over to ${FOREST_COLORS[unrestored].stationName} to restore ${FOREST_COLORS[unrestored].name}!`,
        'Walking over to the magical station...',
        'happy'
      );
    } else {
      speak(
        'Barnaby (Rabbit)',
        'Incredible! All six colors of the forest are completely restored! Take a look around at the shining rainbow trees!',
        'You can tap any station to replay or practice!',
        'celebrate'
      );
    }
  };

  // Ask for hint
  const handleAskBarnaby = () => {
    audioService.playButton();
    const nextUnrestored = (['red', 'blue', 'yellow', 'green', 'purple', 'orange'] as ColorKey[]).find(
      (c) => !progress.restoredColors.includes(c)
    );

    if (nextUnrestored) {
      const info = FOREST_COLORS[nextUnrestored];
      speak(
        'Barnaby (Rabbit)',
        `Let’s look for ${info.stationName}! It needs bright ${info.name}!`,
        info.hint,
        'thinking'
      );
    } else {
      speak(
        'Jessica (Teacher)',
        'Every single color has returned to the forest! Look at the lovely rainbow light shining through the canopy!',
        'Tap on the World Map to view your next adventures!',
        'celebrate'
      );
    }
  };

  const restoredCount = progress.restoredColors.length;

  return (
    <div className="min-h-screen bg-emerald-950/20 pb-20 select-none">
      {/* Exploration HUD Bar */}
      <div className="bg-white/95 backdrop-blur-md border-b-3 border-emerald-300 px-4 py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Mission Objective */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-xl shrink-0">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm md:text-base text-emerald-950">
                  Level 1: The Forest of Lost Colors
                </span>
                <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {restoredCount}/6 Restored
                </span>
              </div>
              <p className="text-xs font-bold text-emerald-800/80 hidden sm:block">
                Guide Niko to each magical station to bring colors back to life!
              </p>
            </div>
          </div>

          {/* Quick Actions & Helpers */}
          <div className="flex items-center gap-2">
            {/* Auto-Assist Guidance Button (for ages 3-4) */}
            <button
              onClick={handleAutoAssist}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-extrabold text-xs md:text-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Help Niko walk to next quest"
            >
              <Compass className="w-4 h-4 text-amber-700" />
              <span>Guide Niko</span>
            </button>

            {/* Hint Button */}
            <button
              onClick={handleAskBarnaby}
              className="bg-purple-100 hover:bg-purple-200 text-purple-900 border-2 border-purple-300 font-extrabold text-xs md:text-sm px-3 py-1.5 rounded-2xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
              title="Ask Barnaby for a hint"
            >
              <HelpCircle className="w-4 h-4 text-purple-700" />
              <span>Ask Barnaby</span>
            </button>

            {/* Return to Map or Home */}
            <button
              onClick={() => {
                audioService.playButton();
                setCurrentView('worldmap');
              }}
              className="bg-sky-100 hover:bg-sky-200 text-sky-900 border-2 border-sky-300 font-extrabold text-xs md:text-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1 transition cursor-pointer"
              title="World Map"
            >
              <MapIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                audioService.playButton();
                setCurrentView('home');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 font-extrabold text-xs md:text-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1 transition cursor-pointer"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Stage */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-4">
        {/* Interactive Exploration Map Container */}
        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden border-4 border-amber-300 shadow-2xl cursor-pointer select-none bg-emerald-900"
          style={{
            backgroundImage: `url('${import.meta.env.BASE_URL}images/forest-background.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle magical mist overlay on unrestored areas */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              restoredCount >= 6 ? 'opacity-0' : 'opacity-20 bg-slate-400 mix-blend-saturation'
            }`}
          />

          {/* Floating magical sparkles */}
          {!accessibility.sensoryCalmMode && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300 rounded-full blur-[1px] animate-ping opacity-60" />
              <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-pink-300 rounded-full blur-[1px] animate-ping opacity-50" />
              <div className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-cyan-300 rounded-full blur-[1px] animate-ping opacity-70" />
            </div>
          )}

          {/* COLOR STATIONS ON MAP */}
          {(Object.entries(FOREST_COLORS) as [ColorKey, typeof FOREST_COLORS[ColorKey]][]).map(
            ([cKey, colorInfo]) => {
              const isRestored = progress.restoredColors.includes(cKey);
              const isNearby = activeNearbyColor === cKey;

              return (
                <div
                  key={cKey}
                  style={{ left: `${colorInfo.location.x}%`, top: `${colorInfo.location.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioService.playButton();
                    openColorChallenge(cKey);
                  }}
                >
                  {/* Station Marker */}
                  <div className="relative group cursor-pointer flex flex-col items-center">
                    {/* Glowing pulse ring if unrestored */}
                    {!isRestored && !accessibility.sensoryCalmMode && (
                      <div
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: colorInfo.hex }}
                      />
                    )}

                    {/* Main Station Icon Bubble */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-3 shadow-xl transition-all ${
                        isRestored
                          ? 'border-white scale-100'
                          : 'border-amber-300 scale-110 animate-bounce-subtle'
                      }`}
                      style={{
                        backgroundColor: isRestored ? colorInfo.hex : 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {isRestored ? (
                        <div className="text-white flex flex-col items-center">
                          <CheckCircle className="w-6 h-6" />
                          <span className="text-[10px] font-black">{colorInfo.symbol}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Sparkles className="w-6 h-6" style={{ color: colorInfo.hex }} />
                          <span className="text-[10px] font-black" style={{ color: colorInfo.hex }}>
                            {colorInfo.symbol}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Label Pill */}
                    <div
                      className={`mt-1 text-[11px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border ${
                        isRestored
                          ? 'bg-white/95 text-slate-800 border-slate-200'
                          : 'bg-amber-400 text-amber-950 border-white'
                      }`}
                    >
                      {colorInfo.name}
                    </div>

                    {/* Nearby Proximity Action Popup */}
                    {isNearby && (
                      <div className="absolute -top-12 sm:-top-14 bg-white text-slate-900 font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-2xl border-3 border-amber-400 animate-gentle-pulse flex items-center gap-1.5 whitespace-nowrap z-20">
                        <span>🎨</span>
                        <span>Tap to {isRestored ? 'Play' : 'Restore'}!</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          )}

          {/* INTERACTIVE FOREST SECRETS */}
          {secrets.map((secret) => {
            const isNearby = activeNearbySecret === secret.id;
            return (
              <div
                key={secret.id}
                style={{ left: `${secret.x}%`, top: `${secret.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  discoverSecret(secret.id);
                }}
              >
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-xl sm:text-2xl border-2 transition-all shadow-md ${
                    secret.found
                      ? 'bg-amber-100/90 border-amber-300'
                      : 'bg-white/90 border-amber-400 hover:scale-110 animate-bounce-subtle'
                  }`}
                  title={secret.name}
                >
                  {secret.icon}
                </div>

                {isNearby && !secret.found && (
                  <div className="absolute -top-8 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-xl shadow-lg whitespace-nowrap">
                    Tap Secret! ✨
                  </div>
                )}
              </div>
            );
          })}

          {/* BARNABY THE RABBIT COMPANION ON MAP */}
          <div
            style={{
              left: `${activeNearbyColor ? FOREST_COLORS[activeNearbyColor].location.x + 5 : 56}%`,
              top: `${activeNearbyColor ? FOREST_COLORS[activeNearbyColor].location.y + 4 : 54}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 pointer-events-none"
          >
            <div className="relative flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-amber-300 shadow-lg bg-amber-100">
                <img
                  src={`${import.meta.env.BASE_URL}images/barnaby.png`}
                  alt="Barnaby Rabbit"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="text-[10px] font-black bg-white/90 text-amber-900 px-1.5 py-0.2 rounded-full shadow-sm">
                Barnaby 🐰
              </div>
            </div>
          </div>

          {/* NIKO: THE CONTROLLABLE MAIN CHARACTER */}
          <div
            style={{ left: `${nikoPos.x}%`, top: `${nikoPos.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-75 pointer-events-none"
          >
            <NikoCharacter
              size="game"
              pose={isWalking ? 'walking' : 'idle'}
              facing={facing}
              alt={`Niko, the young explorer ${isWalking ? 'walking' : 'standing'} in the forest`}
              style={{ '--niko-depth': (0.84 + ((nikoPos.y - 12) / 76) * 0.24).toFixed(2) } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Proximity Action Prompt Bar (below map if near a station) */}
        {activeNearbyColor && (
          <div className="mt-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-2xl p-3 shadow-lg border-2 border-white flex items-center justify-between gap-3 animate-gentle-pulse">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎨</span>
              <div>
                <span className="font-black text-amber-950 text-sm sm:text-base">
                  You are at {FOREST_COLORS[activeNearbyColor].stationName}!
                </span>
                <p className="text-xs font-bold text-amber-900">
                  Ready to restore {FOREST_COLORS[activeNearbyColor].name}?
                </p>
              </div>
            </div>
            <button
              onClick={() => openColorChallenge(activeNearbyColor)}
              className="bg-white hover:bg-amber-50 text-amber-950 font-black text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md cursor-pointer border-2 border-amber-300 transition"
            >
              Start Activity!
            </button>
          </div>
        )}

        {/* Touch D-Pad Controls for tablets and phones */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90 backdrop-blur-sm border-2 border-amber-200 rounded-3xl p-3 sm:p-4 shadow-md">
          {/* Controls instructions */}
          <div className="text-xs sm:text-sm font-bold text-amber-900 text-center sm:text-left">
            <span className="font-extrabold text-amber-950">How to Move:</span> Tap anywhere on the
            forest, use Arrow keys / WASD, or tap the D-Pad buttons below!
          </div>

          {/* D-Pad Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDpadMove('left')}
              className="w-11 h-11 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-900 font-black flex items-center justify-center shadow-md cursor-pointer transition"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleDpadMove('up')}
                className="w-11 h-11 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-900 font-black flex items-center justify-center shadow-md cursor-pointer transition"
                aria-label="Move Up"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDpadMove('down')}
                className="w-11 h-11 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-900 font-black flex items-center justify-center shadow-md cursor-pointer transition"
                aria-label="Move Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => handleDpadMove('right')}
              className="w-11 h-11 rounded-2xl bg-amber-200 hover:bg-amber-300 active:scale-95 text-amber-900 font-black flex items-center justify-center shadow-md cursor-pointer transition"
              aria-label="Move Right"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
