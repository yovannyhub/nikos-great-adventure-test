import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { AdventureHeader } from './components/layout/AdventureHeader';
import { AdventureHome } from './components/home/AdventureHome';
import { ForestExploration } from './components/level1/ForestExploration';
import { WorldMap } from './components/worldmap/WorldMap';
import { NarrationBar } from './components/narration/NarrationBar';
import { ColorChallengeModal } from './components/level1/ColorChallengeModal';
import { LevelCompleteModal } from './components/level1/LevelCompleteModal';
import { MyProgressModal } from './components/progress/MyProgressModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { ToastNotification } from './components/common/ToastNotification';
import { ShieldCheck, Heart } from 'lucide-react';

const GameRouter: React.FC = () => {
  const { currentView, accessibility } = useGame();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        accessibility.highContrastMode ? 'bg-amber-100/80' : 'bg-amber-50/60'
      }`}
    >
      {/* Top Header */}
      <AdventureHeader />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentView === 'home' && <AdventureHome />}
        {currentView === 'level1' && <ForestExploration />}
        {currentView === 'worldmap' && <WorldMap />}
      </main>

      {/* Live Narration Bar */}
      <NarrationBar />

      {/* Active Modals & Dialogs */}
      <ColorChallengeModal />
      <LevelCompleteModal />
      <MyProgressModal />
      <SettingsModal />
      <ToastNotification />

      {/* Kid-Safe Accessible Footer */}
      <footer className="bg-amber-100/90 border-t-3 border-amber-300 py-6 px-4 text-center text-xs font-bold text-amber-900">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧭</span>
            <span className="font-black text-sm text-amber-950">
              Niko's Great Adventure
            </span>
            <span className="text-[11px] text-amber-800">
              • Connected 10-World Prototype
            </span>
          </div>

          <div className="flex items-center gap-4 text-amber-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Ages 3–9 Safe</span>
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-pink-600" />
              <span>Sensory & Accessible</span>
            </span>
            <span>Zero Data Collection</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default App;
