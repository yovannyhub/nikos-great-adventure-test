import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { WORLDS_DATA } from '../../data/worldsData';
import { WorldData } from '../../types/game';
import { audioService } from '../../services/audioService';
import { NikoCharacter } from '../characters/NikoCharacter';
import {
  Lock,
  Play,
  Sparkles,
  X,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const WorldMap: React.FC = () => {
  const { setCurrentView, progress, speak } = useGame();
  const [selectedWorld, setSelectedWorld] = useState<WorldData | null>(null);

  const handlePlayLevel1 = () => {
    audioService.playButton();
    audioService.playFanfare();
    speak(
      'Jessica (Teacher)',
      'Traveling into Level 1: The Forest of Lost Colors!',
      'Let’s help Barnaby restore all six magical colors!',
      'happy'
    );
    setCurrentView('level1');
  };

  const handleSelectWorld = (world: WorldData) => {
    audioService.playButton();
    if (world.status === 'playable') {
      handlePlayLevel1();
    } else {
      setSelectedWorld(world);
      speak(
        'Jessica (Teacher)',
        `${world.title} is coming next! Complete Level 1 to earn your explorer pass!`,
        world.learningFocus,
        'thinking'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 pb-28 pt-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-white/90 border-2 border-sky-300 px-4 py-1.5 rounded-full shadow-sm mb-3">
            <Compass className="w-4 h-4 text-sky-600" />
            <span className="text-xs md:text-sm font-black text-sky-900 tracking-wider uppercase">
              10 Connected Realms of Niko's Realm
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            The Great Adventure World Map
          </h2>
          <p className="text-sm md:text-base font-bold text-slate-700 mt-2 leading-relaxed">
            Follow Niko and his animal companions on their epic connected journey. Level 1 is fully
            playable now; explore the sneak-peek previews of worlds 2 through 10!
          </p>
        </div>

        {/* Featured Level 1 Banner Card */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white border-4 border-emerald-300 rounded-3xl p-6 sm:p-8 shadow-2xl mb-10 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black text-emerald-100 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Level 1 • Fully Playable Prototype</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">
                The Forest of Lost Colors
              </h3>
              <p className="text-emerald-50 font-bold text-sm sm:text-base leading-relaxed mb-4">
                Help Barnaby the Rabbit find missing red, blue, yellow, green, purple, and orange to
                wake up the magical fairytale forest with zero harsh failures!
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-extrabold text-emerald-100">
                <span className="bg-black/20 px-3 py-1 rounded-xl">
                  Companion: Barnaby the Rabbit 🐰
                </span>
                <span className="bg-black/20 px-3 py-1 rounded-xl">
                  Progress: {progress.restoredColors.length}/6 Colors
                </span>
                {progress.level1Completed && (
                  <span className="bg-yellow-400 text-amber-950 px-3 py-1 rounded-xl font-black">
                    ★ Completed!
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-end gap-3 shrink-0">
              <NikoCharacter
                size="small"
                pose="idle"
                facing="left"
                decorative
                style={{ width: '56px', height: '100px' }}
              />
              <button
                onClick={handlePlayLevel1}
                className="px-3 sm:px-8 py-3 sm:py-5 rounded-3xl bg-white text-emerald-900 font-black text-sm sm:text-xl shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-2 sm:gap-3 shrink-0"
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-emerald-800 text-emerald-800" />
                <span>{progress.level1Completed ? 'Replay Level 1' : 'Play Level 1 Now'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 10 Worlds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORLDS_DATA.map((world) => {
            const isPlayable = world.status === 'playable';

            return (
              <div
                key={world.id}
                onClick={() => handleSelectWorld(world)}
                className={`group relative rounded-3xl border-4 p-6 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl ${
                  isPlayable
                    ? 'bg-white border-emerald-400 hover:border-emerald-500 scale-102 ring-4 ring-emerald-200'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Top Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 font-black text-xs text-slate-700 flex items-center justify-center border border-slate-200">
                      #{world.id}
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isPlayable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isPlayable ? 'Playable Now' : 'Locked Preview'}
                    </span>
                  </div>

                  <div className="text-2xl">{world.badgeIcon}</div>
                </div>

                {/* World Title & Subtitle */}
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-1 group-hover:text-amber-800 transition">
                    {world.title}
                  </h4>
                  <p className="text-xs font-bold text-amber-700 mb-3">
                    Companion: {world.companion}
                  </p>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed mb-4 line-clamp-3">
                    {world.description}
                  </p>
                </div>

                {/* Learning Focus Chip */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">
                    Learning Focus
                  </div>
                  <div className="text-xs font-black text-slate-800">{world.learningFocus}</div>

                  <div className="mt-4 flex items-center justify-between">
                    {isPlayable ? (
                      <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                        <Play className="w-3.5 h-3.5 fill-emerald-700" />
                        <span>Tap to Play Level 1</span>
                      </span>
                    ) : (
                      <span className="text-xs font-black text-slate-400 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Inspect Preview</span>
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* World Preview Detail Dialog for Locked Worlds */}
      {selectedWorld && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-300 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorld(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-sm">
                {selectedWorld.badgeIcon}
              </div>
              <div>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  World #{selectedWorld.id} • Coming in Full Release
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedWorld.title}
                </h3>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-700 leading-relaxed mb-4">
              {selectedWorld.description}
            </p>

            <div className="space-y-2.5 bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs font-bold text-slate-800 mb-6">
              <div>
                <span className="text-amber-800 font-black">Animal Companion:</span>{' '}
                {selectedWorld.companion} ({selectedWorld.companionRole})
              </div>
              <div>
                <span className="text-amber-800 font-black">Educational Mission:</span>{' '}
                {selectedWorld.learningFocus}
              </div>
              <div>
                <span className="text-amber-800 font-black">Environment Style:</span>{' '}
                {selectedWorld.environmentTheme}
              </div>
              <div>
                <span className="text-amber-800 font-black">Unlock Badge:</span>{' '}
                {selectedWorld.badgeName}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-extrabold text-slate-500">
                Unlock Requirement: Complete Level 1
              </span>
              <button
                onClick={() => {
                  setSelectedWorld(null);
                  handlePlayLevel1();
                }}
                className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md transition cursor-pointer"
              >
                Play Level 1 Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
