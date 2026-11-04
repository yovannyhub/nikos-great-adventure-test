import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { audioService } from '../../services/audioService';
import { X, Sparkles, Map, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';
import { NikoCharacter } from '../characters/NikoCharacter';

export const LevelCompleteModal: React.FC = () => {
  const {
    isLevelCompleteModalOpen,
    setIsLevelCompleteModalOpen,
    progress,
    setCurrentView,
    accessibility,
    speak,
  } = useGame();

  useEffect(() => {
    if (isLevelCompleteModalOpen && !accessibility.sensoryCalmMode) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
    }
  }, [isLevelCompleteModalOpen, accessibility.sensoryCalmMode]);

  if (!isLevelCompleteModalOpen) return null;

  const handleGoToWorldMap = () => {
    audioService.playButton();
    setIsLevelCompleteModalOpen(false);
    setCurrentView('worldmap');
    speak(
      'Jessica (Teacher)',
      'Congratulations on saving the Forest of Lost Colors! Take a look at the other nine worlds waiting on the World Map!',
      'You are a true Explorer of Niko’s Realm!',
      'celebrate'
    );
  };

  const handlePrintCertificate = () => {
    audioService.playButton();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-amber-50 via-white to-amber-100 border-4 border-amber-400 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-center my-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsLevelCompleteModalOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Niko celebrates with the same shared character artwork used in gameplay. */}
        <div className="flex items-end justify-center gap-3 mb-4">
          <NikoCharacter size="modal" pose="celebrating" decorative />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl animate-gentle-pulse">
            🏆
          </div>
        </div>

        {/* Badge Banner */}
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>LEVEL 1 COMPLETE: FOREST OF LOST COLORS RESTORED</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
          Hooray! The Forest Shines Bright!
        </h3>

        <p className="text-sm font-bold text-amber-900 max-w-md mx-auto mb-6 leading-relaxed">
          Barnaby’s paintbrush is singing with joy! All six colors have returned to the ancient trees,
          sparkling streams, and blooming meadow flowers.
        </p>

        {/* Printable Explorer Passport Certificate Box */}
        <div className="bg-white border-3 border-amber-300 rounded-2xl p-4 text-left shadow-inner mb-6">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧭</span>
              <div>
                <div className="font-black text-xs text-amber-800 uppercase tracking-wider">
                  Official Explorer Passport
                </div>
                <div className="font-black text-sm text-amber-950">Niko's Great Adventure</div>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Verified Guardian
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-black">
                Adventure Points
              </span>
              <span className="text-base font-black text-amber-600">⭐ {progress.points} Points</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-black">
                Colors Restored
              </span>
              <span className="text-base font-black text-emerald-600">
                6 / 6 Rainbow Spectrum
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-black">
                Companion
              </span>
              <span className="font-black text-slate-800">Barnaby the Rabbit</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-black">
                Next Gateway
              </span>
              <span className="font-black text-purple-700">World 2: Crystal Caverns</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleGoToWorldMap}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Map className="w-4 h-4" />
            <span>View World Map</span>
          </button>

          <button
            onClick={handlePrintCertificate}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border-2 border-amber-300 font-black text-sm shadow-sm transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>

          <button
            onClick={() => {
              audioService.playButton();
              setIsLevelCompleteModalOpen(false);
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition cursor-pointer"
          >
            Keep Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
