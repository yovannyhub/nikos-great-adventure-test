import React from 'react';
import { useGame } from '../../context/GameContext';
import { Compass, Map, TreePine, Award, Settings, Volume2, VolumeX, Music } from 'lucide-react';
import { audioService } from '../../services/audioService';
import { NikoCharacter } from '../characters/NikoCharacter';

export const AdventureHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    progress,
    audioSettings,
    toggleMasterMute,
    toggleMusic,
    setIsSettingsOpen,
    setIsProgressModalOpen,
  } = useGame();

  const handleNav = (view: 'home' | 'level1' | 'worldmap' | 'progress') => {
    audioService.playButton();
    if (view === 'progress') {
      setIsProgressModalOpen(true);
    } else {
      setCurrentView(view);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-4 border-amber-200 px-3 md:px-6 py-2.5 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Title */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <NikoCharacter
            size="icon"
            focus="face"
            decorative
            className="rounded-2xl bg-gradient-to-br from-amber-100 to-teal-100 border-2 border-amber-300 shadow-md overflow-hidden group-hover:scale-105 transition"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg md:text-xl tracking-tight text-amber-900 group-hover:text-amber-700 transition">
                Niko's Great Adventure
              </span>
              <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-bold">
                Level 1
              </span>
            </div>
            <p className="text-[11px] md:text-xs text-amber-700 font-semibold hidden md:block">
              Educational Explorer for Kids Ages 3–9
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 md:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-2.5 md:px-4 py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              currentView === 'home'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-amber-100/70 text-amber-900 hover:bg-amber-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('level1')}
            className={`px-2.5 md:px-4 py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              currentView === 'level1'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-100/80 text-emerald-900 hover:bg-emerald-200'
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span className="hidden sm:inline">Level 1:</span> Forest
          </button>

          <button
            onClick={() => handleNav('worldmap')}
            className={`px-2.5 md:px-4 py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition cursor-pointer ${
              currentView === 'worldmap'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-sky-100/80 text-sky-900 hover:bg-sky-200'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>World Map</span>
          </button>

          <button
            onClick={() => handleNav('progress')}
            className="px-2.5 md:px-4 py-2 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 bg-purple-100/80 text-purple-900 hover:bg-purple-200 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">My</span> Progress
          </button>
        </nav>

        {/* Quick Status & Audio Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Points Counter Badge */}
          <div
            onClick={() => setIsProgressModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs md:text-sm px-2.5 md:px-3 py-1.5 rounded-2xl shadow-sm border border-yellow-300 cursor-pointer hover:scale-105 transition"
            title="Adventure Points"
          >
            <span className="text-base">⭐</span>
            <span>{progress.points}</span>
          </div>

          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 hover:bg-amber-200 flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Toggle Adventure Music"
            aria-label="Toggle Adventure Music"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMasterMute}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center transition cursor-pointer shadow-sm ${
              audioSettings.masterMuted
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
            }`}
            title={audioSettings.masterMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label="Mute or Unmute"
          >
            {audioSettings.masterMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          {/* Settings & Accessibility */}
          <button
            onClick={() => {
              audioService.playButton();
              setIsSettingsOpen(true);
            }}
            className="w-9 h-9 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition cursor-pointer shadow-sm"
            title="Sound & Accessibility Settings"
            aria-label="Sound & Accessibility Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
