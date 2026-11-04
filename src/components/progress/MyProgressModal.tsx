import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { FOREST_COLORS } from '../../data/colorsData';
import { ColorKey } from '../../types/game';
import { audioService } from '../../services/audioService';
import { X, Sparkles, Printer, RotateCcw, AlertTriangle } from 'lucide-react';
import { NikoCharacter } from '../characters/NikoCharacter';

export const MyProgressModal: React.FC = () => {
  const {
    isProgressModalOpen,
    setIsProgressModalOpen,
    progress,
    secrets,
    resetProgress,
    accessibility,
  } = useGame();

  const [confirmReset, setConfirmReset] = useState(false);

  if (!isProgressModalOpen) return null;

  const handlePrint = () => {
    audioService.playButton();
    window.print();
  };

  const handleReset = () => {
    audioService.playButton();
    resetProgress();
    setConfirmReset(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border-4 border-amber-300 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border-2 border-purple-300 text-purple-700 flex items-center justify-center text-2xl shadow-sm">
              <NikoCharacter size="icon" focus="face" decorative className="rounded-xl overflow-hidden" />
            </div>
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-slate-900">
                My Explorer Progress
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Saved locally on this device • Zero accounts or data collection
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProgressModalOpen(false)}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-3 text-center">
            <div className="text-xs font-black text-amber-800 uppercase tracking-wider">Points</div>
            <div className="text-2xl font-black text-amber-600 mt-1">⭐ {progress.points}</div>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-3 text-center">
            <div className="text-xs font-black text-emerald-800 uppercase tracking-wider">
              Colors Restored
            </div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {progress.restoredColors.length} / 6
            </div>
          </div>

          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3 text-center">
            <div className="text-xs font-black text-sky-800 uppercase tracking-wider">
              Worlds Unlocked
            </div>
            <div className="text-2xl font-black text-sky-600 mt-1">
              {progress.level1Completed ? '1 + Previews' : '1 (Level 1)'}
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-3 text-center">
            <div className="text-xs font-black text-purple-800 uppercase tracking-wider">
              Badges Earned
            </div>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {progress.badges.length}
            </div>
          </div>
        </div>

        {/* Restored Color Spectrum Grid */}
        <div className="mb-6">
          <h4 className="font-black text-sm text-slate-800 mb-2.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Level 1 Color Spectrum Collection</span>
          </h4>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {(['red', 'blue', 'yellow', 'green', 'purple', 'orange'] as ColorKey[]).map((cKey) => {
              const isRestored = progress.restoredColors.includes(cKey);
              const info = FOREST_COLORS[cKey];

              return (
                <div
                  key={cKey}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    isRestored
                      ? 'border-slate-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                  style={{
                    backgroundColor: isRestored ? info.lightHex : undefined,
                  }}
                >
                  <div
                    className="w-8 h-8 mx-auto rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm mb-1"
                    style={{
                      backgroundColor: isRestored ? info.hex : '#94a3b8',
                    }}
                  >
                    {accessibility.colorBlindSymbols ? info.symbol : isRestored ? '✓' : '?'}
                  </div>
                  <div className="font-black text-xs text-slate-800">{info.name}</div>
                  <div className="text-[10px] font-bold text-slate-500">
                    {isRestored ? 'Restored!' : 'Pending'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Forest Secrets Discovered */}
        <div className="mb-6">
          <h4 className="font-black text-sm text-slate-800 mb-2 flex items-center gap-2">
            <span>🌿</span>
            <span>Forest Secrets Discovered ({progress.discoveredSecrets.length}/{secrets.length})</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
            {secrets.map((sec) => (
              <div
                key={sec.id}
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                  sec.found
                    ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <span className="text-xl">{sec.icon}</span>
                <div>
                  <div className="font-black">{sec.name}</div>
                  <div className="text-[10px]">
                    {sec.found ? `+${sec.points} pts discovered!` : 'Hidden in the forest'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges List */}
        <div className="mb-6">
          <h4 className="font-black text-sm text-slate-800 mb-2 flex items-center gap-2">
            <span>🏅</span>
            <span>Explorer Badges</span>
          </h4>

          <div className="flex flex-wrap gap-2">
            {progress.badges.map((badge, idx) => (
              <span
                key={idx}
                className="bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full text-xs font-black shadow-xs flex items-center gap-1.5"
              >
                <span>⭐</span>
                <span>{badge}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center gap-1.5 cursor-pointer transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Explorer Passport</span>
            </button>
          </div>

          <div>
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Progress (Parents/Teachers)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-rose-50 p-2 rounded-xl border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-rose-900">Confirm reset?</span>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 rounded-lg bg-rose-600 text-white font-black text-xs cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
