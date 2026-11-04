import React from 'react';
import { useGame } from '../../context/GameContext';
import { audioService } from '../../services/audioService';
import {
  X,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Shield,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    audioSettings,
    updateAudioSettings,
    accessibility,
    updateAccessibility,
    speak,
  } = useGame();

  if (!isSettingsOpen) return null;

  const handleTestJessica = () => {
    audioService.playCharacterVoice('Jessica', undefined, 'happy');
    speak(
      'Jessica (Teacher)',
      'Hello young explorer! This is Jessica, testing narration volume!',
      'I am here to guide your journey with encouragement and hints.',
      'happy'
    );
  };

  const handleTestBarnaby = () => {
    audioService.playCharacterVoice('Barnaby', undefined, 'happy');
    speak(
      'Barnaby (Rabbit)',
      'Hop, hop, hooray! This is Barnaby testing my companion voice volume!',
      'Ready to paint the world with rainbow colors!',
      'happy'
    );
  };

  const handleTestSfx = () => {
    audioService.playColorRestore();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border-4 border-amber-300 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-700 flex items-center justify-center text-2xl shadow-sm">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-slate-900">
                Sound & Accessibility Settings
              </h3>
              <p className="text-xs font-bold text-slate-500">
                Independent audio controls & sensory-friendly options
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: INDEPENDENT AUDIO CONTROLS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-black text-sm text-slate-800 flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-600" />
              <span>Independent Audio Channels</span>
            </h4>

            <button
              onClick={() => updateAudioSettings({ masterMuted: !audioSettings.masterMuted })}
              className={`text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 transition cursor-pointer ${
                audioSettings.masterMuted
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {audioSettings.masterMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Sound Active</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
            {/* 1. Narration Volume Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-black text-slate-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>👩‍🏫</span>
                  <span>Teacher Jessica & Companion Narration</span>
                </span>
                <span className="text-amber-800">
                  {Math.round(audioSettings.narrationVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.narrationVolume}
                onChange={(e) => updateAudioSettings({ narrationVolume: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex items-center gap-2 mt-1.5">
                <button
                  onClick={handleTestJessica}
                  className="text-[11px] font-black text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-0.5 rounded-lg cursor-pointer"
                >
                  Test Jessica's Voice
                </button>
                <button
                  onClick={handleTestBarnaby}
                  className="text-[11px] font-black text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg cursor-pointer"
                >
                  Test Barnaby's Voice
                </button>
              </div>
            </div>

            {/* 2. Adventure Music Volume Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-black text-slate-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-sky-600" />
                  <span>Adventure Background Music</span>
                </span>
                <span className="text-sky-800">
                  {Math.round(audioSettings.musicVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.musicVolume}
                onChange={(e) => updateAudioSettings({ musicVolume: parseFloat(e.target.value) })}
                className="w-full accent-sky-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* 3. Sound Effects (SFX) Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-black text-slate-800 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sound Effects & Sparkles (SFX)</span>
                </span>
                <span className="text-emerald-800">
                  {Math.round(audioSettings.sfxVolume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.sfxVolume}
                onChange={(e) => updateAudioSettings({ sfxVolume: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="mt-1">
                <button
                  onClick={handleTestSfx}
                  className="text-[11px] font-black text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-lg cursor-pointer"
                >
                  Test Sparkle Sound
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SENSORY & ACCESSIBILITY OPTIONS */}
        <div className="mb-6">
          <h4 className="font-black text-sm text-slate-800 flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Sensory & Cognitive Accommodations</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-bold">
            {/* Sensory Calm Mode */}
            <div
              onClick={() =>
                updateAccessibility({ sensoryCalmMode: !accessibility.sensoryCalmMode })
              }
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                accessibility.sensoryCalmMode
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="font-black text-slate-900">Sensory Calm Mode</div>
                <div className="text-[10px] text-slate-500">Soft motion & no flashing</div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.sensoryCalmMode}
                onChange={() => {}}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>

            {/* Color-Blind Shapes */}
            <div
              onClick={() =>
                updateAccessibility({ colorBlindSymbols: !accessibility.colorBlindSymbols })
              }
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                accessibility.colorBlindSymbols
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="font-black text-slate-900">Color-Blind Symbols</div>
                <div className="text-[10px] text-slate-500">Show ★ 💧 ☀️ 🍀 💎 🦋</div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.colorBlindSymbols}
                onChange={() => {}}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            {/* High Contrast Mode */}
            <div
              onClick={() =>
                updateAccessibility({ highContrastMode: !accessibility.highContrastMode })
              }
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                accessibility.highContrastMode
                  ? 'bg-sky-50 border-sky-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="font-black text-slate-900">High Contrast Mode</div>
                <div className="text-[10px] text-slate-500">Bold outlines & dark text</div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.highContrastMode}
                onChange={() => {}}
                className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
              />
            </div>

            {/* Dyslexia-Friendly Font Spacing */}
            <div
              onClick={() => updateAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont })}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                accessibility.dyslexiaFont
                  ? 'bg-purple-50 border-purple-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="font-black text-slate-900">Dyslexia Spacing</div>
                <div className="text-[10px] text-slate-500">Wider letter & line spacing</div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.dyslexiaFont}
                onChange={() => {}}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
            </div>

            {/* Subtitles & Captions */}
            <div
              onClick={() => updateAccessibility({ showCaptions: !accessibility.showCaptions })}
              className={`p-3 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                accessibility.showCaptions
                  ? 'bg-teal-50 border-teal-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <div className="font-black text-slate-900">Narration Subtitles</div>
                <div className="text-[10px] text-slate-500">Display speech text boxes</div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.showCaptions}
                onChange={() => {}}
                className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: CONTROLS CHOICES */}
        <div className="mb-4">
          <h4 className="font-black text-sm text-slate-800 flex items-center gap-2 mb-2">
            <Gamepad2 className="w-4 h-4 text-amber-600" />
            <span>Preferred Movement Controls</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
            {(['touch', 'dpad', 'keyboard', 'auto-assist'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => updateAccessibility({ controlsMode: mode })}
                className={`p-2.5 rounded-xl border-2 text-center transition cursor-pointer capitalize ${
                  accessibility.controlsMode === mode
                    ? 'bg-amber-400 text-amber-950 border-white shadow-sm font-black'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50'
                }`}
              >
                {mode === 'dpad'
                  ? 'Touch D-Pad'
                  : mode === 'touch'
                  ? 'Tap-to-Move'
                  : mode === 'keyboard'
                  ? 'Arrows / WASD'
                  : 'Auto-Assist'}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Done Button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-md transition cursor-pointer"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
};
